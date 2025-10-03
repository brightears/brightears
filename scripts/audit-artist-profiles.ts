import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProfileCompleteness {
  artistId: string
  stageName: string
  completenessScore: number
  missingFields: string[]
  hasProfileImage: boolean
  hasBio: boolean
  hasReviews: boolean
  hasRating: boolean
  hasCompletedBookings: boolean
  hasServiceAreas: boolean
  hasGenres: boolean
  hasPricing: boolean
  verificationLevel: string
}

async function auditArtistProfiles() {
  console.log('🔍 Auditing Artist Profile Completeness...\n')
  console.log('=' .repeat(80))

  try {
    // Fetch all artists with their related data
    const artists = await prisma.artist.findMany({
      include: {
        user: true,
        reviews: true,
        bookings: {
          where: {
            status: 'COMPLETED'
          }
        }
      }
    })

    const profileAudits: ProfileCompleteness[] = []

    for (const artist of artists) {
      const missingFields: string[] = []
      let completenessScore = 0
      const totalFields = 8 // Total fields we're checking

      // Check profile image
      const hasProfileImage = !!artist.profileImage
      if (hasProfileImage) completenessScore++
      else missingFields.push('Profile Image')

      // Check bio (English or Thai)
      const hasBio = !!(artist.bio || artist.bioTh)
      if (hasBio) completenessScore++
      else missingFields.push('Bio (EN/TH)')

      // Check reviews
      const hasReviews = artist.reviews.length > 0
      if (hasReviews) completenessScore++
      else missingFields.push('Reviews')

      // Check rating
      const hasRating = !!artist.averageRating && artist.averageRating > 0
      if (hasRating) completenessScore++
      else missingFields.push('Average Rating')

      // Check completed bookings
      const hasCompletedBookings = artist.completedBookings > 0 || artist.bookings.length > 0
      if (hasCompletedBookings) completenessScore++
      else missingFields.push('Completed Bookings')

      // Check service areas
      const hasServiceAreas = artist.serviceAreas.length > 0
      if (hasServiceAreas) completenessScore++
      else missingFields.push('Service Areas')

      // Check genres
      const hasGenres = artist.genres.length > 0
      if (hasGenres) completenessScore++
      else missingFields.push('Genres')

      // Check pricing
      const hasPricing = !!artist.hourlyRate
      if (hasPricing) completenessScore++
      else missingFields.push('Pricing Information')

      profileAudits.push({
        artistId: artist.id,
        stageName: artist.stageName,
        completenessScore: (completenessScore / totalFields) * 100,
        missingFields,
        hasProfileImage,
        hasBio,
        hasReviews,
        hasRating,
        hasCompletedBookings,
        hasServiceAreas,
        hasGenres,
        hasPricing,
        verificationLevel: artist.verificationLevel
      })
    }

    // Sort by completeness score
    profileAudits.sort((a, b) => b.completenessScore - a.completenessScore)

    // Display results
    console.log(`\n📊 AUDIT SUMMARY`)
    console.log('=' .repeat(80))
    console.log(`Total Artists: ${artists.length}`)
    console.log(`Complete Profiles (100%): ${profileAudits.filter(p => p.completenessScore === 100).length}`)
    console.log(`Incomplete Profiles: ${profileAudits.filter(p => p.completenessScore < 100).length}`)
    console.log(`Profiles with No Reviews: ${profileAudits.filter(p => !p.hasReviews).length}`)
    console.log(`Profiles with No Rating: ${profileAudits.filter(p => !p.hasRating).length}`)

    // Featured Artists Analysis (VERIFIED or TRUSTED only)
    const featuredArtists = profileAudits.filter(p =>
      p.verificationLevel === 'VERIFIED' || p.verificationLevel === 'TRUSTED'
    )

    console.log(`\n⭐ FEATURED ARTISTS (${featuredArtists.length} total)`)
    console.log('=' .repeat(80))

    if (featuredArtists.length > 0) {
      featuredArtists.forEach(artist => {
        const status = artist.completenessScore === 100 ? '✅' : '⚠️'
        console.log(`\n${status} ${artist.stageName} (${artist.verificationLevel})`)
        console.log(`   Completeness: ${artist.completenessScore.toFixed(0)}%`)

        if (artist.missingFields.length > 0) {
          console.log(`   Missing: ${artist.missingFields.join(', ')}`)
        }

        // Show critical missing fields for featured artists
        if (!artist.hasReviews || !artist.hasRating) {
          console.log(`   🚨 CRITICAL: Shows "0 reviews" or empty ratings`)
        }
      })
    } else {
      console.log('No featured artists found (VERIFIED or TRUSTED level)')
    }

    // Detailed breakdown by missing field
    console.log(`\n📋 MISSING FIELDS BREAKDOWN`)
    console.log('=' .repeat(80))

    const fieldCounts: Record<string, number> = {}
    profileAudits.forEach(audit => {
      audit.missingFields.forEach(field => {
        fieldCounts[field] = (fieldCounts[field] || 0) + 1
      })
    })

    Object.entries(fieldCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([field, count]) => {
        const percentage = ((count / artists.length) * 100).toFixed(1)
        console.log(`${field}: ${count} artists (${percentage}%)`)
      })

    // Recommendations
    console.log(`\n💡 RECOMMENDATIONS`)
    console.log('=' .repeat(80))

    const artistsWithNoReviews = profileAudits.filter(p => !p.hasReviews)
    if (artistsWithNoReviews.length > 0) {
      console.log(`\n1. REVIEW ISSUE (${artistsWithNoReviews.length} artists):`)
      console.log('   Solution Options:')
      console.log('   - Option A: Filter out artists with no reviews from featured section')
      console.log('   - Option B: Show "New Artist" badge instead of "0 reviews"')
      console.log('   - Option C: Add sample reviews for demo purposes')

      console.log('\n   Affected Featured Artists:')
      artistsWithNoReviews
        .filter(a => a.verificationLevel === 'VERIFIED' || a.verificationLevel === 'TRUSTED')
        .forEach(a => console.log(`   - ${a.stageName}`))
    }

    const incompleteProfiles = profileAudits.filter(p => p.completenessScore < 70)
    if (incompleteProfiles.length > 0) {
      console.log(`\n2. INCOMPLETE PROFILES (${incompleteProfiles.length} artists below 70%):`)
      console.log('   These artists should not be featured until profiles are complete')
      incompleteProfiles
        .slice(0, 5)
        .forEach(a => console.log(`   - ${a.stageName}: ${a.completenessScore.toFixed(0)}%`))
    }

    return profileAudits

  } catch (error) {
    console.error('Error auditing artist profiles:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the audit if called directly
if (require.main === module) {
  auditArtistProfiles()
    .then(() => {
      console.log('\n✅ Audit complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Audit failed:', error)
      process.exit(1)
    })
}

export { auditArtistProfiles, type ProfileCompleteness }