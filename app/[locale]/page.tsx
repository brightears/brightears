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

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Ambient Background - Subtle radial gradients for depth */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary ambient glow - very subtle cyan */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #00bbe4 0%, transparent 70%)',
          }}
        />
        {/* Secondary ambient - warm undertone */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #a47764 0%, transparent 70%)',
          }}
        />
        {/* Subtle vignette for cinematic feel */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - crisp rendering */}
          <Image
            src="/logo.png"
            alt="Bright Ears"
            width={512}
            height={514}
            className="h-8 w-auto opacity-90"
            quality={100}
            priority
            unoptimized
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
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24 relative z-10">
        {/* Large Logo - crisp at any size */}
        <div className="mb-16">
          <Image
            src="/logo.png"
            alt="Bright Ears"
            width={512}
            height={514}
            className="h-24 md:h-32 lg:h-36 w-auto"
            quality={100}
            priority
            unoptimized
          />
        </div>

        {/* Tagline - refined typography */}
        <h1 className="font-inter text-xl md:text-2xl lg:text-3xl text-white/90 font-extralight tracking-[0.25em] text-center mb-20 uppercase">
          20 years. One standard.
        </h1>

        {/* Subtle divider line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-20" />

        {/* Contact Buttons */}
        <div id="contact" className="flex flex-col sm:flex-row items-center gap-6">
          <a
            href="mailto:info@brightears.io"
            className="group relative px-10 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-inter text-sm tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden"
          >
            {/* Hover fill effect */}
            <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">Email</span>
          </a>
          <a
            href="https://line.me/R/ti/p/@brightears"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-4 border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-inter text-sm tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden"
          >
            {/* Hover fill effect */}
            <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">LINE</span>
          </a>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="px-8 py-8 relative z-10">
        <p className="text-center font-inter text-xs text-white/25 tracking-[0.2em] uppercase">
          &copy; 2025 Bright Ears
        </p>
      </footer>
    </main>
  );
}
