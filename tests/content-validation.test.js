import test from 'node:test';
import assert from 'node:assert/strict';
import { fields, validateContent, validateImage } from '../src/features/content/validation.js';

test('every content type requires its mandatory fields', () => {
  for (const [kind, schema] of Object.entries(fields)) {
    const valid = Object.fromEntries(schema.map(([key, , , type]) => [key, type === 'date' ? '2026-10-28' : type === 'url' ? (key === 'linkedin' ? 'https://www.linkedin.com/in/sample' : 'https://example.com/register') : 'Sample']));
    assert.doesNotThrow(() => validateContent(kind, valid));
    for (const [key, , required] of schema) {
      if (required) assert.throws(() => validateContent(kind, { ...valid, [key]: '  ' }), /required/);
    }
  }
});
test('registration links must use HTTPS', () => {
  const event = { title: 'Open house', desc: 'Join us', location: 'Hyderabad', date: '2026-10-28' };
  for (const registrationUrl of ['javascript:alert(1)', 'http://example.com', '//example.com']) assert.throws(() => validateContent('events', { ...event, registrationUrl }), /HTTPS/);
  assert.doesNotThrow(() => validateContent('events', event));
});
test('oversized content is rejected', () => {
  assert.throws(() => validateContent('team', { name: 'x'.repeat(5001), role: 'Counsellor' }), /too long/);
});
test('uploads enforce type, extension and size', () => {
  assert.equal(validateImage({ name: 'portrait.JPG', type: 'image/jpeg', size: 2048 }), 'jpg');
  for (const file of [
    { name: 'portrait.svg', type: 'image/svg+xml', size: 10 },
    { name: 'portrait.exe', type: 'image/jpeg', size: 10 },
    { name: 'portrait.png', type: 'image/png', size: 5242881 },
  ]) assert.throws(() => validateImage(file), /under 5 MB/);
});
test('invalid calendar dates are rejected', () => {
  const event = { title: 'Open house', desc: 'Join us', location: 'Hyderabad' };
  for (const date of ['2026-02-30', 'invalid', '2026-13-01']) assert.throws(() => validateContent('events', { ...event, date }), /valid date/);
});
