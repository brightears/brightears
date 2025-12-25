'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useUser } from '@clerk/nextjs'

interface QuoteManagementModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  onQuoteCreated?: (quote: any) => void
}

export default function QuoteManagementModal({ 
  isOpen, 
  onClose, 
  booking, 
  onQuoteCreated 
}: QuoteManagementModalProps) {
  const t = useTranslations('booking')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'create' | 'review' | 'sent'>('create')

  // Quote form state
  const [quoteData, setQuoteData] = useState({
    quotedPrice: booking?.quotedPrice || '',
    currency: 'THB',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    inclusions: ['Professional DJ setup', 'Sound system', 'Microphones'],
    exclusions: ['Travel costs beyond 30km', 'Additional lighting'],
    notes: '',
    requiresDeposit: false,
    depositPercentage: 30,
    depositAmount: ''
  })

  const [packageTemplates] = useState([
    {
      name: 'Wedding Package',
      basePrice: 25000,
      duration: 4,
      inclusions: [
        'Professional DJ setup',
        'MC services', 
        'Special effects lighting',
        'Unlimited song requests',
        'First dance coordination',
        'Sound system for 200 guests'
      ]
    },
    {
      name: 'Corporate Event',
      basePrice: 15000,
      duration: 3,
      inclusions: [
        'Professional sound system',
        'Wireless microphones', 
        'Background music playlist',
        'Event coordination',
        'Corporate branding on equipment'
      ]
    }
  ])

  const handlePackageSelect = (template: any) => {
    setQuoteData({
      ...quoteData,
      quotedPrice: template.basePrice.toString(),
      inclusions: template.inclusions
    })
  }

  const handleSubmitQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          quotedPrice: parseFloat(quoteData.quotedPrice),
          currency: quoteData.currency,
          validUntil: new Date(quoteData.validUntil + 'T23:59:59.999Z').toISOString(),
          inclusions: quoteData.inclusions.filter(item => item.trim()),
          exclusions: quoteData.exclusions.filter(item => item.trim()),
          notes: quoteData.notes,
          requiresDeposit: quoteData.requiresDeposit,
          depositPercentage: quoteData.requiresDeposit ? parseInt(quoteData.depositPercentage.toString()) : undefined,
          depositAmount: quoteData.requiresDeposit && quoteData.depositAmount ? parseFloat(quoteData.depositAmount) : undefined
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onQuoteCreated?.(result.quote)
        setStep('sent')
      } else {
        throw new Error('Failed to create quote')
      }
    } catch (error) {
      console.error('Error creating quote:', error)
      alert('Failed to send quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addInclusion = () => {
    setQuoteData({
      ...quoteData,
      inclusions: [...quoteData.inclusions, '']
    })
  }

  const updateInclusion = (index: number, value: string) => {
    const newInclusions = [...quoteData.inclusions]
    newInclusions[index] = value
    setQuoteData({ ...quoteData, inclusions: newInclusions })
  }

  const removeInclusion = (index: number) => {
    setQuoteData({
      ...quoteData,
      inclusions: quoteData.inclusions.filter((_, i) => i !== index)
    })
  }

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      return () => {
        document.removeEventListener('keydown', handleEscKey)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-playfair font-bold text-dark-gray">
            {step === 'create' ? 'Create Quote' : step === 'review' ? 'Review Quote' : 'Quote Sent!'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          {step === 'create' && (
            <div className="p-6 space-y-6">
              {/* Booking Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Event Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Event:</strong> {booking.eventType}</div>
                  <div><strong>Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</div>
                  <div><strong>Duration:</strong> {booking.duration} hours</div>
                  <div><strong>Venue:</strong> {booking.venue}</div>
                  <div><strong>Guests:</strong> {booking.guestCount || 'Not specified'}</div>
                </div>
              </div>

              {/* Package Templates */}
              <div>
                <h3 className="font-semibold mb-3">Quick Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packageTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handlePackageSelect(template)}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-brand-cyan hover:bg-brand-cyan/5 transition-colors"
                    >
                      <div className="font-medium text-brand-cyan">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        ฿{template.basePrice.toLocaleString()} • {template.duration} hours
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {template.inclusions.slice(0, 2).join(', ')}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Price (THB) *
                  </label>
                  <input
                    type="number"
                    value={quoteData.quotedPrice}
                    onChange={(e) => setQuoteData({ ...quoteData, quotedPrice: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
                    placeholder="25000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={quoteData.validUntil}
                    onChange={(e) => setQuoteData({ ...quoteData, validUntil: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
                    required
                  />
                </div>
              </div>

              {/* Deposit Options */}
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="requiresDeposit"
                    checked={quoteData.requiresDeposit}
                    onChange={(e) => setQuoteData({ ...quoteData, requiresDeposit: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="requiresDeposit" className="text-sm font-medium text-gray-700">
                    Require Deposit
                  </label>
                </div>
                
                {quoteData.requiresDeposit && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percentage
                      </label>
                      <input
                        type="number"
                        value={quoteData.depositPercentage}
                        onChange={(e) => setQuoteData({ 
                          ...quoteData, 
                          depositPercentage: parseInt(e.target.value) || 0,
                          depositAmount: '' 
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="30"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or Fixed Amount (THB)
                      </label>
                      <input
                        type="number"
                        value={quoteData.depositAmount}
                        onChange={(e) => setQuoteData({ 
                          ...quoteData, 
                          depositAmount: e.target.value,
                          depositPercentage: 0 
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="5000"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Included
                </label>
                {quoteData.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={inclusion}
                      onChange={(e) => updateInclusion(index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-brand-cyan focus:border-brand-cyan"
                      placeholder="Service included..."
                    />
                    <button
                      onClick={() => removeInclusion(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={addInclusion}
                  className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={quoteData.notes}
                  onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
                  rows={3}
                  placeholder="Any special terms, conditions, or information..."
                />
              </div>
            </div>
          )}

          {step === 'sent' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quote Sent Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Your quote has been sent to the customer. They will receive a notification and can accept, reject, or negotiate the terms.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {step === 'create' && (
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep('review')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Preview
            </button>
            <button
              onClick={handleSubmitQuote}
              disabled={loading || !quoteData.quotedPrice}
              className="px-6 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Quote'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}