'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/navigation';
import LineContactButton from '@/components/buttons/LineContactButton';

export default function Footer() {
  const t = useTranslations('footer');
  const tLine = useTranslations('lineContact');

  return (
    <footer className="bg-deep-teal text-pure-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-playfair font-bold text-pure-white">Bright Ears</span>
              </div>
              <p className="text-pure-white/70 mb-6 max-w-md">
                {t('description')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-lg font-playfair font-semibold text-pure-white">{t('contact')}</h4>
                <div className="space-y-2 text-pure-white/70">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@brightears.io</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{t('address')}</span>
                  </div>
                  {/* LINE Official Account */}
                  <div className="flex items-center space-x-3 pt-2">
                    <svg className="w-5 h-5 text-[#00B900]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.28-.63.626-.63.352 0 .631.285.631.63v4.771zm-7.24.001c0 .348-.283.629-.631.629-.345 0-.627-.281-.627-.629V8.108c0-.345.282-.63.627-.63.348 0 .631.285.631.63v4.772zm-2.466.629H4.917c-.345 0-.63-.281-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.23c.348 0 .629.283.629.629 0 .348-.281.631-.629.631M24 6.954c0-3.845-3.924-6.954-8.748-6.954S6.504 3.109 6.504 6.954c0 3.436 3.046 6.309 7.155 6.777.278.06.657.183.752.42.087.216.056.555.028.775 0 0-.101.603-.123.732-.037.216-.173.845.74.461.913-.384 4.92-2.891 6.714-4.949C23.124 9.813 24 8.456 24 6.954" />
                    </svg>
                    <div>
                      <p className="text-sm text-pure-white/50">{tLine('id')}</p>
                      <span className="text-[#00B900] font-semibold">@brightears</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-pure-white mb-6">{t('links')}</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/about"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('contact')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('faq')}
                  </Link>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="text-lg font-playfair font-semibold text-pure-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/brightears"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-earthy-brown py-6">
          <div className="flex flex-col items-center justify-center">
            <p className="text-pure-white/70 text-sm">
              {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
