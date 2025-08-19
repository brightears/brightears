'use client'

import { useState } from 'react'
import PromptPayModal from '../booking/PromptPayModal'

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
  artist: {
    stageName: string
    profileImage?: string
  }
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  duration: number
  venue?: string
  venueAddress: string
  guestCount?: number
  specialRequests?: string
  status: string
  quotes?: Quote[]
}

interface CustomerQuoteReviewProps {
  booking: Booking
  locale: string
  onQuoteResponse: (quoteId: string, action: 'accept' | 'reject', notes?: string) => Promise<void>
  onClose: () => void
  showPaymentOption?: boolean
}

export default function CustomerQuoteReview({ 
  booking, 
  locale, 
  onQuoteResponse, 
  onClose,
  showPaymentOption = false
}: CustomerQuoteReviewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [responseNotes, setResponseNotes] = useState('')
  const [showNotesInput, setShowNotesInput] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [quoteAccepted, setQuoteAccepted] = useState(false)

  const activeQuote = booking.quotes?.find(q => q.status === 'PENDING')
  
  if (!activeQuote) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`
  }

  const isQuoteExpired = new Date(activeQuote.validUntil) < new Date()

  const handleQuoteResponse = async (action: 'accept' | 'reject') => {
    setIsLoading(true)
    try {
      await onQuoteResponse(activeQuote.id, action, responseNotes || undefined)
      if (action === 'accept') {
        setQuoteAccepted(true)
        setShowNotesInput(null)
        setResponseNotes('')
        // Don't close modal if payment is needed
        if (!showPaymentOption) {
          onClose()
        }
      } else {
        onClose()
      }
    } catch (error) {
      console.error('Error responding to quote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentConfirmed = () => {
    setShowPaymentModal(false)
    onClose()
  }

  const getDepositInfo = () => {
    if (!activeQuote.requiresDeposit) return null
    
    if (activeQuote.depositAmount) {
      return formatCurrency(activeQuote.depositAmount)
    } else if (activeQuote.depositPercentage) {
      const depositAmount = (activeQuote.quotedPrice * activeQuote.depositPercentage) / 100
      return `${activeQuote.depositPercentage}% (${formatCurrency(depositAmount)})`
    }
    return 'Required'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-dark-gray bg-opacity-50" 
          onClick={onClose}
        />
        <div className="relative bg-pure-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-pure-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl font-semibold text-dark-gray">
                Quote from {booking.artist.stageName}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="px-6 py-6 space-y-8">
            {/* Quote Expiration Warning */}
            {isQuoteExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 font-medium">This quote has expired</p>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  Valid until: {formatDate(activeQuote.validUntil)} at {formatTime(activeQuote.validUntil)}
                </p>
              </div>
            )}

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-playfair text-lg font-medium text-dark-gray mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Event:</strong> {booking.eventType}</div>
                <div><strong>Date:</strong> {formatDate(booking.eventDate)}</div>
                <div><strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                <div><strong>Duration:</strong> {booking.duration} hours</div>
                <div><strong>Venue:</strong> {booking.venue || 'Not specified'}</div>
                {booking.guestCount && <div><strong>Guests:</strong> {booking.guestCount}</div>}
              </div>
              {booking.specialRequests && (
                <div className="mt-4">
                  <strong className="text-sm">Special Requests:</strong>
                  <p className="text-sm text-gray-600 mt-1">{booking.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Quote Details */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-playfair text-xl font-medium text-dark-gray">Quote Details</h3>
                <div className="text-right">
                  <div className="text-3xl font-playfair font-bold text-brand-cyan">
                    {formatCurrency(activeQuote.quotedPrice)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Price ({activeQuote.currency})
                  </div>
                </div>
              </div>

              {/* Deposit Information */}
              {activeQuote.requiresDeposit && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <h4 className="font-medium text-blue-800">Deposit Required</h4>
                  </div>
                  <p className="text-blue-700">
                    A deposit of <strong>{getDepositInfo()}</strong> is required to secure this booking.
                  </p>
                </div>
              )}

              {/* Inclusions */}
              {activeQuote.inclusions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-dark-gray mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    What's Included
                  </h4>
                  <ul className="space-y-2">
                    {activeQuote.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {activeQuote.exclusions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-dark-gray mb-3 flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Not Included
                  </h4>
                  <ul className="space-y-2">
                    {activeQuote.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Artist Notes */}
              {activeQuote.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Message from Artist
                  </h4>
                  <p className="text-amber-700 text-sm">{activeQuote.notes}</p>
                </div>
              )}

              {/* Quote Validity */}
              <div className="text-sm text-gray-500 mb-6">
                <strong>Quote valid until:</strong> {formatDate(activeQuote.validUntil)} at {formatTime(activeQuote.validUntil)}
              </div>
            </div>

            {/* Response Notes */}
            {showNotesInput && (
              <div>
                <label htmlFor="responseNotes" className="block text-sm font-medium text-dark-gray mb-2">
                  Add a message (optional)
                </label>
                <textarea
                  id="responseNotes"
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Any questions or comments..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  rows={3}
                />
              </div>
            )}

            {/* Quote Acceptance Success */}
            {quoteAccepted && showPaymentOption && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg font-medium text-green-800">Quote Accepted!</h3>
                </div>
                <p className="text-green-700 mb-6">
                  Your booking has been confirmed. {activeQuote.requiresDeposit ? 'A deposit payment' : 'Full payment'} is required to secure your booking.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {activeQuote.requiresDeposit ? 'Deposit Required:' : 'Total Amount:'}
                    </span>
                    <span className="text-2xl font-bold text-brand-cyan">
                      {formatCurrency(activeQuote.requiresDeposit 
                        ? (activeQuote.depositAmount || (activeQuote.quotedPrice * (activeQuote.depositPercentage || 0) / 100))
                        : activeQuote.quotedPrice
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-brand-cyan text-pure-white px-6 py-4 rounded-lg font-medium hover:bg-brand-cyan/80 transition-colors text-lg"
                >
                  Pay with PromptPay
                </button>
                
                <p className="text-sm text-gray-600 text-center mt-3">
                  Secure payment processing • Cancel anytime before payment
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!isQuoteExpired && !quoteAccepted && (
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (showNotesInput === 'accept') {
                      handleQuoteResponse('accept')
                    } else {
                      setShowNotesInput('accept')
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-brand-cyan text-pure-white px-6 py-3 rounded-lg font-medium hover:bg-brand-cyan/80 disabled:opacity-50 transition-colors"
                >
                  {showNotesInput === 'accept' ? 'Confirm Acceptance' : 'Accept Quote'}
                </button>
                <button
                  onClick={() => {
                    if (showNotesInput === 'reject') {
                      handleQuoteResponse('reject')
                    } else {
                      setShowNotesInput('reject')
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1 bg-gray-600 text-pure-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {showNotesInput === 'reject' ? 'Confirm Rejection' : 'Decline Quote'}
                </button>
                {showNotesInput && (
                  <button
                    onClick={() => {
                      setShowNotesInput(null)
                      setResponseNotes('')
                    }}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}

            {/* Close button for completed quote acceptance */}
            {quoteAccepted && !showPaymentOption && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full bg-brand-cyan text-pure-white px-6 py-3 rounded-lg font-medium hover:bg-brand-cyan/80 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* PromptPay Payment Modal */}
      {showPaymentModal && activeQuote && (
        <PromptPayModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          booking={booking}
          quote={activeQuote}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}
    </div>
  )
}