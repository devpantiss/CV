export const mediaTypes = {
  'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'], 'image/gif': ['gif'], 'image/avif': ['avif'],
  'video/mp4': ['mp4'], 'video/webm': ['webm'], 'video/quicktime': ['mov'],
  'audio/mpeg': ['mp3'], 'audio/wav': ['wav'], 'audio/x-wav': ['wav'], 'audio/ogg': ['ogg'], 'audio/mp4': ['m4a'], 'audio/x-m4a': ['m4a'], 'audio/webm': ['webm'], 'audio/aac': ['aac'], 'audio/flac': ['flac'],
};
export function validateUpload(file, kind = 'gallery') {
  if (!['gallery', 'team', 'events', 'testimonials', 'partners'].includes(kind)) throw new Error('Unknown content collection.');
  const extension = file.name.split('.').pop().toLowerCase();
  const valid = mediaTypes[file.type]?.includes(extension);
  const profileImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  if (!valid || (kind !== 'gallery' && !profileImage)) throw new Error(kind === 'gallery' ? 'Choose a supported image, video or audio file.' : 'Choose a JPG, PNG or WebP image.');
  const limit = kind !== 'gallery' ? 5 : file.type.startsWith('image/') ? 10 : 50;
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > limit * 1024 * 1024) throw new Error(`This file must be under ${limit} MB.`);
  return { extension, mediaType: file.type.split('/')[0], mimeType: file.type };
}
