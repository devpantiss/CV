import { useId, useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { partnerLogoCrop } from './logoCrops';
import './partner-logo.css';

export default function PartnerLogo({ partner, className = '' }) {
  const [brokenImage, setBrokenImage] = useState(null);
  const cropId = useId();
  const crop = partnerLogoCrop(partner);
  const available = partner.image && brokenImage !== partner.image;
  return <div className={`partner-logo ${className}`}>
    {available && crop ? <svg className="partner-logo-crop" viewBox={crop.join(' ')} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${partner.name} logo`}><defs><clipPath id={cropId}><rect x={crop[0]} y={crop[1]} width={crop[2]} height={crop[3]} /></clipPath></defs><image href={partner.image} width="1131" height="1600" clipPath={`url(#${cropId})`} /></svg>
      : available && partner.logoPosition ? <div className="affiliate-logo-canvas" role="img" aria-label={`${partner.name} logo`} style={{ backgroundImage: `url(${partner.image})`, backgroundPosition: partner.logoPosition }} />
      : available ? <img src={partner.image} alt={`${partner.name || 'College'} logo`} loading="lazy" onError={() => setBrokenImage(partner.image)} />
      : <FiBookOpen aria-label="College logo unavailable" />}
  </div>;
}
