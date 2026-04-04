import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/lib/schemas/structured-data';
import { Link } from '@/components/navigation';
import FAQAccordion from './FAQAccordion';

const faqData = {
  en: [
    {
      question: 'How does BrightEars work?',
      answer: 'We manage your venue\'s entertainment operations end-to-end: scheduling DJs nightly, handling substitutions, collecting performance feedback, and providing one monthly invoice.',
    },
    {
      question: 'What happens if a DJ cancels?',
      answer: 'We guarantee a replacement within 2 hours. Our roster of 25+ professional DJs means there\'s always a backup available.',
    },
    {
      question: 'How do you match DJs to my venue?',
      answer: 'We analyze your venue\'s style, clientele, and music preferences, then assign genre-matched DJs from our curated roster. Venue managers rate each performance, and we use this feedback to continuously improve the match.',
    },
    {
      question: 'What does it cost?',
      answer: 'Pricing depends on your venue\'s needs \u2014 number of nights, hours per set, and level of service. Contact us for a custom quote.',
    },
    {
      question: 'Can I choose specific DJs?',
      answer: 'Yes. You can request specific DJs, and we\'ll prioritize them in your schedule based on availability.',
    },
    {
      question: 'How do you handle music direction?',
      answer: 'We provide DJs with venue-specific music briefs and reference playlists. Venue managers can give real-time feedback through our LINE integration.',
    },
    {
      question: 'What\'s included in the service?',
      answer: 'DJ scheduling and management, backup DJ guarantee, nightly performance feedback collection, music direction guidance, monthly performance reports, and simplified invoicing.',
    },
    {
      question: 'Do you handle contracts and payments?',
      answer: 'Yes. One contract, one monthly invoice. We handle all DJ payments, withholding taxes, and administrative paperwork.',
    },
    {
      question: 'What venues do you work with?',
      answer: 'We specialize in premium hotels, restaurants, and bars in Bangkok. Our clients include properties under Marriott, Hilton, Centara, and Accor groups.',
    },
    {
      question: 'How do I get started?',
      answer: 'Contact us through the form on our website or reach out via LINE. We\'ll schedule a meeting to understand your venue\'s needs and propose a tailored entertainment program.',
    },
    {
      question: 'Can you provide entertainment for private events?',
      answer: 'Yes. We offer DJ services for corporate events, private parties, and special occasions at our partner venues or external locations.',
    },
    {
      question: 'What areas do you cover?',
      answer: 'Currently Bangkok. We\'re expanding to other Thai destinations.',
    },
  ],
  th: [
    {
      question: 'BrightEars ทำงานอย่างไร?',
      answer: 'เราจัดการด้านความบันเทิงของสถานที่ของคุณแบบครบวงจร ตั้งแต่การจัดตารางดีเจทุกคืน การจัดหาตัวแทน การเก็บรวบรวมฟีดแบ็คการแสดง และออกใบแจ้งหนี้รายเดือนเพียงใบเดียว',
    },
    {
      question: 'ถ้าดีเจยกเลิกจะเกิดอะไรขึ้น?',
      answer: 'เรารับประกันการจัดหาตัวแทนภายใน 2 ชั่วโมง ด้วยรายชื่อดีเจมืออาชีพกว่า 25 คน จึงมีตัวสำรองพร้อมเสมอ',
    },
    {
      question: 'คุณจับคู่ดีเจกับสถานที่อย่างไร?',
      answer: 'เราวิเคราะห์สไตล์ของสถานที่ ลูกค้า และความชอบด้านเพลง จากนั้นจัดสรรดีเจที่ตรงกับแนวเพลงจากรายชื่อที่คัดสรรมา ผู้จัดการสถานที่ให้คะแนนการแสดงแต่ละครั้ง และเราใช้ฟีดแบ็คนี้เพื่อปรับปรุงการจับคู่อย่างต่อเนื่อง',
    },
    {
      question: 'ค่าบริการเท่าไร?',
      answer: 'ราคาขึ้นอยู่กับความต้องการของสถานที่ \u2014 จำนวนคืน ชั่วโมงต่อเซ็ต และระดับบริการ ติดต่อเราเพื่อขอใบเสนอราคาเฉพาะ',
    },
    {
      question: 'เลือกดีเจเฉพาะคนได้ไหม?',
      answer: 'ได้ คุณสามารถขอดีเจเฉพาะคน แล้วเราจะจัดลำดับความสำคัญในตารางตามความพร้อม',
    },
    {
      question: 'คุณจัดการเรื่องทิศทางเพลงอย่างไร?',
      answer: 'เราจัดทำบรีฟเพลงและเพลย์ลิสต์อ้างอิงเฉพาะสถานที่ให้กับดีเจ ผู้จัดการสถานที่สามารถให้ฟีดแบ็คแบบเรียลไทม์ผ่าน LINE ของเรา',
    },
    {
      question: 'บริการครอบคลุมอะไรบ้าง?',
      answer: 'การจัดตารางและจัดการดีเจ การรับประกันดีเจสำรอง การเก็บฟีดแบ็คการแสดงทุกคืน คำแนะนำทิศทางเพลง รายงานผลการปฏิบัติงานรายเดือน และระบบออกใบแจ้งหนี้แบบง่าย',
    },
    {
      question: 'คุณจัดการสัญญาและการชำระเงินด้วยไหม?',
      answer: 'ใช่ สัญญาเดียว ใบแจ้งหนี้รายเดือนเพียงใบเดียว เราจัดการการจ่ายเงินดีเจทั้งหมด ภาษีหัก ณ ที่จ่าย และงานเอกสารทั้งหมด',
    },
    {
      question: 'คุณทำงานกับสถานที่ประเภทไหน?',
      answer: 'เราเชี่ยวชาญโรงแรม ร้านอาหาร และบาร์ระดับพรีเมียมในกรุงเทพ ลูกค้าของเราได้แก่สถานที่ภายใต้เครือ Marriott, Hilton, Centara และ Accor',
    },
    {
      question: 'เริ่มต้นอย่างไร?',
      answer: 'ติดต่อเราผ่านแบบฟอร์มบนเว็บไซต์หรือทาง LINE เราจะนัดประชุมเพื่อทำความเข้าใจความต้องการของสถานที่และเสนอโปรแกรมความบันเทิงที่ออกแบบมาเฉพาะ',
    },
    {
      question: 'จัดหาความบันเทิงสำหรับงานส่วนตัวได้ไหม?',
      answer: 'ได้ เราให้บริการดีเจสำหรับงานองค์กร งานปาร์ตี้ส่วนตัว และโอกาสพิเศษที่สถานที่พันธมิตรหรือสถานที่ภายนอก',
    },
    {
      question: 'ให้บริการในพื้นที่ไหนบ้าง?',
      answer: 'ปัจจุบันในกรุงเทพ เรากำลังขยายไปยังจุดหมายปลายทางอื่นๆ ในประเทศไทย',
    },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === 'th'
      ? 'คำถามที่พบบ่อย | Bright Ears'
      : 'Frequently Asked Questions | Bright Ears';

  const description =
    locale === 'th'
      ? 'คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการจัดการดีเจและความบันเทิงของ Bright Ears สำหรับโรงแรมและสถานที่ในกรุงเทพ'
      : 'Answers to common questions about Bright Ears DJ management and entertainment services for hotels and venues in Bangkok.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/faq`,
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
      canonical: `/${locale}/faq`,
      languages: {
        en: '/en/faq',
        th: '/th/faq',
        'x-default': '/en/faq',
      },
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const faqs = locale === 'th' ? faqData.th : faqData.en;

  const faqSchema = generateFAQSchema({ faqs });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.io/${locale}`,
      },
      {
        name: locale === 'th' ? 'คำถามที่พบบ่อย' : 'FAQ',
        url: `https://brightears.io/${locale}/faq`,
      },
    ],
  });

  return (
    <>
      <JsonLd data={[faqSchema, breadcrumbSchema]} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-teal via-deep-teal/95 to-deep-teal/90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-pure-white mb-4">
            {locale === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-lg text-pure-white/70 max-w-2xl mx-auto">
            {locale === 'th'
              ? 'ทุกสิ่งที่คุณต้องรู้เกี่ยวกับบริการจัดการความบันเทิงของ Bright Ears'
              : 'Everything you need to know about Bright Ears entertainment management services'}
          </p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="relative pb-20 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-teal/90 to-deep-teal" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20">
        <div className="absolute inset-0 bg-deep-teal" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 backdrop-blur-sm">
            <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-pure-white mb-4">
              {locale === 'th' ? 'ยังมีคำถาม?' : 'Still have questions?'}
            </h2>
            <p className="text-pure-white/70 mb-8">
              {locale === 'th'
                ? 'ติดต่อเราเพื่อพูดคุยเกี่ยวกับความต้องการด้านความบันเทิงของสถานที่ของคุณ'
                : 'Get in touch to discuss your venue\'s entertainment needs.'}
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-8 py-3 bg-brand-cyan text-white font-inter font-semibold rounded-xl transition-all duration-300 hover:bg-brand-cyan/90 hover:shadow-lg hover:shadow-brand-cyan/25"
            >
              {locale === 'th' ? 'ติดต่อเรา' : 'Get in Touch'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
