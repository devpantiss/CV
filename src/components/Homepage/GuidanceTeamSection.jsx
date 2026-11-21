import LinkedInLink from '../ui/LinkedInLink';
import { isLeadership, isExpert } from '../../features/content/people';
import useContent from '../../features/content/useContent';
import ContentStatus from '../../features/content/ContentStatus';
import { teamDefaults } from '../../features/content/defaults';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';



const GuidanceTeamSection = () => {
  const { items: members, loading, error } = useContent('team', teamDefaults);
 const team = members.filter(member => !isExpert(member));
 const founder = team.find(isLeadership);
 const colleagues = team.filter(member => member !== founder);
  return (
  <section className="section guidance-team-section">
    <div className="site-container">
      <div className="guidance-team-heading"><SectionHeading eyebrow="Meet your guidance team" title="Important decisions deserve experienced, human support." description="Meet the people who help students and families turn a crowded field of options into a practical next step." /><Link to="/team" className="button button-secondary">Meet our team <FiArrowRight /></Link></div>
      <div className={`guidance-team-layout ${!colleagues.length ? 'guidance-team-single' : ''}`}>
        {founder && <article className="founder-feature">
          <div className="founder-feature-image"><img src={founder.photo} alt={founder.name} width="700" height="860" loading="lazy" /></div>
          <div className="founder-feature-content"><span>{founder.role}</span><h3>{founder.name}</h3><LinkedInLink href={founder.linkedin} name={founder.name} /><p>{founder.bio}</p><ul><li><FiCheck />Student-first conversations</li><li><FiCheck />Practical admission context</li><li><FiCheck />Support for families</li></ul><Link to="/contact_us">Book a conversation <FiArrowRight /></Link></div>
        </article>}
        <ContentStatus loading={loading} error={error} empty={!team.length} />{colleagues.length > 0 && <div className="expert-mini-grid">
          {colleagues.map((expert) => <article className="expert-mini-card" key={expert.name}><img src={expert.photo} alt={expert.name} width="360" height="430" loading="lazy" /><div><span>{expert.role || 'Team member'}</span><h3>{expert.name}</h3><LinkedInLink href={expert.linkedin} name={expert.name} /></div></article>)}
        </div>}
      </div>
    </div>
  </section>
);
};

export default GuidanceTeamSection;
