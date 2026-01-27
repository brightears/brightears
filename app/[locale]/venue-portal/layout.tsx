import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PortalSidebar from '@/components/venue-portal/PortalSidebar';

export default async function VenuePortalLayout({
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
    redirect(`/sign-in?redirect_url=/${locale}/venue-portal`);
  }

  // Allow CORPORATE and ADMIN roles
  if (user.role !== 'CORPORATE' && user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  // For ADMIN users without corporate profile, show admin view
  const companyName = user.corporate?.companyName || (user.role === 'ADMIN' ? 'Admin View' : undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-deep-teal/15">
      <PortalSidebar companyName={companyName} />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
