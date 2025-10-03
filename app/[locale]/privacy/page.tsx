import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bright Ears - Privacy Policy',
  description: 'Data protection and privacy policy for Bright Ears entertainment booking platform',
  keywords: ['privacy policy', 'data protection', 'PDPA', 'GDPR', 'bright ears'],
};

export default function PrivacyPolicy() {
  const t = useTranslations('PrivacyPolicy');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl glass-morphism bg-gradient-to-br from-primary-50 to-primary-100">
      <h1 className="text-4xl font-playfair text-gray-900 mb-6 border-b pb-4">
        {t('title')}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section>
          <h2>{t('lastUpdated.title')}</h2>
          <p>{t('lastUpdated.date')}</p>
        </section>

        <section>
          <h2>{t('introduction.title')}</h2>
          <p>{t('introduction.description')}</p>
        </section>

        <section>
          <h2>{t('dataCollection.title')}</h2>
          <ul>
            <li>{t('dataCollection.personalInfo')}</li>
            <li>{t('dataCollection.contactDetails')}</li>
            <li>{t('dataCollection.bookingHistory')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('pdpaCompliance.title')}</h2>
          <p>{t('pdpaCompliance.description')}</p>
          <ul>
            <li>{t('pdpaCompliance.consentMechanism')}</li>
            <li>{t('pdpaCompliance.dataRetention')}</li>
            <li>{t('pdpaCompliance.userRights')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('gdprRights.title')}</h2>
          <ul>
            <li>{t('gdprRights.access')}</li>
            <li>{t('gdprRights.erasure')}</li>
            <li>{t('gdprRights.portability')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('thirdPartyIntegrations.title')}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">{t('thirdPartyIntegrations.serviceHeader')}</th>
                <th className="border p-2">{t('thirdPartyIntegrations.dataHandledHeader')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">{t('thirdPartyIntegrations.clerk.name')}</td>
                <td className="border p-2">{t('thirdPartyIntegrations.clerk.data')}</td>
              </tr>
              <tr>
                <td className="border p-2">{t('thirdPartyIntegrations.promtpay.name')}</td>
                <td className="border p-2">{t('thirdPartyIntegrations.promtpay.data')}</td>
              </tr>
              <tr>
                <td className="border p-2">{t('thirdPartyIntegrations.line.name')}</td>
                <td className="border p-2">{t('thirdPartyIntegrations.line.data')}</td>
              </tr>
              <tr>
                <td className="border p-2">{t('thirdPartyIntegrations.cloudinary.name')}</td>
                <td className="border p-2">{t('thirdPartyIntegrations.cloudinary.data')}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>{t('cookies.title')}</h2>
          <p>{t('cookies.description')}</p>
          <ul>
            <li>{t('cookies.analytics')}</li>
            <li>{t('cookies.performance')}</li>
            <li>{t('cookies.userPreferences')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('contactInfo.title')}</h2>
          <p>{t('contactInfo.dataProtectionOfficer')}</p>
          <address>
            {t('contactInfo.address')}
            <br />
            {t('contactInfo.email')}
            <br />
            {t('contactInfo.phone')}
          </address>
        </section>

        <section className="text-sm text-gray-600 mt-8">
          <p>{t('disclaimer')}</p>
        </section>
      </div>
    </div>
  );
}