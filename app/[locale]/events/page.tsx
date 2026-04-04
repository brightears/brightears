import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? '\u0E07\u0E32\u0E19\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 | Bright Ears'
    : 'Private Events | Bright Ears';

  const description = locale === 'th'
    ? '\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E14\u0E35\u0E40\u0E08\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 \u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 \u0E1B\u0E32\u0E23\u0E4C\u0E15\u0E35\u0E49 \u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E40\u0E09\u0E25\u0E34\u0E21\u0E09\u0E25\u0E2D\u0E07\u0E43\u0E19\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E04\u0E23\u0E1A\u0E27\u0E07\u0E08\u0E23\u0E42\u0E14\u0E22 Bright Ears'
    : 'DJ services for corporate events, private parties, and celebrations at Bangkok\'s finest venues. Full-service entertainment by Bright Ears.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/events`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/events`,
      languages: {
        'en': '/en/events',
        'th': '/th/events',
        'x-default': '/en/events',
      }
    },
  };
}

const t = {
  en: {
    heroTitle: 'Entertainment for Your Special Event',
    heroSubtitle: 'Professional DJ services for corporate events, private parties, and celebrations at Bangkok\'s finest venues.',
    whatWeOfferTitle: 'What We Offer',
    corporate: 'Corporate Events',
    corporateDesc: 'Product launches, company parties, team celebrations, and conferences. We set the tone for your brand.',
    private: 'Private Celebrations',
    privateDesc: 'Birthdays, anniversaries, engagement parties, and milestone events. Music tailored to your occasion.',
    special: 'Special Occasions',
    specialDesc: 'Holiday events, themed nights, VIP gatherings. We bring the energy your event deserves.',
    venue: 'Venue Events',
    venueDesc: 'Songkran parties, New Year celebrations, wine dinners. Curated music for Bangkok\'s premier venues.',
    howItWorksTitle: 'How It Works',
    howItWorksSubtitle: 'Seamless coordination from first contact to the final beat',
    step1Title: 'Tell Us About Your Event',
    step1Desc: 'Share the details \u2014 date, venue, style, and number of guests. We\'ll take it from there.',
    step2Title: 'We Recommend the Perfect DJ',
    step2Desc: 'Based on your event\'s vibe, we match you with the ideal DJ and music program from our roster of 25+ professionals.',
    step3Title: 'We Handle Everything',
    step3Desc: 'From sound check to the last track \u2014 setup, performance, coordination. One contact, zero stress.',
    whyTitle: 'Why Choose BrightEars for Events',
    why1Title: '25+ Professional DJs',
    why1Desc: 'Deep house to hip-hop, lounge to high-energy \u2014 every genre covered by experienced professionals.',
    why2Title: 'Premium Venue Experience',
    why2Desc: 'Our DJs perform nightly at NOBU, Marriott, and Hilton properties. They know how to read a room.',
    why3Title: 'One Contact, One Invoice',
    why3Desc: 'No chasing multiple vendors. We handle DJ sourcing, logistics, and coordination end-to-end.',
    why4Title: 'Custom Music Curation',
    why4Desc: 'Every event gets a tailored music program. Tell us the mood \u2014 we\'ll build the soundtrack.',
    ctaTitle: 'Ready to Plan Your Event?',
    ctaSubtitle: 'Tell us about your event and we\'ll recommend the perfect entertainment.',
    ctaButton: 'Plan Your Event',
  },
  th: {
    heroTitle: '\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E31\u0E19\u0E40\u0E17\u0E34\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E1E\u0E34\u0E40\u0E28\u0E29\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13',
    heroSubtitle: '\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E14\u0E35\u0E40\u0E08\u0E21\u0E37\u0E2D\u0E2D\u0E32\u0E0A\u0E35\u0E1E\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 \u0E1B\u0E32\u0E23\u0E4C\u0E15\u0E35\u0E49\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 \u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E40\u0E09\u0E25\u0E34\u0E21\u0E09\u0E25\u0E2D\u0E07\u0E43\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E0A\u0E31\u0E49\u0E19\u0E19\u0E33\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E',
    whatWeOfferTitle: '\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32',
    corporate: '\u0E07\u0E32\u0E19\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17',
    corporateDesc: '\u0E07\u0E32\u0E19\u0E40\u0E1B\u0E34\u0E14\u0E15\u0E31\u0E27\u0E1C\u0E25\u0E34\u0E15\u0E20\u0E31\u0E13\u0E11\u0E4C \u0E1B\u0E32\u0E23\u0E4C\u0E15\u0E35\u0E49\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 \u0E07\u0E32\u0E19\u0E40\u0E25\u0E35\u0E49\u0E22\u0E07\u0E17\u0E35\u0E21 \u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E38\u0E21 \u0E40\u0E23\u0E32\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E43\u0E2B\u0E49\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13',
    private: '\u0E07\u0E32\u0E19\u0E40\u0E09\u0E25\u0E34\u0E21\u0E09\u0E25\u0E2D\u0E07\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27',
    privateDesc: '\u0E27\u0E31\u0E19\u0E40\u0E01\u0E34\u0E14 \u0E27\u0E31\u0E19\u0E04\u0E23\u0E1A\u0E23\u0E2D\u0E1A \u0E1B\u0E32\u0E23\u0E4C\u0E15\u0E35\u0E49\u0E2B\u0E21\u0E31\u0E49\u0E19 \u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E2A\u0E33\u0E04\u0E31\u0E0D \u0E14\u0E19\u0E15\u0E23\u0E35\u0E17\u0E35\u0E48\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E21\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13',
    special: '\u0E07\u0E32\u0E19\u0E1E\u0E34\u0E40\u0E28\u0E29',
    specialDesc: '\u0E07\u0E32\u0E19\u0E27\u0E31\u0E19\u0E2B\u0E22\u0E38\u0E14 \u0E44\u0E19\u0E17\u0E4C\u0E18\u0E35\u0E21 \u0E07\u0E32\u0E19 VIP \u0E40\u0E23\u0E32\u0E2A\u0E48\u0E07\u0E21\u0E2D\u0E1A\u0E1E\u0E25\u0E31\u0E07\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E2A\u0E21\u0E04\u0E27\u0E23\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A',
    venue: '\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48',
    venueDesc: '\u0E1B\u0E32\u0E23\u0E4C\u0E15\u0E35\u0E49\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C \u0E07\u0E32\u0E19\u0E09\u0E25\u0E2D\u0E07\u0E1B\u0E35\u0E43\u0E2B\u0E21\u0E48 \u0E44\u0E27\u0E19\u0E4C\u0E14\u0E34\u0E19\u0E40\u0E19\u0E2D\u0E23\u0E4C \u0E14\u0E19\u0E15\u0E23\u0E35\u0E04\u0E31\u0E14\u0E2A\u0E23\u0E23\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E0A\u0E31\u0E49\u0E19\u0E19\u0E33\u0E02\u0E2D\u0E07\u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E',
    howItWorksTitle: '\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19',
    howItWorksSubtitle: '\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E2A\u0E32\u0E19\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23\u0E49\u0E23\u0E2D\u0E22\u0E15\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01\u0E08\u0E19\u0E16\u0E36\u0E07\u0E1A\u0E35\u0E17\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22',
    step1Title: '\u0E1A\u0E2D\u0E01\u0E40\u0E23\u0E32\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13',
    step1Desc: '\u0E41\u0E08\u0E49\u0E07\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 \u2014 \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 \u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48 \u0E2A\u0E44\u0E15\u0E25\u0E4C \u0E41\u0E25\u0E30\u0E08\u0E33\u0E19\u0E27\u0E19\u0E41\u0E02\u0E01 \u0E40\u0E23\u0E32\u0E08\u0E30\u0E14\u0E39\u0E41\u0E25\u0E15\u0E48\u0E2D\u0E43\u0E2B\u0E49',
    step2Title: '\u0E40\u0E23\u0E32\u0E41\u0E19\u0E30\u0E19\u0E33\u0E14\u0E35\u0E40\u0E08\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21',
    step2Desc: '\u0E08\u0E32\u0E01\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13 \u0E40\u0E23\u0E32\u0E08\u0E31\u0E1A\u0E04\u0E39\u0E48\u0E01\u0E31\u0E1A\u0E14\u0E35\u0E40\u0E08\u0E41\u0E25\u0E30\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21\u0E40\u0E1E\u0E25\u0E07\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21\u0E08\u0E32\u0E01\u0E17\u0E35\u0E21\u0E14\u0E35\u0E40\u0E08\u0E01\u0E27\u0E48\u0E32 25 \u0E04\u0E19',
    step3Title: '\u0E40\u0E23\u0E32\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E17\u0E38\u0E01\u0E2D\u0E22\u0E48\u0E32\u0E07',
    step3Desc: '\u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48\u0E40\u0E0A\u0E47\u0E04\u0E40\u0E2A\u0E35\u0E22\u0E07\u0E08\u0E19\u0E16\u0E36\u0E07\u0E40\u0E1E\u0E25\u0E07\u0E2A\u0E38\u0E14\u0E17\u0E49\u0E32\u0E22 \u2014 \u0E40\u0E0B\u0E47\u0E15\u0E2D\u0E31\u0E1E \u0E01\u0E32\u0E23\u0E41\u0E2A\u0E14\u0E07 \u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E2A\u0E32\u0E19\u0E07\u0E32\u0E19 \u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E08\u0E38\u0E14\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E07\u0E27\u0E25',
    whyTitle: '\u0E17\u0E33\u0E44\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01 BrightEars \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C',
    why1Title: '\u0E14\u0E35\u0E40\u0E08\u0E21\u0E37\u0E2D\u0E2D\u0E32\u0E0A\u0E35\u0E1E\u0E01\u0E27\u0E48\u0E32 25 \u0E04\u0E19',
    why1Desc: '\u0E14\u0E35\u0E1B\u0E40\u0E2E\u0E32\u0E2A\u0E4C\u0E16\u0E36\u0E07\u0E2E\u0E34\u0E1B\u0E2E\u0E2D\u0E1B \u0E40\u0E25\u0E32\u0E19\u0E08\u0E4C\u0E16\u0E36\u0E07\u0E44\u0E2E\u0E40\u0E2D\u0E40\u0E19\u0E2D\u0E23\u0E4C\u0E08\u0E35\u0E49 \u2014 \u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E41\u0E19\u0E27\u0E40\u0E1E\u0E25\u0E07\u0E42\u0E14\u0E22\u0E21\u0E37\u0E2D\u0E2D\u0E32\u0E0A\u0E35\u0E1E',
    why2Title: '\u0E1B\u0E23\u0E30\u0E2A\u0E1A\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E1E\u0E23\u0E35\u0E40\u0E21\u0E35\u0E22\u0E21',
    why2Desc: '\u0E14\u0E35\u0E40\u0E08\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32\u0E40\u0E25\u0E48\u0E19\u0E17\u0E38\u0E01\u0E04\u0E37\u0E19\u0E17\u0E35\u0E48 NOBU, Marriott \u0E41\u0E25\u0E30 Hilton \u0E1E\u0E27\u0E01\u0E40\u0E02\u0E32\u0E23\u0E39\u0E49\u0E27\u0E34\u0E18\u0E35\u0E2D\u0E48\u0E32\u0E19\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E2B\u0E49\u0E2D\u0E07',
    why3Title: '\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E08\u0E38\u0E14\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E43\u0E1A\u0E41\u0E08\u0E49\u0E07\u0E2B\u0E19\u0E35\u0E49\u0E40\u0E14\u0E35\u0E22\u0E27',
    why3Desc: '\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E2B\u0E25\u0E32\u0E22\u0E40\u0E08\u0E49\u0E32 \u0E40\u0E23\u0E32\u0E08\u0E31\u0E14\u0E2B\u0E32\u0E14\u0E35\u0E40\u0E08 \u0E42\u0E25\u0E08\u0E34\u0E2A\u0E15\u0E34\u0E01\u0E2A\u0E4C \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E2A\u0E32\u0E19\u0E07\u0E32\u0E19\u0E04\u0E23\u0E1A\u0E27\u0E07\u0E08\u0E23',
    why4Title: '\u0E04\u0E31\u0E14\u0E2A\u0E23\u0E23\u0E40\u0E1E\u0E25\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E07\u0E32\u0E19',
    why4Desc: '\u0E17\u0E38\u0E01\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E42\u0E1B\u0E23\u0E41\u0E01\u0E23\u0E21\u0E40\u0E1E\u0E25\u0E07\u0E17\u0E35\u0E48\u0E2D\u0E2D\u0E01\u0E41\u0E1A\u0E1A\u0E21\u0E32\u0E40\u0E09\u0E1E\u0E32\u0E30 \u0E1A\u0E2D\u0E01\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28 \u2014 \u0E40\u0E23\u0E32\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E1E\u0E25\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E43\u0E2B\u0E49',
    ctaTitle: '\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E07\u0E32\u0E19\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13?',
    ctaSubtitle: '\u0E1A\u0E2D\u0E01\u0E40\u0E23\u0E32\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13 \u0E40\u0E23\u0E32\u0E08\u0E30\u0E41\u0E19\u0E30\u0E19\u0E33\u0E04\u0E27\u0E32\u0E21\u0E1A\u0E31\u0E19\u0E40\u0E17\u0E34\u0E07\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E2A\u0E21',
    ctaButton: '\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E07\u0E32\u0E19\u0E2D\u0E35\u0E40\u0E27\u0E19\u0E15\u0E4C',
  }
};

export default async function EventsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const text = locale === 'th' ? t.th : t.en;

  const eventTypes = [
    {
      number: '01',
      title: text.corporate,
      items: locale === 'th'
        ? ['งานเปิดตัวผลิตภัณฑ์', 'ปาร์ตี้บริษัท', 'งานเลี้ยงทีม']
        : ['Product launches', 'Company parties', 'Team events'],
    },
    {
      number: '02',
      title: text.private,
      items: locale === 'th'
        ? ['วันเกิด', 'วันครบรอบ', 'ปาร์ตี้หมั้น']
        : ['Birthdays', 'Anniversaries', 'Engagements'],
    },
    {
      number: '03',
      title: text.special,
      items: locale === 'th'
        ? ['งานวันหยุด', 'ไนท์ธีม', 'งาน VIP']
        : ['Holiday events', 'Themed nights', 'VIP gatherings'],
    },
    {
      number: '04',
      title: text.venue,
      items: locale === 'th'
        ? ['ปาร์ตี้สงกรานต์', 'งานปีใหม่', 'ไวน์ดินเนอร์']
        : ['Songkran parties', 'New Year', 'Wine dinners'],
    },
  ];

  const steps = [
    { title: text.step1Title, description: text.step1Desc },
    { title: text.step2Title, description: text.step2Desc },
    { title: text.step3Title, description: text.step3Desc },
  ];

  const reasons = [
    { title: text.why1Title, description: text.why1Desc, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { title: text.why2Title, description: text.why2Desc, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: text.why3Title, description: text.why3Desc, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: text.why4Title, description: text.why4Desc, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
  ];

  return (
    <div className="min-h-screen bg-mr-bg">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-mr-bg">
          <div className="absolute inset-0 bg-gradient-to-t from-mr-bg via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-mr-bg/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            <span className="text-mr-tertiary font-inter uppercase tracking-widest text-sm mb-4 block font-bold">
              {locale === 'th' ? 'ซาวด์คอนเซียร์จชั้นนำของกรุงเทพ' : "Bangkok's Premier Sonic Concierge"}
            </span>
            <h1 className="text-6xl md:text-8xl font-playfair font-bold leading-tight mb-8 tracking-tighter text-neutral-100">
              {text.heroTitle.split(' ').slice(0, -2).join(' ')}{' '}
              <span className="italic text-mr-primary">{text.heroTitle.split(' ').slice(-2).join(' ')}</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-xl">
              {text.heroSubtitle}
            </p>
            <div className="flex gap-6">
              <a
                href={`/${locale}/#contact`}
                className="px-10 py-5 bg-gradient-to-r from-mr-primary-container to-mr-primary text-white font-bold rounded-md hover:shadow-cyan-glow-hover transition-all flex items-center group"
              >
                {text.ctaButton}
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-32 bg-mr-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-playfair font-bold mb-6 text-neutral-100 uppercase tracking-tighter">
                {text.whatWeOfferTitle}
              </h2>
              <p className="text-neutral-400 text-lg">
                {locale === 'th'
                  ? 'ประสบการณ์เสียงเฉพาะตัวที่ออกแบบมาเพื่อบรรยากาศและพลังงานของโอกาสพิเศษของคุณ'
                  : 'Bespoke sonic experiences tailored to the atmosphere and energy of your specific occasion.'}
              </p>
            </div>
            <div className="h-1 w-24 bg-mr-primary rounded-full mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="glass-card p-8 group hover:bg-mr-surface-high transition-all duration-500 rounded-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-playfair font-bold">
                  {event.number}
                </div>
                <h3 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">
                  {event.title}
                </h3>
                <ul className="text-neutral-400 space-y-2 font-inter">
                  {event.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-mr-surface-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-playfair font-bold text-neutral-100 uppercase tracking-tighter mb-4">
              {text.howItWorksTitle}
            </h2>
            <p className="text-mr-tertiary font-inter tracking-widest text-sm uppercase font-bold">
              {text.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-mr-outline-variant/30 -z-10" />
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-mr-surface-high rounded-full flex items-center justify-center mb-8 border border-mr-primary/20 group-hover:scale-110 group-hover:bg-mr-primary-container transition-all">
                  <span className="font-playfair text-2xl font-bold text-mr-primary group-hover:text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h4 className="text-2xl font-playfair font-bold text-neutral-100 mb-4">
                  {step.title}
                </h4>
                <p className="text-neutral-500 font-inter">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-mr-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-playfair font-bold mb-12 text-neutral-100 uppercase tracking-tighter text-center">
            {text.whyTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-6 group p-6 rounded-xl hover:bg-mr-surface-low transition-all"
              >
                <div className="mt-1 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-mr-surface-low border border-mr-outline-variant/30 rounded-lg group-hover:border-mr-primary transition-colors">
                  <svg className="w-6 h-6 text-mr-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={reason.icon} />
                  </svg>
                </div>
                <div>
                  <h5 className="text-xl font-playfair font-bold text-neutral-100 mb-2">
                    {reason.title}
                  </h5>
                  <p className="text-neutral-500 font-inter leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-mr-primary-container opacity-5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-playfair font-bold text-neutral-100 mb-8 tracking-tighter italic">
            {text.ctaTitle}
          </h2>
          <p className="text-xl text-neutral-400 mb-12 font-inter">
            {text.ctaSubtitle}
          </p>
          <a
            href={`/${locale}/#contact`}
            className="inline-block px-12 py-6 bg-mr-tertiary text-mr-bg font-bold text-lg rounded-md hover:bg-mr-tertiary-container transition-all duration-300 uppercase tracking-widest shadow-xl"
          >
            {text.ctaButton}
          </a>
        </div>
      </section>
    </div>
  );
}
