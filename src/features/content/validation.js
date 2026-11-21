export const fields = {
  partners: [ ['name', 'College name', true], ['location', 'City / location'], ['website', 'College website', false, 'url'] ],
  events: [ ['title', 'Event title', true], ['date', 'Date', true, 'date'], ['time', 'Time'], ['location', 'Location', true], ['eventType', 'Event type'], ['desc', 'Description', true, 'textarea'], ['registrationUrl', 'Registration link', false, 'url'] ],
  team: [ ['profileType', 'Profile category', false, 'select'], ['name', 'Full name', true], ['role', 'Role', true], ['bio', 'Biography', false, 'textarea'], ['email', 'Contact email', false, 'email'], ['linkedin', 'LinkedIn profile URL', false, 'url'] ],
  testimonials: [ ['name', 'Student name', true], ['stage', 'Programme or pathway', true], ['review', 'Client review (approved quote)', false, 'textarea'], ['challenge', 'The question', true, 'textarea'], ['support', 'Career Valley support', true, 'textarea'], ['result', 'Outcome', true, 'textarea'] ],
};
export function validateContent(kind, content) {
  if (kind === 'team' && content.profileType && !['team', 'expert'].includes(content.profileType)) throw new Error('Choose Team or Expert as the profile category.');
  for (const [key, label, required, type] of fields[kind]) {
    if (required && !content[key]?.trim()) throw new Error(`${label} is required.`);
    if ((content[key] || '').length > 5000) throw new Error(`${label} is too long.`);
    if (type === 'url' && content[key]) {
      let url;
      try { url = new URL(content[key]); } catch { throw new Error(`${label} must use HTTPS.`); }
      if (url.protocol !== 'https:') throw new Error(`${label} must use HTTPS.`);
      if (key === 'linkedin' && !(url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) throw new Error('Enter a valid LinkedIn profile URL.');
    }
    if (type === 'date' && content[key]) {
      const date = new Date(`${content[key]}T12:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(content[key]) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== content[key]) throw new Error(`${label} must be a valid date.`);
    }
  }
}
export function validateImage(file) {
  const extensions = { 'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'], 'image/webp': ['webp'] };
  const extension = file.name.split('.').pop().toLowerCase();
  if (!extensions[file.type]?.includes(extension) || file.size <= 0 || file.size > 5 * 1024 * 1024) throw new Error('Choose a JPG, PNG or WebP image under 5 MB.');
  return extension;
}
