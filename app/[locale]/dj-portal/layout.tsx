import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DJPortalSidebar from '@/components/dj-portal/DJPortalSidebar';

export default async function DJPortalLayout({
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
    redirect(`/sign-in?redirect_url=/${locale}/dj-portal`);
  }

  // Allow ARTIST and ADMIN roles
  if (user.role !== 'ARTIST' && user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      <DJPortalSidebar />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
