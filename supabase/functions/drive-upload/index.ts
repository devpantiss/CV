import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { validateUpload } from '../_shared/file-policy.js';
import { signFile, validFileId } from '../_shared/signing.js';
import { boundedForm, cors, folderId, googleToken, projectTag, required, trashOwnedFile } from '../_shared/drive.ts';

Deno.serve(async (request: Request) => {
  let headers: Record<string, string> | null;
  try { headers = cors(request); } catch { return Response.json({ error: 'Google Drive media service is not configured.' }, { status: 503 }); }
  if (!headers) return new Response('Origin not allowed', { status: 403 });
  const responseHeaders = headers;
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: responseHeaders });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!['POST', 'DELETE'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  let createdFile: string | null = null;
  let accessToken = '';
  try {
    const authorization = request.headers.get('authorization') || '';
    if (!authorization.startsWith('Bearer ')) return json({ error: 'Please sign in.' }, 401);
    const client = createClient(required('SUPABASE_URL'), required('SUPABASE_ANON_KEY'), { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
    const { data, error: userError } = await client.auth.getUser(authorization.slice(7));
    if (userError || !data.user) return json({ error: 'Your session has expired. Sign in again.' }, 401);
    const { data: isAdmin, error: roleError } = await client.rpc('is_site_admin');
    if (roleError || !isAdmin) return json({ error: 'Administrator access is required.' }, 403);
    // Fail before uploading if the serving key is missing.
    const signingSecret = required('MEDIA_SIGNING_SECRET');
    if (signingSecret.length < 32) return json({ error: 'Media signing is not configured.' }, 503);
    if (request.method === 'DELETE') {
      const { id } = await request.json();
      if (!validFileId(id)) return json({ error: 'Invalid media file.' }, 400);
      accessToken = await googleToken();
      await trashOwnedFile(id, accessToken);
      return json({ removed: true });
    }
    const form = await boundedForm(request);
    const file = form.get('file');
    const kind = String(form.get('kind') || '');
    if (!(file instanceof File)) return json({ error: 'Choose a media file.' }, 400);
    let policy;
    try { policy = validateUpload(file, kind); } catch (error) { return json({ error: error instanceof Error ? error.message : 'Invalid media file.' }, 400); }
    accessToken = await googleToken();
    const metadata = { name: `${kind}-${crypto.randomUUID()}.${policy.extension}`, parents: [folderId()], mimeType: file.type, appProperties: { career_valley_project: projectTag(), collection: kind, uploaded_by: data.user.id } };
    const init = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'X-Upload-Content-Type': file.type, 'X-Upload-Content-Length': String(file.size) }, body: JSON.stringify(metadata) });
    const uploadUrl = init.headers.get('location');
    if (!init.ok || !uploadUrl || new URL(uploadUrl).origin !== 'https://www.googleapis.com') throw new Error('Unable to start the Google Drive upload. Check the connected account and folder.');
    const upload = await fetch(uploadUrl, { method: 'PUT', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': file.type, 'Content-Length': String(file.size) }, body: file.stream() });
    if (!upload.ok) throw new Error('Google Drive upload failed. Please retry.');
    const result = await upload.json();
    if (!validFileId(result.id)) throw new Error('Google Drive returned an invalid file.');
    createdFile = result.id;
    const token = await signFile(result.id, signingSecret);
    const url = `${required('SUPABASE_URL')}/functions/v1/drive-media?id=${encodeURIComponent(result.id)}&token=${token}`;
    createdFile = null;
    return json({ id: result.id, url, mimeType: file.type, mediaType: policy.mediaType });
  } catch (error) {
    if (createdFile && accessToken) { try { await trashOwnedFile(createdFile, accessToken); } catch { /* Original error is more useful. */ } }
    const safe = error instanceof Error && /configured|authorization needs|Upload is too large|Choose a media file|Google Drive upload failed|Unable to start|belong to this website|Media file was not found|Unable to remove/.test(error.message);
    return json({ error: safe ? error.message : 'The media service could not complete this request. Please retry.' }, 502);
  }
});
