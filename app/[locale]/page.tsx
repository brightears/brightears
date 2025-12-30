import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';
import Image from 'next/image';
import LineContactButton from '@/components/buttons/LineContactButton';
import ContactForm from '@/app/components/ContactForm';
import HeroSection from '@/components/home/HeroSection';
// Icons are now custom SVGs inline

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'จองดีเจ วงดนตรี สำหรับโรงแรม | Bright Ears'
    : 'Book Live Entertainment for Hotels & Venues | Bright Ears';

  const description = locale === 'th'
    ? 'แพลตฟอร์มจองศิลปินชั้นนำของไทย ดีเจและวงดนตรีมืออาชีพ 500+ คน งาน 10,000+ งาน ไม่มีค่าคอมมิชชั่น จองตรงจากเครือข่ายบันเทิงระดับพรีเมียมในกรุงเทพ'
    : "Thailand's largest entertainment booking platform. 500+ verified artists, 10K+ events delivered. Book DJs, bands, musicians for your Bangkok venue with zero commission.";

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'จองดีเจ, วงดนตรี, ศิลปิน, กรุงเทพ, โรงแรม, งานบริษัท, ไม่มีค่าคอมมิชชั่น, PromptPay, Bright Ears'
      : 'book DJ, band booking, musicians, Bangkok, hotels, corporate events, zero commission, PromptPay, entertainment booking, Bright Ears',
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-home.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - แพลตฟอร์มจองศิลปินชั้นนำของไทย'
          : 'Bright Ears - Book Live Entertainment for Hotels & Venues'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-home.jpg'],
      site: '@brightears',
      creator: '@brightears',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'th': '/th',
        'x-default': '/en',
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema({ locale });
  const localBusinessSchema = generateLocalBusinessSchema({
    locale,
    aggregateRating: {
      ratingValue: '4.9',
      reviewCount: '500'
    }
  });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      }
    ]
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen bg-off-white">
        {/* Hero Section with Mouse Tracking */}
        <HeroSection />

        {/* What We Do Section - Sophisticated dark background */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 relative overflow-hidden scroll-mt-20">
          {/* Subtle decorative orb */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-earthy-brown/10 rounded-full filter blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {t('landing.whatWeDo.title')}
            </h2>
            <p className="font-inter text-xl text-stone-300 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.whatWeDo.subtitle')}
            </p>

            {/* Service Cards - 3 cards with custom SVG icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* DJs - Vinyl Record Icon */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center ring-4 ring-brand-cyan/20 group-hover:ring-brand-cyan/40 transition-all">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="16" cy="16" r="2" fill="currentColor"/>
                    <path d="M16 2C16 2 20 8 20 16C20 24 16 30 16 30" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                  {t('landing.whatWeDo.services.djs.title')}
                </h3>
                <p className="font-inter text-stone-400">
                  {t('landing.whatWeDo.services.djs.description')}
                </p>
              </div>

              {/* Live Bands - Microphone Icon */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-earthy-brown to-deep-teal rounded-full flex items-center justify-center ring-4 ring-earthy-brown/20 group-hover:ring-earthy-brown/40 transition-all">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="11" y="2" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M6 14C6 14 6 22 16 22C26 22 26 14 26 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 22V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 28H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                  {t('landing.whatWeDo.services.bands.title')}
                </h3>
                <p className="font-inter text-stone-400">
                  {t('landing.whatWeDo.services.bands.description')}
                </p>
              </div>

              {/* Background Music - Sound Wave Icon */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-deep-teal to-brand-cyan rounded-full flex items-center justify-center ring-4 ring-deep-teal/20 group-hover:ring-deep-teal/40 transition-all">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16H4.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M8 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 4V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20 8V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M24 12V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M28 16H28.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                  {t('landing.whatWeDo.services.backgroundMusic.title')}
                </h3>
                <p className="font-inter text-stone-400">
                  {t('landing.whatWeDo.services.backgroundMusic.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section - Dark gradient background */}
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-800 to-stone-900 relative overflow-hidden scroll-mt-20">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white">
                {t('about.story.title')}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            <div className="space-y-6 font-inter text-lg text-white/80 leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-playfair first-letter:font-bold first-letter:text-brand-cyan first-letter:mr-2 first-letter:float-left">
                {t('about.story.p1')}
              </p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
          </div>
        </section>

        {/* What You Get Section - Dark gradient with glass cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-deep-teal relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-soft-lavender/10 rounded-full filter blur-3xl" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
                {t('about.whatYouGet.title')}
              </h2>
              <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto">
                {t('about.whatYouGet.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bespoke Matching */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.matching.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.matching.benefit')}
                </p>
              </div>

              {/* Full Preparation */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.preparation.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.preparation.benefit')}
                </p>
              </div>

              {/* Ongoing Management */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.management.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.management.benefit')}
                </p>
              </div>

              {/* One Contact */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.oneContact.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.oneContact.benefit')}
                </p>
              </div>

              {/* Transparent Pricing */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.transparent.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.transparent.benefit')}
                </p>
              </div>

              {/* AI-Powered */}
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {t('about.features.ai.feature')}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {t('about.features.ai.benefit')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section - Sophisticated dark background */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-800 to-stone-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-inter text-sm uppercase tracking-[0.2em] text-white/50 text-center mb-12">
              {t('landing.clients.title')}
            </h2>

            {/* Logo Grid - Glass morphism on dark */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: 'Marriott', src: '/images/clients/marriott.svg' },
                { name: 'Hilton', src: '/images/clients/hilton.png' },
                { name: 'Centara', src: '/images/clients/centara.png' },
                { name: 'Accor', src: '/images/clients/accor.png' },
              ].map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-center h-24 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.src}
                    alt={client.name}
                    className="h-12 w-auto opacity-50 group-hover:opacity-70 transition-all duration-300"
                    style={{ filter: 'grayscale(100%) brightness(1.5)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section - Dark gradient background */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-earthy-brown/80 relative overflow-hidden scroll-mt-20">
          {/* Decorative orb */}
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full filter blur-3xl" />

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {t('landing.contact.title')}
            </h2>
            <p className="font-inter text-xl text-white/80 text-center mb-12">
              {t('landing.contact.subtitle')}
            </p>

            {/* Contact Form - Dark glass morphism card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
              <ContactForm tab="general" darkMode />
            </div>

            {/* LINE Contact Button */}
            <div className="text-center mb-6">
              <p className="font-inter text-white/80 mb-4">
                {t('landing.contact.linePrompt')}
              </p>
              <LineContactButton
                variant="primary"
                message={t('landing.contact.lineMessage')}
                className="px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl"
              />
            </div>

            {/* Response Time */}
            <p className="text-center font-inter text-sm text-white/60">
              {t('landing.contact.responseTime')}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
