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
import HashScroller from '@/components/HashScroller';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Bright Ears | แพลตฟอร์มประสบการณ์สถานที่'
    : 'Bright Ears | The Venue Experience Platform';

  const description = locale === 'th'
    ? 'แพลตฟอร์มจัดการประสบการณ์สถานที่ครบวงจร ดีเจ นักดนตรี การตลาด AI และบริการพันธมิตร สำหรับโรงแรมและสถานที่ระดับพรีเมียมในประเทศไทย'
    : 'The venue experience platform for hotels and premium venues. Entertainment scheduling, AI-powered marketing, and partner services — all in one place.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'จองดีเจ, วงดนตรี, ศิลปิน, กรุงเทพ, โรงแรม, งานบริษัท, ไม่มีค่าคอมมิชชั่น, PromptPay, Bright Ears'
      : 'venue experience platform, book DJ, entertainment management, Bangkok, hotels, AI marketing, analytics, partner ecosystem, Bright Ears',
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
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.io/${locale}`
      }
    ]
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />

      <HashScroller />
      <main className="min-h-screen bg-[#131313]">
        {/* Hero Section */}
        <HeroSection />

        {/* Social Proof Bar */}
        <section className="bg-[#0e0e0e] border-y border-[#3d494e]/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-10">
              Trusted by Bangkok&apos;s most prestigious venues
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
            <div className="mt-12 flex justify-center gap-12 md:gap-24">
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-[#4fd6ff]">20+ Years</div>
                <div className="text-xs uppercase tracking-widest text-[#e5e2e1]/40 mt-1">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-[#f1bca6]">1000+</div>
                <div className="text-xs uppercase tracking-widest text-[#e5e2e1]/40 mt-1">Nights Managed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair font-bold text-[#4fd6ff]">4.9★</div>
                <div className="text-xs uppercase tracking-widest text-[#e5e2e1]/40 mt-1">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Modules Section */}
        <section id="platform" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-[#f1bca6] text-sm font-semibold tracking-widest uppercase">The Ecosystem</span>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mt-4">
                Modular Intelligence for<br />Hospitality Groups.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Entertainment Management — Large Card */}
              <div className="md:col-span-2 md:row-span-1 glass p-10 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-[#2a2a2a] transition-all">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-lg bg-[#00bbe4]/20 flex items-center justify-center mb-6 text-[#4fd6ff] group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="16" r="11" stroke="currentColor" strokeWidth="2.5"/>
                      <circle cx="14" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                      <circle cx="14" cy="16" r="2.5" fill="currentColor"/>
                      <path d="M25 5L22 12L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="25" cy="4.5" r="1.5" fill="currentColor" opacity="0.6"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Entertainment Management</h3>
                  <p className="text-[#bcc9ce] max-w-md">DJs, musicians, and background music. Scheduled, managed, and quality-controlled across all zones.</p>
                </div>
              </div>

              {/* Marketing Engine — Small Card */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#f1bca6]/20 flex items-center justify-center mb-6 text-[#f1bca6] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="6" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2.5"/>
                    <circle cx="12" cy="14" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 10h4M20 14h4M20 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                    <path d="M8 20l3-3 2 1 4-5 3 2 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Marketing Engine</h3>
                <p className="text-[#bcc9ce] text-sm">Auto-generate Instagram, TikTok, and event posters from your bookings instantly.</p>
              </div>

              {/* Partner Ecosystem — Small Card */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#00bbe4]/20 flex items-center justify-center mb-6 text-[#4fd6ff] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4L6 10v12l10 6 10-6V10L16 4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                    <path d="M16 16L6 10M16 16l10-6M16 16v12" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                    <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Partner Ecosystem</h3>
                <p className="text-[#bcc9ce] text-sm">Audio, lighting, scent, and AV partners in one unified management hub.</p>
              </div>

              {/* AI Features — Large Card */}
              <div className="md:col-span-2 glass p-10 rounded-xl border border-white/5 relative overflow-hidden group hover:bg-[#2a2a2a] transition-all">
                <div className="relative z-10 grid md:grid-cols-2 gap-8 h-full">
                  <div>
                    <div className="w-14 h-14 rounded-lg bg-[#f1bca6]/20 flex items-center justify-center mb-6 text-[#f1bca6] group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M8 22l1 3h3l-2.5 2 1 3L8 28l-2.5 2 1-3L4 25h3l1-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
                        <path d="M24 20l1 3h3l-2.5 2 1 3-2.5-2-2.5 2 1-3-2.5-2h3l1-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">AI Features</h3>
                    <p className="text-[#bcc9ce]">Smart DJ matching, seasonal content generation, and peak-hour energy recommendations powered by proprietary venue data.</p>
                  </div>
                  <div className="flex flex-col justify-end space-y-4">
                    <div className="p-4 bg-[#353534] rounded flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#4fd6ff] animate-pulse rounded-full" />
                      <span className="text-xs uppercase tracking-tight text-[#e5e2e1]/70">AI: Optimal BPM detected for 11:00 PM</span>
                    </div>
                    <div className="p-4 bg-[#353534] rounded flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#f1bca6] rounded-full" />
                      <span className="text-xs uppercase tracking-tight text-[#e5e2e1]/70">Event Poster Draft: Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics — Small Card */}
              <div className="glass p-10 rounded-xl border border-white/5 hover:bg-[#2a2a2a] transition-all group">
                <div className="w-14 h-14 rounded-lg bg-[#00bbe4]/20 flex items-center justify-center mb-6 text-[#4fd6ff] group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="20" width="5" height="8" rx="1" fill="currentColor" opacity="0.4"/>
                    <rect x="13.5" y="14" width="5" height="14" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="23" y="8" width="5" height="20" rx="1" fill="currentColor" opacity="0.8"/>
                    <path d="M4 18L14 10l6 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="28" cy="6" r="2" fill="currentColor"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Analytics &amp; Insights</h3>
                <p className="text-[#bcc9ce] text-sm">Entertainment spend, performer ratings, and ROI dashboards for group management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 bg-[#1c1b1b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                <span className="text-[#f1bca6] text-sm font-semibold tracking-widest uppercase">The Process</span>
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mt-4">
                  Effortless Venue<br />Transformation.
                </h2>
              </div>
              <div className="mt-8 md:mt-0">
                <p className="text-[#bcc9ce] italic">From fragmented chaos to high-fidelity management.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="relative">
                <div className="text-[120px] font-playfair font-extrabold text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">01</div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-6 mt-4">Subscribe &amp; Onboard</h4>
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Set up your properties and configure your brand standards.</p>
                <div className="h-1 bg-gradient-to-r from-[#4fd6ff] to-transparent w-full opacity-30" />
              </div>
              <div className="relative">
                <div className="text-[120px] font-playfair font-extrabold text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">02</div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-6 mt-4">Schedule &amp; Create</h4>
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Book entertainment, auto-generate marketing content, manage partners.</p>
                <div className="h-1 bg-gradient-to-r from-[#f1bca6] to-transparent w-full opacity-30" />
              </div>
              <div className="relative">
                <div className="text-[120px] font-playfair font-extrabold text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">03</div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-6 mt-4">Analyze &amp; Optimize</h4>
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Track performance, get AI recommendations, and grow.</p>
                <div className="h-1 bg-gradient-to-r from-[#00bbe4] to-transparent w-full opacity-30" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="about" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <span className="text-[#f1bca6] font-bold tracking-widest uppercase text-sm">
                {locale === 'th' ? 'สองทศวรรษแห่งความเป็นเลิศ' : 'Two Decades of Excellence'}
              </span>
              <h2 className="text-5xl md:text-7xl font-playfair text-neutral-100 leading-tight">
                {t('about.story.title')}
              </h2>
              <div className="space-y-6 text-[#bcc9ce] text-lg leading-relaxed max-w-2xl">
                <p>From DJ agency to venue experience platform — two decades of understanding what makes a venue come alive.</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
              </div>
              <div className="flex flex-wrap gap-8 sm:gap-12 pt-8">
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">20+</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'ปีประสบการณ์' : 'Years Exp.'}
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

        {/* Pricing Preview Section */}
        <section className="py-32 bg-[#131313] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mb-6">Tailored for Every Scale</h2>
              <p className="text-[#bcc9ce]">Simple pricing to help you grow from a single bar to a global hotel group.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free */}
              <div className="glass p-8 rounded-xl border border-white/5 hover:border-[#3d494e]/40 transition-all flex flex-col">
                <span className="text-sm font-semibold tracking-widest text-[#e5e2e1]/40 uppercase mb-4">Discovery</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Free</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$0<span className="text-sm font-inter text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Browse &amp; book DJs
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Basic scheduling
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Feedback system
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 border border-[#869398]/20 font-bold text-[#e5e2e1] hover:bg-[#2a2a2a] transition-all rounded-lg text-center block">
                  Get Started
                </a>
              </div>

              {/* Starter — Most Popular */}
              <div className="glass p-8 rounded-xl border-2 border-[#4fd6ff]/20 bg-[#1c1b1b] relative flex flex-col scale-105 z-10 shadow-2xl">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#4fd6ff] text-[#003543] px-4 py-1 text-[10px] font-bold tracking-widest uppercase rounded">Most Popular</div>
                <span className="text-sm font-semibold tracking-widest text-[#4fd6ff] uppercase mb-4">Professional</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Starter</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$25<span className="text-sm font-inter text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Full scheduling &amp; analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Marketing templates
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    15 AI credits/mo
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <svg className="w-4 h-4 text-[#4fd6ff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Priority partner support
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 bg-[#4fd6ff] text-[#003543] font-bold rounded-lg hover:bg-[#00bbe4] transition-all text-center block">
                  Start 14-Day Trial
                </a>
              </div>

              {/* Pro */}
              <div className="glass p-8 rounded-xl border border-white/5 hover:border-[#3d494e]/40 transition-all flex flex-col">
                <span className="text-sm font-semibold tracking-widest text-[#f1bca6] uppercase mb-4">Enterprise Hub</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Pro</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$49<span className="text-sm font-inter text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#f1bca6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Everything in Starter
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#f1bca6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    50 AI credits/mo
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#f1bca6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <svg className="w-4 h-4 text-[#f1bca6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Partner directory &amp; API access
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 border border-[#869398]/20 font-bold text-[#e5e2e1] hover:bg-[#2a2a2a] transition-all rounded-lg text-center block">
                  Contact Sales
                </a>
              </div>
            </div>

            <p className="text-center mt-12 text-[#e5e2e1]/40 text-sm">Enterprise pricing available for hotel groups — contact us.</p>
          </div>
        </section>

        {/* For Hotel Groups CTA Section */}
        <section className="py-32 bg-[#131313]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1c1b1b] rounded-3xl p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mb-8">
                  Managing entertainment across multiple properties?
                </h2>
                <p className="text-[#bcc9ce] text-lg leading-relaxed mb-10">
                  BrightEars gives you one dashboard for all your venues. Pre-vetted talent, automated scheduling, consolidated billing, and real-time analytics.
                </p>
                <a
                  href="#contact"
                  className="inline-block px-10 py-5 bg-[#f1bca6] text-[#492819] font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Book a Demo
                </a>
              </div>

              {/* Dashboard mockup */}
              <div className="relative z-10 w-full md:w-1/3">
                <div className="aspect-square bg-[#0e0e0e] rounded-2xl border border-[#3d494e]/20 p-8 shadow-2xl rotate-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-widest text-[#4fd6ff] uppercase">Regional Stats</span>
                    <span className="text-[#e5e2e1]/20 text-lg">...</span>
                  </div>
                  <div className="space-y-6">
                    <div className="h-3 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4fd6ff] w-3/4" />
                    </div>
                    <div className="h-3 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f1bca6] w-1/2" />
                    </div>
                    <div className="h-3 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00bbe4] w-5/6" />
                    </div>
                  </div>
                  <div className="text-3xl font-playfair font-bold text-[#e5e2e1]">
                    94% <span className="text-xs font-inter text-green-500 font-normal">Efficiency gain</span>
                  </div>
                </div>
              </div>

              {/* Decorative blur */}
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#4fd6ff]/10 rounded-full blur-[100px]" />
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
                  <span className="text-[#e5e2e1]">Bangkok, Phuket, Koh Samui &amp; Pattaya</span>
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
