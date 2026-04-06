import { Metadata } from 'next';
import CreditsPage from './CreditsContent';

export const metadata: Metadata = {
  title: 'Credits | BrightEars',
  description: 'Purchase AI content generation credits to create professional promotional materials.',
  robots: { index: false },
};

export default function Credits() {
  return <CreditsPage />;
}
