/**
 * Venue Portal — Single Gig API
 *
 * GET    /api/venue-portal/gigs/[id]    Fetch gig + applicants
 * PATCH  /api/venue-portal/gigs/[id]    Update status (cancel, fill)
 * DELETE /api/venue-portal/gigs/[id]    Delete gig (only if still OPEN)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  status: z.enum(['OPEN', 'FILLED', 'CANCELLED']).optional(),
  filledArtistId: z.string().optional().nullable(),
});

async function ownsGig(userId: string, gigId: string, isAdmin: boolean) {
  if (isAdmin) return true;
  const gig = await prisma.openGig.findFirst({
    where: { id: gigId, venue: { corporate: { userId } } },
    select: { id: true },
  });
  return !!gig;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    if (!(await ownsGig(user.id, id, user.role === 'ADMIN'))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const gig = await prisma.openGig.findUnique({
      where: { id },
      include: {
        venue: { select: { id: true, name: true } },
        applications: {
          include: {
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true,
                bio: true,
                genres: true,
                category: true,
                averageRating: true,
                hourlyRate: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!gig) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ gig });
  } catch (err: any) {
    console.error('[gig GET] error:', err);
    return NextResponse.json({ error: 'Failed to load gig' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    if (!(await ownsGig(user.id, id, user.role === 'ADMIN'))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updated = await prisma.openGig.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({ success: true, gig: updated });
  } catch (err: any) {
    console.error('[gig PATCH] error:', err);
    return NextResponse.json({ error: 'Failed to update gig' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    if (!(await ownsGig(user.id, id, user.role === 'ADMIN'))) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const gig = await prisma.openGig.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!gig) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (gig.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Only OPEN gigs can be deleted. Cancel it first.' },
        { status: 400 }
      );
    }

    await prisma.openGig.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[gig DELETE] error:', err);
    return NextResponse.json({ error: 'Failed to delete gig' }, { status: 500 });
  }
}
