import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.customer' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function CustomerDashboardPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect(`/${locale}/login?redirect=/dashboard/customer`)
  }
  
  // Redirect if not a customer
  if (session.user.role !== 'CUSTOMER') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <Suspense fallback={<CustomerDashboardSkeleton />}>
      <CustomerDashboard locale={locale} user={session.user} />
    </Suspense>
  )
}

function CustomerDashboardSkeleton() {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}