const BrandLogo = ({ className = '', inverse = false }) => (
  <img
    src={inverse ? '/career-valley-logo-transparent.png' : '/career-valley-logo.png'}
    alt="The Career Valley"
    width="891"
    height="232"
    className={`brand-logo-image h-auto ${className}`}
  />
);

export default BrandLogo;
