const images = ['https://i.postimg.cc/qvtqJv1S/IMG-0946.jpg', 'https://i.postimg.cc/ZnT04PQx/IMG-1135.jpg', 'https://i.postimg.cc/Bn1ZWw6G/IMG-0895.jpg', 'https://i.postimg.cc/NjVymHyQ/IMG-1269.jpg', 'https://i.postimg.cc/5yny0Ydd/IMG-1133.jpg', 'https://i.postimg.cc/WpX10kKx/IMG-0911.jpg', 'https://i.postimg.cc/P5BxPncx/IMG-0944.jpg', 'https://i.postimg.cc/sDg1Lc7V/IMG-1180.jpg', 'https://i.postimg.cc/CMNzJtZP/IMG-1227.jpg'];
let entries = images.map((url, index) => ({ id: `gallery-preview-${index}`, title: `Career Valley moments ${index + 1}`, description: 'Students and educators coming together at Career Valley.', mediaType: 'image', url, image: url, published: true, sort_order: index }));
const listeners = new Set();
export const getGalleryPreview = () => entries;
export const subscribeGalleryPreview = (callback) => { listeners.add(callback); return () => listeners.delete(callback); };
export function setGalleryPreview(next) {
  const retainedUrls = new Set(next.map((entry) => entry.url));
  for (const entry of entries) if (entry.url?.startsWith('blob:') && !retainedUrls.has(entry.url)) URL.revokeObjectURL(entry.url);
  entries = next;
  listeners.forEach((callback) => callback());
}
