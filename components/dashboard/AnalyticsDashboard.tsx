'use client'

import { useState } from 'react'

interface MonthlyData {
  month: string
  earnings: number
  bookings: number
}

interface WeeklyBookings {
  week: string
  bookings: number
}

interface EventType {
  type: string
  count: number
  percentage: number
}

interface Analytics {
  earnings: {
    total: number
    thisMonth: number
    lastMonth: number
    monthlyData: MonthlyData[]
  }
  bookings: {
    total: number
    thisMonth: number
    completed: number
    cancelled: number
    conversionRate: number
    weeklyBookings: WeeklyBookings[]
  }
  performance: {
    averageRating: number
    responseRate: number
    responseTime: number
    rebookingRate: number
    profileViews: number
    inquiries: number
  }
  demographics: {
    eventTypes: EventType[]
    locations: EventType[]
    timeSlots: EventType[]
  }
}

interface AnalyticsDashboardProps {
  artistId: string
  analytics: Analytics
  locale: string
}

export default function AnalyticsDashboard({ artistId, analytics, locale }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedChart, setSelectedChart] = useState('earnings')

  const formatCurrency = (amount: number) => {
    return `₿${amount.toLocaleString()} THB`
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const earningsGrowth = calculateGrowth(analytics.earnings.thisMonth, analytics.earnings.lastMonth)

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-brand-cyan">
                {formatCurrency(analytics.earnings.total)}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
              <p className="text-2xl font-bold text-earthy-brown">
                {formatCurrency(analytics.earnings.thisMonth)}
              </p>
              <p className={`text-sm ${earningsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {earningsGrowth >= 0 ? '+' : ''}{earningsGrowth}% from last month
              </p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-deep-teal">
                {analytics.bookings.total}
              </p>
              <p className="text-sm text-green-600">
                {analytics.bookings.completed} completed
              </p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Average Rating</p>
              <p className="text-2xl font-bold text-soft-lavender">
                {analytics.performance.averageRating}
              </p>
              <p className="text-sm text-gray-500">
                {analytics.performance.responseRate}% response rate
              </p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earnings Chart */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-lg font-semibold text-dark-gray">
              Monthly Earnings
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="2years">Last 2 Years</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {analytics.earnings.monthlyData.map((data, index) => {
              const maxEarnings = Math.max(...analytics.earnings.monthlyData.map(d => d.earnings))
              const percentage = (data.earnings / maxEarnings) * 100
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">
                    {data.month}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-gradient-to-r from-brand-cyan to-earthy-brown h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-pure-white">
                          {formatCurrency(data.earnings)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-500 text-right">
                    {data.bookings} gigs
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-6">
            Performance Metrics
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Views</span>
                <span className="text-sm font-bold text-brand-cyan">
                  {analytics.performance.profileViews.toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-brand-cyan h-2 rounded-full transition-all duration-500"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                <span className="text-sm font-bold text-green-600">
                  {analytics.bookings.conversionRate}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.bookings.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Rebooking Rate</span>
                <span className="text-sm font-bold text-earthy-brown">
                  {analytics.performance.rebookingRate}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-earthy-brown h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analytics.performance.rebookingRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-deep-teal">
                    {analytics.performance.responseTime}h
                  </div>
                  <div className="text-xs text-gray-500">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-soft-lavender">
                    {analytics.performance.inquiries}
                  </div>
                  <div className="text-xs text-gray-500">Monthly Inquiries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Types */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-6">
            Event Types
          </h3>
          <div className="space-y-4">
            {analytics.demographics.eventTypes.map((event, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{event.count}</span>
                  <span className="text-sm font-medium text-dark-gray">
                    {event.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-6">
            Popular Locations
          </h3>
          <div className="space-y-4">
            {analytics.demographics.locations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${200 + index * 40}, 70%, 50%)` 
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {location.city}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{location.count}</span>
                  <span className="text-sm font-medium text-dark-gray">
                    {location.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Time Slots */}
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-6">
            Popular Time Slots
          </h3>
          <div className="space-y-4">
            {analytics.demographics.timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${300 + index * 30}, 70%, 50%)` 
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {slot.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{slot.count}</span>
                  <span className="text-sm font-medium text-dark-gray">
                    {slot.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-brand-cyan/10 to-earthy-brown/10 rounded-lg p-6">
        <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
          💡 Insights & Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-pure-white rounded-lg p-4">
            <h4 className="font-medium text-green-700 mb-2">🎯 What's Working Well</h4>
            <ul className="text-sm text-dark-gray space-y-1">
              <li>• High rebooking rate indicates client satisfaction</li>
              <li>• Strong performance in wedding market (35%)</li>
              <li>• Excellent response rate keeps clients engaged</li>
              <li>• Bangkok market is performing very well</li>
            </ul>
          </div>
          
          <div className="bg-pure-white rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-2">🚀 Growth Opportunities</h4>
            <ul className="text-sm text-dark-gray space-y-1">
              <li>• Expand corporate event offerings (24% current)</li>
              <li>• Consider promoting Chiang Mai/Phuket availability</li>
              <li>• Optimize pricing for peak time slots (6-9 PM)</li>
              <li>• Add more media samples to increase bookings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}