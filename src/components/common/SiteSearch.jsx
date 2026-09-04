import { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight, FiSearch, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const destinations = [
  { label: 'Career guidance & services', group: 'Guidance', keywords: 'counselling support', to: '/services' },
  { label: 'Talk to a counsellor', group: 'Guidance', keywords: 'contact book call', to: '/contact_us' },
  { label: 'Upcoming education events', group: 'Events', keywords: 'fair open house seminar', to: '/events?tab=Upcoming' },
  { label: 'Undergraduate colleges', group: 'Colleges', keywords: 'ug bachelor city', to: '/colleges/ug' },
  { label: 'Postgraduate colleges', group: 'Colleges', keywords: 'pg master city', to: '/colleges/pg' },
  ...['B.Tech','B.Sc','B.Com','BBA','BCA','BA','MBA','M.Tech','LLB'].map((label) => ({ label: `${label} course guide`, group: 'Courses', keywords: `${label} programme pathway`, to: `/courses/${label.toLowerCase().replaceAll('.', '')}` })),
];

const SiteSearch = ({ compact = false }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const shortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => { setOpen(false); setQuery(''); }, [pathname]);
  useEffect(() => { if (open) requestAnimationFrame(() => inputRef.current?.focus()); }, [open]);
  const results = useMemo(() => destinations.filter((item) => `${item.label} ${item.group} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8), [query]);

  return <><button type="button" onClick={() => setOpen(true)} className={compact ? 'flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-semibold' : 'button button-secondary !min-h-10 !px-3'} aria-label="Search Career Valley"><FiSearch /><span className="hidden xl:inline">Search</span><kbd className="hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-muted)] xl:inline">⌘K</kbd></button>{open && <div className="fixed inset-0 z-[100] bg-[#081c18]/60 p-3 pt-[12vh] backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Search Career Valley" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-white/40 bg-white shadow-[var(--shadow-lg)]"><div className="flex items-center gap-3 border-b border-[var(--color-border)] p-4"><FiSearch className="text-xl text-[var(--color-primary)]" /><input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 border-0 bg-transparent py-2 text-lg outline-none" placeholder="Search courses, colleges or guidance…" aria-label="Search" /><button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-surface-muted)]" aria-label="Close search"><FiX /></button></div><div className="max-h-[55vh] overflow-auto p-3">{results.length ? results.map((item) => <Link key={`${item.label}-${item.to}`} to={item.to} className="group flex items-center justify-between rounded-2xl px-4 py-3 hover:bg-[var(--color-surface-muted)]"><span><small className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">{item.group}</small><strong className="mt-1 block">{item.label}</strong></span><FiArrowRight className="text-[var(--color-primary)] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" /></Link>) : <div className="p-10 text-center"><p className="font-bold">No matching path found.</p><p className="mt-2 text-sm text-[var(--color-muted)]">Try a course name, college or counselling.</p></div>}</div><div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-3 text-xs text-[var(--color-muted)]">Quickly navigate the site—this does not search external college data.</div></div></div>}</>;
};
export default SiteSearch;
