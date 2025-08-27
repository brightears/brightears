'use client'

import { useState } from 'react'
import { useRouter } from '@/components/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useUser, useSignUp } from '@clerk/nextjs'
import { Link } from '@/components/navigation'
// TODO: Re-implement with Prisma or other backend when needed
// import { useMutation } from 'convex/react'
// import { api } from '../../../../convex/_generated/api'

export default function ArtistRegistrationPage() {
  const { user } = useUser()
  const { signUp, isLoaded: signUpLoaded, setActive } = useSignUp()
  // TODO: Re-implement with Prisma or other backend when needed
  // const createArtistProfile = useMutation(api.users.createArtistProfile)
  const [step, setStep] = useState<'auth' | 'profile'>('auth')
  
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  
  const [profileData, setProfileData] = useState({
    stageName: '',
    realName: '',
    category: '',
    bio: '',
    baseCity: '',
    languages: [] as string[],
    genres: [] as string[],
    hourlyRate: '',
    minimumHours: '2',
    acceptTerms: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const router = useRouter()
  const t = useTranslations('auth')
  const locale = useLocale()

  const categories = ['DJ', 'SINGER', 'BAND', 'MUSICIAN', 'MC', 'DANCER', 'COMEDIAN']
  const cities = ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin', 'Koh Samui', 'Krabi']
  const languageOptions = ['en', 'th', 'ja', 'zh', 'ko', 'de', 'fr']
  const genreOptions = ['Pop', 'Rock', 'Jazz', 'Classical', 'EDM', 'Hip Hop', 'R&B', 'Country', 'Folk', 'Blues']

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
      if (!signUp) {
        setError('Sign up service not available')
        setIsLoading(false)
        return
      }
      
      await signUp.create({
        emailAddress: authData.email,
        password: authData.password,
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
    if (!signUpLoaded || !signUp) return

    setIsLoading(true)
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        setStep('profile')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!profileData.acceptTerms) {
      setError('Please accept the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      // TODO: Re-implement profile creation with Prisma or other backend
      // await createArtistProfile({
      //   stageName: profileData.stageName,
      //   category: profileData.category as any,
      //   bio: profileData.bio,
      //   baseCity: profileData.baseCity,
      //   basePrice: profileData.hourlyRate ? parseInt(profileData.hourlyRate) : undefined,
      //   phone: authData.phone,
      // })

      // For now, just redirect to dashboard
      router.push('/dashboard/artist')
    } catch (error: any) {
      setError(error.message || 'Failed to create artist profile')
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
              Join as an Artist
            </h1>
            <p className="font-inter text-dark-gray opacity-80">
              Start showcasing your talent and booking gigs
            </p>
          </div>

          {step === 'auth' && !pendingVerification && (
            <form onSubmit={handleAuthSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* OAuth Options */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  if (!signUp) return
                  try {
                    await signUp.authenticateWithRedirect({
                      strategy: 'oauth_google',
                      redirectUrl: `/${locale}/sso-callback`,
                      redirectUrlComplete: `/${locale}/register/artist?step=profile`
                    })
                  } catch (err: any) {
                    setError(err.errors?.[0]?.longMessage || 'Google sign up failed')
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
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
              {isLoading ? 'Creating Account...' : 'Continue to Profile'}
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

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-dark-gray mb-2">
                  Complete Your Artist Profile
                </h3>
                <p className="text-dark-gray/70">
                  Tell us about your talent and experience
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Stage Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.stageName}
                    onChange={(e) => setProfileData({...profileData, stageName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Real Name
                  </label>
                  <input
                    type="text"
                    value={profileData.realName}
                    onChange={(e) => setProfileData({...profileData, realName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                </div>
              </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Category *
                </label>
                <select
                  required
                  value={profileData.category}
                  onChange={(e) => setProfileData({...profileData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Base City *
                </label>
                <select
                  required
                  value={profileData.baseCity}
                  onChange={(e) => setProfileData({...profileData, baseCity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                >
                  <option value="">Select city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Bio
              </label>
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                placeholder="Tell us about your experience and style..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Hourly Rate (THB)
                </label>
                <input
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) => setProfileData({...profileData, hourlyRate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Minimum Hours
                </label>
                <input
                  type="number"
                  min="1"
                  value={profileData.minimumHours}
                  onChange={(e) => setProfileData({...profileData, minimumHours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={profileData.acceptTerms}
                onChange={(e) => setProfileData({...profileData, acceptTerms: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-dark-gray">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-cyan text-white py-3 px-4 rounded-md font-medium hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
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