import useContent from '../../features/content/useContent';
import ContentStatus from '../../features/content/ContentStatus';
import { testimonialDefaults } from '../../features/content/defaults';
import { originalReviews } from '../../features/content/originalReviews';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
export default function StudentOutcomes(){
 const {items:outcomes,loading,error}=useContent('testimonials',testimonialDefaults);
 return <section className="section student-outcomes-section"><div className="site-container"><div className="student-outcomes-heading"><SectionHeading eyebrow="Testimonials" title="What our clients say." description="Real experiences, shared by the students we’ve supported."/><Link to="/contact_us" className="button button-secondary">Start your conversation <FiArrowRight /></Link></div><ContentStatus loading={loading} error={error} empty={!outcomes.length}/><div className="client-review-grid">{outcomes.map(outcome=>{const review=outcome.review||originalReviews[outcome.name];return <article className="client-review" key={outcome.id||outcome.name}><span className="client-review-mark" aria-hidden="true">“</span>{review?<blockquote>{review}</blockquote>:<p>{outcome.support} {outcome.result}</p>}<div className="outcome-person"><img src={outcome.image||'/media/student-placeholder.svg'} alt={outcome.name} width="80" height="80" loading="lazy"/><div><h3>{outcome.name}</h3><span>{outcome.stage}</span></div></div></article>;})}</div></div></section>;
}
