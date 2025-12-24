# DJ Application Feature - Quick Setup Checklist

## ✅ COMPLETED
- [x] Database schema updated (Application table created)
- [x] Validation schemas created
- [x] Application form component built
- [x] Application page created
- [x] API endpoint implemented
- [x] Comprehensive documentation created

## ⏳ REMAINING TASKS (15-20 minutes)

### Step 1: Add English Translations (5 min)

1. Open `/Users/benorbe/Documents/Coding Projects/brightears/brightears/messages/en.json`

2. Find line 921 (the last line before the closing `}`)

3. Add a comma at the end of line 921 (after the `"sort"` section)

4. Add this block before the final `}`:

```json
  "apply": {
    "badge": "Join Our Artist Community",
    "title": "Apply to Join Bright Ears",
    "subtitle": "Fill out the application below and we'll review it within 3-5 business days. We manually vet all artists to ensure quality for our clients.",
    "stats": {
      "artists": "Active Artists",
      "events": "Events Delivered",
      "commission": "Commission Fee"
    },
    "benefits": {
      "title": "Why Join Bright Ears?",
      "item1Title": "Zero Commission",
      "item1Desc": "Keep 100% of your booking fees. We make money from premium features, not your hard work.",
      "item2Title": "Quality Clients",
      "item2Desc": "Get booked by hotels, venues, and event organizers who value professional entertainment.",
      "item3Title": "Your Own Dashboard",
      "item3Desc": "Manage your calendar, bookings, and client communications all in one place.",
      "item4Title": "Marketing Support",
      "item4Desc": "Be featured on our platform with professional SEO and social media promotion."
    },
    "sections": {
      "basic": "Basic Information",
      "professional": "Professional Details",
      "optional": "Optional Information",
      "musicDesign": "Music Design Services (Optional)"
    },
    "fields": {
      "fullName": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number",
      "phoneHelp": "Thai mobile number (10 digits, starting with 06, 08, or 09)",
      "lineId": "LINE ID",
      "lineIdHelp": "We'll prepend @ automatically if you don't include it",
      "stageName": "Stage Name / Artist Name",
      "bio": "About You / Bio",
      "bioPlaceholder": "Tell us about your experience, style, and what makes you unique as an artist. What kind of events do you specialize in? What's your performance style?",
      "bioHelp": "100-500 characters. This will be shown on your profile.",
      "category": "Primary Category",
      "categoryPlaceholder": "Select your primary category...",
      "genres": "Music Genres / Specialties",
      "genresHelp": "Select all that apply",
      "profilePhoto": "Profile Photo URL",
      "profilePhotoHelp": "Provide a URL to your professional headshot or profile photo (e.g., from Google Drive, Dropbox, or your website)",
      "website": "Website / Personal URL",
      "socialMedia": "Social Media Links",
      "socialMediaPlaceholder": "Instagram: @yourhandle\\nFacebook: facebook.com/yourpage\\nSoundCloud: soundcloud.com/yourprofile",
      "socialMediaHelp": "One link per line",
      "experience": "Years of Experience",
      "equipment": "Equipment Owned",
      "equipmentPlaceholder": "List your DJ equipment, instruments, sound system, lighting, etc.",
      "portfolio": "Sample Work / Portfolio Links",
      "portfolioPlaceholder": "SoundCloud mixes:\\nYouTube performances:\\nSpotify artist page:",
      "portfolioHelp": "Links to mixes, videos, performances, or your portfolio",
      "location": "Base Location",
      "locationPlaceholder": "Select your base city...",
      "rate": "Hourly Rate Expectation (THB)",
      "rateHelp": "Your expected hourly rate in Thai Baht",
      "musicDesignInterest": "I'm interested in offering music design/curation services for hotels and venues",
      "musicDesignHelp": "Music design involves creating custom playlists and audio branding for businesses. This is separate from live performances.",
      "designFee": "One-Time Design Fee (THB)",
      "designFeeHelp": "Fee for initial music system design and playlist creation",
      "monthlyFee": "Monthly Curation Fee (THB)",
      "monthlyFeeHelp": "Ongoing fee for playlist updates and music management"
    },
    "categories": {
      "dj": "DJ",
      "band": "Band",
      "singer": "Singer",
      "musician": "Musician",
      "mc": "MC / Host",
      "comedian": "Comedian",
      "magician": "Magician",
      "dancer": "Dancer",
      "photographer": "Photographer",
      "speaker": "Speaker"
    },
    "submit": "Submit Application",
    "submitting": "Submitting...",
    "success": {
      "title": "Application Submitted!",
      "message": "Thank you for applying to join Bright Ears. We've received your application and will review it carefully.",
      "timeline": "You'll hear back from us within 3-5 business days via email or LINE."
    },
    "footer": {
      "privacy": "Your information is kept confidential and used only for application review purposes."
    },
    "required": "required"
  }
```

5. Also add to the `"nav"` section (around line 31):
```json
"applyAsDJ": "Apply as DJ",
```

6. Save the file

### Step 2: Add Thai Translations (5 min)

1. Open `/Users/benorbe/Documents/Coding Projects/brightears/brightears/messages/th.json`

2. Find the last line before the closing `}`

3. Add a comma at the end of that line

4. Add this block before the final `}`:

```json
  "apply": {
    "badge": "เข้าร่วมชุมชนศิลปินของเรา",
    "title": "สมัครเข้าร่วม Bright Ears",
    "subtitle": "กรอกแบบฟอร์มด้านล่างและเราจะตรวจสอบภายใน 3-5 วันทำการ เราตรวจสอบศิลปินทุกคนด้วยตนเองเพื่อคุณภาพให้กับลูกค้า",
    "stats": {
      "artists": "ศิลปินที่ใช้งานอยู่",
      "events": "จัดงานสำเร็จ",
      "commission": "ค่าคอมมิชชั่น"
    },
    "benefits": {
      "title": "ทำไมต้องเข้าร่วม Bright Ears?",
      "item1Title": "ไม่มีค่าคอมมิชชั่น",
      "item1Desc": "เก็บค่าจ้าง 100% เราหารายได้จากฟีเจอร์พรีเมียม ไม่ใช่จากงานหนักของคุณ",
      "item2Title": "ลูกค้าคุณภาพ",
      "item2Desc": "รับงานจากโรงแรม สถานที่ และผู้จัดงานที่ให้ค่านิยมกับความบันเทิงระดับมืออาชีพ",
      "item3Title": "แดชบอร์ดของคุณเอง",
      "item3Desc": "จัดการปฏิทิน การจอง และการสื่อสารกับลูกค้าได้ในที่เดียว",
      "item4Title": "การสนับสนุนการตลาด",
      "item4Desc": "ได้รับการแนะนำบนแพลตฟอร์มด้วย SEO และการโปรโมทบนโซเชียลมีเดีย"
    },
    "sections": {
      "basic": "ข้อมูลพื้นฐาน",
      "professional": "รายละเอียดอาชีพ",
      "optional": "ข้อมูลเพิ่มเติม (ไม่บังคับ)",
      "musicDesign": "บริการออกแบบดนตรี (ไม่บังคับ)"
    },
    "fields": {
      "fullName": "ชื่อ-นามสกุล",
      "email": "อีเมล",
      "phone": "เบอร์โทรศัพท์",
      "phoneHelp": "เบอร์มือถือไทย (10 หลัก เริ่มต้นด้วย 06, 08, หรือ 09)",
      "lineId": "LINE ID",
      "lineIdHelp": "เราจะเพิ่ม @ ให้อัตโนมัติหากคุณไม่ใส่",
      "stageName": "ชื่อศิลปิน / ชื่อเวที",
      "bio": "เกี่ยวกับตัวคุณ",
      "bioPlaceholder": "บอกเราเกี่ยวกับประสบการณ์ สไตล์ และสิ่งที่ทำให้คุณพิเศษในฐานะศิลปิน คุณเชี่ยวชาญงานประเภทไหน? สไตล์การแสดงของคุณเป็นอย่างไร?",
      "bioHelp": "100-500 ตัวอักษร จะแสดงบนโปรไฟล์ของคุณ",
      "category": "ประเภทหลัก",
      "categoryPlaceholder": "เลือกประเภทหลักของคุณ...",
      "genres": "แนวเพลง / ความเชี่ยวชาญ",
      "genresHelp": "เลือกทั้งหมดที่ตรงกับคุณ",
      "profilePhoto": "URL รูปโปรไฟล์",
      "profilePhotoHelp": "ให้ URL ของรูปถ่ายมืออาชีพของคุณ (เช่น จาก Google Drive, Dropbox หรือเว็บไซต์ของคุณ)",
      "website": "เว็บไซต์ / URL ส่วนตัว",
      "socialMedia": "ลิงก์โซเชียลมีเดีย",
      "socialMediaPlaceholder": "Instagram: @yourhandle\\nFacebook: facebook.com/yourpage\\nSoundCloud: soundcloud.com/yourprofile",
      "socialMediaHelp": "หนึ่งลิงก์ต่อบรรทัด",
      "experience": "ประสบการณ์ (ปี)",
      "equipment": "อุปกรณ์ที่มี",
      "equipmentPlaceholder": "ระบุอุปกรณ์ DJ เครื่องดนตรี เครื่องเสียง ไฟ ฯลฯ",
      "portfolio": "ผลงาน / Portfolio",
      "portfolioPlaceholder": "SoundCloud mixes:\\nการแสดงบน YouTube:\\nหน้า Spotify artist:",
      "portfolioHelp": "ลิงก์ไปยังมิกซ์ วิดีโอ การแสดง หรือพอร์ตโฟลิโอของคุณ",
      "location": "สถานที่ตั้ง",
      "locationPlaceholder": "เลือกเมืองฐานของคุณ...",
      "rate": "อัตราค่าจ้างต่อชั่วโมงที่คาดหวัง (บาท)",
      "rateHelp": "อัตราค่าจ้างต่อชั่วโมงที่คุณคาดหวังเป็นเงินบาท",
      "musicDesignInterest": "ฉันสนใจให้บริการออกแบบ/คัดสรรเพลงสำหรับโรงแรมและสถานที่",
      "musicDesignHelp": "การออกแบบดนตรีคือการสร้างเพลย์ลิสต์ที่กำหนดเองและแบรนด์เสียงสำหรับธุรกิจ แยกจากการแสดงสด",
      "designFee": "ค่าออกแบบครั้งเดียว (บาท)",
      "designFeeHelp": "ค่าธรรมเนียมสำหรับการออกแบบระบบเพลงและสร้างเพลย์ลิสต์เริ่มต้น",
      "monthlyFee": "ค่าคัดสรรรายเดือน (บาท)",
      "monthlyFeeHelp": "ค่าธรรมเนียมต่อเนื่องสำหรับการอัพเดทเพลย์ลิสต์และการจัดการเพลง"
    },
    "categories": {
      "dj": "ดีเจ",
      "band": "วงดนตรี",
      "singer": "นักร้อง",
      "musician": "นักดนตรี",
      "mc": "MC / พิธีกร",
      "comedian": "นักตลก",
      "magician": "นักมายากล",
      "dancer": "นักเต้น",
      "photographer": "ช่างภาพ",
      "speaker": "วิทยากร"
    },
    "submit": "ส่งใบสมัคร",
    "submitting": "กำลังส่ง...",
    "success": {
      "title": "ส่งใบสมัครแล้ว!",
      "message": "ขอบคุณที่สมัครเข้าร่วม Bright Ears เราได้รับใบสมัครของคุณแล้วและจะตรวจสอบอย่างรอบคอบ",
      "timeline": "คุณจะได้รับการติดต่อกลับภายใน 3-5 วันทำการทางอีเมลหรือ LINE"
    },
    "footer": {
      "privacy": "ข้อมูลของคุณจะถูกเก็บเป็นความลับและใช้เพื่อการตรวจสอบใบสมัครเท่านั้น"
    },
    "required": "จำเป็น"
  }
```

5. Also add to the `"nav"` section:
```json
"applyAsDJ": "สมัครเป็นศิลปิน",
```

6. Save the file

### Step 3: Update Header Navigation (5 min)

1. Open `/Users/benorbe/Documents/Coding Projects/brightears/brightears/components/layout/Header.tsx`

2. Find the `navItems` array (around line 30-34)

3. Add this line:
```typescript
{ label: t('applyAsDJ'), href: '/apply' },
```

The array should look like:
```typescript
const navItems = [
  { label: t('browseArtists'), href: '/artists' },
  { label: t('howItWorks'), href: '/how-it-works' },
  { label: t('corporate'), href: '/corporate' },
  { label: t('applyAsDJ'), href: '/apply' }, // NEW LINE
];
```

4. Save the file

### Step 4: Test Locally (5 min)

```bash
# Terminal 1: Start dev server
cd /Users/benorbe/Documents/Coding\ Projects/brightears/brightears
npm run dev

# Terminal 2: Test pages
open http://localhost:3000/en/apply
open http://localhost:3000/th/apply
```

### Step 5: Deploy to Production

```bash
# Commit changes
git add .
git commit -m "feat: add DJ application form with bilingual support

- Created comprehensive application form with Zod validation
- Added Thai phone number and LINE ID validation
- Implemented music design service interest fields
- Added Application table to database schema
- Created API endpoint with rate limiting and duplicate detection
- Added bilingual translations (EN/TH)
- Updated header navigation with Apply as DJ link

Features:
- 9 required fields + 10 optional fields
- Rate limiting: 3 applications per email/phone per 24h
- Duplicate detection within 7 days
- Email notifications for owner and applicant
- WCAG 2.1 AA accessible
- Mobile-responsive with glass morphism design

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub (auto-deploys to Render)
git push origin main
```

## 📋 VERIFICATION CHECKLIST

After deployment, verify:

- [ ] English page loads: https://brightears.onrender.com/en/apply
- [ ] Thai page loads: https://brightears.onrender.com/th/apply
- [ ] Header shows "Apply as DJ" / "สมัครเป็นศิลปิน" link
- [ ] Form validation works (try invalid phone number)
- [ ] Form submission succeeds
- [ ] Success screen appears
- [ ] Application saved to database (check Prisma Studio)
- [ ] Mobile responsive on phone/tablet
- [ ] Keyboard navigation works (Tab key)

## 🚨 TROUBLESHOOTING

### Error: "Cannot find module '@/lib/validation/application-schemas'"
**Fix**: Restart dev server (`npm run dev`)

### Error: JSON parse error in messages files
**Fix**: Check for trailing commas, missing quotes, or syntax errors. Use https://jsonlint.com to validate.

### Error: Translation key not found
**Fix**: Make sure translation keys match exactly (case-sensitive). Clear browser cache and restart server.

### Form submits but no database record
**Fix**: Check Prisma connection. Run `npx prisma studio` to verify database access.

## 📧 EMAIL SETUP (OPTIONAL)

To enable email notifications:

1. Sign up for Resend: https://resend.com (free tier: 100 emails/day)
2. Get API key from dashboard
3. Add to `.env.local`:
```bash
RESEND_API_KEY="re_..."
OWNER_EMAIL="your-email@brightears.com"
```
4. Restart server

If not configured, applications will still work but no emails will be sent.

## 🎉 DONE!

Once translations are added and tested locally, you're ready to deploy!

The application form will be live at:
- **English**: https://brightears.onrender.com/en/apply
- **Thai**: https://brightears.onrender.com/th/apply
