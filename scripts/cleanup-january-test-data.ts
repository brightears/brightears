/**
 * Cleanup script to remove January 2026 test assignments
 *
 * Run on Render Shell or locally with DATABASE_URL:
 * npx ts-node scripts/cleanup-january-test-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding January 2026 test assignments...\n');

  // Find all January 2026 assignments
  const januaryAssignments = await prisma.venueAssignment.findMany({
    where: {
      date: {
        gte: new Date('2026-01-01'),
        lt: new Date('2026-02-01'),
      },
    },
    include: {
      artist: { select: { stageName: true } },
      venue: { select: { name: true } },
    },
  });

  console.log(`Found ${januaryAssignments.length} January 2026 assignments:\n`);

  januaryAssignments.forEach((a) => {
    const dateStr = a.date.toISOString().split('T')[0];
    const djName = a.artist?.stageName || a.specialEvent || 'No DJ';
    console.log(`  - ${dateStr}: ${djName} at ${a.venue.name}`);
  });

  if (januaryAssignments.length === 0) {
    console.log('\n✅ No January 2026 test data found. Database is clean.');
    return;
  }

  // Delete all January 2026 assignments
  console.log('\n🗑️  Deleting January 2026 test assignments...');

  const result = await prisma.venueAssignment.deleteMany({
    where: {
      date: {
        gte: new Date('2026-01-01'),
        lt: new Date('2026-02-01'),
      },
    },
  });

  console.log(`\n✅ Deleted ${result.count} January 2026 test assignments.`);
  console.log('\n🔄 Refresh the venue portal to see the changes.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
