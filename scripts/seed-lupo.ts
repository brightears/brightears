/**
 * Seed script: Add DJ Lupo and assign to LDK Early Monday slots
 *
 * Creates the DJ profile and updates March 2026 LDK Early Monday assignments
 * from Benji to Lupo, starting Mar 16.
 *
 * Usage: DATABASE_URL="..." npx tsx scripts/seed-lupo.ts
 */

import { PrismaClient, ArtistCategory } from '@prisma/client';

const prisma = new PrismaClient();

const DJ = {
  djId: 'dj-lupo',
  userId: 'user-dj-lupo',
  stageName: 'Lupo',
  email: 'dj-lupo@brightears.io',
  genres: ['Nu Disco', 'Indie Dance', 'House', 'Organic House', 'Classic House', 'Progressive', 'Tech House'],
  bio: 'Born in Stuttgart to Italian parents, Lupo began his musical journey in Berlin\'s late-90s underground. After stints in Mongolia and Bali where he founded a House event label, he now holds residencies at Tribe Beach Club, Aether, Oskar, Gigi Restaurant, Iron Balls and more venues across Bangkok.',
  profileImage: '/images/djs/lupo-photo1.png',
};

// LDK Early Monday assignments to update: Mar 16, 23, 30
const LDK_VENUE_ID = 'le-du-kaan-venue';
const MONDAY_DATES = [16, 23, 30]; // March 2026 Mondays from the 16th

async function main() {
  console.log('='.repeat(60));
  console.log('  ADD DJ LUPO');
  console.log('='.repeat(60));

  // Step 1: Create User
  console.log('\n1. Creating user...');
  const user = await prisma.user.upsert({
    where: { id: DJ.userId },
    update: { name: DJ.stageName },
    create: {
      id: DJ.userId,
      email: DJ.email,
      name: DJ.stageName,
      firstName: 'Lupo',
      role: 'ARTIST',
      isActive: true,
    },
  });
  console.log(`   User: ${user.id} (${user.email})`);

  // Step 2: Create Artist
  console.log('\n2. Creating artist profile...');
  const artist = await prisma.artist.upsert({
    where: { userId: user.id },
    update: {
      stageName: DJ.stageName,
      genres: DJ.genres,
      bio: DJ.bio,
      profileImage: DJ.profileImage,
    },
    create: {
      id: DJ.djId,
      userId: user.id,
      stageName: DJ.stageName,
      category: ArtistCategory.DJ,
      genres: DJ.genres,
      bio: DJ.bio,
      profileImage: DJ.profileImage,
      baseCity: 'Bangkok',
      serviceAreas: ['Bangkok'],
    },
  });
  console.log(`   Artist: ${artist.id} (${artist.stageName})`);

  // Step 3: Update LDK Early Monday assignments from Benji to Lupo
  console.log('\n3. Updating LDK Early Monday assignments (Mar 16, 23, 30)...');

  for (const day of MONDAY_DATES) {
    const dateStr = `march-ldk-early-2026-03-${String(day).padStart(2, '0')}`;

    // Try to find the existing assignment by the known ID pattern
    const existing = await prisma.venueAssignment.findFirst({
      where: {
        venueId: LDK_VENUE_ID,
        date: {
          gte: new Date(Date.UTC(2026, 2, day, 0, 0, 0)),
          lt: new Date(Date.UTC(2026, 2, day + 1, 0, 0, 0)),
        },
        startTime: '18:00',
      },
      include: { artist: { select: { stageName: true } } },
    });

    if (existing) {
      await prisma.venueAssignment.update({
        where: { id: existing.id },
        data: { artistId: artist.id },
      });
      console.log(`   Mar ${day}: Updated ${existing.artist?.stageName || 'unknown'} -> Lupo (${existing.id})`);
    } else {
      // Create new assignment if none exists
      const id = `march-ldk-early-2026-03-${String(day).padStart(2, '0')}`;
      await prisma.venueAssignment.upsert({
        where: { id },
        update: { artistId: artist.id },
        create: {
          id,
          venueId: LDK_VENUE_ID,
          artistId: artist.id,
          date: new Date(Date.UTC(2026, 2, day, 12, 0, 0)),
          startTime: '18:00',
          endTime: '21:00',
          slot: 'EARLY',
          status: 'SCHEDULED',
        },
      });
      console.log(`   Mar ${day}: Created new assignment (${id})`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('  DONE! Lupo added and assigned to LDK Early Mondays.');
  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
