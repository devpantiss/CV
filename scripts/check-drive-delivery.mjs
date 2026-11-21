// Upload a disposable test image, verify the deployed proxy, then move it to Trash.
// Credentials and media capability URLs are deliberately never printed.
import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID, createHash } from 'node:crypto';
import { signFile } from '../supabase/functions/_shared/signing.js';
const parse = (source) => Object.fromEntries(source.trim().split('\n').filter((line) => line && !line.startsWith('#')).map((line) => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
const credentials = parse(await readFile('.drive-secrets.local', 'utf8'));
const env = parse(await readFile('.env.local', 'utf8'));
const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jfhoAAAAASUVORK5CYII=', 'base64');
let fileId;
let accessToken;
const checks = {};
try {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: credentials.GOOGLE_CLIENT_ID, client_secret: credentials.GOOGLE_CLIENT_SECRET, refresh_token: credentials.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token' }) });
  if (!tokenResponse.ok) throw new Error('Drive authorization refresh failed.');
  accessToken = (await tokenResponse.json()).access_token;
  const authorization = { Authorization: `Bearer ${accessToken}` };
  const metadata = { name: `gallery-integration-test-${randomUUID()}.png`, mimeType: 'image/png', parents: [credentials.GOOGLE_DRIVE_FOLDER_ID], appProperties: { career_valley_project: new URL(env.VITE_SUPABASE_URL).hostname.split('.')[0], collection: 'gallery', integration_test: 'true' } };
  const init = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', { method: 'POST', headers: { ...authorization, 'Content-Type': 'application/json', 'X-Upload-Content-Type': 'image/png', 'X-Upload-Content-Length': String(bytes.length) }, body: JSON.stringify(metadata) });
  const uploadUrl = init.headers.get('location');
  if (!init.ok || !uploadUrl || new URL(uploadUrl).origin !== 'https://www.googleapis.com') throw new Error('Drive upload initialization failed.');
  const upload = await fetch(uploadUrl, { method: 'PUT', headers: { ...authorization, 'Content-Type': 'image/png' }, body: bytes });
  if (!upload.ok) throw new Error('Drive upload failed.');
  fileId = (await upload.json()).id;
  checks.driveUpload = true;
  const token = await signFile(fileId, credentials.MEDIA_SIGNING_SECRET);
  const url = `${env.VITE_SUPABASE_URL}/functions/v1/drive-media?id=${fileId}&token=${token}`;
  const full = await fetch(url);
  const served = Buffer.from(await full.arrayBuffer());
  checks.mediaGetStatus = full.status;
  checks.imageMimeType = full.headers.get('content-type')?.startsWith('image/png');
  checks.bytesMatch = createHash('sha256').update(served).digest('hex') === createHash('sha256').update(bytes).digest('hex');
  const range = await fetch(url, { headers: { Range: 'bytes=0-9' } });
  const ranged = Buffer.from(await range.arrayBuffer());
  checks.rangeStatus = range.status;
  checks.rangeMatches = ranged.equals(bytes.subarray(0, 10));
  checks.contentRange = range.headers.get('content-range');
  const head = await fetch(url, { method: 'HEAD' });
  checks.headStatus = head.status;
  checks.headBodyEmpty = (await head.arrayBuffer()).byteLength === 0;
  const bad = await fetch(url.replace(/token=[a-f0-9]+/, 'token=' + '0'.repeat(64)));
  checks.invalidSignatureStatus = bad.status;
  await bad.body?.cancel();
  if (full.status !== 200 || !checks.bytesMatch || !checks.imageMimeType || range.status !== 206 || !checks.rangeMatches || head.status !== 200 || !checks.headBodyEmpty || bad.status !== 403) throw new Error('One or more deployed media checks failed.');
  checks.passed = true;
} catch (error) {
  checks.passed = false; checks.error = error.message; process.exitCode = 1;
} finally {
  if (fileId && accessToken) {
    const cleanup = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) });
    checks.testFileMovedToTrash = cleanup.ok;
    if (!cleanup.ok) process.exitCode = 1;
  }
  await writeFile('artifacts/integration-checks/drive-delivery.json', JSON.stringify(checks, null, 2) + '\n');
  console.log(JSON.stringify(checks));
}
