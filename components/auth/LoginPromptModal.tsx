'use client'

import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  artistName: string
  onLoginSuccess?: () => void
}

export default function LoginPromptModal({ 
  isOpen, 
  onClose, 
  artistName,
  onLoginSuccess 
}: LoginPromptModalProps) {
  const t = useTranslations('auth')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn('google', { 
        callbackUrl: window.location.href,
        redirect: false 
      })
      if (result?.ok) {
        onLoginSuccess?.()
        onClose()
      } else {
        setError(t('loginFailed'))
      }
    } catch (error) {
      setError(t('loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      if (result?.ok) {
        onLoginSuccess?.()
        onClose()
      } else {
        setError(t('invalidCredentials'))
      }
    } catch (error) {
      setError(t('loginError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-2">
                {t('signInToContact', { name: artistName })}
              </h2>
              <p className="text-dark-gray font-inter text-sm">
                {t('protectedContactInfo')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-gray hover:text-brand-cyan transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-inter font-medium text-dark-gray bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {t('continueWithGoogle')}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-dark-gray font-inter">{t('orContinueWith')}</span>
            </div>
          </div>

          {/* Email/Password Form Toggle */}
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full px-4 py-3 border border-brand-cyan rounded-lg font-inter font-medium text-brand-cyan bg-white hover:bg-brand-cyan hover:text-white transition-colors"
            >
              {t('useEmailPassword')}
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-inter font-medium text-dark-gray mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder={t('enterEmail')}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-inter font-medium text-dark-gray mb-2">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                  placeholder={t('enterPassword')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-brand-cyan text-white font-inter font-medium rounded-lg hover:bg-brand-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('signingIn')}
                  </div>
                ) : (
                  t('signIn')
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-brand-cyan font-inter text-sm hover:underline"
              >
                {t('backToGoogleLogin')}
              </button>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-inter text-sm">{error}</p>
            </div>
          )}

          {/* Why Login Explanation */}
          <div className="mt-6 p-4 bg-off-white rounded-lg">
            <h3 className="font-inter font-semibold text-dark-gray mb-2">
              {t('whySignIn')}
            </h3>
            <ul className="text-sm font-inter text-dark-gray space-y-1">
              <li className="flex items-start">
                <span className="text-brand-cyan mr-2">•</span>
                {t('protectArtists')}
              </li>
              <li className="flex items-start">
                <span className="text-brand-cyan mr-2">•</span>
                {t('preventSpam')}
              </li>
              <li className="flex items-start">
                <span className="text-brand-cyan mr-2">•</span>
                {t('trackInquiries')}
              </li>
              <li className="flex items-start">
                <span className="text-brand-cyan mr-2">•</span>
                {t('betterService')}
              </li>
            </ul>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm font-inter text-dark-gray">
              {t('noAccount')}{' '}
              <button
                onClick={onClose}
                className="text-brand-cyan hover:underline"
              >
                {t('signUpHere')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}