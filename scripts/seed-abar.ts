/**
 * Seed Script: Create ABar Venue Account
 *
 * Creates:
 * - ABar corporate account (abar@brightears.io)
 * - ABar venue
 * - Full March 2026 schedule (31 assignments)
 *   All 5 DJs already exist: Benji, UFO, Linze, Scotty B, DJ Pound
 *
 * Run with: npx tsx scripts/seed-abar.ts
 *
 * AFTER RUNNING:
 * 1. Create Clerk user for abar@brightears.io with password: ABar2026!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  userId: 'abar-corporate-user',
  email: 'abar@brightears.io',
  companyName: 'ABar',
  contactPerson: 'Khun Au',
  venueId: 'abar-venue',
  venueName: 'ABar',
  venueType: 'Bar',
  city: 'Bangkok',
};

// Existing DJs used at ABar
const EXISTING_DJS = ['dj-linze', 'dj-ufo', 'dj-scotty-b', 'dj-benji', 'dj-dj-pound'];

// March 2026 schedule: [day, artistId, startTime]
// Weekly rotation: Mon=Linze, Tue=UFO, Wed=Scotty B, Thu=Benji, Fri=Pound, Sat=Benji, Sun=Pound
// Sun-Wed: 21:00-24:00 (3 hrs), Thu-Sat: 22:00-24:00 (2 hrs)
// Mar 1 = Sunday (verified against actual 2026 calendar)
const MARCH_SCHEDULE: [number, string, string][] = [
  // Week 1 (partial: Sun only)
  [1, 'dj-dj-pound', '21:00'],    // Sun
  // Week 2
  [2, 'dj-linze', '21:00'],       // Mon
  [3, 'dj-ufo', '21:00'],         // Tue
  [4, 'dj-scotty-b', '21:00'],    // Wed
  [5, 'dj-benji', '22:00'],       // Thu
  [6, 'dj-dj-pound', '22:00'],    // Fri
  [7, 'dj-benji', '22:00'],       // Sat
  [8, 'dj-dj-pound', '21:00'],    // Sun
  // Week 3
  [9, 'dj-linze', '21:00'],       // Mon
  [10, 'dj-ufo', '21:00'],        // Tue
  [11, 'dj-scotty-b', '21:00'],   // Wed
  [12, 'dj-benji', '22:00'],      // Thu
  [13, 'dj-dj-pound', '22:00'],   // Fri
  [14, 'dj-benji', '22:00'],      // Sat
  [15, 'dj-dj-pound', '21:00'],   // Sun
  // Week 4
  [16, 'dj-linze', '21:00'],      // Mon
  [17, 'dj-ufo', '21:00'],        // Tue
  [18, 'dj-scotty-b', '21:00'],   // Wed
  [19, 'dj-benji', '22:00'],      // Thu
  [20, 'dj-dj-pound', '22:00'],   // Fri
  [21, 'dj-benji', '22:00'],      // Sat
  [22, 'dj-dj-pound', '21:00'],   // Sun
  // Week 5
  [23, 'dj-linze', '21:00'],      // Mon
  [24, 'dj-ufo', '21:00'],        // Tue
  [25, 'dj-scotty-b', '21:00'],   // Wed
  [26, 'dj-benji', '22:00'],      // Thu
  [27, 'dj-dj-pound', '22:00'],   // Fri
  [28, 'dj-benji', '22:00'],      // Sat
  [29, 'dj-dj-pound', '21:00'],   // Sun
  // Week 6 (partial: Mon-Tue)
  [30, 'dj-linze', '21:00'],      // Mon
  [31, 'dj-ufo', '21:00'],        // Tue
];

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function main() {
  console.log('Creating ABar account...\n');

  // ==========================================================================
  // Step 1: Create User
  // ==========================================================================
  console.log('Creating user...');

  const user = await prisma.user.upsert({
    where: { id: CONFIG.userId },
    update: {
      email: CONFIG.email,
      name: CONFIG.companyName,
    },
    create: {
      id: CONFIG.userId,
      email: CONFIG.email,
      name: CONFIG.companyName,
      firstName: 'ABar',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   User: ${user.email}`);

  // ==========================================================================
  // Step 2: Create Corporate
  // ==========================================================================
  console.log('\nCreating corporate...');

  const corporate = await prisma.corporate.upsert({
    where: { userId: user.id },
    update: {
      companyName: CONFIG.companyName,
      contactPerson: CONFIG.contactPerson,
    },
    create: {
      userId: user.id,
      companyName: CONFIG.companyName,
      contactPerson: CONFIG.contactPerson,
      position: 'Venue Management',
      venueType: CONFIG.venueType,
      numberOfVenues: 1,
    },
  });
  console.log(`   Corporate: ${corporate.companyName}`);

  // ==========================================================================
  // Step 3: Create Venue
  // ==========================================================================
  console.log('\nCreating venue...');

  const venue = await prisma.venue.upsert({
    where: { id: CONFIG.venueId },
    update: {
      name: CONFIG.venueName,
      corporateId: corporate.id,
    },
    create: {
      id: CONFIG.venueId,
      corporateId: corporate.id,
      name: CONFIG.venueName,
      city: CONFIG.city,
      venueType: CONFIG.venueType,
      isActive: true,
    },
  });
  console.log(`   Venue: ${venue.name} (${venue.id})`);

  // ==========================================================================
  // Step 4: Verify Existing DJs
  // ==========================================================================
  console.log('\nVerifying existing DJs...');

  for (const djId of EXISTING_DJS) {
    const artist = await prisma.artist.findUnique({ where: { id: djId } });
    if (!artist) {
      console.error(`   ERROR: ${djId} not found in database!`);
      process.exit(1);
    }
    console.log(`   ${artist.stageName} (${djId})`);
  }

  // ==========================================================================
  // Step 5: Create March 2026 Schedule
  // ==========================================================================
  console.log('\nCreating March 2026 schedule...');

  let created = 0;
  let skipped = 0;

  for (const [day, artistId, startTime] of MARCH_SCHEDULE) {
    const assignmentId = `march-abar-2026-03-${day.toString().padStart(2, '0')}`;

    // Use noon UTC to avoid timezone date-shifting on UTC+7
    const date = new Date(Date.UTC(2026, 2, day, 12, 0, 0));

    const existing = await prisma.venueAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.venueAssignment.create({
      data: {
        id: assignmentId,
        venueId: CONFIG.venueId,
        artistId: artistId,
        date: date,
        startTime: startTime,
        endTime: '24:00',
        slot: null,
        status: 'SCHEDULED',
      },
    });
    created++;
  }

  console.log(`   Created ${created} assignments (${skipped} already existed)`);

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('ABAR ACCOUNT CREATED!');
  console.log('='.repeat(60));
  console.log('\nAccount Summary:\n');
  console.log(`   Email: ${CONFIG.email}`);
  console.log('   Password: ABar2026! (set in Clerk)');
  console.log(`   Venue: ${CONFIG.venueName}`);
  console.log(`   Venue ID: ${CONFIG.venueId}`);
  console.log('   DJs: Benji, UFO, Linze, Scotty B, DJ Pound (all existing)');
  console.log('   Schedule: Mar 2026 (31 nights)');
  console.log('\nNext Steps:');
  console.log('   1. Go to Clerk Dashboard -> Users -> Create user');
  console.log(`   2. Create user: ${CONFIG.email} with password: ABar2026!`);
  console.log('   3. Test login at /venue-portal with the new account');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
