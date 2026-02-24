/**
 * Seed Script: Create Horizon Venue Account
 *
 * Creates:
 * - Horizon corporate account (horizon@brightears.io)
 * - Horizon venue
 * - 2 new DJs: Ize, Nun (Eskay and Pound already exist)
 * - Full February 2026 schedule (28 assignments)
 *
 * Run with: npx tsx scripts/seed-horizon.ts
 *
 * AFTER RUNNING:
 * 1. Create Clerk user for horizon@brightears.io with password: Horizon2026!
 */

import { PrismaClient, ArtistCategory } from '@prisma/client';

const prisma = new PrismaClient();

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  userId: 'horizon-corporate-user',
  email: 'horizon@brightears.io',
  companyName: 'Horizon',
  contactPerson: 'Horizon Team',
  venueId: 'horizon-venue',
  venueName: 'Horizon',
  venueType: 'Bar',
  city: 'Bangkok',
};

// New DJs to create (Eskay and Pound already exist in the system)
const NEW_DJS = [
  {
    djId: 'dj-ize',
    userId: 'user-dj-ize',
    stageName: 'DJ Ize',
    realName: 'Ice',
    bio: 'DJ Ize is a 29-year-old DJ with a passion for R&B and hip-hop, especially the golden vibes of the \'80s and \'90s. She blends smooth grooves, nostalgic throwbacks, and feel-good energy to create moments that make people dance, sing along, and relive the best eras of music.',
    genres: ['R&B', 'Hip-Hop', '80s', '90s', 'Soul'],
  },
  {
    djId: 'dj-nun',
    userId: 'user-dj-nun',
    stageName: 'DJ Nun',
    realName: 'Nantana Kaewwwattana',
    bio: 'DJ Nun is a creative hospitality and entertainment professional with 10+ years of experience in bar management, beverage design, and fashion production. She brings funky, groovy disco house sets with Thai flavour, spanning the \'80s through 2000s.',
    genres: ['Funky', 'Groovy', 'Disco House', 'Thai', '80s', '90s', '2000s'],
    contactPhone: '097-240-4820',
    contactEmail: 'mgmetallics@gmail.com',
  },
];

// February 2026 schedule: [day, artistId]
// Hours: 18:30-22:30, 1 DJ per night
const FEBRUARY_SCHEDULE: [number, string][] = [
  [1, 'dj-ize'],
  [2, 'dj-nun'],
  [3, 'dj-dj-pound'],
  [4, 'dj-dj-pound'],
  [5, 'dj-nun'],
  [6, 'dj-nun'],
  [7, 'dj-ize'],
  [8, 'dj-ize'],
  [9, 'dj-nun'],
  [10, 'dj-dj-pound'],
  [11, 'dj-dj-pound'],
  [12, 'dj-nun'],
  [13, 'dj-nun'],
  [14, 'dj-ize'],
  [15, 'dj-ize'],
  [16, 'dj-nun'],
  [17, 'dj-dj-pound'],
  [18, 'dj-eskay-da-real'],
  [19, 'dj-eskay-da-real'],
  [20, 'dj-nun'],
  [21, 'dj-ize'],
  [22, 'dj-ize'],
  [23, 'dj-nun'],
  [24, 'dj-dj-pound'],
  [25, 'dj-dj-pound'],
  [26, 'dj-nun'],
  [27, 'dj-nun'],
  [28, 'dj-ize'],
];

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function main() {
  console.log('🔄 Creating Horizon account...\n');

  // ==========================================================================
  // Step 1: Create User
  // ==========================================================================
  console.log('📝 Creating user...');

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
      firstName: 'Horizon',
      lastName: 'Team',
      role: 'CORPORATE',
      isActive: true,
    },
  });
  console.log(`   ✓ User: ${user.email}`);

  // ==========================================================================
  // Step 2: Create Corporate
  // ==========================================================================
  console.log('\n📝 Creating corporate...');

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
  console.log(`   ✓ Corporate: ${corporate.companyName}`);

  // ==========================================================================
  // Step 3: Create Venue
  // ==========================================================================
  console.log('\n🏪 Creating venue...');

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
  console.log(`   ✓ Venue: ${venue.name} (${venue.id})`);

  // ==========================================================================
  // Step 4: Create New DJs (Ize and Nun)
  // ==========================================================================
  console.log('\n🎧 Creating new DJs...');

  for (const dj of NEW_DJS) {
    const djUser = await prisma.user.upsert({
      where: { id: dj.userId },
      update: {
        name: dj.stageName,
      },
      create: {
        id: dj.userId,
        email: `${dj.djId}@brightears.io`,
        name: dj.stageName,
        firstName: dj.stageName.replace('DJ ', ''),
        role: 'ARTIST',
        isActive: true,
      },
    });

    await prisma.artist.upsert({
      where: { userId: djUser.id },
      update: {
        stageName: dj.stageName,
        bio: dj.bio,
        genres: dj.genres,
      },
      create: {
        id: dj.djId,
        userId: djUser.id,
        stageName: dj.stageName,
        realName: dj.realName,
        bio: dj.bio,
        category: ArtistCategory.DJ,
        genres: dj.genres,
        baseCity: 'Bangkok',
        serviceAreas: ['Bangkok'],
        minimumHours: 4,
        currency: 'THB',
        languages: ['en', 'th'],
        contactPhone: (dj as any).contactPhone || null,
        contactEmail: (dj as any).contactEmail || null,
      },
    });
    console.log(`   ✓ ${dj.stageName} (${dj.djId})`);
  }

  // Verify existing DJs exist
  console.log('\n🔍 Verifying existing DJs...');
  const eskay = await prisma.artist.findUnique({ where: { id: 'dj-eskay-da-real' } });
  const pound = await prisma.artist.findUnique({ where: { id: 'dj-dj-pound' } });

  if (!eskay) {
    console.error('   ❌ DJ Eskay Da Real not found! Run add-eskay-update-schedule.ts first.');
    process.exit(1);
  }
  console.log(`   ✓ ${eskay.stageName} (existing)`);

  if (!pound) {
    console.error('   ❌ DJ Pound not found!');
    process.exit(1);
  }
  console.log(`   ✓ ${pound.stageName} (existing)`);

  // ==========================================================================
  // Step 5: Create February 2026 Schedule
  // ==========================================================================
  console.log('\n📅 Creating February 2026 schedule...');

  let created = 0;
  let skipped = 0;

  for (const [day, artistId] of FEBRUARY_SCHEDULE) {
    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
    const assignmentId = `horizon-assignment-${dateStr}`;

    // Use local date to avoid timezone issues
    const date = new Date(2026, 1, day); // Month is 0-indexed

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
        startTime: '18:30',
        endTime: '22:30',
        slot: 'main',
        status: 'SCHEDULED',
      },
    });
    created++;
  }

  console.log(`   ✓ Created ${created} assignments (${skipped} already existed)`);

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ HORIZON ACCOUNT CREATED!');
  console.log('='.repeat(60));
  console.log('\n📋 Account Summary:\n');
  console.log(`   Email: ${CONFIG.email}`);
  console.log('   Password: Horizon2026! (set in Clerk)');
  console.log(`   Venue: ${CONFIG.venueName}`);
  console.log(`   Venue ID: ${CONFIG.venueId}`);
  console.log(`   DJs: Ize, Nun (new) + Eskay, Pound (existing)`);
  console.log(`   Schedule: Feb 2026 (28 nights)`);
  console.log('\n📋 Next Steps:');
  console.log('   1. Go to Clerk Dashboard → Users → Create user');
  console.log(`   2. Create user: ${CONFIG.email} with password: Horizon2026!`);
  console.log('   3. Test login at /venue-portal with the new account');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
