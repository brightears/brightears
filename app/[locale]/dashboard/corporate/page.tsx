import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import CorporateDashboard from '@/components/dashboard/CorporateDashboard'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.corporate' })
  
  return {
    title: `${t('title')} - Bright Ears`,
    description: t('description')
  }
}

export default async function CorporateDashboardPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(`/${locale}/login`)
  }
  
  // Redirect if not corporate
  if (user.role !== 'CORPORATE') {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CorporateDashboard locale={locale} user={user} />
    </Suspense>
  )
}