import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/components/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'บริการ | Bright Ears Bangkok'
    : 'Services | Bright Ears Bangkok';

  const description = locale === 'th'
    ? 'บริการความบันเทิงระดับพรีเมียมสำหรับโรงแรมและสถานที่ต่างๆ จองดีเจครั้งเดียวหรือจัดการความบันเทิงรายคืนแบบครบวงจร'
    : 'Premium entertainment services for hotels and venues. One-off DJ bookings or fully managed nightly entertainment.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/services`,
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
      canonical: `/${locale}/services`,
      languages: {
        'en': '/en/services',
        'th': '/th/services',
        'x-default': '/en/services',
      }
    },
  };
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1]" style={{ fontFamily: 'Manrope, sans-serif' }}>

      {/* Hero */}
      <section className="pt-40 pb-20 px-8 md:px-20 text-center">
        <span className="uppercase tracking-[0.2em] text-[#4fd6ff] text-sm mb-4 block font-bold">Services</span>
        <h1
          className="text-5xl md:text-7xl italic mb-6 leading-tight font-bold"
          style={{ fontFamily: 'Noto Serif, serif' }}
        >
          How we work with you.
        </h1>
        <p className="text-xl text-[#bcc8ce] max-w-2xl mx-auto leading-relaxed">
          Whether you need a DJ for one night or entertainment managed every night of the week — we have you covered.
        </p>
      </section>

      {/* Two Options */}
      <section className="py-16 px-8 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* One-off Bookings */}
          <Link href="/services/bookings" className="group relative overflow-hidden bg-[#1c1b1b] hover:bg-[#2a2a2a] transition-colors">
            <div className="h-[300px] overflow-hidden">
              <Image
                src="/images/split-dj-new.png"
                alt="DJ performing at event"
                fill
                className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                sizes="50vw"
              />
            </div>
            <div className="relative p-10">
              <span className="text-[#4fd6ff] text-xs font-bold uppercase tracking-widest block mb-4">One-off</span>
              <h2
                className="text-3xl font-bold mb-4 group-hover:text-[#4fd6ff] transition-colors"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Book a DJ.
              </h2>
              <p className="text-[#bcc8ce] leading-relaxed mb-6">
                The right artist for your event. Corporate dinners, private parties, launches, brunches — matched to your vibe, delivered to your venue. Proposal within 24 hours.
              </p>
              <span className="text-[#4fd6ff] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Learn more
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
              </span>
            </div>
          </Link>

          {/* Managed Entertainment */}
          <Link href="/services/managed" className="group relative overflow-hidden bg-[#1c1b1b] hover:bg-[#2a2a2a] transition-colors">
            <div className="h-[300px] overflow-hidden">
              <Image
                src="/images/split-venue-new.png"
                alt="Luxury venue interior"
                fill
                className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                sizes="50vw"
              />
            </div>
            <div className="relative p-10">
              <span className="text-[#f0bba5] text-xs font-bold uppercase tracking-widest block mb-4">Ongoing</span>
              <h2
                className="text-3xl font-bold mb-4 group-hover:text-[#f0bba5] transition-colors"
                style={{ fontFamily: 'Noto Serif, serif' }}
              >
                Managed entertainment.
              </h2>
              <p className="text-[#bcc8ce] leading-relaxed mb-6">
                Your venue&apos;s nightly entertainment, on autopilot. Scheduling, curation, quality control, backup guarantees, and monthly reporting. One invoice, zero headaches.
              </p>
              <span className="text-[#f0bba5] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Learn more
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* Not sure? */}
      <section className="py-24 px-8 md:px-20 text-center">
        <p className="text-[#bcc8ce] text-lg max-w-xl mx-auto mb-8">
          Not sure which option fits? Tell us about your venue and we&apos;ll recommend the right approach.
        </p>
        <a
          href="/#contact"
          className="inline-block px-10 py-4 bg-[#4fd6ff] text-[#131313] font-bold uppercase text-sm tracking-wider hover:bg-[#3bc5ee] transition-colors"
        >
          Get in touch
        </a>
      </section>

    </main>
  );
}
