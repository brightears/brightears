import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import AdminDashboardOverviewNew from '@/components/admin/AdminDashboardOverviewNew'

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

  return (
    <AdminDashboardLayout locale={locale}>
      <AdminDashboardOverviewNew locale={locale} />
    </AdminDashboardLayout>
  )
}

export const metadata = {
  title: 'Admin Dashboard - Bright Ears',
  description: 'Manage applications, bookings, and artists'
}
