import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const createDJSchema = z.object({
  stageName: z.string().min(1, 'Stage name is required'),
  realName: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  bioTh: z.string().nullable().optional(),
  genres: z.array(z.string()).optional().default([]),
  baseCity: z.string().optional().default('Bangkok'),
  serviceAreas: z.array(z.string()).optional().default([]),
  hourlyRate: z.number().positive().nullable().optional(),
  minimumHours: z.number().int().positive().optional().default(3),
  languages: z.array(z.string()).optional().default(['English', 'Thai']),
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
 * POST /api/admin/djs
 * Create a new DJ (Artist) from admin panel
 * Creates a "ghost" User record for database relations
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = createDJSchema.parse(body);

    // Generate a unique ghost email for this DJ
    const slugifiedName = data.stageName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const timestamp = Date.now();
    const ghostEmail = `dj-${slugifiedName}-${timestamp}@brightears.local`;

    // Create the DJ in a transaction (User + Artist)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create ghost User record
      const ghostUser = await tx.user.create({
        data: {
          email: ghostEmail,
          name: data.stageName,
          role: 'ARTIST',
          // No password, no clerkId - this is a ghost user
        },
      });

      // 2. Create Artist record
      const artist = await tx.artist.create({
        data: {
          userId: ghostUser.id,
          stageName: data.stageName,
          realName: data.realName || null,
          category: 'DJ',
          bio: data.bio || null,
          bioTh: data.bioTh || null,
          genres: data.genres,
          baseCity: data.baseCity,
          serviceAreas: data.serviceAreas,
          hourlyRate: data.hourlyRate || null,
          minimumHours: data.minimumHours,
          languages: data.languages,
          profileImage: data.profileImage || null,
          coverImage: data.coverImage || null,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
          instagram: data.instagram || null,
          mixcloud: data.mixcloud || null,
          facebook: data.facebook || null,
          tiktok: data.tiktok || null,
          youtube: data.youtube || null,
          spotify: data.spotify || null,
          soundcloud: data.soundcloud || null,
          website: data.website || null,
          lineId: data.lineId || null,
        },
      });

      return { user: ghostUser, artist };
    });

    return NextResponse.json({
      success: true,
      dj: result.artist,
      message: `DJ "${data.stageName}" created successfully`,
    });
  } catch (error) {
    console.error('Error creating DJ:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create DJ' },
      { status: 500 }
    );
  }
}
