import { prisma } from '../lib/prisma';

async function checkTempleBass() {
  const artist = await prisma.artist.findFirst({
    where: { stageName: 'Temple Bass' },
    include: {
      user: true,
      reviews: true,
      bookings: true
    }
  });

  if (artist) {
    console.log('=== Temple Bass Data ===');
    console.log('Stage Name:', artist.stageName);
    console.log('Hourly Rate:', artist.hourlyRate);
    console.log('Minimum Hours:', artist.minimumHours);
    console.log('Average Rating:', artist.averageRating);
    console.log('Completed Bookings:', artist.completedBookings);
    console.log('Total Bookings:', artist.totalBookings);
    console.log('Number of Reviews:', artist.reviews.length);
    console.log('');
    console.log('=== Additional Fields ===');
    console.log('Bio:', artist.bio?.substring(0, 100) + '...');
    console.log('Category:', artist.category);
    console.log('Genres:', artist.genres);
    console.log('Base City:', artist.baseCity);
  } else {
    console.log('Temple Bass not found in database');
  }

  await prisma.$disconnect();
}

checkTempleBass().catch(console.error);