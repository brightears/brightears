'use client'

import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    positive: boolean
  }
  icon?: React.ElementType
  color?: 'cyan' | 'lavender' | 'brown' | 'teal'
}

const colorClasses = {
  cyan: {
    bg: 'bg-brand-cyan/10',
    text: 'text-brand-cyan',
    icon: 'text-brand-cyan'
  },
  lavender: {
    bg: 'bg-soft-lavender/10',
    text: 'text-soft-lavender',
    icon: 'text-soft-lavender'
  },
  brown: {
    bg: 'bg-earthy-brown/10',
    text: 'text-earthy-brown',
    icon: 'text-earthy-brown'
  },
  teal: {
    bg: 'bg-deep-teal/10',
    text: 'text-deep-teal',
    icon: 'text-deep-teal'
  }
}

const StatsCard = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = 'cyan'
}: StatsCardProps) => {
  const colors = colorClasses[color]

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-gray/60">{title}</p>
          <p className={`mt-2 text-3xl font-playfair font-bold ${colors.text}`}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-dark-gray/60">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-x-2">
              <span
                className={`text-sm font-medium ${
                  trend.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-dark-gray/60">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${colors.bg} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
