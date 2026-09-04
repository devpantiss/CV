const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start' }}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 className="section-title">{title}</h2>
    {description && <p className="lead">{description}</p>}
  </div>
);
export default SectionHeading;
