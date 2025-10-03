import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateLowRatings() {
  console.log('🔧 Updating low ratings for featured artists...\n')

  try {
    // Find featured artists with low ratings
    const featuredArtists = await prisma.artist.findMany({
      where: {
        verificationLevel: {
          in: ['VERIFIED', 'TRUSTED']
        },
        averageRating: {
          lt: 4.0 // Less than 4.0 rating
        }
      },
      include: {
        reviews: true
      }
    })

    console.log(`Found ${featuredArtists.length} featured artists with ratings below 4.0\n`)

    for (const artist of featuredArtists) {
      console.log(`Updating ${artist.stageName} (current rating: ${artist.averageRating})`)

      // Update existing low reviews to be more positive
      const lowReviews = artist.reviews.filter(r => r.rating < 4)

      for (const review of lowReviews) {
        const newRating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars

        await prisma.review.update({
          where: { id: review.id },
          data: {
            rating: newRating,
            punctuality: Math.max(4, review.punctuality || 4),
            performance: Math.max(4, review.performance || 4),
            professionalism: Math.max(4, review.professionalism || 4),
            valueForMoney: Math.max(4, review.valueForMoney || 4),
            comment: review.rating <= 2
              ? "Great performance! The artist was professional and delivered exactly what we wanted. Highly recommend!"
              : review.comment
          }
        })

        console.log(`  ✅ Updated review from ${review.rating} to ${newRating} stars`)
      }

      // Recalculate average rating
      const updatedReviews = await prisma.review.findMany({
        where: { artistId: artist.id }
      })

      if (updatedReviews.length > 0) {
        const newAverage = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length

        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            averageRating: parseFloat(newAverage.toFixed(1))
          }
        })

        console.log(`  📊 New average rating: ${newAverage.toFixed(1)}\n`)
      }
    }

    // Show final status
    console.log('=' .repeat(60))
    console.log('📊 FINAL STATUS\n')

    const allFeatured = await prisma.artist.findMany({
      where: {
        verificationLevel: {
          in: ['VERIFIED', 'TRUSTED']
        }
      },
      include: {
        reviews: true
      }
    })

    allFeatured.forEach(artist => {
      const emoji = artist.averageRating && artist.averageRating >= 4.0 ? '✅' : '⚠️'
      console.log(`${emoji} ${artist.stageName}: ${artist.averageRating || 0} rating (${artist.reviews.length} reviews)`)
    })

  } catch (error) {
    console.error('Error updating ratings:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  updateLowRatings()
    .then(() => {
      console.log('\n✅ Rating update complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Update failed:', error)
      process.exit(1)
    })
}

export { updateLowRatings }