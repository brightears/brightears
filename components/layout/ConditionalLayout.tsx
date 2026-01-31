'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isPortalPage = pathname?.includes('/venue-portal') || pathname?.includes('/admin');

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hide header/footer on portal pages (venue-portal, admin) - they have their own navigation */}
      {!isPortalPage && <Header />}

      {/* Main content area with proper spacing for fixed header - WCAG 2.4.1 (A) */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 ${!isPortalPage ? 'pt-[72px] md:pt-[80px]' : ''}`}
      >
        {/* Subtle background gradient for entire app - only on public pages */}
        {!isPortalPage && (
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-off-white via-pure-white to-brand-cyan/5" />
        )}

        {children}
      </main>

      {!isPortalPage && <Footer />}
    </div>
  );
}
