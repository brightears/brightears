'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'

interface PromptPayModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  quote: any
  onPaymentConfirmed: () => void
}

export default function PromptPayModal({ 
  isOpen, 
  onClose, 
  booking, 
  quote, 
  onPaymentConfirmed 
}: PromptPayModalProps) {
  const t = useTranslations('payment')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [paymentStep, setPaymentStep] = useState<'qr' | 'confirm' | 'completed'>('qr')
  const [loading, setLoading] = useState(false)
  const [uploadedSlip, setUploadedSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState('')

  // Calculate payment amount (deposit or full amount)
  const paymentAmount = quote?.requiresDeposit 
    ? (quote.depositAmount || (quote.quotedPrice * (quote.depositPercentage / 100)))
    : quote?.quotedPrice || booking?.quotedPrice || 0

  useEffect(() => {
    if (isOpen && paymentAmount > 0) {
      generatePromptPayQR()
    }
  }, [isOpen, paymentAmount])

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

  const generatePromptPayQR = async () => {
    try {
      // In a real implementation, you would get the artist's PromptPay ID
      // For now, using a placeholder
      const promptPayId = '0812345678' // Artist's phone number or ID
      
      // Generate PromptPay QR format
      // This is a simplified version - you'll need proper PromptPay QR generation
      const qrData = `00020101021129370016A000000677010111011300${promptPayId}02${booking.bookingNumber}5802TH5909${booking.artist.stageName}6007Bangkok62070503***63047B8A`
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      
      setQrCodeUrl(qrCodeDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const handleSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedSlip(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setSlipPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaymentSubmit = async () => {
    if (!uploadedSlip) {
      alert('Please upload payment slip')
      return
    }

    setLoading(true)
    try {
      // Upload payment slip to cloud storage (you'll need to implement this)
      const formData = new FormData()
      formData.append('slip', uploadedSlip)
      formData.append('bookingId', booking.id)
      formData.append('amount', paymentAmount.toString())

      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setPaymentStep('completed')
        // Update booking status
        await updateBookingPayment()
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Error submitting payment:', error)
      alert('Payment submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingPayment = async () => {
    try {
      await fetch(`/api/bookings/${booking.id}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          paymentMethod: 'PromptPay',
          status: 'pending_verification'
        }),
      })
      onPaymentConfirmed()
    } catch (error) {
      console.error('Error updating booking payment:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Backdrop - click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden relative z-10">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-playfair font-bold text-dark-gray">
            {paymentStep === 'qr' ? 'Pay with PromptPay' :
             paymentStep === 'confirm' ? 'Confirm Payment' : 'Payment Submitted!'}
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

        <div className="p-6">
          {paymentStep === 'qr' && (
            <div className="text-center space-y-4">
              {/* Payment Amount */}
              <div className="bg-brand-cyan/10 p-4 rounded-lg">
                <div className="text-sm text-gray-600">
                  {quote?.requiresDeposit ? 'Deposit Amount' : 'Total Amount'}
                </div>
                <div className="text-2xl font-bold text-brand-cyan">
                  ฿{paymentAmount.toLocaleString()}
                </div>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <img src={qrCodeUrl} alt="PromptPay QR Code" className="w-64 h-64" />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Scan this QR code with your mobile banking app
                  </p>
                </div>
              )}

              {/* Artist Payment Info */}
              <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="text-sm">
                  <strong>Pay to:</strong> {booking.artist?.stageName}
                </div>
                <div className="text-sm">
                  <strong>Reference:</strong> {booking.bookingNumber}
                </div>
                <div className="text-sm">
                  <strong>Event:</strong> {booking.eventType}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep('confirm')}
                  className="flex-1 py-3 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 font-medium"
                >
                  I've Made Payment
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                After payment, you'll need to upload your payment slip for verification
              </p>
            </div>
          )}

          {paymentStep === 'confirm' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-2">
                  Upload Payment Slip
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload a clear photo of your payment slip for verification
                </p>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {slipPreview ? (
                  <div className="space-y-3">
                    <img 
                      src={slipPreview} 
                      alt="Payment slip preview" 
                      className="max-w-full h-48 object-contain mx-auto rounded"
                    />
                    <button
                      onClick={() => document.getElementById('slip-upload')?.click()}
                      className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <button
                      onClick={() => document.getElementById('slip-upload')?.click()}
                      className="text-brand-cyan hover:text-brand-cyan/80 font-medium"
                    >
                      Upload Payment Slip
                    </button>
                  </div>
                )}
                <input
                  id="slip-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleSlipUpload}
                  className="hidden"
                />
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-medium">฿{paymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>PromptPay</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono text-xs">{booking.bookingNumber}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep('qr')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!uploadedSlip || loading}
                  className="flex-1 py-3 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'completed' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Submitted!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your payment is being verified. You'll receive confirmation within 24 hours.
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-left">
                <h4 className="font-medium text-yellow-800 mb-2">Next Steps:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Your booking is now being processed</li>
                  <li>• You'll receive an email confirmation</li>
                  <li>• The artist will contact you to finalize details</li>
                  <li>• Remaining balance due on event day</li>
                </ul>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90 font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}