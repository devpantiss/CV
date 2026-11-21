import { supabase } from './supabase';

async function invokeDrive(body, method = 'POST') {
  if (!supabase) throw new Error('Connect Supabase before uploading media.');
  const { data, error } = await supabase.functions.invoke('drive-upload', { body, method });
  if (error) {
    let message;
    try { message = (await error.context?.json())?.error; } catch { /* Network/gateway errors have no JSON body. */ }
    throw new Error(message || 'Google Drive uploads are not connected yet. Finish the Drive setup and deploy the media functions.');
  }
  if (data?.error) throw new Error(data.error);
  return data;
}
export async function uploadMedia(kind, file) {
  const body = new FormData();
  body.append('kind', kind); body.append('file', file);
  const data = await invokeDrive(body);
  if (!data?.id || !data?.url) throw new Error('The media service returned an incomplete upload.');
  return { id: data.id, url: data.url, mimeType: data.mimeType, provider: 'google-drive' };
}
export async function discardUpload(upload) {
  if (upload?.id && upload.provider === 'google-drive') await invokeDrive({ id: upload.id }, 'DELETE');
}
