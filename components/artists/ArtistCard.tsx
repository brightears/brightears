'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

interface ArtistCardProps {
  artist: {
    id: string
    stageName: string
    bio?: string
    bioTh?: string
    category: string
    baseCity: string
    profileImage?: string
    averageRating?: number
    reviewCount: number
    hourlyRate?: number
    verificationLevel: string
    genres: string[]
  }
  locale: string
}

export default function ArtistCard({ artist, locale }: ArtistCardProps) {
  const t = useTranslations('artists')
  
  const bio = locale === 'th' && artist.bioTh ? artist.bioTh : artist.bio
  
  const formatPrice = (price?: number) => {
    if (!price) return t('priceOnRequest')
    return `฿${price.toLocaleString()}/hr`
  }
  
  const renderStars = (rating?: number) => {
    if (!rating) return null
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
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
  
  const getVerificationBadge = () => {
    switch (artist.verificationLevel) {
      case 'TRUSTED':
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            ✓ {t('trusted')}
          </span>
        )
      case 'VERIFIED':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            ✓ {t('verified')}
          </span>
        )
      default:
        return null
    }
  }
  
  return (
    <Link href={`/${locale}/artists/${artist.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
        <div className="relative h-48 bg-gray-200">
          {artist.profileImage ? (
            <Image
              src={artist.profileImage}
              alt={artist.stageName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            {getVerificationBadge()}
          </div>
          
          <div className="absolute bottom-2 left-2">
            <span className="bg-brightears text-white text-xs px-2 py-1 rounded">
              {t(`category.${artist.category}`)}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{artist.stageName}</h3>
          
          <p className="text-gray-600 text-sm mb-2">
            📍 {artist.baseCity}
          </p>
          
          {bio && (
            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
              {bio}
            </p>
          )}
          
          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {artist.genres.slice(0, 3).map((genre) => (
                <span key={genre} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <div className="text-sm font-semibold text-brightears-600">
              {formatPrice(artist.hourlyRate)}
            </div>
            
            {artist.averageRating && renderStars(artist.averageRating)}
          </div>
        </div>
      </div>
    </Link>
  )
}