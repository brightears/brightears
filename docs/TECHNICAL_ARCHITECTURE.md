# Technical Architecture - The Listening Room

## Purpose
Complete system architecture for The Listening Room AI art installation, including file structure, API integration, data flow, and performance specifications.

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [API Integrations](#api-integrations)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Performance Specifications](#performance-specifications)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Considerations](#security-considerations)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                            │
├─────────────────────────────────────────────────────────────┤
│  Next.js Frontend (Client Components)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Particle   │  │   Audio     │  │   Chat      │        │
│  │  Canvas     │  │  Synthesizer│  │  Interface  │        │
│  │  (p5.js)    │  │  (Tone.js)  │  │  (React)    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                │                 │                │
│         └────────────────┴─────────────────┘                │
│                          ▼                                  │
│              Sync Engine (Orchestrator)                     │
│              - Mood Detection                               │
│              - Audio-Visual Sync                            │
│              - State Management                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Next.js API Routes (Backend)                 │
├─────────────────────────────────────────────────────────────┤
│  /api/conversation/send    - Gemini AI integration         │
│  /api/conversation/history - Session persistence           │
│  /api/mood/detect         - NLP mood analysis              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services (FREE Tier)                  │
├─────────────────────────────────────────────────────────────┤
│  Gemini 1.5 Flash API - Cryptic conversation (1,500/day)   │
│  Vercel Hosting       - Static site deployment (FREE)      │
│  LocalStorage        - Session persistence (no DB needed)  │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **Client-First**: All generative systems run in browser (no backend load)
- **Stateless API**: Gemini calls are one-shot (no session management)
- **LocalStorage Persistence**: Conversation history saved locally (privacy + free)
- **Zero Database**: No PostgreSQL needed for this experience
- **Edge Computing**: Deploy to Vercel Edge for global low-latency

---

## Technology Stack

### Frontend (Client-Side)

**Core Framework:**
- **Next.js 15** - React framework with App Router
- **React 18** - Component library with Suspense
- **TypeScript 5.3** - Type safety and developer experience

**Generative Systems:**
- **p5.js 1.9** - Particle system and canvas rendering
- **Tone.js 14.8** - Audio synthesis and effects
- **Three.js** (optional) - 3D particles if needed

**UI & Styling:**
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion** (minimal) - Logo animations only
- **CSS Animations** - Particle movements, transitions

**State Management:**
- **React Context API** - Global state (mood, audio settings)
- **useReducer Hook** - Complex state logic (conversation)
- **LocalStorage** - Session persistence across refreshes

**API Clients:**
- **Fetch API** (native) - Gemini API calls
- **EventSource** (optional) - Server-sent events for streaming

---

### Backend (API Routes)

**Runtime:**
- **Next.js API Routes** - Serverless functions
- **Node.js 20** - Runtime environment
- **Edge Runtime** (optional) - For global low-latency

**AI Integration:**
- **Google Gemini SDK** - Official Node.js client
- **Gemini 1.5 Flash** - Model selection (free tier)

**NLP & Processing:**
- **Natural** (npm) - Keyword extraction and stemming (optional)
- **Custom Regex** - Keyword matching for mood detection
- **Sentiment Analysis** - VADER-style valence/arousal (optional)

---

### DevOps & Deployment

**Hosting:**
- **Vercel** - Free tier (hobby projects)
- **Cloudflare Pages** (alternative) - Also free with edge

**Version Control:**
- **Git** - Source control
- **GitHub** - Repository hosting
- **GitHub Actions** (optional) - CI/CD automation

**Monitoring:**
- **Vercel Analytics** - Free tier (page views, performance)
- **Console Logging** - Client-side debugging
- **Error Boundaries** - React error handling

---

## File Structure

```
brightears/
├── app/
│   ├── [locale]/
│   │   ├── listening-room/
│   │   │   ├── page.tsx                 # Main entry point
│   │   │   └── layout.tsx               # Full-screen layout
│   │   └── layout.tsx                   # Root layout (preserves header/footer)
│   │
│   └── api/
│       ├── conversation/
│       │   ├── send/route.ts            # POST - Send message to Gemini
│       │   └── history/route.ts         # GET - Retrieve session history
│       │
│       └── mood/
│           └── detect/route.ts          # POST - Keyword-based mood detection
│
├── components/
│   └── ListeningRoom/
│       ├── SyncEngine.tsx               # Orchestrator (mood, audio, visual sync)
│       ├── GenerativeCanvas.tsx         # p5.js particle system
│       ├── AudioSynthesizer.tsx         # Tone.js mood soundscapes
│       ├── ChatInterface.tsx            # User text input + AI responses
│       ├── LogoIntro.tsx                # Logo fade-in animation (Act I)
│       ├── HiddenLinks.tsx              # "For Venues" / "For Artists" (3min fade)
│       └── MoodVisualizer.tsx           # Debug tool (dev only)
│
├── lib/
│   ├── audio/
│   │   ├── mood-soundscapes.ts          # Tone.js presets (5 moods)
│   │   ├── audio-context.ts             # Web Audio initialization
│   │   └── fft-analyzer.ts              # Frequency spectrum analysis
│   │
│   ├── visuals/
│   │   ├── particle-system.ts           # p5.js particle class
│   │   ├── color-palettes.ts            # RGB/Hex mood color mappings
│   │   └── mouse-interactions.ts        # Attraction/repulsion physics
│   │
│   ├── nlp/
│   │   ├── mood-detector.ts             # Keyword matching + confidence
│   │   ├── keyword-dictionaries.ts      # 5 mood keyword arrays
│   │   └── sentiment-analyzer.ts        # Valence/arousal (optional)
│   │
│   └── api/
│       ├── gemini-client.ts             # Gemini API wrapper
│       ├── system-prompts.ts            # Mystical prompt templates
│       └── rate-limiter.ts              # Client-side API throttling
│
├── hooks/
│   ├── useConversation.ts               # Chat state management
│   ├── useMoodDetection.ts              # Real-time mood analysis
│   ├── useAudioSync.ts                  # Audio-visual synchronization
│   └── useLocalStorage.ts               # Session persistence
│
├── types/
│   ├── conversation.ts                  # Message, Session types
│   ├── mood.ts                          # MoodType, Confidence types
│   └── audio.ts                         # AudioSettings, SynthPreset types
│
├── public/
│   └── assets/
│       └── bright-ears-logo.svg         # Brand logo (cyan glow version)
│
├── docs/                                # Documentation (already created)
│   ├── LISTENING_ROOM_COMPLETE_VISION.md
│   ├── COLOR_SOUND_PSYCHOLOGY_RESEARCH.md
│   ├── MYSTICAL_ART_INSTALLATION_RESEARCH.md
│   ├── TECHNICAL_ARCHITECTURE.md        # This file
│   └── IMPLEMENTATION_ROADMAP.md        # Next to create
│
├── .claude/
│   └── agents/                          # Sub-agents (already created)
│       ├── generative-audio-expert.md
│       ├── generative-visuals-expert.md
│       ├── ai-conversation-designer.md
│       ├── immersive-ux-architect.md
│       └── mood-detection-specialist.md
│
├── .env.local                           # Environment variables (gitignored)
├── next.config.js                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind customization
├── tsconfig.json                        # TypeScript config
└── package.json                         # Dependencies
```

---

## API Integrations

### 1. Gemini 1.5 Flash API

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`

**Authentication:**
```typescript
// .env.local
GOOGLE_GEMINI_API_KEY=your_api_key_here

// lib/api/gemini-client.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

**Request Format:**
```typescript
// app/api/conversation/send/route.ts
export async function POST(request: Request) {
  const { message, conversationHistory } = await request.json();

  const systemPrompt = `You are a mystical guide in an art installation...`;

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 150,
      topP: 0.95
    }
  });

  return Response.json({
    response: result.response.text(),
    timestamp: Date.now()
  });
}
```

**Rate Limits (FREE Tier):**
- 1,500 requests per day
- 15 requests per minute
- No cost for usage within limits

**Error Handling:**
```typescript
try {
  const result = await model.generateContent(...);
} catch (error) {
  if (error.status === 429) {
    return Response.json({
      response: "The voices are silent... try asking again in a moment",
      error: "rate_limit"
    }, { status: 429 });
  }
  // Fallback response maintains mystical tone
  return Response.json({
    response: "The resonance falters... breathe and try once more",
    error: "api_error"
  }, { status: 500 });
}
```

---

### 2. Mood Detection API (Custom)

**Endpoint:** `POST /api/mood/detect`

**Request:**
```typescript
{
  "text": "I want a really energetic vibe tonight, something exciting!",
  "mode": "subtle" // or "sensitive"
}
```

**Response:**
```typescript
{
  "mood": "energetic",
  "confidence": 0.85,
  "fallbackMode": false,
  "keywordsMatched": ["energetic", "exciting", "vibe"],
  "scores": {
    "energetic": 3,
    "romantic": 0,
    "happy": 0,
    "calming": 0,
    "partying": 0
  }
}
```

**Algorithm:**
```typescript
// lib/nlp/mood-detector.ts
export function detectMood(text: string, mode: "subtle" | "sensitive" = "subtle") {
  const words = text.toLowerCase().split(/\s+/);
  const scores: Record<MoodType, number> = {
    energetic: 0,
    romantic: 0,
    happy: 0,
    calming: 0,
    partying: 0
  };

  // Count keyword matches
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    scores[mood as MoodType] = keywords.filter(kw => words.includes(kw)).length;
  }

  // Find highest scoring mood
  const topMood = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  ) as MoodType;

  // Determine threshold (subtle = 3 keywords, sensitive = 1)
  const threshold = mode === "subtle" ? 3 : 1;
  const matchedCount = scores[topMood];

  // Calculate confidence (0-1 range)
  const confidence = Math.min(matchedCount / threshold, 1.0);
  const fallbackMode = matchedCount < 3; // Used sensitive mode

  return {
    mood: topMood,
    confidence,
    fallbackMode,
    keywordsMatched: moodKeywords[topMood].filter(kw => words.includes(kw)),
    scores
  };
}
```

**Keyword Dictionaries:**
```typescript
// lib/nlp/keyword-dictionaries.ts
export const moodKeywords: Record<MoodType, string[]> = {
  energetic: [
    "exciting", "energetic", "pumped", "hyped", "lively",
    "dynamic", "active", "vigorous", "intense", "powerful",
    "electric", "vibrant", "upbeat", "fast", "loud"
  ],
  romantic: [
    "romantic", "intimate", "love", "passion", "tender",
    "cozy", "warm", "affection", "gentle", "soft",
    "dim", "candles", "whisper", "close", "private"
  ],
  happy: [
    "happy", "joyful", "cheerful", "delighted", "pleased",
    "content", "glad", "sunny", "bright", "fun",
    "celebration", "party", "smile", "laugh", "enjoy"
  ],
  calming: [
    "calm", "peaceful", "relaxed", "tranquil", "serene",
    "soothing", "quiet", "gentle", "mellow", "chill",
    "slow", "soft", "ease", "breath", "zen"
  ],
  partying: [
    "party", "dance", "club", "rave", "wild",
    "crazy", "lit", "banging", "bass", "drop",
    "DJ", "beat", "groove", "hype", "turnt"
  ]
};
```

---

### 3. LocalStorage Session Persistence

**No backend database needed** - all session data stored client-side:

```typescript
// hooks/useLocalStorage.ts
export function useConversationPersistence() {
  const [conversation, setConversation] = useState<Message[]>([]);

  useEffect(() => {
    // Load on mount
    const saved = localStorage.getItem("listening-room-session");
    if (saved) {
      setConversation(JSON.parse(saved));
    }
  }, []);

  const saveMessage = (message: Message) => {
    const updated = [...conversation, message];
    setConversation(updated);
    localStorage.setItem("listening-room-session", JSON.stringify(updated));
  };

  const clearSession = () => {
    setConversation([]);
    localStorage.removeItem("listening-room-session");
  };

  return { conversation, saveMessage, clearSession };
}
```

**Data Structure:**
```typescript
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  mood?: MoodDetectionResult;
}

interface Session {
  id: string;
  messages: Message[];
  startedAt: number;
  lastActivityAt: number;
  detectedMoods: MoodType[];
}
```

**Privacy Benefits:**
- No server-side data collection
- User controls their own data
- Automatic cleanup on tab close (if desired)
- GDPR compliant (no PII stored server-side)

---

## Data Flow Architecture

### User Journey Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ ACT I: ARRIVAL (0-15 seconds)                          │
└─────────────────────────────────────────────────────────┘
User opens /listening-room
    │
    ▼
LogoIntro.tsx mounts
    │
    ├─> Logo fade-in (2s)
    │   ├─> CSS opacity: 0 → 1
    │   └─> Cyan glow effect
    │
    ▼
SyncEngine.tsx initializes
    │
    ├─> Loads saved session (LocalStorage)
    ├─> Initializes audio context (muted, awaiting user gesture)
    ├─> Starts particle system (neutral colors)
    └─> Displays first cryptic prompt
        └─> "What color lives between silence and sound?"

┌─────────────────────────────────────────────────────────┐
│ ACT II: DIALOGUE (15-90 seconds)                       │
└─────────────────────────────────────────────────────────┘
User types response
    │
    ├─> ChatInterface.tsx captures input
    │   └─> Particle pulses on each keystroke
    │
    ▼
User submits message
    │
    ├─> POST /api/conversation/send
    │   ├─> Gemini generates mystical response
    │   └─> Returns text (150 tokens max)
    │
    ├─> POST /api/mood/detect (parallel)
    │   ├─> Keyword matching
    │   └─> Returns { mood, confidence }
    │
    ▼
SyncEngine receives results
    │
    ├─> IF confidence > 0.6:
    │   ├─> Trigger mood transition (3-4s)
    │   ├─> AudioSynthesizer morphs soundscape
    │   └─> GenerativeCanvas shifts colors
    │
    └─> Display AI response (typewriter effect)

┌─────────────────────────────────────────────────────────┐
│ ACT III: IMMERSION (90s - 5min)                        │
└─────────────────────────────────────────────────────────┘
Conversation continues (2-3 more exchanges)
    │
    ├─> Mood shifts tracked in state
    ├─> Audio/visual stay synchronized
    └─> User explores mouse interactions
        └─> Particles follow, ripple, bloom

At 3-minute mark:
    │
    ├─> HiddenLinks.tsx fades in (20% opacity)
    │   ├─> "For Venues" (bottom-right)
    │   └─> "For Artists" (bottom-right)
    │
    └─> Subtle revelation in AI text (if natural):
        └─> "Some architects work with sound rather than stone..."

┌─────────────────────────────────────────────────────────┐
│ ACT IV: DEPARTURE (Anytime)                            │
└─────────────────────────────────────────────────────────┘
User leaves page
    │
    └─> Session saved to LocalStorage
        ├─> Conversation history
        ├─> Detected moods
        └─> Timestamp
```

---

### Real-Time Synchronization Flow

**Mood Transition (3-4 Second Orchestration):**

```typescript
// components/ListeningRoom/SyncEngine.tsx
async function triggerMoodTransition(newMood: MoodType) {
  // 1. Update global state
  setCurrentMood(newMood);

  // 2. Audio transition (start immediately)
  audioSynthesizerRef.current?.transitionTo(newMood, 3500); // 3.5s crossfade

  // 3. Visual transition (50ms delay for offset)
  setTimeout(() => {
    generativeCanvasRef.current?.morphColors(newMood, 4000); // 4s color shift
  }, 50);

  // 4. Log for analytics (optional)
  console.log(`Mood transition: ${currentMood} → ${newMood}`);
}
```

**Audio Crossfade:**
```typescript
// lib/audio/mood-soundscapes.ts
export class MoodSynthesizer {
  async transitionTo(mood: MoodType, duration: number) {
    const newPreset = moodPresets[mood];

    // Start new synth at 0 volume
    const newSynth = new Tone.PolySynth().toDestination();
    newSynth.volume.value = -60; // Start silent

    // Configure new synth
    newSynth.set(newPreset);

    // Crossfade volumes
    this.currentSynth.volume.rampTo(-60, duration / 1000); // Fade out old
    newSynth.volume.rampTo(0, duration / 1000);            // Fade in new

    // Replace reference after transition
    setTimeout(() => {
      this.currentSynth.dispose();
      this.currentSynth = newSynth;
    }, duration);
  }
}
```

**Visual Color Morph:**
```typescript
// lib/visuals/particle-system.ts
export class ParticleSystem {
  morphColors(mood: MoodType, duration: number) {
    const newPalette = colorPalettes[mood];
    const steps = Math.floor(duration / 16); // 60fps
    const increment = 1 / steps;

    let progress = 0;
    const interval = setInterval(() => {
      progress += increment;

      // Lerp between old and new colors
      this.currentColors = this.currentColors.map((oldColor, i) => {
        const newColor = newPalette[i];
        return lerpColor(oldColor, newColor, progress);
      });

      if (progress >= 1) {
        clearInterval(interval);
        this.currentColors = newPalette;
      }
    }, 16); // ~60fps
  }
}
```

---

## Performance Specifications

### Target Metrics

**Desktop (MacBook Pro, High-End PC):**
- **FPS**: 60fps consistent (particle rendering)
- **Particle Count**: 500,000 particles
- **Audio Latency**: < 50ms (Tone.js to speakers)
- **API Response**: < 2 seconds (Gemini generation)
- **Memory Usage**: < 500MB (including Chrome overhead)
- **CPU Usage**: < 40% (one core max)

**Mobile (iPhone 12+, Android Flagship):**
- **FPS**: 30-60fps (adaptive)
- **Particle Count**: 10,000-50,000 (device-based)
- **Audio Latency**: < 100ms
- **API Response**: < 3 seconds (cellular network)
- **Memory Usage**: < 200MB
- **Battery Impact**: < 5% per 5 minutes

---

### Optimization Strategies

**1. Particle Rendering:**
```typescript
// Adaptive particle count based on device
const getParticleCount = () => {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const isLowEnd = navigator.hardwareConcurrency < 4;

  if (isMobile) return isLowEnd ? 10000 : 50000;
  return isLowEnd ? 100000 : 500000;
};

// Use offscreen canvas for rendering
const offscreenCanvas = new OffscreenCanvas(width, height);
const ctx = offscreenCanvas.getContext("2d");

// Batch particle updates
particles.forEach(p => p.update()); // Single loop, no intermediate arrays
```

**2. Audio Optimization:**
```typescript
// Tone.js context initialization
Tone.context.latencyHint = "interactive"; // Prioritize low latency

// Limit polyphony
const synth = new Tone.PolySynth({
  maxPolyphony: 8, // Max simultaneous notes
  voice: Tone.Synth
});

// Reduce reverb/delay on mobile
const reverb = new Tone.Reverb({
  decay: isMobile ? 1.5 : 3.0,
  preDelay: 0.01
});
```

**3. API Request Throttling:**
```typescript
// Client-side rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

async function sendMessage(text: string) {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    throw new Error("Please wait before sending another message");
  }
  lastRequestTime = now;

  return fetch("/api/conversation/send", {
    method: "POST",
    body: JSON.stringify({ message: text })
  });
}
```

**4. Lazy Loading:**
```typescript
// Dynamically import heavy dependencies
const loadParticleSystem = async () => {
  const p5 = await import("p5");
  return new p5((sketch) => {
    // Setup particle system
  });
};

const loadAudioSynthesizer = async () => {
  const Tone = await import("tone");
  await Tone.start(); // Requires user gesture
  return new MoodSynthesizer();
};
```

---

## Deployment Architecture

### Vercel Configuration

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Server Components
  experimental: {
    serverActions: true,
  },

  // Environment variables validation
  env: {
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  },

  // Image optimization (not needed for this project)
  images: {
    unoptimized: true,
  },

  // Internationalization (existing setup)
  i18n: {
    locales: ["en", "th"],
    defaultLocale: "en",
  },
};

module.exports = nextConfig;
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "GOOGLE_GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

**Deployment Steps:**
1. Push code to GitHub repository
2. Connect Vercel to repository
3. Add `GOOGLE_GEMINI_API_KEY` to Vercel environment variables
4. Deploy (automatic on push to main branch)
5. Custom domain (optional): `listening-room.brightears.com`

**Edge Functions (Optional):**
```typescript
// app/api/conversation/send/route.ts
export const runtime = "edge"; // Deploy to edge network

export async function POST(request: Request) {
  // Runs on Vercel Edge Network (global low-latency)
}
```

---

## Security Considerations

### API Key Protection

**Environment Variables:**
```bash
# .env.local (gitignored)
GOOGLE_GEMINI_API_KEY=AIza...your_key_here

# .env.example (committed to repo)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Server-Side Only:**
```typescript
// ❌ NEVER expose API key client-side
const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY; // DON'T USE NEXT_PUBLIC_

// ✅ Always call from API routes
// app/api/conversation/send/route.ts
const apiKey = process.env.GOOGLE_GEMINI_API_KEY; // Server-side only
```

---

### Rate Limiting

**Gemini API Protection:**
```typescript
// Simple in-memory rate limiter (API route)
const requestCounts = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const count = requestCounts.get(ip) || 0;

  if (count >= 15) return false; // 15 req/min limit

  requestCounts.set(ip, count + 1);
  setTimeout(() => requestCounts.delete(ip), 60000); // Reset after 1 min

  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Please wait." },
      { status: 429 }
    );
  }

  // Process request...
}
```

---

### Content Security Policy

**Prevent XSS Attacks:**
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // p5.js needs eval
              "style-src 'self' 'unsafe-inline'", // Tailwind needs inline
              "connect-src 'self' https://generativelanguage.googleapis.com",
              "img-src 'self' data: blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

---

### User Privacy

**No PII Collection:**
- No email, name, or contact info required
- No authentication system
- No server-side conversation logging
- LocalStorage only (user controls data)

**GDPR Compliance:**
- No cookies used (except essential)
- No third-party trackers
- User can clear session anytime (localStorage.clear())
- Privacy policy: "We don't collect or store any personal data"

---

## Next Steps

**Phase 2: Implementation Begins**
- [ ] Set up Gemini API credentials
- [ ] Create base Next.js 15 app structure
- [ ] Implement conversation API endpoints
- [ ] Build NLP mood detection system
- [ ] Integrate Tone.js audio synthesis
- [ ] Develop p5.js particle system

**Documentation Complete:**
- [x] LISTENING_ROOM_COMPLETE_VISION.md
- [x] COLOR_SOUND_PSYCHOLOGY_RESEARCH.md
- [x] MYSTICAL_ART_INSTALLATION_RESEARCH.md
- [x] TECHNICAL_ARCHITECTURE.md
- [ ] IMPLEMENTATION_ROADMAP.md (next)

---

**Last Updated:** December 24, 2025
**Document Version:** 1.0
**Total Lines:** ~550
**Purpose:** Complete technical architecture for The Listening Room AI art installation
