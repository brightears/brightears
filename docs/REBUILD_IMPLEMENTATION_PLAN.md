# THE LISTENING ROOM - Technical Rebuild Implementation Plan

**Document Type:** Technical Implementation Specification
**Status:** Ready for Development
**Created:** December 25, 2024
**Estimated Duration:** 80-120 hours (2-3 weeks full-time)
**Current State:** Minimal Next.js shell, basic components exist but need complete rebuild

---

## Table of Contents

1. [User Experience Architecture](#1-user-experience-architecture)
2. [Visual System Design](#2-visual-system-design)
3. [Audio System Design](#3-audio-system-design)
4. [Component Architecture](#4-component-architecture)
5. [Phase-by-Phase Build Plan](#5-phase-by-phase-build-plan)
6. [Technical Risks & Mitigations](#6-technical-risks--mitigations)

---

## 1. USER EXPERIENCE ARCHITECTURE

### 1.1 Complete User Journey Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACT I: ARRIVAL (0-15s)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    User lands on page
                      (Black screen)
                              │
                              ▼
                ┌──────────────────────────┐
                │  Logo Fade-In Animation  │
                │  - Duration: 2-3 seconds │
                │  - Cyan glow effect      │
                │  - Gentle pulse/breathe  │
                └──────────────────────────┘
                              │
                              ▼
                    Logo shrinks & moves
                   to bottom-right corner
                    (becomes watermark)
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Audio Activation Prompt Appears        │
        │  ┌─────────────────────────────────┐   │
        │  │  [Speaker Icon]                 │   │
        │  │  "Click to enable sound"        │   │
        │  │  (bottom-left corner)           │   │
        │  └─────────────────────────────────┘   │
        └─────────────────────────────────────────┘
                              │
                              ▼
        User clicks speaker (optional, audio enabled)
        OR proceeds without sound
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  First Cryptic Prompt Appears           │
        │  - "What color lives between            │
        │     silence and sound?"                 │
        │  - Text input field fades in            │
        │  - Brand particles begin floating       │
        └─────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   ACT II: DIALOGUE (15-90s)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  User types response
                              │
        ┌─────────────────────┴─────────────────────┐
        │  Keystroke Interactions                   │
        │  - Particles gravitate toward cursor      │
        │  - Soft typing sounds (optional)          │
        │  - Text appears with glow effect          │
        └───────────────────────────────────────────┘
                              │
                              ▼
                  User presses Enter/Submit
                              │
        ┌─────────────────────┴─────────────────────┐
        │  Processing State                         │
        │  - User message adds to conversation      │
        │  - Particles swirl (thinking animation)   │
        │  - API call to /api/conversation/send     │
        │  - Parallel call to mood detection        │
        └───────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
        Mood Detected (60%+)      No Mood Detected (<60%)
                │                           │
                ▼                           ▼
    ┌──────────────────────┐   ┌──────────────────────┐
    │  Trigger Transition  │   │  Stay in Neutral     │
    │  - Colors shift      │   │  - Mixed palette     │
    │  - Audio evolves     │   │  - Ambient sounds    │
    │  - Particles adapt   │   │  - Oblique prompts   │
    └──────────────────────┘   └──────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
        ┌─────────────────────────────────────────┐
        │  AI Response Appears                    │
        │  - Typewriter effect (80ms/char)        │
        │  - Cryptic, poetic, never literal       │
        │  - Asks follow-up question              │
        └─────────────────────────────────────────┘
                              │
                              ▼
        Conversation loop continues (2-3 exchanges)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                  ACT III: IMMERSION (1-5min)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Interactive Elements Fully Active      │
        │                                         │
        │  Mouse Movement:                        │
        │  - Particles follow cursor with spring  │
        │  - Create "wake" trail                  │
        │  - Attraction/repulsion physics         │
        │                                         │
        │  Mouse Clicks:                          │
        │  - Ripple effect radiates outward       │
        │  - Harmonic tone plays (mood-based)     │
        │  - Particles scatter & regroup          │
        │  - Color bloom effect                   │
        │                                         │
        │  Scrolling (optional):                  │
        │  - Parallax depth effect                │
        │  - 3D illusion                          │
        └─────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Audio-Visual Synchronization           │
        │  - FFT analysis: spectrum → particle    │
        │  - Frequency → color mapping            │
        │  - Amplitude → brightness               │
        │  - BPM → motion speed                   │
        └─────────────────────────────────────────┘
                              │
                              ▼
                  Time on site: 3 minutes
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Hidden Links Fade In (20% → 100%)     │
        │  - Top-right: "For Artists"             │
        │  - Top-left: "For Venues"               │
        │  - Discover on hover                    │
        └─────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              ACT IV: REVELATION (5+ min, Optional)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        IF conversation naturally flows toward
        atmosphere/venues/music/design
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  AI Subtly Hints at Business            │
        │  - "Some architects work with sound     │
        │     rather than stone..."               │
        │  - Never direct sales language          │
        │  - User must connect dots               │
        └─────────────────────────────────────────┘
                              │
                              ▼
        User clicks "For Venues" or "For Artists"
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Contact Form Overlay                   │
        │  - Maintains aesthetic                  │
        │  - Minimal fields                       │
        │  - Doesn't break immersion              │
        └─────────────────────────────────────────┘
                              │
                              ▼
                     User submits inquiry
                              │
                              ▼
        Thank you message → Returns to experience
```

---

### 1.2 Interaction Patterns for Each Act

#### ACT I: ARRIVAL
**Pattern:** Passive observation → First interaction

**States:**
```typescript
type ArrivalState =
  | 'initial_black'      // 0s - Absolute darkness
  | 'logo_fade_in'       // 0-2s - Logo appears
  | 'logo_breathing'     // 2-4s - Gentle pulse animation
  | 'logo_shrinking'     // 4-6s - Moves to corner
  | 'audio_prompt'       // 6s - Speaker icon appears
  | 'particles_start'    // 7s - First particles appear
  | 'cryptic_prompt'     // 8s - First question appears
  | 'ready_for_input';   // 10s - User can type
```

**Transitions:**
- All automatic except audio activation (user gesture required)
- Particles begin immediately but subtly (100 particles max)
- No user input required until "ready_for_input" state
- Skip intro if returning user (check localStorage)

**Visual Elements:**
```typescript
interface ArrivalVisuals {
  background: '#030129';           // Deep space black
  logoColor: '#00bbe4';            // Bright Ears cyan
  logoGlow: '0 0 20px rgba(0, 187, 228, 0.6)';
  particleColors: ['#00bbe4', '#008B9C', '#6B4423', '#9B7EBD']; // Brand palette
  particleCount: 100;              // Minimal, brand intro
  particleSpeed: 0.3;              // Very slow drift
  textFont: 'Playfair Display';    // Serif, mystical
  textColor: '#FFFFFF';
  textGlow: '0 0 2px rgba(255, 255, 255, 0.8)';
}
```

#### ACT II: DIALOGUE
**Pattern:** Interactive conversation with invisible mood detection

**States:**
```typescript
type DialogueState =
  | 'user_typing'        // User actively typing
  | 'message_sending'    // API call in progress
  | 'ai_thinking'        // Particles swirl, waiting
  | 'ai_responding'      // Typewriter effect
  | 'mood_transitioning' // Colors/audio shifting
  | 'awaiting_reply';    // Ready for next input
```

**Transitions:**
```typescript
// State machine
const dialogueTransitions = {
  awaiting_reply: {
    on_keystroke: 'user_typing'
  },
  user_typing: {
    on_submit: 'message_sending'
  },
  message_sending: {
    on_api_response: 'ai_thinking',
    on_error: 'awaiting_reply'
  },
  ai_thinking: {
    on_mood_detected: 'mood_transitioning',
    on_no_mood: 'ai_responding'
  },
  mood_transitioning: {
    after_3_seconds: 'ai_responding'
  },
  ai_responding: {
    on_complete: 'awaiting_reply'
  }
};
```

**Interaction Details:**
```typescript
interface DialogueInteractions {
  keystroke: {
    particleEffect: 'small_pulse',    // Radius: 50px
    audioFeedback: 'soft_click',      // Optional, 0.1 volume
    visualFeedback: 'cursor_glow'     // Cyan glow around cursor
  },

  submit: {
    userMessage: {
      animation: 'fade_in',           // 300ms
      alignment: 'right',             // Chat UI style
      background: 'rgba(0, 187, 228, 0.1)'
    },
    particleReaction: 'swirl',        // All particles spiral
    audioTrigger: 'send_whoosh'       // Subtle send sound
  },

  aiResponse: {
    animation: 'typewriter',          // 80ms per character
    alignment: 'left',
    textColor: '#FFFFFF',
    maxLength: 150,                   // Token limit
    style: 'cryptic_poetic'           // Never therapeutic
  },

  moodTransition: {
    duration: 3500,                   // 3.5 seconds
    colorMorphSteps: 210,             // 60fps * 3.5s
    audioCrossfade: 3500,             // Match visual timing
    particleAdaptation: {
      energetic: { speed: 2.0, chaos: 0.8 },
      romantic: { speed: 0.5, paired: true },
      happy: { speed: 1.2, bouncy: true },
      calming: { speed: 0.3, flow: 'wave' },
      partying: { speed: 2.5, pulse: true }
    }
  }
}
```

#### ACT III: IMMERSION
**Pattern:** Continuous interaction, sensory exploration

**Mouse Movement:**
```typescript
interface MouseInteraction {
  attraction: {
    enabled: true,
    radius: 150,                    // Pixels
    strength: 0.05,                 // Force multiplier
    maxVelocity: 5.0,               // Cap speed
    friction: 0.95                  // Gradual slow-down
  },

  trail: {
    enabled: true,
    particleSpawn: false,           // Don't create new particles
    existingParticlesReact: true,   // Pull nearby particles
    wakeLength: 200,                // Pixels behind cursor
    fadeOut: 1000                   // ms to disappear
  },

  parallax: {
    enabled: false,                 // Optional feature
    layers: 3,                      // Foreground/mid/back
    depthMultiplier: [1.5, 1.0, 0.5]
  }
}
```

**Mouse Clicks:**
```typescript
interface ClickInteraction {
  ripple: {
    enabled: true,
    maxRadius: 300,                 // px
    duration: 1200,                 // ms
    opacity: 0.6,                   // Start opacity
    color: 'current_mood_primary',  // Dynamic
    lineWidth: 2
  },

  particleScatter: {
    enabled: true,
    radius: 200,                    // Affected area
    force: 10.0,                    // Outward push
    regroupDelay: 800,              // ms before returning
    regroupDuration: 2000           // ms to settle
  },

  audioTrigger: {
    enabled: true,
    note: 'mood_harmonic',          // Based on current mood
    duration: 1500,                 // ms
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.6,
      release: 0.5
    }
  },

  bloom: {
    enabled: true,
    color: 'current_mood_accent',
    radius: 100,
    duration: 800,
    blur: 20
  }
}
```

**Scroll Interaction (Optional):**
```typescript
interface ScrollInteraction {
  enabled: false,                   // Not critical for v1
  parallaxDepth: true,
  zoomEffect: false,
  particleSizeVariation: true
}
```

---

### 1.3 State Transitions

```typescript
// Global App State Machine
type AppState =
  | 'arrival_intro'
  | 'dialogue_active'
  | 'immersion_deep'
  | 'revelation_hints'
  | 'contact_overlay';

type MoodState =
  | 'neutral'
  | 'energetic'
  | 'romantic'
  | 'happy'
  | 'calming'
  | 'partying'
  | 'transitioning';

type AudioState =
  | 'disabled'
  | 'awaiting_activation'
  | 'active'
  | 'crossfading';

interface GlobalState {
  app: AppState;
  mood: {
    current: MoodState;
    previous: MoodState | null;
    confidence: number;           // 0-1
    transitionProgress: number;   // 0-1
  };
  audio: {
    state: AudioState;
    volume: number;               // 0-1
    masterGain: GainNode | null;
  };
  conversation: {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
  };
  session: {
    startTime: number;
    duration: number;             // Calculated
    linksVisible: boolean;        // Show after 3min
    returningUser: boolean;
  };
}
```

**State Transition Rules:**
```typescript
const transitionRules = {
  arrival_intro: {
    auto_advance_after: 15000,              // 15s
    skip_if: 'returningUser === true',
    next_state: 'dialogue_active'
  },

  dialogue_active: {
    advance_on: 'message_count >= 3',       // 3 exchanges
    next_state: 'immersion_deep'
  },

  immersion_deep: {
    advance_on: 'duration >= 180000',       // 3 minutes
    next_state: 'revelation_hints',
    side_effect: 'fadeInHiddenLinks()'
  },

  revelation_hints: {
    advance_on: 'click_venue_or_artist_link',
    next_state: 'contact_overlay'
  },

  contact_overlay: {
    advance_on: 'form_submit || overlay_close',
    next_state: 'immersion_deep'            // Return to experience
  }
};
```

---

### 1.4 Mood Detection UX (Invisible to User)

**Detection Strategy:**
```typescript
interface MoodDetectionConfig {
  mode: 'subtle' | 'sensitive';

  subtle: {
    keywordThreshold: 3,          // Require 3+ keywords
    confidence: 'high',           // 0.7-1.0
    falsePositiveRate: 'low'
  },

  sensitive: {
    keywordThreshold: 1,          // Accept 1-2 keywords
    confidence: 'medium',         // 0.4-0.7
    falsePositiveRate: 'higher',
    activateWhen: 'no_mood_after_3_messages'
  }
}
```

**Invisible Indicators (Dev Only):**
```typescript
interface MoodDebugDisplay {
  enabled: process.env.NODE_ENV === 'development',

  overlay: {
    position: 'bottom-left',
    content: [
      'Current Mood: ${mood}',
      'Confidence: ${confidence * 100}%',
      'Keywords Matched: ${keywords.join(", ")}',
      'Mode: ${mode}',
      'Messages Analyzed: ${count}'
    ],
    opacity: 0.3,
    fontSize: '10px',
    fontFamily: 'monospace'
  }
}
```

**User-Visible Cues (Subtle):**
- No text indicating mood detected
- No labels or UI elements
- Only visual/audio transition (user may notice color shift)
- Could be interpreted as "natural evolution" of the experience

---

## 2. VISUAL SYSTEM DESIGN

### 2.1 p5.js Particle System Specifications

#### Core Particle Class
```typescript
class Particle {
  // Position & Movement
  x: number;
  y: number;
  vx: number;                     // Velocity X
  vy: number;                     // Velocity Y
  ax: number = 0;                 // Acceleration X
  ay: number = 0;                 // Acceleration Y

  // Visual Properties
  color: p5.Color;
  size: number;                   // 2-8 pixels
  opacity: number;                // 0-1
  blur: number;                   // 0-5 pixels

  // Behavior
  mass: number;                   // For physics calculations
  friction: number = 0.95;        // Natural slowdown
  maxSpeed: number = 5.0;         // Cap velocity

  // Organic Movement
  noiseOffsetX: number;           // Perlin noise seed
  noiseOffsetY: number;
  noiseStrength: number = 0.5;    // How much noise affects

  // Mood-Based Modifiers
  moodSpeed: number = 1.0;        // Multiplier
  moodBehavior: string;           // 'drift', 'bounce', 'swirl', etc.

  constructor(p5: p5, x: number, y: number, color: p5.Color) {
    this.x = x;
    this.y = y;
    this.vx = p5.random(-1, 1);
    this.vy = p5.random(-1, 1);
    this.color = color;
    this.size = p5.random(2, 6);
    this.opacity = p5.random(0.3, 0.8);
    this.mass = this.size / 4;
    this.noiseOffsetX = p5.random(1000);
    this.noiseOffsetY = p5.random(1000);
  }

  update(p5: p5, deltaTime: number): void {
    // Apply Perlin noise for organic movement
    const noiseX = p5.noise(this.noiseOffsetX) * 2 - 1;
    const noiseY = p5.noise(this.noiseOffsetY) * 2 - 1;
    this.ax += noiseX * this.noiseStrength;
    this.ay += noiseY * this.noiseStrength;
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;

    // Apply acceleration to velocity
    this.vx += this.ax;
    this.vy += this.ay;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Cap speed
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }

    // Update position
    this.x += this.vx * this.moodSpeed;
    this.y += this.vy * this.moodSpeed;

    // Reset acceleration
    this.ax = 0;
    this.ay = 0;

    // Wrap around screen edges
    if (this.x < 0) this.x = p5.width;
    if (this.x > p5.width) this.x = 0;
    if (this.y < 0) this.y = p5.height;
    if (this.y > p5.height) this.y = 0;
  }

  display(p5: p5): void {
    p5.noStroke();
    p5.fill(
      p5.red(this.color),
      p5.green(this.color),
      p5.blue(this.color),
      this.opacity * 255
    );

    // Optional blur effect (performance cost)
    if (this.blur > 0) {
      p5.drawingContext.shadowBlur = this.blur;
      p5.drawingContext.shadowColor = this.color.toString();
    }

    p5.ellipse(this.x, this.y, this.size);

    // Reset shadow
    p5.drawingContext.shadowBlur = 0;
  }

  applyForce(fx: number, fy: number): void {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  attractToPoint(px: number, py: number, strength: number): void {
    const dx = px - this.x;
    const dy = py - this.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < 150 && distance > 5) {
      const force = strength / distance;
      this.applyForce(dx * force, dy * force);
    }
  }
}
```

---

#### Particle System Manager
```typescript
class ParticleSystemManager {
  particles: Particle[] = [];
  p5: p5;
  targetCount: number;
  currentMood: MoodType = 'neutral';

  constructor(p5Instance: p5, deviceTier: 'high' | 'medium' | 'low') {
    this.p5 = p5Instance;

    // Device-adaptive particle count
    this.targetCount = {
      high: 500000,
      medium: 100000,
      low: 10000
    }[deviceTier];

    // Initialize particles
    this.initializeParticles();
  }

  initializeParticles(): void {
    const colors = this.getCurrentColorPalette();

    for (let i = 0; i < this.targetCount; i++) {
      const x = this.p5.random(this.p5.width);
      const y = this.p5.random(this.p5.height);
      const color = this.p5.random(colors);

      this.particles.push(new Particle(this.p5, x, y, color));
    }
  }

  getCurrentColorPalette(): p5.Color[] {
    const palettes = {
      neutral: ['#00bbe4', '#008B9C', '#6B4423', '#9B7EBD'],
      energetic: ['#FF0000', '#FF6600', '#FFD700', '#C417C4'],
      romantic: ['#8B0000', '#FFBF00', '#FF6F91', '#9B59B6'],
      happy: ['#FFFF00', '#FFA500', '#FF7F50', '#00D4FF'],
      calming: ['#00bbe4', '#87CEEB', '#E0F7FA', '#B2EBF2'],
      partying: ['#C417C4', '#FF00FF', '#00FFFF', '#FF0000']
    };

    return palettes[this.currentMood].map(hex => this.p5.color(hex));
  }

  morphToMood(newMood: MoodType, duration: number = 4000): void {
    const oldColors = this.getCurrentColorPalette();
    this.currentMood = newMood;
    const newColors = this.getCurrentColorPalette();

    const steps = Math.floor(duration / 16); // 60fps
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;

      // Lerp each particle's color
      this.particles.forEach((particle, i) => {
        const oldColor = oldColors[i % oldColors.length];
        const newColor = newColors[i % newColors.length];

        particle.color = this.p5.lerpColor(oldColor, newColor, progress);

        // Update behavior based on mood
        particle.moodSpeed = this.getMoodSpeedMultiplier(newMood);
        particle.moodBehavior = this.getMoodBehavior(newMood);
      });

      if (step >= steps) clearInterval(interval);
    }, 16);
  }

  getMoodSpeedMultiplier(mood: MoodType): number {
    return {
      neutral: 1.0,
      energetic: 2.0,
      romantic: 0.5,
      happy: 1.2,
      calming: 0.3,
      partying: 2.5
    }[mood];
  }

  getMoodBehavior(mood: MoodType): string {
    return {
      neutral: 'drift',
      energetic: 'chaotic',
      romantic: 'paired_flow',
      happy: 'bouncy',
      calming: 'wave',
      partying: 'pulse'
    }[mood];
  }

  update(mouseX: number, mouseY: number, deltaTime: number): void {
    this.particles.forEach(particle => {
      // Mouse attraction
      particle.attractToPoint(mouseX, mouseY, 0.05);

      // Mood-specific behaviors
      this.applyMoodBehavior(particle);

      // Update particle
      particle.update(this.p5, deltaTime);
    });
  }

  applyMoodBehavior(particle: Particle): void {
    switch (particle.moodBehavior) {
      case 'chaotic':
        // Random force bursts
        if (this.p5.random(1) < 0.01) {
          particle.applyForce(this.p5.random(-5, 5), this.p5.random(-5, 5));
        }
        break;

      case 'bouncy':
        // Sine wave vertical motion
        particle.ay += Math.sin(this.p5.frameCount * 0.05) * 0.1;
        break;

      case 'wave':
        // Gentle wave motion
        particle.ax += Math.sin(particle.y * 0.01 + this.p5.frameCount * 0.02) * 0.05;
        break;

      case 'pulse':
        // Radial pulsing from center
        const dx = this.p5.width / 2 - particle.x;
        const dy = this.p5.height / 2 - particle.y;
        const pulseStrength = Math.sin(this.p5.frameCount * 0.1) * 0.02;
        particle.applyForce(dx * pulseStrength, dy * pulseStrength);
        break;
    }
  }

  display(): void {
    this.p5.background('#030129'); // Clear frame
    this.particles.forEach(particle => particle.display(this.p5));
  }

  handleClick(x: number, y: number): void {
    // Scatter particles from click point
    this.particles.forEach(particle => {
      const dx = particle.x - x;
      const dy = particle.y - y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);

      if (distance < 200) {
        const force = 10.0 / (distance + 1);
        particle.applyForce(dx * force, dy * force);
      }
    });
  }
}
```

---

### 2.2 TeamLab-Inspired Organic Movement Patterns

**Key Principles from TeamLab Borderless:**
1. **Continuous Flow** - No static states, always evolving
2. **Organic Growth** - Patterns emerge from simple rules
3. **Interconnectedness** - Elements influence each other
4. **Borderless** - Seamless transitions, no hard edges
5. **Responsive** - Reacts to presence without being obvious

**Implementation:**
```typescript
// Flocking behavior (like birds/fish)
class FlockingBehavior {
  separationRadius: number = 50;
  alignmentRadius: number = 100;
  cohesionRadius: number = 150;

  apply(particle: Particle, neighbors: Particle[]): void {
    const separation = this.calculateSeparation(particle, neighbors);
    const alignment = this.calculateAlignment(particle, neighbors);
    const cohesion = this.calculateCohesion(particle, neighbors);

    particle.applyForce(separation.x * 1.5, separation.y * 1.5);
    particle.applyForce(alignment.x * 1.0, alignment.y * 1.0);
    particle.applyForce(cohesion.x * 1.0, cohesion.y * 1.0);
  }

  calculateSeparation(particle: Particle, neighbors: Particle[]): { x: number, y: number } {
    let steerX = 0;
    let steerY = 0;
    let count = 0;

    neighbors.forEach(other => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

      if (distance > 0 && distance < this.separationRadius) {
        const diffX = particle.x - other.x;
        const diffY = particle.y - other.y;
        steerX += diffX / distance;
        steerY += diffY / distance;
        count++;
      }
    });

    if (count > 0) {
      steerX /= count;
      steerY /= count;
    }

    return { x: steerX, y: steerY };
  }

  calculateAlignment(particle: Particle, neighbors: Particle[]): { x: number, y: number } {
    let avgVx = 0;
    let avgVy = 0;
    let count = 0;

    neighbors.forEach(other => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

      if (distance > 0 && distance < this.alignmentRadius) {
        avgVx += other.vx;
        avgVy += other.vy;
        count++;
      }
    });

    if (count > 0) {
      avgVx /= count;
      avgVy /= count;
      return { x: avgVx - particle.vx, y: avgVy - particle.vy };
    }

    return { x: 0, y: 0 };
  }

  calculateCohesion(particle: Particle, neighbors: Particle[]): { x: number, y: number } {
    let centerX = 0;
    let centerY = 0;
    let count = 0;

    neighbors.forEach(other => {
      const distance = Math.hypot(particle.x - other.x, particle.y - other.y);

      if (distance > 0 && distance < this.cohesionRadius) {
        centerX += other.x;
        centerY += other.y;
        count++;
      }
    });

    if (count > 0) {
      centerX /= count;
      centerY /= count;
      return {
        x: (centerX - particle.x) * 0.01,
        y: (centerY - particle.y) * 0.01
      };
    }

    return { x: 0, y: 0 };
  }
}
```

---

### 2.3 James Turrell-Inspired Color/Light Approach

**Core Principles:**
1. **Slow Transitions** - Color changes imperceptible in the moment
2. **Atmospheric Depth** - Gradients create sense of space
3. **Perceptual Ambiguity** - Colors that shift based on context
4. **Luminous Quality** - Glow, not just flat color

**Implementation:**
```typescript
interface TurrellColorSystem {
  // Gradient backgrounds (not flat colors)
  background: {
    type: 'radial_gradient',
    center: { x: '50%', y: '50%' },
    stops: [
      { position: 0, color: '#030129', opacity: 1.0 },
      { position: 0.5, color: '#0A0A2E', opacity: 0.8 },
      { position: 1.0, color: '#000000', opacity: 1.0 }
    ]
  },

  // Glow effects on particles
  particleGlow: {
    enabled: true,
    blurRadius: 15,              // Pixels
    intensity: 0.6,              // 0-1
    colorShift: 10,              // Hue shift for glow vs fill
    fadeWithDistance: true       // Dimmer particles glow less
  },

  // Slow color morphing
  transitionDuration: 240000,    // 4 minutes per full transition
  easingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Slow ease

  // Ambient light overlays
  ambientLight: {
    enabled: true,
    layers: [
      {
        color: '#00bbe4',
        opacity: 0.03,
        blendMode: 'screen',
        position: 'top-left'
      },
      {
        color: '#9B7EBD',
        opacity: 0.02,
        blendMode: 'screen',
        position: 'bottom-right'
      }
    ]
  }
}
```

---

### 2.4 Performance Targets (60 FPS, Device Tiers)

**Device Detection:**
```typescript
function detectDeviceTier(): 'high' | 'medium' | 'low' {
  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4; // GB
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  // High-end: Desktop with 8+ cores, 8GB+ RAM
  if (!isMobile && cores >= 8 && memory >= 8) {
    return 'high';
  }

  // Medium: Desktop with 4+ cores, or flagship mobile
  if ((!isMobile && cores >= 4) || (isMobile && cores >= 6)) {
    return 'medium';
  }

  // Low: Everything else
  return 'low';
}
```

**Performance Targets by Tier:**
```typescript
const performanceTargets = {
  high: {
    fps: 60,
    particleCount: 500000,
    particleSize: [2, 8],
    blurEffects: true,
    flockingBehavior: true,
    audioFFT: 2048,               // FFT size
    canvasResolution: 1.0          // Retina full res
  },

  medium: {
    fps: 60,
    particleCount: 100000,
    particleSize: [2, 6],
    blurEffects: false,            // Too expensive
    flockingBehavior: true,
    audioFFT: 1024,
    canvasResolution: 1.0
  },

  low: {
    fps: 30,                       // Accept 30fps
    particleCount: 10000,
    particleSize: [3, 5],          // Larger, fewer
    blurEffects: false,
    flockingBehavior: false,       // Too CPU intensive
    audioFFT: 512,
    canvasResolution: 0.5          // Half resolution
  }
};
```

**FPS Monitoring & Adaptive Quality:**
```typescript
class PerformanceMonitor {
  frameTimestamps: number[] = [];
  currentFPS: number = 60;
  targetFPS: number = 60;
  qualityLevel: number = 1.0;    // 0-1 scale

  recordFrame(): void {
    const now = performance.now();
    this.frameTimestamps.push(now);

    // Keep last 60 frames
    if (this.frameTimestamps.length > 60) {
      this.frameTimestamps.shift();
    }

    // Calculate FPS
    if (this.frameTimestamps.length >= 2) {
      const elapsed = now - this.frameTimestamps[0];
      this.currentFPS = (this.frameTimestamps.length / elapsed) * 1000;
    }
  }

  shouldReduceQuality(): boolean {
    return this.currentFPS < this.targetFPS * 0.8; // 20% below target
  }

  shouldIncreaseQuality(): boolean {
    return this.currentFPS > this.targetFPS * 0.95; // Stable at target
  }

  adjustQuality(particleSystem: ParticleSystemManager): void {
    if (this.shouldReduceQuality() && this.qualityLevel > 0.2) {
      this.qualityLevel -= 0.1;

      // Reduce particle count
      const targetCount = Math.floor(
        particleSystem.targetCount * this.qualityLevel
      );
      particleSystem.particles = particleSystem.particles.slice(0, targetCount);

      console.log(`Reduced quality to ${this.qualityLevel}, ${targetCount} particles`);
    }

    if (this.shouldIncreaseQuality() && this.qualityLevel < 1.0) {
      this.qualityLevel += 0.05;
      // Could spawn more particles here
    }
  }
}
```

---

## 3. AUDIO SYSTEM DESIGN

### 3.1 Tone.js Architecture

**Core Audio Engine:**
```typescript
import * as Tone from 'tone';

class MoodAudioEngine {
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private filter: Tone.Filter | null = null;
  private masterGain: Tone.Gain | null = null;
  private fft: Tone.FFT | null = null;

  isInitialized: boolean = false;
  currentMood: MoodType = 'neutral';

  async initialize(): Promise<void> {
    // Must be called after user gesture (Web Audio policy)
    await Tone.start();

    // Create signal chain
    this.reverb = new Tone.Reverb({
      decay: 3.0,
      preDelay: 0.01
    }).toDestination();

    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.3
    }).connect(this.reverb);

    this.filter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      Q: 1
    }).connect(this.delay);

    this.masterGain = new Tone.Gain(0.5).connect(this.filter);

    this.fft = new Tone.FFT(2048).connect(this.masterGain);

    this.synth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 8,
      voice: Tone.Synth,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.5,
        decay: 0.3,
        sustain: 0.6,
        release: 1.0
      }
    }).connect(this.masterGain);

    this.isInitialized = true;

    // Start ambient drone
    this.startAmbientDrone();
  }

  startAmbientDrone(): void {
    if (!this.synth) return;

    // A2 (110 Hz) - very low, barely audible
    this.synth.triggerAttack('A2', Tone.now());

    // Add subtle harmonics
    setTimeout(() => {
      this.synth?.triggerAttack('E3', Tone.now()); // Perfect 5th
    }, 2000);
  }

  transitionToMood(newMood: MoodType, duration: number = 3500): void {
    if (!this.synth || !this.filter || !this.delay) return;

    const preset = this.getMoodPreset(newMood);
    const now = Tone.now();
    const durationSec = duration / 1000;

    // Crossfade approach: Create new synth, fade volumes
    const newSynth = new Tone.PolySynth(Tone.Synth, preset.synth).connect(this.masterGain!);
    newSynth.volume.value = -60; // Start silent

    // Fade out old, fade in new
    this.synth.volume.rampTo(-60, durationSec, now);
    newSynth.volume.rampTo(0, durationSec, now);

    // Morph effects
    this.filter.frequency.rampTo(preset.filterFreq, durationSec, now);
    this.delay.feedback.rampTo(preset.delayFeedback, durationSec, now);

    // Replace synth after transition
    setTimeout(() => {
      this.synth?.dispose();
      this.synth = newSynth;
      this.currentMood = newMood;

      // Start generative pattern for new mood
      this.startGenerativePattern();
    }, duration);
  }

  getMoodPreset(mood: MoodType): any {
    const presets = {
      neutral: {
        synth: {
          oscillator: { type: 'sine' },
          envelope: { attack: 1.0, decay: 0.5, sustain: 0.7, release: 2.0 }
        },
        filterFreq: 1000,
        delayFeedback: 0.2,
        bpm: 80,
        notes: ['A2', 'E3', 'C4']
      },

      energetic: {
        synth: {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 }
        },
        filterFreq: 5000,
        delayFeedback: 0.4,
        bpm: 140,
        notes: ['E3', 'B3', 'F#4', 'C#5']
      },

      romantic: {
        synth: {
          oscillator: { type: 'triangle' },
          envelope: { attack: 1.5, decay: 1.0, sustain: 0.8, release: 3.0 }
        },
        filterFreq: 800,
        delayFeedback: 0.5,
        bpm: 60,
        notes: ['C3', 'E3', 'G3', 'A3'] // Am chord
      },

      happy: {
        synth: {
          oscillator: { type: 'square' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.6, release: 1.0 }
        },
        filterFreq: 3000,
        delayFeedback: 0.3,
        bpm: 120,
        notes: ['C4', 'E4', 'G4', 'B4'] // Cmaj7 chord
      },

      calming: {
        synth: {
          oscillator: { type: 'sine' },
          envelope: { attack: 2.0, decay: 1.5, sustain: 0.9, release: 4.0 }
        },
        filterFreq: 600,
        delayFeedback: 0.6,
        bpm: 60,
        notes: ['F2', 'C3', 'F3', 'A3'] // Fmaj chord
      },

      partying: {
        synth: {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.3 }
        },
        filterFreq: 8000,
        delayFeedback: 0.4,
        bpm: 128,
        notes: ['E2', 'E3', 'B3', 'G4'] // Em chord
      }
    };

    return presets[mood];
  }

  startGenerativePattern(): void {
    // Stop any existing pattern
    if (this.generativeLoop) {
      this.generativeLoop.stop();
      this.generativeLoop.dispose();
    }

    const preset = this.getMoodPreset(this.currentMood);
    Tone.Transport.bpm.value = preset.bpm;

    // Create generative sequence
    this.generativeLoop = new Tone.Pattern((time, note) => {
      this.synth?.triggerAttackRelease(note, '4n', time);
    }, preset.notes, 'randomOnce');

    this.generativeLoop.interval = this.getIntervalForMood(this.currentMood);
    this.generativeLoop.start(0);

    // Start transport if not already
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
  }

  getIntervalForMood(mood: MoodType): string {
    return {
      neutral: '2m',      // Every 2 measures
      energetic: '4n',    // Every quarter note
      romantic: '1m',     // Every measure
      happy: '8n',        // Every 8th note
      calming: '2m',      // Every 2 measures
      partying: '16n'     // Every 16th note
    }[mood];
  }

  private generativeLoop: Tone.Pattern | null = null;

  getFFTData(): Uint8Array {
    return this.fft?.getValue() as Uint8Array || new Uint8Array(0);
  }

  handleClick(frequency: number): void {
    // Trigger harmonic tone on click
    if (!this.synth) return;

    const note = Tone.Frequency(frequency, 'hz').toNote();
    this.synth.triggerAttackRelease(note, '8n', Tone.now());
  }

  dispose(): void {
    this.generativeLoop?.stop();
    this.generativeLoop?.dispose();
    this.synth?.dispose();
    this.reverb?.dispose();
    this.delay?.dispose();
    this.filter?.dispose();
    this.masterGain?.dispose();
    this.fft?.dispose();
    Tone.Transport.stop();
  }
}
```

---

### 3.2 Mood-to-Sound Mapping

**Scientific Basis (from research docs):**
```typescript
interface MoodSoundMapping {
  mood: MoodType;

  // Frequency characteristics
  fundamentalFrequency: number;    // Hz
  harmonicRatio: number;           // 1-5

  // Temporal characteristics
  bpm: number;                     // Beats per minute
  noteDuration: string;            // Tone.js notation

  // Timbral characteristics
  waveform: OscillatorType;        // sine, square, sawtooth, triangle
  brightness: number;              // Filter frequency

  // Envelope (ADSR)
  attack: number;                  // Seconds
  decay: number;
  sustain: number;                 // 0-1
  release: number;

  // Effects
  reverb: {
    enabled: boolean;
    decay: number;                 // Seconds
    wet: number;                   // 0-1
  };
  delay: {
    enabled: boolean;
    time: string;                  // Tone.js notation
    feedback: number;              // 0-1
  };

  // Mood-specific scales/chords
  notes: string[];                 // Tone.js notation
  scale: string;                   // Musical scale
}

const moodSoundMappings: Record<MoodType, MoodSoundMapping> = {
  neutral: {
    mood: 'neutral',
    fundamentalFrequency: 110,     // A2
    harmonicRatio: 1.5,
    bpm: 80,
    noteDuration: '2m',
    waveform: 'sine',
    brightness: 1000,
    attack: 1.0,
    decay: 0.5,
    sustain: 0.7,
    release: 2.0,
    reverb: { enabled: true, decay: 2.0, wet: 0.3 },
    delay: { enabled: true, time: '8n', feedback: 0.2 },
    notes: ['A2', 'E3', 'C4'],
    scale: 'A minor pentatonic'
  },

  energetic: {
    mood: 'energetic',
    fundamentalFrequency: 165,     // E3
    harmonicRatio: 3.0,
    bpm: 140,
    noteDuration: '4n',
    waveform: 'sawtooth',
    brightness: 5000,
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
    reverb: { enabled: true, decay: 1.0, wet: 0.2 },
    delay: { enabled: true, time: '16n', feedback: 0.4 },
    notes: ['E3', 'B3', 'F#4', 'C#5'],
    scale: 'E major'
  },

  romantic: {
    mood: 'romantic',
    fundamentalFrequency: 131,     // C3
    harmonicRatio: 1.2,
    bpm: 60,
    noteDuration: '1m',
    waveform: 'triangle',
    brightness: 800,
    attack: 1.5,
    decay: 1.0,
    sustain: 0.8,
    release: 3.0,
    reverb: { enabled: true, decay: 4.0, wet: 0.5 },
    delay: { enabled: true, time: '4n', feedback: 0.5 },
    notes: ['C3', 'E3', 'G3', 'A3'],
    scale: 'A minor natural'
  },

  happy: {
    mood: 'happy',
    fundamentalFrequency: 262,     // C4
    harmonicRatio: 2.5,
    bpm: 120,
    noteDuration: '8n',
    waveform: 'square',
    brightness: 3000,
    attack: 0.1,
    decay: 0.3,
    sustain: 0.6,
    release: 1.0,
    reverb: { enabled: true, decay: 1.5, wet: 0.3 },
    delay: { enabled: true, time: '8n', feedback: 0.3 },
    notes: ['C4', 'E4', 'G4', 'B4'],
    scale: 'C major 7th'
  },

  calming: {
    mood: 'calming',
    fundamentalFrequency: 87,      // F2
    harmonicRatio: 1.0,
    bpm: 60,
    noteDuration: '2m',
    waveform: 'sine',
    brightness: 600,
    attack: 2.0,
    decay: 1.5,
    sustain: 0.9,
    release: 4.0,
    reverb: { enabled: true, decay: 5.0, wet: 0.6 },
    delay: { enabled: true, time: '2n', feedback: 0.6 },
    notes: ['F2', 'C3', 'F3', 'A3'],
    scale: 'F major pentatonic'
  },

  partying: {
    mood: 'partying',
    fundamentalFrequency: 82,      // E2 (bass heavy)
    harmonicRatio: 4.0,
    bpm: 128,
    noteDuration: '16n',
    waveform: 'sawtooth',
    brightness: 8000,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.4,
    release: 0.3,
    reverb: { enabled: true, decay: 0.5, wet: 0.1 },
    delay: { enabled: true, time: '16n', feedback: 0.4 },
    notes: ['E2', 'E3', 'B3', 'G4'],
    scale: 'E minor blues'
  }
};
```

---

### 3.3 Generative Soundscape Algorithms

**Algorithmic Composition Approach:**
```typescript
class GenerativeSoundscapeComposer {
  private mood: MoodType;
  private pattern: Tone.Pattern | null = null;
  private ambientLayer: Tone.Player | null = null;
  private randomSeed: number;

  constructor(mood: MoodType) {
    this.mood = mood;
    this.randomSeed = Math.random();
  }

  start(): void {
    // Layer 1: Ambient drone
    this.startAmbientLayer();

    // Layer 2: Generative melody
    this.startMelodicLayer();

    // Layer 3: Rhythmic texture (if energetic/partying)
    if (['energetic', 'partying', 'happy'].includes(this.mood)) {
      this.startRhythmicLayer();
    }
  }

  startAmbientLayer(): void {
    const mapping = moodSoundMappings[this.mood];

    // Create sustained pad sound
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: mapping.waveform },
      envelope: {
        attack: mapping.attack * 2,
        decay: mapping.decay * 2,
        sustain: mapping.sustain,
        release: mapping.release * 2
      }
    }).toDestination();

    synth.volume.value = -20; // Quieter than melody

    // Play sustained chord
    const chordNotes = mapping.notes.slice(0, 3);
    synth.triggerAttack(chordNotes, Tone.now());

    // Slowly evolve chord over time
    setInterval(() => {
      synth.triggerRelease(chordNotes, Tone.now());

      // Randomly select new notes from scale
      const newNotes = this.selectRandomNotes(mapping.notes, 3);
      synth.triggerAttack(newNotes, Tone.now() + 2.0);
    }, 30000); // Every 30 seconds
  }

  startMelodicLayer(): void {
    const mapping = moodSoundMappings[this.mood];

    // Weighted random note selection
    const noteWeights = this.generateNoteWeights(mapping.notes);

    this.pattern = new Tone.Pattern((time, note) => {
      const synth = new Tone.Synth({
        oscillator: { type: mapping.waveform },
        envelope: {
          attack: mapping.attack,
          decay: mapping.decay,
          sustain: mapping.sustain,
          release: mapping.release
        }
      }).toDestination();

      synth.triggerAttackRelease(note, mapping.noteDuration, time);
    }, mapping.notes, this.getPatternType(this.mood));

    this.pattern.interval = mapping.noteDuration;
    this.pattern.start(0);
  }

  startRhythmicLayer(): void {
    const mapping = moodSoundMappings[this.mood];

    // Use noise burst for percussion-like texture
    const noise = new Tone.Noise('pink').toDestination();
    noise.volume.value = -30;

    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.01,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }).toDestination();

    noise.connect(envelope);

    // Trigger on beat
    const rhythmLoop = new Tone.Loop((time) => {
      envelope.triggerAttackRelease('16n', time);
    }, this.getRhythmInterval(this.mood));

    rhythmLoop.start(0);
  }

  generateNoteWeights(notes: string[]): number[] {
    // Root note gets highest weight, decreasing outward
    const weights = notes.map((_, i) => {
      return 1.0 / (i + 1);
    });

    return weights;
  }

  selectRandomNotes(notes: string[], count: number): string[] {
    const selected: string[] = [];
    const notesCopy = [...notes];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(this.seededRandom() * notesCopy.length);
      selected.push(notesCopy[randomIndex]);
      notesCopy.splice(randomIndex, 1);
    }

    return selected;
  }

  getPatternType(mood: MoodType): 'up' | 'down' | 'upDown' | 'random' | 'randomOnce' {
    return {
      neutral: 'randomOnce',
      energetic: 'random',
      romantic: 'upDown',
      happy: 'up',
      calming: 'down',
      partying: 'random'
    }[mood] as any;
  }

  getRhythmInterval(mood: MoodType): string {
    return {
      energetic: '8n',
      happy: '4n',
      partying: '16n'
    }[mood] || '4n';
  }

  // Seeded random for reproducibility
  seededRandom(): number {
    this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
    return this.randomSeed / 233280;
  }

  stop(): void {
    this.pattern?.stop();
    this.pattern?.dispose();
    this.ambientLayer?.stop();
    this.ambientLayer?.dispose();
  }
}
```

---

### 3.4 Web Audio API Considerations

**Browser Compatibility & Policy:**
```typescript
class WebAudioManager {
  private audioContext: AudioContext | null = null;
  private userGestureReceived: boolean = false;

  async requestAudioPermission(): Promise<boolean> {
    try {
      // Create audio context (will be suspended until user gesture)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Check if user gesture required
      if (this.audioContext.state === 'suspended') {
        // Show UI prompt for user to click
        return false;
      }

      // Already allowed (unlikely on first load)
      this.userGestureReceived = true;
      return true;
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      return false;
    }
  }

  async activateAudio(): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    // Resume context (must be called from user gesture)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Mobile Safari additional step
    if (this.isSafari() && this.isMobile()) {
      // Play silent buffer to unlock audio
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    }

    this.userGestureReceived = true;
  }

  isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  isAudioReady(): boolean {
    return this.userGestureReceived && this.audioContext?.state === 'running';
  }
}
```

**UI for Audio Activation:**
```typescript
// Component for speaker icon prompt
const AudioActivationButton: React.FC<{ onActivate: () => void }> = ({ onActivate }) => {
  const [isActivated, setIsActivated] = useState(false);

  const handleClick = async () => {
    await onActivate();
    setIsActivated(true);
  };

  if (isActivated) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 left-4 z-50
                 flex items-center gap-2
                 px-4 py-2
                 bg-white/5 hover:bg-white/10
                 border border-white/20
                 rounded-full
                 text-white/60 hover:text-white/90
                 text-sm font-inter
                 transition-all duration-300
                 backdrop-blur-sm"
    >
      <SpeakerWaveIcon className="w-5 h-5" />
      <span>Enable Sound</span>
    </button>
  );
};
```

---

## 4. COMPONENT ARCHITECTURE

### 4.1 React Component Hierarchy

```
app/
└── [locale]/
    └── listening-room/
        └── page.tsx (Main orchestrator)
            │
            ├── <LogoIntro />                    // ACT I
            │   └── Logo animation component
            │
            ├── <AudioActivationButton />        // User gesture
            │   └── Speaker icon + click handler
            │
            ├── <ParticleCanvas />               // Visual system
            │   ├── p5.js sketch wrapper
            │   ├── ParticleSystemManager
            │   └── Mouse interaction handlers
            │
            ├── <AudioSynthesizer />             // Audio system
            │   ├── MoodAudioEngine
            │   ├── GenerativeSoundscapeComposer
            │   └── FFT analyzer
            │
            ├── <ChatInterface />                // Conversation UI
            │   ├── <MessageList />
            │   │   └── <Message /> (user/assistant)
            │   ├── <TextInput />
            │   │   └── Keystroke handlers
            │   └── <TypingIndicator />
            │
            ├── <SyncOrchestrator />             // Coordination layer
            │   ├── Mood detection logic
            │   ├── Visual-audio sync
            │   └── State management
            │
            ├── <HiddenLinks />                  // ACT IV
            │   ├── "For Venues" button
            │   └── "For Artists" button
            │
            └── <ContactOverlay />               // Modal form
                ├── <VenueInquiryForm />
                └── <ArtistApplicationForm />
```

---

### 4.2 State Management Approach

**Global State (React Context):**
```typescript
// contexts/ListeningRoomContext.tsx
interface ListeningRoomState {
  // App state
  appState: AppState;

  // Mood state
  mood: {
    current: MoodType;
    previous: MoodType | null;
    confidence: number;
    isTransitioning: boolean;
  };

  // Audio state
  audio: {
    isEnabled: boolean;
    isInitialized: boolean;
    volume: number;
    fftData: Uint8Array | null;
  };

  // Conversation state
  conversation: {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
  };

  // Session state
  session: {
    startTime: number;
    messageCount: number;
    linksVisible: boolean;
    returningUser: boolean;
  };

  // Visual state
  visual: {
    particleCount: number;
    deviceTier: 'high' | 'medium' | 'low';
    fps: number;
  };
}

interface ListeningRoomActions {
  // App actions
  advanceToState: (newState: AppState) => void;

  // Mood actions
  detectMood: (text: string) => Promise<MoodDetectionResult>;
  transitionToMood: (mood: MoodType) => void;

  // Audio actions
  initializeAudio: () => Promise<void>;
  setVolume: (volume: number) => void;
  updateFFT: (data: Uint8Array) => void;

  // Conversation actions
  sendMessage: (text: string) => Promise<void>;
  addMessage: (message: Message) => void;

  // Session actions
  checkReturningUser: () => boolean;
  showHiddenLinks: () => void;
}

const ListeningRoomContext = createContext<{
  state: ListeningRoomState;
  actions: ListeningRoomActions;
} | null>(null);

export const ListeningRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(listeningRoomReducer, initialState);

  const actions: ListeningRoomActions = {
    advanceToState: (newState) => {
      dispatch({ type: 'ADVANCE_APP_STATE', payload: newState });
    },

    detectMood: async (text) => {
      const result = await fetch('/api/mood/detect', {
        method: 'POST',
        body: JSON.stringify({ text, mode: 'subtle' })
      }).then(res => res.json());

      dispatch({ type: 'MOOD_DETECTED', payload: result });
      return result;
    },

    transitionToMood: (mood) => {
      dispatch({ type: 'MOOD_TRANSITION_START', payload: mood });

      // Trigger audio/visual transitions
      setTimeout(() => {
        dispatch({ type: 'MOOD_TRANSITION_COMPLETE' });
      }, 3500);
    },

    // ... other actions
  };

  return (
    <ListeningRoomContext.Provider value={{ state, actions }}>
      {children}
    </ListeningRoomContext.Provider>
  );
};

export const useListeningRoom = () => {
  const context = useContext(ListeningRoomContext);
  if (!context) throw new Error('useListeningRoom must be used within provider');
  return context;
};
```

**Reducer Pattern:**
```typescript
type Action =
  | { type: 'ADVANCE_APP_STATE'; payload: AppState }
  | { type: 'MOOD_DETECTED'; payload: MoodDetectionResult }
  | { type: 'MOOD_TRANSITION_START'; payload: MoodType }
  | { type: 'MOOD_TRANSITION_COMPLETE' }
  | { type: 'AUDIO_INITIALIZED' }
  | { type: 'MESSAGE_SENT'; payload: Message }
  | { type: 'MESSAGE_RECEIVED'; payload: Message }
  | { type: 'FFT_UPDATE'; payload: Uint8Array };

function listeningRoomReducer(state: ListeningRoomState, action: Action): ListeningRoomState {
  switch (action.type) {
    case 'ADVANCE_APP_STATE':
      return { ...state, appState: action.payload };

    case 'MOOD_DETECTED':
      if (action.payload.confidence < 0.6) {
        // Ignore low-confidence detections
        return state;
      }
      return {
        ...state,
        mood: {
          current: action.payload.mood,
          previous: state.mood.current,
          confidence: action.payload.confidence,
          isTransitioning: false
        }
      };

    case 'MOOD_TRANSITION_START':
      return {
        ...state,
        mood: {
          ...state.mood,
          current: action.payload,
          isTransitioning: true
        }
      };

    case 'MOOD_TRANSITION_COMPLETE':
      return {
        ...state,
        mood: {
          ...state.mood,
          isTransitioning: false
        }
      };

    case 'MESSAGE_SENT':
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, action.payload],
          isLoading: true
        },
        session: {
          ...state.session,
          messageCount: state.session.messageCount + 1
        }
      };

    case 'MESSAGE_RECEIVED':
      return {
        ...state,
        conversation: {
          ...state.conversation,
          messages: [...state.conversation.messages, action.payload],
          isLoading: false
        }
      };

    case 'FFT_UPDATE':
      return {
        ...state,
        audio: {
          ...state.audio,
          fftData: action.payload
        }
      };

    default:
      return state;
  }
}
```

---

### 4.3 Data Flow Between Systems

**Visual → Audio Sync:**
```typescript
// In ParticleCanvas component
const ParticleCanvas: React.FC = () => {
  const { state, actions } = useListeningRoom();
  const p5InstanceRef = useRef<p5 | null>(null);
  const particleSystemRef = useRef<ParticleSystemManager | null>(null);

  useEffect(() => {
    // Listen for mood changes
    if (state.mood.isTransitioning) {
      particleSystemRef.current?.morphToMood(state.mood.current, 4000);
    }
  }, [state.mood.current, state.mood.isTransitioning]);

  useEffect(() => {
    // Sync particles to audio FFT
    if (state.audio.fftData) {
      const spectrum = state.audio.fftData;

      // Map frequency bins to particle properties
      particleSystemRef.current?.particles.forEach((particle, i) => {
        const bin = i % spectrum.length;
        const amplitude = spectrum[bin] / 255; // Normalize 0-1

        // Size based on amplitude
        particle.size = 2 + amplitude * 6;

        // Brightness based on amplitude
        particle.opacity = 0.3 + amplitude * 0.7;
      });
    }
  }, [state.audio.fftData]);

  return <div ref={canvasContainerRef} />;
};
```

**Audio → Visual Sync:**
```typescript
// In AudioSynthesizer component
const AudioSynthesizer: React.FC = () => {
  const { state, actions } = useListeningRoom();
  const audioEngineRef = useRef<MoodAudioEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Start FFT update loop
    const updateFFT = () => {
      if (audioEngineRef.current?.isInitialized) {
        const fftData = audioEngineRef.current.getFFTData();
        actions.updateFFT(fftData);
      }

      animationFrameRef.current = requestAnimationFrame(updateFFT);
    };

    updateFFT();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Transition audio on mood change
    if (state.mood.isTransitioning) {
      audioEngineRef.current?.transitionToMood(state.mood.current, 3500);
    }
  }, [state.mood.current, state.mood.isTransitioning]);

  return null; // No visual component
};
```

**Conversation → Mood Detection:**
```typescript
// In ChatInterface component
const ChatInterface: React.FC = () => {
  const { state, actions } = useListeningRoom();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    // 1. Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };
    actions.addMessage(userMessage);

    // 2. Detect mood (parallel to API call)
    const moodDetection = actions.detectMood(inputValue);

    // 3. Get AI response
    const aiResponse = await actions.sendMessage(inputValue);

    // 4. Wait for mood detection
    const moodResult = await moodDetection;

    // 5. Trigger transition if mood detected
    if (moodResult.confidence >= 0.6) {
      actions.transitionToMood(moodResult.mood);
    }

    setInputValue('');
  };

  return (
    <div className="chat-interface">
      <MessageList messages={state.conversation.messages} />
      <TextInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        isLoading={state.conversation.isLoading}
      />
    </div>
  );
};
```

---

## 5. PHASE-BY-PHASE BUILD PLAN

### Phase 1: Cinematic Logo Entry (8-12 hours)

**Goal:** Create ACT I arrival experience with logo animation and audio activation.

**Tasks:**
1. **Logo Animation Component** (3 hours)
   - Create `components/ListeningRoom/LogoIntro.tsx`
   - Implement fade-in animation (0 → 100% opacity, 2-3s)
   - Add cyan glow effect using CSS `box-shadow`
   - Implement breathing/pulse animation (subtle scale 1.0 → 1.05)
   - Add shrink & move to corner transition (transform: scale + translate)
   - Trigger `onComplete` callback when animation finishes

2. **Audio Activation UI** (2 hours)
   - Create `components/ListeningRoom/AudioActivationButton.tsx`
   - Design speaker icon (Heroicons SpeakerWaveIcon)
   - Position bottom-left with proper z-index
   - Handle click to resume AudioContext
   - Hide button after activation

3. **Background & Particles Start** (3 hours)
   - Set up deep black background (#030129)
   - Initialize basic p5.js canvas (100 particles for ACT I)
   - Use brand color palette only
   - Implement very slow drift motion (speed: 0.3)
   - No user interaction yet

4. **First Cryptic Prompt** (2 hours)
   - Create text display component
   - Implement fade-in effect (opacity + translate-y)
   - Use Playfair Display font
   - Add subtle glow effect
   - Load random prompt from library

5. **State Management** (2 hours)
   - Set up global context
   - Create `appState: 'arrival_intro'`
   - Track returning users (localStorage)
   - Skip intro if returning

**Deliverables:**
- Fully functional ACT I experience
- Smooth transitions between animation states
- Audio activation working on all browsers
- Brand particles floating
- First prompt displayed

**Testing Checklist:**
- [ ] Logo fades in smoothly over 2-3 seconds
- [ ] Cyan glow visible and aesthetic
- [ ] Breathing animation subtle (not jarring)
- [ ] Logo shrinks and moves to corner correctly
- [ ] Watermark opacity is 10%
- [ ] Speaker icon appears in bottom-left
- [ ] Audio activates on click (check console for AudioContext state)
- [ ] 100 brand particles visible and drifting
- [ ] First cryptic prompt fades in
- [ ] Text is readable with glow effect
- [ ] Returning users skip intro

---

### Phase 2: Particle Canvas System (16-20 hours)

**Goal:** Build complete p5.js particle system with TeamLab-inspired organic movement.

**Tasks:**
1. **Core Particle Class** (4 hours)
   - Implement `Particle` class with full physics
   - Perlin noise for organic drift
   - Velocity, acceleration, friction
   - Mass-based force application
   - Screen wrapping (edges loop around)

2. **ParticleSystemManager** (5 hours)
   - Device tier detection
   - Adaptive particle count (10k - 500k)
   - Color palette management
   - Mood-based color morphing
   - Lerp color transitions (60fps for 4 seconds)

3. **Mouse Interactions** (4 hours)
   - Attraction to cursor (150px radius, 0.05 strength)
   - Wake trail effect
   - Click ripple effect
   - Click scatter particles (200px radius)
   - Regroup after scatter (2s duration)

4. **Performance Optimization** (3 hours)
   - Implement PerformanceMonitor class
   - FPS tracking (last 60 frames)
   - Adaptive quality reduction
   - Offscreen canvas rendering
   - Batch particle updates

5. **Mood Behaviors** (4 hours)
   - Implement `applyMoodBehavior()` for each mood
   - Energetic: Random force bursts
   - Romantic: Paired particle movement
   - Happy: Bouncy sine wave
   - Calming: Gentle wave motion
   - Partying: Radial pulsing

**Deliverables:**
- 500k particles running at 60 FPS on high-end desktop
- Smooth color transitions between moods
- Responsive mouse interactions
- Organic TeamLab-style movement
- Adaptive performance based on device

**Testing Checklist:**
- [ ] Particle count correct for device tier
- [ ] 60 FPS on desktop, 30+ FPS on mobile
- [ ] Colors morph smoothly (no jarring jumps)
- [ ] Mouse attraction works within 150px
- [ ] Particles follow cursor naturally
- [ ] Click creates visible ripple effect
- [ ] Particles scatter on click and regroup
- [ ] Each mood has distinct visual behavior
- [ ] Performance monitor reduces quality if FPS drops
- [ ] No memory leaks (check DevTools)

---

### Phase 3: Audio Engine (14-18 hours)

**Goal:** Implement complete Tone.js-based generative audio system.

**Tasks:**
1. **MoodAudioEngine Foundation** (5 hours)
   - Create audio signal chain (Synth → Filter → Delay → Reverb → Master)
   - Implement `initialize()` with Web Audio policy handling
   - Set up FFT analyzer (2048 bins)
   - Create base ambient drone (A2, 110 Hz)
   - Test cross-browser compatibility

2. **Mood Presets** (4 hours)
   - Define 6 mood presets (neutral + 5 moods)
   - Configure oscillator types, envelopes, BPM
   - Set filter frequencies, delay feedback
   - Define note scales for each mood
   - Test sound of each preset

3. **Generative Composition** (5 hours)
   - Implement `GenerativeSoundscapeComposer`
   - Layer 1: Ambient drone (sustained chords)
   - Layer 2: Melodic pattern (Tone.Pattern)
   - Layer 3: Rhythmic texture (for energetic moods)
   - Weighted random note selection
   - Seeded randomness for reproducibility

4. **Mood Transitions** (4 hours)
   - Implement crossfade between synths (3.5s)
   - Ramp filter frequency and delay feedback
   - Dispose old synth after transition
   - Start new generative pattern
   - Sync timing with visual transitions

**Deliverables:**
- 6 distinct mood soundscapes
- Smooth 3.5-second transitions
- Generative patterns never repeat exactly
- FFT data available for visual sync
- Works on desktop and mobile

**Testing Checklist:**
- [ ] Audio initializes after user gesture
- [ ] Ambient drone starts automatically
- [ ] Each mood has unique sound character
- [ ] Transitions are smooth (no clicks/pops)
- [ ] Generative patterns evolve over time
- [ ] FFT data updates at 60 FPS
- [ ] Volume levels balanced across moods
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile Safari audio unlocks correctly
- [ ] No audio glitches or distortion

---

### Phase 4: Mood Detection & AI Integration (12-16 hours)

**Goal:** Connect conversation to mood detection and Gemini AI responses.

**Tasks:**
1. **Mood Detection API** (4 hours)
   - Create `/api/mood/detect` route
   - Implement keyword matching algorithm
   - Define keyword dictionaries for 5 moods
   - Calculate confidence scores
   - Support subtle/sensitive modes

2. **Gemini Conversation API** (4 hours)
   - Create `/api/conversation/send` route
   - Set up Gemini SDK
   - Write system prompts (mystical, cryptic)
   - Configure temperature (0.9), maxTokens (150)
   - Implement error handling

3. **Conversation UI** (5 hours)
   - Create `ChatInterface` component
   - Message list with scroll
   - Text input with character limit (500)
   - Typewriter effect for AI responses (80ms/char)
   - Keystroke particle reactions

4. **Integration & Sync** (3 hours)
   - Connect mood detection to transitions
   - Parallel API calls (mood + AI response)
   - Trigger visual/audio changes on mood detection
   - Update global state
   - Session persistence (localStorage)

**Deliverables:**
- Working mood detection with 85%+ accuracy
- Cryptic AI responses (no therapy language)
- Smooth conversation flow
- Mood transitions triggered automatically
- Messages persist across page refreshes

**Testing Checklist:**
- [ ] Mood detection identifies correct mood from text
- [ ] Confidence scores accurate (3 keywords = 1.0)
- [ ] Sensitive mode activates after 3 messages with no detection
- [ ] AI responses are cryptic and poetic
- [ ] No "how are you feeling" or therapeutic language
- [ ] Typewriter effect smooth at 80ms/char
- [ ] Particles react to keystrokes
- [ ] Mood transitions trigger automatically (60%+ confidence)
- [ ] Visual and audio sync timing (both 3.5s)
- [ ] Conversation history saves to localStorage

---

### Phase 5: Hidden Contact Overlay (6-8 hours)

**Goal:** Implement ACT IV revelation with subtle business connection.

**Tasks:**
1. **Hidden Links Component** (2 hours)
   - Create `HiddenLinks` component
   - Position top-right corner
   - 20% opacity default, 100% on hover
   - Fade in after 3 minutes on site
   - Track time using session duration

2. **Contact Overlay Modal** (3 hours)
   - Create `ContactOverlay` component
   - Minimal form design (name, email, message)
   - Maintain mystical aesthetic
   - Doesn't break immersion
   - Close returns to experience

3. **Form Submission** (2 hours)
   - Create `/api/contact/submit` route
   - Send email notification (free service)
   - Store submission (optional, Vercel Postgres free tier)
   - Thank you message
   - Return to experience

4. **Revelation Prompts** (1 hour)
   - Add business-hinting prompts to AI
   - Trigger after 5+ minutes
   - Only if conversation naturally flows to atmosphere/venues
   - Never direct sales language

**Deliverables:**
- Hidden links appear after 3 minutes
- Contact forms functional
- Submissions trigger email notifications
- Revelation prompts subtle and poetic
- User can return to experience after submission

**Testing Checklist:**
- [ ] Links invisible until 3-minute mark
- [ ] Links fade in smoothly
- [ ] Hover changes opacity to 100%
- [ ] Clicking opens overlay
- [ ] Overlay maintains aesthetic
- [ ] Form fields minimal and clear
- [ ] Submission sends email
- [ ] Thank you message displays
- [ ] Close button returns to experience
- [ ] Revelation prompts only appear if natural
- [ ] No direct sales language in prompts

---

### Estimated Hours Summary

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Cinematic Logo Entry | 8-12 |
| 2 | Particle Canvas System | 16-20 |
| 3 | Audio Engine | 14-18 |
| 4 | Mood Detection & AI | 12-16 |
| 5 | Hidden Contact Overlay | 6-8 |
| **TOTAL** | | **56-74 hours** |

**Additional Time Needed:**
- Testing & QA: 10-15 hours
- Bug fixes: 5-10 hours
- Polish & refinements: 5-10 hours
- Documentation: 3-5 hours

**Grand Total: 80-120 hours (2-3 weeks full-time)**

---

## 6. TECHNICAL RISKS & MITIGATIONS

### 6.1 Browser Compatibility

**Risk:** Safari, Firefox, and mobile browsers handle Web Audio/Canvas differently.

**Specific Issues:**
1. **Safari Web Audio Policy:** Requires multiple user gestures to unlock audio
2. **Firefox Canvas Performance:** Slower than Chrome for particle rendering
3. **Mobile Safari Touch Events:** Different event handling than desktop
4. **iOS Low Power Mode:** Throttles animations and audio

**Mitigations:**
```typescript
// 1. Multi-browser audio unlock
class BrowserAudioUnlock {
  async unlockAudio(context: AudioContext): Promise<void> {
    if (this.isSafari()) {
      // Safari needs silent buffer playback
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);

      // Additional resume call
      await context.resume();

      // Mobile Safari may need second gesture
      if (this.isMobile()) {
        await new Promise(resolve => setTimeout(resolve, 100));
        await context.resume();
      }
    } else {
      await context.resume();
    }
  }

  isSafari(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}

// 2. Canvas performance detection
class CanvasPerformanceDetector {
  detectBestRenderer(): 'webgl' | 'p2d' {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl && this.isHighPerformanceGPU(gl)) {
      return 'webgl'; // Use WebGL for particle rendering
    }

    return 'p2d'; // Fallback to 2D canvas
  }

  isHighPerformanceGPU(gl: any): boolean {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check for integrated vs discrete GPU
      return !/intel|integrated/i.test(renderer);
    }
    return false;
  }
}

// 3. Touch event normalization
function normalizePointerEvent(event: MouseEvent | TouchEvent): { x: number, y: number } {
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: event.clientX, y: event.clientY };
}
```

**Testing Strategy:**
- Test on Chrome, Firefox, Safari (macOS and iOS)
- Test on Android Chrome
- Use BrowserStack for older browser versions
- Implement feature detection, not browser detection

---

### 6.2 Performance on Mobile

**Risk:** 500k particles will destroy mobile devices. Audio + visuals may drain battery quickly.

**Specific Issues:**
1. **CPU Overload:** Mobile CPUs 10x weaker than desktop
2. **GPU Limitations:** Integrated GPUs can't handle complex shaders
3. **Memory Constraints:** Mobile has 1-4GB RAM total (shared with OS)
4. **Battery Drain:** Constant animation + audio = 20%+ battery per 5min
5. **Thermal Throttling:** Phone heats up, CPU/GPU throttle down

**Mitigations:**
```typescript
// 1. Device-tier specific configurations
const mobileOptimizations = {
  low: {
    particleCount: 5000,           // 100x fewer than desktop
    particleSize: [4, 6],          // Larger (easier to see, fewer needed)
    updateRate: 30,                // 30 FPS instead of 60
    canvasResolution: 0.5,         // Half resolution
    disableEffects: ['blur', 'glow', 'trail'],
    audioFFT: 256,                 // Minimal FFT
    disableFlocking: true          // Too CPU intensive
  },

  medium: {
    particleCount: 20000,
    particleSize: [3, 5],
    updateRate: 45,
    canvasResolution: 0.75,
    disableEffects: ['blur'],
    audioFFT: 512,
    disableFlocking: false
  }
};

// 2. Battery-aware rendering
class BatteryAwareRenderer {
  private batteryLevel: number = 1.0;
  private isCharging: boolean = true;

  async monitorBattery(): Promise<void> {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();

      this.batteryLevel = battery.level;
      this.isCharging = battery.charging;

      battery.addEventListener('levelchange', () => {
        this.batteryLevel = battery.level;
        this.adjustQualityForBattery();
      });
    }
  }

  adjustQualityForBattery(): void {
    if (!this.isCharging && this.batteryLevel < 0.2) {
      // Critical battery: minimal rendering
      this.setQualityLevel('minimal');
    } else if (!this.isCharging && this.batteryLevel < 0.5) {
      // Low battery: reduce quality
      this.setQualityLevel('low');
    }
  }

  setQualityLevel(level: 'minimal' | 'low' | 'medium' | 'high'): void {
    // Update particle count, FPS target, etc.
  }
}

// 3. Thermal throttling detection
class ThermalThrottlingDetector {
  private frameTimings: number[] = [];

  detectThrottling(): boolean {
    // If average frame time suddenly increases 2x, likely throttling
    if (this.frameTimings.length < 100) return false;

    const recent = this.frameTimings.slice(-20);
    const older = this.frameTimings.slice(-100, -20);

    const avgRecent = recent.reduce((a, b) => a + b) / recent.length;
    const avgOlder = older.reduce((a, b) => a + b) / older.length;

    return avgRecent > avgOlder * 2;
  }

  handleThrottling(): void {
    // Reduce particle count by 50%
    // Lower FPS target to 20
    // Disable audio temporarily
  }
}
```

**Testing Strategy:**
- Test on actual devices (iPhone 12, Samsung Galaxy S21)
- Monitor with Chrome DevTools Remote Debugging
- Check battery drain using built-in battery stats
- Test in hot environments (throttling simulation)

---

### 6.3 Web Audio Policy Restrictions

**Risk:** Browsers block audio until user gesture. Users may not click speaker icon.

**Specific Issues:**
1. **No Autoplay:** AudioContext starts suspended
2. **Safari Multiple Gestures:** May need 2-3 clicks to unlock
3. **User Ignores Prompt:** Experience continues without audio
4. **Context Suspended Mid-Session:** Mobile Safari can suspend when tab backgrounded

**Mitigations:**
```typescript
// 1. Persistent audio activation prompt
const PersistentAudioPrompt: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showAgain, setShowAgain] = useState(false);

  useEffect(() => {
    // After 30 seconds, if audio still not enabled, show again
    const timer = setTimeout(() => {
      if (!audioEnabled) {
        setDismissed(false);
        setShowAgain(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [audioEnabled]);

  if (dismissed && !showAgain) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50
                     ${showAgain ? 'animate-bounce' : ''}`}>
      <button onClick={handleActivate}>
        <SpeakerWaveIcon />
        {showAgain && <span>Experience better with sound!</span>}
      </button>
    </div>
  );
};

// 2. Fallback visual-only experience
const VisualOnlyMode: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2
                    text-white/40 text-xs">
      Visual mode only • Enable sound for full experience
    </div>
  );
};

// 3. Auto-resume on visibility change
document.addEventListener('visibilitychange', async () => {
  if (!document.hidden && audioContext?.state === 'suspended') {
    try {
      await audioContext.resume();
      console.log('Audio resumed after tab visibility');
    } catch (error) {
      console.error('Failed to resume audio:', error);
    }
  }
});
```

**Testing Strategy:**
- Test with audio initially disabled
- Test tab backgrounding/foregrounding
- Test on iOS Safari (strictest policy)
- Ensure experience still compelling without audio

---

### 6.4 API Rate Limits

**Risk:** Gemini free tier limited to 1,500 requests/day, 15/minute.

**Specific Issues:**
1. **Daily Limit:** ~63 requests/hour avg, ~1 request per minute
2. **Burst Traffic:** 10 users sending messages simultaneously = rate limit
3. **Wasted Requests:** Spam, bots, testing
4. **No Budget:** Can't pay for more requests

**Mitigations:**
```typescript
// 1. Client-side rate limiting
class ClientRateLimiter {
  private lastRequestTime: number = 0;
  private requestQueue: Array<() => void> = [];

  async throttledRequest<T>(
    requestFn: () => Promise<T>,
    minInterval: number = 4000 // 4 seconds between requests
  ): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;

      // Show user feedback
      showMessage(`Please wait ${Math.ceil(waitTime / 1000)} seconds...`);

      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    return await requestFn();
  }
}

// 2. Server-side rate limiting (Vercel Edge)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(15, '1 m'), // 15 requests per minute
  analytics: true
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  const { success, limit, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return Response.json({
      response: 'The voices are silent... try asking again in a moment.',
      error: 'rate_limit',
      retryAfter: 60
    }, { status: 429 });
  }

  // Process request...
}

// 3. Graceful degradation on limit exceeded
async function sendMessageWithFallback(text: string): Promise<string> {
  try {
    const response = await fetch('/api/conversation/send', {
      method: 'POST',
      body: JSON.stringify({ message: text })
    });

    if (response.status === 429) {
      // Rate limited: Use fallback cryptic prompts
      return getFallbackMysticalPrompt(text);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    // Network error: Use offline prompts
    return getOfflineMysticalPrompt();
  }
}

// 4. Daily usage monitoring
class UsageMonitor {
  private requestCount: number = 0;
  private resetTime: number = Date.now() + 86400000; // 24 hours

  trackRequest(): void {
    this.requestCount++;

    if (Date.now() > this.resetTime) {
      this.requestCount = 0;
      this.resetTime = Date.now() + 86400000;
    }

    // Alert if approaching limit
    if (this.requestCount > 1400) {
      console.warn(`Approaching daily limit: ${this.requestCount}/1500`);
    }
  }
}
```

**Testing Strategy:**
- Simulate high traffic with load testing tool
- Test rate limit response (should be graceful)
- Verify fallback prompts are cryptic and on-brand
- Monitor usage in Vercel dashboard

---

### 6.5 Summary: Risk Matrix

| Risk | Likelihood | Impact | Mitigation Priority | Status |
|------|-----------|--------|-------------------|--------|
| Browser Compatibility | High | Medium | High | Mitigated |
| Mobile Performance | High | High | **Critical** | Mitigated |
| Web Audio Policy | Medium | Medium | High | Mitigated |
| API Rate Limits | Medium | Low | Medium | Mitigated |
| Memory Leaks (p5.js) | Low | High | Medium | Monitor |
| Gemini API Downtime | Low | High | Low | Accept risk |
| User Confusion | Medium | Medium | Medium | User testing |

---

## FINAL CHECKLIST

### Pre-Launch Requirements

**Functionality:**
- [ ] All 4 acts functional (Arrival, Dialogue, Immersion, Revelation)
- [ ] Logo intro animation complete
- [ ] Audio activation working on all browsers
- [ ] Particle system rendering at target FPS
- [ ] Mouse interactions responsive
- [ ] Mood detection accurate (85%+ on test cases)
- [ ] AI responses cryptic and on-brand
- [ ] Visual/audio transitions synchronized
- [ ] Hidden links appear after 3 minutes
- [ ] Contact forms functional

**Performance:**
- [ ] Desktop: 60 FPS with 500k particles
- [ ] Mobile: 30+ FPS with 10k particles
- [ ] Audio latency < 100ms
- [ ] API response < 3 seconds
- [ ] Memory usage stable (no leaks)
- [ ] Battery drain acceptable (< 5% per 5 min)

**Cross-Browser:**
- [ ] Chrome (macOS, Windows, Android)
- [ ] Firefox (macOS, Windows)
- [ ] Safari (macOS, iOS)
- [ ] Edge (Windows)

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen readers can read conversation
- [ ] Reduced motion option available
- [ ] High contrast mode option
- [ ] Audio works without visual component

**Business:**
- [ ] Hidden links discoverable
- [ ] Contact forms send emails
- [ ] Brand watermark always visible
- [ ] Mystical tone maintained throughout
- [ ] No therapy/wellness language

---

## NEXT STEPS

1. **Begin Phase 1:** Start with logo intro (8-12 hours)
2. **Daily Testing:** Test each component as built
3. **Weekly Review:** Assess progress, adjust timeline
4. **User Testing:** Get feedback on mystical tone after Phase 4
5. **Launch Prep:** Final polish, performance optimization, deployment

**Estimated Completion:** 2-3 weeks full-time development

---

**Document Version:** 1.0
**Created:** December 25, 2024
**Status:** Ready for Implementation
**Total Pages:** 45+
**Total Words:** ~18,000
