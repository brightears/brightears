'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useUser, useAuth } from '@clerk/nextjs'
import QuoteManagementModal from './QuoteManagementModal'
import PromptPayModal from './PromptPayModal'

interface BookingWorkflowProps {
  bookingId: string
  userRole: 'artist' | 'customer'
  onStatusChange?: (newStatus: string) => void
}

export default function BookingWorkflow({ bookingId, userRole, onStatusChange }: BookingWorkflowProps) {
  const t = useTranslations('booking')
  const { user, isLoaded, isSignedIn } = useUser()
  const { userId } = useAuth()
  
  const [booking, setBooking] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<any>(null)

  const statusSteps = [
    { key: 'INQUIRY', label: 'Inquiry Received', icon: '📝' },
    { key: 'QUOTED', label: 'Quote Sent', icon: '💰' },
    { key: 'CONFIRMED', label: 'Booking Confirmed', icon: '✅' },
    { key: 'PAID', label: 'Payment Received', icon: '💳' },
    { key: 'COMPLETED', label: 'Event Completed', icon: '🎉' }
  ]

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      const [bookingRes, quotesRes] = await Promise.all([
        fetch(`/api/bookings/${bookingId}`),
        fetch(`/api/quotes?bookingId=${bookingId}`)
      ])

      if (bookingRes.ok) {
        const bookingData = await bookingRes.json()
        setBooking(bookingData)
      }

      if (quotesRes.ok) {
        const quotesData = await quotesRes.json()
        setQuotes(quotesData.quotes || [])
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuoteAction = async (quoteId: string, action: 'accept' | 'reject', notes?: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        fetchBookingDetails()
        if (action === 'accept') {
          const acceptedQuote = quotes.find(q => q.id === quoteId)
          setSelectedQuote(acceptedQuote)
          setShowPaymentModal(true)
        }
      }
    } catch (error) {
      console.error('Error handling quote action:', error)
    }
  }

  const handleBookingStatusUpdate = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchBookingDetails()
        onStatusChange?.(newStatus)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
    }
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status)
  }

  const currentStatusIndex = booking ? getStatusIndex(booking.status) : -1

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!booking) {
    return <div className="text-center text-gray-500">Booking not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Booking Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-dark-gray">
              {booking.eventType}
            </h2>
            <p className="text-gray-600">
              Booking #{booking.bookingNumber}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === 'INQUIRY' ? 'bg-blue-100 text-blue-800' :
            booking.status === 'QUOTED' ? 'bg-yellow-100 text-yellow-800' :
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
            booking.status === 'PAID' ? 'bg-purple-100 text-purple-800' :
            booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Date & Time</h4>
            <p className="text-gray-600">{formatDateTime(booking.startTime)}</p>
            <p className="text-sm text-gray-500">Duration: {booking.duration} hours</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Venue</h4>
            <p className="text-gray-600">{booking.venue}</p>
            <p className="text-sm text-gray-500">{booking.venueAddress}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              {userRole === 'artist' ? 'Customer' : 'Artist'}
            </h4>
            <p className="text-gray-600">
              {userRole === 'artist' ? booking.customerName : booking.artistName}
            </p>
            <p className="text-sm text-gray-500">
              {userRole === 'artist' ? booking.customerEmail : booking.artistCategory}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Booking Progress</h4>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStatusIndex 
                    ? 'bg-brand-cyan text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${
                  index <= currentStatusIndex ? 'text-brand-cyan font-medium' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute h-0.5 w-16 mt-5 ${
                    index < currentStatusIndex ? 'bg-brand-cyan' : 'bg-gray-200'
                  }`} style={{ marginLeft: '2.5rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {userRole === 'artist' && booking.status === 'INQUIRY' && (
            <button
              onClick={() => setShowQuoteModal(true)}
              className="px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 font-medium"
            >
              Send Quote
            </button>
          )}
          
          {userRole === 'artist' && booking.status === 'PAID' && (
            <button
              onClick={() => handleBookingStatusUpdate('COMPLETED')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Mark as Completed
            </button>
          )}

          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <button
              onClick={() => handleBookingStatusUpdate('CANCELLED')}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Quotes Section */}
      {quotes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotes</h3>
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xl font-bold text-brand-cyan">
                      ฿{quote.quotedPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valid until {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                {/* Inclusions */}
                {quote.inclusions.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-900 mb-2">Included:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {quote.inclusions.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deposit Info */}
                {quote.requiresDeposit && (
                  <div className="mb-3 bg-blue-50 p-3 rounded">
                    <h5 className="font-medium text-blue-900 mb-1">Deposit Required:</h5>
                    <p className="text-sm text-blue-700">
                      ฿{(quote.depositAmount || (quote.quotedPrice * (quote.depositPercentage / 100))).toLocaleString()}
                      {quote.depositPercentage && ` (${quote.depositPercentage}%)`}
                    </p>
                  </div>
                )}

                {/* Customer Actions */}
                {userRole === 'customer' && quote.status === 'PENDING' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleQuoteAction(quote.id, 'accept')}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                    >
                      Accept Quote
                    </button>
                    <button
                      onClick={() => handleQuoteAction(quote.id, 'reject')}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm font-medium"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {/* Payment Button for Accepted Quotes */}
                {userRole === 'customer' && quote.status === 'ACCEPTED' && booking.status === 'CONFIRMED' && !booking.depositPaid && (
                  <button
                    onClick={() => {
                      setSelectedQuote(quote)
                      setShowPaymentModal(true)
                    }}
                    className="mt-3 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 font-medium"
                  >
                    Pay {quote.requiresDeposit ? 'Deposit' : 'Full Amount'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Requests */}
      {booking.specialRequests && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
          <p className="text-gray-700">{booking.specialRequests}</p>
        </div>
      )}

      {/* Modals */}
      {showQuoteModal && (
        <QuoteManagementModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          booking={booking}
          onQuoteCreated={(quote) => {
            setQuotes([...quotes, quote])
            setShowQuoteModal(false)
          }}
        />
      )}

      {showPaymentModal && selectedQuote && (
        <PromptPayModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={booking}
          quote={selectedQuote}
          onPaymentConfirmed={() => {
            setShowPaymentModal(false)
            fetchBookingDetails()
          }}
        />
      )}
    </div>
  )
}