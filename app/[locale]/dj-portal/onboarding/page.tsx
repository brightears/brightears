import { Metadata } from 'next';
import ProfileBuilder from './ProfileBuilder';

export const metadata: Metadata = {
  title: 'Create Your Profile | BrightEars',
  description: 'Build your artist profile and go live on the BrightEars marketplace. Free to join.',
  robots: { index: false },
};

export default function OnboardingPage() {
  return <ProfileBuilder />;
}
