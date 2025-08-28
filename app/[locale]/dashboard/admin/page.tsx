import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview'

export default async function AdminDashboardPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return <AdminDashboardOverview locale={locale} />
}