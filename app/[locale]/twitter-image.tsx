import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bright Ears - Thailand\'s Trusted Entertainment Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function TwitterImage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  const headline = locale === 'th'
    ? '20 ปี. มาตรฐานเดียว.'
    : '20 years. One standard.';

  const subheadline = locale === 'th'
    ? 'เอเจนซี่บันเทิงที่ไว้วางใจของไทย'
    : "Thailand's trusted entertainment agency";

  const tagline = locale === 'th'
    ? 'ดีเจ วงดนตรี และเพลงประกอบสำหรับโรงแรม สถานที่ และงานอีเวนต์'
    : 'DJs, bands, and background music for hotels, venues, and events';

  // Fetch logo from public folder
  const logoUrl = 'https://brightears.io/logo.png';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2f6364 0%, #1a3a3b 50%, #0d1f20 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(0,187,228,0.3) 0%, rgba(0,187,228,0) 100%)',
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Actual Logo */}
          <img
            src={logoUrl}
            width={140}
            height={140}
            style={{
              marginBottom: '40px',
            }}
          />

          {/* Brand name */}
          <div
            style={{
              fontSize: '32px',
              color: '#00bbe4',
              letterSpacing: '8px',
              textTransform: 'uppercase',
              marginBottom: '30px',
              fontWeight: '600',
            }}
          >
            BRIGHT EARS
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              fontFamily: 'Georgia, serif',
              lineHeight: 1.1,
            }}
          >
            {headline}
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '16px',
            }}
          >
            {subheadline}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '800px',
            }}
          >
            {tagline}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #00bbe4 0%, #d59ec9 50%, #a47764 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
