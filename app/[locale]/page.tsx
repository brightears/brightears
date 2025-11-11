import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/components/navigation';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ActivityFeed from '@/components/home/ActivityFeed';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CorporateSection from '@/components/home/CorporateSection';
import MobileOptimizedHomepage from '@/components/mobile/MobileOptimizedHomepage';
import JsonLd from '@/components/JsonLd';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema
} from '@/lib/schemas/structured-data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'จองดีเจ วงดนตรี สำหรับโรงแรม | Bright Ears'
    : 'Book Live Entertainment for Hotels & Venues | Bright Ears';

  const description = locale === 'th'
    ? 'แพลตฟอร์มจองศิลปินชั้นนำของไทย ดีเจและวงดนตรีมืออาชีพ 500+ คน งาน 10,000+ งาน ไม่มีค่าคอมมิชชั่น จองตรงจากเครือข่ายบันเทิงระดับพรีเมียมในกรุงเทพ'
    : "Thailand's largest entertainment booking platform. 500+ verified artists, 10K+ events delivered. Book DJs, bands, musicians for your Bangkok venue with zero commission.";

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'จองดีเจ, วงดนตรี, ศิลปิน, กรุงเทพ, โรงแรม, งานบริษัท, ไม่มีค่าคอมมิชชั่น, PromptPay, Bright Ears'
      : 'book DJ, band booking, musicians, Bangkok, hotels, corporate events, zero commission, PromptPay, entertainment booking, Bright Ears',
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-home.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - แพลตฟอร์มจองศิลปินชั้นนำของไทย'
          : 'Bright Ears - Book Live Entertainment for Hotels & Venues'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-home.jpg'],
      site: '@brightears',
      creator: '@brightears',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'th': '/th',
        'x-default': '/en',
      }
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations();

  // Generate structured data schemas
  const organizationSchema = generateOrganizationSchema({ locale });
  const localBusinessSchema = generateLocalBusinessSchema({
    locale,
    aggregateRating: {
      ratingValue: '4.9',
      reviewCount: '500'
    }
  });
  const breadcrumbSchema = generateBreadcrumbSchema({
    items: [
      {
        name: locale === 'th' ? 'หน้าแรก' : 'Home',
        url: `https://brightears.onrender.com/${locale}`
      }
    ]
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
      <MobileOptimizedHomepage locale={locale} />
    </>
  );
}
