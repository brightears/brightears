/**
 * Gemini AI Image Generation Client for BrightEars
 *
 * Uses Gemini 2.0 Flash with image output modality to generate
 * promotional content from uploaded artist/venue photos.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildContentPrompt, parseGeneratedText, type ContentType } from './ai-content-prompts';
import { AiProviderError, GENERATION_TIMEOUT_MS } from '../ai-generation-policy';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  GOOGLE_GEMINI_API_KEY not found - AI content generation will be disabled');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const isImageGenerationConfigured = () => genAI !== null;

export interface GenerateContentInput {
  sourceImageBase64: string;
  sourceMimeType: string;
  contentType: ContentType;
  artistName?: string;
  venueName?: string;
  eventDate?: string;
  genre?: string;
  customPrompt?: string;
}

export interface GenerateContentResult {
  imageBase64: string;
  imageMimeType: string;
  caption: string;
  hashtags: string[];
}

/**
 * Generate promotional content image + caption using Gemini 2.0 Flash.
 *
 * Sends the user's photo + a structured prompt to Gemini, which returns
 * a generated promotional image and text content (caption + hashtags).
 */
export async function generateContentImage(input: GenerateContentInput): Promise<GenerateContentResult> {
  if (!genAI) {
    throw new AiProviderError('unavailable');
  }

  const prompt = buildContentPrompt(input.contentType, {
    artistName: input.artistName,
    venueName: input.venueName,
    eventDate: input.eventDate,
    genre: input.genre,
    customPrompt: input.customPrompt,
  });

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      // @ts-expect-error -- responseModalities is supported but not yet in types
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
  timer.unref?.();
  let result;
  try {
    result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: input.sourceMimeType,
        data: input.sourceImageBase64,
      },
    },
    ], { signal: controller.signal });
  } catch (error) {
    // SDK error URLs can contain API keys. Never log or persist their text.
    const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
    const details = typeof error === 'object' && error !== null && 'errorDetails' in error ? error.errorDetails : undefined;
    const configurationFailure = Array.isArray(details) && details.some(detail => {
      const reason = typeof detail === 'object' && detail !== null && 'reason' in detail ? detail.reason : undefined;
      return typeof reason === 'string' && /^(API_KEY_|BILLING_|CREDENTIALS_|ACCESS_TOKEN_|IAM_)|^(SERVICE_DISABLED|CONSUMER_INVALID|PERMISSION_DENIED|ACCESS_DENIED)$/.test(reason);
    });
    // Explicit rejection statuses only. A timeout/cancel (408/499) does not
    // prove that provider work stopped or was never accepted.
    if (!controller.signal.aborted && typeof status === 'number' && [400, 401, 402, 403, 404, 405, 412, 413, 415, 422, 429].includes(status)) {
      throw new AiProviderError(configurationFailure ? 'unavailable' : status === 429 ? 'quota' : status === 400 ? 'rejected' : 'unavailable');
    }
    throw new AiProviderError('unknown');
  } finally { clearTimeout(timer); }

  const response = result.response;
  const candidates = response.candidates;
  if (response.promptFeedback?.blockReason && response.promptFeedback.blockReason !== 'BLOCKED_REASON_UNSPECIFIED') {
    throw new AiProviderError('rejected');
  }
  if (!candidates?.length) throw new AiProviderError('unknown');
  const candidate = candidates[0];
  if (candidate.finishReason && ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII', 'IMAGE_SAFETY'].includes(candidate.finishReason)) {
    throw new AiProviderError('rejected');
  }
  if (!Array.isArray(candidate.content?.parts)) throw new AiProviderError('unknown');

  let imageBase64 = '';
  let imageMimeType = 'image/png';
  let textContent = '';

  // Parse response parts — separate image data from text
  for (const part of candidate.content.parts) {
    if (part.inlineData) {
      imageBase64 = part.inlineData.data;
      imageMimeType = part.inlineData.mimeType || 'image/png';
    }
    if (part.text) {
      textContent += part.text;
    }
  }

  if (!imageBase64) {
    // Fallback: if Gemini doesn't return an image, try text-only model
    // and generate image separately. For MVP, just throw.
    throw new AiProviderError('rejected');
  }

  const { caption, hashtags } = parseGeneratedText(textContent);

  return {
    imageBase64,
    imageMimeType,
    caption: caption || `${input.artistName || 'Live entertainment'} ${input.venueName ? `at ${input.venueName}` : ''} 🎵`,
    hashtags: hashtags.length > 0 ? hashtags : ['#BrightEars', '#LiveEntertainment', '#Bangkok'],
  };
}

/**
 * Generate caption and hashtags only (no image generation).
 * Uses the standard text model — cheaper and faster.
 * Good for when the user already has an image and just needs copy.
 */
export async function generateCaptionOnly(input: {
  contentType: ContentType;
  artistName?: string;
  venueName?: string;
  eventDate?: string;
  genre?: string;
}): Promise<{ caption: string; hashtags: string[] }> {
  if (!genAI) {
    throw new Error('Gemini API not configured.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 300,
    },
  });

  const prompt = `Write Instagram content for a ${input.genre || 'music'} performance ${input.artistName ? `by ${input.artistName}` : ''} ${input.venueName ? `at ${input.venueName}` : ''} ${input.eventDate ? `on ${input.eventDate}` : ''}.

Return in this exact format:
---CAPTION---
Write a 2-3 sentence engaging caption. Nightlife/entertainment tone. Professional but fun.
---HASHTAGS---
10 relevant hashtags including #BrightEars`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return parseGeneratedText(text);
}
