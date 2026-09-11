import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';

test('the patched image runtime can decode and resize an ordinary AVIF', async () => {
  const heif = sharp.versions.heif;
  assert.ok(heif, 'The image runtime must include libheif');
  const [major, minor, patch] = heif.split('.').map(Number);
  assert.ok(major > 1 || (major === 1 && (minor > 23 || (minor === 23 && patch >= 2))),
    `Patched libheif required; got ${heif}`);
  const avif = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#00b8d4' } }).avif().toBuffer();
  const source = await sharp(avif).metadata();
  assert.equal(source.width, 8);
  assert.equal(source.height, 8);
  const png = await sharp(avif).resize(4, 4).png().toBuffer();
  const resized = await sharp(png).metadata();
  assert.equal(resized.format, 'png');
  assert.equal(resized.width, 4);
  assert.equal(resized.height, 4);
});
