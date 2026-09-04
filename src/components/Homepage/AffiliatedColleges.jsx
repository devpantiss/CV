import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiCheckCircle } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';

const sheetOne = '/affiliates/affiliates-sheet-1.jpeg';
const sheetTwo = '/affiliates/affiliates-sheet-2.jpeg';

const rowsOne = ['15.5%', '24.7%', '33.8%', '43.7%', '53.5%', '65.1%', '75.7%', '86.4%', '95.2%'];
const rowsTwo = ['16%', '25%', '33.6%', '42.8%', '53.1%', '63.3%', '73%', '83.4%', '94.5%'];

const fromGrid = (sheet, rows, names) => names.map((name, index) => ({
  name,
  sheet,
  x: `${(index % 3) * 50}%`,
  y: rows[Math.floor(index / 3)],
}));

const affiliates = [
  ...fromGrid(sheetOne, rowsOne, [
    'FLAME University', 'Somaiya Vidyavihar University', 'Welingkar Institute of Management',
    'Ashoka University', 'Lovely Professional University', 'Istituto Marangoni',
    'Plaksha University', 'Shiv Nadar University', 'Bennett University',
    'Alliance University', 'NMIMS University', 'GITAM',
    'Goa Institute of Management', 'Manipal Academy of Higher Education', 'Mody University',
    'Indian School of Business & Finance', 'Hult International Business School', 'ITM Skills University',
    'K.R. Mangalam University', 'Badruka Educational Society', 'iNurture Education Solutions',
    'Siva Sivani Institute of Management', 'Accurate Institute', 'School of Innovation and Management',
    'Vidyashilp University', 'Sharda University', 'ASB',
  ]),
  ...fromGrid(sheetTwo, rowsTwo, [
    'Thapar Institute of Engineering & Technology', 'Prestige', 'Jio',
    'S.D. College Institutions', 'Acharya Bangalore B-School', 'Amity University',
    'Planet Finance Business School', 'Poddar Group of Institutions', 'NICMAR University',
    'GNIOT Group of Institutions', 'ISBR Business School', 'Mangalam College of Engineering',
    'Vishwa Vishwani Institute of Systems & Management', 'Parul University', 'RV University',
    'SRM Institute of Science and Technology', 'Kirloskar', 'Pimpri Chinchwad University',
    'Graphic Era University', 'BML Munjal University', 'IFIM Institutions',
    'IILM University', 'Chitkara Business School', 'Lloyd Institute',
    'Jagdish Sheth School of Management', 'Indian School of Development Management', 'Sparsh Global Business School',
  ]),
  { name: 'Pearl Academy', sheet: sheetTwo, x: '50%', y: '89.4%' },
];

const AffiliatedColleges = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleAffiliates = expanded ? affiliates : affiliates.slice(0, 18);

  return (
    <section className="affiliates-section section" aria-label="Affiliated colleges and education partners">
      <div className="site-container">
        <div className="affiliates-heading">
          <SectionHeading
            eyebrow="Our network"
            title="Affiliated colleges and education partners."
            description="A growing network of universities, institutes and education organisations connected with Career Valley."
          />
          <div className="affiliates-count"><FiCheckCircle aria-hidden="true" /><strong>{affiliates.length}</strong><span>partner institutions</span></div>
        </div>

        <div className="affiliates-grid">
          {visibleAffiliates.map((affiliate) => (
            <article className="affiliate-card" key={affiliate.name} title={affiliate.name}>
              <div
                className="affiliate-logo-canvas"
                role="img"
                aria-label={`${affiliate.name} logo`}
                style={{
                  backgroundImage: `url(${affiliate.sheet})`,
                  backgroundPosition: `${affiliate.x} ${affiliate.y}`,
                }}
              />
              <h3>{affiliate.name}</h3>
            </article>
          ))}
        </div>

        <div className="affiliates-actions">
          <button className="button button-secondary" type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
            {expanded ? <>Show fewer partners <FiArrowUp /></> : <>View all {affiliates.length} partners <FiArrowDown /></>}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AffiliatedColleges;
