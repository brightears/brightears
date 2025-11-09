import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BMAsiaContent from './BMAsiaContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'BMAsia - บริการเพลงบรรยากาศสำหรับธุรกิจในไทย | Bright Ears'
    : 'BMAsia - Background Music Curation for Thai Businesses | Bright Ears';

  const description = locale === 'th'
    ? 'บริการจัดเพลงบรรยากาศมืออาชีพสำหรับโรงแรม ร้านอาหาร ร้านค้า และออฟฟิศ เพลย์ลิสต์ที่คัดสรรมาเป็นพิเศษเพื่อเสริมสร้างแบรนด์ของคุณ'
    : 'Professional background music curation service for hotels, restaurants, retail stores, and offices in Thailand. Curated playlists tailored to your brand.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'เพลงบรรยากาศ, เพลงธุรกิจ, เพลย์ลิสต์, เพลงโรงแรม, เพลงร้านอาหาร, เพลงร้านค้า, ไทย'
      : 'background music, business music, curated playlists, retail music, hotel music, restaurant music, Thailand',
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/bmasia`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-bmasia.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'BMAsia - เพลงบรรยากาศสำหรับธุรกิจ'
          : 'BMAsia - Background Music for Business'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-bmasia.jpg']
    }
  };
}

export default async function BMAsiaPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <BMAsiaContent locale={locale} />;
}
