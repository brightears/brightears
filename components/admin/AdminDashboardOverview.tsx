'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { 
  ChartBarIcon, 
  UsersIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

interface AdminAnalytics {
  overview: {
    totalUsers: number
    totalArtists: number
    totalBookings: number
    totalRevenue: number
    activeUsers: number
    completedBookings: number
    verifiedArtists: number
  }
  growth: {
    users: { current: number; previous: number; growth: number }
    bookings: { current: number; previous: number; growth: number }
    revenue: { current: number; previous: number; growth: number }
  }
  breakdowns: {
    usersByRole: Array<{ role: string; count: number }>
    bookingsByStatus: Array<{ status: string; count: number }>
    paymentsByMethod: Array<{ method: string; count: number; amount: number }>
  }
  topArtists: Array<{
    id: string
    stageName: string
    firstName: string
    lastName: string
    completedBookings: number
    totalEarnings: number
    verificationStatus: string
  }>
  recentActivity: Array<{
    id: string
    bookingNumber: string
    status: string
    eventDate: string
    createdAt: string
    artistName: string
    customerName: string
  }>
}

interface AdminDashboardOverviewProps {
  locale: string
}

export default function AdminDashboardOverview({ locale }: AdminDashboardOverviewProps) {
  const t = useTranslations('dashboard.admin')
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return (
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
        ) : (
          <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
        )}
        {Math.abs(growth).toFixed(1)}%
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800'
      case 'QUOTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'INQUIRY':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load analytics</h3>
            <button 
              onClick={fetchAnalytics}
              className="bg-brand-cyan text-white px-4 py-2 rounded-lg hover:bg-brand-cyan/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  const quickStats = [
    {
      title: 'Total Users',
      value: analytics.overview.totalUsers.toLocaleString(),
      growth: analytics.growth.users.growth,
      icon: UsersIcon,
      color: 'bg-brand-cyan'
    },
    {
      title: 'Active Artists', 
      value: analytics.overview.verifiedArtists.toLocaleString(),
      subtitle: `${analytics.overview.totalArtists} total`,
      icon: ChartBarIcon,
      color: 'bg-earthy-brown'
    },
    {
      title: 'Total Bookings',
      value: analytics.overview.totalBookings.toLocaleString(),
      growth: analytics.growth.bookings.growth,
      icon: CalendarIcon,
      color: 'bg-soft-lavender'
    },
    {
      title: 'Platform Revenue',
      value: formatCurrency(analytics.overview.totalRevenue),
      growth: analytics.growth.revenue.growth,
      icon: CurrencyDollarIcon,
      color: 'bg-deep-teal'
    }
  ]

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-2">
            Admin Dashboard
          </h1>
          <p className="text-dark-gray/70 font-inter mb-4">
            Platform administration and management tools
          </p>
          
          {/* Period Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-gray/70 font-inter">Period:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-inter text-dark-gray/70 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-playfair font-bold text-dark-gray">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-dark-gray/60 mt-1">{stat.subtitle}</p>
                  )}
                  {stat.growth !== undefined && (
                    <div className="mt-2">
                      {formatGrowth(stat.growth)}
                    </div>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Status Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                Booking Status Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analytics.breakdowns.bookingsByStatus.map((item) => (
                  <div key={item.status} className="text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                    <div className="text-2xl font-playfair font-bold text-dark-gray mt-2">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Role Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                User Distribution
              </h3>
              <div className="space-y-3">
                {analytics.breakdowns.usersByRole.map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <span className="font-inter text-dark-gray capitalize">
                      {item.role.toLowerCase()}s
                    </span>
                    <span className="font-bold text-dark-gray">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                Payment Methods
              </h3>
              <div className="space-y-3">
                {analytics.breakdowns.paymentsByMethod.map((item) => (
                  <div key={item.method} className="flex items-center justify-between">
                    <span className="font-inter text-dark-gray">
                      {item.method}
                    </span>
                    <div className="text-right">
                      <div className="font-bold text-dark-gray">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-sm text-dark-gray/60">
                        {item.count} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Lists */}
          <div className="space-y-6">
            {/* Top Artists */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                Top Performing Artists
              </h3>
              <div className="space-y-4">
                {analytics.topArtists.slice(0, 5).map((artist) => (
                  <div key={artist.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-dark-gray">
                        {artist.stageName}
                      </div>
                      <div className="text-sm text-dark-gray/60">
                        {artist.completedBookings} bookings
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-dark-gray">
                        {formatCurrency(artist.totalEarnings)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        artist.verificationStatus === 'VERIFIED' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {artist.verificationStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href={`/${locale}/dashboard/admin/artists`}
                className="block mt-4 text-brand-cyan hover:text-brand-cyan/80 font-medium text-sm"
              >
                View all artists →
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {analytics.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-dark-gray text-sm">
                        {activity.bookingNumber}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="text-sm text-dark-gray/60">
                      {activity.artistName} • {activity.customerName}
                    </div>
                    <div className="text-xs text-dark-gray/50 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href={`/${locale}/dashboard/admin/bookings`}
                className="block mt-4 text-brand-cyan hover:text-brand-cyan/80 font-medium text-sm"
              >
                View all bookings →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/${locale}/dashboard/admin/users`}
                  className="block w-full bg-brand-cyan text-white text-center py-2 rounded-lg hover:bg-brand-cyan/90 transition-colors"
                >
                  Manage Users
                </Link>
                <Link
                  href={`/${locale}/dashboard/admin/bookings`}
                  className="block w-full bg-earthy-brown text-white text-center py-2 rounded-lg hover:bg-earthy-brown/90 transition-colors"
                >
                  Manage Bookings
                </Link>
                <Link
                  href={`/${locale}/dashboard/admin/reports`}
                  className="block w-full bg-deep-teal text-white text-center py-2 rounded-lg hover:bg-deep-teal/90 transition-colors"
                >
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}