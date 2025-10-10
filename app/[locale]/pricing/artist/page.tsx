import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ArtistPricingContent from './ArtistPricingContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'แพ็กเกจราคาสำหรับศิลปิน | Bright Ears'
    : 'Artist Pricing Plans | Bright Ears';

  const description = locale === 'th'
    ? 'เลือกระดับความสำเร็จของคุณ เริ่มฟรีตลอดกาล อัปเกรดเมื่อพร้อม ค่าคอมมิชชั่น 0% ทุกแพ็กเกจ'
    : 'Choose your success level. Start free forever, upgrade when ready. Zero commission on all tiers.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/pricing/artist`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-artist-pricing.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - แพ็กเกจราคาสำหรับศิลปิน'
          : 'Bright Ears - Artist Pricing Plans'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-artist-pricing.jpg']
    }
  };
}

export default async function ArtistPricingPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <ArtistPricingContent locale={locale} />;
}
