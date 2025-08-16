import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import FavoritesPage from '@/components/favorites/FavoritesPage'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'favorites' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function Favorites({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect(`/${locale}/login?redirect=/favorites`)
  }
  
  // Redirect if not a customer
  if (session.user.role !== 'CUSTOMER') {
    redirect(`/${locale}`)
  }

  return (
    <Suspense fallback={<FavoritesPageSkeleton />}>
      <FavoritesPage locale={locale} />
    </Suspense>
  )
}

function FavoritesPageSkeleton() {
  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}