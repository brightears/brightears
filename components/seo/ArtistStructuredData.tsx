'use client'

import { useEffect } from 'react'
import { generateArtistSchema } from '@/lib/schemas/structured-data'

interface ArtistStructuredDataProps {
  artist: {
    id: string
    stageName: string
    bio: string
    profileImageUrl: string
    category: string
    baseCity?: string
    hourlyRate: number
    averageRating?: number
    totalReviews?: number
  }
  locale: string
}

/**
 * Client-side component to inject artist structured data after artist data is loaded
 * This is necessary because the artist profile is a client component that fetches data
 */
export default function ArtistStructuredData({ artist, locale }: ArtistStructuredDataProps) {
  useEffect(() => {
    // Generate the artist schema
    const schema = generateArtistSchema({
      artistId: artist.id,
      stageName: artist.stageName,
      bio: artist.bio,
      profileImageUrl: artist.profileImageUrl,
      category: artist.category,
      baseCity: artist.baseCity,
      hourlyRate: artist.hourlyRate,
      averageRating: artist.averageRating,
      totalReviews: artist.totalReviews,
      locale
    })

    // Check if script already exists
    const existingScript = document.querySelector('script[data-artist-schema]')
    if (existingScript) {
      existingScript.remove()
    }

    // Create and inject the script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-artist-schema', 'true')
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-artist-schema]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [artist, locale])

  return null // This component doesn't render anything
}
