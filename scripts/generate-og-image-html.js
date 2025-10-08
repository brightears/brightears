/**
 * OG Image HTML Template Generator
 *
 * This script generates HTML templates that can be:
 * 1. Opened in browser and screenshot at 1200x630
 * 2. Used with Playwright/Puppeteer for automated generation
 * 3. Converted to images via html2canvas
 *
 * Brand Colors:
 * - #00bbe4 (brand-cyan)
 * - #2f6364 (deep-teal)
 * - #d59ec9 (soft-lavender)
 * - #a47764 (earthy-brown)
 */

const fs = require('fs');
const path = require('path');

const ogPages = [
  {
    id: 'home',
    title: 'Book Perfect Entertainment for Your Event',
    subtitle: 'Connect with verified DJs, bands, and musicians across Thailand',
    gradient: 'from-[#2f6364] via-[#00bbe4] to-[#2f6364]'
  },
  {
    id: 'artists',
    title: 'Join Bright Ears as an Entertainer',
    subtitle: 'Get discovered by event organizers • Zero commission • Direct bookings',
    gradient: 'from-[#00bbe4] via-[#d59ec9] to-[#00bbe4]'
  },
  {
    id: 'artists-listing',
    title: 'Browse 500+ Verified Artists',
    subtitle: 'DJs • Bands • Musicians • MCs • Professional entertainers',
    gradient: 'from-[#a47764] via-[#2f6364] to-[#00bbe4]'
  },
  {
    id: 'corporate',
    title: 'Corporate Event Entertainment',
    subtitle: 'Trusted by 500+ Bangkok venues & hotels • Professional booking platform',
    gradient: 'from-[#2f6364] via-[#00bbe4] to-[#a47764]'
  },
  {
    id: 'how-it-works',
    title: 'How Bright Ears Works',
    subtitle: 'Simple 3-step process: Browse → Request Quote → Book',
    gradient: 'from-[#00bbe4] via-[#2f6364] to-[#d59ec9]'
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about booking entertainment',
    gradient: 'from-[#d59ec9] via-[#00bbe4] to-[#2f6364]'
  },
  {
    id: 'about',
    title: 'About Bright Ears',
    subtitle: 'Thailand\'s premier commission-free entertainment booking platform',
    gradient: 'from-[#2f6364] to-[#00bbe4]'
  },
  {
    id: 'contact',
    title: 'Get in Touch',
    subtitle: 'We\'re here to help find the perfect entertainment for your event',
    gradient: 'from-[#00bbe4] to-[#a47764]'
  }
];

const generateOGImageHTML = (page) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OG Image: ${page.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }

    .og-container {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #2f6364 100%);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px 80px;
      overflow: hidden;
    }

    /* Animated background orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: #00bbe4;
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: #d59ec9;
      bottom: -80px;
      left: -80px;
      animation-delay: 2s;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: #a47764;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-30px) scale(1.1); }
    }

    /* Content container with glass morphism */
    .content {
      position: relative;
      z-index: 10;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 32px;
      padding: 60px 80px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 1000px;
    }

    /* Logo */
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 40px;
      letter-spacing: -1px;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .logo span {
      color: #00bbe4;
      background: linear-gradient(135deg, #00bbe4, #d59ec9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Title */
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 24px;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    /* Subtitle */
    .subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 28px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.5;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    /* Badge/CTA */
    .badge {
      display: inline-block;
      margin-top: 32px;
      padding: 16px 32px;
      background: rgba(0, 187, 228, 0.9);
      border-radius: 50px;
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 8px 24px rgba(0, 187, 228, 0.4);
    }

    /* Decorative elements */
    .music-note {
      position: absolute;
      font-size: 120px;
      opacity: 0.1;
      color: #ffffff;
    }

    .note-1 { top: 40px; left: 100px; }
    .note-2 { bottom: 60px; right: 120px; transform: rotate(15deg); }
  </style>
</head>
<body>
  <div class="og-container">
    <!-- Animated background orbs -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- Decorative music notes -->
    <div class="music-note note-1">♪</div>
    <div class="music-note note-2">♫</div>

    <!-- Main content -->
    <div class="content">
      <div class="logo">Bright <span>Ears</span></div>
      <h1 class="title">${page.title}</h1>
      <p class="subtitle">${page.subtitle}</p>
      <div class="badge">brightears.onrender.com</div>
    </div>
  </div>
</body>
</html>`;
};

// Generate all OG image HTML files
const outputDir = path.join(__dirname, '../public/og-images-templates');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

ogPages.forEach(page => {
  const html = generateOGImageHTML(page);
  const filename = `og-image-${page.id}.html`;
  const filepath = path.join(outputDir, filename);

  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✓ Generated: ${filename}`);
});

console.log(`\n✅ Generated ${ogPages.length} OG image HTML templates in: ${outputDir}`);
console.log(`\nNext steps:`);
console.log(`1. Open each HTML file in Chrome (1200x630 window)`);
console.log(`2. Take screenshot (Cmd+Shift+4 or DevTools screenshot)`);
console.log(`3. Crop to exactly 1200x630px`);
console.log(`4. Compress to <100KB using https://tinypng.com/`);
console.log(`5. Save as og-image-{page-id}.jpg in public/og-images/`);
console.log(`\nOr use Playwright automation (see generate-og-images-playwright.js)`);
