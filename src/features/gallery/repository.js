import { uploadMedia, discardUpload } from '../../lib/mediaStorage';
import { supabase } from '../../lib/supabase';
import { validateGallery, validateMedia, youtubeVideo } from './media';

export async function saveGalleryEntry({ draft, file, preview, existing }) {
  const content = { title: (draft.title || '').trim(), description: (draft.description || '').trim(), mediaType: draft.mediaType, youtubeUrl: (draft.youtubeUrl || '').trim(), url: draft.url || '', mimeType: draft.mimeType || '', image: draft.image || '', driveFileId: draft.driveFileId || '' };
  if (file && content.mediaType !== 'podcast') {
    const { mediaType, mimeType } = validateMedia(file);
    Object.assign(content, { mediaType, mimeType });
  }
  validateGallery(content);
  if (content.mediaType === 'podcast') {
    const video = youtubeVideo(content.youtubeUrl);
    content.youtubeUrl = video.url; content.image = video.thumbnail; content.url = ''; content.mimeType = ''; content.driveFileId = '';
  } else if (!file && !content.url) throw new Error('Please choose a media file.');
  const order = Number(draft.sort_order);
  if (!Number.isInteger(order) || order < 0 || order > 9999) throw new Error('Display order must be between 0 and 9999.');
  let uploaded;
  let blobUrl;
  try {
    if (file && content.mediaType !== 'podcast') {
      if (preview) { blobUrl = URL.createObjectURL(file); content.url = blobUrl; }
      else {
        uploaded = await uploadMedia('gallery', file);
        content.url = uploaded.url;
        content.driveFileId = uploaded.id;
      }
      content.image = content.mediaType === 'image' ? content.url : '';
    }
    const entry = { ...content, published: Boolean(draft.published), sort_order: order, id: draft.id || crypto.randomUUID() };
    if (preview) return (draft.id ? existing.map((row) => row.id === draft.id ? entry : row) : [...existing, entry]).sort((a, b) => a.sort_order - b.sort_order);
    const payload = { kind: 'gallery', content, published: entry.published, sort_order: order };
    const query = draft.id ? supabase.from('site_content').update(payload).eq('id', draft.id) : supabase.from('site_content').insert(payload);
    const { error } = await query.select().single();
    if (error) throw error;
    uploaded = null;
    return null;
  } catch (error) {
    if (uploaded) { try { await discardUpload(uploaded); } catch { /* Retain original save error; unreferenced media can be cleaned up in Drive. */ } }
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    throw error;
  }
}
