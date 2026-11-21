import { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';

export default function LoginBackground() {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (preference.matches) video.current?.pause();
      else video.current?.play().catch(() => setPlaying(false));
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <>
    <div className="studio-login-backdrop" aria-hidden="true"><video ref={video} muted loop playsInline preload="metadata" poster="/media/admin/login-background.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }}><source src="/media/admin/login-background.mp4" type="video/mp4" /></video></div>
    {!failed && <button type="button" className="studio-login-motion" onClick={() => { if (playing) video.current.pause(); else video.current.play().catch(() => setPlaying(false)); }} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? <FiPause /> : <FiPlay />}<span>{playing ? 'Pause background' : 'Play background'}</span></button>}
  </>;
}
