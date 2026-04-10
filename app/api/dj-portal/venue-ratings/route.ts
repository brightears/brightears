/**
 * Artist-rates-venue mutual rating API
 *
 * GET  /api/dj-portal/venue-ratings              list MY ratings
 * POST /api/dj-portal/venue-ratings              create or update a rating
 *
 * Body for POST: {
 *   venueId: string
 *   paidOnTime: 1-5
 *   soundQuality: 1-5
 *   crowdTreatment: 1-5
 *   wouldReturn: 1-5
 *   notes?: string
 * }
 *
 * Rules:
 * - Only artists (ARTIST role) can rate
 * - Artist must have at least one COMPLETED VenueAssignment at the venue
 *   to be eligible to rate it (prevents spam / off-platform grudges)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  venueId: z.string().min(1),
  paidOnTime: z.number().int().min(1).max(5),
  soundQuality: z.number().int().min(1).max(5),
  crowdTreatment: z.number().int().min(1).max(5),
  wouldReturn: z.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ARTIST') {
    return NextResponse.json({ error: 'Unauthorized — artist only' }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!artist) {
    return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 });
  }

  const ratings = await prisma.artistVenueRating.findMany({
    where: { artistId: artist.id },
    include: {
      venue: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ ratings });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ARTIST') {
    return NextResponse.json({ error: 'Unauthorized — artist only' }, { status: 401 });
  }

  const artist = await prisma.artist.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!artist) {
    return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 });
  }

  const body = await req.json();
  const validation = createSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.issues },
      { status: 400 }
    );
  }
  const data = validation.data;

  // Verify the artist has actually played at this venue
  const eligibility = await prisma.venueAssignment.findFirst({
    where: {
      artistId: artist.id,
      venueId: data.venueId,
      status: 'COMPLETED',
    },
    select: { id: true },
  });
  if (!eligibility) {
    return NextResponse.json(
      { error: 'You can only rate venues you have completed at least one gig at.' },
      { status: 403 }
    );
  }

  // Upsert — one rating per (artist, venue) pair
  const rating = await prisma.artistVenueRating.upsert({
    where: {
      artistId_venueId: {
        artistId: artist.id,
        venueId: data.venueId,
      },
    },
    create: {
      artistId: artist.id,
      venueId: data.venueId,
      paidOnTime: data.paidOnTime,
      soundQuality: data.soundQuality,
      crowdTreatment: data.crowdTreatment,
      wouldReturn: data.wouldReturn,
      notes: data.notes || null,
    },
    update: {
      paidOnTime: data.paidOnTime,
      soundQuality: data.soundQuality,
      crowdTreatment: data.crowdTreatment,
      wouldReturn: data.wouldReturn,
      notes: data.notes || null,
    },
  });

  return NextResponse.json({ success: true, rating });
}
