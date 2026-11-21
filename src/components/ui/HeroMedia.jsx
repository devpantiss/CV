import { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';

export default function HeroMedia({ image, video, position = 'center' }) {
  const player = useRef(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAllowVideo(!motion.matches && !navigator.connection?.saveData);
    update(); motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, [video]);
  return <>
    <div className="hero-background-media" aria-hidden="true">
      <img src={image} alt="" width="1920" height="1080" style={{ objectPosition: position }} {...{ fetchpriority: 'high' }} />
      {allowVideo && !failed && <video ref={player} autoPlay muted loop playsInline preload="metadata" poster={image} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} style={{ objectPosition: position }}><source src={video} type="video/mp4" /></video>}
    </div>
    <div className="hero-media-overlay" aria-hidden="true" />
    {allowVideo && !failed && <button type="button" className="hero-media-toggle" aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={() => { if (playing) player.current?.pause(); else player.current?.play().catch(() => setPlaying(false)); }}>{playing ? <FiPause /> : <FiPlay />}<span>{playing ? 'Pause video' : 'Play video'}</span></button>}
  </>;
}
