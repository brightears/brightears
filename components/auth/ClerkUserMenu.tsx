"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  ChartBarIcon, 
  UserCircleIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  HeartIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

export function ClerkUserMenu() {
  const { user } = useUser();
  
  // TODO: Get role from backend when implemented
  // For now, default to customer role
  const role = user?.publicMetadata?.role as string || "CUSTOMER";
  const isArtist = role === "ARTIST";
  const isCustomer = role === "CUSTOMER";
  const isCorporate = role === "CORPORATE";
  const isAdmin = role === "ADMIN";

  if (!user) return null;

  // Define menu items based on role
  const getMenuItems = () => {
    if (isArtist) {
      return [
        { label: "Dashboard", href: "/dashboard/artist", icon: ChartBarIcon },
        { label: "My Profile", href: "/dashboard/artist/profile", icon: UserCircleIcon },
        { label: "Bookings", href: "/dashboard/artist/bookings", icon: CalendarIcon },
        { label: "Earnings", href: "/dashboard/artist/earnings", icon: CurrencyDollarIcon },
        { label: "Availability", href: "/dashboard/artist/availability", icon: CalendarIcon },
      ];
    }
    
    if (isCustomer) {
      return [
        { label: "Dashboard", href: "/dashboard/customer", icon: ChartBarIcon },
        { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarIcon },
        { label: "Favorites", href: "/favorites", icon: HeartIcon },
        { label: "Profile", href: "/dashboard/customer/profile", icon: UserCircleIcon },
      ];
    }
    
    if (isCorporate) {
      return [
        { label: "Dashboard", href: "/dashboard/corporate", icon: ChartBarIcon },
        { label: "Bookings", href: "/dashboard/corporate/bookings", icon: CalendarIcon },
        { label: "Contracts", href: "/dashboard/corporate/contracts", icon: UserCircleIcon },
        { label: "Profile", href: "/dashboard/corporate/profile", icon: UserCircleIcon },
      ];
    }
    
    if (isAdmin) {
      return [
        { label: "Admin Dashboard", href: "/dashboard/admin", icon: ChartBarIcon },
        { label: "Manage Artists", href: "/dashboard/admin/artists", icon: UserCircleIcon },
        { label: "Manage Bookings", href: "/dashboard/admin/bookings", icon: CalendarIcon },
        { label: "Reports", href: "/dashboard/admin/reports", icon: ChartBarIcon },
      ];
    }
    
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex items-center space-x-4">
      {/* Quick Links */}
      <div className="hidden md:flex items-center space-x-2">
        {menuItems.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md hover:bg-purple-50 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* User Button with custom menu */}
      <UserButton
        afterSignUpUrl="/"
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
            userButtonPopoverCard: "shadow-xl",
            userButtonPopoverActions: "pb-2",
          },
        }}
      >
        <UserButton.MenuItems>
          {menuItems.map((item) => (
            <UserButton.Link
              key={item.href}
              label={item.label}
              labelIcon={<item.icon className="w-4 h-4" />}
              href={item.href}
            />
          ))}
          
          <UserButton.Action label="manageAccount" />
          <UserButton.Action label="signOut" />
        </UserButton.MenuItems>
      </UserButton>

      {/* Role Badge */}
      {role && (
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {role}
        </span>
      )}
    </div>
  );
}