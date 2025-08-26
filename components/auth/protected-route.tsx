'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'ARTIST' | 'CUSTOMER' | 'CORPORATE' | 'ADMIN'
  fallbackUrl?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackUrl = '/sign-in' 
}: ProtectedRouteProps) {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const userData = useQuery(api.users.getCurrentUser)

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push(fallbackUrl)
      return
    }

    if (requiredRole && userData && userData.role !== requiredRole) {
      // Redirect based on user role
      switch (userData.role) {
        case 'ARTIST':
          router.push('/dashboard/artist')
          break
        case 'CORPORATE':
          router.push('/dashboard/corporate')
          break
        case 'ADMIN':
          router.push('/dashboard/admin')
          break
        default:
          router.push('/dashboard')
          break
      }
      return
    }
  }, [isLoaded, userId, userData, requiredRole, router, fallbackUrl])

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto"></div>
          <p className="mt-4 text-dark-gray">Loading...</p>
        </div>
      </div>
    )
  }

  if (requiredRole && (!userData || userData.role !== requiredRole)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark-gray mb-4">Access Denied</h1>
          <p className="text-dark-gray/70 mb-4">
            You don't have permission to access this page.
          </p>
          <button 
            onClick={() => router.back()}
            className="bg-brand-cyan text-white px-4 py-2 rounded-md hover:bg-brand-cyan/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}