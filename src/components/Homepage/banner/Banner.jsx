import { useState } from 'react';
import { FiArrowRight, FiCheck, FiChevronDown, FiCompass } from 'react-icons/fi';
import ConsultationModal from '../ConsultationModal';
import HeroMedia from '../../ui/HeroMedia';

const logos = [
  ['https://www.isbr.in/assets/images/ISBRlogo.png', 'ISBR'],
  ['https://liet.in/images/lloyd_eng/website/img/logo/liet_engineering_1.png', 'Lloyd Institute'],
  ['https://i.postimg.cc/Gt874RDP/accurate-logo-removebg-preview.png', 'Accurate Institute'],
  ['https://www.nicmar.ac.in/uploads/NICMAR-Hyderabad-Logo-01.png', 'NICMAR Hyderabad'],
  ['https://www.vishwavishwani.ac.in/assets/img/vvism1.png', 'Vishwa Vishwani'],
  ['https://i.postimg.cc/HkBRSX5j/gitam-new-logo-removebg-preview.png', 'GITAM'],
  ['https://dl.geu.ac.in/uploads/image/KWqx6liP-geu-logo.webp', 'Graphic Era University'],
];

// React 18 forwards the browser priority hint using its lowercase attribute name.
const Banner = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <section className="career-hero media-home-hero">
      <HeroMedia image="/media/heroes/student-discussion.jpg" video="/media/heroes/student-discussion.mp4" position="center" />
      <div className="hero-clarity-card" aria-hidden="true"><p><FiCompass />A clearer way forward</p><div><span>Discover</span><i /><span>Compare</span><i /><span>Decide</span></div></div>
      <div className="site-container relative z-10 flex min-h-[clamp(680px,90vh,900px)] items-center pt-28">
        <div className="career-hero-content w-full max-w-3xl py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-extrabold text-[var(--color-primary)] shadow-sm backdrop-blur"><span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />Career guidance for students</span>
          <h1 className="mt-6 max-w-3xl text-[clamp(3.1rem,7vw,6.8rem)] font-bold leading-[.94] tracking-[-.065em] text-[var(--color-foreground)]">Discover your <span className="text-[var(--color-primary)]">dream career.</span></h1>
          <p className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.25rem)] leading-8 text-[var(--color-muted)]">Expert guidance to choose the right career path, undergraduate course or postgraduate programme—with support at every step.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" className="button button-primary" onClick={() => setModalIsOpen(true)}>Talk to our career advisors <FiArrowRight /></button><a href="#why-career-valley" className="button button-secondary bg-[var(--color-surface)]">See how we help <FiChevronDown /></a></div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[var(--color-muted)]"><span className="flex items-center gap-2"><FiCheck className="text-[var(--color-primary)]" />Personal guidance</span><span className="flex items-center gap-2"><FiCheck className="text-[var(--color-primary)]" />UG & PG pathways</span><span className="flex items-center gap-2"><FiCheck className="text-[var(--color-primary)]" />Parents welcome</span></div>

          <div className="mt-10 max-w-3xl rounded-[1.35rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)] backdrop-blur-xl">
            <p className="px-2 pb-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-[var(--color-muted)]">Universities attended by students we have supported</p>
            <div className="hero-logo-window"><div className="hero-logo-track">{[...logos, ...logos].map(([src, alt], index) => <span className="hero-logo" key={`${alt}-${index}`}><img src={src} alt={index < logos.length ? alt : ''} width="120" height="42" loading={index < 4 ? 'eager' : 'lazy'} /></span>)}</div></div>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </section>
  );
};
export default Banner;
