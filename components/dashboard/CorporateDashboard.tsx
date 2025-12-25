'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface User {
  id: string
  email?: string
  role: string
  corporate?: {
    id: string
    companyName: string
    contactPerson: string
  }
}

interface CorporateDashboardProps {
  locale: string
  user: User
}

export default function CorporateDashboard({ locale, user }: CorporateDashboardProps) {
  const t = useTranslations('dashboard.corporate')

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray">
            {t('welcome', { company: user.corporate?.companyName || 'Corporate Dashboard' })}
          </h1>
          <p className="text-dark-gray font-inter mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: t('stats.totalBookings'), value: '0', icon: '📅' },
            { title: t('stats.activeEvents'), value: '0', icon: '🎵' },
            { title: t('stats.totalSpent'), value: '฿0', icon: '💰' },
            { title: t('stats.activeContracts'), value: '0', icon: '📋' }
          ].map((stat, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-inter text-dark-gray/70 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-playfair font-bold text-dark-gray">
                    {stat.value}
                  </p>
                </div>
                <div className="text-2xl">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: t('actions.browseArtists'),
              description: t('actions.browseArtistsDesc'),
              href: `/${locale}/artists`,
              color: 'bg-brand-cyan'
            },
            {
              title: t('actions.manageBookings'),
              description: t('actions.manageBookingsDesc'),
              href: `/${locale}/dashboard/corporate/bookings`,
              color: 'bg-earthy-brown'
            },
            {
              title: t('actions.viewContracts'),
              description: t('actions.viewContractsDesc'),
              href: `/${locale}/dashboard/corporate/contracts`,
              color: 'bg-soft-lavender'
            }
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-pure-white mb-4 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
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

        {/* Placeholder Content */}
        <div className="bg-background rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-playfair font-bold text-dark-gray mb-4">
            {t('comingSoon.title')}
          </h3>
          <p className="text-dark-gray/70 font-inter mb-6">
            {t('comingSoon.description')}
          </p>
          <Link
            href={`/${locale}/artists`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition-colors font-inter font-medium"
          >
            {t('comingSoon.browseNow')}
          </Link>
        </div>
      </div>
    </div>
  )
}