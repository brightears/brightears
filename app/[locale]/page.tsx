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
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 relative overflow-hidden">
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

        {/* How It Works Section - Dark background */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal to-deep-teal/95 relative overflow-hidden">
          {/* Animated decorative orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/10 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-earthy-brown/10 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />

          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="font-inter text-xl text-white/80 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>

            {/* Steps - Minimal 3-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {/* Step 1 - Contact */}
              <div className="text-center">
                <span className="block text-7xl font-playfair font-extralight text-white/20 mb-6">01</span>
                <h3 className="font-playfair text-xl font-semibold text-white mb-2">
                  {t('landing.howItWorks.steps.contact.title')}
                </h3>
                <p className="font-inter text-sm text-white/60 max-w-xs mx-auto">
                  {t('landing.howItWorks.steps.contact.description')}
                </p>
              </div>

              {/* Step 2 - Quote */}
              <div className="text-center">
                <span className="block text-7xl font-playfair font-extralight text-white/20 mb-6">02</span>
                <h3 className="font-playfair text-xl font-semibold text-white mb-2">
                  {t('landing.howItWorks.steps.quote.title')}
                </h3>
                <p className="font-inter text-sm text-white/60 max-w-xs mx-auto">
                  {t('landing.howItWorks.steps.quote.description')}
                </p>
              </div>

              {/* Step 3 - Enjoy */}
              <div className="text-center">
                <span className="block text-7xl font-playfair font-extralight text-white/20 mb-6">03</span>
                <h3 className="font-playfair text-xl font-semibold text-white mb-2">
                  {t('landing.howItWorks.steps.enjoy.title')}
                </h3>
                <p className="font-inter text-sm text-white/60 max-w-xs mx-auto">
                  {t('landing.howItWorks.steps.enjoy.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section - Sophisticated dark background */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-800 to-stone-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white text-center mb-16">
              {t('landing.clients.title')}
            </h2>

            {/* Logo Grid - Glass morphism on dark */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((logo) => (
                <div
                  key={logo}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-8 flex items-center justify-center h-28 hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  {/* Placeholder - subtle styling */}
                  <div className="w-16 h-8 bg-white/20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section - Dark gradient background */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-earthy-brown/80 relative overflow-hidden">
          {/* Decorative orb */}
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full filter blur-3xl" />

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white text-center mb-4">
              {t('landing.contact.title')}
            </h2>
            <p className="font-inter text-xl text-white/80 text-center mb-12">
              {t('landing.contact.subtitle')}
            </p>

            {/* Contact Form - Glass morphism card */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl">
              <ContactForm tab="general" />
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
