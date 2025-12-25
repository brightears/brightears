import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - The Listening Room',
  description: 'This path does not exist in The Listening Room.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "#030129" }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-2xl px-8 text-center">
        <div className="mb-8">
          <div
            className="font-playfair text-white mb-2"
            style={{
              fontSize: "3rem",
              fontWeight: 400,
              letterSpacing: "0.02em",
              textShadow: "0 0 20px rgba(0, 187, 228, 0.6)",
            }}
          >
            404
          </div>
          <p
            className="font-playfair text-white/70 text-xl leading-relaxed mb-8"
            style={{
              textShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
            }}
          >
            This path does not exist in The Listening Room.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block px-8 py-3 text-white/80 hover:text-white border border-white/30 hover:border-white/60 rounded-full font-inter text-sm tracking-wide transition-all duration-300"
          style={{
            textShadow: "0 0 10px rgba(0, 187, 228, 0.3)",
          }}
        >
          Enter The Listening Room
        </Link>
      </div>

      {/* Logo Watermark (bottom-right) */}
      <div className="fixed bottom-6 right-6 opacity-10 pointer-events-none z-40">
        <div className="text-right">
          <div
            className="font-playfair text-white mb-1"
            style={{ fontSize: "1.5rem" }}
          >
            Bright Ears
          </div>
          <div
            className="font-inter tracking-widest"
            style={{
              fontSize: "0.5rem",
              color: "#00bbe4",
              letterSpacing: "0.3em",
            }}
          >
            THE LISTENING ROOM
          </div>
        </div>
      </div>
    </div>
  );
}
