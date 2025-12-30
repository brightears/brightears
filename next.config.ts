import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Marketplace-to-Agency transformation redirects
      {
        source: '/register/artist',
        destination: '/apply',
        permanent: true, // 301 redirect
      },
      {
        source: '/en/register/artist',
        destination: '/en/apply',
        permanent: true,
      },
      {
        source: '/th/register/artist',
        destination: '/th/apply',
        permanent: true,
      },
      {
        source: '/artist/onboarding',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/artist/onboarding/:path*',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/pricing/artist',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/how-it-works-artists',
        destination: '/how-it-works',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'brightears.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // Cache optimized images for 30 days (production)
    dangerouslyAllowSVG: true, // Allow SVG images (partner logos)
    contentDispositionType: 'attachment', // Force download for user-uploaded content (security)
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Reduce memory usage during build
    webpackBuildWorker: true,
  },
  // Production optimizations for memory efficiency
  compress: true,
  poweredByHeader: false,
  // Reduce memory usage in production
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 60 seconds
    pagesBufferLength: 2,
  },
  // Optimize for Render's free tier memory constraints
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
