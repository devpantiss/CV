import { mediaTypes, validateUpload } from '../../../supabase/functions/_shared/file-policy.js';
export function youtubeVideo(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (host === 'youtu.be') id = url.pathname.split('/')[1];
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) {
      if (url.pathname === '/watch') id = url.searchParams.get('v');
      else if (/^\/(shorts|embed|live)\//.test(url.pathname)) id = url.pathname.split('/')[2];
    }
    if (!/^[A-Za-z0-9_-]{11}$/.test(id || '')) return null;
    return { id, url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  } catch { return null; }
}
export { mediaTypes } from '../../../supabase/functions/_shared/file-policy.js';
export const mediaAccept = Object.keys(mediaTypes).join(',');
export function validateMedia(file) { return validateUpload(file, 'gallery'); }
export function validateGallery(content) {
  if (!content.title?.trim()) throw new Error('A title is required.');
  if (content.title.length > 200 || (content.description || '').length > 5000) throw new Error('Use a title under 200 characters and a description under 5,000 characters.');
  if (!['image', 'video', 'audio', 'podcast'].includes(content.mediaType)) throw new Error('Choose a media type.');
  if (content.mediaType === 'podcast' && !youtubeVideo(content.youtubeUrl)) throw new Error('Enter a valid HTTPS YouTube video link.');
}
