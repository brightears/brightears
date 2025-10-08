import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HowItWorksContent from '@/components/content/HowItWorksContent';
import JsonLd from '@/components/JsonLd';
import {
  generateServiceSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorks' });

  const title = locale === 'th'
    ? 'วิธีการจองศิลปินใน 4 ขั้นตอนง่ายๆ | Bright Ears'
    : 'How to Book Entertainment in 4 Easy Steps | Bright Ears';

  const description = locale === 'th'
    ? 'เรียกดูศิลปินที่ได้รับการยืนยัน รับใบเสนอราคาทันที จองด้วยความมั่นใจ ไม่ต้องสมัครสมาชิก จองตรงจากเครือข่ายบันเทิงระดับพรีเมียมในกรุงเทพ'
    : 'Browse verified artists, get quotes instantly, book with confidence. No signup required. Direct booking from Bangkok\'s premium entertainment network.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/how-it-works`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-how-it-works.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - วิธีการจองศิลปิน'
          : 'Bright Ears - How to Book Entertainment'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-how-it-works.jpg']
    }
  };
}

export default async function HowItWorksPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  // Generate structured data
  const serviceSchema = generateServiceSchema({ locale });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      },
      {
        name: locale === 'th' ? 'วิธีการใช้งาน' : 'How It Works',
        url: `https://brightears.onrender.com/${locale}/how-it-works`
      }
    ]
  });

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumbSchema} />
      <HowItWorksContent locale={locale} />
    </>
  );
}
