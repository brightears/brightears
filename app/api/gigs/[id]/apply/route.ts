/**
 * Gig Application API (artist applies to an open gig)
 *
 * POST /api/gigs/[id]/apply
 * Requires ARTIST role. One application per artist per gig (unique constraint).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const applySchema = z.object({
  message: z.string().max(1000).optional(),
  quotedRate: z.number().nonnegative().optional().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ARTIST') {
      return NextResponse.json({ error: 'Unauthorized — artist only' }, { status: 401 });
    }
    const { id: gigId } = await params;

    // Find the artist record for this user
    const artist = await prisma.artist.findUnique({
      where: { userId: user.id },
      select: { id: true, stageName: true, isVisible: true },
    });
    if (!artist) {
      return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 });
    }
    if (!artist.isVisible) {
      return NextResponse.json(
        { error: 'Your profile is not currently visible in the marketplace. Contact support.' },
        { status: 403 }
      );
    }

    // Verify the gig exists and is open
    const gig = await prisma.openGig.findUnique({
      where: { id: gigId },
      select: {
        id: true, status: true, date: true, title: true,
        venue: { select: { id: true, name: true } },
      },
    });
    if (!gig) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }
    if (gig.status !== 'OPEN') {
      return NextResponse.json({ error: 'This gig is no longer accepting applications' }, { status: 400 });
    }
    if (gig.date < new Date()) {
      return NextResponse.json({ error: 'This gig has already passed' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const validation = applySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Upsert so re-applying updates instead of erroring on unique constraint
    const application = await prisma.gigApplication.upsert({
      where: {
        gigId_artistId: { gigId, artistId: artist.id },
      },
      create: {
        gigId,
        artistId: artist.id,
        message: validation.data.message || null,
        quotedRate: validation.data.quotedRate ?? null,
      },
      update: {
        message: validation.data.message || null,
        quotedRate: validation.data.quotedRate ?? null,
        status: 'PENDING', // reset to pending if re-applying
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (err: any) {
    console.error('[gig apply] error:', err);
    return NextResponse.json({ error: 'Failed to apply' }, { status: 500 });
  }
}
