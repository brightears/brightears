import { Metadata } from 'next';
import Image from 'next/image';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'บริการจัดการความบันเทิงแบบครบวงจร | Bright Ears Bangkok'
    : 'Managed Entertainment Services | Bright Ears Bangkok';

  const description = locale === 'th'
    ? 'การจัดการความบันเทิงแบบครบวงจรสำหรับโรงแรมและสถานที่ระดับพรีเมียม จัดตารางรายคืน ควบคุมคุณภาพ มีการันตีสำรอง คอนเทนต์ AI ใบแจ้งหนี้ใบเดียว ไม่ปวดหัว'
    : 'Full-cycle entertainment management for hotels and premium venues. Nightly scheduling, quality control, backup guarantees, AI promo content. One invoice, zero headaches.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/services/managed`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/services/managed`,
      languages: {
        'en': '/en/services/managed',
        'th': '/th/services/managed',
        'x-default': '/en/services/managed',
      }
    },
  };
}

export default function ManagedPage() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden flex items-center px-8 md:px-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/split-venue-new.png" alt="Luxury venue interior" fill className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="uppercase tracking-[0.2em] text-[#f0bba5] text-sm mb-4 block font-bold">Services</span>
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-tight font-bold" style={{ fontFamily: 'Noto Serif, serif' }}>
            Managed entertainment.
          </h1>
          <p className="text-xl text-[#bcc8ce] max-w-xl leading-relaxed">
            Your venue&apos;s nightly entertainment, on autopilot. We handle everything from booking to last call. One invoice. Zero headaches.
          </p>
        </div>
      </section>

      {/* What We Manage */}
      <section className="py-32 px-8 md:px-20 bg-[#1c1b1b]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>What we manage.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: 'calendar_month', t: 'Nightly scheduling', d: 'Your entertainment calendar, planned weeks in advance. Every night covered, every slot filled.' },
              { icon: 'tune', t: 'Artist curation', d: 'Genre-matched to your venue\'s atmosphere and clientele. We know which DJ fits your Friday vs your Tuesday.' },
              { icon: 'analytics', t: 'Quality control', d: 'Performance ratings after every single set. Data drives who plays next week. Quality improves every night.' },
              { icon: 'shield', t: 'Backup guarantee', d: 'DJ cancels at 8pm? We have a qualified replacement at your venue within 2 hours. Every time.' },
              { icon: 'receipt_long', t: 'Monthly reporting', d: 'One invoice, full transparency. Shift counts, ratings summary, attendance trends, recommendations.' },
              { icon: 'auto_awesome', t: 'AI promo content', d: 'Professional social media content for your venue — posters, IG posts, stories — generated weekly by our AI studio.' },
            ].map((f) => (
              <div key={f.t} className="bg-[#131313] p-8 hover:bg-[#2a2a2a] transition-colors">
                <span className="material-symbols-outlined text-[#f0bba5] text-3xl mb-6 block">{f.icon}</span>
                <h3 className="font-bold text-lg mb-3">{f.t}</h3>
                <p className="text-[#bcc8ce] text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Platform */}
      <section className="py-32 px-8 md:px-20 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">The Platform</span>
            <h2 className="text-5xl font-black mb-8 leading-tight" style={{ fontFamily: 'Noto Serif, serif' }}>
              Your dashboard. <br /><span className="italic text-[#bcc8ce]">Real-time visibility.</span>
            </h2>
            <p className="text-[#bcc8ce] leading-relaxed mb-8">
              Every managed client gets access to our platform. See tonight&apos;s lineup, rate performances, view analytics — all in one place. No more WhatsApp chains. No more spreadsheets.
            </p>
            <ul className="space-y-4">
              {[
                'See who\'s playing tonight across all your venues',
                'Rate performers after every set — your feedback shapes the roster',
                'Monthly analytics: peak hours, genre performance, crowd trends',
                'AI-generated promo content delivered to your inbox weekly',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#bcc8ce]">
                  <span className="text-[#4fd6ff] mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Dashboard mockup */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#4fd6ff]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative bg-[#131313] p-1 border border-[#3d494d]/10 shadow-2xl">
              <div className="bg-[#2a2a2a] aspect-video overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8 border-b border-[#3d494d]/20 pb-4">
                  <div className="text-[10px] font-bold tracking-widest uppercase">Venue Dashboard / Your Venue</div>
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'This Week', value: '7 Sets' },
                    { label: 'Avg Rating', value: '4.9', color: 'text-[#4fd6ff]' },
                    { label: 'Active DJ', value: 'Tonight' },
                    { label: 'Feedback', value: '98%', color: 'text-[#f0bba5]' },
                  ].map((s) => (
                    <div key={s.label} className="h-16 bg-[#0e0e0e] p-2 flex flex-col justify-between">
                      <span className="text-[8px] opacity-40 uppercase">{s.label}</span>
                      <span className={`text-lg font-bold ${s.color || ''}`} style={{ fontFamily: 'Noto Serif, serif' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-[#0e0e0e] w-full flex items-center px-4 gap-4">
                      <div className={`h-2 w-2 rounded-full ${i === 1 ? 'bg-[#4fd6ff]/40' : i === 2 ? 'bg-[#f0bba5]/40' : 'bg-[#ffdeae]/40'}`} />
                      <div className="h-1 w-24 bg-[#3d494d]/20" />
                      <div className="ml-auto h-1 w-12 bg-[#4fd6ff]/20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Currently Managing */}
      <section className="py-24 px-8 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-8">Currently managing entertainment at</p>
          <div className="flex justify-center flex-wrap gap-8 md:gap-16 items-center mb-8">
            {[
              { src: '/images/venues/nobu.png', alt: 'NOBU', w: 130, h: 35 },
              { src: '/images/venues/ledukaan.svg', alt: 'Le Du Kaan', w: 70, h: 70 },
              { src: '/images/clients/centara.png', alt: 'Centara Hotels', w: 120, h: 45 },
              { src: '/images/clients/hilton.png', alt: 'Hilton', w: 110, h: 35 },
              { src: '/images/clients/marriott.svg', alt: 'Marriott', w: 130, h: 45 },
            ].map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="opacity-60 hover:opacity-100 transition-opacity brightness-200 grayscale"
              />
            ))}
          </div>
          <p className="text-[#bcc8ce] text-sm">Every night of the week in Bangkok.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-8 md:px-20 bg-[#1c1b1b]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>Pricing.</h2>
          <p className="text-[#bcc8ce] text-lg mb-4">
            Custom monthly retainer based on venue size, number of slots, and requirements.
          </p>
          <p className="text-3xl font-bold text-[#f0bba5]" style={{ fontFamily: 'Noto Serif, serif' }}>
            Tailored to your venue.
          </p>
          <p className="text-[#bcc8ce]/60 text-sm mt-4">
            Every venue is different. We&apos;ll propose a package that fits your size, schedule, and entertainment goals. Includes scheduling, curation, quality control, backup guarantees, and monthly reporting.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32 px-8 md:px-20" id="contact">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-24">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Noto Serif, serif' }}>
              Let&apos;s discuss your venue.
            </h2>
            <p className="text-[#bcc8ce] font-light leading-relaxed mb-8">
              Tell us about your venue and entertainment needs. We&apos;ll come back with a tailored proposal within 48 hours.
            </p>
            <p className="text-sm text-[#bcc8ce]/60">info@brightears.io</p>
          </div>
          <div className="flex-1">
            <VenueInquiryForm darkMode />
          </div>
        </div>
      </section>
    </main>
  );
}
