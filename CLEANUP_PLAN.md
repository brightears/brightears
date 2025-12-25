# The Listening Room - Project Cleanup Plan

**Date:** December 24, 2025
**Purpose:** Remove all booking site code and dependencies to create a clean foundation for The Listening Room art installation

---

## Current State Analysis

**Project Size:** ~500+ files, bloated with booking platform code
**Target Size:** ~20-30 files (minimal Next.js + art installation)

**What The Listening Room Needs:**
- Next.js shell (routing, build system)
- p5.js (generative visuals)
- Tone.js (generative audio)
- Google Gemini API (mood detection)
- Minimal contact form overlay
- LocalStorage (session persistence)

**What Gets Removed:**
- All booking site pages/components
- Database (Prisma + PostgreSQL)
- Authentication (Clerk)
- Payment systems (PromptPay)
- Admin dashboards
- Artist/customer portals
- 95% of existing codebase

---

## Phase 1: Pages & Components Removal

### DELETE: App Pages
```
app/[locale]/
├── about/                      ❌ DELETE
├── admin/                      ❌ DELETE
├── apply/                      ❌ DELETE
├── artist/                     ❌ DELETE (entire folder)
├── artists/                    ❌ DELETE
├── bm-asia/                    ❌ DELETE
├── bookings/                   ❌ DELETE
├── corporate/                  ❌ DELETE
├── contact/                    ❌ DELETE
├── dashboard/                  ❌ DELETE
├── dj-music-design/            ❌ DELETE
├── faq/                        ❌ DELETE
├── how-it-works/               ❌ DELETE
├── messages/                   ❌ DELETE
├── onboarding/                 ❌ DELETE
├── pricing/                    ❌ DELETE
├── register/                   ❌ DELETE
├── reviews/                    ❌ DELETE
├── sign-in/                    ❌ DELETE
├── sign-up/                    ❌ DELETE
├── sso-callback/               ❌ DELETE
└── listening-room/             ✅ KEEP (move to root)
```

### DELETE: Components
```
components/
├── admin/                      ❌ DELETE (entire folder)
├── artist/                     ❌ DELETE (entire folder)
├── artists/                    ❌ DELETE (entire folder)
├── auth/                       ❌ DELETE (entire folder)
├── bookings/                   ❌ DELETE (entire folder)
├── dashboard/                  ❌ DELETE (entire folder)
├── forms/                      ❌ DELETE (entire folder)
├── home/                       ❌ DELETE (entire folder)
├── layout/                     ❌ DELETE (Header, Footer, etc.)
├── messages/                   ❌ DELETE (entire folder)
├── payment/                    ❌ DELETE (entire folder)
├── reviews/                    ❌ DELETE (entire folder)
├── shared/                     ❌ DELETE (entire folder)
├── upload/                     ❌ DELETE (entire folder)
├── ui/                         🔍 REVIEW (keep only needed)
├── ContactForm.tsx             ❌ DELETE
└── ListeningRoom/              ✅ KEEP (but will rebuild)
```

---

## Phase 2: API Routes Cleanup

### DELETE: API Routes
```
app/api/
├── admin/                      ❌ DELETE (entire folder)
├── applications/               ❌ DELETE (entire folder)
├── artist/                     ❌ DELETE (entire folder)
├── artists/                    ❌ DELETE (keep only public/artists for hidden contact)
├── auth/                       ❌ DELETE (entire folder)
├── bookings/                   ❌ DELETE (entire folder)
├── contact/                    ❌ DELETE (replace with minimal version)
├── dj-music-design/            ❌ DELETE (entire folder)
├── documents/                  ❌ DELETE (entire folder)
├── email/                      ❌ DELETE (entire folder)
├── favorites/                  ❌ DELETE (entire folder)
├── messages/                   ❌ DELETE (entire folder)
├── payments/                   ❌ DELETE (entire folder)
├── public/                     🔍 REVIEW (might keep minimal API)
├── quotes/                     ❌ DELETE (entire folder)
├── reviews/                    ❌ DELETE (entire folder)
├── upload/                     ❌ DELETE (entire folder)
├── user/                       ❌ DELETE (entire folder)
├── webhooks/                   ❌ DELETE (entire folder)
├── conversation/               ✅ KEEP (but simplify)
└── health/                     ✅ KEEP (monitoring)
```

### KEEP: Essential API Routes
- `/api/conversation/send` - Gemini AI for mood detection
- `/api/contact/submit` - Hidden contact form (minimal)
- `/api/health` - Service health check

---

## Phase 3: Database & Authentication Removal

### DELETE: Database Files
```
prisma/
├── schema.prisma               ❌ DELETE
├── migrations/                 ❌ DELETE (entire folder)
└── seed.ts                     ❌ DELETE
```

### DELETE: Auth Configuration
```
middleware.ts                   ❌ DELETE (Clerk middleware)
lib/auth.ts                     ❌ DELETE
lib/clerk.ts                    ❌ DELETE
```

### UPDATE: Environment Variables
Remove from `.env.local`:
```bash
DATABASE_URL                    ❌ REMOVE
NEXT_PUBLIC_CLERK_*            ❌ REMOVE (all Clerk vars)
CLERK_SECRET_KEY               ❌ REMOVE
```

Keep only:
```bash
GOOGLE_GEMINI_API_KEY          ✅ KEEP
NEXT_PUBLIC_SITE_URL           ✅ KEEP
```

---

## Phase 4: Dependencies Cleanup

### package.json - Remove Dependencies

**DELETE:**
```json
"@clerk/nextjs"                ❌ REMOVE
"@prisma/client"               ❌ REMOVE
"prisma"                       ❌ REMOVE
"bcryptjs"                     ❌ REMOVE
"zod"                          ❌ REMOVE (unless needed for Gemini validation)
"react-hook-form"              ❌ REMOVE
"resend"                       ❌ REMOVE
"@react-email/components"      ❌ REMOVE
"qrcode"                       ❌ REMOVE (PromptPay)
"cloudinary"                   ❌ REMOVE
```

**KEEP:**
```json
"next"                         ✅ KEEP
"react"                        ✅ KEEP
"react-dom"                    ✅ KEEP
"typescript"                   ✅ KEEP
"tailwindcss"                  ✅ KEEP
"next-intl"                    🔍 MAYBE (if we need i18n)
"@google/generative-ai"        ✅ KEEP (Gemini)
"tone"                         ✅ KEEP (audio)
"p5"                           ✅ KEEP (visuals)
"@types/p5"                    ✅ KEEP
```

---

## Phase 5: Configuration Cleanup

### DELETE: Config Files
```
.eslintrc.json                 🔍 REVIEW (simplify rules)
tsconfig.json                  🔍 REVIEW (remove unused paths)
next.config.js                 🔍 REVIEW (remove Cloudinary, etc.)
```

### DELETE: Scripts
```
scripts/
├── audit-pricing-consistency.ts           ❌ DELETE
├── check-temple-bass.ts                   ❌ DELETE
├── make-user-admin.ts                     ❌ DELETE
├── test-artist-registration.ts            ❌ DELETE
├── test-temple-bass-display.ts            ❌ DELETE
└── verify-filter-simplification.sh        ❌ DELETE
```

---

## Phase 6: Documentation Cleanup

### Archive Old Documentation
```
docs-archive/
└── booking-site-era/          ✅ ALREADY ARCHIVED (145 files)
```

### DELETE: Outdated Docs
```
ARTIST_REGISTRATION_API.md                 ❌ DELETE
FRONTEND_INTEGRATION_GUIDE.md              ❌ DELETE
PRICING_DISPLAY_LOGIC.md                   ❌ DELETE
DAY_11-12_SUMMARY.md                       ❌ DELETE
SESSION_*.md                               ❌ DELETE (all session files)
CHECKPOINT.md                              ❌ DELETE
PAGE_REVIEW_SUMMARY_2025-11-09.md         ❌ DELETE
FILTER_SIMPLIFICATION_SUMMARY.md           ❌ DELETE
API_*.md                                   ❌ DELETE (all API docs)
ACCESSIBILITY_*.md                         ❌ DELETE (all accessibility docs)
PERFORMANCE_*.md                           ❌ DELETE (all performance docs)
```

### KEEP: Listening Room Docs
```
docs/
├── LISTENING_ROOM_COMPLETE_VISION.md      ✅ KEEP
├── COLOR_SOUND_PSYCHOLOGY_RESEARCH.md     ✅ KEEP
├── MYSTICAL_ART_INSTALLATION_RESEARCH.md  ✅ KEEP
├── TECHNICAL_ARCHITECTURE.md              ✅ KEEP
└── IMPLEMENTATION_ROADMAP.md              ✅ KEEP
```

---

## Phase 7: Final Structure

### Target Project Structure (After Cleanup)
```
brightears/
├── app/
│   ├── api/
│   │   ├── conversation/send/route.ts     (Gemini mood detection)
│   │   ├── contact/submit/route.ts        (minimal contact form)
│   │   └── health/route.ts                (monitoring)
│   ├── fonts/                             (Next.js fonts)
│   ├── layout.tsx                         (minimal root layout)
│   ├── page.tsx                           (The Listening Room experience)
│   └── globals.css                        (minimal styles)
├── components/
│   └── ListeningRoom/                     (rebuilt from scratch)
│       ├── Experience.tsx                 (main p5.js canvas)
│       ├── AudioEngine.tsx                (Tone.js controller)
│       ├── MoodDetector.tsx               (Gemini integration)
│       └── ContactOverlay.tsx             (hidden form)
├── lib/
│   ├── api/
│   │   ├── gemini-client.ts               (AI integration)
│   │   └── system-prompts.ts              (mood prompts)
│   ├── audio/
│   │   └── tone-engine.ts                 (Tone.js setup)
│   └── visual/
│       └── p5-sketch.ts                   (p5.js sketch)
├── hooks/
│   └── useLocalStorage.ts                 (session persistence)
├── types/
│   └── conversation.ts                    (TypeScript types)
├── docs/
│   └── (5 Listening Room research docs)
├── public/
│   └── (minimal assets)
├── .env.local                             (Gemini API key only)
├── package.json                           (minimal dependencies)
├── next.config.js                         (minimal config)
├── tailwind.config.js                     (minimal styles)
└── tsconfig.json                          (minimal TS config)
```

**Estimated Reduction:**
- From: ~500 files
- To: ~30 files
- Size reduction: ~94%

---

## Execution Plan

### Step 1: Backup Current State
```bash
git tag -a backup-before-cleanup -m "Backup before cleanup"
git push origin backup-before-cleanup
```

### Step 2: Use Sub-Agent for Cleanup
- **Agent:** `legacy-modernizer` (removes old code, technical debt)
- **Task:** Execute systematic deletion following this plan

### Step 3: Remove Large Folders First
```bash
rm -rf app/[locale]/admin
rm -rf app/[locale]/artist
rm -rf app/[locale]/bookings
rm -rf components/admin
rm -rf components/artist
rm -rf prisma
# ... (continue with plan)
```

### Step 4: Clean Dependencies
```bash
npm uninstall @clerk/nextjs @prisma/client prisma bcryptjs zod react-hook-form resend @react-email/components qrcode cloudinary
```

### Step 5: Verify Build
```bash
npm install
npm run build
```

### Step 6: Commit Cleanup
```bash
git add .
git commit -m "chore: remove booking site code, prepare for Listening Room rebuild"
git push origin main
```

---

## Success Criteria

✅ Project builds successfully
✅ No TypeScript errors
✅ Only essential dependencies remain
✅ File count reduced by >90%
✅ Clean foundation for art installation
✅ Documentation updated

---

## Next Steps (After Cleanup)

1. **Rebuild Listening Room** from scratch with proper artistic approach
2. **Implement mood journey** (detect → generate → improve)
3. **Add generative systems** (p5.js + Tone.js)
4. **Deploy clean version** to production

---

**Estimated Cleanup Time:** 45-60 minutes
**Agent:** `legacy-modernizer` (automated cleanup)
**Manual Review:** Required before commit
