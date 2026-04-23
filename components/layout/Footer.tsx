'use client';

import Image from 'next/image';
import { Link } from '@/components/navigation';

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] w-full border-t border-[#3d494d]/20" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Main row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Bright Ears" width={32} height={32} className="h-8 w-auto" />
            <span className="text-[#e5e2e1]/60 text-sm">Premium entertainment management</span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/brightearsgroup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://page.line.me/944grjuq?oat_content=url&openQrModal=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e5e2e1]/40 hover:text-[#00B900] transition-colors"
              aria-label="LINE"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771zm-7.24.001c0 .348-.283.629-.631.629-.345 0-.627-.281-.627-.629V8.108c0-.345.282-.63.627-.63.348 0 .631.285.631.63v4.772zm-2.466.629H4.917c-.345 0-.63-.281-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.23c.348 0 .629.283.629.629 0 .348-.281.631-.629.631M24 6.954c0-3.845-3.924-6.954-8.748-6.954S6.504 3.109 6.504 6.954c0 3.436 3.046 6.309 7.155 6.777.278.06.657.183.752.42.087.216.056.555.028.775 0 0-.101.603-.123.732-.037.216-.173.845.74.461.913-.384 4.92-2.891 6.714-4.949C23.124 9.813 24 8.456 24 6.954" />
              </svg>
            </a>
            <a
              href="mailto:info@brightears.io"
              className="text-[#e5e2e1]/40 hover:text-[#e5e2e1] transition-colors text-sm"
            >
              info@brightears.io
            </a>
          </div>
        </div>

        {/* Legal row */}
        <div className="pt-6 border-t border-[#3d494d]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#e5e2e1]/30 text-xs">
            &copy; 2026 Bright Ears Co., Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
