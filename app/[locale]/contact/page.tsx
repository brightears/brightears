import { Metadata } from 'next';
import ContactContent from './ContactContent';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'ติดต่อ Bright Ears - ขอความช่วยเหลือ & ความช่วยเหลือ'
    : 'Contact Bright Ears - Get Help & Support';

  const description = locale === 'th'
    ? 'ติดต่อทีมของเราทาง อีเมล LINE หรือโทรศัพท์ คำถามทั่วไป ความร่วมมือองค์กร และความช่วยเหลือศิลปิน เราตอบกลับภายใน 24 ชั่วโมง'
    : 'Reach our team via email, LINE, or phone. General inquiries, corporate partnerships, and artist support. We respond within 24 hours.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://brightears.onrender.com/${locale}/contact`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{
        url: '/og-images/og-image-contact.jpg',
        width: 1200,
        height: 630,
        alt: locale === 'th'
          ? 'Bright Ears - ติดต่อเรา'
          : 'Bright Ears - Contact Us'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-contact.jpg']
    }
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
