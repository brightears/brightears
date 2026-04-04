import { Metadata } from 'next';

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
    ? 'บริการดีเจสำหรับงานอีเวนต์ส่วนตัว งานบริษัท ปาร์ตี้ และงานเฉลิมฉลองในกรุงเทพ จัดการครบวงจรโดย Bright Ears'
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
    heroTitle: 'Entertainment for Your Special Event',
    heroSubtitle: 'Professional DJ services for corporate events, private parties, and celebrations at Bangkok\'s finest venues.',
    whatWeOfferTitle: 'What We Offer',
    corporate: 'Corporate Events',
    corporateDesc: 'Product launches, company parties, team celebrations, and conferences. We set the tone for your brand.',
    private: 'Private Celebrations',
    privateDesc: 'Birthdays, anniversaries, engagement parties, and milestone events. Music tailored to your occasion.',
    special: 'Special Occasions',
    specialDesc: 'Holiday events, themed nights, VIP gatherings. We bring the energy your event deserves.',
    venue: 'Venue Events',
    venueDesc: 'Songkran parties, New Year celebrations, wine dinners. Curated music for Bangkok\'s premier venues.',
    howItWorksTitle: 'How It Works',
    step1Title: 'Tell Us About Your Event',
    step1Desc: 'Share the details — date, venue, style, and number of guests. We\'ll take it from there.',
    step2Title: 'We Recommend the Perfect DJ',
    step2Desc: 'Based on your event\'s vibe, we match you with the ideal DJ and music program from our roster of 25+ professionals.',
    step3Title: 'We Handle Everything',
    step3Desc: 'From sound check to the last track — setup, performance, coordination. One contact, zero stress.',
    whyTitle: 'Why Choose BrightEars for Events',
    why1Title: '25+ Professional DJs',
    why1Desc: 'Deep house to hip-hop, lounge to high-energy — every genre covered by experienced professionals.',
    why2Title: 'Premium Venue Experience',
    why2Desc: 'Our DJs perform nightly at NOBU, Marriott, and Hilton properties. They know how to read a room.',
    why3Title: 'One Contact, One Invoice',
    why3Desc: 'No chasing multiple vendors. We handle DJ sourcing, logistics, and coordination end-to-end.',
    why4Title: 'Custom Music Curation',
    why4Desc: 'Every event gets a tailored music program. Tell us the mood — we\'ll build the soundtrack.',
    ctaTitle: 'Ready to Plan Your Event?',
    ctaSubtitle: 'Tell us about your event and we\'ll recommend the perfect entertainment.',
    ctaButton: 'Plan Your Event',
  },
  th: {
    heroTitle: 'ความบันเทิงสำหรับงานพิเศษของคุณ',
    heroSubtitle: 'บริการดีเจมืออาชีพสำหรับงานบริษัท ปาร์ตี้ส่วนตัว และงานเฉลิมฉลองในสถานที่ชั้นนำของกรุงเทพ',
    whatWeOfferTitle: 'บริการของเรา',
    corporate: 'งานบริษัท',
    corporateDesc: 'งานเปิดตัวผลิตภัณฑ์ ปาร์ตี้บริษัท งานเลี้ยงทีม และการประชุม เราสร้างบรรยากาศให้แบรนด์ของคุณ',
    private: 'งานเฉลิมฉลองส่วนตัว',
    privateDesc: 'วันเกิด วันครบรอบ ปาร์ตี้หมั้น และงานสำคัญ ดนตรีที่ออกแบบมาเพื่อโอกาสของคุณ',
    special: 'งานพิเศษ',
    specialDesc: 'งานวันหยุด ไนท์ธีม งาน VIP เราส่งมอบพลังงานที่งานของคุณสมควรได้รับ',
    venue: 'อีเวนต์สถานที่',
    venueDesc: 'ปาร์ตี้สงกรานต์ งานฉลองปีใหม่ ไวน์ดินเนอร์ ดนตรีคัดสรรสำหรับสถานที่ชั้นนำของกรุงเทพ',
    howItWorksTitle: 'ขั้นตอนการทำงาน',
    step1Title: 'บอกเราเกี่ยวกับงานของคุณ',
    step1Desc: 'แจ้งรายละเอียด — วันที่ สถานที่ สไตล์ และจำนวนแขก เราจะดูแลต่อให้',
    step2Title: 'เราแนะนำดีเจที่เหมาะสม',
    step2Desc: 'จากบรรยากาศงานของคุณ เราจับคู่กับดีเจและโปรแกรมเพลงที่เหมาะสมจากทีมดีเจกว่า 25 คน',
    step3Title: 'เราจัดการทุกอย่าง',
    step3Desc: 'ตั้งแต่เช็คเสียงจนถึงเพลงสุดท้าย — เซ็ตอัพ การแสดง การประสานงาน ติดต่อจุดเดียว ไม่ต้องกังวล',
    whyTitle: 'ทำไมต้องเลือก BrightEars สำหรับงานอีเวนต์',
    why1Title: 'ดีเจมืออาชีพกว่า 25 คน',
    why1Desc: 'ดีปเฮาส์ถึงฮิปฮอป เลานจ์ถึงไฮเอเนอร์จี — ครบทุกแนวเพลงโดยมืออาชีพ',
    why2Title: 'ประสบการณ์สถานที่ระดับพรีเมียม',
    why2Desc: 'ดีเจของเราเล่นทุกคืนที่ NOBU, Marriott และ Hilton พวกเขารู้วิธีอ่านบรรยากาศห้อง',
    why3Title: 'ติดต่อจุดเดียว ใบแจ้งหนี้เดียว',
    why3Desc: 'ไม่ต้องติดต่อหลายเจ้า เราจัดหาดีเจ โลจิสติกส์ และประสานงานครบวงจร',
    why4Title: 'คัดสรรเพลงเฉพาะงาน',
    why4Desc: 'ทุกงานได้รับโปรแกรมเพลงที่ออกแบบมาเฉพาะ บอกบรรยากาศ — เราสร้างเพลงประกอบให้',
    ctaTitle: 'พร้อมวางแผนงานอีเวนต์ของคุณ?',
    ctaSubtitle: 'บอกเราเกี่ยวกับงานของคุณ เราจะแนะนำความบันเทิงที่เหมาะสม',
    ctaButton: 'วางแผนงานอีเวนต์',
  }
};

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const text = locale === 'th' ? t.th : t.en;

  const eventTypes = [
    {
      title: text.corporate,
      description: text.corporateDesc,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
          <rect x="4" y="8" width="24" height="20" rx="2" strokeWidth="2" />
          <path d="M12 8V4h8v4" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 16h24" strokeWidth="2" />
          <circle cx="16" cy="20" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: text.private,
      description: text.privateDesc,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
          <path d="M16 4l2.5 6h6.5l-5 4 2 6.5L16 17l-6 3.5 2-6.5-5-4h6.5L16 4z" strokeWidth="2" strokeLinejoin="round" />
          <path d="M8 26h16" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 29h12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: text.special,
      description: text.specialDesc,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
          <path d="M16 2v4M6 8l2.8 2.8M26 8l-2.8 2.8M4 18h4M24 18h4" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="18" r="8" strokeWidth="2" />
          <path d="M13 16l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: text.venue,
      description: text.venueDesc,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
          <path d="M4 28h24" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 28V14l10-10 10 10v14" strokeWidth="2" strokeLinejoin="round" />
          <rect x="12" y="18" width="8" height="10" strokeWidth="2" />
          <path d="M14 14h4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const steps = [
    { number: '01', title: text.step1Title, description: text.step1Desc },
    { number: '02', title: text.step2Title, description: text.step2Desc },
    { number: '03', title: text.step3Title, description: text.step3Desc },
  ];

  const reasons = [
    {
      title: text.why1Title,
      description: text.why1Desc,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: text.why2Title,
      description: text.why2Desc,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: text.why3Title,
      description: text.why3Desc,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: text.why4Title,
      description: text.why4Desc,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-deep-teal/90 to-stone-900">
      {/* Hero Section */}
      <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-brand-cyan/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-earthy-brown/10 rounded-full filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-soft-lavender/5 rounded-full filter blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {text.heroTitle}
          </h1>
          <p className="font-inter text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10">
            {text.heroSubtitle}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white font-inter font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-cyan/90 hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5"
          >
            {text.ctaButton}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-800 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-earthy-brown/10 rounded-full filter blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {text.whatWeOfferTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-full flex items-center justify-center ring-4 ring-brand-cyan/20 group-hover:ring-brand-cyan/40 transition-all text-white">
                  {event.icon}
                </div>
                <h3 className="font-playfair text-xl font-bold text-white mb-3">
                  {event.title}
                </h3>
                <p className="font-inter text-sm text-stone-400 leading-relaxed">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-900 to-stone-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {text.howItWorksTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector line on desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-brand-cyan/40 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20 rounded-full flex items-center justify-center border border-brand-cyan/30">
                    <span className="font-playfair text-3xl font-bold text-brand-cyan">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="font-inter text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-deep-teal relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-cyan/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-soft-lavender/10 rounded-full filter blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {text.whyTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 hover:border-brand-cyan/30 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform duration-300">
                  {reason.icon}
                </div>
                <h3 className="font-inter font-semibold text-lg text-white mb-3">
                  {reason.title}
                </h3>
                <p className="font-inter text-white/70 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-900 via-deep-teal/80 to-earthy-brown/80 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">
            {text.ctaTitle}
          </h2>
          <p className="font-inter text-lg text-white/70 mb-8">
            {text.ctaSubtitle}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-cyan text-white font-inter font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-cyan/90 hover:shadow-lg hover:shadow-brand-cyan/25 hover:-translate-y-0.5"
          >
            {text.ctaButton}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
