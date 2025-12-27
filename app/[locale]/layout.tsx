import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';
import { Inter, Playfair_Display, Noto_Sans_Thai } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  display: 'swap',
  variable: '--font-noto-thai',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL('https://brightears.onrender.com'),
    title: locale === 'th'
      ? 'Bright Ears - จองดีเจ วงดนตรี และศิลปินในประเทศไทย'
      : 'Bright Ears - Book DJs, Bands & Entertainment Thailand',
    description: locale === 'th'
      ? 'จองดีเจ วงดนตรี และศิลปินมืออาชีพสำหรับงานในประเทศไทย ไม่มีค่าคอมมิชชั่น ได้รับความไว้วางใจจากโรงแรมและสถานที่ชั้นนำ'
      : 'Book professional DJs, bands, and entertainment for events in Thailand. No commission fees. Trusted by leading hotels and venues.',
    keywords: locale === 'th'
      ? 'จองดีเจ กรุงเทพ, วงดนตรีงานแต่ง, ดีเจงานบริษัท, ดีเจโรงแรม, ไม่มีค่าคอมมิชชั่น, PromptPay, จองศิลปินไทย'
      : 'DJ booking Bangkok, wedding band Thailand, corporate entertainment, hotel resident DJ, zero commission, PromptPay, Thailand entertainment booking',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'th': '/th',
        'x-default': '/en',
      }
    },
    openGraph: {
      type: 'website',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      url: `/${locale}`,
      siteName: 'Bright Ears',
      title: locale === 'th'
        ? 'Bright Ears - จองดีเจ วงดนตรี และศิลปินในประเทศไทย'
        : 'Bright Ears - Book DJs, Bands & Entertainment Thailand',
      description: locale === 'th'
        ? 'จองดีเจ วงดนตรี และศิลปินมืออาชีพสำหรับงานในประเทศไทย ไม่มีค่าคอมมิชชั่น'
        : 'Book professional DJs, bands, and entertainment for events in Thailand. No commission fees.',
      images: [{
        url: '/og-images/og-image-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Bright Ears Entertainment Booking Platform'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@brightears',
      creator: '@brightears',
    },
    verification: {
      google: 'google-site-verification-code', // TODO: Add actual Google Search Console verification code
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfairDisplay.variable} ${notoSansThai.variable}`}
      suppressHydrationWarning
    >
      <body className={`${locale === 'th' ? 'font-noto-thai' : 'font-inter'} antialiased`}>
        <ClerkProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
