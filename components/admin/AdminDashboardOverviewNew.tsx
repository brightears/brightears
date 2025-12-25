'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import StatsCard from './StatsCard'
import {
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  applications: {
    pending: number
    approved: number
    rejected: number
    total: number
  }
  artists: {
    total: number
    active: number
    newThisMonth: number
  }
  bookings: {
    active: number
    inquiry: number
    quoted: number
    confirmed: number
    paid: number
    thisMonth: number
  }
  revenue: {
    thisMonth: number
    lastMonth: number
    change: string
    currency: string
  }
}

interface AdminDashboardOverviewNewProps {
  locale: string
}

const AdminDashboardOverviewNew = ({ locale }: AdminDashboardOverviewNewProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')

      if (!response.ok) {
        throw new Error('Failed to fetch statistics')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">Failed to load dashboard statistics</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90"
        >
          Retry
        </button>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-playfair font-bold text-deep-teal">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-dark-gray/60">
          Manage applications, bookings, and platform analytics
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Applications"
          value={stats.applications.pending}
          subtitle={`${stats.applications.total} total`}
          icon={DocumentTextIcon}
          color="cyan"
        />

        <StatsCard
          title="Total Artists"
          value={stats.artists.total}
          subtitle={`${stats.artists.newThisMonth} new this month`}
          icon={UserGroupIcon}
          color="lavender"
        />

        <StatsCard
          title="Active Bookings"
          value={stats.bookings.active}
          subtitle={`${stats.bookings.thisMonth} this month`}
          icon={CalendarIcon}
          color="brown"
        />

        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(stats.revenue.thisMonth)}
          trend={{
            value: stats.revenue.change,
            positive: parseFloat(stats.revenue.change) >= 0
          }}
          icon={CurrencyDollarIcon}
          color="teal"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Applications action */}
        <Link
          href={`/${locale}/dashboard/admin/applications`}
          className="group bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-playfair font-semibold text-deep-teal">
                Review Applications
              </h3>
              <p className="mt-1 text-sm text-dark-gray/60">
                {stats.applications.pending} pending review
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-brand-cyan group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
              {stats.applications.pending} Pending
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              {stats.applications.approved} Approved
            </span>
          </div>
        </Link>

        {/* Bookings action */}
        <Link
          href={`/${locale}/dashboard/admin/bookings`}
          className="group bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-playfair font-semibold text-deep-teal">
                Manage Bookings
              </h3>
              <p className="mt-1 text-sm text-dark-gray/60">
                {stats.bookings.active} active bookings
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-brand-cyan group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
              {stats.bookings.confirmed} Confirmed
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
              {stats.bookings.paid} Paid
            </span>
          </div>
        </Link>

        {/* Artists action */}
        <Link
          href={`/${locale}/dashboard/admin/artists`}
          className="group bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-playfair font-semibold text-deep-teal">
                View Artists
              </h3>
              <p className="mt-1 text-sm text-dark-gray/60">
                {stats.artists.total} total artists
              </p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-brand-cyan group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
              {stats.artists.active} Active
            </span>
          </div>
        </Link>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-playfair font-semibold text-deep-teal mb-4">
          Recent Activity
        </h3>
        <p className="text-sm text-dark-gray/60">
          Activity feed coming soon...
        </p>
      </div>
    </div>
  )
}

export default AdminDashboardOverviewNew
