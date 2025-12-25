import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bright Ears - Terms of Service',
  description: 'Legal terms and conditions for Bright Ears entertainment booking platform',
  keywords: ['terms of service', 'legal', 'bright ears', 'entertainment booking', 'thailand'],
};

export default function TermsOfService() {
  const t = useTranslations('TermsOfService');

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
          <h2>{t('platformModel.title')}</h2>
          <ul>
            <li>{t('platformModel.commissionFree')}</li>
            <li>{t('platformModel.marketplaceRole')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('artistResponsibilities.title')}</h2>
          <ol>
            <li>{t('artistResponsibilities.profileAccuracy')}</li>
            <li>{t('artistResponsibilities.contentRights')}</li>
            <li>{t('artistResponsibilities.performanceCommitment')}</li>
          </ol>
        </section>

        <section>
          <h2>{t('bookingTerms.title')}</h2>
          <ul>
            <li>{t('bookingTerms.deposits')}</li>
            <li>{t('bookingTerms.cancellationPolicy')}</li>
            <li>{t('bookingTerms.rescheduleRules')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('payments.title')}</h2>
          <p>{t('payments.promptpayDescription')}</p>
          <ul>
            <li>{t('payments.processingFees')}</li>
            <li>{t('payments.refundPolicy')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('disputeResolution.title')}</h2>
          <p>{t('disputeResolution.process')}</p>
          <p>{t('disputeResolution.jurisdiction')}</p>
        </section>

        <section>
          <h2>{t('intellectualProperty.title')}</h2>
          <p>{t('intellectualProperty.userContent')}</p>
          <p>{t('intellectualProperty.platformRights')}</p>
        </section>

        <section>
          <h2>{t('limitations.title')}</h2>
          <ul>
            <li>{t('limitations.liability')}</li>
            <li>{t('limitations.indemnification')}</li>
          </ul>
        </section>

        <section>
          <h2>{t('userEligibility.title')}</h2>
          <p>{t('userEligibility.ageRequirement')}</p>
          <p>{t('userEligibility.residencyRestriction')}</p>
        </section>

        <section className="text-sm text-gray-600 mt-8">
          <p>{t('disclaimer')}</p>
        </section>
      </div>
    </div>
  );
}