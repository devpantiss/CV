const encoder = new TextEncoder();
const keyFor = (secret, usage) => crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]);
export const validFileId = (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{10,200}$/.test(id);
export async function signFile(id, secret) {
  if (!validFileId(id) || secret.length < 32) throw new Error('Invalid media signing configuration.');
  const bytes = await crypto.subtle.sign('HMAC', await keyFor(secret, 'sign'), encoder.encode(`career-valley-media:${id}`));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
export async function verifyFile(id, token, secret) {
  if (!validFileId(id) || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || secret.length < 32) return false;
  const bytes = Uint8Array.from(token.match(/../g), (part) => parseInt(part, 16));
  return crypto.subtle.verify('HMAC', await keyFor(secret, 'verify'), bytes, encoder.encode(`career-valley-media:${id}`));
}
