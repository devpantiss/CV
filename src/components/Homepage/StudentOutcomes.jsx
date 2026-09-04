import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';

const outcomes = [
  { name: 'Saurav Singh', stage: 'Undergraduate decision', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024885/saurav_nhznqm.png', challenge: 'Needed clarity on undergraduate programmes and a college choice.', support: 'Programme guidance, scholarship support and help navigating an education loan.', result: 'Moved forward with confidence at his preferred college.' },
  { name: 'Sneha Singh', stage: 'Management pathway', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024924/sneha_n4jhjf.png', challenge: 'Was uncertain about the right B-school after completing her undergraduate degree.', support: 'Campus immersion, application guidance, scholarship support and education-loan assistance.', result: 'Joined Welingkar Institute of Management, Bangalore.' },
  { name: 'Abhishek', stage: 'College selection', image: 'https://res.cloudinary.com/du3i8e0se/image/upload/v1723024960/Abhisek_ib0xuw.png', challenge: 'Needed help choosing a management programme and understanding the practical trade-offs.', support: 'College guidance plus scholarship and education-loan support.', result: 'Joined Badruka School of Management with a clearer plan.' },
];

const StudentOutcomes = () => (
  <section className="section student-outcomes-section">
    <div className="site-container">
      <div className="student-outcomes-heading"><SectionHeading eyebrow="Student outcomes" title="See what clearer decisions can lead to." description="Real journeys showing the question students faced, the support they received and the next step they chose." /><Link to="/contact_us" className="button button-secondary">Discuss your decision <FiArrowRight /></Link></div>
      <div className="outcome-grid">
        {outcomes.map((outcome) => <article className="outcome-card" key={outcome.name}><div className="outcome-person"><img src={outcome.image} alt={outcome.name} width="120" height="120" loading="lazy" /><div><span>{outcome.stage}</span><h3>{outcome.name}</h3></div></div><dl><div><dt>The question</dt><dd>{outcome.challenge}</dd></div><div><dt>Career Valley support</dt><dd>{outcome.support}</dd></div></dl><p className="outcome-result"><FiCheckCircle />{outcome.result}</p></article>)}
      </div>
    </div>
  </section>
);

export default StudentOutcomes;
