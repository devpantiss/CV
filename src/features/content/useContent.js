import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { readContent } from './content';

export default function useContent(kind, fallback = []) {
  const [state, setState] = useState({ items: supabase ? [] : fallback, loading: Boolean(supabase), error: null });
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let controller;
    const load = () => { controller?.abort(); controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 10000); return readContent(kind, false, controller.signal).then((items) => { if (active) setState({ items, loading: false, error: null }); }).catch(() => { if (active) setState({ items: fallback, loading: false, error: fallback.length ? 'Live updates are temporarily unavailable. Showing saved website content.' : 'Content is temporarily unavailable.' }); }).finally(() => clearTimeout(timeout)); };
    load();
    window.addEventListener('focus', load);
    return () => { active = false; controller?.abort(); window.removeEventListener('focus', load); };
  }, [kind]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}
