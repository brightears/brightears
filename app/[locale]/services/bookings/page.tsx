import { Metadata } from 'next';
import Image from 'next/image';
import VenueInquiryForm from '@/app/components/VenueInquiryForm';

export const metadata: Metadata = {
  title: 'One-off DJ & Entertainment Bookings | Bright Ears Bangkok',
  description: 'Book a professional DJ or performer for your event. Genre-matched to your venue, backup guarantee, logistics handled. Get a proposal within 24 hours.',
};

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden flex items-center px-8 md:px-20">
        <div className="absolute inset-0 z-0">
          <Image src="/images/split-dj-new.png" alt="DJ performing at luxury venue" fill className="object-cover grayscale opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="uppercase tracking-[0.2em] text-[#4fd6ff] text-sm mb-4 block font-bold">Services</span>
          <h1 className="text-5xl md:text-7xl italic mb-6 leading-tight font-bold" style={{ fontFamily: 'Noto Serif, serif' }}>
            One-off bookings.
          </h1>
          <p className="text-xl text-[#bcc8ce] max-w-xl leading-relaxed">
            The right artist for your event. Matched to your vibe, delivered to your venue. Proposal within 24 hours.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-8 md:px-20 bg-[#1c1b1b]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {[
            { n: '01', t: 'Tell us about your event', d: 'Date, venue type, crowd, vibe — share your vision and we take it from there.' },
            { n: '02', t: 'We propose 2–3 artists', d: 'Genre-matched, experience-verified. Each with a profile, mix samples, and ratings.' },
            { n: '03', t: 'You pick your favourite', d: 'Review the proposals, listen to sets, choose the one that fits your night.' },
            { n: '04', t: 'We handle the rest', d: 'Logistics, equipment coordination, backup guarantee. You enjoy the event.' },
          ].map((s) => (
            <div key={s.n} className="flex flex-col gap-6">
              <span className="text-6xl text-[#4fd6ff]/20 font-bold" style={{ fontFamily: 'Noto Serif, serif' }}>{s.n}.</span>
              <h3 className="text-lg uppercase tracking-wider font-bold" style={{ fontFamily: 'Noto Serif, serif' }}>{s.t}</h3>
              <p className="text-[#bcc8ce] text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>Perfect for.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: 'business', t: 'Corporate events', d: 'Product launches, conferences, annual dinners' },
              { icon: 'celebration', t: 'Private parties', d: 'Birthdays, anniversaries, exclusive gatherings' },
              { icon: 'hotel', t: 'Hotel F&B', d: 'Restaurant atmosphere, lobby lounge, pool bar' },
              { icon: 'roofing', t: 'Rooftop bars', d: 'Sunset sessions, late-night energy, skyline vibes' },
              { icon: 'brunch_dining', t: 'Brunch sets', d: 'Weekend daytime, family-friendly, acoustic or chill' },
              { icon: 'stars', t: 'Special occasions', d: 'NYE, Songkran, holiday celebrations, fashion shows' },
            ].map((e) => (
              <div key={e.t} className="bg-[#1c1b1b] p-8 hover:bg-[#2a2a2a] transition-colors">
                <span className="material-symbols-outlined text-[#4fd6ff] text-3xl mb-4 block">{e.icon}</span>
                <h3 className="font-bold text-lg mb-2">{e.t}</h3>
                <p className="text-[#bcc8ce] text-sm">{e.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-32 px-8 md:px-20 bg-[#0e0e0e]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 tracking-tight" style={{ fontFamily: 'Noto Serif, serif' }}>What&apos;s included.</h2>
          <div className="space-y-6">
            {[
              'Genre-matched artist selection from our curated roster',
              'Professional equipment coordination (CDJs, mixer, PA if needed)',
              'Backup DJ guarantee — if your artist cancels, we have a replacement within 2 hours',
              'Day-of logistics management and on-site coordination',
              'Post-event feedback report',
              'Zero surprise fees — one clear quote, one invoice',
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <span className="text-[#4fd6ff] mt-1">✓</span>
                <p className="text-[#bcc8ce]">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-16 border-t border-[#3d494d]/20">
            <p className="text-[#bcc8ce] text-sm">
              <span className="text-[#f0bba5] font-bold text-lg" style={{ fontFamily: 'Noto Serif, serif' }}>Starting from ฿3,200 per 4-hour set.</span>
              <br />Custom quotes for multi-artist events, extended sets, and special requirements. Pricing depends on artist, date, and venue.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-32 px-8 md:px-20 bg-[#1c1b1b]" id="contact">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-24">
          <div className="md:w-1/3">
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Noto Serif, serif' }}>
              Tell us about your event.
            </h2>
            <p className="text-[#bcc8ce] font-light leading-relaxed mb-8">
              Share the details and we&apos;ll send you a proposal with 2–3 artist options within 24 hours. No commitment.
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
