/**
 * Venue Portal — Open Gigs API
 *
 * GET  /api/venue-portal/gigs   List all open gigs owned by the signed-in venue(s)
 * POST /api/venue-portal/gigs   Create a new open gig
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  venueId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  category: z.enum([
    'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC',
    'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER',
  ]),
  genres: z.array(z.string()).max(10).default([]),
  date: z.string().min(1),        // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  budgetMin: z.number().nonnegative().optional().nullable(),
  budgetMax: z.number().nonnegative().optional().nullable(),
  currency: z.string().default('THB'),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For CORPORATE: only their venues; for ADMIN: all venues
    const venueWhere: any = user.role === 'ADMIN'
      ? {}
      : { corporate: { userId: user.id } };

    const venues = await prisma.venue.findMany({
      where: venueWhere,
      select: { id: true },
    });
    const venueIds = venues.map((v) => v.id);

    const gigs = await prisma.openGig.findMany({
      where: { venueId: { in: venueIds } },
      include: {
        venue: { select: { id: true, name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: [{ date: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ gigs });
  } catch (err: any) {
    console.error('[gigs GET] error:', err);
    return NextResponse.json({ error: 'Failed to load gigs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Verify venue ownership (admins bypass)
    if (user.role !== 'ADMIN') {
      const venue = await prisma.venue.findFirst({
        where: { id: data.venueId, corporate: { userId: user.id } },
        select: { id: true },
      });
      if (!venue) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
      }
    }

    const gig = await prisma.openGig.create({
      data: {
        venueId: data.venueId,
        title: data.title,
        description: data.description,
        category: data.category,
        genres: data.genres,
        date: new Date(data.date + 'T00:00:00Z'),
        startTime: data.startTime,
        endTime: data.endTime,
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        currency: data.currency,
      },
      include: {
        venue: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, gig });
  } catch (err: any) {
    console.error('[gigs POST] error:', err);
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
  }
}
