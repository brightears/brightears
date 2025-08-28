import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminBookingManagement from '@/components/admin/AdminBookingManagement'

export default async function AdminBookingsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return <AdminBookingManagement locale={locale} />
}