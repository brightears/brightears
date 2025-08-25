'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import ArtistDashboardSidebar from '@/components/dashboard/ArtistDashboardSidebar'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = useQuery(api.users.getCurrentUser)

  return (
    <ProtectedRoute requiredRole="ARTIST">
      <div className="min-h-screen bg-off-white">
        <div className="flex">
          <ArtistDashboardSidebar user={userData} />
          <main className="flex-1 lg:pl-64">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}