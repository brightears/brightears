export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย'
};

export const localeCurrencies: Record<Locale, string> = {
  en: 'THB',
  th: 'THB'
};