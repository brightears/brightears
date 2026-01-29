import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const onboardingSchema = z.object({
  company: z.object({
    companyName: z.string().min(1),
    contactPerson: z.string().min(1),
    position: z.string().optional(),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  venue: z.object({
    venueName: z.string().min(1),
    venueType: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    hasMultipleSlots: z.boolean(),
    slots: z.array(
      z.object({
        name: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    ),
  }),
  assignedDJs: z.array(
    z.object({
      djId: z.string(),
      djName: z.string(),
    })
  ),
  schedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      slotIndex: z.number(),
      djId: z.string().nullable(),
    })
  ),
  credentials: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    sendWelcomeEmail: z.boolean(),
  }),
});

/**
 * POST /api/admin/venues/create
 * Create a new venue with corporate user, venue assignments, and schedule
 */
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = onboardingSchema.parse(body);

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.credentials.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.credentials.password, 12);

    // Create everything in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User with CORPORATE role
      const user = await tx.user.create({
        data: {
          email: data.credentials.email,
          name: data.company.contactPerson,
          password: hashedPassword,
          role: 'CORPORATE',
          phone: data.company.phone,
        },
      });

      // 2. Create Corporate record
      const corporate = await tx.corporate.create({
        data: {
          userId: user.id,
          companyName: data.company.companyName,
          contactPerson: data.company.contactPerson,
          position: data.company.position || null,
          companyPhone: data.company.phone,
        },
      });

      // 3. Create Venue record
      const venue = await tx.venue.create({
        data: {
          corporateId: corporate.id,
          name: data.venue.venueName,
          venueType: data.venue.venueType,
          operatingHours: {
            startTime: data.venue.startTime,
            endTime: data.venue.endTime,
            hasMultipleSlots: data.venue.hasMultipleSlots,
            slots: data.venue.hasMultipleSlots ? data.venue.slots : [],
          },
          contactPerson: data.company.contactPerson,
          contactEmail: data.company.email,
          contactPhone: data.company.phone,
          isActive: true,
        },
      });

      // 4. Create initial schedule (VenueAssignment records for recurring schedule)
      // This creates assignments for the next 4 weeks based on the weekly schedule
      if (data.schedule.length > 0) {
        const today = new Date();
        const slots = data.venue.hasMultipleSlots ? data.venue.slots : [{ name: 'Main', startTime: data.venue.startTime, endTime: data.venue.endTime }];

        for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
          for (const scheduleEntry of data.schedule) {
            if (!scheduleEntry.djId) continue;

            // Calculate the date for this day of week
            const date = new Date(today);
            const currentDay = today.getDay();
            const daysUntil = (scheduleEntry.dayOfWeek - currentDay + 7) % 7;
            date.setDate(today.getDate() + daysUntil + weekOffset * 7);

            // Skip if in the past
            if (date < today) continue;

            const slot = slots[scheduleEntry.slotIndex];
            if (!slot) continue;

            await tx.venueAssignment.create({
              data: {
                venueId: venue.id,
                artistId: scheduleEntry.djId,
                date: date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                slot: data.venue.hasMultipleSlots ? slot.name : null,
                status: 'SCHEDULED',
              },
            });
          }
        }
      }

      return { user, corporate, venue };
    });

    // TODO: Send welcome email if sendWelcomeEmail is true
    // This would use Resend or similar service

    return NextResponse.json({
      success: true,
      data: {
        userId: result.user.id,
        corporateId: result.corporate.id,
        venueId: result.venue.id,
        venueName: result.venue.name,
      },
    });
  } catch (error) {
    console.error('Error creating venue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}
