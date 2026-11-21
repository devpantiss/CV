export const topics = ['Career counselling', 'Choosing a course', 'Choosing a college', 'Admission support', 'Education events', 'Other'];
export function contactDetails(input) {
  const result = {};
  for (const [key, max] of Object.entries({ name: 100, email: 254, phone: 25, topic: 80, message: 3000 })) {
    const value = typeof input[key] === 'string' ? input[key].trim() : '';
    if ((!value && key !== 'phone') || value.length > max || [...value].some(char => char.charCodeAt(0) < 32 && !(key === 'message' && ['\n', '\r', '\t'].includes(char)))) throw new Error(`Please enter a valid ${key}.`);
    result[key] = value;
  }
  result.email = result.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Please enter a valid email address.');
  if (result.phone && (!/^\+?[\d ()-]+$/.test(result.phone) || result.phone.replace(/\D/g, '').length < 7)) throw new Error('Please enter a valid phone number.');
  if (!topics.includes(result.topic)) throw new Error('Please select a query topic.');
  if (input.consent !== true) throw new Error('Please agree to be contacted about your query.');
  return result;
}
