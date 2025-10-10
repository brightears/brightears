'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CalendarIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

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
    contactMethod: 'phone' as 'phone' | 'line',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
    eventType: 'WEDDING',
    message: ''
  })
  
  // OTP verification
  const [otp, setOtp] = useState('')
  const [phoneToVerify, setPhoneToVerify] = useState('')

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
      
      {/* Modal Container - Clean shadow and proper overflow handling */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 ease-out">
        {/* Header with gradient - Perfect top corners */}
        <div className="relative bg-gradient-to-br from-brand-cyan via-deep-teal to-deep-teal p-6 text-pure-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <XMarkIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
          
          <div className="flex items-center gap-4">
            {artistImage && (
              <div className="relative w-16 h-16">
                <Image
                  src={artistImage}
                  alt={artistName}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-white/30 shadow-lg object-cover"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
              <p className="text-white/90 text-sm mt-1">
                {step === 'inquiry' && `Connect with ${artistName}`}
                {step === 'verify' && 'Enter the code we sent you'}
                {step === 'success' && `${artistName} will respond soon`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content - Optimized scrolling and spacing */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {step === 'inquiry' && (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50/50 focus:bg-white"
                  placeholder="John"
                />
              </div>
              
              {/* Contact Preference */}
              <div>
                <label className="block text-sm font-semibold text-deep-teal mb-3">
                  How should we contact you?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, contactMethod: 'phone'})}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      (formData as any).contactMethod === 'phone' 
                        ? 'border-brand-cyan bg-brand-cyan/5 text-brand-cyan shadow-sm' 
                        : 'border-gray-200 hover:border-brand-cyan/30 hover:bg-gray-50'
                    }`}
                  >
                    <PhoneIcon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, contactMethod: 'line'})}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      (formData as any).contactMethod === 'line' 
                        ? 'border-brand-cyan bg-brand-cyan/5 text-brand-cyan shadow-sm' 
                        : 'border-gray-200 hover:border-brand-cyan/30 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    <span className="text-sm font-medium">LINE</span>
                  </button>
                </div>
              </div>

              {/* Contact Details based on selection */}
              {(formData as any).contactMethod && (
                <div>
                  <label className="block text-sm font-semibold text-deep-teal mb-2">
                    {(formData as any).contactMethod === 'phone' ? 'Phone Number' : 'LINE ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50/50 focus:bg-white"
                    placeholder={(formData as any).contactMethod === 'phone' ? '081-234-5678' : '@yourlineid'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll use this to contact you about your booking
                  </p>
                </div>
              )}
              
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50/50 focus:bg-white"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-200 text-gray-900 appearance-none bg-gray-50/50 focus:bg-white"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all duration-200 text-gray-900 resize-none bg-gray-50/50 focus:bg-white"
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
                className="w-full py-3.5 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent bg-gray-50/50 focus:bg-white transition-all duration-200"
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
                className="w-full py-3.5 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
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
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                Inquiry Sent Successfully!
              </h3>
              
              <p className="text-gray-600 mb-8 px-4">
                {artistName} will review your request and send you a quote soon.
                We'll notify you via SMS when they respond.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
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