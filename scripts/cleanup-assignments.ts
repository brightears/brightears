/**
 * Data Cleanup Script for Timezone-Corrupted Assignments
 *
 * PURPOSE:
 * Old assignments were created with toISOString() (UTC), but the lookup now uses
 * local date formatting. This causes:
 * - Delete button not appearing for some assignments
 * - Wrong DJ showing in modal
 *
 * RUN:
 * npx tsx scripts/cleanup-assignments.ts [--delete-before=YYYY-MM-DD]
 *
 * EXAMPLES:
 * npx tsx scripts/cleanup-assignments.ts                    # List all assignments
 * npx tsx scripts/cleanup-assignments.ts --delete-before=2026-02-01  # Delete old ones
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const deleteBeforeArg = args.find(a => a.startsWith('--delete-before='));
  const deleteBefore = deleteBeforeArg ? deleteBeforeArg.split('=')[1] : null;

  console.log('\n=== VENUE ASSIGNMENT DATA CLEANUP ===\n');

  // Fetch all assignments
  const assignments = await prisma.venueAssignment.findMany({
    include: {
      venue: { select: { name: true } },
      artist: { select: { stageName: true } },
    },
    orderBy: [{ date: 'asc' }, { venueId: 'asc' }, { slot: 'asc' }],
  });

  console.log(`Found ${assignments.length} total assignments:\n`);

  // Group by date for easier reading
  const byDate = new Map<string, typeof assignments>();

  for (const a of assignments) {
    // Format the date as stored (UTC)
    const utcDate = a.date.toISOString().split('T')[0];
    // What the local date would be (Thailand UTC+7)
    const localDate = `${a.date.getUTCFullYear()}-${String(a.date.getUTCMonth() + 1).padStart(2, '0')}-${String(a.date.getUTCDate()).padStart(2, '0')}`;

    const key = localDate;
    if (!byDate.has(key)) {
      byDate.set(key, []);
    }
    byDate.get(key)!.push(a);
  }

  // Display assignments
  for (const [date, items] of byDate) {
    console.log(`📅 ${date}`);
    for (const a of items) {
      const slotLabel = a.slot ? ` (${a.slot})` : '';
      console.log(`   ${a.venue.name}${slotLabel}: ${a.artist.stageName}`);
      console.log(`      ID: ${a.id}`);
      console.log(`      Raw Date: ${a.date.toISOString()}`);
    }
    console.log('');
  }

  // Delete if requested
  if (deleteBefore) {
    const cutoffDate = new Date(deleteBefore);
    console.log(`\n🗑️  DELETING assignments before ${deleteBefore}...\n`);

    const toDelete = assignments.filter(a => a.date < cutoffDate);

    if (toDelete.length === 0) {
      console.log('No assignments to delete.');
    } else {
      console.log(`Will delete ${toDelete.length} assignments:`);
      for (const a of toDelete) {
        const localDate = `${a.date.getUTCFullYear()}-${String(a.date.getUTCMonth() + 1).padStart(2, '0')}-${String(a.date.getUTCDate()).padStart(2, '0')}`;
        console.log(`   - ${localDate} ${a.venue.name} ${a.slot || ''}: ${a.artist.stageName}`);
      }

      // Confirm deletion
      console.log('\nProceeding with deletion...');

      const result = await prisma.venueAssignment.deleteMany({
        where: {
          date: { lt: cutoffDate },
        },
      });

      console.log(`\n✅ Deleted ${result.count} assignments.`);
    }
  } else {
    console.log('\n💡 To delete old assignments, run:');
    console.log('   npx tsx scripts/cleanup-assignments.ts --delete-before=2026-02-01');
  }

  console.log('\n=== DONE ===\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
