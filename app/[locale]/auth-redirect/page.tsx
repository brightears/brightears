import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Server-side role-based redirect after sign-in
 */
export default async function AuthRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  // Redirect based on role
  if (user?.role === 'ADMIN') {
    redirect(`/${locale}/admin`);
  } else if (user?.role === 'CORPORATE') {
    redirect(`/${locale}/venue-portal`);
  } else {
    // All other users (CUSTOMER, ARTIST, or unknown) go to homepage
    redirect(`/${locale}`);
  }
}
