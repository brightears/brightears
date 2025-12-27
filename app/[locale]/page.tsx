import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Bright Ears | จัดหาดีเจและวงดนตรีสำหรับโรงแรมหรู'
    : 'Bright Ears | Premium Entertainment for Luxury Hotels';

  const description = locale === 'th'
    ? '20 ปีแห่งประสบการณ์ มาตรฐานเดียว จัดหาดีเจและวงดนตรีระดับพรีเมียมสำหรับโรงแรม 5 ดาวในประเทศไทย'
    : '20 years. One standard. Premium DJ and live entertainment curation for five-star hotels across Thailand.';

  return {
    title,
    description,
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
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // Venue placeholder names for grayscale logos
  const venues = [
    'Four Seasons',
    'Mandarin Oriental',
    'The Peninsula',
    'Capella',
    'Rosewood',
  ];

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Bright Ears"
            width={120}
            height={40}
            className="h-8 w-auto opacity-90"
            priority
          />

          {/* Contact Link */}
          <a
            href="#contact"
            className="font-inter text-sm text-white/60 hover:text-white/90 transition-colors duration-300 tracking-widest uppercase"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Hero - Centered, Full Viewport */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24">
        {/* Large Logo */}
        <div className="mb-12">
          <Image
            src="/logo.png"
            alt="Bright Ears"
            width={280}
            height={93}
            className="h-20 md:h-24 w-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <h1 className="font-inter text-2xl md:text-3xl lg:text-4xl text-white font-light tracking-[0.2em] text-center mb-16">
          20 years. One standard.
        </h1>

        {/* Venue Logos - Grayscale Placeholders */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mb-16 max-w-4xl">
          {venues.map((venue) => (
            <div
              key={venue}
              className="h-6 md:h-8 px-4 flex items-center justify-center"
            >
              <span className="font-inter text-xs md:text-sm text-white/40 tracking-[0.15em] uppercase whitespace-nowrap">
                {venue}
              </span>
            </div>
          ))}
        </div>

        {/* Contact Buttons */}
        <div id="contact" className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="mailto:info@brightears.io"
            className="group px-8 py-3 border border-brand-cyan/60 text-brand-cyan/80 hover:text-brand-cyan hover:border-brand-cyan rounded-none font-inter text-sm tracking-[0.15em] uppercase transition-all duration-300"
          >
            Email
          </a>
          <a
            href="https://line.me/R/ti/p/@brightears"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-3 border border-brand-cyan/60 text-brand-cyan/80 hover:text-brand-cyan hover:border-brand-cyan rounded-none font-inter text-sm tracking-[0.15em] uppercase transition-all duration-300"
          >
            LINE
          </a>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="px-8 py-6">
        <p className="text-center font-inter text-xs text-white/30 tracking-widest">
          © 2025 Bright Ears
        </p>
      </footer>
    </main>
  );
}
