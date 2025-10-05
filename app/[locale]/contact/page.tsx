import { Metadata } from 'next';
import ContactContent from './ContactContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'th' ? 'ติดต่อเรา | Bright Ears' : 'Contact Us | Bright Ears',
    description: locale === 'th'
      ? 'ติดต่อ Bright Ears - แพลตฟอร์มการจองศิลปินชั้นนำของประเทศไทย'
      : 'Contact Bright Ears - Thailand\'s Leading Artist Booking Platform'
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
