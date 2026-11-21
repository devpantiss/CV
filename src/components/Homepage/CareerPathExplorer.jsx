import { useState } from 'react';
import { FiArrowUpRight, FiBookOpen, FiBriefcase, FiCheck, FiCode, FiCompass, FiInfo, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './career-explorer.css';

const interests = {
  Technology: { icon: FiCode, image: 'engineering', summary: 'Build, solve and improve how things work.', paths: [{ label: 'B.Tech', to: '/courses/btech' }, { label: 'BCA', to: '/courses/bca' }, { label: 'M.Tech', to: '/courses/mtech', postgraduate: true }] },
  Business: { icon: FiBriefcase, image: 'business', summary: 'Understand organisations, markets and decisions.', paths: [{ label: 'BBA', to: '/courses/bba' }, { label: 'B.Com', to: '/courses/bcom' }, { label: 'MBA', to: '/courses/mba', postgraduate: true }] },
  Science: { icon: FiCompass, image: 'science', summary: 'Investigate questions through evidence and discovery.', paths: [{ label: 'B.Sc', to: '/courses/bsc' }, { label: 'B.Tech', to: '/courses/btech' }] },
  'People & society': { icon: FiUsers, image: 'humanities', summary: 'Explore people, ideas, culture and institutions.', paths: [{ label: 'BA', to: '/courses/ba' }, { label: 'LLB', to: '/courses/llb' }] },
};
const stages = ['Exploring after school', 'Choosing an undergraduate course', 'Planning postgraduate study'];
export default function CareerPathExplorer() {
  const [interest, setInterest] = useState('Technology');
  const [stage, setStage] = useState(stages[0]);
  const selected = interests[interest];
  const postgraduate = stage === stages[2];
  const matched = selected.paths.filter(path => Boolean(path.postgraduate) === postgraduate);
  const paths = matched.length ? matched : selected.paths;
  const foundation = postgraduate && !matched.length;
  return <div className="career-explorer">
    <div className="explorer-controls">
      <div className="explorer-intro"><span className="explorer-compass"><FiCompass aria-hidden="true" /></span><div><span className="explorer-overline">A starting point, shaped by you</span><h3>Follow your curiosity.</h3></div></div>
      <fieldset className="explorer-step"><legend><span>01</span>What interests you?</legend><div className="explorer-interest-grid">{Object.entries(interests).map(([name, item]) => {
        const Icon = item.icon;
        return <label className="explorer-interest" key={name}><input type="radio" name="career-interest" value={name} checked={interest === name} onChange={() => setInterest(name)} /><span><Icon aria-hidden="true" /><strong>{name}</strong><FiCheck className="explorer-interest-check" aria-hidden="true" /></span></label>;
      })}</div></fieldset>
      <fieldset className="explorer-step"><legend><span>02</span>Where are you now?</legend><div className="explorer-stages">{stages.map((item, index) => <label key={item} className="explorer-stage"><input type="radio" name="career-stage" value={item} checked={stage === item} onChange={() => setStage(item)} /><span className="explorer-stage-copy"><strong>{item}</strong><small>{['Discover your options','Compare courses and colleges','Build on your first degree'][index]}</small></span></label>)}</div></fieldset>
      <p className="explorer-control-note"><FiCheck aria-hidden="true" />No signup. Explore at your own pace.</p>
    </div>
    <div className="explorer-results" aria-live="polite" aria-atomic="true">
      <div className="explorer-result-visual"><img src={`/media/pathways/${selected.image}.jpg`} alt="" width="900" height="600" loading="lazy" /><div><span className="explorer-result-tag"><FiCompass aria-hidden="true" />{interest}</span><h3>{selected.summary}</h3></div></div>
      <div className="explorer-result-body"><div className="explorer-results-heading"><div><span className="explorer-overline">Your next place to look</span><h4>{foundation ? 'Explore the foundations' : 'Start with these course guides'}</h4></div><span className="explorer-guide-count">{paths.length} {paths.length === 1 ? 'guide' : 'guides'}</span></div>
        <p className="explorer-results-context">{foundation ? 'We don’t yet have a postgraduate guide for this interest. Explore these existing guides for context, or speak with a counsellor about your next degree.' : `For someone ${stage.toLowerCase()}, these guides can help you compare the possibilities.`}</p>
        <div className="explorer-course-links">{paths.map(path => <Link key={path.label} to={path.to}><span className="explorer-course-icon"><FiBookOpen aria-hidden="true" /></span><span><strong>{path.label}</strong><small>{path.postgraduate ? 'Postgraduate' : 'Course overview'} · Explore guide</small></span><FiArrowUpRight aria-hidden="true" /></Link>)}</div>
        <p className="explorer-advice"><FiInfo aria-hidden="true" /><span>An exploration aid, not a career assessment. <Link to="/contact_us">Talk with a counsellor <FiArrowUpRight aria-hidden="true" /></Link> to put your options in context.</span></p>
      </div>
    </div>
  </div>;
}
