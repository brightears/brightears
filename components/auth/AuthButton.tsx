'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export function AuthButton() {
  const { data: session, status } = useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-20 bg-brand-cyan/20 rounded"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-dark-gray">
          Welcome, {session.user.email}
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="bg-earthy-brown text-pure-white px-4 py-2 rounded-md text-sm font-medium hover:bg-earthy-brown/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-deep-teal hover:text-brand-cyan text-sm font-medium"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="bg-brand-cyan text-pure-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-cyan/90"
      >
        Sign up
      </Link>
    </div>
  )
}