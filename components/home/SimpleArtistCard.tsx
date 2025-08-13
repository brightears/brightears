'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

interface SimpleArtistCardProps {
  artist: {
    id: string
    stageName: string
    category: string
    baseCity: string
    profileImage?: string
    averageRating?: number
    reviewCount: number
    hourlyRate?: number
    genres: string[]
  }
  locale: string
}

export default function SimpleArtistCard({ artist, locale }: SimpleArtistCardProps) {
  const t = useTranslations('artists')
  
  const formatPrice = (price?: number) => {
    if (!price) return t('priceOnRequest')
    return `From ฿${price.toLocaleString()}`
  }
  
  const renderStars = (rating?: number) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < fullStars ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)} ({artist.reviewCount})
        </span>
      </div>
    )
  }
  
  return (
    <Link href={`/${locale}/artists/${artist.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group">
        {/* Artist Photo */}
        <div className="relative h-48 bg-gray-200">
          {artist.profileImage ? (
            <Image
              src={artist.profileImage}
              alt={artist.stageName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-200 to-gray-300">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-brand-cyan text-pure-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
              {formatPrice(artist.hourlyRate)}
            </span>
          </div>
        </div>
        
        {/* Artist Info */}
        <div className="p-4">
          {/* Name */}
          <h3 className="font-playfair font-bold text-lg mb-1 text-deep-teal group-hover:text-brand-cyan transition-colors">
            {artist.stageName}
          </h3>
          
          {/* Location */}
          <p className="text-gray-600 text-sm mb-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {artist.baseCity}
          </p>
          
          {/* Rating */}
          {artist.averageRating && (
            <div className="mb-3">
              {renderStars(artist.averageRating)}
            </div>
          )}
          
          {/* Genres */}
          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artist.genres.slice(0, 3).map((genre) => (
                <span 
                  key={genre} 
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
              {artist.genres.length > 3 && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{artist.genres.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}