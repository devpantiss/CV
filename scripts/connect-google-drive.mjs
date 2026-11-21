// One-time local OAuth setup. Tokens are saved to an ignored file, never printed.
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';

function parseEnv(source) {
  return Object.fromEntries(source.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).map((line) => {
    const separator = line.indexOf('=');
    if (separator < 1) throw new Error('Invalid local configuration. Use KEY=value lines.');
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return [line.slice(0, separator).trim(), value];
  }));
}
const config = parseEnv(await readFile('.google-drive-client.local', 'utf8'));
const project = parseEnv(await readFile('.env.local', 'utf8'));
const clientId = config.GOOGLE_CLIENT_ID;
const clientSecret = config.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) throw new Error('Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .google-drive-client.local first.');
const projectRef = new URL(project.VITE_SUPABASE_URL).hostname.split('.')[0];
const redirectUri = 'http://127.0.0.1:8765/callback';
const state = randomBytes(32).toString('hex');
const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
auth.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'https://www.googleapis.com/auth/drive.file', access_type: 'offline', prompt: 'consent', state }).toString();
let completed = false;
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:8765');
  const incomingState = Buffer.from(url.searchParams.get('state') || '');
  if (url.pathname !== '/callback' || incomingState.length !== state.length || !timingSafeEqual(incomingState, Buffer.from(state)) || completed) { response.writeHead(400); response.end('Invalid connection request.'); return; }
  if (url.searchParams.has('error')) { response.writeHead(400); response.end('Google Drive connection was not approved. You can retry from the original link.'); return; }
  const code = url.searchParams.get('code');
  if (!code) { response.writeHead(400); response.end('Missing authorization code.'); return; }
  completed = true;
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }) });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.refresh_token) throw new Error('Google did not issue an offline token. Check OAuth configuration and retry consent.');
    const headers = { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' };
    const list = new URL('https://www.googleapis.com/drive/v3/files');
    list.search = new URLSearchParams({ q: `mimeType = 'application/vnd.google-apps.folder' and trashed = false and appProperties has { key='career_valley_project' and value='${projectRef}' }`, fields: 'files(id)', pageSize: '1' }).toString();
    const folders = await fetch(list, { headers });
    if (!folders.ok) throw new Error('Enable Google Drive API in your Cloud project, then retry.');
    let folderId = (await folders.json()).files?.[0]?.id;
    if (!folderId) {
      const folder = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', { method: 'POST', headers, body: JSON.stringify({ name: 'Career Valley Media', mimeType: 'application/vnd.google-apps.folder', appProperties: { career_valley_project: projectRef } }) });
      if (!folder.ok) throw new Error('Could not create the Career Valley Media folder.');
      folderId = (await folder.json()).id;
    }
    if (!folderId) throw new Error('Google returned an incomplete folder.');
    // Keep the signing secret on reconnection so existing website URLs stay valid.
    let old = {};
    try { old = parseEnv(await readFile('.drive-secrets.local', 'utf8')); } catch { /* First connection. */ }
    const secrets = { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret, GOOGLE_REFRESH_TOKEN: token.refresh_token, GOOGLE_DRIVE_FOLDER_ID: folderId, MEDIA_SIGNING_SECRET: old.MEDIA_SIGNING_SECRET || randomBytes(48).toString('hex'), ALLOWED_ORIGINS: old.ALLOWED_ORIGINS || 'http://127.0.0.1:5181,http://localhost:5181' };
    if (Object.values(secrets).some((value) => /[\r\n]/.test(value))) throw new Error('Invalid connection settings.');
    await writeFile('.drive-secrets.local', Object.entries(secrets).map(([key, value]) => `${key}=${value}`).join('\n') + '\n', { mode: 0o600 });
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('<h1>Google Drive connected</h1><p>The Career Valley Media folder is ready. You can close this tab. Credentials were saved privately on your computer.</p>');
    console.log('Drive authorization complete. Private deployment secrets saved to .drive-secrets.local.');
    server.close(); clearTimeout(expiry);
  } catch (error) {
    completed = false;
    response.writeHead(500, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    response.end('Connection failed. Check the terminal for setup instructions and restart the script.');
    console.error(error.message);
  }
});
const expiry = setTimeout(() => { server.close(); console.error('Drive connection timed out. Run the script again to retry.'); }, 15 * 60 * 1000);
server.on('error', () => { clearTimeout(expiry); console.error('Cannot start the local callback. Make sure port 8765 is free.'); process.exitCode = 1; });
server.listen(8765, '127.0.0.1', () => { console.log('Open this Google authorization URL in your browser and approve access to app-created Drive files:\n' + auth.href); });
