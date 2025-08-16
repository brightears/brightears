'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useFavorites } from './FavoritesContext'

interface FavoriteButtonProps {
  artistId: string
  artistName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'text' | 'full'
  className?: string
  showLoginPrompt?: boolean
}

export default function FavoriteButton({ 
  artistId, 
  artistName = 'this artist',
  size = 'md', 
  variant = 'icon',
  className = '',
  showLoginPrompt = true
}: FavoriteButtonProps) {
  const { data: session } = useSession()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isLoading, setIsLoading] = useState(false)
  
  const isUserFavorite = isFavorite(artistId)
  const isCustomer = session?.user?.role === 'CUSTOMER'

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      if (showLoginPrompt) {
        // Could trigger a login modal here
        alert('Please sign in to save favorites')
      }
      return
    }

    if (!isCustomer) {
      alert('Only customers can save favorites')
      return
    }

    setIsLoading(true)
    try {
      const success = await toggleFavorite(artistId)
      if (!success) {
        alert('Failed to update favorites. Please try again.')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Size classes
  const sizeClasses = {
    sm: 'p-1 w-6 h-6',
    md: 'p-2 w-8 h-8', 
    lg: 'p-3 w-10 h-10'
  }

  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  // Base button classes
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg border transition-all duration-200
    ${isUserFavorite 
      ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
      : 'bg-pure-white border-gray-200 text-dark-gray hover:text-red-500 hover:border-red-200'
    }
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${sizeClasses[size]}
    ${className}
  `

  const HeartIcon = () => (
    <svg 
      className={iconSizeClasses[size]} 
      fill={isUserFavorite ? 'currentColor' : 'none'} 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
      />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={baseClasses}
        title={isUserFavorite ? `Remove ${artistName} from favorites` : `Add ${artistName} to favorites`}
        aria-label={isUserFavorite ? `Remove from favorites` : `Add to favorites`}
      >
        <HeartIcon />
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all
          ${isUserFavorite 
            ? 'bg-red-50 text-red-600 hover:bg-red-100' 
            : 'bg-gray-50 text-dark-gray hover:bg-red-50 hover:text-red-600'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
      >
        <HeartIcon />
        {isUserFavorite ? 'Favorited' : 'Add to Favorites'}
      </button>
    )
  }

  // Full variant with text
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
        ${isUserFavorite 
          ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100' 
          : 'bg-pure-white border border-gray-200 text-dark-gray hover:bg-red-50 hover:text-red-600 hover:border-red-200'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <HeartIcon />
      {isLoading 
        ? 'Updating...' 
        : isUserFavorite 
          ? 'Remove from Favorites' 
          : 'Add to Favorites'
      }
    </button>
  )
}