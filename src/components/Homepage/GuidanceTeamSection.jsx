import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

const experts = [
  { name: 'Sonali Mulay', photo: 'https://i.postimg.cc/nVjg34sd/Sonali-Mulay-expert-1.jpg' },
  { name: 'Ishita Kundu', photo: 'https://i.postimg.cc/vBjjQBKL/Ishita-Kundu-expert-1.jpg' },
  { name: 'Prof. Satya Kiran Sastry', photo: 'https://i.postimg.cc/43fjPjtt/Prof-Satya-Kiran-Sastry-expert-1.jpg' },
  { name: 'Pranab Kumar', photo: 'https://i.postimg.cc/PrZG5WTL/Pranab-kumar-Misra-expert-1.jpg' },
];

const GuidanceTeamSection = () => (
  <section className="section guidance-team-section">
    <div className="site-container">
      <div className="guidance-team-heading"><SectionHeading eyebrow="Meet your guidance team" title="Important decisions deserve experienced, human support." description="Meet the people who help students and families turn a crowded field of options into a practical next step." /><Link to="/experts" className="button button-secondary">Meet every expert <FiArrowRight /></Link></div>
      <div className="guidance-team-layout">
        <article className="founder-feature">
          <div className="founder-feature-image"><img src="https://res.cloudinary.com/du3i8e0se/image/upload/v1721847900/qkvrjqtsook5wjnzbzwb.jpg" alt="Divya Rupainwar, founder and CEO of Career Valley" width="700" height="860" loading="lazy" /></div>
          <div className="founder-feature-content"><span>Founder & CEO</span><h3>Divya Rupainwar</h3><p>More than a decade in higher-education admissions, with experience across student counselling, university admissions and career guidance.</p><ul><li><FiCheck />Student-first conversations</li><li><FiCheck />Practical admission context</li><li><FiCheck />Support for families</li></ul><Link to="/contact_us">Book a conversation <FiArrowRight /></Link></div>
        </article>
        <div className="expert-mini-grid">
          {experts.map((expert) => <article className="expert-mini-card" key={expert.name}><img src={expert.photo} alt={expert.name} width="360" height="430" loading="lazy" /><div><span>Education expert</span><h3>{expert.name}</h3></div></article>)}
        </div>
      </div>
    </div>
  </section>
);

export default GuidanceTeamSection;
