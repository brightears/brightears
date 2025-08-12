'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type UserType = 'CUSTOMER' | 'CORPORATE'

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('CUSTOMER')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Customer fields
    firstName: '',
    lastName: '',
    preferredLanguage: 'en',
    location: '',
    // Corporate fields
    companyName: '',
    contactPerson: '',
    position: '',
    venueType: '',
    companyAddress: '',
    companyPhone: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const t = useTranslations('auth')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        role: userType,
        ...(userType === 'CUSTOMER' && {
          firstName: formData.firstName,
          lastName: formData.lastName,
          preferredLanguage: formData.preferredLanguage,
          location: formData.location || undefined,
        }),
        ...(userType === 'CORPORATE' && {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          position: formData.position || undefined,
          venueType: formData.venueType || undefined,
          companyAddress: formData.companyAddress || undefined,
          companyPhone: formData.companyPhone || undefined,
        }),
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      // Redirect to login with success message
      router.push('/login?message=Registration successful. Please sign in.')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-playfair text-3xl font-bold text-dark-gray">
            Create your account
          </h2>
          <p className="mt-2 text-dark-gray">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-brand-cyan hover:text-brand-cyan/80"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setUserType('CUSTOMER')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md border ${
                  userType === 'CUSTOMER'
                    ? 'bg-brand-cyan text-pure-white border-brand-cyan'
                    : 'bg-pure-white text-dark-gray border-gray-300 hover:bg-gray-50'
                }`}
              >
                Individual Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType('CORPORATE')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md border ${
                  userType === 'CORPORATE'
                    ? 'bg-brand-cyan text-pure-white border-brand-cyan'
                    : 'bg-pure-white text-dark-gray border-gray-300 hover:bg-gray-50'
                }`}
              >
                Corporate/Business
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-gray">
                  Email address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark-gray">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-gray">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-gray">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                />
              </div>
            </div>

            {/* Customer-specific fields */}
            {userType === 'CUSTOMER' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-dark-gray">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-dark-gray">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-dark-gray">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="preferredLanguage" className="block text-sm font-medium text-dark-gray">
                      Preferred Language
                    </label>
                    <select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    >
                      <option value="en">English</option>
                      <option value="th">Thai</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Corporate-specific fields */}
            {userType === 'CORPORATE' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-dark-gray">
                      Company Name *
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-dark-gray">
                      Contact Person *
                    </label>
                    <input
                      id="contactPerson"
                      name="contactPerson"
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-dark-gray">
                      Position
                    </label>
                    <input
                      id="position"
                      name="position"
                      type="text"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="venueType" className="block text-sm font-medium text-dark-gray">
                      Venue Type
                    </label>
                    <select
                      id="venueType"
                      name="venueType"
                      value={formData.venueType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                    >
                      <option value="">Select venue type</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Bar">Bar</option>
                      <option value="Event Space">Event Space</option>
                      <option value="Corporate Office">Corporate Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-dark-gray">
                    Company Address
                  </label>
                  <input
                    id="companyAddress"
                    name="companyAddress"
                    type="text"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-brand-cyan focus:border-brand-cyan"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-pure-white bg-brand-cyan hover:bg-brand-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-cyan disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-dark-gray">
            Are you an artist?{' '}
            <Link 
              href="/register/artist" 
              className="font-medium text-earthy-brown hover:text-earthy-brown/80"
            >
              Register as an artist instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}