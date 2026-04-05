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
import VenueInquiryForm from '@/app/components/VenueInquiryForm';
import HeroSection from '@/components/home/HeroSection';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Bright Ears | \u0E40\u0E2D\u0E40\u0E08\u0E19\u0E0B\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E40\u0E17\u0E34\u0E07\u0E44\u0E17\u0E22'
    : 'Bright Ears | Thailand Entertainment Agency';

  const description = locale === 'th'
    ? '\u0E40\u0E2D\u0E40\u0E08\u0E19\u0E0B\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E40\u0E17\u0E34\u0E07\u0E43\u0E19\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E \u0E14\u0E35\u0E40\u0E08\u0E41\u0E25\u0E30\u0E19\u0E31\u0E01\u0E14\u0E19\u0E15\u0E23\u0E35\u0E21\u0E37\u0E2D\u0E2D\u0E32\u0E0A\u0E35\u0E1E\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1E\u0E23\u0E35\u0E40\u0E21\u0E35\u0E22\u0E21 \u0E08\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E08\u0E32\u0E01 Bright Ears'
    : 'Bangkok entertainment agency. Professional DJs and musicians for premium hotels and venues. Book directly with Bright Ears.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? '\u0E08\u0E2D\u0E07\u0E14\u0E35\u0E40\u0E08, \u0E27\u0E07\u0E14\u0E19\u0E15\u0E23\u0E35, \u0E28\u0E34\u0E25\u0E1B\u0E34\u0E19, \u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E, \u0E42\u0E23\u0E07\u0E41\u0E23\u0E21, \u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17, \u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32\u0E04\u0E2D\u0E21\u0E21\u0E34\u0E0A\u0E0A\u0E31\u0E48\u0E19, PromptPay, Bright Ears'
      : 'book DJ, band booking, musicians, Bangkok, hotels, corporate events, zero commission, PromptPay, entertainment booking, Bright Ears',
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const organizationSchema = generateOrganizationSchema({ locale });
  const localBusinessSchema = generateLocalBusinessSchema({ locale });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? '\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01' : 'Home',
        url: `https://brightears.io/${locale}`
      }
    ]
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className="min-h-screen bg-[#131313]">
        {/* Hero Section */}
        <HeroSection />

        {/* Services Section */}
        <section id="services" className="py-32 bg-[#0e0e0e] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-playfair text-neutral-100 mb-6">
                  {t('landing.whatWeDo.title')}
                </h2>
                <p className="text-[#bcc9ce] text-lg text-balance">
                  {t('landing.whatWeDo.subtitle')}
                </p>
              </div>
              <div className="w-24 h-[1px] bg-[#3d494e] mb-4 hidden md:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* DJ Management */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#00bbe4]/20 flex items-center justify-center mb-8 text-[#4fd6ff] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Turntable platter */}
                    <circle cx="14" cy="16" r="11" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="14" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                    <circle cx="14" cy="16" r="2.5" fill="currentColor"/>
                    {/* Tonearm */}
                    <path d="M25 5L22 12L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="25" cy="4.5" r="1.5" fill="currentColor" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair text-neutral-100 mb-4">
                  {t('landing.whatWeDo.services.djs.title')}
                </h3>
                <p className="text-[#bcc9ce] leading-relaxed text-balance">
                  {t('landing.whatWeDo.services.djs.description')}
                </p>
              </div>

              {/* Live Music */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#f1bca6]/20 flex items-center justify-center mb-8 text-[#f1bca6] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Stage microphone */}
                    <rect x="12" y="3" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                    <path d="M7 13.5C7 13.5 7 20.5 16 20.5C25 20.5 25 13.5 25 13.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M16 20.5V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M11 26H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Sound arcs */}
                    <path d="M27 10C28.5 12 28.5 16 27 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                    <path d="M5 10C3.5 12 3.5 16 5 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair text-neutral-100 mb-4">
                  {t('landing.whatWeDo.services.bands.title')}
                </h3>
                <p className="text-[#bcc9ce] leading-relaxed text-balance">
                  {t('landing.whatWeDo.services.bands.description')}
                </p>
              </div>

              {/* Background Music */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#00bbe4]/20 flex items-center justify-center mb-8 text-[#4fd6ff] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Headphones */}
                    <path d="M6 18V16C6 10.477 10.477 6 16 6C21.523 6 26 10.477 26 16V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="3" y="18" width="5" height="8" rx="2" fill="currentColor" opacity="0.8"/>
                    <rect x="24" y="18" width="5" height="8" rx="2" fill="currentColor" opacity="0.8"/>
                    {/* Sound wave underneath */}
                    <path d="M10 30L12 28L14 30L16 27L18 30L20 28L22 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair text-neutral-100 mb-4">
                  {t('landing.whatWeDo.services.backgroundMusic.title')}
                </h3>
                <p className="text-[#bcc9ce] leading-relaxed text-balance">
                  {t('landing.whatWeDo.services.backgroundMusic.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="about" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <span className="text-[#f1bca6] font-bold tracking-widest uppercase text-sm">
                {locale === 'th' ? '\u0E2A\u0E2D\u0E07\u0E17\u0E28\u0E27\u0E23\u0E23\u0E29\u0E41\u0E2B\u0E48\u0E07\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E25\u0E34\u0E28' : 'Two Decades of Excellence'}
              </span>
              <h2 className="text-5xl md:text-7xl font-playfair text-neutral-100 leading-tight">
                {t('about.story.title')}
              </h2>
              <div className="space-y-6 text-[#bcc9ce] text-lg leading-relaxed max-w-2xl">
                <p>{t('about.story.p1')}</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
              </div>
              <div className="flex gap-12 pt-8">
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">20+</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? '\u0E1B\u0E35\u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E01\u0E32\u0E23\u0E13\u0E4C' : 'Years Exp.'}
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">1000+</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'คืนที่จัดการ' : 'Nights Managed'}
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">4.9★</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'คะแนนเฉลี่ย' : 'Avg. Rating'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-deep-shadow">
                <Image
                  src="/images/hero-dj.jpg"
                  alt="Professional DJ performing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-lg max-w-xs border border-white/10 hidden md:block">
                <p className="italic text-neutral-200 font-playfair">
                  &ldquo;Your venue&rsquo;s entertainment should run like every other department. Reliably. Professionally. Every night.&rdquo;
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#f1bca6]">
                  &mdash; Bright Ears
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section (Bento Grid) */}
        <section className="py-32 bg-[#1c1b1b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-playfair text-neutral-100 mb-4">
                {t('about.whatYouGet.title')}
              </h2>
              <p className="text-[#bcc9ce] max-w-xl mx-auto text-balance">
                {t('about.whatYouGet.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'matching', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                { key: 'preparation', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
                { key: 'management', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { key: 'oneContact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { key: 'transparent', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { key: 'ai', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              ].map(({ key, icon }) => (
                <div
                  key={key}
                  className="bg-[#131313] p-8 rounded-lg hover:shadow-[0px_20px_40px_rgba(0,187,228,0.05)] transition-all border border-transparent hover:border-[#4fd6ff]/20"
                >
                  <svg className="w-6 h-6 text-[#4fd6ff] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                  </svg>
                  <h3 className="text-xl font-bold text-neutral-100 mb-3">
                    {t(`about.features.${key}.feature`)}
                  </h3>
                  <p className="text-[#bcc9ce] text-sm text-balance">
                    {t(`about.features.${key}.benefit`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-20 bg-[#131313] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-12">
              {t('landing.clients.title')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
              {[
                { name: 'Marriott', src: '/images/clients/marriott.svg', width: 96, height: 48 },
                { name: 'Hilton', src: '/images/clients/hilton.png', width: 96, height: 48 },
                { name: 'Centara', src: '/images/clients/centara.png', width: 120, height: 48 },
                { name: 'Accor', src: '/images/clients/accor.png', width: 96, height: 48 },
              ].map((client) => (
                <div key={client.name} className="flex items-center justify-center h-24 group">
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className="h-12 w-auto opacity-50 group-hover:opacity-70 transition-all duration-300"
                    style={{ filter: 'brightness(1.5)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-[#0e0e0e] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl md:text-7xl font-playfair text-neutral-100 mb-8">
                {t('landing.contact.title')}
              </h2>
              <p className="text-[#bcc9ce] text-lg mb-12 max-w-md text-balance">
                {t('landing.contact.subtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#4fd6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[#e5e2e1]">info@brightears.io</span>
                </div>
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#4fd6ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[#e5e2e1]">Thong Lo, Bangkok</span>
                </div>
              </div>

              {/* LINE Contact */}
              <div className="mt-10">
                <p className="font-inter text-[#bcc9ce] mb-4">
                  {t('landing.contact.linePrompt')}
                </p>
                <LineContactButton
                  variant="primary"
                  message={t('landing.contact.lineMessage')}
                  className="px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl"
                />
              </div>
            </div>

            <div className="glass p-10 rounded-xl border border-white/5">
              <VenueInquiryForm darkMode />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
