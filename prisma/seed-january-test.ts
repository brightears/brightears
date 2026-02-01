/**
 * Seed Script: January 2026 Test Assignments
 *
 * Adds COMPLETED assignments in January 2026 for testing:
 * - Feedback submission
 * - Night reports
 * - Statistics page
 *
 * Run with: npx tsx prisma/seed-january-test.ts
 */

import { PrismaClient, VenueAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎵 Creating January 2026 test assignments...\n');

  // Get existing venues
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true },
  });

  if (venues.length === 0) {
    console.error('❌ No venues found. Run seed-nobu.ts first.');
    return;
  }

  console.log(`Found ${venues.length} venues:`, venues.map(v => v.name).join(', '));

  // Get existing artists
  const artists = await prisma.artist.findMany({
    select: { id: true, stageName: true },
    take: 10,
  });

  if (artists.length === 0) {
    console.error('❌ No artists found. Run seed-nobu.ts first.');
    return;
  }

  console.log(`Found ${artists.length} artists:`, artists.map(a => a.stageName).join(', '));

  // Create January 2026 completed assignments
  const januaryDates = [
    new Date('2026-01-05'),
    new Date('2026-01-10'),
    new Date('2026-01-12'),
    new Date('2026-01-15'),
    new Date('2026-01-18'),
    new Date('2026-01-20'),
    new Date('2026-01-22'),
    new Date('2026-01-25'),
    new Date('2026-01-27'),
    new Date('2026-01-30'),
  ];

  let created = 0;
  let skipped = 0;

  for (const venue of venues) {
    for (let i = 0; i < januaryDates.length; i++) {
      const date = januaryDates[i];
      const artist = artists[i % artists.length];

      // Check if assignment already exists
      const existing = await prisma.venueAssignment.findFirst({
        where: {
          venueId: venue.id,
          date: date,
          slot: null,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.venueAssignment.create({
        data: {
          venueId: venue.id,
          artistId: artist.id,
          date: date,
          startTime: '20:00',
          endTime: '01:00',
          slot: null,
          status: VenueAssignmentStatus.COMPLETED,
          notes: 'Test assignment for January 2026',
        },
      });

      created++;
      console.log(`  ✓ ${venue.name} - ${date.toISOString().split('T')[0]} - ${artist.stageName}`);
    }
  }

  console.log(`\n✅ Created ${created} assignments, skipped ${skipped} (already exist)`);
  console.log('\n📊 You can now test:');
  console.log('   - Venue Portal → Feedback → Submit DJ ratings for January dates');
  console.log('   - Venue Portal → Feedback → Submit Night Reports for January dates');
  console.log('   - Venue Portal → Statistics → View Crowd Insights after submitting reports');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
