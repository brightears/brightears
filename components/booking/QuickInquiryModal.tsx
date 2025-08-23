'use client'

import { useState } from 'react'
import { XMarkIcon, CalendarIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface QuickInquiryModalProps {
  isOpen: boolean
  onClose: () => void
  artistId: string
  artistName: string
  artistImage?: string
}

export default function QuickInquiryModal({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistImage
}: QuickInquiryModalProps) {
  const t = useTranslations('booking')
  const [step, setStep] = useState<'inquiry' | 'verify' | 'success'>('inquiry')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    phoneNumber: '',
    eventDate: '',
    eventType: 'WEDDING',
    message: ''
  })
  
  // OTP verification
  const [otp, setOtp] = useState('')
  const [phoneToVerify, setPhoneToVerify] = useState('')
  
  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/inquiries/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artistId
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send inquiry')
      }
      
      setBookingId(data.data.bookingId)
      setPhoneToVerify(data.data.phoneNumber)
      
      if (data.data.requiresVerification) {
        setStep('verify')
      } else {
        setStep('success')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneToVerify,
          otp
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }
      
      // Store session token
      localStorage.setItem('sessionToken', data.sessionToken)
      setStep('success')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleResendOTP = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneToVerify })
      })
      
      if (!response.ok) {
        throw new Error('Failed to resend code')
      }
      
      setError('')
      // Show success message
      alert('New code sent!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-brand-cyan to-deep-teal p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            {artistImage && (
              <img 
                src={artistImage} 
                alt={artistName}
                className="w-16 h-16 rounded-full border-2 border-white/50"
              />
            )}
            <div>
              <h2 className="font-playfair text-2xl font-bold">
                {step === 'inquiry' && 'Get a Quote'}
                {step === 'verify' && 'Verify Your Phone'}
                {step === 'success' && 'Inquiry Sent!'}
              </h2>
              <p className="text-white/90 text-sm">
                {step === 'inquiry' && `From ${artistName}`}
                {step === 'verify' && 'Enter the code we sent you'}
                {step === 'success' && `${artistName} will respond soon`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {step === 'inquiry' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Your First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder="John"
                />
              </div>
              
              {/* Phone field */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                    placeholder="081-234-5678"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to confirm your booking
                </p>
              </div>
              
              {/* Event date */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Event Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Event type */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Event Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                >
                  <option value="WEDDING">Wedding</option>
                  <option value="CORPORATE">Corporate Event</option>
                  <option value="PARTY">Party</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="PRIVATE">Private Event</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              {/* Optional message */}
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder="Any special requests or details..."
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
              
              <p className="text-xs text-center text-gray-500">
                No payment required • Artist will send you a quote
              </p>
            </form>
          )}
          
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                We sent a 6-digit code to {phoneToVerify}
              </p>
              
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder="000000"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full py-2 text-brand-cyan hover:underline text-sm"
              >
                Didn't receive code? Resend
              </button>
            </form>
          )}
          
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">
                Inquiry Sent Successfully!
              </h3>
              
              <p className="text-gray-600 mb-6">
                {artistName} will review your request and send you a quote soon.
                We'll notify you via SMS when they respond.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Browse More Artists
                </button>
                
                <p className="text-xs text-gray-500">
                  Booking ID: {bookingId}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}