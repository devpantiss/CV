import { useEffect, useState } from 'react';
import { FiBookOpen, FiCalendar, FiCamera, FiCheck, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiSearch, FiUsers } from 'react-icons/fi';
import useHeroScrollMotion from '../../hooks/useHeroScrollMotion';

const StoryVisual = () => <div className="hero-story"><span className="hero-story-line" /><div className="hero-story-year"><strong>2013</strong><small>Career Valley begins</small></div><div className="hero-story-card"><span>Our purpose</span><strong>Making education choices clearer.</strong><p>Student by student. Decision by decision.</p></div><div className="hero-story-year hero-story-today"><strong>Today</strong><small>Guidance that keeps evolving</small></div></div>;
const ServicesVisual = () => <div className="hero-services"><div className="hero-services-core"><FiMessageCircle /><strong>One-to-one<br />guidance</strong></div><div className="hero-service-chip chip-a"><FiUsers />Education events</div><div className="hero-service-chip chip-b"><FiMapPin />Campus visits</div><div className="hero-service-chip chip-c"><FiBookOpen />Admission support</div><span className="hero-service-path path-a" /><span className="hero-service-path path-b" /></div>;
const ContactVisual = () => <div className="hero-contact"><div className="hero-chat hero-chat-one"><span className="hero-chat-avatar">CV</span><p>What decision are you facing?</p></div><div className="hero-chat hero-chat-two"><p>I need help comparing my options.</p><FiCheck /></div><div className="hero-contact-actions"><span><FiPhone />Call us</span><span><FiMail />Email us</span></div></div>;
const EventsVisual = () => <div className="hero-events"><div className="hero-calendar"><div className="hero-calendar-top"><FiCalendar /><span>Upcoming</span></div><div className="hero-event-row"><span className="event-dot dot-one" /><p><strong>Education fairs</strong><small>Meet institutions directly</small></p></div><div className="hero-event-row"><span className="event-dot dot-two" /><p><strong>Open houses</strong><small>Ask better questions</small></p></div><div className="hero-event-row"><span className="event-dot dot-three" /><p><strong>Student sessions</strong><small>Explore your next step</small></p></div></div></div>;
const GalleryVisual = () => <div className="hero-gallery"><span className="hero-gallery-badge"><FiCamera />Event moments</span>{['https://i.postimg.cc/qvtqJv1S/IMG-0946.jpg','https://i.postimg.cc/ZnT04PQx/IMG-1135.jpg','https://i.postimg.cc/Bn1ZWw6G/IMG-0895.jpg'].map((src,index) => <img key={src} src={src} alt="" width="300" height="220" className={`gallery-tile gallery-tile-${index + 1}`} />)}</div>;
const ExpertsVisual = () => <div className="hero-experts"><div className="expert-orbit"><span className="expert-center"><FiUsers /><strong>Human<br />guidance</strong></span>{['https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg','https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg','https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg'].map((src,index) => <img key={src} src={src} alt="" width="100" height="100" className={`expert-avatar expert-avatar-${index + 1}`} />)}</div></div>;
const TeamVisual = () => <div className="hero-team"><img src="https://res.cloudinary.com/du3i8e0se/image/upload/v1721847900/qkvrjqtsook5wjnzbzwb.jpg" alt="" width="300" height="380" className="hero-team-lead" /><div className="hero-team-copy"><span>Founder & CEO</span><strong>Divya Rupainwar</strong><small>Student-first guidance since 2013</small></div><div className="hero-team-stack">{['https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg','https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg','https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg'].map((src) => <img key={src} src={src} alt="" width="64" height="64" />)}<span>+ guidance experts</span></div></div>;
const CollegesVisual = () => <div className="hero-colleges"><div className="hero-college-search"><FiSearch /><span>Find colleges by city</span></div><div className="hero-college-map"><FiMapPin /><strong>Explore India</strong><small>Courses · colleges · pathways</small></div><div className="hero-city-chips">{['Hyderabad','Bangalore','Delhi'].map((city) => <span key={city}>{city}</span>)}</div></div>;
const GenericVisual = () => <div className="hero-generic"><span className="hero-generic-ring" /><span className="hero-generic-core"><FiCheck /><strong>Clarity</strong><small>for your next step</small></span></div>;

const visuals = { about: StoryVisual, services: ServicesVisual, contact: ContactVisual, events: EventsVisual, gallery: GalleryVisual, experts: ExpertsVisual, team: TeamVisual, colleges: CollegesVisual };

/* Background images per variant — curated for each page theme */
const heroBackgrounds = {
  about: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
  services: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
  contact: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  events: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80',
  gallery: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
  experts: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
  team: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80',
  colleges: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
};

const defaultHeroPoster = '/media/career-guidance-hero-v2.jpg';
// Free-to-use college discussion footage: https://www.pexels.com/video/college-students-having-a-discussion-8196801/
const heroVideo = 'https://videos.pexels.com/video-files/8196801/8196801-hd_1920_1080_25fps.mp4';

const heroContext = {
  about: 'A story shaped by students',
  services: 'Support that starts with listening',
  contact: 'Your questions are welcome here',
  events: 'Where students and educators connect',
  gallery: 'Real moments. Shared ambition.',
  experts: 'Experience with a human perspective',
  team: 'The people behind the guidance',
  colleges: 'Explore options with more context',
  default: 'Clarity for every next step',
};

const PageHero = ({ eyebrow, title, description, children, variant = 'default' }) => {
  const heroRef = useHeroScrollMotion();
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const Visual = visuals[variant] || GenericVisual;
  const poster = heroBackgrounds[variant] || defaultHeroPoster;

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateVideoPreference = () => setShouldPlayVideo(!reducedMotion.matches && !navigator.connection?.saveData);
    updateVideoPreference();
    reducedMotion.addEventListener('change', updateVideoPreference);
    return () => reducedMotion.removeEventListener('change', updateVideoPreference);
  }, []);

  return (
    <section ref={heroRef} className={`page-hero scroll-hero page-hero-${variant}`}>
      <div className="page-hero-bg" aria-hidden="true">
        <img src={poster} alt="" width="1920" height="1080" className="page-hero-bg-img" fetchPriority="high" />
        {shouldPlayVideo && (
          <video className="page-hero-bg-video" autoPlay muted loop playsInline preload="metadata" poster={poster} tabIndex="-1">
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="page-hero-bg-overlay" aria-hidden="true" />
      <div className="page-hero-grid" aria-hidden="true" />
      <div className="page-hero-glow" aria-hidden="true" />

      <div className="site-container relative z-10 grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] xl:gap-20">
        <div className="hero-scroll-copy hero-reveal">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="display-title">{title}</h1>
          {description && <p className="lead">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          <div className="page-hero-assurance" aria-label="Career Valley guidance approach">
            <span><FiCheck />Personal guidance</span>
            <span><FiCheck />Practical next steps</span>
          </div>
        </div>

        <div className="hero-scroll-visual hero-reveal hero-reveal-delay" aria-hidden="true">
          <div className="page-hero-visual-shell">
            <div className="page-hero-visual-topbar">
              <span className="page-hero-live-dot" />
              <span>{heroContext[variant] || heroContext.default}</span>
              <i /><i /><i />
            </div>
            <div className="page-hero-visual-content"><Visual /></div>
          </div>
        </div>
      </div>

      <span className="page-hero-edge-label" aria-hidden="true">Listen · Explore · Decide</span>
    </section>
  );
};
export default PageHero;
