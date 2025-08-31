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
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
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
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-pure-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-brand-cyan via-deep-teal to-deep-teal p-6 text-pure-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-pure-white/10 hover:bg-pure-white/20 backdrop-blur-sm transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5 text-pure-white" />
          </button>
          
          <div className="flex items-center gap-4">
            {artistImage && (
              <div className="relative">
                <img 
                  src={artistImage} 
                  alt={artistName}
                  className="w-16 h-16 rounded-full border-3 border-pure-white/30 shadow-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-pure-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-pure-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <div>
              <h2 className="font-playfair text-2xl font-bold">
                {step === 'inquiry' && 'Get a Quote'}
                {step === 'verify' && 'Verify Your Phone'}
                {step === 'success' && 'Inquiry Sent!'}
              </h2>
              <p className="text-pure-white/90 text-sm mt-1">
                {step === 'inquiry' && `Connect with ${artistName}`}
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
                <label className="block text-sm font-semibold text-deep-teal mb-2">
                  Your First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all duration-200 text-dark-gray"
                  placeholder="John"
                />
              </div>
              
              {/* Phone field */}
              <div>
                <label className="block text-sm font-semibold text-deep-teal mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-cyan" />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all duration-200 text-dark-gray"
                    placeholder="081-234-5678"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to confirm your booking
                </p>
              </div>
              
              {/* Event date */}
              <div>
                <label className="block text-sm font-semibold text-deep-teal mb-2">
                  Event Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-cyan" />
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all duration-200 text-dark-gray"
                  />
                </div>
              </div>
              
              {/* Event type */}
              <div>
                <label className="block text-sm font-semibold text-deep-teal mb-2">
                  Event Type
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all duration-200 text-dark-gray appearance-none bg-white"
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
                <label className="block text-sm font-semibold text-deep-teal mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-all duration-200 text-dark-gray resize-none"
                  placeholder="Any special requests or details..."
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
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
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-pure-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                Inquiry Sent Successfully!
              </h3>
              
              <p className="text-dark-gray mb-8 px-4">
                {artistName} will review your request and send you a quote soon.
                We'll notify you via SMS when they respond.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Browse More Artists
                </button>
                
                <p className="text-xs text-gray-500">
                  Booking ID: <span className="font-mono text-brand-cyan">{bookingId}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}