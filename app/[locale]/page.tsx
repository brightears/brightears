import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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

        {/* Social Proof Bar — from Stitch */}
        <section className="bg-[#0e0e0e] border-y border-[#3d494e]/10 py-12">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
              {[
                { name: 'Marriott', src: '/images/clients/marriott.svg', width: 96, height: 48 },
                { name: 'Hilton', src: '/images/clients/hilton.png', width: 96, height: 48 },
                { name: 'Centara', src: '/images/clients/centara.png', width: 120, height: 48 },
                { name: 'Accor', src: '/images/clients/accor.png', width: 96, height: 48 },
              ].map((client) => (
                <div key={client.name} className="flex items-center justify-center h-24">
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className="h-12 w-auto opacity-50 hover:opacity-70 transition-all duration-300"
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

        {/* Platform Modules Bento Grid — from Stitch */}
        <section id="platform" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="container mx-auto px-8 md:px-16">
            <div className="mb-16">
              <span className="text-[#f1bca6] text-sm font-semibold tracking-widest uppercase">The Ecosystem</span>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mt-4">
                Modular Intelligence for<br />Hospitality Groups.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              {/* Large Card — Entertainment Management */}
              <div className="md:col-span-2 md:row-span-1 glass p-10 rounded-xl relative overflow-hidden group hover:bg-[#2a2a2a] transition-all">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">album</span>
                  <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Entertainment Management</h3>
                  <p className="text-[#bcc9ce] max-w-md">DJs, musicians, and background music. Scheduled, managed, and quality-controlled across all zones.</p>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity">
                  <Image
                    src="/images/hero-dj.jpg"
                    alt="DJ controller"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </div>

              {/* Small Card — Marketing Engine */}
              <div className="glass p-10 rounded-xl hover:bg-[#2a2a2a] transition-all border border-[#3d494e]/10">
                <span className="material-symbols-outlined text-[#f1bca6] text-4xl mb-6">photo_camera</span>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Marketing Engine</h3>
                <p className="text-[#bcc9ce] text-sm">Auto-generate Instagram, TikTok, and event posters from your bookings instantly.</p>
              </div>

              {/* Small Card — Partner Ecosystem */}
              <div className="glass p-10 rounded-xl hover:bg-[#2a2a2a] transition-all border border-[#3d494e]/10">
                <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">handshake</span>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Partner Ecosystem</h3>
                <p className="text-[#bcc9ce] text-sm">Audio, lighting, scent, and AV partners in one unified management hub.</p>
              </div>

              {/* Large Card — AI Features */}
              <div className="md:col-span-2 glass p-10 rounded-xl relative overflow-hidden group hover:bg-[#2a2a2a] transition-all">
                <div className="relative z-10 grid md:grid-cols-2 gap-8 h-full">
                  <div>
                    <span className="material-symbols-outlined text-[#f1bca6] text-4xl mb-6">auto_awesome</span>
                    <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">AI Features</h3>
                    <p className="text-[#bcc9ce]">Smart DJ matching, seasonal content generation, and peak-hour energy recommendations powered by proprietary venue data.</p>
                  </div>
                  <div className="flex flex-col justify-end space-y-4">
                    <div className="p-4 bg-[#353534] rounded flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#4fd6ff] animate-pulse rounded-full" />
                      <span className="text-xs uppercase tracking-tighter text-[#e5e2e1]/70">AI: Optimal BPM detected for 11:00 PM</span>
                    </div>
                    <div className="p-4 bg-[#353534] rounded flex items-center gap-4">
                      <div className="w-2 h-2 bg-[#f1bca6] rounded-full" />
                      <span className="text-xs uppercase tracking-tighter text-[#e5e2e1]/70">Event Poster Draft: Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Card — Analytics */}
              <div className="glass p-10 rounded-xl hover:bg-[#2a2a2a] transition-all border border-[#3d494e]/10">
                <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">bar_chart</span>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">Analytics</h3>
                <p className="text-[#bcc9ce] text-sm">Entertainment spend, performer ratings, and ROI dashboards for group management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — from Stitch */}
        <section className="py-32 bg-[#1c1b1b]">
          <div className="container mx-auto px-8 md:px-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24">
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
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Set up multiple properties, define brand standards, and invite your global venue teams to the ecosystem.</p>
                <div className="h-1 bg-gradient-to-r from-[#4fd6ff] to-transparent w-full opacity-30" />
              </div>
              <div className="relative">
                <div className="text-[120px] font-playfair font-extrabold text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">02</div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-6 mt-4">Schedule &amp; Create</h4>
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Book top-tier DJs, auto-generate localized marketing assets, and manage third-party partners in real-time.</p>
                <div className="h-1 bg-gradient-to-r from-[#f1bca6] to-transparent w-full opacity-30" />
              </div>
              <div className="relative">
                <div className="text-[120px] font-playfair font-extrabold text-white/5 absolute -top-16 -left-4 pointer-events-none select-none">03</div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-6 mt-4">Analyze &amp; Optimize</h4>
                <p className="text-[#bcc9ce] leading-relaxed mb-8">Track engagement metrics across your portfolio, receive AI performance reports, and scale what works.</p>
                <div className="h-1 bg-gradient-to-r from-[#00bbe4] to-transparent w-full opacity-30" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story — from Stitch Homepage v2 */}
        <section id="about" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <span className="text-[#f1bca6] font-bold tracking-widest uppercase text-sm">
                {locale === 'th' ? 'สองทศวรรษแห่งความเป็นเลิศ' : 'Two Decades of Excellence'}
              </span>
              <h2 className="text-5xl md:text-7xl font-playfair text-neutral-100 leading-tight">
                {t('about.story.title')}
              </h2>
              <div className="space-y-6 text-[#bcc9ce] text-lg leading-relaxed max-w-2xl">
                <p>Founded in 2007, Bright Ears has stood at the intersection of hospitality and entertainment for over 20 years. We don&apos;t just book talent; we engineer atmospheres.</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
              </div>
              <div className="flex gap-12 pt-8">
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">20+</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'ปีประสบการณ์' : 'Years Exp.'}
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">27</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'ศิลปิน' : 'Active Artists'}
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-playfair text-[#4fd6ff] mb-1">6</div>
                  <div className="text-xs uppercase tracking-widest text-[#f1bca6]">
                    {locale === 'th' ? 'สถานที่พรีเมียม' : 'Premium Venues'}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-[0px_40px_80px_rgba(0,0,0,0.5)]">
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

        {/* Pricing Preview — from Stitch */}
        <section className="py-32 bg-[#131313] overflow-hidden">
          <div className="container mx-auto px-8 md:px-16">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mb-6">Tailored for Every Scale</h2>
              <p className="text-[#bcc9ce]">Simple pricing to help you grow from a single bar to a global hotel group.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free */}
              <div className="p-8 rounded-xl border border-[#3d494e]/10 hover:border-[#3d494e]/40 transition-all flex flex-col">
                <span className="text-sm font-semibold tracking-widest text-[#e5e2e1]/40 uppercase mb-4">Discovery</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Free</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$0<span className="text-sm text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Single Venue Property
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Basic Scheduling Tools
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Partner Directory Access
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 border border-[#869398]/20 font-bold text-[#e5e2e1] hover:bg-[#2a2a2a] transition-all text-center block rounded-lg">
                  Get Started
                </a>
              </div>

              {/* Starter — Most Popular */}
              <div className="p-8 rounded-xl border-2 border-[#4fd6ff]/20 bg-[#1c1b1b] relative flex flex-col scale-105 z-10 shadow-2xl">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#4fd6ff] text-[#003543] px-4 py-1 text-[10px] font-bold tracking-widest uppercase rounded">Most Popular</div>
                <span className="text-sm font-semibold tracking-widest text-[#4fd6ff] uppercase mb-4">Professional</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Starter</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$25<span className="text-sm text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Up to 3 Properties
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    AI Marketing Engine
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Basic Performance Analytics
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-sm">check</span>
                    Priority Partner Support
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 bg-[#4fd6ff] text-[#003543] font-bold rounded hover:bg-[#00bbe4] transition-all text-center block">
                  Start 14-Day Trial
                </a>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-xl border border-[#3d494e]/10 hover:border-[#3d494e]/40 transition-all flex flex-col">
                <span className="text-sm font-semibold tracking-widest text-[#f1bca6] uppercase mb-4">Enterprise Hub</span>
                <h3 className="text-3xl font-playfair font-bold text-neutral-100 mb-2">Pro</h3>
                <div className="text-4xl font-playfair font-bold text-[#e5e2e1] mb-8">$49<span className="text-sm text-[#e5e2e1]/40">/month</span></div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#f1bca6] text-sm">check</span>
                    Unlimited Properties
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#f1bca6] text-sm">check</span>
                    Advanced AI Forecasting
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#f1bca6] text-sm">check</span>
                    API Access &amp; Custom Tools
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#e5e2e1]/70">
                    <span className="material-symbols-outlined text-[#f1bca6] text-sm">check</span>
                    White-label Marketing
                  </li>
                </ul>
                <a href="#contact" className="w-full py-4 border border-[#869398]/20 font-bold text-[#e5e2e1] hover:bg-[#2a2a2a] transition-all text-center block rounded-lg">
                  Contact Sales
                </a>
              </div>
            </div>

            <p className="text-center mt-12 text-[#e5e2e1]/40 text-sm">Custom Enterprise pricing available for global hotel groups and franchises.</p>
          </div>
        </section>

        {/* Group CTA — from Stitch */}
        <section className="py-32 bg-[#131313]">
          <div className="container mx-auto px-8 md:px-16">
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1c1b1b] rounded-3xl p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-100 mb-8">
                  Managing entertainment across multiple properties?
                </h2>
                <p className="text-[#bcc9ce] text-lg leading-relaxed mb-10">
                  See how BrightEars gives you one dashboard for all your venues. Centralize billing, talent booking, and brand compliance in seconds.
                </p>
                <a
                  href="#contact"
                  className="inline-block px-10 py-5 bg-[#f1bca6] text-[#492819] font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  Book a Demo
                </a>
              </div>

              {/* Dashboard mockup — from Stitch */}
              <div className="relative z-10 w-full md:w-1/3">
                <div className="aspect-square bg-[#0e0e0e] rounded-2xl border border-[#3d494e]/20 p-8 shadow-2xl rotate-3 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-widest text-[#4fd6ff] uppercase">Regional Stats</span>
                    <span className="material-symbols-outlined text-[#e5e2e1]/20">more_horiz</span>
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
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl md:text-7xl font-playfair text-neutral-100 mb-8">
                {t('landing.contact.title')}
              </h2>
              <p className="text-[#bcc9ce] text-lg mb-12 max-w-md">
                {t('landing.contact.subtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff]">mail</span>
                  <span className="text-[#e5e2e1]">info@brightears.io</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff]">location_on</span>
                  <span className="text-[#e5e2e1]">Bangkok, Phuket, Koh Samui &amp; Pattaya</span>
                </div>
              </div>

              {/* LINE Contact */}
              <div className="mt-10">
                <p className="text-[#bcc9ce] mb-4">
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
