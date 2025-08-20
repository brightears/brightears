import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminUserManagementSimple from '@/components/admin/AdminUserManagementSimple'

export default async function AdminUsersPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await getSession()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return <AdminUserManagementSimple locale={locale} />
}