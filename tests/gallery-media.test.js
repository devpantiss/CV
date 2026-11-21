import test from 'node:test';
import assert from 'node:assert/strict';
import { youtubeVideo, validateGallery, validateMedia } from '../src/features/gallery/media.js';

test('YouTube watch, share, shorts, live and embed URLs normalize safely', () => {
  for (const url of ['https://www.youtube.com/watch?v=abcdefghijk&t=12', 'https://youtu.be/abcdefghijk?si=test', 'https://youtube.com/shorts/abcdefghijk', 'https://m.youtube.com/live/abcdefghijk', 'https://www.youtube.com/embed/abcdefghijk']) {
    assert.equal(youtubeVideo(url).url, 'https://www.youtube.com/watch?v=abcdefghijk');
    assert.equal(youtubeVideo(url).thumbnail, 'https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg');
  }
});
test('non-video and unsafe links are rejected', () => {
  for (const url of ['javascript:alert(1)', 'http://youtu.be/abcdefghijk', 'https://youtube.com.evil.com/watch?v=abcdefghijk', 'https://evil.com/abcdefghijk', 'https://youtube.com/@channel', 'https://youtu.be/short', 'https://youtu.be/abcdefghijk<script>']) assert.equal(youtubeVideo(url), null);
});
test('media validates MIME, extension and size across image/video/audio', () => {
  assert.equal(validateMedia({ name: 'moment.GIF', type: 'image/gif', size: 100 }).mediaType, 'image');
  assert.equal(validateMedia({ name: 'moment.mp4', type: 'video/mp4', size: 10485760 }).mediaType, 'video');
  assert.equal(validateMedia({ name: 'interview.mp3', type: 'audio/mpeg', size: 100 }).mediaType, 'audio');
  for (const file of [{ name: 'image.svg', type: 'image/svg+xml', size: 100 }, { name: 'image.exe', type: 'image/jpeg', size: 100 }, { name: 'image.png', type: 'image/png', size: 10485761 }, { name: 'video.mp4', type: 'video/mp4', size: 52428801 }, { name: 'empty.mp3', type: 'audio/mpeg', size: 0 }]) assert.throws(() => validateMedia(file));
});
test('gallery entries require title, known type and valid podcast links', () => {
  assert.doesNotThrow(() => validateGallery({ title: 'A conversation', mediaType: 'podcast', youtubeUrl: 'https://youtu.be/abcdefghijk' }));
  assert.throws(() => validateGallery({ title: '', mediaType: 'image' }), /title/);
  assert.throws(() => validateGallery({ title: 'A conversation', mediaType: 'podcast', youtubeUrl: 'https://example.com' }), /YouTube/);
  assert.throws(() => validateGallery({ title: 'Document', mediaType: 'html' }), /type/);
});
