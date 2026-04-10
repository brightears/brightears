/**
 * Aggregated venue ratings (artist-side only visibility)
 *
 * GET /api/venues/[id]/ratings
 * Returns aggregate venue ratings from artists who've played there.
 * Only accessible to signed-in ARTIST role (privacy protection —
 * we don't want venues seeing their own artist ratings, and we don't
 * want it public).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ARTIST') {
    return NextResponse.json({ error: 'Unauthorized — artist only' }, { status: 401 });
  }

  const { id } = await params;

  const ratings = await prisma.artistVenueRating.findMany({
    where: { venueId: id },
    select: {
      paidOnTime: true,
      soundQuality: true,
      crowdTreatment: true,
      wouldReturn: true,
      notes: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (ratings.length === 0) {
    return NextResponse.json({
      count: 0,
      averages: null,
      recentNotes: [],
    });
  }

  const avg = (field: keyof (typeof ratings)[0]) =>
    ratings.reduce((sum, r) => sum + (r[field] as number), 0) / ratings.length;

  return NextResponse.json({
    count: ratings.length,
    averages: {
      paidOnTime: Number(avg('paidOnTime').toFixed(1)),
      soundQuality: Number(avg('soundQuality').toFixed(1)),
      crowdTreatment: Number(avg('crowdTreatment').toFixed(1)),
      wouldReturn: Number(avg('wouldReturn').toFixed(1)),
      overall: Number(
        (
          (avg('paidOnTime') + avg('soundQuality') + avg('crowdTreatment') + avg('wouldReturn')) / 4
        ).toFixed(1)
      ),
    },
    recentNotes: ratings
      .filter((r) => r.notes)
      .slice(0, 5)
      .map((r) => ({ notes: r.notes, createdAt: r.createdAt })),
  });
}
