import { uploadMedia } from '../../lib/mediaStorage';
import { validateImage } from './validation';
export { fields, validateContent } from './validation';
import { supabase } from '../../lib/supabase';

export { isLeadership, isExpert, profileCategory } from './people';
export const imageField = (kind) => kind === 'team' ? 'photo' : 'image';
export const normalize = (row) => ({ ...row.content, id: row.id, _id: row.id, published: row.published, sort_order: row.sort_order, source: 'supabase' });
export async function readContent(kind, admin = false, signal) {
  if (!supabase) throw new Error('Supabase is not configured.');
  let query = supabase.from('site_content').select('*').eq('kind', kind).order('sort_order').order('created_at');
  if (!admin) query = query.eq('published', true);
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(normalize);
}
export async function readEvents(status) {
  const rows = await readContent('events');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return rows.filter((row) => !status || (status.toLowerCase() === 'upcoming' ? new Date(`${row.date}T23:59:59`) >= today : new Date(`${row.date}T23:59:59`) < today));
}
export async function uploadImage(kind, file) {
  validateImage(file);
  return uploadMedia(kind, file);
}
