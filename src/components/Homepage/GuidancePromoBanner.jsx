import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const GuidancePromoBanner = () => (
  <section className="guidance-promo" aria-label="Start your Career Valley guidance journey">
    <div className="guidance-promo-shade" aria-hidden="true" />
    <div className="guidance-promo-grid" aria-hidden="true" />
    <div className="site-container guidance-promo-inner">
      <div className="guidance-promo-content">
        <span className="guidance-promo-kicker"><FiCheck aria-hidden="true" />Personal guidance. Practical direction.</span>
        <h2>One conversation can bring your next step into focus.</h2>
        <p>Talk through your interests, compare realistic pathways and move forward with a plan that feels right for you.</p>
        <div className="guidance-promo-actions">
          <Link to="/contact_us" className="button guidance-promo-primary">Talk to a career advisor <FiArrowRight /></Link>
          <Link to="/services" className="button guidance-promo-secondary">Explore our services</Link>
        </div>
      </div>
    </div>
  </section>
);

export default GuidancePromoBanner;
