import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  stageName: z.string().min(1).optional(),
  realName: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  bioTh: z.string().nullable().optional(),
  genres: z.array(z.string()).optional(),
  baseCity: z.string().optional(),
  serviceAreas: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().nullable().optional(),
  minimumHours: z.number().int().positive().optional(),
  languages: z.array(z.string()).optional(),
  profileImage: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  mixcloud: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  youtube: z.string().nullable().optional(),
  spotify: z.string().nullable().optional(),
  soundcloud: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  lineId: z.string().nullable().optional(),
});

/**
 * GET /api/admin/djs/[id]
 * Get a single DJ's full profile for editing
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!artist) {
      return NextResponse.json({ error: 'DJ not found' }, { status: 404 });
    }

    // Get feedback stats
    const feedbackStats = await prisma.venueFeedback.aggregate({
      where: { artistId: id },
      _count: { id: true },
      _avg: { overallRating: true },
    });

    // Get assignment stats
    const assignmentStats = await prisma.venueAssignment.groupBy({
      by: ['status'],
      where: { artistId: id },
      _count: { id: true },
    });

    const totalAssignments = assignmentStats.reduce(
      (sum, s) => sum + s._count.id,
      0
    );
    const completedAssignments =
      assignmentStats.find((s) => s.status === 'COMPLETED')?._count.id || 0;

    // Get venues this DJ has worked at
    const venueAssignments = await prisma.venueAssignment.findMany({
      where: { artistId: id },
      select: {
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ['venueId'],
    });

    const venues = venueAssignments.map((a) => a.venue);

    return NextResponse.json({
      artist,
      stats: {
        totalFeedback: feedbackStats._count.id,
        avgRating: feedbackStats._avg.overallRating
          ? Math.round(feedbackStats._avg.overallRating * 10) / 10
          : null,
        totalAssignments,
        completedAssignments,
      },
      venues,
    });
  } catch (error) {
    console.error('Error fetching DJ:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DJ' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/djs/[id]
 * Update a DJ's profile
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Validate the update data
    const validatedData = updateSchema.parse(body);

    // Check if DJ exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id },
    });

    if (!existingArtist) {
      return NextResponse.json({ error: 'DJ not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Only include fields that are actually in the update request
    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        if (key === 'hourlyRate') {
          updateData[key] = value === null ? null : value;
        } else {
          updateData[key] = value;
        }
      }
    }

    // Update the artist
    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      artist: updatedArtist,
    });
  } catch (error) {
    console.error('Error updating DJ:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update DJ' },
      { status: 500 }
    );
  }
}
