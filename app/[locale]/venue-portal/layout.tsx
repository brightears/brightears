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

  // Redirect if not authenticated or not CORPORATE role
  if (!user) {
    redirect(`/${locale}/sign-in?redirect_url=/${locale}/venue-portal`);
  }

  if (user.role !== 'CORPORATE') {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-deep-teal/30">
      <PortalSidebar companyName={user.corporate?.companyName} />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
