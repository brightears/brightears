import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import { useState } from 'react';
import ContactForm from '@/components/ContactForm';

type ContactTab = 'general' | 'corporate' | 'artistSupport';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: params.locale === 'th' ? 'ติดต่อเรา | Bright Ears' : 'Contact Us | Bright Ears',
    description: params.locale === 'th'
      ? 'ติดต่อ Bright Ears - แพลตฟอร์มการจองศิลปินชั้นนำของประเทศไทย'
      : 'Contact Bright Ears - Thailand\'s Leading Artist Booking Platform'
  };
}

export default function ContactPage() {
  const t = useTranslations('contact');
  const [activeTab, setActiveTab] = useState<ContactTab>('general');

  const contactInfo = {
    email: 'support@brightears.com',
    line: '@brightears',
    hours: '9 AM - 6 PM (Bangkok Time, Mon-Fri)',
    location: 'Bangkok, Thailand'
  };

  const tabs: { id: ContactTab; label: string }[] = [
    { id: 'general', label: t('tabs.general') },
    { id: 'corporate', label: t('tabs.corporate') },
    { id: 'artistSupport', label: t('tabs.artistSupport') }
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </section>

        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg">
          <div className="flex justify-center mb-8 space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ContactForm tab={activeTab} />
        </div>

        <section className="mt-12 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-6">{t('contactInfo')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">{t('contactMethods')}</h3>
              <p>📧 {t('email')}: {contactInfo.email}</p>
              <p>💬 {t('line')}: {contactInfo.line}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">{t('operatingHours')}</h3>
              <p>🕒 {t('hours')}: {contactInfo.hours}</p>
              <p>📍 {t('location')}: {contactInfo.location}</p>
            </div>
          </div>
        </section>

        <section className="mt-12 text-center">
          <p className="text-xl mb-4">{t('responseTime')}</p>
          <a
            href="/faq"
            className="text-cyan-600 hover:underline"
          >
            {t('checkFAQ')}
          </a>
        </section>
      </div>
    </div>
  );
}