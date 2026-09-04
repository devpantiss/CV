import { FiCalendar, FiCompass, FiUserCheck, FiUsers } from 'react-icons/fi';

const proofPoints = [
  { value: '2013', label: 'Guidance since', icon: FiCalendar },
  { value: '10,000+', label: 'Students guided', icon: FiUsers },
  { value: '6', label: 'Study pathways', icon: FiCompass },
  { value: '4', label: 'Education experts', icon: FiUserCheck },
];

const TrustStrip = () => (
  <section className="trust-strip" aria-label="Career Valley at a glance">
    <div className="site-container trust-strip-grid">
      {proofPoints.map((point) => {
        const Icon = point.icon;
        return <div className="trust-point" key={point.label}><span aria-hidden="true"><Icon /></span><p><strong>{point.value}</strong><small>{point.label}</small></p></div>;
      })}
    </div>
  </section>
);

export default TrustStrip;
