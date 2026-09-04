import { useEffect, useRef } from 'react';

const useHeroScrollMotion = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let animationFrame = null;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      hero.style.setProperty('--hero-progress', progress.toFixed(3));
      animationFrame = null;
    };

    const requestUpdate = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return heroRef;
};

export default useHeroScrollMotion;
