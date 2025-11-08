import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardLayout from '@/components/admin/AdminDashboardLayout'
import ApplicationsTable from '@/components/admin/applications/ApplicationsTable'

export default async function AdminApplicationsPage({
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
      <ApplicationsTable locale={locale} />
    </AdminDashboardLayout>
  )
}

export const metadata = {
  title: 'Application Management - Admin Dashboard',
  description: 'Review and manage DJ/artist applications'
}
