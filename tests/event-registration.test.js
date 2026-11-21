import test from 'node:test';
import assert from 'node:assert/strict';
import { registrationDetails } from '../src/features/events/validation.js';
const input = { name: ' Student ', email: 'STUDENT@EXAMPLE.COM ', phone: '+91 98765 43210', institution: 'College', city: 'Raipur', consent: true };
test('direct event registration normalizes details and strips untrusted fields', () => {
  const details = registrationDetails({ ...input, event_id: 'override', admin: true });
  assert.equal(details.name, 'Student'); assert.equal(details.email, 'student@example.com'); assert.equal(details.event_id, undefined); assert.equal(details.admin, undefined);
});
test('registrations require valid contact details, bounded fields and explicit consent', () => {
  for (const change of [{ email: 'invalid' }, { phone: 'hello' }, { consent: false }, { consent: 'true' }, { institution: '' }, { name: 'x'.repeat(101) }, { city: 'a\nb' }]) assert.throws(() => registrationDetails({ ...input, ...change }));
});
