// Explicit categories take priority. Preserve the existing expert profiles until edited.
const legacyExperts = new Set(['sonali mulay', 'ishita kundu', 'prof. satya kiran sastry', 'pranab kumar', 'pranab kumar misra']);
export const isLeadership = (member) => /founder|ceo/i.test(member.role || '');
export const profileCategory = (member) => {
  if (['team', 'expert'].includes(member.profileType)) return member.profileType;
  return !isLeadership(member) && (/expert/i.test(member.role || '') || legacyExperts.has((member.name || '').trim().toLowerCase())) ? 'expert' : 'team';
};
export const isExpert = (member) => profileCategory(member) === 'expert';
