import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminUserManagementSimple from '@/components/admin/AdminUserManagementSimple'

export default async function AdminUsersPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return <AdminUserManagementSimple locale={locale} />
}