/**
 * /services/agents — AI Agents pillar overview.
 *
 * Phase 1 scope: single overview page covering the 3 SKU lineup.
 * Phase 2: per-SKU detail pages (/agents/venue, /agents/dj, /agents/music).
 *
 * Started 2026-04-29 on vinyl/autonomous-3pillar-homepage.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';
import JsonLd from '@/components/JsonLd';
import {
  generateAgentSchemas,
  generateBreadcrumbSchema,
} from '@/lib/schemas/structured-data';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'AI Agents for Entertainment | Bright Ears',
    description:
      'Three AI agents built for the entertainment business: Venue Agent for managers, DJ Agent for artists, Music Agent for everyone. Built in Bangkok.',
    alternates: {
      canonical: `/${locale}/services/agents`,
      languages: { en: '/en/services/agents', th: '/th/services/agents' },
    },
  };
}

const AGENTS = [
  {
    name: 'Venue Agent',
    tagline: 'Entertainment programming on autopilot.',
    audience: 'For F&B managers, hotel owners, and venue operators.',
    longDescription:
      'The Venue Agent runs the day-to-day work of managing a venue\'s DJ programming. ' +
      'It maintains your monthly schedule grid, sends DJ reminders, captures ' +
      'confirmations, drafts cover-request messages when someone cancels, collects ' +
      'manager feedback after every shift, prepares monthly invoices and WHT, and ' +
      'gives you a dashboard that always knows what tonight looks like.',
    bullets: [
      'Schedule grid + per-day DJ assignments',
      'LINE / WhatsApp / SMS reminders + confirmation tracking',
      'Performance feedback + drift detection',
      'Auto-replacement workflow when a DJ cancels',
      'Monthly invoice + WHT prep',
      'Manager dashboard with audit trail',
    ],
    price: 'From $25 / month',
    status: 'Beta — invite only',
    accent: '#4fd6ff',
    accentBg: 'bg-[#4fd6ff]',
    accentText: 'text-[#4fd6ff]',
  },
  {
    name: 'DJ Agent',
    tagline: 'Your career, programmed.',
    audience: 'For DJs, producers, and performing artists.',
    longDescription:
      'The DJ Agent is a personal manager for your career. It handles inbound ' +
      'booking enquiries, drafts proposals for venues, generates social content ' +
      'around your sets, schedules content drops, tracks your rate history per ' +
      'venue, and keeps your calendar + travel coordinated across gigs.',
    bullets: [
      'Booking inbox triage + proposal drafting',
      'Social content generation (Instagram, TikTok)',
      'Calendar + travel coordination',
      'Per-venue rate + rating analytics',
      'WHT + tax-ready invoicing',
      'LINE / Email / WhatsApp inbox unification',
    ],
    price: 'Pricing coming soon',
    status: 'Beta — invite only',
    accent: '#f0bba5',
    accentBg: 'bg-[#f0bba5]',
    accentText: 'text-[#f0bba5]',
  },
  {
    name: 'Music Agent',
    tagline: 'Your home DJ, in your pocket.',
    audience: 'For music lovers everywhere.',
    longDescription:
      'The Music Agent turns your music library into a live DJ. It picks the ' +
      'next track, mixes it into the current one, reads the room (your living ' +
      'room), and adjusts. Connects to Spotify, Apple Music, and your local ' +
      'library. Works with Sonos and other smart speakers. Personal taste built up ' +
      'over time, no playlists to curate.',
    bullets: [
      'AI DJ — picks + mixes the next track live',
      'Spotify + Apple Music + local library integration',
      'Sonos + smart speaker control',
      'Personalised set builder per mood',
      'Voice + chat control',
      'No playlist curation needed',
    ],
    price: '—',
    status: 'Coming soon',
    accent: '#ffdeae',
    accentBg: 'bg-[#ffdeae]',
    accentText: 'text-[#ffdeae]',
  },
];

export default async function AgentsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const agentSchemas = generateAgentSchemas({ locale });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      { name: 'Home', url: `https://brightears.io/${locale}` },
      { name: 'Services', url: `https://brightears.io/${locale}/services` },
      { name: 'AI Agents', url: `https://brightears.io/${locale}/services/agents` },
    ],
  });

  return (
    <main
      className="min-h-screen bg-[#131313] text-[#e5e2e1]"
      style={{ fontFamily: 'Manrope, sans-serif' }}
    >
      {agentSchemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-6">
            AI Agents
          </span>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-8 italic"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Three agents.
            <br />
            <span className="text-[#4fd6ff]">One mission:</span> run the work for you.
          </h1>
          <p className="text-lg md:text-xl text-[#bcc8ce] max-w-3xl mx-auto font-light leading-relaxed">
            We built AI agents for the entertainment business — the same system
            we use internally to run six venues in Bangkok. Now they're a product
            you can buy. Pre-built. Domain-trained. Bangkok-priced.
          </p>
        </div>
      </section>

      {/* Three SKU cards (full-bleed) */}
      <section className="bg-[#0e0e0e] py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {AGENTS.map((a) => (
            <article
              key={a.name}
              className="bg-[#131313] border border-[#3d494d]/20 p-10 flex flex-col"
            >
              <span
                className={`text-[10px] tracking-[0.3em] uppercase font-bold mb-3 ${a.accentText}`}
              >
                {a.status}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: 'Noto Serif, serif', color: a.accent }}
              >
                {a.name}
              </h2>
              <p className="italic font-light text-[#bcc8ce] mb-2">{a.tagline}</p>
              <p className="text-[#bcc8ce]/60 text-xs uppercase tracking-widest mb-8">
                {a.audience}
              </p>
              <p className="text-[#bcc8ce] text-sm leading-relaxed mb-8 font-light">
                {a.longDescription}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {a.bullets.map((b) => (
                  <li key={b} className="text-sm text-[#bcc8ce] font-light flex gap-3">
                    <span style={{ color: a.accent }}>•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#3d494d]/20 pt-6 flex items-center justify-between">
                <p className={`font-bold ${a.accentText}`}>{a.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="py-32 bg-[#131313] px-8">
        <div className="max-w-5xl mx-auto">
          <span className="text-[#4fd6ff] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4">
            Why our agents
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-12 leading-tight"
            style={{ fontFamily: 'Noto Serif, serif' }}
          >
            Built on a system that already runs venues every night.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold uppercase text-sm tracking-widest mb-3">
                Domain-trained
              </h3>
              <p className="text-[#bcc8ce] font-light text-sm leading-relaxed">
                Not a generic LLM with a system prompt. Trained on the actual
                operational patterns of running entertainment programming —
                schedules, DJ ops, feedback loops, invoicing.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm tracking-widest mb-3">
                Bangkok-priced
              </h3>
              <p className="text-[#bcc8ce] font-light text-sm leading-relaxed">
                $25/month gets you what would cost an assistant manager a salary.
                Built using the cheapest competent models available, with
                premium-model fallback for the work that needs it.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm tracking-widest mb-3">
                Co-pilot first
              </h3>
              <p className="text-[#bcc8ce] font-light text-sm leading-relaxed">
                The agent acts on internal work and drafts external messages
                for you to approve. You keep control. Tier up to autopilot when
                you're ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-32 bg-[#1c1b1b] px-8 scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-24">
          <div className="md:w-1/3">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: 'Noto Serif, serif' }}
            >
              Want early access?
            </h2>
            <p className="text-[#bcc8ce] font-light mb-8 leading-relaxed">
              The Venue Agent and DJ Agent are in invite-only beta.
              Tell us about your venue or your career and we'll be in touch.
            </p>
            <Link
              href={`/${locale}`}
              className="inline-block text-xs tracking-[0.2em] uppercase font-bold opacity-60 hover:opacity-100"
            >
              ← Back to home
            </Link>
          </div>
          <div className="flex-1">
            <VenueInquiryForm darkMode />
          </div>
        </div>
      </section>
    </main>
  );
}
