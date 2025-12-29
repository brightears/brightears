import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'เกี่ยวกับ Bright Ears - เอเจนซี่บันเทิงของไทย'
    : 'About Bright Ears - Thailand\'s Entertainment Agency';

  const description = locale === 'th'
    ? 'ตั้งแต่ปี 2007 เราได้ร่วมงานกับโรงแรมและสถานที่ชั้นนำของประเทศไทย เพื่อสร้างประสบการณ์ความบันเทิงที่ไร้รอยต่อและเฉพาะตัว'
    : 'Since 2007, we\'ve partnered with Thailand\'s finest hotels and venues to create seamless, bespoke entertainment experiences.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/about`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('about');

  // Generate structured data
  const organizationSchema = generateOrganizationSchema({
    locale,
    url: `https://brightears.onrender.com/${locale}/about`
  });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      },
      {
        name: locale === 'th' ? 'เกี่ยวกับเรา' : 'About',
        url: `https://brightears.onrender.com/${locale}/about`
      }
    ]
  });

  const features = [
    {
      feature: t('features.matching.feature'),
      benefit: t('features.matching.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      feature: t('features.preparation.feature'),
      benefit: t('features.preparation.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      feature: t('features.management.feature'),
      benefit: t('features.management.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      feature: t('features.oneContact.feature'),
      benefit: t('features.oneContact.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      feature: t('features.transparent.feature'),
      benefit: t('features.transparent.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      feature: t('features.ai.feature'),
      benefit: t('features.ai.benefit'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen">
        {/* Hero Section - Matching Landing Page Style */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Layer 1: Photo background */}
          <Image
            src="/images/about-hero.jpg"
            alt="Live jazz band performing at a luxury hotel bar in Bangkok"
            fill
            priority
            className="object-cover opacity-40 md:opacity-50"
            sizes="100vw"
          />

          {/* Layer 2: Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

          {/* Layer 3: Brand gradient overlay */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(0, 187, 228, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(164, 119, 100, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, rgba(47, 99, 100, 0.3) 0%, rgba(0, 187, 228, 0.2) 100%)
              `
            }}
          />

          {/* Animated orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-cyan/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-soft-lavender/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-earthy-brown/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              {t('hero.title')}
            </h1>
            <p className="font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-gray">
                {t('story.title')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
            </div>

            <div className="space-y-6 font-inter text-lg text-dark-gray/80 leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-playfair first-letter:font-bold first-letter:text-deep-teal first-letter:mr-2 first-letter:float-left">
                {t('story.p1')}
              </p>
              <p>{t('story.p2')}</p>
              <p>{t('story.p3')}</p>
            </div>
          </div>
        </section>

        {/* What You Get - Features & Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-off-white to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-dark-gray mb-4">
                {t('whatYouGet.title')}
              </h2>
              <p className="font-inter text-lg text-dark-gray/70 max-w-2xl mx-auto">
                {t('whatYouGet.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-brand-cyan/20 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-cyan/10 to-deep-teal/10 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-inter font-semibold text-lg text-dark-gray mb-3">
                    {item.feature}
                  </h3>
                  <p className="font-inter text-dark-gray/70 leading-relaxed">
                    {item.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-deep-teal">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">20+</div>
                <div className="font-inter text-white/70 text-sm uppercase tracking-wider">{locale === 'th' ? 'ปีประสบการณ์' : 'Years Experience'}</div>
              </div>
              <div>
                <div className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
                <div className="font-inter text-white/70 text-sm uppercase tracking-wider">{locale === 'th' ? 'ศิลปินในเครือข่าย' : 'Artists Network'}</div>
              </div>
              <div>
                <div className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
                <div className="font-inter text-white/70 text-sm uppercase tracking-wider">{locale === 'th' ? 'สถานที่พาร์ทเนอร์' : 'Venue Partners'}</div>
              </div>
              <div>
                <div className="font-playfair text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
                <div className="font-inter text-white/70 text-sm uppercase tracking-wider">{locale === 'th' ? 'งานอีเวนต์' : 'Events Delivered'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep-teal via-deep-teal to-brand-cyan/80" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-lavender/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="font-inter text-lg text-white/80 mb-10 max-w-xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-3 bg-white text-deep-teal px-10 py-5 rounded-full hover:bg-off-white transition-all duration-300 font-inter font-semibold text-lg hover:scale-105 shadow-2xl hover:shadow-white/20"
            >
              {t('cta.button')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
