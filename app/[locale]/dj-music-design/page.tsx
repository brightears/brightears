import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import DJMusicDesignContent from './DJMusicDesignContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'DJ Music Design & Production Services | การออกแบบและผลิตเพลงสำหรับ DJ | Bright Ears'
    : 'DJ Music Design & Production Services | Custom Mixes, Remixes, Tracks | Bright Ears';

  const description = locale === 'th'
    ? 'บริการผลิตเพลงมืออาชีพสำหรับ DJ - มิกซ์เฉพาะตัว, ผลิตแทร็กต้นฉบับ, รีมิกซ์, และพัฒนาแบรนด์เสียงสำหรับ DJ มืออาชีพและมือใหม่ในประเทศไทย'
    : 'Professional DJ music production services in Thailand. Custom mixes, original tracks, remixes, and DJ branding for professional and aspiring DJs.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'DJ music production, custom DJ mix, remix services, DJ branding, music design Thailand, DJ mentorship, track production, การผลิตเพลง DJ, มิกซ์เฉพาะตัว, รีมิกซ์, แบรนด์ DJ'
      : 'DJ music production, custom DJ mix, remix services, DJ branding, music design Thailand, DJ mentorship, track production',
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/dj-music-design`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-dj-music-design.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'DJ Music Design - การผลิตเพลงสำหรับ DJ'
          : 'DJ Music Design - Professional Music Production for DJs'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-dj-music-design.jpg']
    }
  };
}

export default async function DJMusicDesignPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <DJMusicDesignContent locale={locale} />;
}
