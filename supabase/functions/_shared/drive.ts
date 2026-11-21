export function required(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error('Google Drive media service is not configured.');
  return value;
}
let cachedToken = '';
let tokenExpires = 0;
export async function googleToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpires) return cachedToken;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: required('GOOGLE_CLIENT_ID'), client_secret: required('GOOGLE_CLIENT_SECRET'), refresh_token: required('GOOGLE_REFRESH_TOKEN'), grant_type: 'refresh_token' }),
  });
  if (!response.ok) throw new Error('Google Drive authorization needs reconnecting.');
  const data = await response.json();
  if (!data.access_token) throw new Error('Google Drive authorization needs reconnecting.');
  cachedToken = data.access_token;
  tokenExpires = Date.now() + Math.max(0, (Number(data.expires_in) - 60)) * 1000;
  return cachedToken;
}
export const projectTag = () => new URL(required('SUPABASE_URL')).hostname.split('.')[0];
export const folderId = () => required('GOOGLE_DRIVE_FOLDER_ID');
export function cors(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = required('ALLOWED_ORIGINS').split(',').map((item) => item.trim());
  if (origin && !allowed.includes(origin)) return null;
  return { 'Access-Control-Allow-Origin': origin || allowed[0], 'Vary': 'Origin', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS', 'Cache-Control': 'no-store' };
}
export async function trashOwnedFile(id: string, accessToken: string) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}?fields=id,parents,appProperties,trashed`, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) throw new Error('Media file was not found.');
  const file = await response.json();
  if (!file.parents?.includes(folderId()) || file.appProperties?.career_valley_project !== projectTag()) throw new Error('This file does not belong to this website.');
  const result = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ trashed: true }) });
  if (!result.ok) throw new Error('Unable to remove the uploaded file.');
}
// Bound multipart parsing even if the client omits Content-Length.
export async function boundedForm(request: Request): Promise<FormData> {
  const max = 51 * 1024 * 1024;
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Choose a media file.');
  let size = 0;
  const chunks: ArrayBuffer[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); throw new Error('Upload is too large.'); }
    chunks.push(value.slice().buffer as ArrayBuffer);
  }
  const body = new Blob(chunks);
  return new Response(body, { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData();
}
