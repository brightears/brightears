'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!session) return null

  const user = session.user

  const getDisplayName = () => {
    if (user?.role === 'ARTIST' && user.artist?.stageName) {
      return user.artist.stageName
    }
    if (user?.role === 'CUSTOMER' && user.customer?.firstName) {
      return `${user.customer.firstName} ${user.customer.lastName || ''}`.trim()
    }
    if (user?.role === 'CORPORATE' && user.corporate?.contactPerson) {
      return user.corporate.contactPerson
    }
    return user?.email?.split('@')[0] || 'User'
  }

  const getRoleLinks = () => {
    switch (user?.role) {
      case 'ARTIST':
        return [
          { href: '/dashboard/artist', label: 'Artist Dashboard' },
          { href: '/dashboard/artist/profile', label: 'My Profile' },
          { href: '/dashboard/artist/bookings', label: 'My Bookings' },
          { href: '/dashboard/artist/availability', label: 'Availability' },
          { href: '/dashboard/artist/earnings', label: 'Earnings' },
        ]
      case 'CUSTOMER':
        return [
          { href: '/dashboard/customer', label: 'Dashboard' },
          { href: '/dashboard/customer/bookings', label: 'My Bookings' },
          { href: '/dashboard/customer/favorites', label: 'Favorites' },
          { href: '/dashboard/customer/profile', label: 'Profile' },
        ]
      case 'CORPORATE':
        return [
          { href: '/dashboard/corporate', label: 'Dashboard' },
          { href: '/dashboard/corporate/bookings', label: 'Bookings' },
          { href: '/dashboard/corporate/contracts', label: 'Contracts' },
          { href: '/dashboard/corporate/profile', label: 'Company Profile' },
        ]
      case 'ADMIN':
        return [
          { href: '/dashboard/admin', label: 'Admin Dashboard' },
          { href: '/dashboard/admin/users', label: 'Users' },
          { href: '/dashboard/admin/artists', label: 'Artists' },
          { href: '/dashboard/admin/bookings', label: 'Bookings' },
          { href: '/dashboard/admin/reports', label: 'Reports' },
        ]
      default:
        return []
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-dark-gray hover:text-brand-cyan"
      >
        <div className="w-8 h-8 bg-brand-cyan text-pure-white rounded-full flex items-center justify-center text-sm font-medium">
          {getDisplayName().charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {getDisplayName()}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-pure-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
            {user.email}
            <div className="text-xs text-soft-lavender font-medium">
              {user?.role?.toLowerCase() || 'user'}
            </div>
          </div>
          
          {getRoleLinks().map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-dark-gray hover:bg-off-white hover:text-brand-cyan"
            >
              {link.label}
            </Link>
          ))}
          
          <hr className="my-1 border-gray-100" />
          
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-dark-gray hover:bg-off-white hover:text-earthy-brown"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}