import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArtistEarnings from '@/components/dashboard/ArtistEarnings'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.artist.earnings' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function ArtistEarningsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(`/${locale}/login`)
  }
  
  // Redirect if not an artist
  if (user.role !== 'ARTIST') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <Suspense fallback={<ArtistEarningsSkeleton />}>
      <ArtistEarnings locale={locale} user={user} />
    </Suspense>
  )
}

function ArtistEarningsSkeleton() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          
          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          
          {/* Chart skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          
          {/* Table skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}