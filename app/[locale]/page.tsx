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
import LineContactButton from '@/components/buttons/LineContactButton';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';
import HashScroller from '@/components/HashScroller';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Bright Ears | แพลตฟอร์มสร้างสรรค์สำหรับศิลปินและสถานที่'
    : 'Bright Ears | The Entertainment Creative Platform';

  const description = locale === 'th'
    ? 'แพลตฟอร์มฟรีสำหรับศิลปินสร้างคอนเทนต์โปรโมทด้วย AI และสถานที่ค้นหาศิลปินโดยตรง ไม่มีค่าคอมมิชชั่น'
    : 'Free platform where performing artists create professional promo content and venues discover the right talent — powered by AI. No commissions.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'ดีเจ, นักดนตรี, ศิลปิน, กรุงเทพ, โรงแรม, AI คอนเทนต์, โปรโมท, ฟรี, Bright Ears'
      : 'DJ, musician, artist, Bangkok, entertainment, AI content, promo, free platform, venue, Bright Ears',
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

  // Live marketplace stats — fetched at render time
  const [artistCount, venueCount] = await Promise.all([
    prisma.artist.count({
      where: { isVisible: true, user: { isActive: true } },
    }),
    prisma.venue.count(),
  ]);

  // FAQ content (shared between UI + FAQPage schema for AI search citation)
  const faqs = [
    {
      question: 'What is Bright Ears?',
      answer:
        'Bright Ears is a free entertainment marketplace and AI content engine. Artists — DJs, bands, singers, musicians, dancers, and more — create free profiles and generate professional promotional content (posters, Instagram posts, EPKs) using AI. Venues discover artists and contact them directly, with no commissions and no middleman.',
    },
    {
      question: 'Is Bright Ears really free for artists?',
      answer:
        'Yes. Profiles are free, venue discovery is free, and every artist gets 12 AI content generations per month for free. Artists only pay if they want more AI credits beyond the free tier, or eventually for premium features like verified badges and advanced analytics.',
    },
    {
      question: 'Is Bright Ears really free for venues?',
      answer:
        'Yes. Browsing artists, posting open gigs, and contacting performers directly is free. There are no booking fees, no commissions on gigs booked through the platform, and no subscription required to get started.',
    },
    {
      question: 'How does the AI content tool work?',
      answer:
        'Upload a photo or type a prompt, pick a format (poster, Instagram post, Instagram story, EPK), and the AI generates a professional promotional image in about 10 seconds. It uses Google\'s Gemini 2.5 Flash Image model trained on professional design patterns. You can regenerate, tweak prompts, and download everything.',
    },
    {
      question: 'How do venues find the right artist?',
      answer:
        'Two ways. First, browse the directory at /entertainment — filter by category (DJ, band, singer, etc), genre, city, or search by name. Second, post an open gig at /gigs with your date, time, genre, and budget — artists in your category will see it and apply, and we auto-suggest the top 3 matches based on rating and experience.',
    },
    {
      question: 'What cities does Bright Ears cover?',
      answer:
        'Bangkok is the current focus, with active venues including NOBU, Le Du Kaan, CRU Champagne Bar, Cocoa XO, Horizon, and ABar. The platform is open to artists and venues across Thailand, and we plan to expand to Phuket, Koh Samui, and Pattaya as the Bangkok marketplace matures.',
    },
    {
      question: 'How does Bright Ears make money?',
      answer:
        'We monetize through AI content credits (artists buy top-ups when they exceed the free tier) and future premium subscriptions for artists ($9.99/month for unlimited AI tools + verified badges) and venues (advanced analytics + priority placement). Core marketplace features — profiles, browsing, gig posting, direct contact — remain free forever.',
    },
    {
      question: 'Do foreign DJs need a work permit to perform in Thailand?',
      answer:
        'Yes. Performing for pay in Thailand requires a valid work permit for non-Thai nationals. Every Bright Ears artist profile shows a work-permit status badge (Thai National, Valid Permit, Venue-Sponsored, or Tourist Not Bookable) so venues know upfront whether a booking is legally clean. This is critical — foreign performers have been detained and deported for working without permits.',
    },
  ];
  const faqSchema = generateFAQSchema({ faqs });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <HashScroller />

      <main className="min-h-screen bg-[#131313] text-[#e5e2e1]">

        {/* HERO — from Stitch */}
        <section className="relative h-screen flex items-center pt-20 px-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/80 to-transparent z-10" />
            <Image src="/images/hero-dj.jpg" alt="Luxury venue interior" fill priority className="object-cover grayscale opacity-40" sizes="100vw" />
          </div>
          <div className="relative z-20 max-w-4xl space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full glass-card text-[#4fd6ff] text-xs tracking-widest uppercase font-bold">
              FREE TO JOIN — NO COMMISSIONS
            </span>
            <h1 className="text-7xl md:text-8xl font-playfair font-bold tracking-tighter leading-tight">
              Your entertainment. <br /> <span className="text-gradient-primary">Elevated.</span>
            </h1>
            <p className="text-xl text-[#bcc8ce] max-w-2xl leading-relaxed">
              The free platform where performing artists create professional promo content and venues discover the right talent — powered by AI.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <a href="/sign-up" className="bg-gradient-to-r from-[#b8ebff] to-[#4fd6ff] text-[#003543] px-10 py-4 font-bold rounded-lg shadow-lg hover:brightness-110 transition-all">
                I&apos;m an Artist
              </a>
              <a href="/sign-up/venue" className="glass-card text-[#f0bba5] px-10 py-4 font-bold rounded-lg hover:bg-white/5 transition-all">
                I&apos;m a Venue
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-[#bcc8ce]">
              <a href={`/${locale}/entertainment`} className="underline underline-offset-4 hover:text-white transition-colors">
                Or browse artists first →
              </a>
            </div>
          </div>
          <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 glass-card p-6 rounded-xl max-w-xs transform rotate-2 shadow-[0px_20px_40px_rgba(0,187,228,0.08)]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-sm font-bold text-[#f0bba5]">EV</div>
              <div>
                <p className="font-bold text-sm">Elena Vance</p>
                <p className="text-xs text-[#bcc8ce]">Soul &amp; Jazz Vocalist</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-[#353534] rounded-full overflow-hidden">
                <div className="h-full bg-[#4fd6ff] w-3/4 animate-pulse" />
              </div>
              <p className="text-[10px] text-[#4fd6ff] uppercase tracking-widest font-bold">AI Promo Generating...</p>
            </div>
          </div>
        </section>

        {/* TWO SIDES — from Stitch */}
        <section id="two-sides" className="grid grid-cols-1 md:grid-cols-2 scroll-mt-20">
          <div className="bg-[#1c1b1b] p-16 md:p-24 relative overflow-hidden group">
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl font-playfair font-bold tracking-tighter">Your stage.<br />Your brand.</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff] mt-1">account_circle</span>
                  <div><p className="font-bold">Professional profile</p><p className="text-sm text-[#bcc8ce]">Your sonic identity, curated.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff] mt-1">auto_awesome</span>
                  <div><p className="font-bold">AI-generated promo</p><p className="text-sm text-[#bcc8ce]">IG posts, posters, and EPKs in seconds.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff] mt-1">explore</span>
                  <div><p className="font-bold">Venue discovery</p><p className="text-sm text-[#bcc8ce]">Find the perfect stage for your sound.</p></div>
                </li>
              </ul>
              <a href="/sign-up" className="text-[#b8ebff] font-bold border-b-2 border-[#b8ebff] pb-1 hover:text-white hover:border-white transition-all inline-block">Create Your Profile</a>
            </div>
            <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>music_note</span>
            </div>
          </div>
          <div className="bg-[#131313] p-16 md:p-24 relative overflow-hidden group">
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl font-playfair font-bold tracking-tighter">Your sound.<br />Sorted.</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ffdbcd] mt-1">search</span>
                  <div><p className="font-bold">Browse by genre</p><p className="text-sm text-[#bcc8ce]">Filter by sound, availability, and rating.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ffdbcd] mt-1">chat</span>
                  <div><p className="font-bold">Direct contact</p><p className="text-sm text-[#bcc8ce]">No agents, no commission, just direct chat.</p></div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ffdbcd] mt-1">calendar_today</span>
                  <div><p className="font-bold">Schedule management</p><p className="text-sm text-[#bcc8ce]">Automate your entertainment calendar.</p></div>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <a href="/sign-up/venue" className="text-[#f0bba5] font-bold border-b-2 border-[#ffdbcd] pb-1 hover:text-white hover:border-white transition-all inline-block">Sign Up as a Venue</a>
                <a href={`/${locale}/entertainment`} className="text-[#bcc8ce] font-bold border-b-2 border-[#3d494e] pb-1 hover:text-white hover:border-white transition-all inline-block">Browse Artists</a>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'FILL' 1" }}>theater_comedy</span>
            </div>
          </div>
        </section>

        {/* AI TOOLS SHOWCASE — real generated examples */}
        <section className="py-32 px-12 max-w-[1440px] mx-auto text-center overflow-hidden">
          <div className="mb-16 space-y-6">
            <p className="text-xs tracking-widest text-[#4fd6ff] font-bold mb-4 uppercase">AI Content Studio</p>
            <h2 className="text-5xl md:text-6xl font-playfair font-bold tracking-tighter">Professional promo in 10 seconds.</h2>
            <p className="text-lg text-[#bcc8ce] max-w-2xl mx-auto">
              Every image below was generated by our AI Studio from a single text prompt. No Photoshop, no stock photos, no designer. This is what you get.
            </p>
          </div>
          <div className="relative h-[560px] md:h-[620px] flex items-center justify-center">
            {[
              {
                src: '/images/ai-examples/poster-friday-night.png',
                alt: 'AI-generated event poster: Skyline Fridays DJ residency',
                label: 'Event Poster',
                rotate: 'rotate-[-12deg] -translate-x-48 md:-translate-x-64',
                z: 'z-10',
              },
              {
                src: '/images/ai-examples/ig-square-dj-drop.png',
                alt: 'AI-generated Instagram post: Sunset Drop DJ set',
                label: 'Instagram Post',
                rotate: 'rotate-[-4deg] -translate-x-24 md:-translate-x-32',
                z: 'z-20',
              },
              {
                src: '/images/ai-examples/story-vertical-jazz.png',
                alt: 'AI-generated Instagram story: Live Jazz Nights at The Ember Room',
                label: 'IG Story',
                rotate: 'rotate-[6deg] translate-x-24 md:translate-x-32',
                z: 'z-30',
              },
              {
                src: '/images/ai-examples/epk-card-dj-nova.png',
                alt: 'AI-generated EPK card: DJ Nova deep house Bangkok',
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
          <div className="mt-12 space-y-8 max-w-2xl mx-auto">
            <p className="text-xl text-[#bcc8ce]">&ldquo;Upload a photo or type a prompt. Pick a format. AI does the rest.&rdquo;</p>
            <a href={`/${locale}/ai-tools`} className="inline-block bg-[#4fd6ff] text-[#005b70] px-12 py-5 font-bold rounded-lg shadow-[0px_20px_40px_rgba(0,187,228,0.08)] hover:scale-105 transition-transform">
              Try It Free — 12 Generations/Month
            </a>
          </div>
        </section>

        {/* HOW IT WORKS — from Stitch */}
        <section id="how-it-works" className="py-32 bg-[#1c1b1b] px-12 scroll-mt-20">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-5xl font-playfair font-bold tracking-tighter mb-20">How It Works</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="space-y-12">
                <h3 className="text-sm uppercase tracking-widest text-[#4fd6ff] font-black">For Artists</h3>
                {[
                  { n: '01', t: 'Create profile', d: 'Showcase your repertoire and style in a curated digital space.' },
                  { n: '02', t: 'Generate content', d: 'Use our AI tools to create stunning promotional materials instantly.' },
                  { n: '03', t: 'Get discovered', d: 'Appear in venue searches and get contacted directly for gigs.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-8">
                    <span className="text-6xl font-playfair font-black text-[#3d494e]/30">{s.n}</span>
                    <div className="space-y-2 pt-4"><h4 className="text-2xl font-bold">{s.t}</h4><p className="text-[#bcc8ce]">{s.d}</p></div>
                  </div>
                ))}
              </div>
              <div className="space-y-12">
                <h3 className="text-sm uppercase tracking-widest text-[#f0bba5] font-black">For Venues</h3>
                {[
                  { n: '01', t: 'Browse artists', d: "Find talent that matches your venue's atmosphere and clientele." },
                  { n: '02', t: 'Contact directly', d: 'Cut out the middleman. Chat with artists and finalize bookings.' },
                  { n: '03', t: 'Manage schedule', d: 'View all your upcoming entertainment in one sleek dashboard.' },
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

        {/* SOCIAL PROOF — from Stitch */}
        <section id="about" className="py-32 px-12 max-w-[1440px] mx-auto scroll-mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center mb-24">
            {[
              { val: '20+', label: 'Years Exp' }, { val: String(artistCount), label: 'Artists' },
              { val: String(venueCount), label: 'Venues' }, { val: '4.9', label: 'Star Rating' },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <p className="text-5xl font-playfair font-bold text-[#4fd6ff]">{s.val}</p>
                <p className="text-sm uppercase tracking-widest font-bold opacity-50">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-16 mb-24 opacity-40">
            {['MARRIOTT', 'HILTON', 'CENTARA', 'ACCOR'].map((n) => (
              <span key={n} className="text-2xl font-black tracking-widest">{n}</span>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="glass-card p-12 rounded-2xl max-w-2xl text-center relative">
              <span className="material-symbols-outlined text-[#4fd6ff] text-4xl absolute -top-5 left-1/2 -translate-x-1/2 bg-[#131313] px-4">format_quote</span>
              <p className="text-2xl italic font-playfair leading-relaxed mb-6 text-[#bcc8ce]">
                &ldquo;BrightEars completely removed the stress of promoting our residency. The AI content tool is a game changer for busy performing artists.&rdquo;
              </p>
              <p className="font-bold">Julian Rossi</p>
              <p className="text-xs text-[#bcc8ce] uppercase tracking-widest">Resident Pianist, Marriott Bangkok</p>
            </div>
          </div>
        </section>

        {/* PRICING — from Stitch */}
        <section id="pricing" className="py-32 bg-[#1c1b1b] px-12 scroll-mt-20">
          <div className="max-w-[1440px] mx-auto text-center mb-16">
            <h2 className="text-5xl font-playfair font-bold tracking-tighter">Membership</h2>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#2a2a2a] rounded-xl flex flex-col items-center text-center space-y-6">
              <p className="font-black uppercase tracking-widest text-xs opacity-50">Free</p>
              <div className="text-4xl font-playfair font-bold">$0</div>
              <ul className="text-sm space-y-4 text-[#bcc8ce]"><li>Public Profile</li><li>Venue Direct Contact</li><li>12 AI Generations / Month</li></ul>
              <a href="/sign-up" className="w-full py-3 rounded-lg border border-[#3d494e] hover:bg-white/5 transition-all mt-auto font-bold text-center block">Get Started</a>
            </div>
            <div className="p-8 bg-[#131313] border-2 border-[#4fd6ff] rounded-xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#4fd6ff] text-[#003543] px-4 py-1 text-[10px] font-bold uppercase tracking-widest transform rotate-45 translate-x-10 translate-y-4">Popular</div>
              <p className="font-black uppercase tracking-widest text-xs text-[#4fd6ff]">Credits</p>
              <div className="text-4xl font-playfair font-bold">$5 - $60</div>
              <ul className="text-sm space-y-4 text-[#bcc8ce]"><li>Pay as you go</li><li>Bulk AI Credits</li><li>Priority Discoverability</li></ul>
              <a href={`/${locale}/ai-tools`} className="w-full py-3 rounded-lg bg-[#4fd6ff] text-[#003543] transition-all mt-auto font-bold text-center block">Buy Credits</a>
            </div>
            <div className="p-8 bg-[#2a2a2a] rounded-xl flex flex-col items-center text-center space-y-6">
              <p className="font-black uppercase tracking-widest text-xs opacity-50">Premium</p>
              <div className="text-4xl font-playfair font-bold">$9.99<span className="text-sm">/mo</span></div>
              <ul className="text-sm space-y-4 text-[#bcc8ce]"><li>Unlimited AI Tools</li><li>Verified Badge</li><li>Advanced Analytics</li></ul>
              <a href="#contact" className="w-full py-3 rounded-lg border border-[#3d494e] hover:bg-white/5 transition-all mt-auto font-bold text-center block">Go Premium</a>
            </div>
          </div>
        </section>

        {/* FAQ — AI search citation layer */}
        <section id="faq" className="py-32 px-12 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-widest text-[#4fd6ff] font-bold mb-4 uppercase">
                Frequently Asked
              </p>
              <h2 className="text-5xl font-playfair font-bold tracking-tighter">Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group bg-[#1c1b1b] border border-stone-800 rounded-xl px-6 py-5 hover:border-[#4fd6ff]/40 transition"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                    <span className="text-[#4fd6ff] text-2xl leading-none flex-shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-stone-400 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA — from Stitch */}
        <section className="py-32 px-12 relative overflow-hidden text-center">
          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold tracking-tighter">Join {artistCount} artists and {venueCount} venues already on BrightEars.</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/sign-up" className="bg-[#4fd6ff] text-[#003543] px-12 py-5 font-bold rounded-lg shadow-xl">Join as Artist</a>
              <a href="/sign-up/venue" className="glass-card text-[#f0bba5] px-12 py-5 font-bold rounded-lg">Join as Venue</a>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4fd6ff]/10 blur-[120px] -z-10 rounded-full" />
        </section>

        {/* CONTACT — from Stitch + existing components */}
        <section id="contact" className="py-32 px-12 bg-[#131313] scroll-mt-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-5xl font-playfair font-bold tracking-tighter">{t('landing.contact.title')}</h2>
              <p className="text-lg text-[#bcc8ce] max-w-md leading-relaxed">
                Whether you&apos;re looking for the next star or looking for your next stage, we&apos;re here to help.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff]">mail</span>
                  <span className="font-bold">info@brightears.io</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#4fd6ff]">location_on</span>
                  <span className="font-bold">Bangkok | Phuket | Koh Samui | Pattaya</span>
                </div>
              </div>
              <div className="mt-10">
                <p className="text-[#bcc8ce] mb-4">{t('landing.contact.linePrompt')}</p>
                <LineContactButton variant="primary" message={t('landing.contact.lineMessage')} className="px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl" />
              </div>
            </div>
            <div className="glass-card p-10 rounded-2xl">
              <VenueInquiryForm darkMode />
            </div>
          </div>
        </section>

        {/* FOOTER — from Stitch */}
        <footer className="bg-[#131313] w-full py-20 px-12">
          <div className="grid grid-cols-4 gap-8 max-w-[1440px] mx-auto text-sm tracking-wide">
            <div className="col-span-4 md:col-span-2">
              <p className="text-[#e5e2e1] font-bold text-2xl font-playfair mb-6">BrightEars</p>
              <p className="text-[#e5e2e1]/40 max-w-sm mb-12">The entertainment creative platform. Free tools for artists. Free discovery for venues. Powered by AI.</p>
              <p className="text-[#e5e2e1]/40">&copy; 2026 BrightEars.</p>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-4">
              <p className="font-bold text-[#e5e2e1] uppercase tracking-widest text-xs mb-4">Platform</p>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href={`/${locale}/entertainment`}>Artists</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href={`/${locale}/ai-tools`}>AI Tools</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="#pricing">Pricing</a>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-4">
              <p className="font-bold text-[#e5e2e1] uppercase tracking-widest text-xs mb-4">Company</p>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="#about">About</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="#contact">Contact</a>
              <a className="block text-[#e5e2e1]/40 hover:text-[#f0bba5] transition-opacity" href="/sign-up">Join as Artist</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
