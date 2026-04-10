import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateContentImage } from '@/lib/api/gemini-image-client';

// Allow longer execution for image generation (Gemini takes 8-30s)
export const maxDuration = 60;

// Increase body size limit for base64 image payloads
export const runtime = 'nodejs';

// Monthly generation limit for free tier
// 2026-04-10: bumped from 3 → 12. Market norm for AI creator tools in 2026 is
// double-digit free tier (Canva effectively unlimited, Suno 50/day, Picsart ~20/mo).
// A 3/mo free tier was creating churn at first-use.
const FREE_MONTHLY_LIMIT = 12;
// Max request body size consideration — base64 images can be large
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const generateSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  imageMimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  contentType: z.enum(['INSTAGRAM_POST', 'EVENT_POSTER', 'INSTAGRAM_STORY', 'EPK_HEADER', 'SOCIAL_BANNER']),
  artistName: z.string().optional(),
  venueName: z.string().optional(),
  eventDate: z.string().optional(),
  genre: z.string().optional(),
  customPrompt: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate — allow any logged-in user (ARTIST, ADMIN, CUSTOMER)
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse body
    const body = await req.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { image, imageMimeType, contentType, artistName, venueName, eventDate, genre, customPrompt } = validation.data;

    // Check image size (base64 string length * 0.75 ≈ bytes)
    const estimatedBytes = image.length * 0.75;
    if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image too large. Maximum 10MB.' }, { status: 400 });
    }

    // Get or create credit account
    let creditAccount = await prisma.creditAccount.findUnique({
      where: { userId: user.id },
    });

    if (!creditAccount) {
      creditAccount = await prisma.creditAccount.create({
        data: {
          userId: user.id,
          balance: FREE_MONTHLY_LIMIT,
          freeMonthlyUsed: 0,
          freeMonthlyResetAt: new Date(),
        },
      });
    }

    // Reset free monthly credits if it's a new month
    const now = new Date();
    const resetDate = new Date(creditAccount.freeMonthlyResetAt);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      creditAccount = await prisma.creditAccount.update({
        where: { id: creditAccount.id },
        data: {
          freeMonthlyUsed: 0,
          freeMonthlyResetAt: now,
          balance: creditAccount.balance + FREE_MONTHLY_LIMIT, // Add new free credits
        },
      });
    }

    // Check credits
    if (creditAccount.balance <= 0) {
      return NextResponse.json({
        error: 'No credits remaining. Purchase more credits to continue generating content.',
        usage: {
          balance: creditAccount.balance,
          freeUsed: creditAccount.freeMonthlyUsed,
          freeLimit: FREE_MONTHLY_LIMIT,
        },
      }, { status: 402 });
    }

    // Create pending generation record
    const generation = await prisma.aIGeneration.create({
      data: {
        userId: user.id,
        artistId: user.role === 'ARTIST' ? (user as any).artist?.id : undefined,
        contentType: contentType as any,
        artistName,
        venueName,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        genre,
        customPrompt,
        status: 'PENDING',
      },
    });

    const startTime = Date.now();

    try {
      // Generate content with Gemini
      const result = await generateContentImage({
        sourceImageBase64: image,
        sourceMimeType: imageMimeType,
        contentType,
        artistName,
        venueName,
        eventDate,
        genre,
        customPrompt,
      });

      const processingTime = Date.now() - startTime;

      // For MVP: return the base64 image directly (skip Cloudinary upload)
      // The client can display it and offer download
      const imageDataUrl = `data:${result.imageMimeType};base64,${result.imageBase64}`;

      // Update generation record
      await prisma.aIGeneration.update({
        where: { id: generation.id },
        data: {
          generatedImageUrl: imageDataUrl.substring(0, 500), // Store truncated for reference
          caption: result.caption,
          hashtags: result.hashtags,
          status: 'COMPLETED',
          processingTimeMs: processingTime,
        },
      });

      // Deduct credit
      await prisma.creditAccount.update({
        where: { id: creditAccount.id },
        data: {
          balance: { decrement: 1 },
          totalUsed: { increment: 1 },
          freeMonthlyUsed: { increment: 1 },
        },
      });

      // Log credit transaction
      await prisma.creditTransaction.create({
        data: {
          accountId: creditAccount.id,
          type: 'USAGE',
          amount: -1,
          description: `Generated ${contentType.toLowerCase().replace('_', ' ')}`,
          relatedGenerationId: generation.id,
        },
      });

      return NextResponse.json({
        success: true,
        generationId: generation.id,
        imageDataUrl,
        caption: result.caption,
        hashtags: result.hashtags,
        processingTimeMs: processingTime,
        usage: {
          balance: creditAccount.balance - 1,
          freeUsed: creditAccount.freeMonthlyUsed + 1,
          freeLimit: FREE_MONTHLY_LIMIT,
        },
      });
    } catch (genError: any) {
      const processingTime = Date.now() - startTime;

      // Update generation as failed
      await prisma.aIGeneration.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
          errorMessage: genError.message,
          processingTimeMs: processingTime,
        },
      });

      // Don't deduct credit on failure
      if (genError.message?.includes('quota') || genError.status === 429) {
        return NextResponse.json({ error: 'AI service is temporarily busy. Please try again in a few minutes.' }, { status: 429 });
      }

      if (genError.message?.includes('SAFETY') || genError.message?.includes('filtered')) {
        return NextResponse.json({ error: 'The image could not be processed. Try a different photo.' }, { status: 422 });
      }

      return NextResponse.json({ error: 'Content generation failed. Please try again.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('AI content generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — return usage stats
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let creditAccount = await prisma.creditAccount.findUnique({
      where: { userId: user.id },
    });

    if (!creditAccount) {
      creditAccount = await prisma.creditAccount.create({
        data: {
          userId: user.id,
          balance: FREE_MONTHLY_LIMIT,
        },
      });
    }

    // Get generation history
    const recentGenerations = await prisma.aIGeneration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        contentType: true,
        artistName: true,
        venueName: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      credits: {
        balance: creditAccount.balance,
        totalPurchased: creditAccount.totalPurchased,
        totalUsed: creditAccount.totalUsed,
        freeMonthlyUsed: creditAccount.freeMonthlyUsed,
        freeMonthlyLimit: FREE_MONTHLY_LIMIT,
      },
      recentGenerations,
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
