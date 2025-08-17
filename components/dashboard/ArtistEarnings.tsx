'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface User {
  id: string
  email?: string
  role: string
  artist?: {
    id: string
    stageName: string
    verificationLevel: string
  }
}

interface ArtistEarningsProps {
  locale: string
  user: User
}

interface EarningsData {
  totalEarnings: number
  thisMonth: number
  lastMonth: number
  pendingPayouts: number
  completedBookings: number
  averageBookingValue: number
}

interface Transaction {
  id: string
  bookingId: string
  customerName: string
  amount: number
  status: 'pending' | 'completed' | 'cancelled'
  eventDate: string
  payoutDate?: string
  eventType: string
}

export default function ArtistEarnings({ locale, user }: ArtistEarningsProps) {
  const t = useTranslations('dashboard.artist.earnings')
  const tCommon = useTranslations('common')
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    pendingPayouts: 0,
    completedBookings: 0,
    averageBookingValue: 0
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch(`/api/artist/earnings?range=${timeRange}`)
        if (response.ok) {
          const data = await response.json()
          setEarningsData(data.summary || earningsData)
          setTransactions(data.transactions || [])
        }
      } catch (error) {
        console.error('Error fetching earnings data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEarningsData()
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return t('status.completed')
      case 'pending':
        return t('status.pending')
      case 'cancelled':
        return t('status.cancelled')
      default:
        return status
    }
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous * 100)
  }

  const monthlyGrowth = calculateGrowth(earningsData.thisMonth, earningsData.lastMonth)

  const stats = [
    {
      title: t('stats.totalEarnings'),
      value: formatCurrency(earningsData.totalEarnings),
      change: `+${formatCurrency(earningsData.thisMonth)}`,
      changeLabel: t('thisMonth'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-brand-cyan'
    },
    {
      title: t('stats.thisMonth'),
      value: formatCurrency(earningsData.thisMonth),
      change: `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(1)}%`,
      changeLabel: t('vsLastMonth'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-earthy-brown'
    },
    {
      title: t('stats.pendingPayouts'),
      value: formatCurrency(earningsData.pendingPayouts),
      change: `${transactions.filter(t => t.status === 'pending').length}`,
      changeLabel: t('transactions'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-soft-lavender'
    },
    {
      title: t('stats.averageBooking'),
      value: formatCurrency(earningsData.averageBookingValue),
      change: `${earningsData.completedBookings}`,
      changeLabel: t('completedBookings'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-deep-teal'
    }
  ]

  if (isLoading) {
    return <ArtistEarningsSkeleton />
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-dark-gray">
              {t('title')}
            </h1>
            <p className="text-dark-gray font-inter mt-2">
              {t('subtitle')}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mt-4 sm:mt-0">
            <div className="flex rounded-lg border border-gray-200 bg-background">
              {[
                { key: '7d', label: t('timeRanges.7d') },
                { key: '30d', label: t('timeRanges.30d') },
                { key: '90d', label: t('timeRanges.90d') },
                { key: '1y', label: t('timeRanges.1y') }
              ].map((range) => (
                <button
                  key={range.key}
                  onClick={() => setTimeRange(range.key as any)}
                  className={`px-3 py-1 text-sm font-medium font-inter first:rounded-l-lg last:rounded-r-lg transition-colors ${
                    timeRange === range.key
                      ? 'bg-brand-cyan text-pure-white'
                      : 'text-dark-gray hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-pure-white`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-inter text-dark-gray/70 mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-playfair font-bold text-dark-gray mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-inter text-green-600">
                {stat.change} {stat.changeLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-playfair font-bold text-dark-gray mb-4">
            {t('chart.title')}
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-dark-gray/70 font-inter">
                {t('chart.placeholder')}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-background rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-playfair font-bold text-dark-gray">
              {t('transactions.title')}
            </h2>
          </div>

          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-dark-gray/70 font-inter">
                  {t('transactions.empty')}
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray uppercase tracking-wider font-inter">
                      {t('transactions.customer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray uppercase tracking-wider font-inter">
                      {t('transactions.event')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray uppercase tracking-wider font-inter">
                      {t('transactions.amount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray uppercase tracking-wider font-inter">
                      {t('transactions.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-gray uppercase tracking-wider font-inter">
                      {t('transactions.date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-dark-gray font-inter">
                          {transaction.customerName}
                        </div>
                        <div className="text-sm text-dark-gray/70 font-inter">
                          ID: {transaction.bookingId.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-gray font-inter">
                          {transaction.eventType}
                        </div>
                        <div className="text-sm text-dark-gray/70 font-inter">
                          {formatDate(transaction.eventDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-dark-gray font-inter">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-gray/70 font-inter">
                        {transaction.payoutDate ? formatDate(transaction.payoutDate) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Payout Information */}
        <div className="mt-8 bg-background rounded-lg shadow-md p-6">
          <h3 className="text-lg font-playfair font-bold text-dark-gray mb-4">
            {t('payout.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-brand-cyan/10 rounded-lg">
              <h4 className="font-inter font-medium text-dark-gray mb-2">
                {t('payout.schedule')}
              </h4>
              <p className="text-sm text-dark-gray/70 font-inter">
                {t('payout.scheduleDesc')}
              </p>
            </div>
            <div className="p-4 bg-earthy-brown/10 rounded-lg">
              <h4 className="font-inter font-medium text-dark-gray mb-2">
                {t('payout.fees')}
              </h4>
              <p className="text-sm text-dark-gray/70 font-inter">
                {t('payout.feesDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArtistEarningsSkeleton() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}