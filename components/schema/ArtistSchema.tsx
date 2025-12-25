/**
 * ArtistSchema Component
 *
 * Generates JSON-LD structured data for artist profiles using Schema.org vocabulary
 * to make artist information discoverable by AI systems (ChatGPT, Perplexity, Claude)
 * and improve SEO.
 *
 * Schema Types Used:
 * - Person/PerformingGroup: The artist entity
 * - Service: Entertainment services offered
 * - Offer: Pricing and availability information
 * - AggregateRating: Reviews and ratings
 * - Place: Service areas (cities in Thailand)
 */

import { Artist } from '@prisma/client'

interface ArtistSchemaProps {
  artist: {
    id: string
    stageName: string
    bio: string | null
    bioTh: string | null
    hourlyRate: any | null // Decimal
    minimumHours: number
    category: string
    subCategories: string[]
    baseCity: string
    serviceAreas: string[]
    genres: string[]
    languages: string[]
    averageRating: number | null
    totalBookings: number
    completedBookings: number
    profileImage: string | null
    coverImage: string | null
    website: string | null
    facebook: string | null
    instagram: string | null
    tiktok: string | null
    youtube: string | null
    spotify: string | null
    lineId: string | null
    createdAt: Date
  }
  locale?: string
}

export default function ArtistSchema({ artist, locale = 'en' }: ArtistSchemaProps) {
  const baseUrl = 'https://brightears.onrender.com'
  const artistUrl = `${baseUrl}/${locale}/artists/${artist.id}`

  // Determine if this is a group or individual
  const isGroup = ['BAND', 'DANCER'].includes(artist.category)

  // Convert hourly rate to number (Prisma Decimal)
  const hourlyRateNum = artist.hourlyRate ? Number(artist.hourlyRate) : null

  // Calculate price range in THB
  const priceRange = hourlyRateNum && artist.minimumHours
    ? `฿${(hourlyRateNum * artist.minimumHours).toLocaleString()}-฿${(hourlyRateNum * artist.minimumHours * 4).toLocaleString()}`
    : '฿5000-฿50000' // Default range

  // Base entity (Person or PerformingGroup)
  const baseEntity = {
    '@type': isGroup ? 'PerformingGroup' : 'Person',
    '@id': artistUrl,
    'name': artist.stageName,
    'description': locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio || `Professional ${artist.category.toLowerCase()} available for hire in ${artist.baseCity}, Thailand`,
    'url': artistUrl,
    'image': artist.profileImage || artist.coverImage || `${baseUrl}/images/default-artist.jpg`,

    // Contact and social media
    'sameAs': [
      artist.website,
      artist.facebook,
      artist.instagram,
      artist.tiktok,
      artist.youtube,
      artist.spotify,
    ].filter(Boolean),

    // Location
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': artist.baseCity,
      'addressCountry': 'TH'
    },

    // Service areas
    'areaServed': artist.serviceAreas.map(city => ({
      '@type': 'City',
      'name': city,
      'addressCountry': 'TH'
    })),

    // Aggregate rating (if available)
    ...(artist.averageRating && artist.totalBookings > 0 ? {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': artist.averageRating.toFixed(1),
        'reviewCount': artist.totalBookings,
        'bestRating': 5,
        'worstRating': 1
      }
    } : {}),

    // Performance stats
    'award': artist.completedBookings > 50 ? `${artist.completedBookings}+ successful events` : undefined,
  }

  // Service offered
  const serviceSchema = {
    '@type': 'Service',
    '@id': `${artistUrl}#service`,
    'name': `${artist.category} Entertainment Services`,
    'description': `Professional ${artist.category.toLowerCase()} services for events, weddings, corporate functions, and venues in ${artist.baseCity} and surrounding areas`,
    'provider': {
      '@id': artistUrl
    },
    'serviceType': [
      artist.category,
      ...artist.subCategories
    ],
    'areaServed': artist.serviceAreas.map(city => ({
      '@type': 'City',
      'name': city,
      'addressCountry': 'TH'
    })),

    // Offer with pricing
    'offers': {
      '@type': 'Offer',
      'price': hourlyRateNum || 'Contact for pricing',
      'priceCurrency': 'THB',
      'priceSpecification': hourlyRateNum ? {
        '@type': 'UnitPriceSpecification',
        'price': hourlyRateNum,
        'priceCurrency': 'THB',
        'unitText': 'HOUR',
        'minPrice': hourlyRateNum * artist.minimumHours,
        'referenceQuantity': {
          '@type': 'QuantitativeValue',
          'value': artist.minimumHours,
          'unitText': 'HOUR'
        }
      } : undefined,
      'availability': 'https://schema.org/InStock',
      'url': artistUrl,
      'validFrom': new Date().toISOString(),
      'seller': {
        '@id': artistUrl
      }
    },

    // Additional service details
    'additionalType': artist.genres.length > 0 ? artist.genres : undefined,
    'availableLanguage': artist.languages.map(lang => {
      const langMap: Record<string, string> = {
        'en': 'English',
        'th': 'Thai',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean'
      }
      return langMap[lang] || lang
    })
  }

  // Event schema (for music/performance events)
  const eventSchema = {
    '@type': 'Event',
    '@id': `${artistUrl}#event`,
    'name': `${artist.stageName} Performance`,
    'description': `Live ${artist.category.toLowerCase()} performance by ${artist.stageName}`,
    'performer': {
      '@id': artistUrl
    },
    'location': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': artist.baseCity,
        'addressCountry': 'TH'
      }
    },
    'offers': {
      '@type': 'Offer',
      'price': hourlyRateNum || 'Contact for pricing',
      'priceCurrency': 'THB',
      'availability': 'https://schema.org/InStock',
      'url': artistUrl
    }
  }

  // Main structured data object
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      baseEntity,
      serviceSchema,
      eventSchema
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

/**
 * Usage Example:
 *
 * import ArtistSchema from '@/components/schema/ArtistSchema'
 *
 * // In your page component:
 * <ArtistSchema artist={artistData} locale={locale} />
 *
 * This will inject JSON-LD structured data into the page <head>,
 * making the artist profile discoverable by:
 * - Google Search (rich results)
 * - AI systems (ChatGPT, Perplexity, Claude)
 * - Social media platforms (Open Graph)
 * - Voice assistants (Alexa, Google Assistant)
 */
