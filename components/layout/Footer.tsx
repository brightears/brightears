'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/components/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-deep-teal text-pure-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
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
                    <span>hello@brightears.co</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+66 2 123 4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{t('address')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-pure-white mb-6">{t('links')}</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/artists" 
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('browseArtists')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/how-it-works" 
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('howItWorks')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/corporate" 
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('corporate')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-lg font-playfair font-semibold text-pure-white mb-6">{t('legal')}</h4>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/terms" 
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('terms')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                  >
                    {t('privacy')}
                  </Link>
                </li>
              </ul>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="text-lg font-playfair font-semibold text-pure-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {/* Facebook */}
                  <a
                    href="#"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="#"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.901 8.198 7.052 7.708 8.349 7.708s2.448.49 3.323 1.297c.876.876 1.366 2.027 1.366 3.323s-.49 2.448-1.297 3.323c-.876.876-2.026 1.366-3.323 1.366z" />
                    </svg>
                  </a>

                  {/* Line */}
                  <a
                    href="#"
                    className="text-pure-white/70 hover:text-pure-white transition-colors"
                    aria-label="Line"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.630.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.630-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.630 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.963C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-earthy-brown py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-pure-white/70 text-sm">
              {t('copyright')}
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-pure-white/70">
              <Link href="/terms" className="hover:text-pure-white transition-colors">
                {t('terms')}
              </Link>
              <Link href="/privacy" className="hover:text-pure-white transition-colors">
                {t('privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}