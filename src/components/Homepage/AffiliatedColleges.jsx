import { useState } from 'react';
import { FiArrowDown, FiArrowUp, FiCheckCircle } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import useContent from '../../features/content/useContent';
import { partnerDefaults } from '../../features/partners/defaults';
import PartnerLogo from '../../features/partners/PartnerLogo';
const AffiliatedColleges = () => {
  const [expanded, setExpanded] = useState(false);
  const { items: partners, loading, error } = useContent('partners', partnerDefaults);
  if (!loading && !error && !partners.length) return null;
  const visible = expanded ? partners : partners.slice(0, 12);
  return <section className="affiliates-section section" aria-label="Featured partner colleges"><div className="site-container"><div className="affiliates-heading"><SectionHeading eyebrow="Our network" title="Our top universities & institutes." description="A growing network of universities, institutes and education organisations connected with Career Valley." />{!loading && <div className="affiliates-count"><FiCheckCircle aria-hidden="true" /><strong>{partners.length}</strong><span>partner institutions</span></div>}</div>{loading ? <div className="affiliates-grid" role="status" aria-label="Loading partner colleges">{Array.from({ length: 6 }, (_, i) => <div className="affiliate-card h-32 animate-pulse bg-[var(--color-surface-muted)]" key={i} />)}</div> : <>{error && <p role="status" className="mt-5 text-sm text-[var(--color-muted)]">{error}</p>}<div className="affiliates-grid">{visible.map(partner => <article className="affiliate-card" key={partner.id || partner.name} title={partner.name}>{partner.website && /^https:\/\//i.test(partner.website) ? <a href={partner.website} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} website (opens in a new tab)`}><PartnerLogo partner={partner} /><h3>{partner.name}</h3>{partner.location && <p className="partner-location">{partner.location}</p>}</a> : <><PartnerLogo partner={partner} /><h3>{partner.name}</h3>{partner.location && <p className="partner-location">{partner.location}</p>}</>}</article>)}</div>{partners.length > 12 && <div className="affiliates-actions"><button className="button button-secondary" type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? <>Show fewer partners <FiArrowUp /></> : <>View all {partners.length} partners <FiArrowDown /></>}</button></div>}</>}</div></section>;
};
export default AffiliatedColleges;
