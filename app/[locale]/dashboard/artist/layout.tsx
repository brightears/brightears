'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import ArtistDashboardSidebar from '@/components/dashboard/ArtistDashboardSidebar'
// TODO: Re-implement with Prisma or other backend when needed
// import { useQuery } from 'convex/react'
// import { api } from '@/convex/_generated/api'
import { useClerkUser } from '@/hooks/useClerkUser'
import { usePathname } from 'next/navigation'

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Re-implement user data fetching with backend
  // const userData = useQuery(api.users.getCurrentUser)
  const { clerkUser } = useClerkUser()
  const userData = clerkUser // Use Clerk user for now
  
  // Extract locale from pathname
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  // TODO: Re-implement loading state with proper user data fetching
  // if (!userData) {
  //   return (
  //     <ProtectedRoute requiredRole="ARTIST">
  //       <div className="min-h-screen bg-off-white flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan"></div>
  //       </div>
  //     </ProtectedRoute>
  //   )
  // }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-off-white">
        <div className="flex">
          <ArtistDashboardSidebar user={userData} locale={locale} />
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