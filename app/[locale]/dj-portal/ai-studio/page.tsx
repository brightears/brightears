import { Metadata } from 'next';
import AIStudioContent from './AIStudioContent';

export const metadata: Metadata = {
  title: 'AI Studio | BrightEars',
  description: 'Generate professional promotional content with AI — Instagram posts, event posters, stories, and more.',
  robots: { index: false },
};

export default function AIStudioPage() {
  return <AIStudioContent />;
}
