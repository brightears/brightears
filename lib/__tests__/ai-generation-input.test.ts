import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_GENERATION_REQUEST_BYTES, MAX_IMAGE_BYTES, readGenerationInput, validateGenerationInput } from '../ai-generation-input';
import { AiGenerationError } from '../ai-generation-policy';

const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aBl8AAAAASUVORK5CYII=';
const valid = { image: png, imageMimeType: 'image/png', contentType: 'EVENT_POSTER', artistName: 'ดีเจ ดนตรี / DJ Music', venueName: 'กรุงเทพ Bangkok', genre: 'Thai & English', eventDate: '2028-02-29', customPrompt: 'เพลงสด tonight' };
const status = (code: number) => (error: unknown) => error instanceof AiGenerationError && error.status === code;

test('accepts bounded Thai/English fields, valid leap dates and supported image signatures', async () => {
  assert.deepEqual(validateGenerationInput(valid), valid);
  const jpeg = Buffer.from([255, 216, 255, 224, 0, 0]).toString('base64');
  const webp = Buffer.from('RIFF0000WEBPVP8 ').toString('base64');
  for (const [image, imageMimeType] of [[jpeg, 'image/jpeg'], [webp, 'image/webp']]) {
    assert.equal(validateGenerationInput({ ...valid, image, imageMimeType }).imageMimeType, imageMimeType);
  }
  assert.deepEqual(await readGenerationInput(new Request('http://fixture.invalid', { method: 'POST', body: JSON.stringify(valid) })), valid);
});

test('rejects invalid dates, unknown fields, overlong text and unsupported content types', () => {
  for (const changed of [
    { eventDate: '2026-02-29' }, { eventDate: '2026-04-31' }, { eventDate: '2026-13-01' },
    { eventDate: '2026-09-11T00:00:00Z' }, { eventDate: 'not a date' }, { privateData: 'not accepted' },
    { artistName: 'ก'.repeat(161) }, { venueName: 'x'.repeat(201) }, { genre: 'x'.repeat(121) },
    { customPrompt: 'x'.repeat(501) }, { contentType: 'UNBOUNDED' }, { imageMimeType: 'image/svg+xml' },
  ]) assert.throws(() => validateGenerationInput({ ...valid, ...changed }), status(400));
});

test('rejects MIME mismatch, malformed/noncanonical base64, data URLs and non-image bytes', () => {
  for (const changed of [
    { imageMimeType: 'image/jpeg' }, { image: png + '\n' }, { image: 'data:image/png;base64,' + png },
    { image: '!!!!' }, { image: 'Zg=' }, { image: 'Zh==' }, { image: '' },
    { image: Buffer.from('<svg>not an image</svg>').toString('base64') },
  ]) assert.throws(() => validateGenerationInput({ ...valid, ...changed }), status(400));
});

test('accepts exactly 10 MiB and rejects a decoded image one byte above the limit', () => {
  const bytes = Buffer.alloc(MAX_IMAGE_BYTES + 1);
  Buffer.from(png, 'base64').copy(bytes);
  assert.equal(validateGenerationInput({ ...valid, image: bytes.subarray(0, MAX_IMAGE_BYTES).toString('base64') }).image.length > 0, true);
  assert.throws(() => validateGenerationInput({ ...valid, image: bytes.toString('base64') }), status(413));
});

test('checks declared size before reading and rejects nonnumeric size', async () => {
  for (const [size, code] of [[String(MAX_GENERATION_REQUEST_BYTES + 1), 413], ['NaN', 400], ['-1', 400]] as const) {
    const request = new Request('http://fixture.invalid', { method: 'POST', headers: { 'content-length': size }, body: 'must not parse' });
    await assert.rejects(readGenerationInput(request), status(code));
    assert.equal(request.bodyUsed, false);
  }
});

test('counts streamed bytes even when Content-Length is missing or falsely small; cancels oversized stream', async () => {
  for (const declared of [undefined, '1']) {
    let cancelled = false;
    const request = new Request('http://fixture.invalid', { method: 'POST', ...(declared ? { headers: { 'content-length': declared } } : {}),
      body: new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new Uint8Array(MAX_GENERATION_REQUEST_BYTES)); controller.enqueue(new Uint8Array(1)); }, cancel() { cancelled = true; } }),
      duplex: 'half',
    } as RequestInit);
    await assert.rejects(readGenerationInput(request), status(413));
    assert.equal(cancelled, true);
  }
});

test('rejects malformed JSON and invalid UTF-8 without exposing body contents', async () => {
  for (const body of ['{"secret":"fixture-private-body"', new Uint8Array([255, 254])]) {
    const request = new Request('http://fixture.invalid', { method: 'POST', body });
    await assert.rejects(readGenerationInput(request), (error: unknown) => status(400)(error) && !(error as Error).message.includes('fixture-private-body'));
  }
});
