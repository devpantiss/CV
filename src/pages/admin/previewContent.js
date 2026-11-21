import { partnerDefaults } from '../../features/partners/defaults';
import { getGalleryPreview } from '../../features/gallery/previewStore';
import { teamDefaults, testimonialDefaults } from '../../features/content/defaults';

const records = (items, kind) => items.map((item, index) => ({ ...item, id: `preview-${kind}-${index}`, sort_order: index, published: index !== items.length - 1 }));
export const createPreviewContent = () => ({
  gallery: getGalleryPreview(),
  partners: records(partnerDefaults, 'partners'),
  events: records([
    { title: 'Career Discovery Open House', date: '2026-11-14', time: '10:00 AM – 1:00 PM', location: 'Hyderabad', eventType: 'Open house', desc: 'A morning of conversations, fresh perspectives and practical next steps for students and families.', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' },
    { title: 'The Next Chapter: University Fair', date: '2026-11-21', time: '11:00 AM – 5:00 PM', location: 'Bengaluru', eventType: 'Education fair', desc: 'Meet university representatives and explore programmes that fit your ambitions.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80' },
    { title: 'Finding Your Management Pathway', date: '2026-12-05', time: '4:00 PM – 5:30 PM', location: 'Online session', eventType: 'Expert session', desc: 'An interactive session to help you compare management programmes and plan your next move.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80' },
  ], 'events'),
  team: records(teamDefaults, 'team'),
  testimonials: records(testimonialDefaults, 'testimonials'),
});
export const readPreviewImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error('Unable to preview this image. Please choose another file.'));
  reader.readAsDataURL(file);
});
