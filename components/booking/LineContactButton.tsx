'use client'

import { useTranslations } from 'next-intl'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from '@/components/navigation'

interface LineContactButtonProps {
  artistId: string
  artistName: string
  lineId: string
  eventDate?: string
  eventType?: string
  location?: string
  size?: 'sm' | 'md' | 'lg'
  onInquiryTrack?: () => void
}

export default function LineContactButton({ 
  artistId,
  artistName, 
  lineId, 
  eventDate,
  eventType,
  location,
  size = 'md',
  onInquiryTrack 
}: LineContactButtonProps) {
  const t = useTranslations('booking')
  const { user, isLoaded } = useUser()
  const { openSignIn } = useClerk()
  const router = useRouter()

  // Generate pre-filled message template
  const generateLineMessage = () => {
    const baseMessage = t('lineMessage.greeting', { artistName })
    
    let message = `${baseMessage}\n\n`
    
    if (eventDate) {
      message += `${t('lineMessage.eventDate')}: ${eventDate}\n`
    }
    
    if (eventType) {
      message += `${t('lineMessage.eventType')}: ${eventType}\n`
    }
    
    if (location) {
      message += `${t('lineMessage.location')}: ${location}\n`
    }
    
    message += `\n${t('lineMessage.footer')}`
    
    return encodeURIComponent(message)
  }

  // Track inquiry when LINE button is clicked
  const handleLineClick = async () => {
    // Check if user is authenticated
    if (!isLoaded) return
    
    if (!user) {
      // Show sign-in modal or redirect to sign-in
      openSignIn({
        fallbackRedirectUrl: window.location.href,
      })
      return
    }

    // Track the inquiry in the database
    if (user && onInquiryTrack) {
      try {
        await fetch('/api/bookings/inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            artistId,
            userId: user.id,
            eventDate: eventDate || null,
            eventType: eventType || null,
            location: location || null,
            inquiryMethod: 'LINE'
          }),
        })
        onInquiryTrack()
      } catch (error) {
        console.error('Error tracking inquiry:', error)
      }
    }

    // Open LINE with pre-filled message
    const message = generateLineMessage()
    const lineUrl = `https://line.me/R/ti/p/@${lineId}?text=${message}`
    window.open(lineUrl, '_blank')
  }

  // Button size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  // Icon size classes
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={handleLineClick}
      className={`
        flex items-center justify-center gap-3 w-full
        bg-[#00B900] hover:bg-[#009900] 
        text-white font-inter font-semibold rounded-lg 
        transition-all duration-200 hover:shadow-lg
        ${sizeClasses[size]}
        ${!user ? 'relative overflow-hidden' : ''}
      `}
    >
      {/* LINE Icon */}
      <svg 
        className={`${iconSizeClasses[size]} fill-current`} 
        viewBox="0 0 24 24"
      >
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771zm-7.24.001c0 .348-.283.629-.631.629-.345 0-.627-.281-.627-.629V8.108c0-.345.282-.63.627-.63.348 0 .631.285.631.63v4.772zm-2.466.629H4.917c-.345 0-.63-.281-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.23c.348 0 .629.283.629.629 0 .348-.281.631-.629.631M24 6.954c0-3.845-3.924-6.954-8.748-6.954S6.504 3.109 6.504 6.954c0 3.436 3.046 6.309 7.155 6.777.278.06.657.183.752.42.087.216.056.555.028.775 0 0-.101.603-.123.732-.037.216-.173.845.74.461.913-.384 4.92-2.891 6.714-4.949C23.124 9.813 24 8.456 24 6.954"/>
      </svg>
      
      <span>{t('contactViaLine')}</span>
      
      {/* Lock icon for non-authenticated users */}
      {!user && (
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )}
    </button>
  )
}