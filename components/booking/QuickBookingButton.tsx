'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import QuickBookingModal from './QuickBookingModal'

interface Artist {
  id: string
  stageName: string
  category: string
  baseCity: string
  hourlyRate?: number
  minimumHours?: number
  profileImage?: string
  averageRating?: number
  reviewCount?: number
  isAvailable?: boolean
}

interface QuickBookingButtonProps {
  artist: Artist
  variant?: 'primary' | 'secondary' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function QuickBookingButton({
  artist,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: QuickBookingButtonProps) {
  const t = useTranslations('booking.quick')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
    
    // Size variants
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm', 
      lg: 'px-6 py-3 text-base'
    }
    
    // Style variants
    const variantClasses = {
      primary: 'bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white hover:from-brand-cyan/90 hover:to-deep-teal/90 shadow-lg hover:shadow-xl',
      secondary: 'border-2 border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-pure-white',
      compact: 'bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/20'
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  }

  const getIconSize = () => {
    return size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
  }

  const getButtonText = () => {
    switch (variant) {
      case 'compact':
        return t('title')
      case 'secondary':
        return t('sendInquiry')
      default:
        return t('title')
    }
  }

  const handleClick = () => {
    if (!disabled) {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className={getButtonClasses()}
        title={disabled ? 'Artist not available' : `Book ${artist.stageName}`}
      >
        <svg 
          className={`${getIconSize()} ${size === 'sm' ? 'mr-1' : 'mr-2'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
        {getButtonText()}
      </button>

      <QuickBookingModal
        artist={artist}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}