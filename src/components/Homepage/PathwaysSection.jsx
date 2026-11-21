import { FiArrowUpRight, FiArrowRight, FiBookOpen, FiBriefcase, FiCode, FiCompass, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { pathways } from '../../features/content/pathways';
import SectionHeading from '../ui/SectionHeading';
import './pathways.css';

const icons = { engineering: FiCpu, business: FiBriefcase, science: FiCompass, commerce: FiTrendingUp, computing: FiCode, arts: FiBookOpen };
export default function PathwaysSection() {
  return <section className="section pathway-section" aria-label="Explore pathways">
    <div className="pathway-backdrop" aria-hidden="true"><span /><span /></div>
    <div className="site-container">
      <div className="pathway-heading"><SectionHeading eyebrow="Explore pathways" title="Find a direction that feels like you." description="Six starting points. Plenty of possibilities." /><Link to="/explorecity" className="button button-secondary">Explore colleges <FiArrowRight /></Link></div>
      <div className="pathway-grid">{pathways.map((path, index) => {
        const Icon = icons[path.icon] || FiBookOpen;
        return <Link className="pathway-card" key={path.id} to={path.to}>
          <img className="pathway-card-image" src={`/media/pathways/${path.id}.jpg`} alt="" width="900" height="600" loading="lazy" /><div className="pathway-card-top"><span className="pathway-icon"><Icon aria-hidden="true" /></span><span className="pathway-index" aria-hidden="true">0{index + 1}</span></div>
          <h3>{path.title}</h3>
          <div className="pathway-courses" aria-label="Course guides">{path.courses.map(course => <span key={course}>{course}</span>)}</div>
          <div className="pathway-card-bottom"><span>Explore this pathway</span><span className="pathway-arrow"><FiArrowUpRight aria-hidden="true" /></span></div>
        </Link>;
      })}</div>
      <p className="pathway-footnote"><FiCompass aria-hidden="true" />Start with your interests. Explore the possibilities.</p>
    </div>
  </section>;
}
