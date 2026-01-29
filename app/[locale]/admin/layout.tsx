import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/admin`);
  }

  // Only allow ADMIN role
  if (user.role !== 'ADMIN') {
    // Redirect non-admins to venue portal or home
    if (user.role === 'CORPORATE') {
      redirect(`/${locale}/venue-portal`);
    }
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <AdminSidebar />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
