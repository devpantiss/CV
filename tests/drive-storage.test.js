import test from 'node:test';
import assert from 'node:assert/strict';
import { signFile, verifyFile, validFileId } from '../supabase/functions/_shared/signing.js';
import { validateUpload } from '../supabase/functions/_shared/file-policy.js';

test('media URLs authenticate the exact file and reject altered signatures', async () => {
  const secret = 'a'.repeat(48);
  const id = 'drive_file_123456789';
  const token = await signFile(id, secret);
  assert.equal(await verifyFile(id, token, secret), true);
  assert.equal(await verifyFile('another_file_123456789', token, secret), false);
  assert.equal(await verifyFile(id, `${token.slice(0, -1)}${token.endsWith('0') ? '1' : '0'}`, secret), false);
  assert.equal(await verifyFile(id, token, 'b'.repeat(48)), false);
  assert.equal(await verifyFile(id, token, ''), false);
  assert.equal(await verifyFile(id, null, secret), false);
});
test('invalid Drive IDs cannot become proxy request paths', async () => {
  for (const id of ['../private', 'https://evil.test', 'abc', 'folder/file123456789', null]) {
    assert.equal(validFileId(id), false);
    assert.equal(await verifyFile(id, 'a'.repeat(64), 'a'.repeat(48)), false);
  }
});
test('server enforces tighter team/event image rules than gallery uploads', () => {
  const video = { name: 'session.mp4', type: 'video/mp4', size: 1000 };
  assert.equal(validateUpload(video, 'gallery').mediaType, 'video');
  for (const kind of ['team', 'events', 'testimonials']) assert.throws(() => validateUpload(video, kind), /JPG/);
  const image = { name: 'portrait.jpg', type: 'image/jpeg', size: 6 * 1024 * 1024 };
  assert.doesNotThrow(() => validateUpload(image, 'gallery'));
  assert.throws(() => validateUpload(image, 'team'), /5 MB/);
  assert.throws(() => validateUpload(image, 'other'), /Unknown/);
});
