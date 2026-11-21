import { FiLinkedin } from 'react-icons/fi';

export default function LinkedInLink({ href, name }) {
  let url;
  try { url = new URL(href); } catch { return null; }
  if (url.protocol !== 'https:' || !(url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) return null;
  return <a href={url.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} on LinkedIn (opens in a new tab)`} title="View LinkedIn profile" className="linkedin-profile-link"><FiLinkedin aria-hidden="true" /></a>;
}
