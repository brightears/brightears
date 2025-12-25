import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CorporateContent from '@/components/content/CorporateContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'โซลูชันความบันเทิงสำหรับงานองค์กร | Bright Ears'
    : 'Corporate Event Entertainment Solutions | Bright Ears';

  const description = locale === 'th'
    ? 'ความบันเทิงระดับองค์กรสำหรับบริษัทชั้นนำของไทย สถานที่กว่า 500 แห่งในกรุงเทพไว้วางใจเราสำหรับงานองค์กร งานเลี้ยง และการประชุมผู้บริหาร'
    : 'Enterprise entertainment for Thailand\'s leading companies. 500+ Bangkok venues trust us for corporate events, galas, and executive gatherings.';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'งานบริษัท, ความบันเทิงองค์กร, ดีเจงานบริษัท, วงดนตรีงานเลี้ยง, กรุงเทพ, โรงแรม, Bright Ears'
      : 'corporate events, enterprise entertainment, corporate DJ, gala band, Bangkok, hotels, executive events, Bright Ears',
    openGraph: {
      title,
      description,
      url: `/${locale}/corporate`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-corporate.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - โซลูชันความบันเทิงสำหรับงานองค์กร'
          : 'Bright Ears - Corporate Event Entertainment Solutions'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-corporate.jpg']
    },
    alternates: {
      canonical: `/${locale}/corporate`,
      languages: {
        'en': '/en/corporate',
        'th': '/th/corporate',
      }
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function CorporatePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return <CorporateContent locale={locale} />;
}
