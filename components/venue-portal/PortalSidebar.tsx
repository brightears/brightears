'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MegaphoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useId, useRef, useState } from 'react';
import { useClerk } from '@clerk/nextjs';

interface NavItem {
  name: string;
  nameTh: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', nameTh: 'แดชบอร์ด', href: '/venue-portal', icon: HomeIcon },
  { name: 'Schedule', nameTh: 'ตารางงาน', href: '/venue-portal/schedule', icon: CalendarIcon },
  { name: 'DJs', nameTh: 'ดีเจ', href: '/venue-portal/djs', icon: UserGroupIcon },
  { name: 'Find Artists', nameTh: 'ค้นหาศิลปิน', href: '/venue-portal/artists', icon: MagnifyingGlassIcon },
  { name: 'Open Gigs', nameTh: 'งานที่เปิดรับ', href: '/venue-portal/gigs', icon: MegaphoneIcon },
  { name: 'Feedback', nameTh: 'คำติชม', href: '/venue-portal/feedback', icon: ChatBubbleLeftRightIcon },
  { name: 'Statistics', nameTh: 'สถิติ', href: '/venue-portal/stats', icon: ChartBarIcon },
  { name: 'Venue Profile', nameTh: 'โปรไฟล์สถานที่', href: '/venue-portal/profile', icon: BuildingOfficeIcon },
  { name: 'Free Search', nameTh: 'ค้นหาฟรี', href: 'https://brightears.io/discover', icon: MagnifyingGlassIcon, external: true },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isThai = locale === 'th';
  const navigationLabel = isThai ? 'เมนูพอร์ทัลสถานที่' : 'Venue portal navigation';
  const closeMenuLabel = isThai ? 'ปิดเมนู' : 'Close menu';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // A mobile dialog must release focus and scroll locking on desktop resize.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileMenuOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const isActive = (href: string) => {
    const localizedHref = `/${locale}${href}`;
    return pathname === localizedHref ||
      (href !== '/venue-portal' && pathname.startsWith(`${localizedHref}/`));
  };

  const renderSidebarContent = (mobile = false) => (
    <div className="flex h-full min-h-0 flex-col">
      <div className={`relative border-b border-white/10 p-6 ${mobile ? 'pr-14' : ''}`}>
        <Link
          href={`/${locale}`}
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <Image src="/logo.png" alt="Bright Ears" width={40} height={40} className="rounded-lg" />
          <div>
            <span className="block text-lg font-bold font-playfair text-white">Bright Ears</span>
            <span className="text-xs font-medium text-brand-cyan">
              {isThai ? 'พอร์ทัลสถานที่' : 'Venue Portal'}
            </span>
          </div>
        </Link>
        {mobile && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-2 top-3 rounded-lg p-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan"
            aria-label={closeMenuLabel}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label={navigationLabel} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const active = !item.external && isActive(item.href);
          const className = `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan ${
            active
              ? 'border border-brand-cyan/30 bg-brand-cyan/20 text-brand-cyan'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          }`;
          const content = (
            <>
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="font-medium">{isThai ? item.nameTh : item.name}</span>
            </>
          );
          return item.external ? (
            <a key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={className}>
              {content}
            </a>
          ) : (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: `/${locale}` })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
          <span className="font-medium">{isThai ? 'ออกจากระบบ' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-deep-teal p-2 text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan lg:hidden"
        aria-label={isThai ? 'เปิดเมนูพอร์ทัลสถานที่' : 'Open venue portal menu'}
        aria-expanded={isMobileMenuOpen}
        aria-controls={isMobileMenuOpen ? mobileMenuId : undefined}
        aria-haspopup="dialog"
      >
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      <Dialog
        open={isMobileMenuOpen}
        onClose={setIsMobileMenuOpen}
        initialFocus={closeButtonRef}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex">
          <DialogPanel id={mobileMenuId} className="relative h-dvh w-64 max-w-[calc(100vw-2rem)] bg-gradient-to-b from-deep-teal to-deep-teal/95">
            <DialogTitle className="sr-only">{navigationLabel}</DialogTitle>
            {renderSidebarContent(true)}
          </DialogPanel>
        </div>
      </Dialog>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 bg-gradient-to-b from-deep-teal to-deep-teal/95 lg:block">
        {renderSidebarContent()}
      </aside>
    </>
  );
}
