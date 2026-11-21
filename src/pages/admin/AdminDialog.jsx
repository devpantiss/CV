import { useEffect, useRef } from 'react';

export default function AdminDialog({ children, onClose, busy, labelId, className = '', returnFocus }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = returnFocus || document.activeElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; requestAnimationFrame(() => opener?.focus()); };
  }, [returnFocus]);
  return <dialog ref={ref} className={`studio-dialog ${className}`} aria-labelledby={labelId} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !busy) onClose(); }}>{children}</dialog>;
}
