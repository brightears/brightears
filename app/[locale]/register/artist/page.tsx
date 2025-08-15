'use client'

import { useState } from 'react'
import { useRouter } from '@/components/navigation'
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { Link } from '@/components/navigation'

export default function ArtistRegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    stageName: '',
    realName: '',
    category: '',
    bio: '',
    baseCity: '',
    languages: [] as string[],
    genres: [] as string[],
    hourlyRate: '',
    minimumHours: '2',
    phone: '',
    acceptTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const t = useTranslations('auth')

  const categories = ['DJ', 'SINGER', 'BAND', 'MUSICIAN', 'MC', 'DANCER', 'COMEDIAN']
  const cities = ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Hua Hin', 'Koh Samui', 'Krabi']
  const languageOptions = ['en', 'th', 'ja', 'zh', 'ko', 'de', 'fr']
  const genreOptions = ['Pop', 'Rock', 'Jazz', 'Classical', 'EDM', 'Hip Hop', 'R&B', 'Country', 'Folk', 'Blues']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register/artist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          stageName: formData.stageName,
          realName: formData.realName,
          category: formData.category,
          bio: formData.bio,
          baseCity: formData.baseCity,
          languages: formData.languages,
          genres: formData.genres,
          hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : null,
          minimumHours: parseInt(formData.minimumHours),
          phone: formData.phone
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Auto-login after successful registration
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (signInResult?.ok) {
          router.push('/dashboard/artist')
        } else {
          router.push('/login')
        }
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error) {
      setError('An error occurred during registration')
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.stageName}
                  onChange={(e) => setFormData({...formData, stageName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Real Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.realName}
                  onChange={(e) => setFormData({...formData, realName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                  value={formData.baseCity}
                  onChange={(e) => setFormData({...formData, baseCity: e.target.value})}
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
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
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
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
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
                  value={formData.minimumHours}
                  onChange={(e) => setFormData({...formData, minimumHours: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
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
              {isLoading ? 'Creating Account...' : 'Create Artist Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="font-inter text-dark-gray">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-cyan hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}