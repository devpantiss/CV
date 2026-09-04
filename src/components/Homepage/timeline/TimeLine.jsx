import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SVG from '../../../assets/Vector.png';
import SectionHeading from '../../ui/SectionHeading';
import ConsultationModal from '../ConsultationModal';
import './timeline.css';

const events = [
  { id: 1, title: 'Education Fairs and Open Houses', description: 'Meet representatives from universities and B-Schools in an environment built for useful questions.', additionalInfo: 'Compare programmes, understand institutions and make a more informed education decision.', link: '/events?tab=Upcoming', linkText: 'Explore our events', imgSrc: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1722275884/Firefly_education_fair_graphic_illustration_49011-removebg-preview_ftpwnx.png' },
  { id: 2, title: 'Expert Guidance', description: 'Speak with experienced education consultants who take time to understand your goals and context.', additionalInfo: 'Get personal support instead of a generic list of courses or colleges.', link: '#consultation', linkText: 'Book a consultation', imgSrc: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1722275884/Firefly_education_fair_graphic_illustration_27543-removebg-preview_ncpnwc.png' },
  { id: 3, title: 'Wide Range of Options', description: 'Explore undergraduate and postgraduate programmes across Indian and global institutions.', additionalInfo: 'Use real course and college information to create a shortlist that fits your direction.', link1: '/colleges/ug', linkText1: 'UG options', link2: '/colleges/pg', linkText2: 'PG options', imgSrc: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1722275884/Firefly_wide_range_of_career_options_graphic_illustration_like_engineer__doctor__lawyer__manager_511__1_-removebg-preview_m83how.png' },
  { id: 4, title: 'Unparalleled Support', description: 'Continue the journey with help during applications, admissions and the decisions around them.', additionalInfo: 'Career Valley stays available as your education journey moves from exploration to action.', link: '/contact_us', linkText: 'Contact us', imgSrc: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1722275885/Firefly_wide_range_of_career_options_graphic_illustration_like_engineer__doctor__lawyer__manager_511__2_-removebg-preview_y1trcf.png' },
];

const TimelineComponent = () => {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const start = window.innerHeight * .58;
      const travel = Math.max(rect.height - window.innerHeight * .35, 1);
      setProgress(Math.min(1, Math.max(0, (start - rect.top) / travel)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  const activeIndex = Math.min(events.length - 1, Math.floor(progress * events.length));

  return (
    <section id="why-career-valley" className="timeline-section scroll-mt-24">
      <div className="site-container pb-10 pt-[clamp(4.5rem,8vw,7rem)]"><SectionHeading eyebrow="Why Career Valley" title="Guidance that moves with you." description="The original Career Valley journey—refined into four clearer, more useful steps." align="center" /></div>
      <div className="timeline-stage" ref={trackRef}>
        <div className="timeline-progress" aria-hidden="true">
          <span className="timeline-progress-caption">Scroll journey</span>
          <span className="timeline-progress-fill" style={{ height: `${progress * 100}%` }} />
          <span className="timeline-marker" data-step={`Step ${activeIndex + 1}`} style={{ top: `${progress * 100}%` }}><span className="timeline-marker-pulse" /><img src={SVG} alt="" /></span>
        </div>
        <div className="site-container timeline-list">
          {events.map((item, index) => (
            <article className={`timeline-step ${index % 2 ? 'timeline-step-reverse' : ''} ${activeIndex === index ? 'is-active' : ''}`} key={item.id}>
              <div className="timeline-art"><span className="timeline-art-halo" /><img src={item.imgSrc} alt="" width="420" height="330" loading="lazy" /></div>
              <div className="timeline-node" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="timeline-card">
                <span className="timeline-card-label"><FiUsers /> Step {index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="timeline-card-detail"><FiCheck />{item.additionalInfo}</p>
                {item.link && <div className="mt-7"><Link to={item.link} onClick={item.id === 2 ? (event) => { event.preventDefault(); setModalIsOpen(true); } : undefined} className="button button-secondary !min-h-10 !px-4">{item.linkText}<FiArrowRight /></Link></div>}
                {item.link1 && <div className="mt-7 flex flex-wrap gap-2"><Link to={item.link1} className="button button-secondary !min-h-10 !px-4">{item.linkText1}</Link><Link to={item.link2} className="button button-primary !min-h-10 !px-4">{item.linkText2}<FiArrowRight /></Link></div>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <ConsultationModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </section>
  );
};
export default TimelineComponent;
