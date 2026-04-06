import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAnyRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';
import { sanitizeInput } from '@/lib/api-auth';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * GET /api/dj-portal/profile
 *
 * Get the logged-in DJ's artist profile.
 */
export async function GET(req: NextRequest) {
  return withAnyRole(req, ['ARTIST', 'ADMIN'], async () => {
    try {
      const user = await getCurrentUser();
      const artistId = user?.artist?.id;

      if (!artistId) {
        return NextResponse.json(
          { error: 'Artist profile not found' },
          { status: 404 }
        );
      }

      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        select: {
          id: true,
          stageName: true,
          realName: true,
          bio: true,
          bioTh: true,
          category: true,
          genres: true,
          profileImage: true,
          coverImage: true,
          baseCity: true,
          languages: true,
          website: true,
          facebook: true,
          instagram: true,
          tiktok: true,
          youtube: true,
          spotify: true,
          contactEmail: true,
          contactPhone: true,
        },
      });

      if (!artist) {
        return NextResponse.json(
          { error: 'Artist not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ artist });
    } catch (error) {
      console.error('Error fetching DJ profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }
  });
}

const updateSchema = z.object({
  stageName: z.string().min(1).max(100).optional(),
  category: z.enum(['DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC', 'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER']).optional(),
  baseCity: z.string().max(100).optional(),
  bio: z.string().max(2000).optional(),
  bioTh: z.string().max(2000).optional(),
  genres: z.array(z.string()).optional(),
  contactEmail: z.string().email().or(z.literal('')).optional(),
  lineId: z.string().max(100).optional(),
  website: z.string().url().or(z.literal('')).optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  spotify: z.string().optional(),
  soundcloud: z.string().optional(),
  profileImage: z.string().optional(), // Cloudinary URL or base64 data URL
});

/**
 * PATCH /api/dj-portal/profile
 *
 * Update the logged-in DJ's own profile.
 * Only editable fields — stageName is read-only.
 */
export async function PATCH(req: NextRequest) {
  return withAnyRole(req, ['ARTIST', 'ADMIN'], async () => {
    try {
      const user = await getCurrentUser();
      const artistId = user?.artist?.id;

      if (!artistId) {
        return NextResponse.json(
          { error: 'Artist profile not found' },
          { status: 404 }
        );
      }

      const body = await req.json();
      const validationResult = updateSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid data', details: validationResult.error.issues },
          { status: 400 }
        );
      }

      const data = validationResult.data;

      // Sanitize and map fields
      const updateData: any = {};
      if (data.stageName !== undefined) updateData.stageName = sanitizeInput(data.stageName);
      if (data.category !== undefined) updateData.category = data.category;
      if (data.baseCity !== undefined) updateData.baseCity = sanitizeInput(data.baseCity);
      if (data.bio !== undefined) updateData.bio = sanitizeInput(data.bio);
      if (data.bioTh !== undefined) updateData.bioTh = sanitizeInput(data.bioTh);
      if (data.genres !== undefined) updateData.genres = data.genres;
      if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail || null;
      if (data.lineId !== undefined) updateData.lineId = data.lineId || null;
      if (data.website !== undefined) updateData.website = data.website || null;
      if (data.facebook !== undefined) updateData.facebook = data.facebook || null;
      if (data.instagram !== undefined) updateData.instagram = data.instagram || null;
      if (data.tiktok !== undefined) updateData.tiktok = data.tiktok || null;
      if (data.youtube !== undefined) updateData.youtube = data.youtube || null;
      if (data.spotify !== undefined) updateData.spotify = data.spotify || null;
      if (data.soundcloud !== undefined) updateData.soundcloud = data.soundcloud || null;
      if (data.profileImage !== undefined) updateData.profileImage = data.profileImage || null;

      const updated = await prisma.artist.update({
        where: { id: artistId },
        data: updateData,
        select: {
          id: true,
          stageName: true,
          bio: true,
          bioTh: true,
          genres: true,
          website: true,
          facebook: true,
          instagram: true,
          tiktok: true,
          youtube: true,
          spotify: true,
        },
      });

      return NextResponse.json({ artist: updated });
    } catch (error) {
      console.error('Error updating DJ profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  });
}
