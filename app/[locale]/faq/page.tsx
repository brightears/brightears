import { Metadata } from 'next';
import FAQContent from './FAQContent';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === 'th' ? 'คำถามที่พบบ่อย | Bright Ears' : 'FAQ | Bright Ears',
    description: locale === 'th'
      ? 'คำถามที่พบบ่อยเกี่ยวกับ Bright Ears - แพลตฟอร์มการจองศิลปินชั้นนำ'
      : 'Frequently Asked Questions about Bright Ears - Thailand\'s Leading Artist Booking Platform'
  };
}

export default function FAQPage() {
  return <FAQContent />;
}
