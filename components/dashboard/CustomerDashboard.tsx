'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'
import { useFavorites } from '@/components/favorites/FavoritesContext'

interface User {
  id: string
  email?: string
  role: string
  customer?: {
    id: string
    firstName?: string
    lastName?: string
  }
}

interface CustomerDashboardProps {
  locale: string
  user: User
}

interface BookingSummary {
  total: number
  pending: number
  confirmed: number
  completed: number
}

export default function CustomerDashboard({ locale, user }: CustomerDashboardProps) {
  const t = useTranslations('dashboard.customer')
  const tCommon = useTranslations('common')
  const { favorites } = useFavorites()
  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookingSummary = async () => {
      try {
        const response = await fetch('/api/bookings?summary=true')
        if (response.ok) {
          const data = await response.json()
          setBookingSummary(data.summary || bookingSummary)
        }
      } catch (error) {
        console.error('Error fetching booking summary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingSummary()
  }, [])

  const getGreeting = () => {
    const firstName = user.customer?.firstName
    if (firstName) {
      return t('welcomeBack', { name: firstName })
    }
    return t('welcome')
  }

  const stats = [
    {
      title: t('stats.totalBookings'),
      value: bookingSummary.total,
      change: '+12%',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: t('stats.favoriteArtists'),
      value: favorites.length,
      change: `+${favorites.length > 0 ? Math.floor(favorites.length / 7) : 0}`,
      changeType: 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: t('stats.pendingRequests'),
      value: bookingSummary.pending,
      change: bookingSummary.pending > 0 ? t('awaitingResponse') : t('allClear'),
      changeType: bookingSummary.pending > 0 ? 'neutral' as const : 'positive' as const,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const quickActions = [
    {
      title: t('quickActions.findArtists'),
      description: t('quickActions.findArtistsDesc'),
      href: `/${locale}/artists`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'bg-brand-cyan'
    },
    {
      title: t('quickActions.viewBookings'),
      description: t('quickActions.viewBookingsDesc'),
      href: `/${locale}/dashboard/customer/bookings`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-earthy-brown'
    },
    {
      title: t('quickActions.manageFavorites'),
      description: t('quickActions.manageFavoritesDesc'),
      href: `/${locale}/favorites`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-soft-lavender'
    },
    {
      title: t('quickActions.updateProfile'),
      description: t('quickActions.updateProfileDesc'),
      href: `/${locale}/dashboard/customer/profile`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-deep-teal'
    }
  ]

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray">
            {getGreeting()}
          </h1>
          <p className="text-dark-gray font-inter mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-inter text-dark-gray/70 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-playfair font-bold text-dark-gray">
                    {isLoading ? '-' : stat.value}
                  </p>
                  <p className={`text-xs font-inter mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'neutral' ? 'text-gray-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="text-brand-cyan">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-playfair font-bold text-dark-gray mb-6">
            {t('quickActions.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-pure-white mb-4 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h3 className="font-playfair font-bold text-dark-gray mb-2 group-hover:text-brand-cyan transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-dark-gray/70 font-inter">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                {t('recentActivity.title')}
              </h3>
              {bookingSummary.total === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-dark-gray/70 font-inter mb-4">
                    {t('recentActivity.empty')}
                  </p>
                  <Link
                    href={`/${locale}/artists`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
                  >
                    {t('recentActivity.startBrowsing')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-dark-gray/70 font-inter">
                    {t('recentActivity.viewAll')}
                  </p>
                  <Link
                    href={`/${locale}/dashboard/customer/bookings`}
                    className="inline-flex items-center gap-2 text-brand-cyan hover:text-brand-cyan/80 font-inter font-medium"
                  >
                    {t('recentActivity.seeAllBookings')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                {t('tips.title')}
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-brand-cyan/10 rounded-lg">
                  <h4 className="font-inter font-medium text-dark-gray mb-2">
                    {t('tips.saveFavorites.title')}
                  </h4>
                  <p className="text-sm text-dark-gray/70 font-inter">
                    {t('tips.saveFavorites.description')}
                  </p>
                </div>
                <div className="p-4 bg-earthy-brown/10 rounded-lg">
                  <h4 className="font-inter font-medium text-dark-gray mb-2">
                    {t('tips.bookEarly.title')}
                  </h4>
                  <p className="text-sm text-dark-gray/70 font-inter">
                    {t('tips.bookEarly.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}