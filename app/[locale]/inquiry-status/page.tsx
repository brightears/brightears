'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser, useAuth } from '@clerk/nextjs'
import { PhoneAuth } from '@/components/auth/phone-auth'
import { Link } from '@/components/navigation'

interface InquiryData {
  booking: {
    id: string
    status: string
    eventDate: string
    eventType: string
    artist: {
      stageName: string
      profileImage?: string
    }
    hasQuote: boolean
    quote?: {
      amount: number
      message: string
    }
  }
}

export default function InquiryStatusPage() {
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()
  const { userId } = useAuth()
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)
  
  const phone = searchParams.get('phone')
  const bookingId = searchParams.get('booking')

  const fetchInquiryData = async () => {
    if (!phone || !bookingId) {
      setError('Missing required parameters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `/api/inquiries/quick?bookingId=${bookingId}&phone=${encodeURIComponent(phone)}`
      )
      
      const result = await response.json()
      
      if (response.ok) {
        setInquiryData(result)
      } else {
        setError(result.error || 'Failed to fetch inquiry')
      }
    } catch (err) {
      setError('Failed to load inquiry data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiryData()
  }, [phone, bookingId])

  const handlePhoneAuthSuccess = async (clerkUserId: string) => {
    // After successful authentication, refresh the inquiry data
    await fetchInquiryData()
    setNeedsAuth(false)
  }

  const handlePhoneAuthError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleUpgradeToFullAccount = () => {
    // Redirect to sign-up with phone pre-filled
    window.location.href = `/sign-up?phone=${encodeURIComponent(phone || '')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
          <p className="mt-4 text-dark-gray">Loading your inquiry...</p>
        </div>
      </div>
    )
  }

  if (error && !needsAuth) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-dark-gray mb-4">
              Inquiry Not Found
            </h1>
            <p className="text-dark-gray/70 mb-6">
              {error}
            </p>
            <Link
              href="/"
              className="bg-brand-cyan text-white px-6 py-3 rounded-md hover:bg-brand-cyan/90 inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (needsAuth && phone) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <PhoneAuth
              phone={phone}
              onSuccess={handlePhoneAuthSuccess}
              onError={handlePhoneAuthError}
            />
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!inquiryData) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-dark-gray mb-4">
              No Inquiry Found
            </h1>
            <Link
              href="/"
              className="bg-brand-cyan text-white px-6 py-3 rounded-md hover:bg-brand-cyan/90 inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { booking } = inquiryData

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inquiry':
        return 'bg-yellow-100 text-yellow-800'
      case 'quoted':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inquiry':
        return 'Your inquiry has been sent to the artist. They will respond soon!'
      case 'quoted':
        return 'The artist has sent you a quote. Review and accept to confirm your booking.'
      case 'confirmed':
        return 'Your booking is confirmed! The artist will contact you with event details.'
      case 'cancelled':
        return 'This booking has been cancelled.'
      default:
        return 'Your inquiry is being processed.'
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-2">
              Inquiry Status
            </h1>
            <p className="text-dark-gray/70">
              Track your booking request with {booking.artist.stageName}
            </p>
          </div>

          {/* Artist Info */}
          <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
            {booking.artist.profileImage && (
              <img
                src={booking.artist.profileImage}
                alt={booking.artist.stageName}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
            )}
            <div>
              <h3 className="font-semibold text-dark-gray">
                {booking.artist.stageName}
              </h3>
              <p className="text-dark-gray/70">
                {booking.eventType} • {new Date(booking.eventDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-dark-gray">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-dark-gray/70">
              {getStatusMessage(booking.status)}
            </p>
          </div>

          {/* Quote */}
          {booking.hasQuote && booking.quote && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-dark-gray mb-2">Quote Received</h4>
              <p className="text-2xl font-bold text-green-700 mb-2">
                ฿{booking.quote.amount.toLocaleString()}
              </p>
              {booking.quote.message && (
                <p className="text-dark-gray/70 text-sm">
                  {booking.quote.message}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-dark-gray mb-2">
                  Create Your Account
                </h4>
                <p className="text-dark-gray/70 text-sm mb-3">
                  Create a full account to manage all your bookings in one place.
                </p>
                <button
                  onClick={handleUpgradeToFullAccount}
                  className="bg-brand-cyan text-white px-4 py-2 rounded-md text-sm hover:bg-brand-cyan/90"
                >
                  Create Account
                </button>
              </div>
            )}
            
            {user && (
              <div className="text-center">
                <Link
                  href="/dashboard"
                  className="bg-brand-cyan text-white px-6 py-3 rounded-md hover:bg-brand-cyan/90 inline-block"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/"
                className="text-brand-cyan hover:underline"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}