/**
 * Seed Script: Test Feedback Data
 *
 * Creates DJ assignments for Jan 25-26, 2026 with COMPLETED status
 * so they appear in Feedback > Pending tab for testing.
 *
 * Run with: npx tsx prisma/seed-test-feedback.ts
 *
 * To clean up after testing:
 *   npx tsx prisma/seed-test-feedback.ts --cleanup
 */

import { PrismaClient, VenueAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Test assignments for Jan 25-26, 2026
const TEST_ASSIGNMENTS = [
  // Jan 25 - Saturday
  {
    id: 'test-jan25-nobu',
    venueId: 'nobu-bangkok-venue',
    artistId: 'dj-vita',
    date: new Date('2026-01-25'),
    startTime: '20:00',
    endTime: '24:00',
    slot: null,
  },
  {
    id: 'test-jan25-ldk-early',
    venueId: 'le-du-kaan-venue',
    artistId: 'dj-justin-mills',
    date: new Date('2026-01-25'),
    startTime: '18:00',
    endTime: '21:00',
    slot: 'Early',
  },
  {
    id: 'test-jan25-ldk-late',
    venueId: 'le-du-kaan-venue',
    artistId: 'dj-scotty-b',
    date: new Date('2026-01-25'),
    startTime: '21:00',
    endTime: '24:00',
    slot: 'Late',
  },

  // Jan 26 - Sunday
  {
    id: 'test-jan26-nobu',
    venueId: 'nobu-bangkok-venue',
    artistId: 'dj-ufo',
    date: new Date('2026-01-26'),
    startTime: '20:00',
    endTime: '24:00',
    slot: null,
  },
  {
    id: 'test-jan26-ldk-early',
    venueId: 'le-du-kaan-venue',
    artistId: 'dj-tom-fkg',
    date: new Date('2026-01-26'),
    startTime: '18:00',
    endTime: '21:00',
    slot: 'Early',
  },
  {
    id: 'test-jan26-ldk-late',
    venueId: 'le-du-kaan-venue',
    artistId: 'dj-yui-truluv',
    date: new Date('2026-01-26'),
    startTime: '21:00',
    endTime: '24:00',
    slot: 'Late',
  },
];

async function seedTestData() {
  console.log('🧪 Adding test feedback data for Jan 25-26, 2026...\n');

  let created = 0;
  let skipped = 0;

  for (const assignment of TEST_ASSIGNMENTS) {
    try {
      // Check if artist exists
      const artist = await prisma.artist.findUnique({
        where: { id: assignment.artistId },
      });

      if (!artist) {
        console.log(`   ⚠️ Skipping - Artist not found: ${assignment.artistId}`);
        skipped++;
        continue;
      }

      // Check if venue exists
      const venue = await prisma.venue.findUnique({
        where: { id: assignment.venueId },
      });

      if (!venue) {
        console.log(`   ⚠️ Skipping - Venue not found: ${assignment.venueId}`);
        skipped++;
        continue;
      }

      // Create assignment with COMPLETED status
      await prisma.venueAssignment.upsert({
        where: { id: assignment.id },
        update: {
          status: VenueAssignmentStatus.COMPLETED,
        },
        create: {
          id: assignment.id,
          venueId: assignment.venueId,
          artistId: assignment.artistId,
          date: assignment.date,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
          slot: assignment.slot,
          status: VenueAssignmentStatus.COMPLETED,
          notes: 'Test data for feedback testing',
        },
      });

      console.log(
        `   ✓ ${assignment.date.toISOString().split('T')[0]} - ${venue.name} ${assignment.slot || ''} - ${artist.stageName}`
      );
      created++;
    } catch (error) {
      console.error(`   ❌ Failed: ${assignment.id}`, error);
    }
  }

  console.log(`\n✅ Created ${created} test assignments (${skipped} skipped)`);
  console.log('\n📋 These will now appear in Feedback > Pending tab');
  console.log('   To clean up later: npx tsx prisma/seed-test-feedback.ts --cleanup');
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test feedback data...\n');

  const testIds = TEST_ASSIGNMENTS.map((a) => a.id);

  // Delete any feedback first (due to foreign key)
  const feedbackDeleted = await prisma.venueFeedback.deleteMany({
    where: { assignmentId: { in: testIds } },
  });
  console.log(`   ✓ Deleted ${feedbackDeleted.count} test feedback records`);

  // Delete assignments
  const assignmentsDeleted = await prisma.venueAssignment.deleteMany({
    where: { id: { in: testIds } },
  });
  console.log(`   ✓ Deleted ${assignmentsDeleted.count} test assignments`);

  console.log('\n✅ Test data cleaned up');
}

async function main() {
  const isCleanup = process.argv.includes('--cleanup');

  if (isCleanup) {
    await cleanupTestData();
  } else {
    await seedTestData();
  }
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
