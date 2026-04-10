/**
 * Public Gigs API
 *
 * GET /api/gigs   List all OPEN open-gigs across the platform (for artists to browse).
 * Supports optional filters: category, city, upcoming.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const limit = Math.min(Number(searchParams.get('limit') || '50'), 100);

    const where: any = {
      status: 'OPEN',
      date: { gte: new Date() },
    };
    if (category) where.category = category;
    if (city) where.venue = { city };

    const gigs = await prisma.openGig.findMany({
      where,
      include: {
        venue: {
          select: { id: true, name: true, city: true, venueType: true },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { date: 'asc' },
      take: limit,
    });

    return NextResponse.json({ gigs });
  } catch (err: any) {
    console.error('[public gigs GET] error:', err);
    return NextResponse.json({ error: 'Failed to load gigs' }, { status: 500 });
  }
}
