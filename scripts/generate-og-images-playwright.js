/**
 * Automated OG Image Generator using Playwright
 *
 * This script automatically generates all OG images by:
 * 1. Launching a headless browser
 * 2. Rendering each HTML template
 * 3. Taking a 1200x630 screenshot
 * 4. Saving optimized JPG files
 *
 * Usage:
 *   npm install playwright sharp
 *   node scripts/generate-og-images-playwright.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

async function generateOGImages() {
  console.log('🎨 Generating OG images with Playwright...\n');

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2 // 2x for retina quality
  });

  const outputDir = path.join(__dirname, '../public/og-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const page of ogPages) {
    console.log(`📸 Generating: og-image-${page.id}.jpg`);

    const browserPage = await context.newPage();

    // Generate inline HTML content
    const html = generateOGImageHTML(page);
    await browserPage.setContent(html, { waitUntil: 'networkidle' });

    // Wait for fonts to load
    await browserPage.waitForTimeout(1000);

    // Take screenshot
    const screenshotPath = path.join(outputDir, `og-image-${page.id}-temp.png`);
    await browserPage.screenshot({
      path: screenshotPath,
      fullPage: true
    });

    await browserPage.close();

    // Optimize with Sharp (PNG → JPG, quality 85, <100KB)
    const outputPath = path.join(outputDir, `og-image-${page.id}.jpg`);
    await sharp(screenshotPath)
      .resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);

    // Delete temp PNG
    fs.unlinkSync(screenshotPath);

    // Check file size
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  ✓ Size: ${sizeKB}KB ${sizeKB < 100 ? '✅' : '⚠️ >100KB'}`);
  }

  await browser.close();

  console.log(`\n✅ Successfully generated ${ogPages.length} OG images!`);
  console.log(`📁 Location: ${outputDir}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review images in public/og-images/`);
  console.log(`2. Test with https://metatags.io/`);
  console.log(`3. Deploy and verify social sharing works`);
}

function generateOGImageHTML(page) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

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
    }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: #00bbe4;
      top: -100px;
      right: -100px;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: #d59ec9;
      bottom: -80px;
      left: -80px;
    }

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
      background: linear-gradient(135deg, #00bbe4, #d59ec9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
      margin-bottom: 24px;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 28px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.5;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

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
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="music-note note-1">♪</div>
    <div class="music-note note-2">♫</div>
    <div class="content">
      <div class="logo">Bright <span>Ears</span></div>
      <h1 class="title">${page.title}</h1>
      <p class="subtitle">${page.subtitle}</p>
      <div class="badge">brightears.onrender.com</div>
    </div>
  </div>
</body>
</html>`;
}

// Run the generator
generateOGImages().catch(console.error);
