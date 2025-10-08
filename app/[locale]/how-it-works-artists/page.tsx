import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HowItWorksArtistsContent from './HowItWorksArtistsContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'howItWorksArtists' });

  const title = locale === 'th'
    ? 'ได้รับรายได้มากขึ้นด้วยค่าคอมมิชชั่น 0% - แพลตฟอร์มศิลปิน | Bright Ears'
    : 'Earn More with 0% Commission - Artist Platform | Bright Ears';

  const description = locale === 'th'
    ? 'เข้าร่วมกับศิลปินกว่า 500 คนในกรุงเทพที่ได้รับรายได้มากขึ้นโดยไม่มีค่าธรรมเนียม รับงานจากโรงแรมและงานองค์กร ได้รับการยืนยันใน 24 ชั่วโมง กำหนดราคาของคุณเอง รับเงินทันที'
    : 'Join 500+ Bangkok artists earning more with zero fees. Direct bookings from hotels & corporate events. Get verified in 24 hours, set your rates, get paid instantly.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/how-it-works-artists`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-artists.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - แพลตฟอร์มสำหรับศิลปิน 0% ค่าคอมมิชชั่น'
          : 'Bright Ears - Artist Platform with 0% Commission'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-artists.jpg']
    }
  };
}

export default async function HowItWorksArtistsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <HowItWorksArtistsContent locale={locale} />;
}
