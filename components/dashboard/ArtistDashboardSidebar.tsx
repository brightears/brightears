'use client'

import { useState } from 'react'
import { Link } from '@/components/navigation'
import { usePathname } from 'next/navigation'
import { ExtendedUser } from '@/lib/auth'

interface ArtistDashboardSidebarProps {
  locale: string
  user: ExtendedUser
}

const navigationItems = [
  {
    name: 'Dashboard',
    nameKey: 'dashboard.nav.dashboard',
    href: '/dashboard/artist',
    icon: '📊'
  },
  {
    name: 'Profile',
    nameKey: 'dashboard.nav.profile',
    href: '/dashboard/artist/profile',
    icon: '👤'
  },
  {
    name: 'Bookings',
    nameKey: 'dashboard.nav.bookings',
    href: '/dashboard/artist/bookings',
    icon: '📅'
  },
  {
    name: 'Availability',
    nameKey: 'dashboard.nav.availability',
    href: '/dashboard/artist/availability',
    icon: '🗓️'
  },
  {
    name: 'Media',
    nameKey: 'dashboard.nav.media',
    href: '/dashboard/artist/media',
    icon: '🎵'
  },
  {
    name: 'Reviews',
    nameKey: 'dashboard.nav.reviews',
    href: '/dashboard/artist/reviews',
    icon: '⭐'
  },
  {
    name: 'Analytics',
    nameKey: 'dashboard.nav.analytics',
    href: '/dashboard/artist/analytics',
    icon: '📈'
  }
]

export default function ArtistDashboardSidebar({ locale, user }: ArtistDashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard/artist') {
      return pathname === `/${locale}${href}`
    }
    return pathname.startsWith(`/${locale}${href}`)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-pure-white shadow-md text-dark-gray"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="fixed inset-0 bg-dark-gray bg-opacity-50" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-pure-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-cyan rounded-full flex items-center justify-center">
                <span className="text-pure-white font-bold text-lg">
                  {user.artist?.stageName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <div className="font-playfair font-semibold text-dark-gray">
                  {user.artist?.stageName || 'Artist'}
                </div>
                <div className="text-xs text-gray-500">
                  Coming Soon
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 rounded text-gray-400 hover:text-dark-gray"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'bg-brand-cyan text-pure-white'
                    : 'text-dark-gray hover:bg-off-white hover:text-brand-cyan'
                  }
                `}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href={`/${locale}/dashboard`}
              className="block text-sm text-gray-500 hover:text-brand-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ← Back to Main Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}