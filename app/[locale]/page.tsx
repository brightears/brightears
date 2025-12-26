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
import {
  MusicalNoteIcon,
  UserGroupIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  StarIcon
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
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-cyan via-deep-teal to-earthy-brown">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/80 via-deep-teal/80 to-earthy-brown/80" />

          {/* Animated orbs (static, no mouse tracking) */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-soft-lavender/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-cyan/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="Bright Ears Logo"
                width={120}
                height={120}
                className="drop-shadow-2xl"
                priority
              />
            </div>

            {/* Main Headline */}
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              {t('landing.hero.headline')}
            </h1>

            {/* Subheadline */}
            <p className="font-inter text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 drop-shadow-md">
              {t('landing.hero.subheadline')}
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <a
                href="#contact"
                className="inline-block px-10 py-5 bg-white text-deep-teal font-inter font-bold text-lg rounded-full shadow-2xl hover:shadow-brand-cyan/50 hover:scale-105 transition-all duration-300"
              >
                {t('landing.hero.cta')}
              </a>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
              <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-playfair font-bold text-white mb-2">500+</div>
                <div className="text-white/80 font-inter">{t('landing.hero.stats.venues')}</div>
              </div>
              <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-playfair font-bold text-white mb-2">10,000+</div>
                <div className="text-white/80 font-inter">{t('landing.hero.stats.events')}</div>
              </div>
              <div className="glass-strong rounded-2xl p-6 backdrop-blur-lg">
                <div className="text-4xl font-playfair font-bold text-white mb-2">4.9★</div>
                <div className="text-white/80 font-inter">{t('landing.hero.stats.rating')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-4">
              {t('landing.whatWeDo.title')}
            </h2>
            <p className="font-inter text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.whatWeDo.subtitle')}
            </p>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* DJs */}
              <div className="card-modern p-8 text-center hover:border-brand-cyan group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center">
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
              <div className="card-modern p-8 text-center hover:border-brand-cyan group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-earthy-brown to-deep-teal rounded-full flex items-center justify-center">
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
              <div className="card-modern p-8 text-center hover:border-brand-cyan group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-soft-lavender to-brand-cyan rounded-full flex items-center justify-center">
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
              <div className="card-modern p-8 text-center hover:border-brand-cyan group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-deep-teal to-earthy-brown rounded-full flex items-center justify-center">
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

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-off-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="font-inter text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.howItWorks.subtitle')}
            </p>

            {/* Steps */}
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-20 bottom-20 w-1 bg-brand-cyan/30" />

              <div className="space-y-16">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right">
                    <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                      {t('landing.howItWorks.steps.contact.title')}
                    </h3>
                    <p className="font-inter text-gray-600">
                      {t('landing.howItWorks.steps.contact.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-brand-cyan rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-playfair font-bold text-white">1</span>
                  </div>
                  <div className="md:flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20 rounded-2xl flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="w-10 h-10 text-brand-cyan" />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right md:order-2">
                    <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                      {t('landing.howItWorks.steps.quote.title')}
                    </h3>
                    <p className="font-inter text-gray-600">
                      {t('landing.howItWorks.steps.quote.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-deep-teal rounded-full flex items-center justify-center shadow-xl md:order-1">
                    <span className="text-3xl font-playfair font-bold text-white">2</span>
                  </div>
                  <div className="md:flex-1 md:order-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-earthy-brown/20 to-deep-teal/20 rounded-2xl flex items-center justify-center">
                      <DocumentTextIcon className="w-10 h-10 text-earthy-brown" />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:flex-1 md:text-right">
                    <h3 className="font-playfair text-2xl font-bold text-deep-teal mb-3">
                      {t('landing.howItWorks.steps.enjoy.title')}
                    </h3>
                    <p className="font-inter text-gray-600">
                      {t('landing.howItWorks.steps.enjoy.description')}
                    </p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-earthy-brown rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-playfair font-bold text-white">3</span>
                  </div>
                  <div className="md:flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-soft-lavender/20 to-brand-cyan/20 rounded-2xl flex items-center justify-center">
                      <CheckCircleIcon className="w-10 h-10 text-soft-lavender" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="font-inter text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="card-modern p-8">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-inter text-gray-700 mb-6 italic">
                  "{t('landing.testimonials.items.0.quote')}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-inter font-semibold text-deep-teal">
                    {t('landing.testimonials.items.0.name')}
                  </p>
                  <p className="font-inter text-sm text-gray-500">
                    {t('landing.testimonials.items.0.company')}
                  </p>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="card-modern p-8">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-inter text-gray-700 mb-6 italic">
                  "{t('landing.testimonials.items.1.quote')}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-inter font-semibold text-deep-teal">
                    {t('landing.testimonials.items.1.name')}
                  </p>
                  <p className="font-inter text-sm text-gray-500">
                    {t('landing.testimonials.items.1.company')}
                  </p>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="card-modern p-8">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="font-inter text-gray-700 mb-6 italic">
                  "{t('landing.testimonials.items.2.quote')}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-inter font-semibold text-deep-teal">
                    {t('landing.testimonials.items.2.name')}
                  </p>
                  <p className="font-inter text-sm text-gray-500">
                    {t('landing.testimonials.items.2.company')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-off-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-16">
              {t('landing.clients.title')}
            </h2>

            {/* Logo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[1, 2, 3, 4, 5, 6].map((logo) => (
                <div
                  key={logo}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200 p-8 flex items-center justify-center h-32 hover:border-brand-cyan transition-colors duration-300"
                >
                  <span className="font-inter text-gray-400 font-medium">Logo</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-deep-teal text-center mb-4">
              {t('landing.contact.title')}
            </h2>
            <p className="font-inter text-xl text-gray-600 text-center mb-12">
              {t('landing.contact.subtitle')}
            </p>

            {/* Contact Form */}
            <div className="card-modern p-8 mb-8">
              <ContactForm tab="general" />
            </div>

            {/* LINE Contact Button */}
            <div className="text-center mb-6">
              <p className="font-inter text-gray-600 mb-4">
                {t('landing.contact.linePrompt')}
              </p>
              <LineContactButton
                variant="primary"
                message={t('landing.contact.lineMessage')}
                className="px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl"
              />
            </div>

            {/* Response Time */}
            <p className="text-center font-inter text-sm text-gray-500">
              {t('landing.contact.responseTime')}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
