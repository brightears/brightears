# DJ Application Form - Translation Keys

## Add these to `messages/en.json` and `messages/th.json`

### English (`messages/en.json`)

Add this before the closing `}` of the root object:

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
      "socialMediaPlaceholder": "Instagram: @yourhandle\nFacebook: facebook.com/yourpage\nSoundCloud: soundcloud.com/yourprofile",
      "socialMediaHelp": "One link per line",
      "experience": "Years of Experience",
      "equipment": "Equipment Owned",
      "equipmentPlaceholder": "List your DJ equipment, instruments, sound system, lighting, etc.",
      "portfolio": "Sample Work / Portfolio Links",
      "portfolioPlaceholder": "SoundCloud mixes:\nYouTube performances:\nSpotify artist page:",
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

### Thai (`messages/th.json`)

Add this before the closing `}` of the root object:

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
      "socialMediaPlaceholder": "Instagram: @yourhandle\nFacebook: facebook.com/yourpage\nSoundCloud: soundcloud.com/yourprofile",
      "socialMediaHelp": "หนึ่งลิงก์ต่อบรรทัด",
      "experience": "ประสบการณ์ (ปี)",
      "equipment": "อุปกรณ์ที่มี",
      "equipmentPlaceholder": "ระบุอุปกรณ์ DJ เครื่องดนตรี เครื่องเสียง ไฟ ฯลฯ",
      "portfolio": "ผลงาน / Portfolio",
      "portfolioPlaceholder": "SoundCloud mixes:\nการแสดงบน YouTube:\nหน้า Spotify artist:",
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

## Instructions

1. Open `messages/en.json`
2. Find the last property before the closing `}`
3. Add a comma after that property
4. Paste the English `"apply": { ... }` block
5. Save the file

6. Open `messages/th.json`
7. Find the last property before the closing `}`
8. Add a comma after that property
9. Paste the Thai `"apply": { ... }` block
10. Save the file

## Update Header Navigation

Add this link to the Header component (`components/layout/Header.tsx`):

In the `navItems` array around line 30-34, add:

```typescript
{ label: t('applyAsDJ'), href: '/apply' },
```

And add this translation key to both language files:

**English (`messages/en.json`)**: In the `"nav"` section:
```json
"applyAsDJ": "Apply as DJ"
```

**Thai (`messages/th.json`)**: In the `"nav"` section:
```json
"applyAsDJ": "สมัครเป็นศิลปิน"
```
