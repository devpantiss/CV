import { useSyncExternalStore } from 'react';
import useContent from '../content/useContent';
import { supabase } from '../../lib/supabase';
import { getGalleryPreview, subscribeGalleryPreview } from './previewStore';
export default function useGallery() {
  const preview = useSyncExternalStore(subscribeGalleryPreview, getGalleryPreview, getGalleryPreview);
  const live = useContent('gallery');
  return supabase ? live : { items: preview.filter((entry) => entry.published), loading: false, error: null };
}
