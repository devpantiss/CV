import { useState } from 'react';
import { FiArrowRight, FiBookOpen, FiCalendar, FiMessageCircle, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../../ui/SectionHeading';
import ConsultationModal from '../ConsultationModal';
import './timeline.css';

const benefits = [
  {
    id: 'education',
    title: 'Education Fairs & Open Houses',
    description: 'Meet universities and B-Schools, ask useful questions and compare programmes with confidence.',
    icon: FiCalendar,
    links: [{ label: 'Explore our events', to: '/events?tab=Upcoming' }],
  },
  {
    id: 'guidance',
    title: 'Expert Guidance',
    description: 'Speak with experienced education consultants who take time to understand your interests, goals and the decision in front of you.',
    icon: FiUsers,
    consultation: true,
  },
  {
    id: 'options',
    title: 'Wide Range of Options',
    description: 'Explore undergraduate and postgraduate programmes across Indian and global institutions. Find a path that fits your ambitions.',
    icon: FiBookOpen,
    links: [{ label: 'UG options', to: '/colleges/ug' }, { label: 'PG options', to: '/colleges/pg' }],
  },
  {
    id: 'support',
    title: 'Unparalleled Support',
    description: 'From your first shortlist to applications and admissions, get practical support for every next step in your education journey.',
    icon: FiMessageCircle,
    links: [{ label: 'Talk with us', to: '/contact_us' }],
  },
];

const TimelineComponent = () => {
 const [activeIndex, setActiveIndex] = useState(1);
 const [modalIsOpen, setModalIsOpen] = useState(false);
 return <section id="why-career-valley" className="why-section section scroll-mt-24" aria-label="Why Career Valley">
   <div className="site-container">
     <div className="why-section-heading"><SectionHeading eyebrow="Why Career Valley" title="A clear path. People by your side." description="From the first conversation to your next step, our network moves with you." /><Link to="/services" className="button button-secondary">How we help <FiArrowRight /></Link></div>
     <div className="why-benefit-grid">{benefits.map((benefit, index) => {
       const Icon = benefit.icon;
       return <article className={`why-benefit-card ${activeIndex === index ? 'is-expanded' : ''}`} key={benefit.id} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} aria-labelledby={`why-${benefit.id}-title`}>
         <span className="why-benefit-number" aria-hidden="true">0{index + 1}.</span><button type="button" className="why-benefit-select" aria-expanded={activeIndex === index} aria-controls={`why-${benefit.id}-details`} onClick={() => setActiveIndex(index)}><span className="sr-only">Explore {benefit.title}</span></button><div className="why-benefit-art" aria-hidden={activeIndex !== index}><img src={`/media/why-career-valley/${benefit.id}.webp`} alt="" width="720" height="540" loading="lazy" /></div>
         <div className="why-benefit-body"><div className="why-benefit-meta"><Icon aria-hidden="true" /></div><h3 id={`why-${benefit.id}-title`}>{benefit.title}</h3><div id={`why-${benefit.id}-details`} className="why-benefit-details"><p>{benefit.description}</p>
           <div className="why-benefit-actions">{benefit.consultation ? <button type="button" onClick={() => setModalIsOpen(true)}>Book a consultation <FiArrowRight /></button> : benefit.links.map(link => <Link key={link.to} to={link.to}>{link.label}<FiArrowRight /></Link>)}</div></div>
         </div>
       </article>;
     })}</div>
   </div>
   <ConsultationModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
 </section>;
};
export default TimelineComponent;
