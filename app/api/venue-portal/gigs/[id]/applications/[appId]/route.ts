/**
 * Venue Portal — Update a single gig application status
 *
 * PATCH /api/venue-portal/gigs/[id]/applications/[appId]
 * Body: { status: 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'DECLINED' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  status: z.enum(['PENDING', 'SHORTLISTED', 'ACCEPTED', 'DECLINED']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'CORPORATE' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: gigId, appId } = await params;

    // Verify ownership
    const gig = await prisma.openGig.findFirst({
      where: {
        id: gigId,
        ...(user.role === 'ADMIN' ? {} : { venue: { corporate: { userId: user.id } } }),
      },
      select: { id: true },
    });
    if (!gig) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const updated = await prisma.gigApplication.update({
      where: { id: appId, gigId },
      data: { status: validation.data.status },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (err: any) {
    console.error('[application PATCH] error:', err);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
