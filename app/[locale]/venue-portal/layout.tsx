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

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-teal via-deep-teal/95 to-deep-teal/90">
      <PortalSidebar />

      {/* Main content area */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
