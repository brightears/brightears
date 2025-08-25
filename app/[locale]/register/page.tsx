'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Link } from '@/components/navigation'

export default function RegisterPage() {
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp()
  const createCorporateProfile = useMutation(api.users.createCorporateProfile)
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'customer'
  const router = useRouter()
  
  const [step, setStep] = useState<'auth' | 'profile'>('auth')
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  
  const [corporateData, setCorporateData] = useState({
    companyName: '',
    contactPerson: '',
    businessRegistration: '',
    taxId: '',
    officePhone: '',
    officeAddress: '',
    acceptTerms: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpLoaded) return
    
    setIsLoading(true)
    setError('')

    if (authData.password !== authData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      await signUp.create({
        emailAddress: authData.email,
        password: authData.password,
        firstName: authData.firstName,
        lastName: authData.lastName,
        phoneNumber: authData.phone || undefined,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUpLoaded) return

    setIsLoading(true)
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        if (userType === 'corporate') {
          setStep('profile')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCorporateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!corporateData.acceptTerms) {
      setError('Please accept the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      await createCorporateProfile({
        companyName: corporateData.companyName,
        contactPerson: corporateData.contactPerson,
        businessRegistration: corporateData.businessRegistration,
        taxId: corporateData.taxId,
        officePhone: corporateData.officePhone,
        officeAddress: corporateData.officeAddress,
      })

      router.push('/dashboard/corporate')
    } catch (error: any) {
      setError(error.message || 'Failed to create corporate profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-2">
              {userType === 'corporate' ? 'Join as a Business' : 'Join as a Customer'}
            </h1>
            <p className="font-inter text-dark-gray opacity-80">
              {userType === 'corporate' 
                ? 'Create your business account to book entertainment'
                : 'Create your account to discover amazing artists'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {step === 'auth' && !pendingVerification && (
            <form onSubmit={handleAuthSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authData.firstName}
                    onChange={(e) => setAuthData({...authData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={authData.lastName}
                    onChange={(e) => setAuthData({...authData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={authData.phone}
                  onChange={(e) => setAuthData({...authData, phone: e.target.value})}
                  placeholder="+66 xxx xxx xxx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={authData.password}
                    onChange={(e) => setAuthData({...authData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-cyan text-white py-3 px-4 rounded-md font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : `Continue as ${userType === 'corporate' ? 'Business' : 'Customer'}`}
              </button>
            </form>
          )}

          {pendingVerification && (
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-dark-gray mb-2">
                  Check your email
                </h3>
                <p className="text-dark-gray/70 mb-4">
                  We sent a verification code to {authData.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Verification Code *
                </label>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-cyan text-white py-3 px-4 rounded-md font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          )}

          {step === 'profile' && userType === 'corporate' && (
            <form onSubmit={handleCorporateSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-dark-gray mb-2">
                  Complete Your Business Profile
                </h3>
                <p className="text-dark-gray/70">
                  Tell us about your business
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={corporateData.companyName}
                    onChange={(e) => setCorporateData({...corporateData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={corporateData.contactPerson}
                    onChange={(e) => setCorporateData({...corporateData, contactPerson: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Business Registration
                  </label>
                  <input
                    type="text"
                    value={corporateData.businessRegistration}
                    onChange={(e) => setCorporateData({...corporateData, businessRegistration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={corporateData.taxId}
                    onChange={(e) => setCorporateData({...corporateData, taxId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Office Address
                </label>
                <textarea
                  rows={2}
                  value={corporateData.officeAddress}
                  onChange={(e) => setCorporateData({...corporateData, officeAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={corporateData.acceptTerms}
                  onChange={(e) => setCorporateData({...corporateData, acceptTerms: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="terms" className="text-sm text-dark-gray">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-deep-teal text-white py-3 px-4 rounded-md font-medium hover:bg-deep-teal/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Profile...' : 'Complete Registration'}
              </button>
            </form>
          )}

          {step === 'auth' && (
            <div className="text-center mt-6">
              <p className="font-inter text-dark-gray">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-brand-cyan hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}