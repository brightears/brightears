'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useClerk } from '@clerk/nextjs';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/venue-portal', icon: HomeIcon },
  { name: 'Schedule', href: '/venue-portal/schedule', icon: CalendarIcon },
  { name: 'DJs', href: '/venue-portal/djs', icon: UserGroupIcon },
  { name: 'Feedback', href: '/venue-portal/feedback', icon: ChatBubbleLeftRightIcon },
  { name: 'Statistics', href: '/venue-portal/stats', icon: ChartBarIcon },
];

export default function PortalSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    const localizedHref = `/${locale}${href}`;
    if (href === '/venue-portal') {
      return pathname === localizedHref;
    }
    return pathname.startsWith(localizedHref);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            href={`/${locale}${item.href}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              active
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-deep-teal text-white shadow-lg"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-deep-teal to-deep-teal/95 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Bright Ears"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-white font-playfair text-lg font-bold">
                Bright Ears
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => signOut({ redirectUrl: `/${locale}` })}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
