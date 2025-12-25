import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n.config';
import { Inter, Playfair_Display } from 'next/font/google';
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;

  return {
    metadataBase: new URL('https://brightears.onrender.com'),
    title: 'The Listening Room - An Immersive Art Installation',
    description: 'An immersive art installation exploring mood, color, sound, and visual experiences through AI-driven generative art.',
    keywords: 'art installation, generative art, immersive experience, mood detection, AI art',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      url: `/${locale}`,
      siteName: 'The Listening Room',
      title: 'The Listening Room - An Immersive Art Installation',
      description: 'An immersive art installation exploring mood, color, sound, and visual experiences.',
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

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-inter antialiased bg-black">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="min-h-screen">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
