'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/components/navigation'

interface User {
  id: string
  email?: string
  role: string
  customer?: {
    id: string
    firstName?: string
    lastName?: string
    phone?: string
    location?: string
    preferredLanguage?: string
  }
}

interface CustomerProfileProps {
  locale: string
  user: User
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  preferredLanguage: string
}

export default function CustomerProfile({ locale, user }: CustomerProfileProps) {
  const t = useTranslations('dashboard.customer.profile')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [formData, setFormData] = useState<ProfileData>({
    firstName: user.customer?.firstName || '',
    lastName: user.customer?.lastName || '',
    email: user.email || '',
    phone: user.customer?.phone || '',
    location: user.customer?.location || '',
    preferredLanguage: user.customer?.preferredLanguage || 'en'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: t('updateSuccess') })
        // Refresh the page to update the session
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.error || t('updateError') })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: t('updateError') })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.customer?.firstName || '',
      lastName: user.customer?.lastName || '',
      email: user.email || '',
      phone: user.customer?.phone || '',
      location: user.customer?.location || '',
      preferredLanguage: user.customer?.preferredLanguage || 'en'
    })
    setMessage(null)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray">
            {t('title')}
          </h1>
          <p className="text-dark-gray font-inter mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-background rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-playfair font-bold text-dark-gray">
              {t('personalInfo.title')}
            </h2>
            <p className="text-sm text-dark-gray/70 font-inter">
              {t('personalInfo.description')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-inter font-medium">{message.text}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                  placeholder={t('placeholders.firstName')}
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.lastName')}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                  placeholder={t('placeholders.lastName')}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                  placeholder={t('placeholders.email')}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                  placeholder={t('placeholders.phone')}
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.location')}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                  placeholder={t('placeholders.location')}
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label htmlFor="preferredLanguage" className="block text-sm font-medium text-dark-gray mb-1">
                  {t('fields.preferredLanguage')}
                </label>
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent font-inter"
                >
                  <option value="en">{t('languages.en')}</option>
                  <option value="th">{t('languages.th')}</option>
                </select>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 p-4 bg-brand-cyan/10 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-cyan mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h4 className="font-inter font-medium text-dark-gray mb-1">
                    {t('privacy.title')}
                  </h4>
                  <p className="text-sm text-dark-gray/70 font-inter">
                    {t('privacy.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-dark-gray rounded-lg hover:bg-gray-50 transition-colors font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('actions.saving')}
                  </>
                ) : (
                  t('actions.save')
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Settings */}
        <div className="mt-8 bg-background rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-playfair font-bold text-dark-gray">
              {t('accountSettings.title')}
            </h2>
            <p className="text-sm text-dark-gray/70 font-inter">
              {t('accountSettings.description')}
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-inter font-medium text-dark-gray">
                    {t('accountSettings.changePassword')}
                  </h4>
                  <p className="text-sm text-dark-gray/70 font-inter">
                    {t('accountSettings.changePasswordDesc')}
                  </p>
                </div>
                <button className="px-4 py-2 border border-brand-cyan text-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-pure-white transition-colors font-inter font-medium">
                  {t('accountSettings.changePasswordBtn')}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                <div>
                  <h4 className="font-inter font-medium text-red-700">
                    {t('accountSettings.deleteAccount')}
                  </h4>
                  <p className="text-sm text-red-600 font-inter">
                    {t('accountSettings.deleteAccountDesc')}
                  </p>
                </div>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-inter font-medium">
                  {t('accountSettings.deleteAccountBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}