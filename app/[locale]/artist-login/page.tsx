'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function ArtistLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/artist-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }
      
      // Store artist info in localStorage for client-side use
      localStorage.setItem('artist', JSON.stringify(data.user))
      
      // Redirect to dashboard
      router.push('/dashboard/artist')
      router.refresh()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-teal via-brand-cyan to-earthy-brown flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-2">
              Artist Login
            </h1>
            <p className="text-dark-gray/70">
              Access your dashboard to manage bookings
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder="artist@example.com"
                />
              </div>
            </div>
            
            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-dark-gray mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or</span>
            </div>
          </div>
          
          {/* Alternative actions */}
          <div className="space-y-4">
            <Link
              href="/register/artist"
              className="w-full block text-center py-3 bg-soft-lavender/20 border border-soft-lavender/30 text-dark-gray font-semibold rounded-xl hover:bg-soft-lavender/30 transition-all duration-300"
            >
              Sign Up as Artist
            </Link>
            
            <Link
              href="/forgot-password"
              className="block text-center text-sm text-brand-cyan hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          
          {/* Help text */}
          <p className="mt-8 text-center text-xs text-gray-500">
            Having trouble? Contact support at{' '}
            <a href="mailto:support@brightears.io" className="text-brand-cyan hover:underline">
              support@brightears.io
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}