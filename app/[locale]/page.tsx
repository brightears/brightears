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
import {
  MusicalNoteIcon,
  UserGroupIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

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

        {/* What We Do Section - Warm cream background */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50 to-stone-100 relative overflow-hidden">
          {/* Subtle decorative orb */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/5 rounded-full filter blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-4">
              {t('landing.whatWeDo.title')}
            </h2>
            <p className="font-inter text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.whatWeDo.subtitle')}
            </p>

            {/* Service Cards - Enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* DJs */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200/50 group hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center ring-4 ring-brand-cyan/20 group-hover:ring-brand-cyan/40 transition-all">
                  <MusicalNoteIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                  {t('landing.whatWeDo.services.djs.title')}
                </h3>
                <p className="font-inter text-gray-600">
                  {t('landing.whatWeDo.services.djs.description')}
                </p>
              </div>

              {/* Live Bands */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200/50 group hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-earthy-brown to-deep-teal rounded-full flex items-center justify-center ring-4 ring-earthy-brown/20 group-hover:ring-earthy-brown/40 transition-all">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                  {t('landing.whatWeDo.services.bands.title')}
                </h3>
                <p className="font-inter text-gray-600">
                  {t('landing.whatWeDo.services.bands.description')}
                </p>
              </div>

              {/* Atmosphere Design */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200/50 group hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-deep-teal to-brand-cyan rounded-full flex items-center justify-center ring-4 ring-deep-teal/20 group-hover:ring-deep-teal/40 transition-all">
                  <SparklesIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                  {t('landing.whatWeDo.services.atmosphere.title')}
                </h3>
                <p className="font-inter text-gray-600">
                  {t('landing.whatWeDo.services.atmosphere.description')}
                </p>
              </div>

              {/* Corporate Events */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200/50 group hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-deep-teal to-earthy-brown rounded-full flex items-center justify-center ring-4 ring-deep-teal/20 group-hover:ring-deep-teal/40 transition-all">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                  {t('landing.whatWeDo.services.corporate.title')}
                </h3>
                <p className="font-inter text-gray-600">
                  {t('landing.whatWeDo.services.corporate.description')}
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

            {/* Steps */}
            <div className="relative">
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                      {t('landing.howItWorks.steps.contact.title')}
                    </h3>
                    <p className="font-inter text-white/70">
                      {t('landing.howItWorks.steps.contact.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-brand-cyan rounded-full flex items-center justify-center shadow-xl ring-4 ring-brand-cyan/30">
                    <span className="text-3xl font-playfair font-bold text-white">1</span>
                  </div>
                  <div className="md:flex-1">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                      <ChatBubbleLeftRightIcon className="w-10 h-10 text-brand-cyan" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right md:order-2">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                      {t('landing.howItWorks.steps.quote.title')}
                    </h3>
                    <p className="font-inter text-white/70">
                      {t('landing.howItWorks.steps.quote.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-earthy-brown rounded-full flex items-center justify-center shadow-xl ring-4 ring-earthy-brown/30 md:order-1">
                    <span className="text-3xl font-playfair font-bold text-white">2</span>
                  </div>
                  <div className="md:flex-1 md:order-3">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                      <DocumentTextIcon className="w-10 h-10 text-earthy-brown" />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right">
                    <h3 className="font-playfair text-2xl font-bold text-white mb-3">
                      {t('landing.howItWorks.steps.enjoy.title')}
                    </h3>
                    <p className="font-inter text-white/70">
                      {t('landing.howItWorks.steps.enjoy.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
                    <span className="text-3xl font-playfair font-bold text-deep-teal">3</span>
                  </div>
                  <div className="md:flex-1">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                      <CheckCircleIcon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section - Warm cream background */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-stone-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-16">
              {t('landing.clients.title')}
            </h2>

            {/* Logo Grid - Improved styling */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((logo) => (
                <div
                  key={logo}
                  className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center h-28 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-stone-100"
                >
                  {/* Placeholder - subtle styling */}
                  <div className="w-16 h-8 bg-stone-200 rounded opacity-40" />
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
