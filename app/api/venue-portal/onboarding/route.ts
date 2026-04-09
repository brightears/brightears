import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { clerkClient } from '@clerk/nextjs/server';
import { z } from 'zod';

const onboardingSchema = z.object({
  venueName: z.string().min(1, 'Venue name is required').max(200),
  venueType: z.string().min(1),
  city: z.string().max(100).default('Bangkok'),
  address: z.string().max(500).optional(),
  contactPerson: z.string().min(1, 'Contact person is required').max(200),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email().optional(),
  startTime: z.string().default('18:00'),
  endTime: z.string().default('02:00'),
  musicStyles: z.array(z.string()).default([]),
  slotsPerNight: z.number().min(1).max(3).default(1),
});

/**
 * POST /api/venue-portal/onboarding
 *
 * Self-service venue onboarding. Converts the auto-provisioned ARTIST user
 * to a CORPORATE user with Corporate + Venue records.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = onboardingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if user already has a Corporate record (already onboarded)
    const existingCorporate = await prisma.corporate.findFirst({
      where: { userId: user.id },
    });

    if (existingCorporate) {
      return NextResponse.json(
        { error: 'Venue already registered. Go to your dashboard.' },
        { status: 400 }
      );
    }

    // Create everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete the auto-provisioned Artist record (unused, just created at sign-up)
      if (user.artist?.id) {
        await tx.artist.delete({ where: { id: user.artist.id } }).catch(() => {});
      }

      // 2. Update User role to CORPORATE
      await tx.user.update({
        where: { id: user.id },
        data: {
          role: 'CORPORATE',
          name: data.contactPerson,
        },
      });

      // 3. Create Corporate record
      const corporate = await tx.corporate.create({
        data: {
          userId: user.id,
          companyName: data.venueName,
          contactPerson: data.contactPerson,
          companyPhone: data.contactPhone || null,
        },
      });

      // 4. Create Venue record
      const venue = await tx.venue.create({
        data: {
          corporateId: corporate.id,
          name: data.venueName,
          venueType: data.venueType,
          city: data.city,
          address: data.address || null,
          operatingHours: {
            startTime: data.startTime,
            endTime: data.endTime,
            hasMultipleSlots: data.slotsPerNight > 1,
            slots: [],
          },
          contactPerson: data.contactPerson,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          isActive: true,
        },
      });

      return { corporate, venue };
    });

    // 5. Update Clerk publicMetadata so auth-redirect knows the new role
    try {
      const client = await clerkClient();
      await client.users.updateUser(user.id, {
        publicMetadata: { role: 'CORPORATE' },
      });
    } catch (e) {
      // Non-critical — role will be detected from DB on next login
      console.warn('Failed to update Clerk metadata:', e);
    }

    return NextResponse.json({
      success: true,
      venueId: result.venue.id,
      corporateId: result.corporate.id,
    });
  } catch (error: any) {
    console.error('Venue onboarding error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register venue' },
      { status: 500 }
    );
  }
}
