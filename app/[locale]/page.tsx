import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateFAQSchema
} from '@/lib/schemas/structured-data';
import Image from 'next/image';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';
import HashScroller from '@/components/HashScroller';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Bright Ears | แพลตฟอร์ม AI สำหรับศิลปินและสถานที่บันเทิง'
    : 'Bright Ears | AI-Powered Tools for Entertainment Professionals';

  const description = locale === 'th'
    ? 'แพลตฟอร์ม AI สำหรับศิลปินสร้างคอนเทนต์โปรโมท และสถานที่จัดการความบันเทิง ฟรี ไม่มีค่าคอมมิชชั่น'
    : 'AI creative studio for performing artists. Entertainment management platform for venues. Free to use. No commissions.';

  return {
    title,
    description,
    keywords: 'AI, entertainment, artist tools, venue management, promo content, creative platform, DJ, musician, band, performer, Bright Ears',
    openGraph: { title, description, url: `/${locale}`, siteName: 'Bright Ears', locale: locale === 'th' ? 'th_TH' : 'en_US', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/${locale}`, languages: { 'en': '/en', 'th': '/th', 'x-default': '/en' } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  const organizationSchema = generateOrganizationSchema({ locale });
  const localBusinessSchema = generateLocalBusinessSchema({ locale });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [{ name: locale === 'th' ? 'หน้าแรก' : 'Home', url: `https://brightears.io/${locale}` }]
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <HashScroller />

      <main className="min-h-screen bg-[#131313] text-[#e5e2e1]">

        {/* ━━━ HERO — Platform positioning, split design ━━━ */}
        <section className="relative min-h-screen flex items-center pt-20 px-8 md:px-16 overflow-hidden">
          {/* Subtle background gradient — no DJ photo */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#131313] via-[#0a1a20] to-[#131313]" />
            <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-[#4fd6ff]/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-[#f0bba5]/5 rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full glass-card text-[#4fd6ff] text-xs tracking-widest uppercase font-bold mb-8">
                {locale === 'th' ? 'ฟรีตลอดไป · ไม่มีค่าคอมมิชชั่น' : 'Free forever · Zero commissions'}
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-bold tracking-tighter leading-[1.1] mb-8">
                {locale === 'th' ? (
                  <>AI สำหรับ<br />วงการบันเทิง</>
                ) : (
                  <>AI-powered tools for<br /><span className="text-gradient-primary">entertainment professionals.</span></>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-[#bcc8ce] max-w-3xl mx-auto leading-relaxed">
                {locale === 'th'
                  ? 'สตูดิโอสร้างสรรค์ AI สำหรับศิลปิน แพลตฟอร์มจัดการสำหรับสถานที่ มาร์เก็ตเพลสที่ทั้งสองฝ่ายมาเจอกัน'
                  : 'A creative studio for artists. A management platform for venues. A marketplace where both sides meet.'}
              </p>
            </div>

            {/* ━━━ SPLIT CARDS — The two sides ━━━ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Artist side */}
              <a
                href="/sign-up"
                className="group relative p-8 md:p-10 rounded-2xl border border-[#4fd6ff]/20 bg-[#4fd6ff]/5 hover:bg-[#4fd6ff]/10 hover:border-[#4fd6ff]/40 transition-all duration-500"
              >
                <div className="absolute top-6 right-6">
                  <span className="material-symbols-outlined text-[#4fd6ff] text-3xl opacity-40 group-hover:opacity-80 transition-opacity">auto_awesome</span>
                </div>
                <p className="text-xs font-bold text-[#4fd6ff] uppercase tracking-widest mb-4">
                  {locale === 'th' ? 'สำหรับศิลปิน' : 'For Artists'}
                </p>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-4">
                  {locale === 'th' ? 'สตูดิโอสร้างสรรค์ AI ของคุณ' : 'Your AI creative studio'}
                </h2>
                <p className="text-[#bcc8ce] text-sm mb-6">
                  {locale === 'th'
                    ? 'หมดยุคจ่ายดีไซเนอร์ หมดยุคเสียเวลาทำคอนเทนต์ AI ทำแทนคุณ — คุณโฟกัสที่ศิลปะ'
                    : 'Stop paying designers. Stop spending hours on content. The AI does the agency work — you focus on your art.'}
                </p>
                <ul className="space-y-3 text-[#bcc8ce] text-sm mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4fd6ff] mt-0.5">→</span>
                    {locale === 'th' ? 'โปสเตอร์ โพสต์ IG Story EPK — 10 วินาที ไม่ใช่ 10 ชั่วโมง' : 'Posters, IG posts, stories, EPKs — 10 seconds, not 10 hours'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4fd6ff] mt-0.5">→</span>
                    {locale === 'th' ? 'พอร์ตโฟลิโอมืออาชีพ แชร์ลิงก์เดียว' : 'One shareable portfolio link — replaces PDFs and email chains'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4fd6ff] mt-0.5">→</span>
                    {locale === 'th' ? 'ไม่มีเอเจนซี่หัก 20% คุณเก็บเงินเต็มจำนวน' : 'No agent taking 20% — keep 100% of what you earn'}
                  </li>
                </ul>
                <span className="inline-flex items-center gap-2 text-[#4fd6ff] font-bold group-hover:gap-3 transition-all">
                  {locale === 'th' ? 'สร้างโปรไฟล์ฟรี' : 'Create your profile — free'} →
                </span>
              </a>

              {/* Venue side */}
              <a
                href="/sign-up/venue"
                className="group relative p-8 md:p-10 rounded-2xl border border-[#f0bba5]/20 bg-[#f0bba5]/5 hover:bg-[#f0bba5]/10 hover:border-[#f0bba5]/40 transition-all duration-500"
              >
                <div className="absolute top-6 right-6">
                  <span className="material-symbols-outlined text-[#f0bba5] text-3xl opacity-40 group-hover:opacity-80 transition-opacity">dashboard</span>
                </div>
                <p className="text-xs font-bold text-[#f0bba5] uppercase tracking-widest mb-4">
                  {locale === 'th' ? 'สำหรับสถานที่ & เอเจนซี่' : 'For Venues & Agencies'}
                </p>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-4">
                  {locale === 'th' ? 'แพลตฟอร์มจัดการความบันเทิง' : 'Your entertainment platform'}
                </h2>
                <p className="text-[#bcc8ce] text-sm mb-6">
                  {locale === 'th'
                    ? 'หมดยุค spreadsheet หมดยุคตาม LINE ตอน 6 โมงเย็น แพลตฟอร์มจัดการทุกอย่าง — คุณโฟกัสงานอื่น'
                    : 'Stop chasing artists on WhatsApp at 6pm. Stop managing schedules in spreadsheets. The platform handles it — you focus on running your venue.'}
                </p>
                <ul className="space-y-3 text-[#bcc8ce] text-sm mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f0bba5] mt-0.5">→</span>
                    {locale === 'th' ? 'ตารางศิลปิน ฟีดแบ็ก สถิติ — ทุกอย่างที่เดียว' : 'Artist schedules, feedback, analytics — everything in one dashboard'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f0bba5] mt-0.5">→</span>
                    {locale === 'th' ? 'ประกาศหาศิลปิน ได้ใบสมัครทันที' : 'Post what you need, get qualified applications — no agency middleman'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f0bba5] mt-0.5">→</span>
                    {locale === 'th' ? 'ไม่มีค่าคอมมิชชั่น ไม่มีค่าเอเจนซี่ ติดต่อตรง 100%' : 'Zero agency fees, zero commissions — direct contact, always'}
                  </li>
                </ul>
                <span className="inline-flex items-center gap-2 text-[#f0bba5] font-bold group-hover:gap-3 transition-all">
                  {locale === 'th' ? 'ตั้งค่าสถานที่ฟรี' : 'Set up your venue — free'} →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ━━━ AI SHOWCASE — The core product demo ━━━ */}
        <section className="py-32 px-8 md:px-16 bg-[#1c1b1b]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <p className="text-xs tracking-widest text-[#4fd6ff] font-bold uppercase">AI Creative Studio</p>
              <h2 className="text-4xl md:text-6xl font-playfair font-bold tracking-tighter">
                {locale === 'th' ? 'คอนเทนต์มืออาชีพใน 10 วินาที' : 'Professional content in 10 seconds.'}
              </h2>
              <p className="text-lg text-[#bcc8ce] max-w-2xl mx-auto">
                {locale === 'th'
                  ? 'ทุกภาพด้านล่างสร้างจาก AI Studio ของเรา จากข้อความเพียงบรรทัดเดียว ไม่ต้องใช้ Photoshop ไม่ต้องจ้างดีไซเนอร์'
                  : 'Every image below was generated by our AI Studio from a single text prompt. No Photoshop. No designer. This is what you get.'}
              </p>
            </div>

            {/* AI-generated examples — proof the tool works */}
            <div className="relative h-[560px] md:h-[620px] flex items-center justify-center mb-16">
              {[
                {
                  src: '/images/ai-examples/poster-friday-night.png',
                  alt: 'AI-generated event poster',
                  label: 'Event Poster',
                  rotate: 'rotate-[-12deg] -translate-x-48 md:-translate-x-64',
                  z: 'z-10',
                },
                {
                  src: '/images/ai-examples/ig-square-dj-drop.png',
                  alt: 'AI-generated Instagram post',
                  label: 'Instagram Post',
                  rotate: 'rotate-[-4deg] -translate-x-24 md:-translate-x-32',
                  z: 'z-20',
                },
                {
                  src: '/images/ai-examples/story-vertical-jazz.png',
                  alt: 'AI-generated Instagram story',
                  label: 'IG Story',
                  rotate: 'rotate-[6deg] translate-x-24 md:translate-x-32',
                  z: 'z-30',
                },
                {
                  src: '/images/ai-examples/epk-card-dj-nova.png',
                  alt: 'AI-generated press kit card',
                  label: 'Press Kit',
                  rotate: 'rotate-[15deg] translate-x-48 md:translate-x-64',
                  z: 'z-10',
                },
              ].map((card) => (
                <div
                  key={card.src}
                  className={`absolute w-[260px] h-[380px] md:w-[300px] md:h-[440px] bg-[#2a2a2a] rounded-xl ${card.rotate} ${card.z} border border-white/10 shadow-2xl overflow-hidden group hover:scale-105 hover:rotate-0 hover:z-40 transition-all duration-500`}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 glass-card px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#4fd6ff]">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Feature bullets for the AI studio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              {[
                {
                  icon: 'image',
                  title: locale === 'th' ? 'โปสเตอร์ & โพสต์' : 'Posters & Posts',
                  desc: locale === 'th' ? 'IG โพสต์ Story โปสเตอร์ แบนเนอร์ — ทุกรูปแบบ' : 'IG posts, stories, event posters, banners — every format.',
                },
                {
                  icon: 'badge',
                  title: locale === 'th' ? 'EPK & พอร์ตโฟลิโอ' : 'EPKs & Portfolios',
                  desc: locale === 'th' ? 'สร้าง press kit มืออาชีพ แชร์ลิงก์เดียว' : 'Professional press kits you can share with a single link.',
                },
                {
                  icon: 'movie',
                  title: locale === 'th' ? 'วิดีโอ (เร็วๆ นี้)' : 'Video (Coming Soon)',
                  desc: locale === 'th' ? 'TikTok, Reels, โปรโมคลิป — กำลังพัฒนา' : 'TikTok, Reels, promo clips — in development.',
                },
              ].map((f) => (
                <div key={f.title} className="space-y-3">
                  <span className="material-symbols-outlined text-[#4fd6ff] text-4xl">{f.icon}</span>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-[#bcc8ce]">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href={`/${locale}/ai-tools`}
                className="inline-block bg-[#4fd6ff] text-[#005b70] px-12 py-5 font-bold rounded-lg shadow-[0px_20px_40px_rgba(0,187,228,0.08)] hover:scale-105 transition-transform"
              >
                {locale === 'th' ? 'ลองฟรี — 12 ครั้ง/เดือน' : 'Try it free — 12 generations/month'}
              </a>
            </div>
          </div>
        </section>

        {/* ━━━ HOW IT WORKS — Two columns, tools-focused ━━━ */}
        <section id="how-it-works" className="py-32 px-8 md:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tighter">
                {locale === 'th' ? 'ทำงานอย่างไร' : 'How It Works'}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="space-y-12">
                <h3 className="text-sm uppercase tracking-widest text-[#4fd6ff] font-black">
                  {locale === 'th' ? 'สำหรับศิลปิน' : 'For Artists'}
                </h3>
                {[
                  { n: '01', t: locale === 'th' ? 'สร้างโปรไฟล์' : 'Create your profile', d: locale === 'th' ? 'แสดงผลงาน สไตล์ และความเชี่ยวชาญของคุณ' : 'Showcase your work, style, and expertise in a professional portfolio.' },
                  { n: '02', t: locale === 'th' ? 'สร้างคอนเทนต์ด้วย AI' : 'Generate content with AI', d: locale === 'th' ? 'โปสเตอร์ โพสต์ IG วิดีโอ EPK — ทุกอย่างใน 10 วินาที' : 'Posters, IG posts, stories, EPKs — professional promo in seconds.' },
                  { n: '03', t: locale === 'th' ? 'แชร์ & ถูกค้นพบ' : 'Share & get discovered', d: locale === 'th' ? 'โปรไฟล์ของคุณเปิดให้ค้นหาได้ สถานที่และเอเจนซี่ติดต่อคุณโดยตรง' : 'Your profile is discoverable. Venues and agencies contact you directly.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-8">
                    <span className="text-6xl font-playfair font-black text-[#3d494e]/30">{s.n}</span>
                    <div className="space-y-2 pt-4"><h4 className="text-2xl font-bold">{s.t}</h4><p className="text-[#bcc8ce]">{s.d}</p></div>
                  </div>
                ))}
              </div>
              <div className="space-y-12">
                <h3 className="text-sm uppercase tracking-widest text-[#f0bba5] font-black">
                  {locale === 'th' ? 'สำหรับสถานที่ & เอเจนซี่' : 'For Venues & Agencies'}
                </h3>
                {[
                  { n: '01', t: locale === 'th' ? 'ตั้งค่าสถานที่' : 'Set up your venue', d: locale === 'th' ? 'เพิ่มรายละเอียดสถานที่ ตารางเวลา ความต้องการ' : 'Add your venue details, operating hours, and entertainment needs.' },
                  { n: '02', t: locale === 'th' ? 'จัดการความบันเทิง' : 'Manage your entertainment', d: locale === 'th' ? 'จัดตารางศิลปิน ติดตามฟีดแบ็ก ดูสถิติ' : 'Schedule artists, collect feedback, track performance analytics.' },
                  { n: '03', t: locale === 'th' ? 'ค้นหาศิลปินใหม่' : 'Discover new talent', d: locale === 'th' ? 'โพสต์ตำแหน่งว่าง เรียกดูศิลปิน ติดต่อโดยตรง ไม่มีค่าคอมมิชชั่น' : 'Post open positions, browse artists, contact directly. No commissions, ever.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-8">
                    <span className="text-6xl font-playfair font-black text-[#3d494e]/30">{s.n}</span>
                    <div className="space-y-2 pt-4"><h4 className="text-2xl font-bold">{s.t}</h4><p className="text-[#bcc8ce]">{s.d}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ PRICING ━━━ */}
        <section id="pricing" className="py-32 bg-[#1c1b1b] px-8 md:px-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <p className="text-xs tracking-widest text-[#4fd6ff] font-bold mb-4 uppercase">
              {locale === 'th' ? 'ราคา' : 'Pricing'}
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tighter">
              {locale === 'th' ? 'จ่ายเท่าที่ใช้' : 'The platform is free. Pay only for AI.'}
            </h2>
            <p className="text-[#bcc8ce] mt-4 max-w-xl mx-auto">
              {locale === 'th'
                ? 'โปรไฟล์ การจัดการ มาร์เก็ตเพลส — ทั้งหมดฟรี เฉพาะ AI ที่ใช้เครดิต'
                : 'Profiles, management tools, marketplace — all free. Only AI content generation uses credits.'}
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#2a2a2a] rounded-xl flex flex-col items-center text-center space-y-6">
              <p className="font-black uppercase tracking-widest text-xs opacity-50">Free</p>
              <div className="text-4xl font-playfair font-bold">$0</div>
              <ul className="text-sm space-y-3 text-[#bcc8ce]">
                <li>Professional profile + portfolio</li>
                <li>Venue management dashboard</li>
                <li>Marketplace access</li>
                <li><b className="text-white">12 AI generations / month</b></li>
              </ul>
              <a href="/sign-up" className="w-full py-3 rounded-lg border border-[#3d494e] hover:bg-white/5 transition-all mt-auto font-bold text-center block">Get Started</a>
            </div>
            <div className="p-8 bg-[#131313] border-2 border-[#4fd6ff] rounded-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#4fd6ff] text-[#003543] px-4 py-1 text-[10px] font-bold uppercase tracking-widest transform rotate-45 translate-x-10 translate-y-4">Popular</div>
              <p className="font-black uppercase tracking-widest text-xs text-[#4fd6ff]">Credit Packs</p>
              <div className="text-4xl font-playfair font-bold">$5 – $60</div>
              <ul className="text-sm space-y-3 text-[#bcc8ce]">
                <li><b className="text-white">20 credits for $5</b> = 20 images</li>
                <li><b className="text-white">100 credits for $25</b></li>
                <li><b className="text-white">250 credits for $60</b></li>
                <li className="text-xs opacity-60">Credits never expire.</li>
              </ul>
              <a href={`/${locale}/ai-tools`} className="w-full py-3 rounded-lg bg-[#4fd6ff] text-[#003543] transition-all mt-auto font-bold text-center block">Buy Credits</a>
            </div>
            <div className="p-8 bg-[#2a2a2a] rounded-xl flex flex-col items-center text-center space-y-6">
              <p className="font-black uppercase tracking-widest text-xs opacity-50">Premium</p>
              <div className="text-4xl font-playfair font-bold">$9.99<span className="text-sm">/mo</span></div>
              <ul className="text-sm space-y-3 text-[#bcc8ce]">
                <li><b className="text-white">Unlimited AI generations</b></li>
                <li>Verified profile badge</li>
                <li>Priority in search results</li>
                <li>Advanced analytics</li>
              </ul>
              <a href="#contact" className="w-full py-3 rounded-lg border border-[#3d494e] hover:bg-white/5 transition-all mt-auto font-bold text-center block">Go Premium</a>
            </div>
          </div>
          <p className="text-center text-xs text-stone-500 mt-10">
            0% commission on any booking or transaction. Artists and venues connect directly.
          </p>
        </section>

        {/* ━━━ CTA ━━━ */}
        <section className="py-32 px-8 md:px-16 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="text-4xl md:text-6xl font-playfair font-bold tracking-tighter">
              {locale === 'th' ? 'เริ่มต้นฟรีวันนี้' : 'Start building today.'}
            </h2>
            <p className="text-xl text-[#bcc8ce] max-w-2xl mx-auto">
              {locale === 'th'
                ? 'ไม่ว่าคุณจะเป็นศิลปินที่ต้องการเครื่องมือสร้างสรรค์ หรือสถานที่ที่ต้องการจัดการความบันเทิง — เริ่มได้ทันทีฟรี'
                : 'Whether you\'re an artist who needs creative tools or a venue that needs to manage entertainment — get started in under 2 minutes.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/sign-up" className="bg-[#4fd6ff] text-[#003543] px-12 py-5 font-bold rounded-lg shadow-xl hover:brightness-110 transition-all">
                {locale === 'th' ? 'สร้างโปรไฟล์ศิลปิน' : 'Create Artist Profile'}
              </a>
              <a href="/sign-up/venue" className="glass-card text-[#f0bba5] px-12 py-5 font-bold rounded-lg hover:bg-white/5 transition-all">
                {locale === 'th' ? 'ตั้งค่าสถานที่' : 'Set Up Your Venue'}
              </a>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4fd6ff]/10 blur-[120px] -z-10 rounded-full" />
        </section>

        {/* ━━━ CONTACT ━━━ */}
        <section id="contact" className="py-32 px-8 md:px-16 bg-[#131313] scroll-mt-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tighter">{t('landing.contact.title')}</h2>
              <p className="text-lg text-[#bcc8ce] max-w-md leading-relaxed">
                {locale === 'th'
                  ? 'มีคำถาม? ต้องการ demo? หรือแค่อยากพูดคุย — เราพร้อมช่วยเหลือ'
                  : 'Questions? Want a demo? Or just want to chat — we\'re here to help.'}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff]">mail</span>
                  <span className="font-bold">info@brightears.io</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-10 rounded-2xl">
              <VenueInquiryForm darkMode />
            </div>
          </div>
        </section>

        {/* ━━━ FOOTER ━━━ */}
        <footer className="bg-[#131313] w-full py-20 px-8 md:px-16">
          <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto text-sm tracking-wide">
            <div className="col-span-4 md:col-span-2">
              <p className="text-[#e5e2e1] font-bold text-2xl font-playfair mb-6">BrightEars</p>
              <p className="text-[#e5e2e1]/40 max-w-sm mb-12">AI-powered tools for entertainment professionals. Creative studio for artists. Management platform for venues. Free forever.</p>
              <p className="text-[#e5e2e1]/40">&copy; 2026 BrightEars.</p>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-4">
              <p className="font-bold text-[#e5e2e1] uppercase tracking-widest text-xs mb-4">Platform</p>
              <a className="block text-[#e5e2e1]/40 hover:text-[#4fd6ff] transition-opacity" href={`/${locale}/ai-tools`}>AI Studio</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#4fd6ff] transition-opacity" href={`/${locale}/entertainment`}>Marketplace</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#4fd6ff] transition-opacity" href={`/${locale}/gigs`}>Open Gigs</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#4fd6ff] transition-opacity" href="#pricing">Pricing</a>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-4">
              <p className="font-bold text-[#e5e2e1] uppercase tracking-widest text-xs mb-4">Get Started</p>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="/sign-up">Artist Sign Up</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="/sign-up/venue">Venue Sign Up</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="#contact">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
