export function impactMetrics(content, registrations, now = new Date()) {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const events = content.filter(row => row.kind === 'events' && row.published);
  const dated = events.filter(row => /^\d{4}-\d{2}-\d{2}$/.test(row.content.date || ''));
  const past = dated.filter(row => new Date(`${row.content.date}T23:59:59`) < today);
  const cities = new Set(events.map(row => row.content.location?.trim().toLowerCase()).filter(city => city && !/online|virtual|webinar/.test(city)));
  return {
    partners: content.filter(row => row.kind === 'partners' && row.published).length,
    conducted: past.length,
    participants: new Set(registrations.map(row => row.email?.trim().toLowerCase()).filter(Boolean)).size,
    cities: cities.size,
    upcoming: dated.length - past.length,
    registrations: registrations.length,
    drafts: content.filter(row => !row.published).length,
    nextEvents: dated.filter(row => !past.includes(row)).sort((a,b) => a.content.date.localeCompare(b.content.date)).slice(0, 3),
  };
}
