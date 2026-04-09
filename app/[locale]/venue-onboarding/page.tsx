import { Metadata } from 'next';
import VenueOnboardingBuilder from './VenueOnboardingBuilder';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Register Your Venue | BrightEars',
  description: 'Set up your venue profile and start discovering entertainment on BrightEars.',
  robots: { index: false },
};

export default function VenueOnboardingPage() {
  return <VenueOnboardingBuilder />;
}
