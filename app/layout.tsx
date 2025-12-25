import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://brightears.onrender.com'),
  title: "The Listening Room - An Immersive Art Installation",
  description: "An immersive art installation exploring mood, color, sound, and visual experiences through AI-driven generative art.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
