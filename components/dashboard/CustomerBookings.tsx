'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import CustomerQuoteReview from './CustomerQuoteReview'

interface User {
  id: string
  email?: string
  role: string
  customer?: {
    id: string
    firstName?: string
    lastName?: string
  }
}

interface Quote {
  id: string
  quotedPrice: number
  currency: string
  requiresDeposit: boolean
  depositAmount?: number
  depositPercentage?: number
  inclusions: string[]
  exclusions: string[]
  notes?: string
  validUntil: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
  createdAt: string
}

interface Booking {
  id: string
  bookingNumber?: string
  artistId: string
  artist: {
    stageName: string
    profileImage?: string
  }
  eventDate: string
  startTime: string
  endTime: string
  duration: number
  eventType: string
  status: string
  totalAmount?: number
  venue?: string
  venueAddress: string
  guestCount?: number
  specialRequests?: string
  createdAt: string
  quotes?: Quote[]
}

interface CustomerBookingsProps {
  locale: string
  user: User
}

export default function CustomerBookings({ locale, user }: CustomerBookingsProps) {
  const t = useTranslations('dashboard.customer.bookings')
  const tCommon = useTranslations('common')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [selectedQuoteBooking, setSelectedQuoteBooking] = useState<Booking | null>(null)
  const [isQuoteLoading, setIsQuoteLoading] = useState(false)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings')
        if (response.ok) {
          const data = await response.json()
          setBookings(data.bookings || [])
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status.toLowerCase() === filter
  })


  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inquiry':
        return t('status.inquiry') || 'Inquiry Sent'
      case 'quoted':
        return t('status.quoted') || 'Quote Received'
      case 'pending':
        return t('status.pending')
      case 'confirmed':
        return t('status.confirmed')
      case 'completed':
        return t('status.completed')
      case 'cancelled':
        return t('status.cancelled')
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'inquiry':
        return 'bg-blue-100 text-blue-800'
      case 'quoted':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`
  }

  const handleQuoteResponse = async (quoteId: string, action: 'accept' | 'reject', notes?: string) => {
    setIsQuoteLoading(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action, 
          customerNotes: notes 
        }),
      })

      if (response.ok) {
        // Refresh bookings to show updated status
        const bookingsResponse = await fetch('/api/bookings')
        if (bookingsResponse.ok) {
          const data = await bookingsResponse.json()
          setBookings(data.bookings || [])
        }
        setSelectedQuoteBooking(null)
      } else {
        const error = await response.json()
        alert(error.message || 'Error responding to quote')
      }
    } catch (error) {
      console.error('Error responding to quote:', error)
      alert('Error responding to quote')
    }
    setIsQuoteLoading(false)
  }

  if (isLoading) {
    return <CustomerBookingsSkeleton />
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray">
            {t('title')}
          </h1>
          <p className="text-dark-gray font-inter mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: t('filters.all') },
                { key: 'pending', label: t('filters.pending') },
                { key: 'confirmed', label: t('filters.confirmed') },
                { key: 'completed', label: t('filters.completed') },
                { key: 'cancelled', label: t('filters.cancelled') }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-inter ${
                    filter === tab.key
                      ? 'border-brand-cyan text-brand-cyan'
                      : 'border-transparent text-dark-gray/70 hover:text-dark-gray hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key ? 'bg-brand-cyan text-pure-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.key === 'all' 
                      ? bookings.length 
                      : bookings.filter(b => b.status.toLowerCase() === tab.key).length
                    }
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-playfair font-semibold text-dark-gray mb-2">
              {filter === 'all' ? t('empty.noBookings') : t('empty.noBookingsForFilter')}
            </h3>
            <p className="text-dark-gray/70 font-inter mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? t('empty.startBooking')
                : t('empty.tryDifferentFilter')
              }
            </p>
            {filter === 'all' && (
              <Link
                href={`/${locale}/artists`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('empty.browseArtists')}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-playfair font-bold text-dark-gray mb-2">
                      {booking.artist.stageName}
                    </h3>
                    <div className="space-y-1 text-sm text-dark-gray/70 font-inter">
                      <p>{t('eventType')}: {booking.eventType}</p>
                      <p>{t('eventDate')}: {formatDate(booking.eventDate)}</p>
                      {booking.venue && <p>{t('venue')}: {booking.venue}</p>}
                      <p>{t('bookedOn')}: {formatDate(booking.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                    {booking.status.toLowerCase() === 'quoted' && booking.quotes && booking.quotes.some(q => q.status === 'PENDING') && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-brand-cyan text-pure-white rounded-full animate-pulse">
                          Action Required
                        </span>
                      </div>
                    )}
                    {booking.totalAmount && (
                      <p className="text-lg font-playfair font-bold text-dark-gray mt-2">
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-dark-gray/70 font-inter">
                    {t('bookingId')}: {booking.id.slice(0, 8)}...
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/artists/${booking.artistId}`}
                      className="px-3 py-1 text-sm border border-brand-cyan text-brand-cyan rounded hover:bg-brand-cyan hover:text-pure-white transition-colors font-inter font-medium"
                    >
                      {t('viewArtist')}
                    </Link>
                    {booking.status.toLowerCase() === 'quoted' && booking.quotes && booking.quotes.some(q => q.status === 'PENDING') ? (
                      <button
                        onClick={() => setSelectedQuoteBooking(booking)}
                        className="px-3 py-1 text-sm bg-brand-cyan text-pure-white rounded hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
                      >
                        Review Quote
                      </button>
                    ) : booking.status.toLowerCase() === 'confirmed' && !booking.totalAmount ? (
                      <button
                        onClick={() => setSelectedQuoteBooking(booking)}
                        className="px-3 py-1 text-sm bg-green-600 text-pure-white rounded hover:bg-green-700 transition-colors font-inter font-medium"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <Link
                        href={`/${locale}/bookings/${booking.id}`}
                        className="px-3 py-1 text-sm bg-brand-cyan text-pure-white rounded hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
                      >
                        {t('viewDetails')}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <div className="mt-8 bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
              {t('summary.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-brand-cyan">
                  {bookings.length}
                </p>
                <p className="text-sm text-dark-gray/70 font-inter">
                  {t('summary.totalBookings')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-earthy-brown">
                  {bookings.filter(b => b.status.toLowerCase() === 'completed').length}
                </p>
                <p className="text-sm text-dark-gray/70 font-inter">
                  {t('summary.completedEvents')}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-playfair font-bold text-soft-lavender">
                  {formatCurrency(
                    bookings
                      .filter(b => b.totalAmount)
                      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
                  )}
                </p>
                <p className="text-sm text-dark-gray/70 font-inter">
                  {t('summary.totalSpent')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quote Review Modal */}
        {selectedQuoteBooking && (
          <CustomerQuoteReview
            booking={selectedQuoteBooking}
            locale={locale}
            onQuoteResponse={handleQuoteResponse}
            onClose={() => setSelectedQuoteBooking(null)}
            showPaymentOption={selectedQuoteBooking.status.toLowerCase() === 'confirmed'}
          />
        )}
      </div>
    </div>
  )
}

function CustomerBookingsSkeleton() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="flex gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}