'use client'

import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface AdminDashboardLayoutProps {
  children: ReactNode
  locale: string
}

const AdminDashboardLayout = ({ children, locale }: AdminDashboardLayoutProps) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const navigation = [
    {
      name: 'Dashboard',
      href: `/${locale}/dashboard/admin`,
      icon: HomeIcon,
      current: pathname === `/${locale}/dashboard/admin`
    },
    {
      name: 'Applications',
      href: `/${locale}/dashboard/admin/applications`,
      icon: DocumentTextIcon,
      current: pathname.includes('/applications')
    },
    {
      name: 'Bookings',
      href: `/${locale}/dashboard/admin/bookings`,
      icon: CalendarIcon,
      current: pathname.includes('/bookings')
    },
    {
      name: 'Artists',
      href: `/${locale}/dashboard/admin/artists`,
      icon: UserGroupIcon,
      current: pathname.includes('/artists')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-white to-brand-cyan/5">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-gray/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform bg-white/70 backdrop-blur-md
          border-r border-dark-gray/10 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-dark-gray/10">
          <h2 className="text-lg font-playfair font-semibold text-deep-teal">
            Admin Panel
          </h2>
          <button
            type="button"
            className="lg:hidden text-dark-gray hover:text-brand-cyan"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${
                    item.current
                      ? 'bg-brand-cyan text-white shadow-md'
                      : 'text-dark-gray hover:bg-brand-cyan/10 hover:text-brand-cyan'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${item.current ? 'text-white' : 'text-dark-gray/60 group-hover:text-brand-cyan'}
                  `}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-dark-gray/10 p-4">
          <Link
            href={`/${locale}`}
            className="flex items-center text-sm text-dark-gray/60 hover:text-brand-cyan transition-colors"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Platform
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-dark-gray/10 bg-white/70 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden text-dark-gray hover:text-brand-cyan"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
              <span className="text-sm text-dark-gray/60">
                Logged in as <span className="font-medium text-brand-cyan">Admin</span>
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardLayout
