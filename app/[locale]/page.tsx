/**
 * BrightEars Homepage v3 — "Nocturne Gallery" design from Google Stitch
 *
 * Positioning: Premium entertainment management agency
 * Two clear paths: "I need a DJ for an event" / "Ongoing management"
 * Design: Art gallery meets nightclub — full-bleed photography, editorial
 * serif typography, hard edges, dramatic negative space.
 *
 * Stitch project: 14961156792360455988 (Concept A)
 * Design system: "Nocturne Gallery" — Noto Serif headlines, Manrope body,
 * 0px border-radius, #131313 base, #4fd6ff cyan, #f0bba5 coral
 */

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemas/structured-data';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';
import HashScroller from '@/components/HashScroller';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Bright Ears | AI Agents for Entertainment, Built in Bangkok',
    description:
      'AI agents that run your venue\'s music programming. Plus managed DJ services and one-off bookings for Bangkok\'s finest hotels: NOBU, Le Du Kaan, CRU, Cocoa XO, Horizon, ABar.',
    keywords:
      'AI agent venue, AI agent DJ, entertainment automation, DJ agency Bangkok, hotel DJ service, venue entertainment software, managed DJ, premium entertainment',
    openGraph: {
      title: 'Bright Ears | AI Agents for Entertainment, Built in Bangkok',
      description:
        'AI agents that run your venue\'s music programming. Plus managed DJ services and event bookings.',
      url: `/${locale}`,
      siteName: 'Bright Ears',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', th: '/th', 'x-default': '/en' },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const organizationSchema = generateOrganizationSchema({ locale });
  const localBusinessSchema = generateLocalBusinessSchema({ locale });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [{ name: 'Home', url: `https://brightears.io/${locale}` }],
  });

  // Featured artists for the roster lookbook — hand-picked by Norbert
  const featuredNames = ['Benji', 'Vita', 'UFO', 'RabbitDisco', 'Eskay Da Real', 'Linze'];
  const featuredArtistsRaw = await prisma.artist.findMany({
    where: {
      isVisible: true,
      stageName: { in: featuredNames },
      profileImage: { not: null },
    },
    select: {
      id: true,
      stageName: true,
      profileImage: true,
      genres: true,
      averageRating: true,
    },
  });
  // Preserve the hand-picked order
  const featuredArtists = featuredNames
    .map(name => featuredArtistsRaw.find(a => a.stageName === name))
    .filter(Boolean) as typeof featuredArtistsRaw;

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <HashScroller />

      {/* Stitch design: "Nocturne Gallery" — art gallery meets nightclub */}
      <main className="min-h-screen bg-[#131313] text-[#e5e2e1]" style={{ fontFamily: 'Manrope, sans-serif' }}>

        {/* ━━━ HERO — Full-screen, dramatic, two clear CTAs ━━━ */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-dj.jpg"
              alt="Premium entertainment at a luxury Bangkok venue"
              fill
              priority
              className="object-cover opacity-50"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4 max-w-5xl">
            <h1
              className="font-black text-5xl md:text-8xl mb-8 tracking-tighter leading-[0.9] italic"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Your entertainment,
              <br />
              <span className="text-[#4fd6ff]">on autopilot.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#bcc8ce] max-w-2xl mx-auto mb-12 font-light">
              AI agents that run your venue&apos;s music programming. Built in Bangkok,
              used by NOBU, Le Du Kaan, CRU, Cocoa XO, Horizon, and ABar.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <a
                href={`/${locale}/services/agents`}
                className="bg-[#4fd6ff] text-[#003543] px-8 py-4 font-bold text-sm tracking-[0.2em] uppercase w-full md:w-auto hover:bg-[#b8ebff] transition-all"
              >
                Meet the agents
              </a>
              <a
                href="#contact"
                className="border border-[#f0bba5]/40 text-[#f0bba5] px-8 py-4 font-bold text-sm tracking-[0.2em] uppercase w-full md:w-auto hover:border-[#f0bba5] transition-all"
              >
                Talk to us
              </a>
            </div>
          </div>
          {/* Trusted By — actual brand logos */}
          <div className="absolute bottom-12 w-full px-8 overflow-hidden">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-40 mb-6 text-center">
              Trusted by global hospitality leaders
            </p>
            <div className="flex justify-center flex-wrap gap-10 md:gap-16 items-center">
              <Image src="/images/clients/marriott.svg" alt="Marriott" width={140} height={48} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity brightness-200 grayscale" />
              <Image src="/images/clients/hilton.png" alt="Hilton" width={140} height={48} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity brightness-200 grayscale" />
              <Image src="/images/clients/centara.png" alt="Centara" width={140} height={48} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity brightness-200 grayscale" />
              <Image src="/images/clients/accor.png" alt="Accor" width={140} height={48} className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity brightness-200 grayscale" />
            </div>
          </div>
        </section>

        {/* ━━━ THREE PILLARS — AI Agents lead ━━━ */}
        <section className="bg-[#131313] py-32 px-8">
          <div className="max-w-7xl mx-auto mb-16 text-center">
            <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">
              Three ways to work with us
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              AI Agents · Managed Entertainment · DJ Bookings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1c1b1b]">
            {/* Pillar 1 — AI Agents (lead) */}
            <a
              href={`/${locale}/services/agents`}
              className="group relative aspect-[4/5] overflow-hidden bg-[#131313]"
            >
              <Image
                src="/images/split-venue-new.png"
                alt="AI agent dashboard for venue managers"
                fill
                className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-[#131313] to-transparent">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#4fd6ff] font-bold mb-3">
                  New
                </span>
                <h3
                  className="text-3xl font-bold mb-4 text-[#4fd6ff]"
                  style={{ fontFamily: 'Noto Serif, serif' }}
                >
                  AI Agents
                </h3>
                <p className="text-[#bcc8ce] font-light leading-relaxed text-sm">
                  Personal assistants for venues, artists, and music lovers.
                  The Venue Agent runs your DJ programming. The DJ Agent handles
                  your career admin. Monthly subscription. Beta — invite only.
                </p>
                <span className="mt-6 inline-block text-[#4fd6ff] text-xs tracking-[0.2em] uppercase font-bold">
                  Explore the agents →
                </span>
              </div>
            </a>
            {/* Pillar 2 — Managed Entertainment */}
            <a
              href={`/${locale}/services/managed`}
              className="group relative aspect-[4/5] overflow-hidden bg-[#131313]"
            >
              <Image
                src="/images/split-dj-new.png"
                alt="Managed entertainment service for premium venues"
                fill
                className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-[#131313] to-transparent">
                <h3
                  className="text-3xl font-bold mb-4 text-[#f0bba5]"
                  style={{ fontFamily: 'Noto Serif, serif' }}
                >
                  Managed Entertainment
                </h3>
                <p className="text-[#bcc8ce] font-light leading-relaxed text-sm">
                  We run your DJ programming end-to-end. Scheduling, quality control,
                  backup DJs, monthly reporting. One invoice. Zero headaches.
                </p>
                <span className="mt-6 inline-block text-[#f0bba5] text-xs tracking-[0.2em] uppercase font-bold">
                  Explore managed →
                </span>
              </div>
            </a>
            {/* Pillar 3 — DJ Bookings */}
            <a
              href={`/${locale}/services/bookings`}
              className="group relative aspect-[4/5] overflow-hidden bg-[#131313]"
            >
              <Image
                src="/images/hero-dj.jpg"
                alt="One-off DJ bookings for events"
                fill
                className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-[#131313] to-transparent">
                <h3
                  className="text-3xl font-bold mb-4"
                  style={{ fontFamily: 'Noto Serif, serif' }}
                >
                  DJ Bookings
                </h3>
                <p className="text-[#bcc8ce] font-light leading-relaxed text-sm">
                  Need a DJ for an event? Browse the roster, tell us your vibe,
                  get a custom proposal within 24 hours. Launches, private parties,
                  one-off bookings.
                </p>
                <span className="mt-6 inline-block text-[#bcc8ce] text-xs tracking-[0.2em] uppercase font-bold">
                  Browse the roster →
                </span>
              </div>
            </a>
          </div>
        </section>

        {/* ━━━ MEET THE AGENTS — 3 SKU cards ━━━ */}
        <section className="bg-[#0e0e0e] py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">
                Meet the agents
              </span>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Three agents. Built on the same system{' '}
                <span className="italic text-[#bcc8ce]">we use internally.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Venue Agent',
                  tagline: 'Entertainment programming on autopilot.',
                  audience: 'For F&B managers + venue operators.',
                  bullets: [
                    'Schedule grid + DJ confirmations',
                    'Performance ratings + drift detection',
                    'Auto-replacement when a DJ cancels',
                    'Monthly reporting + invoice prep',
                  ],
                  price: 'From $25 / month',
                  status: 'Beta — invite only',
                  accent: '#4fd6ff',
                },
                {
                  name: 'DJ Agent',
                  tagline: 'Your career, programmed.',
                  audience: 'For DJs and performing artists.',
                  bullets: [
                    'Booking inbox + proposal drafting',
                    'Social content generation',
                    'Calendar + travel coordination',
                    'Analytics across venues + ratings',
                  ],
                  price: 'Pricing coming soon',
                  status: 'Beta — invite only',
                  accent: '#f0bba5',
                },
                {
                  name: 'Music Agent',
                  tagline: 'Your home DJ, in your pocket.',
                  audience: 'For music lovers everywhere.',
                  bullets: [
                    'AI DJ that mixes your library',
                    'Connects to Spotify + Apple Music',
                    'Sonos + smart speaker control',
                    'Personalised set-builder',
                  ],
                  price: '—',
                  status: 'Coming soon',
                  accent: '#ffdeae',
                },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="bg-[#131313] border border-[#3d494d]/20 p-8 flex flex-col"
                >
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase font-bold mb-3"
                    style={{ color: agent.accent }}
                  >
                    {agent.status}
                  </span>
                  <h3
                    className="text-3xl font-bold mb-2"
                    style={{ fontFamily: 'Noto Serif, serif', color: agent.accent }}
                  >
                    {agent.name}
                  </h3>
                  <p className="text-[#bcc8ce] mb-2 italic font-light">
                    {agent.tagline}
                  </p>
                  <p className="text-[#bcc8ce]/60 text-xs uppercase tracking-widest mb-6">
                    {agent.audience}
                  </p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {agent.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-sm text-[#bcc8ce] font-light flex gap-3"
                      >
                        <span style={{ color: agent.accent }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-[#3d494d]/20 pt-4">
                    <p
                      className="font-bold text-sm"
                      style={{ color: agent.accent }}
                    >
                      {agent.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href={`/${locale}/services/agents`}
                className="inline-block border border-[#4fd6ff]/40 text-[#4fd6ff] px-8 py-4 font-bold text-sm tracking-[0.2em] uppercase hover:border-[#4fd6ff] transition-all"
              >
                Learn more about the agents
              </a>
            </div>
          </div>
        </section>

        {/* ━━━ ROSTER — Horizontal lookbook gallery ━━━ */}
        <section className="py-32 bg-[#131313] overflow-hidden">
          <div className="px-8 mb-16 flex flex-col md:flex-row justify-between items-baseline gap-6">
            <div className="max-w-xl">
              <h2
                className="text-5xl font-bold mb-4 tracking-tight"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                The Roster.
              </h2>
              <p className="text-[#bcc8ce] font-light text-lg">
                Hand-selected artists for Bangkok&apos;s most discerning venues.
              </p>
            </div>
            <a
              className="group text-[#4fd6ff] font-bold uppercase text-xs tracking-widest flex items-center gap-2"
              href={`/${locale}/entertainment`}
            >
              View full roster
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                arrow_right_alt
              </span>
            </a>
          </div>
          <div className="flex overflow-x-auto gap-8 px-8 pb-12 snap-x" style={{ scrollbarWidth: 'none' }}>
            {featuredArtists.map((artist) => (
              <a
                key={artist.id}
                href={`/${locale}/entertainment/${artist.id}`}
                className="flex-none w-[300px] snap-start bg-[#1c1b1b] group"
              >
                <div className="h-[420px] overflow-hidden bg-[#0e0e0e]">
                  {artist.profileImage ? (
                    <Image
                      src={artist.profileImage}
                      alt={artist.stageName}
                      width={600}
                      height={840}
                      className="w-full h-full object-cover object-[center_25%] grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1c1b1b] flex items-center justify-center text-5xl opacity-20">
                      🎧
                    </div>
                  )}
                </div>
                <div className="pt-8 pb-4 relative -mt-12 ml-6 mr-6 bg-[#131313] p-6 shadow-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4
                      className="text-2xl font-bold tracking-tight"
                      style={{ fontFamily: 'Noto Serif, serif' }}
                    >
                      {artist.stageName.toUpperCase()}
                    </h4>
                    {artist.averageRating && (
                      <div className="flex items-center gap-1 text-[#ffdeae]">
                        <span className="text-xs font-bold">
                          {artist.averageRating.toFixed(1)}
                        </span>
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                    )}
                  </div>
                  {artist.genres.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {artist.genres.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-3 py-1 bg-[#353534] text-[10px] font-bold tracking-widest uppercase text-[#bcc8ce]"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ━━━ THE TECH EDGE — Dashboard showcase ━━━ */}
        <section className="py-32 bg-[#0e0e0e] px-8">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">
                What makes us different
              </span>
              <h2
                className="text-5xl font-black mb-8 leading-tight"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Your entertainment,{' '}
                <br />
                <span className="italic text-[#bcc8ce]">on autopilot.</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    icon: 'dashboard',
                    title: 'Schedule Dashboard',
                    desc: 'Real-time visibility into your monthly lineup. Instant replacements, arrival tracking, and rider management in one view.',
                  },
                  {
                    icon: 'analytics',
                    title: 'Performance Ratings',
                    desc: 'Your venue managers rate every set. We use that data to curate who plays next week. Quality gets better every night.',
                  },
                  {
                    icon: 'auto_awesome',
                    title: 'AI Promo Content',
                    desc: 'We generate professional social media content for your venue — posters, IG posts, stories — automatically, every week.',
                  },
                ].map((f) => (
                  <div key={f.title} className="flex gap-6">
                    <div className="w-12 h-12 bg-[#131313] flex items-center justify-center flex-none">
                      <span className="material-symbols-outlined text-[#4fd6ff]">
                        {f.icon}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-sm tracking-widest mb-2">
                        {f.title}
                      </h4>
                      <p className="text-[#bcc8ce] text-sm font-light leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[#bcc8ce]/60 text-xs mt-12 italic">
                Interested in our corporate platform with full API access and custom analytics?{' '}
                <a href="#contact" className="text-[#4fd6ff] hover:underline">
                  Contact us for enterprise solutions.
                </a>
              </p>
            </div>
            {/* Dashboard mockup */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#4fd6ff]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-[#131313] p-1 border border-[#3d494d]/10 shadow-2xl">
                <div className="bg-[#2a2a2a] aspect-video overflow-hidden p-8">
                  <div className="flex items-center justify-between mb-8 border-b border-[#3d494d]/20 pb-4">
                    <div className="text-[10px] font-bold tracking-widest uppercase">
                      Venue Dashboard / NOBU BKK
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'This Week', value: '7 Sets' },
                      { label: 'Avg Rating', value: '4.9', color: 'text-[#4fd6ff]' },
                      { label: 'Active DJ', value: 'DJ Mint' },
                      { label: 'Next Set', value: 'Tonight' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="h-16 bg-[#0e0e0e] p-2 flex flex-col justify-between"
                      >
                        <span className="text-[8px] opacity-40 uppercase">{s.label}</span>
                        <span
                          className={`text-lg font-bold ${s.color || ''}`}
                          style={{ fontFamily: 'Noto Serif, serif' }}
                        >
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 bg-[#0e0e0e] w-full flex items-center px-4 gap-4"
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            i === 1
                              ? 'bg-[#4fd6ff]/40'
                              : i === 2
                              ? 'bg-[#f0bba5]/40'
                              : 'bg-[#ffdeae]/40'
                          }`}
                        />
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

        {/* Social proof section removed — stats too small to show off,
            testimonial felt manufactured. Will add back when we have
            real volume + real named testimonials from venue GMs. */}

        {/* ━━━ CONTACT ━━━ */}
        <section id="contact" className="py-32 bg-[#1c1b1b] px-8 scroll-mt-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-24">
            <div className="md:w-1/3">
              <h2
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Begin the Curation.
              </h2>
              <p className="text-[#bcc8ce] font-light mb-8 leading-relaxed">
                Let&apos;s discuss how we can elevate your venue&apos;s atmosphere. Proposals
                delivered within 48 hours.
              </p>
              <div className="space-y-4">
                <p className="text-xs tracking-[0.2em] font-bold opacity-40 uppercase">
                  Contact
                </p>
                <p className="text-sm">info@brightears.io</p>
              </div>
            </div>
            <div className="flex-1">
              <VenueInquiryForm darkMode />
            </div>
          </div>
        </section>

        {/* ━━━ FOOTER ━━━ */}
      </main>
    </>
  );
}
