import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import FAQContent from './FAQContent';
import JsonLd from '@/components/JsonLd';
import {
  generateFAQSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'คำถามที่พบบ่อย - การจอง & ศิลปิน | Bright Ears'
    : 'Frequently Asked Questions - Booking & Artists | Bright Ears';

  const description = locale === 'th'
    ? 'รับคำตอบเกี่ยวกับการจองศิลปิน การยืนยันตัวตน การชำระเงิน และอื่นๆ ค้นหาอย่างรวดเร็วจากคำถามทั่วไป 20+ ข้อ'
    : 'Get answers about booking entertainment, artist verification, payments, and more. Quick search through 20+ common questions.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/faq`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-faq.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - คำถามที่พบบ่อย'
          : 'Bright Ears - Frequently Asked Questions'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-faq.jpg']
    }
  };
}

export default async function FAQPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations('faq');

  // Generate FAQ items for structured data (top 10 most important)
  const faqItems = [
    {
      question: t('questions.customer.1.question'),
      answer: t('questions.customer.1.answer')
    },
    {
      question: t('questions.customer.2.question'),
      answer: t('questions.customer.2.answer')
    },
    {
      question: t('questions.customer.3.question'),
      answer: t('questions.customer.3.answer')
    },
    {
      question: t('questions.customer.4.question'),
      answer: t('questions.customer.4.answer')
    },
    {
      question: t('questions.customer.5.question'),
      answer: t('questions.customer.5.answer')
    },
    {
      question: t('questions.artist.1.question'),
      answer: t('questions.artist.1.answer')
    },
    {
      question: t('questions.artist.2.question'),
      answer: t('questions.artist.2.answer')
    },
    {
      question: t('questions.artist.3.question'),
      answer: t('questions.artist.3.answer')
    },
    {
      question: t('questions.artist.4.question'),
      answer: t('questions.artist.4.answer')
    },
    {
      question: t('questions.artist.5.question'),
      answer: t('questions.artist.5.answer')
    }
  ];

  // Generate structured data
  const faqSchema = generateFAQSchema({ faqs: faqItems });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      },
      {
        name: locale === 'th' ? 'คำถามที่พบบ่อย' : 'FAQ',
        url: `https://brightears.onrender.com/${locale}/faq`
      }
    ]
  });

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />
      <FAQContent />
    </>
  );
}
