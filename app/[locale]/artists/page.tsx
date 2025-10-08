import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ArtistsPageContent from '@/components/content/ArtistsPageContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'artists' });

  const title = locale === 'th'
    ? 'เรียกดูดีเจ วงดนตรี และนักดนตรีที่ได้รับการยืนยัน 500+ คนในกรุงเทพ'
    : 'Browse 500+ Verified DJs, Bands & Musicians in Bangkok';

  const description = locale === 'th'
    ? 'ค้นหาศิลปินที่ได้รับการยืนยันสำหรับสถานที่หรืองานของคุณ กรองตามหมวดหมู่ ราคา สถานที่ อ่านรีวิว ตรวจสอบความพร้อม จองโดยตรง'
    : 'Find verified entertainers for your venue or event. Filter by category, price, location. Read reviews, check availability, book directly.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/artists`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-artists-listing.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - เรียกดูศิลปินทั้งหมด'
          : 'Bright Ears - Browse All Artists'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-artists-listing.jpg']
    }
  };
}

export default async function ArtistsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'artists' });

  return (
    <ArtistsPageContent
      locale={locale}
      title={t('title')}
      subtitle={t('subtitle')}
    />
  );
}
