import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';
import { Inter, Playfair_Display, Noto_Sans_Thai } from 'next/font/google';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { FavoritesProvider } from '@/components/favorites/FavoritesContext';
import { getSession, isValidSession } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import type { Session } from 'next-auth';
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
    title: locale === 'th' 
      ? 'Bright Ears - จองดีเจ วงดนตรี และศิลปินในประเทศไทย'
      : 'Bright Ears - Book DJs, Bands & Entertainment Thailand',
    description: locale === 'th'
      ? 'จองดีเจ วงดนตรี และศิลปินมืออาชีพสำหรับงานในประเทศไทย ไม่มีค่าคอมมิชชั่น ได้รับความไว้วางใจจากโรงแรมและสถานที่ชั้นนำ'
      : 'Book professional DJs, bands, and entertainment for events in Thailand. No commission fees. Trusted by leading hotels and venues.',
    alternates: {
      languages: {
        'en': '/en',
        'th': '/th',
      }
    }
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
  const session = await getSession();
  
  // Only pass valid sessions to the SessionProvider
  const validSession = isValidSession(session) ? session : null;

  return (
    <html 
      lang={locale} 
      className={`${inter.variable} ${playfairDisplay.variable} ${notoSansThai.variable}`}
      suppressHydrationWarning
    >
      <body className={`${locale === 'th' ? 'font-noto-thai' : 'font-inter'} antialiased`}>
        <SessionProvider session={validSession as Session | null}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <FavoritesProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </FavoritesProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
