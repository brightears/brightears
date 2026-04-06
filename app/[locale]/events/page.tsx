import { Metadata } from 'next';
import Image from 'next/image';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'งานอีเวนต์ส่วนตัว | Bright Ears'
    : 'Private Events | Bright Ears';

  const description = locale === 'th'
    ? 'บริการดีเจสำหรับงานอีเวนต์ส่วนตัว งานบริษัท ปาร์ตี้ และงานเฉลิมฉลองในสถานที่ชั้นนำของกรุงเทพ จัดการครบวงจรโดย Bright Ears'
    : 'DJ services for corporate events, private parties, and celebrations at Bangkok\'s finest venues. Full-service entertainment by Bright Ears.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/events`,
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
      canonical: `/${locale}/events`,
      languages: {
        'en': '/en/events',
        'th': '/th/events',
        'x-default': '/en/events',
      }
    },
  };
}

const t = {
  en: {
    heroTag: "Bangkok's Premier Sonic Concierge",
    heroTitle: 'Entertainment for Your',
    heroTitleAccent: 'Special Event',
    heroSubtitle: 'Professional DJ services for corporate events, private parties, and celebrations at Bangkok\'s finest venues.',
    ctaButton: 'Plan Your Event',
    whatWeOfferTitle: 'What We Offer',
    whatWeOfferSubtitle: 'Bespoke sonic experiences tailored to the atmosphere and energy of your specific occasion.',
    corporate: 'Corporate Events',
    corporateItems: ['Product launches', 'Company parties', 'Team events'],
    private: 'Private Celebrations',
    privateItems: ['Birthdays', 'Anniversaries', 'Engagements'],
    special: 'Special Occasions',
    specialItems: ['Holiday events', 'Themed nights', 'VIP gatherings'],
    venue: 'Venue Events',
    venueItems: ['Songkran parties', 'New Year', 'Wine dinners'],
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Seamless coordination from first contact to the final beat',
    step1Title: '1. Tell Us About Your Event',
    step1Desc: 'Share your vision, venue details, and the desired atmosphere for your special day.',
    step2Title: '2. We Recommend the Perfect DJ',
    step2Desc: 'We curate a selection of artists from our roster who perfectly match your musical requirements.',
    step3Title: '3. We Handle Everything',
    step3Desc: 'From technical specs to soundchecks, we ensure every sonic detail is flawlessly executed.',
    whyTitle: 'Why Choose',
    whyTitleAccent: 'Bright Ears',
    why1Title: '25+ Professional DJs',
    why1Desc: 'A diverse portfolio of high-caliber artists spanning all musical genres and styles.',
    why2Title: 'Premium Venue Experience',
    why2Desc: 'We understand the unique acoustic and logistical demands of Bangkok\'s top venues.',
    why3Title: 'One Contact One Invoice',
    why3Desc: 'Simplified management and billing to save you time and reduce administrative hassle.',
    why4Title: 'Custom Music Curation',
    why4Desc: 'Bespoke soundtracks designed to perfectly complement your event\'s theme and flow.',
    ctaBottomTitle: 'Ready to Plan Your Event?',
    ctaBottomSubtitle: 'Let\'s create something unforgettable together. Our concierge team is standing by.',
    ctaBottomButton: 'Contact Us',
  },
  th: {
    heroTag: 'ซาวด์คอนเซียร์จชั้นนำของกรุงเทพ',
    heroTitle: 'ความบันเทิงสำหรับ',
    heroTitleAccent: 'งานพิเศษของคุณ',
    heroSubtitle: 'บริการดีเจมืออาชีพสำหรับงานบริษัท ปาร์ตี้ส่วนตัว และงานเฉลิมฉลองในสถานที่ชั้นนำของกรุงเทพ',
    ctaButton: 'วางแผนงานอีเวนต์',
    whatWeOfferTitle: 'บริการของเรา',
    whatWeOfferSubtitle: 'ประสบการณ์เสียงเฉพาะตัวที่ออกแบบมาเพื่อบรรยากาศและพลังงานของโอกาสพิเศษของคุณ',
    corporate: 'งานบริษัท',
    corporateItems: ['งานเปิดตัวผลิตภัณฑ์', 'ปาร์ตี้บริษัท', 'งานเลี้ยงทีม'],
    private: 'งานเฉลิมฉลองส่วนตัว',
    privateItems: ['วันเกิด', 'วันครบรอบ', 'ปาร์ตี้หมั้น'],
    special: 'งานพิเศษ',
    specialItems: ['งานวันหยุด', 'ไนท์ธีม', 'งาน VIP'],
    venue: 'อีเวนต์สถานที่',
    venueItems: ['ปาร์ตี้สงกรานต์', 'งานปีใหม่', 'ไวน์ดินเนอร์'],
    howItWorksTitle: 'ขั้นตอนการทำงาน',
    howItWorksSubtitle: 'การประสานงานอย่างไร้รอยต่อตั้งแต่การติดต่อครั้งแรกจนถึงบีทสุดท้าย',
    step1Title: '1. บอกเราเกี่ยวกับงานของคุณ',
    step1Desc: 'แจ้งรายละเอียด — วันที่ สถานที่ สไตล์ และจำนวนแขก เราจะดูแลต่อให้',
    step2Title: '2. เราแนะนำดีเจที่เหมาะสม',
    step2Desc: 'จากบรรยากาศงานของคุณ เราจับคู่กับดีเจและโปรแกรมเพลงที่เหมาะสมจากทีมดีเจกว่า 25 คน',
    step3Title: '3. เราจัดการทุกอย่าง',
    step3Desc: 'ตั้งแต่เช็คเสียงจนถึงเพลงสุดท้าย — เซ็ตอัพ การแสดง การประสานงาน ติดต่อจุดเดียว ไม่ต้องกังวล',
    whyTitle: 'ทำไมต้องเลือก',
    whyTitleAccent: 'Bright Ears',
    why1Title: 'ดีเจมืออาชีพกว่า 25 คน',
    why1Desc: 'ดีปเฮาส์ถึงฮิปฮอป เลานจ์ถึงไฮเอเนอร์จี้ — ครบทุกแนวเพลงโดยมืออาชีพ',
    why2Title: 'ประสบการณ์สถานที่ระดับพรีเมียม',
    why2Desc: 'ดีเจของเราเล่นทุกคืนที่ NOBU, Marriott และ Hilton พวกเขารู้วิธีอ่านห้อง',
    why3Title: 'ติดต่อจุดเดียว ใบแจ้งหนี้เดียว',
    why3Desc: 'ไม่ต้องติดต่อหลายเจ้า เราจัดหาดีเจ โลจิสติกส์ และประสานงานครบวงจร',
    why4Title: 'คัดสรรเพลงเฉพาะงาน',
    why4Desc: 'ทุกงานได้รับโปรแกรมเพลงที่ออกแบบมาเฉพาะ บอกบรรยากาศ — เราสร้างเพลงประกอบให้',
    ctaBottomTitle: 'พร้อมวางแผนงานอีเวนต์ของคุณ?',
    ctaBottomSubtitle: 'มาสร้างสิ่งที่ไม่มีวันลืมด้วยกัน ทีมคอนเซียร์จของเราพร้อมให้บริการ',
    ctaBottomButton: 'ติดต่อเรา',
  }
};

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const text = locale === 'th' ? t.th : t.en;

  return (
    <main className="pt-20 min-h-screen bg-[#131313]">
      {/* Hero Section — from Stitch */}
      <section className="relative min-h-[921px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-dj.jpg"
            alt="DJ performing at a Bangkok venue"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313]/80 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-8 relative z-10 max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-[#f1bca6] uppercase tracking-widest text-sm mb-4 block font-bold">
              {text.heroTag}
            </span>
            <h1 className="text-6xl md:text-8xl font-playfair font-bold leading-tight mb-8 tracking-tighter text-neutral-100">
              {text.heroTitle}{' '}
              <span className="italic text-[#4fd6ff]">{text.heroTitleAccent}</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-xl">
              {text.heroSubtitle}
            </p>
            <div className="flex gap-6">
              <a
                href={`/${locale}/#contact`}
                className="px-10 py-5 bg-gradient-to-r from-[#00bbe4] to-[#4fd6ff] text-[#003543] font-bold rounded-md hover:shadow-[0_0_30px_rgba(79,214,255,0.4)] transition-all flex items-center group"
              >
                {text.ctaButton}
                <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer — from Stitch */}
      <section className="py-32 bg-[#131313]">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-playfair font-bold mb-6 text-neutral-100 uppercase tracking-tighter">
                {text.whatWeOfferTitle}
              </h2>
              <p className="text-neutral-400 text-lg">
                {text.whatWeOfferSubtitle}
              </p>
            </div>
            <div className="h-1 w-24 bg-[#4fd6ff] rounded-full mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 — Corporate Events */}
            <div className="glass-card p-8 group hover:bg-[#2a2a2a] transition-all duration-500 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-playfair font-bold">01</div>
              <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">business_center</span>
              <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.corporate}</h3>
              <ul className="text-neutral-400 space-y-2">
                {text.corporateItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Card 2 — Private Celebrations */}
            <div className="glass-card p-8 group hover:bg-[#2a2a2a] transition-all duration-500 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-playfair font-bold">02</div>
              <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">celebration</span>
              <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.private}</h3>
              <ul className="text-neutral-400 space-y-2">
                {text.privateItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Card 3 — Special Occasions */}
            <div className="glass-card p-8 group hover:bg-[#2a2a2a] transition-all duration-500 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-playfair font-bold">03</div>
              <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">vignette</span>
              <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.special}</h3>
              <ul className="text-neutral-400 space-y-2">
                {text.specialItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Card 4 — Venue Events */}
            <div className="glass-card p-8 group hover:bg-[#2a2a2a] transition-all duration-500 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-playfair font-bold">04</div>
              <span className="material-symbols-outlined text-[#4fd6ff] text-4xl mb-6">nightlife</span>
              <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.venue}</h3>
              <ul className="text-neutral-400 space-y-2">
                {text.venueItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — from Stitch */}
      <section className="py-32 bg-[#0e0e0e]">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-playfair font-bold text-neutral-100 uppercase tracking-tighter mb-4">
              {text.howItWorksTitle}
            </h2>
            <p className="text-[#f1bca6] tracking-widest text-sm uppercase font-bold">
              {text.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            {/* Connector line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-[#3d494e]/30 -z-10" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-8 border border-[#4fd6ff]/20 group-hover:scale-110 group-hover:bg-[#00bbe4] transition-all">
                <span className="material-symbols-outlined text-[#4fd6ff] group-hover:text-[#003543]">edit_note</span>
              </div>
              <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.step1Title}</h4>
              <p className="text-neutral-500">{text.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-8 border border-[#4fd6ff]/20 group-hover:scale-110 group-hover:bg-[#00bbe4] transition-all">
                <span className="material-symbols-outlined text-[#4fd6ff] group-hover:text-[#003543]">person_search</span>
              </div>
              <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.step2Title}</h4>
              <p className="text-neutral-500">{text.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-8 border border-[#4fd6ff]/20 group-hover:scale-110 group-hover:bg-[#00bbe4] transition-all">
                <span className="material-symbols-outlined text-[#4fd6ff] group-hover:text-[#003543]">task_alt</span>
              </div>
              <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">{text.step3Title}</h4>
              <p className="text-neutral-500">{text.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bright Ears — from Stitch */}
      <section className="py-32 bg-[#131313] overflow-hidden">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image Grid */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#4fd6ff]/5 rounded-full blur-3xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src="/images/hero-dj.jpg"
                    alt="Professional DJ mixing"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mt-8">
                  <Image
                    src="/images/hero-dj.jpg"
                    alt="Corporate gala event"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-5xl font-playfair font-bold mb-12 text-neutral-100 uppercase tracking-tighter">
                {text.whyTitle} <span className="text-[#4fd6ff] italic">{text.whyTitleAccent}</span>
              </h2>
              <div className="space-y-10">
                {/* Feature 1 */}
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1c1b1b] border border-[#3d494e]/30 rounded-lg group-hover:border-[#4fd6ff] transition-colors">
                    <span className="material-symbols-outlined text-[#4fd6ff]">groups</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-playfair font-bold text-neutral-100 mb-2">{text.why1Title}</h5>
                    <p className="text-neutral-500 leading-relaxed">{text.why1Desc}</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1c1b1b] border border-[#3d494e]/30 rounded-lg group-hover:border-[#4fd6ff] transition-colors">
                    <span className="material-symbols-outlined text-[#4fd6ff]">location_city</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-playfair font-bold text-neutral-100 mb-2">{text.why2Title}</h5>
                    <p className="text-neutral-500 leading-relaxed">{text.why2Desc}</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1c1b1b] border border-[#3d494e]/30 rounded-lg group-hover:border-[#4fd6ff] transition-colors">
                    <span className="material-symbols-outlined text-[#4fd6ff]">receipt_long</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-playfair font-bold text-neutral-100 mb-2">{text.why3Title}</h5>
                    <p className="text-neutral-500 leading-relaxed">{text.why3Desc}</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-6 group">
                  <div className="mt-1 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1c1b1b] border border-[#3d494e]/30 rounded-lg group-hover:border-[#4fd6ff] transition-colors">
                    <span className="material-symbols-outlined text-[#4fd6ff]">library_music</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-playfair font-bold text-neutral-100 mb-2">{text.why4Title}</h5>
                    <p className="text-neutral-500 leading-relaxed">{text.why4Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA — from Stitch */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00bbe4] opacity-5" />
        <div className="container mx-auto px-8 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-playfair font-bold text-neutral-100 mb-8 tracking-tighter italic">
            {text.ctaBottomTitle}
          </h2>
          <p className="text-xl text-neutral-400 mb-12">
            {text.ctaBottomSubtitle}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-block px-12 py-6 bg-[#f1bca6] text-[#492819] font-bold text-lg rounded-md hover:bg-[#d3a18c] transition-all duration-300 uppercase tracking-widest shadow-xl"
          >
            {text.ctaBottomButton}
          </a>
        </div>
      </section>
    </main>
  );
}
