export function registrationDetails(input) {
  const limits = { name: 100, email: 254, phone: 25, institution: 160, city: 100 };
  const result = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = String(input[key] || '').trim();
    if (!value || value.length > limit || [...value].some(char => char.charCodeAt(0) < 32)) throw new Error(`Please enter a valid ${key}.`);
    result[key] = value;
  }
  result.email = result.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Please enter a valid email address.');
  if (!/^\+?[\d ()-]{7,25}$/.test(result.phone) || result.phone.replace(/\D/g, '').length < 7) throw new Error('Please enter a valid phone number.');
  if (input.consent !== true) throw new Error('Please agree to be contacted about this event.');
  return result;
}
