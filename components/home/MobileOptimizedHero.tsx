'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/components/navigation';
import { partners } from '@/lib/partners';
import EnhancedSearch from '@/components/search/EnhancedSearch';
import { ThaiMobileImage } from '@/components/mobile/MobileOptimizations';

export default function MobileOptimizedHero() {
  const t = useTranslations('hero');
  const [currentTip, setCurrentTip] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const mobileTips = [
    "🎉 ไม่มีค่าคอมมิชชั่น - ราคาโปร่งใส",
    "📱 จองผ่าน LINE ได้ทันที",
    "⭐ ศิลปินที่ผ่านการตรวจสอบ",
    "🏆 ได้รับความไว้วางใจจากโรงแรมชั้นนำ"
  ];

  useEffect(() => {
    // Check if mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // Rotate tips for mobile
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % mobileTips.length);
    }, 3000);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-deep-teal via-earthy-brown to-deep-teal py-12 md:py-16 lg:py-24 min-h-[85vh] md:min-h-auto flex items-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center">
          {/* Mobile attention-grabbing tip */}
          {isMobile && (
            <div className="mb-6">
              <div className="inline-flex items-center bg-brand-cyan/10 border border-brand-cyan/20 rounded-full px-4 py-2 mb-4 animate-pulse">
                <span className="text-brand-cyan text-sm font-medium thai-mobile-text">
                  {mobileTips[currentTip]}
                </span>
              </div>
            </div>
          )}

          {/* Main Heading - Mobile optimized */}
          <h1 className="text-thai-mobile-2xl md:text-4xl font-playfair font-bold tracking-tight text-pure-white sm:text-5xl lg:text-6xl thai-mobile-text mb-4 md:mb-6">
            {t('title')}
          </h1>
          
          {/* Subtitle - Mobile optimized */}
          <p className="text-thai-mobile-base md:text-xl text-pure-white/90 sm:text-2xl thai-mobile-text max-w-md md:max-w-none mx-auto mb-8 md:mb-10">
            {t('subtitle')}
          </p>

          {/* Enhanced Search - Mobile first */}
          <div className="mb-8 md:mb-10">
            <EnhancedSearch variant="hero" />
          </div>

          {/* CTA Buttons - Mobile optimized */}
          <div className="space-y-4 md:space-y-0 md:flex md:flex-row md:gap-4 md:justify-center mb-8 md:mb-16">
            {/* Primary CTA - Larger on mobile */}
            <Link
              href="/artists"
              className="block md:inline-block w-full md:w-auto px-8 py-4 md:py-3 text-thai-mobile-lg md:text-lg font-semibold md:font-medium text-pure-white bg-brand-cyan hover:bg-brand-cyan/90 border-2 border-brand-cyan rounded-xl md:rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all active:scale-95 shadow-lg min-h-[56px] md:min-h-auto"
            >
              🔍 {t('browseButton')}
            </Link>
            
            {/* Secondary CTAs - Grid on mobile */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              <Link
                href="/artists?quick=line"
                className="px-4 py-3 text-thai-mobile-sm font-medium text-pure-white bg-green-500 hover:bg-green-600 rounded-lg transition-all active:scale-95 min-h-[48px] flex items-center justify-center"
              >
                <span className="mr-1">📱</span>
                LINE จอง
              </Link>
              <Link
                href="/corporate"
                className="px-4 py-3 text-thai-mobile-sm font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 transition-all active:scale-95 min-h-[48px] flex items-center justify-center"
              >
                <span className="mr-1">🏢</span>
                ธุรกิจ
              </Link>
            </div>

            {/* Desktop secondary CTA */}
            <Link
              href="/corporate"
              className="hidden md:inline-block px-8 py-3 text-lg font-medium text-pure-white bg-transparent border-2 border-pure-white/50 rounded-lg hover:bg-pure-white/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 transition-all"
            >
              {t('corporateButton')}
            </Link>
          </div>

          {/* Mobile social proof - Simplified */}
          {isMobile && (
            <div className="bg-pure-white/10 backdrop-blur-sm rounded-xl p-4 border border-pure-white/20 mb-8">
              <p className="text-pure-white/80 text-thai-mobile-xs mb-3 thai-mobile-text">
                ได้รับความไว้วางใจจาก
              </p>
              <div className="grid grid-cols-3 gap-4 opacity-80">
                <div className="text-center">
                  <div className="text-2xl mb-1">🏨</div>
                  <p className="text-pure-white text-thai-mobile-xs thai-mobile-text">โรงแรม 5 ดาว</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🎪</div>
                  <p className="text-pure-white text-thai-mobile-xs thai-mobile-text">งานเทศกาล</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🏢</div>
                  <p className="text-pure-white text-thai-mobile-xs thai-mobile-text">บริษัทชั้นนำ</p>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Trusted By Section */}
          <div className="hidden md:block mt-16">
            <p className="text-sm text-pure-white/80 uppercase tracking-wide font-semibold">
              {t('trustedBy')}
            </p>
            <div className="mt-6">
              {/* Desktop: Show all logos in one row */}
              <div className="hidden md:flex justify-center items-center space-x-8 opacity-70">
                {partners.map((partner) => (
                  <div 
                    key={partner.name}
                    className="flex-shrink-0 transition-all duration-300 hover:opacity-100 hover:scale-105"
                  >
                    {partner.websiteUrl ? (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <ThaiMobileImage
                          src={partner.logoPath}
                          alt={partner.altText}
                          width={120}
                          height={48}
                          className="h-12 w-auto filter brightness-0 invert"
                          priority
                        />
                      </a>
                    ) : (
                      <ThaiMobileImage
                        src={partner.logoPath}
                        alt={partner.altText}
                        width={120}
                        height={48}
                        className="h-12 w-auto filter brightness-0 invert"
                        priority
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-48 md:w-72 h-48 md:h-72 bg-brand-cyan rounded-full mix-blend-overlay filter blur-xl opacity-20 md:opacity-10 animate-pulse md:animate-blob"></div>
        <div className="absolute -bottom-4 -left-4 w-48 md:w-72 h-48 md:h-72 bg-soft-lavender rounded-full mix-blend-overlay filter blur-xl opacity-15 md:opacity-8 animate-pulse md:animate-blob"></div>
        {!isMobile && (
          <div className="absolute top-8 left-1/2 w-72 h-72 bg-pure-white rounded-full mix-blend-soft-light filter blur-xl opacity-5 animate-blob"></div>
        )}
      </div>
    </section>
  );
}