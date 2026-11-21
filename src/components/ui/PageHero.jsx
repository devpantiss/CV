import { FiBookOpen, FiCalendar, FiCamera, FiCheck, FiCompass, FiMail, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import HeroMedia from './HeroMedia';

const heroThemes = {
  about: { video: '/media/heroes/about-campus.mp4', poster: '/media/heroes/about-campus.jpg', photo: '/media/pathways/business.jpg', context: 'A story shaped by students', detail: 'Guidance since 2013', icon: FiCompass },
  services: { video: '/media/heroes/services-guidance.mp4', poster: '/media/heroes/services-guidance.jpg', photo: '/media/guidance-parallax-banner.jpg', context: 'Support that starts with listening', detail: 'From exploration to your next step', icon: FiBookOpen },
  contact: { photo: '/media/parents-guidance-parallax.jpg', context: 'Your questions are welcome here', detail: 'A conversation is a good place to start', icon: FiMail },
  events: { photo: '/media/heroes/events.jpg', context: 'Where ambition meets opportunity', detail: 'Education fairs · Open houses · Sessions', icon: FiCalendar },
  gallery: { photo: '/media/heroes/gallery.jpg', context: 'Real moments. Shared ambition.', detail: 'Inside the Career Valley community', icon: FiCamera },
  experts: { video: '/media/heroes/experts-discussion.mp4', poster: '/media/heroes/experts-discussion.jpg', photo: '/media/pathways/business.jpg', context: 'Experience with a human perspective', detail: 'Conversations that open possibilities', icon: FiUsers },
  team: { video: '/media/heroes/team-collaboration.mp4', poster: '/media/heroes/team-collaboration.jpg', photo: '/media/career-guidance-hero-v2.jpg', context: 'The people behind the guidance', detail: 'Working together for clearer decisions', icon: FiUsers },
  colleges: { photo: '/media/heroes/colleges.jpg', context: 'Find your place to grow', detail: 'Explore institutions, cities and courses', icon: FiBookOpen },
  default: { photo: '/media/career-guidance-hero-v2.jpg', context: 'Clarity for every next step', detail: 'Your interests. Your possibilities.', icon: FiCompass },
};
export default function PageHero({ eyebrow, title, description, children, variant = 'default' }) {
  const theme = heroThemes[variant] || heroThemes.default;
  const Icon = theme.icon;
  const video = theme.video;
  return <section className={`page-hero refined-page-hero media-page-hero page-hero-${variant}`}>
    <HeroMedia image={theme.poster || theme.photo} video={video} />
    <div className="site-container refined-hero-layout">
      <div className="refined-hero-copy">
        <nav className="hero-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{eyebrow || 'Career Valley'}</span></nav>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="display-title">{title}</h1>
        {description && <p className="lead">{description}</p>}
        {children && <div className="refined-hero-actions">{children}</div>}
        <div className="page-hero-assurance"><span><FiCheck aria-hidden="true" />Personal guidance</span><span><FiCheck aria-hidden="true" />Practical next steps</span></div>
      </div>
      <div className="hero-media-context" aria-hidden="true"><Icon /><div><strong>{theme.context}</strong><p>{theme.detail}</p></div></div>
    </div>
  </section>;
}
