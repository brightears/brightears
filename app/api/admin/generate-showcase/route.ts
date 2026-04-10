/**
 * Admin Showcase Image Generator
 *
 * One-shot endpoint for generating homepage showcase images using Gemini.
 * Protected by SHOWCASE_ADMIN_KEY header — NOT tied to Clerk auth so it can
 * be called from a script on the VPS during content generation work.
 *
 * POST /api/admin/generate-showcase
 * Headers: X-Showcase-Key: <SHOWCASE_ADMIN_KEY>
 * Body: { prompt: string }
 * Response: image/png
 */

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  const expected = process.env.SHOWCASE_ADMIN_KEY;
  const provided = req.headers.get('x-showcase-key');
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image',
      generationConfig: {
        // @ts-expect-error -- responseModalities is supported but not yet in types
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const result = await model.generateContent([{ text: body.prompt }]);
    const candidates = result.response.candidates;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 });
    }

    for (const part of candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const buf = Buffer.from(part.inlineData.data, 'base64');
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': part.inlineData.mimeType || 'image/png',
            'Content-Length': String(buf.length),
          },
        });
      }
    }

    return NextResponse.json({ error: 'No image in Gemini response' }, { status: 500 });
  } catch (err: any) {
    console.error('[showcase] error:', err);
    return NextResponse.json({ error: err?.message || 'Generation failed' }, { status: 500 });
  }
}
