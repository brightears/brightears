import { Metadata } from 'next';
import ReferralDashboard from './ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referrals | BrightEars',
  description: 'Share your referral code and earn free AI credits when other artists join BrightEars.',
  robots: { index: false },
};

export default function ReferralsPage() {
  return <ReferralDashboard />;
}
