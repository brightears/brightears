import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';
import { Inter, Playfair_Display, Noto_Sans_Thai } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
    metadataBase: new URL('https://brightears.io'),
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
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/logo.png',
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
      <body className={`${locale === 'th' ? 'font-noto-thai' : 'font-inter'} antialiased bg-off-white`}>
        <ClerkProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative min-h-screen flex flex-col">
              {/* Fixed Header with consistent styling */}
              <Header />

              {/* Main content area with proper spacing for fixed header - WCAG 2.4.1 (A) */}
              <main id="main-content" tabIndex={-1} className="flex-1 pt-[72px] md:pt-[80px]">
                {/* Subtle background gradient for entire app */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-off-white via-pure-white to-brand-cyan/5" />

                {children}
              </main>

              <Footer />
            </div>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
