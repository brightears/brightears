import { z } from 'zod';
import { AiGenerationError } from './ai-generation-policy';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_BASE64_CHARACTERS = 4 * Math.ceil(MAX_IMAGE_BYTES / 3);
export const MAX_GENERATION_REQUEST_BYTES = MAX_IMAGE_BASE64_CHARACTERS + 16 * 1024;

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
const inputSchema = z.object({
  image: z.string().min(1).max(MAX_IMAGE_BASE64_CHARACTERS),
  imageMimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  contentType: z.enum(['INSTAGRAM_POST', 'EVENT_POSTER', 'INSTAGRAM_STORY', 'EPK_HEADER', 'SOCIAL_BANNER']),
  artistName: z.string().max(160).optional(),
  venueName: z.string().max(200).optional(),
  eventDate: z.string().refine(validDate).optional(),
  genre: z.string().max(120).optional(),
  customPrompt: z.string().max(500).optional(),
}).strict();
export type AiGenerationInput = z.infer<typeof inputSchema>;

export function validateGenerationInput(value: unknown): AiGenerationInput {
  const parsed = inputSchema.safeParse(value);
  if (!parsed.success) throw new AiGenerationError(400, 'Invalid input. Check the photo, date and text fields.');
  const input = parsed.data;
  // Buffer.from is permissive; require canonical base64 rather than silently
  // discarding invalid characters or accepting a data URL as image bytes.
  if (input.image.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(input.image)) throw new AiGenerationError(400, 'The photo must contain valid base64 image data.');
  const bytes = Buffer.from(input.image, 'base64');
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new AiGenerationError(413, 'Image too large. Maximum 10MB.');
  if (!bytes.length || bytes.toString('base64') !== input.image) throw new AiGenerationError(400, 'The photo must contain valid base64 image data.');
  const png = bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && bytes.toString('ascii', 12, 16) === 'IHDR';
  const jpeg = bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.length >= 16 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' && ['VP8 ', 'VP8L', 'VP8X'].includes(bytes.toString('ascii', 12, 16));
  const matches = input.imageMimeType === 'image/png' ? png : input.imageMimeType === 'image/jpeg' ? jpeg : webp;
  if (!matches) throw new AiGenerationError(400, 'The photo data does not match a supported image format.');
  return input;
}

/** Count actual streamed bytes before decoding/parsing, even without Content-Length. */
export async function readGenerationInput(request: Request): Promise<AiGenerationInput> {
  const length = request.headers.get('content-length');
  if (length !== null) {
    if (!/^\d+$/.test(length)) throw new AiGenerationError(400, 'Invalid request size.');
    if (Number(length) > MAX_GENERATION_REQUEST_BYTES) throw new AiGenerationError(413, 'Request too large. Maximum photo size is 10MB.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new AiGenerationError(400, 'A photo and content type are required.');
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > MAX_GENERATION_REQUEST_BYTES) {
        await reader.cancel();
        throw new AiGenerationError(413, 'Request too large. Maximum photo size is 10MB.');
      }
      chunks.push(part.value);
    }
  } finally { reader.releaseLock(); }
  let value: unknown;
  try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks, total))); }
  catch { throw new AiGenerationError(400, 'Invalid JSON request.'); }
  return validateGenerationInput(value);
}
