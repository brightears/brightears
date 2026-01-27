'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isVenuePortal = pathname?.includes('/venue-portal');

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hide header/footer on venue portal - it has its own sidebar navigation */}
      {!isVenuePortal && <Header />}

      {/* Main content area with proper spacing for fixed header - WCAG 2.4.1 (A) */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 ${!isVenuePortal ? 'pt-[72px] md:pt-[80px]' : ''}`}
      >
        {/* Subtle background gradient for entire app - only on public pages */}
        {!isVenuePortal && (
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-off-white via-pure-white to-brand-cyan/5" />
        )}

        {children}
      </main>

      {!isVenuePortal && <Footer />}
    </div>
  );
}
