import { Metadata } from 'next';
import AIStudioContent from '../dj-portal/ai-studio/AIStudioContent';

export const metadata: Metadata = {
  title: 'AI Content Studio | BrightEars',
  description: 'Generate professional promotional content for your entertainment — Instagram posts, event posters, stories, and more. Powered by AI.',
  openGraph: {
    title: 'AI Content Studio | BrightEars',
    description: 'Generate professional promotional content for your entertainment — Instagram posts, event posters, stories, and more.',
  },
};

export default function PublicAIToolsPage() {
  return <AIStudioContent />;
}
