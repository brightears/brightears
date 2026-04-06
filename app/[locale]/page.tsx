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
      <main className="min-h-screen bg-[#131313] text-[#e5e2e1]">

        {/* SECTION 1: HERO */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-dj.jpg"
              alt="Luxurious dimly lit rooftop lounge at night with atmospheric blue lighting and city skyline in background"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest uppercase bg-[#f0bba5]/20 text-[#f0bba5] rounded-full">
                TRUSTED BY BANGKOK&apos;S LEADING VENUES
              </span>
              <h1 className="text-7xl md:text-8xl font-playfair font-bold tracking-tighter text-[#e5e2e1] mb-8 leading-[0.9]">
                Your venue&apos;s <br />entertainment. <br /><span className="text-[#4fd6ff] text-glow">Handled.</span>
              </h1>
              <p className="text-lg text-[#bcc8ce] font-light max-w-xl mb-12 leading-relaxed">
                The platform where bars, restaurants, and hotels schedule DJs, collect real-time feedback, and fill every slot — without the WhatsApp chaos.
              </p>
              <div className="flex flex-wrap gap-6">
                <a
                  href="#contact"
                  className="bg-gradient-to-r from-[#4fd6ff] to-[#00bbe4] text-[#003543] font-bold px-10 py-5 rounded-md tracking-tight hover:brightness-110 transition-all shadow-lg shadow-[#4fd6ff]/20"
                >
                  Book a Free Demo
                </a>
                <a
                  href="#platform"
                  className="glass-card text-[#e5e2e1] font-medium px-10 py-5 rounded-md flex items-center gap-3 border-[#3d494e]/30 hover:bg-[#2a2a2a] transition-colors"
                >
                  <span className="material-symbols-outlined text-[#4fd6ff]">play_circle</span>
                  Watch 2-min Tour
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SOCIAL PROOF */}
        <section className="bg-[#1c1b1b] py-24 relative z-20">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex flex-wrap justify-between items-center gap-12 opacity-50 mb-20 grayscale transition-all">
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">NOBU</span>
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">LE DU KAAN</span>
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">CRU</span>
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">MARRIOTT</span>
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">HILTON</span>
              <span className="text-2xl font-bold tracking-tighter text-[#e5e2e1] hover:grayscale-0 cursor-default transition-all">CENTARA</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left border-t border-[#3d494e]/10 pt-16">
              <div>
                <div className="text-5xl font-playfair font-bold text-[#4fd6ff] mb-2">6</div>
                <div className="text-xs tracking-[0.3em] font-semibold text-[#bcc8ce] uppercase">Venues</div>
              </div>
              <div>
                <div className="text-5xl font-playfair font-bold text-[#4fd6ff] mb-2">28</div>
                <div className="text-xs tracking-[0.3em] font-semibold text-[#bcc8ce] uppercase">DJs</div>
              </div>
              <div>
                <div className="text-5xl font-playfair font-bold text-[#4fd6ff] mb-2">1000+</div>
                <div className="text-xs tracking-[0.3em] font-semibold text-[#bcc8ce] uppercase">Nights</div>
              </div>
              <div>
                <div className="text-5xl font-playfair font-bold text-[#4fd6ff] mb-2">4.9★</div>
                <div className="text-xs tracking-[0.3em] font-semibold text-[#bcc8ce] uppercase">Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE PROBLEM */}
        <section className="py-32 bg-[#131313]">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="max-w-4xl mb-24">
              <h2 className="text-5xl md:text-6xl font-playfair font-bold leading-tight mb-6">
                Your entertainment runs on spreadsheets, WhatsApp, and hope.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-10 bg-[#1c1b1b] rounded-2xl group hover:bg-[#2a2a2a] transition-all">
                <div className="w-12 h-12 flex items-center justify-center bg-[#93000a]/20 text-[#ffb4ab] mb-8 rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">No backup plan</h3>
                <p className="text-[#bcc8ce] leading-relaxed">Last-minute cancellations lead to silent rooms. Scrambling on WhatsApp group chats is not a strategy.</p>
              </div>
              <div className="p-10 bg-[#1c1b1b] rounded-2xl group hover:bg-[#2a2a2a] transition-all">
                <div className="w-12 h-12 flex items-center justify-center bg-[#93000a]/20 text-[#ffb4ab] mb-8 rounded-lg">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Zero feedback</h3>
                <p className="text-[#bcc8ce] leading-relaxed">Managers&apos; opinions vanish. You don&apos;t know who performed well or who arrived late until it&apos;s too late.</p>
              </div>
              <div className="p-10 bg-[#1c1b1b] rounded-2xl group hover:bg-[#2a2a2a] transition-all">
                <div className="w-12 h-12 flex items-center justify-center bg-[#93000a]/20 text-[#ffb4ab] mb-8 rounded-lg">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">Marketing afterthought</h3>
                <p className="text-[#bcc8ce] leading-relaxed">Promos happen hours before the event, if at all. Missed opportunities for table bookings and coverage.</p>
              </div>
            </div>
            <div className="mt-20 text-center flex flex-col items-center">
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#ffdbcd] to-transparent mb-6" />
              <p className="text-[#ffdbcd] text-xl italic font-playfair">There&apos;s a better way.</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE PLATFORM (Bento Grid) */}
        <section id="platform" className="py-32 bg-[#0e0e0e] scroll-mt-20">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="mb-16">
              <span className="text-[#ffdbcd] uppercase tracking-widest text-sm font-bold">THE PLATFORM</span>
              <h2 className="text-5xl md:text-6xl font-playfair font-bold mt-4">Everything your venue needs. <br />One login.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 auto-rows-[320px]">
              {/* Large Card 1 */}
              <div className="md:col-span-2 glass-card rounded-2xl p-10 relative overflow-hidden group hover:shadow-[0px_0px_50px_rgba(79,214,255,0.1)] transition-all">
                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-3xl font-bold mb-4">Every slot filled. <br />Every night.</h3>
                  <p className="text-[#bcc8ce] max-w-sm">Schedule DJs across the entire month. Integrated feedback loop ensures managers grade every performance instantly.</p>
                  <div className="mt-auto flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-[#131313] bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#4fd6ff]">AS</div>
                      <div className="w-10 h-10 rounded-full border-2 border-[#131313] bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#f0bba5]">MK</div>
                      <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border-2 border-[#131313] flex items-center justify-center text-xs text-[#4fd6ff]">+12</div>
                    </div>
                    <span className="text-xs font-semibold text-[#bcc8ce]">4 slots booked today</span>
                  </div>
                </div>
                <Image
                  src="/images/hero-dj.jpg"
                  alt="Modern high-tech audio mixing console with glowing blue lights"
                  fill
                  className="object-cover opacity-20"
                  sizes="66vw"
                  style={{ maskImage: 'linear-gradient(to left, black, transparent)' }}
                />
              </div>

              {/* Small Card 1 */}
              <div className="glass-card rounded-2xl p-10 flex flex-col justify-between group hover:shadow-[0px_0px_50px_rgba(79,214,255,0.1)] transition-all">
                <div className="w-10 h-10 bg-[#4fd6ff]/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4fd6ff]">share</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">DJ booked → post ready.</h3>
                  <p className="text-[#bcc8ce] text-sm">Auto-generated social media kits for every artist slot.</p>
                </div>
              </div>

              {/* Small Card 2 */}
              <div className="glass-card rounded-2xl p-10 flex flex-col justify-between group hover:shadow-[0px_0px_50px_rgba(79,214,255,0.1)] transition-all">
                <div className="w-10 h-10 bg-[#4fd6ff]/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4fd6ff]">hub</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">All your vendors. One hub.</h3>
                  <p className="text-[#bcc8ce] text-sm">Coordinate AV, lighting, and scent partners alongside artists.</p>
                </div>
              </div>

              {/* Large Card 2 */}
              <div className="md:col-span-2 glass-card rounded-2xl p-10 relative overflow-hidden group hover:shadow-[0px_0px_50px_rgba(79,214,255,0.1)] transition-all">
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-3xl font-bold mb-4">Know what works. <br />Repeat it.</h3>
                  <p className="text-[#bcc8ce] max-w-sm">AI-driven insights on performer ratings, cover drivers, and drink spend correlations.</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-[#2a2a2a]/60 p-4 rounded-xl border border-[#3d494e]/10">
                      <div className="text-xs text-[#bcc8ce] mb-1">Efficiency Gain</div>
                      <div className="text-2xl font-bold text-[#4fd6ff]">+24%</div>
                    </div>
                    <div className="bg-[#2a2a2a]/60 p-4 rounded-xl border border-[#3d494e]/10">
                      <div className="text-xs text-[#bcc8ce] mb-1">Guest Loyalty</div>
                      <div className="text-2xl font-bold text-[#4fd6ff]">92%</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#4fd6ff]/10 blur-[80px] rounded-full" />
              </div>

              {/* Small Card 3 */}
              <div className="glass-card rounded-2xl p-10 flex flex-col justify-between group hover:shadow-[0px_0px_50px_rgba(79,214,255,0.1)] transition-all">
                <div className="w-10 h-10 bg-[#4fd6ff]/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4fd6ff]">dashboard</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">One dashboard. Every property.</h3>
                  <p className="text-[#bcc8ce] text-sm">Marketing ROI and entertainment spend across your whole portfolio.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: HOW IT WORKS */}
        <section className="py-32 bg-[#131313]">
          <div className="max-w-[1440px] mx-auto px-12 text-center">
            <span className="text-[#ffdbcd] uppercase tracking-widest text-sm font-bold">THE PROCESS</span>
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mt-4 mb-24">Live in 15 minutes.</h2>
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3d494e] to-transparent -translate-y-1/2 hidden md:block" />
              <div className="grid md:grid-cols-3 gap-20 relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-[#4fd6ff] mb-8 relative">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-3xl">electric_bolt</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4fd6ff] rounded-full text-[#003543] text-[10px] font-bold flex items-center justify-center">1</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Connect</h3>
                  <p className="text-[#bcc8ce]">Link your existing venues and upload your preferred vendor lists.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-[#4fd6ff] mb-8 relative">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-3xl">event_available</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4fd6ff] rounded-full text-[#003543] text-[10px] font-bold flex items-center justify-center">2</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Book</h3>
                  <p className="text-[#bcc8ce]">Browse available artists, check ratings, and schedule slots in two clicks.</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-[#4fd6ff] mb-8 relative">
                    <span className="material-symbols-outlined text-[#4fd6ff] text-3xl">query_stats</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#4fd6ff] rounded-full text-[#003543] text-[10px] font-bold flex items-center justify-center">3</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Track</h3>
                  <p className="text-[#bcc8ce]">Monitor live attendance and receive automated feedback logs daily.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: SOCIAL PROOF / RESULTS */}
        <section className="py-32 bg-[#1c1b1b] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-12 grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex gap-16 mb-12">
                <div>
                  <div className="text-4xl font-playfair font-bold text-[#4fd6ff] mb-1">0</div>
                  <div className="text-[10px] tracking-widest text-[#bcc8ce] uppercase font-bold">no-shows</div>
                </div>
                <div>
                  <div className="text-4xl font-playfair font-bold text-[#4fd6ff] mb-1">4.9★</div>
                  <div className="text-[10px] tracking-widest text-[#bcc8ce] uppercase font-bold">avg rating</div>
                </div>
                <div>
                  <div className="text-4xl font-playfair font-bold text-[#4fd6ff] mb-1">168+</div>
                  <div className="text-[10px] tracking-widest text-[#bcc8ce] uppercase font-bold">verified reviews</div>
                </div>
              </div>
              <div className="glass-card p-12 rounded-3xl relative">
                <span className="material-symbols-outlined absolute top-8 left-8 text-6xl text-[#4fd6ff]/10 select-none">format_quote</span>
                <p className="text-2xl font-playfair italic mb-8 relative z-10 leading-relaxed">
                  &ldquo;We used to spend hours every Monday just coordinating the coming weekend. Since BrightEars, I haven&apos;t had to think about our DJ lineup once. We haven&apos;t had an empty slot in 6 months.&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2a2a2a] flex items-center justify-center text-sm font-bold text-[#f0bba5]">
                    AS
                  </div>
                  <div>
                    <div className="font-bold">Ananya S.</div>
                    <div className="text-sm text-[#bcc8ce]">Director of Operations, Bangkok Hospitality Group</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4fd6ff]/5 rounded-full blur-[100px]" />
              <div className="relative z-10 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/images/hero-dj.jpg"
                  alt="Professional DJ performing in a high-end luxury nightclub"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FOR VENUE GROUPS */}
        <section className="py-32 px-12">
          <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row gap-12 overflow-hidden items-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4fd6ff]/5 rounded-full blur-[100px]" />
            <div className="md:w-3/5 relative z-10">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">Managing entertainment across <br />multiple venues?</h2>
              <p className="text-[#bcc8ce] text-lg mb-10 max-w-xl">
                One dashboard for all your properties. Centralized billing, shared DJ roster, brand standards enforced across every location. Scale your guest experience without scaling your overhead.
              </p>
              <a
                href="#contact"
                className="bg-[#f0bba5] text-[#704938] font-bold px-10 py-5 rounded-md hover:brightness-105 transition-all inline-flex items-center gap-3"
              >
                Book a Demo
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            <div className="md:w-2/5 relative">
              <div className="relative transform rotate-6 scale-110 shadow-2xl rounded-2xl overflow-hidden glass-card">
                <div className="bg-[#1c1b1b] p-6 border-b border-[#3d494e]/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                    <div className="w-2 h-2 rounded-full bg-[#ffdbcd]" />
                    <div className="w-2 h-2 rounded-full bg-[#4fd6ff]" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#bcc8ce]">Global Dashboard</div>
                </div>
                <div className="p-8">
                  <div className="text-4xl font-playfair font-bold text-[#4fd6ff] mb-2">94%</div>
                  <div className="text-xs text-[#bcc8ce] uppercase tracking-widest mb-6">Efficiency Gain</div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-[#353534] rounded-full overflow-hidden">
                      <div className="h-full w-[94%] bg-[#4fd6ff]" />
                    </div>
                    <div className="h-2 w-full bg-[#353534] rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-[#4fd6ff]/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: CONTACT */}
        <section id="contact" className="py-32 bg-[#131313] scroll-mt-20">
          <div className="max-w-[1440px] mx-auto px-12 grid md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-5xl font-playfair font-bold mb-12">
                {t('landing.contact.title')}
              </h2>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#4fd6ff]">mail</span>
                  </div>
                  <div>
                    <div className="text-sm text-[#bcc8ce]">Email us at</div>
                    <div className="text-xl font-medium">info@brightears.io</div>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-[#2a2a2a] rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#4fd6ff]">location_on</span>
                  </div>
                  <div>
                    <div className="text-sm text-[#bcc8ce]">Our Offices</div>
                    <div className="text-xl font-medium">Bangkok, Phuket, Koh Samui, Pattaya</div>
                  </div>
                </div>
              </div>

              {/* LINE Contact */}
              <div className="mt-10">
                <p className="text-[#bcc8ce] mb-4">
                  {t('landing.contact.linePrompt')}
                </p>
                <LineContactButton
                  variant="primary"
                  message={t('landing.contact.lineMessage')}
                  className="px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl"
                />
              </div>
            </div>

            <div className="glass-card p-10 rounded-3xl">
              <VenueInquiryForm darkMode />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#1c1b1b] w-full pt-20 pb-10">
          <div className="grid grid-cols-4 gap-12 px-12 max-w-[1440px] mx-auto mb-20">
            <div className="col-span-4 md:col-span-1">
              <span className="text-xl font-playfair font-bold text-[#e5e2e1] mb-4 block">BrightEars</span>
              <p className="text-[#bcc8ce] text-sm leading-relaxed">Defining the next generation of hospitality through sonic curation and operational excellence.</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-playfair text-xl text-[#e5e2e1] mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#platform">Entertainment</a></li>
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#platform">For Venues</a></li>
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#contact">Pricing</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-playfair text-xl text-[#e5e2e1] mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#about">About</a></li>
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-span-4 md:col-span-1">
              <h4 className="font-playfair text-xl text-[#e5e2e1] mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#">Privacy</a></li>
                <li><a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff] transition-colors text-sm" href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="px-12 max-w-[1440px] mx-auto border-t border-[#3d494e]/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[#e5e2e1]/60 text-sm">&copy; 2024 BrightEars. All rights reserved. Built for the modern venue.</div>
            <div className="flex gap-6">
              <a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff]" href="#"><span className="material-symbols-outlined text-lg">public</span></a>
              <a className="text-[#e5e2e1]/60 hover:text-[#4fd6ff]" href="#"><span className="material-symbols-outlined text-lg">share</span></a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
