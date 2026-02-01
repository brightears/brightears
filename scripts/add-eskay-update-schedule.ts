/**
 * Add DJ Eskay and update February 2026 schedule
 *
 * Run with: npx tsx scripts/add-eskay-update-schedule.ts
 */

import { PrismaClient, ArtistCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎧 Adding DJ Eskay and updating schedule...\n');

  // 1. Create DJ Eskay artist (or find if exists)
  let eskay = await prisma.artist.findFirst({
    where: { stageName: 'Eskay Da Real' },
  });

  if (!eskay) {
    // Create user first (following seed-nobu.ts pattern)
    const djId = 'dj-eskay-da-real';
    const userId = `user-${djId}`;

    const djUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: 'Eskay Da Real',
      },
      create: {
        id: userId,
        email: `${djId}@brightears.io`,
        name: 'Eskay Da Real',
        firstName: 'Eskay',
        role: 'ARTIST',
        isActive: true,
      },
    });

    // Create artist profile linked to user
    eskay = await prisma.artist.upsert({
      where: { userId: djUser.id },
      update: {
        stageName: 'Eskay Da Real',
        bio: 'French DJ with over 15 years of experience. Known for his signature French Touch and diverse cultural influences. Seamlessly blends Hip Hop, R&B, Afro House, and Latino rhythms. Also a sought-after beatmaker collaborating with international artists.',
        genres: ['Hip Hop', 'R&B', 'Afro House', 'Pop', 'House', 'Electro', 'Latino', 'Open Format'],
        instagram: '@eskaydareal',
        profileImage: '/images/djs/eskay-photo1.png',
        hourlyRate: 1000,
      },
      create: {
        id: djId,
        userId: djUser.id,
        stageName: 'Eskay Da Real',
        bio: 'French DJ with over 15 years of experience. Known for his signature French Touch and diverse cultural influences. Seamlessly blends Hip Hop, R&B, Afro House, and Latino rhythms. Also a sought-after beatmaker collaborating with international artists.',
        category: ArtistCategory.DJ,
        genres: ['Hip Hop', 'R&B', 'Afro House', 'Pop', 'House', 'Electro', 'Latino', 'Open Format'],
        baseCity: 'Bangkok',
        serviceAreas: ['Bangkok'],
        hourlyRate: 1000,
        minimumHours: 3,
        currency: 'THB',
        languages: ['en', 'th'],
        instagram: '@eskaydareal',
        profileImage: '/images/djs/eskay-photo1.png',
      },
    });
    console.log(`✅ Created DJ Eskay (ID: ${eskay.id})`);
  } else {
    console.log(`✅ DJ Eskay already exists (ID: ${eskay.id})`);
  }

  // 2. Get Le Du Kaan venue ID
  const ldk = await prisma.venue.findFirst({
    where: { name: { contains: 'Le Du Kaan' } },
  });

  if (!ldk) {
    throw new Error('Le Du Kaan venue not found!');
  }

  console.log(`📍 Found Le Du Kaan venue (ID: ${ldk.id})`);

  // 3. Update Feb 7 (Saturday) LDK Late: Scotty B → Eskay
  const feb7Update = await prisma.venueAssignment.updateMany({
    where: {
      date: new Date('2026-02-07'),
      venueId: ldk.id,
      slot: 'Late',
    },
    data: {
      artistId: eskay.id,
    },
  });

  console.log(`✅ Feb 7 LDK Late: Updated ${feb7Update.count} assignment(s) to Eskay`);

  // 4. Update Feb 28 (Saturday) LDK Late: Scotty B → Eskay
  const feb28Update = await prisma.venueAssignment.updateMany({
    where: {
      date: new Date('2026-02-28'),
      venueId: ldk.id,
      slot: 'Late',
    },
    data: {
      artistId: eskay.id,
    },
  });

  console.log(`✅ Feb 28 LDK Late: Updated ${feb28Update.count} assignment(s) to Eskay`);

  // 5. Verify the updates
  console.log('\n📋 Verifying Saturday LDK Late schedule:');

  const saturdays = await prisma.venueAssignment.findMany({
    where: {
      venueId: ldk.id,
      slot: 'Late',
      date: {
        gte: new Date('2026-02-01'),
        lt: new Date('2026-03-01'),
      },
    },
    include: {
      artist: { select: { stageName: true } },
    },
    orderBy: { date: 'asc' },
  });

  // Filter to only Saturdays
  const saturdaySlots = saturdays.filter(s => s.date.getDay() === 6);

  saturdaySlots.forEach(s => {
    const dateStr = s.date.toISOString().split('T')[0];
    console.log(`  ${dateStr}: ${s.artist?.stageName || 'No DJ'}`);
  });

  console.log('\n✅ Done! DJ Eskay added and schedule updated.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
