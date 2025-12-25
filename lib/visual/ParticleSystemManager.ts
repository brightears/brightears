/**
 * ParticleSystemManager - Orchestrates particle system with mood-based behavior
 *
 * Features:
 * - Device-adaptive particle count (100k high, 50k medium, 10k low)
 * - Mood palette switching (6 moods: neutral + 5 emotions)
 * - FPS monitoring with adaptive quality
 * - Mouse interaction handling
 * - TeamLab Borderless-inspired organic transitions
 */

import type p5 from 'p5';
import { Particle, type MoodType } from './Particle';

export type DeviceTier = 'high' | 'medium' | 'low';

export interface ParticleSystemConfig {
  deviceTier: DeviceTier;
  enableBlur?: boolean;
}

export class ParticleSystemManager {
  particles: Particle[] = [];
  p5: p5;
  targetCount: number;
  currentMood: MoodType = 'neutral';
  deviceTier: DeviceTier;
  enableBlur: boolean;

  // Performance monitoring
  frameTimestamps: number[] = [];
  currentFPS: number = 60;
  targetFPS: number = 60;

  constructor(p5Instance: p5, config: ParticleSystemConfig) {
    this.p5 = p5Instance;
    this.deviceTier = config.deviceTier;
    this.enableBlur = config.enableBlur || false;

    // Device-adaptive particle count
    this.targetCount = this.getParticleCount(config.deviceTier);
    this.targetFPS = config.deviceTier === 'low' ? 30 : 60;

    // Initialize particles with neutral mood
    this.initializeParticles();
  }

  /**
   * Get particle count based on device tier
   */
  private getParticleCount(tier: DeviceTier): number {
    const counts = {
      high: 100000,  // High-end desktop
      medium: 50000, // Mid-range desktop or flagship mobile
      low: 10000     // Low-end or mobile
    };
    return counts[tier];
  }

  /**
   * Initialize particles with current mood palette
   */
  initializeParticles(): void {
    const colors = this.getCurrentColorPalette();

    for (let i = 0; i < this.targetCount; i++) {
      const x = this.p5.random(this.p5.width);
      const y = this.p5.random(this.p5.height);
      const color = this.p5.random(colors);
      const size = this.p5.random(2, 4);
      const opacity = this.p5.random(0.3, 0.8);

      const particle = new Particle(this.p5, { x, y, color, size, opacity });

      // Enable blur only on high-end devices
      if (this.enableBlur && this.deviceTier === 'high') {
        particle.blur = this.p5.random(5, 15);
      }

      this.particles.push(particle);
    }
  }

  /**
   * Get color palette for current mood
   */
  getCurrentColorPalette(): p5.Color[] {
    const palettes: Record<MoodType, string[]> = {
      // Neutral: Brand colors (cyan, teal, brown, lavender)
      neutral: ['#00bbe4', '#008B9C', '#6B4423', '#9B7EBD'],

      // Energetic: Red, orange, yellow (high energy)
      energetic: ['#FF0000', '#FF6600', '#FFD700', '#FFA500'],

      // Romantic: Deep red, amber, purple (intimate)
      romantic: ['#8B0000', '#FFBF00', '#FF6F91', '#9B59B6'],

      // Happy: Yellow, orange, coral (celebratory)
      happy: ['#FFFF00', '#FFA500', '#FF7F50', '#FFD700'],

      // Calming: Cyan, blue, lavender (relaxation) - BRAND PRIMARY
      calming: ['#00bbe4', '#4A90E2', '#87CEEB', '#E6E6FA'],

      // Partying: Magenta, neon, red (high intensity)
      partying: ['#C417C4', '#FF00FF', '#00FFFF', '#FF0000']
    };

    return palettes[this.currentMood].map(hex => this.p5.color(hex));
  }

  /**
   * Smoothly transition to new mood over duration
   */
  morphToMood(newMood: MoodType, duration: number = 4000): void {
    if (newMood === this.currentMood) return;

    const oldColors = this.getCurrentColorPalette();
    this.currentMood = newMood;
    const newColors = this.getCurrentColorPalette();

    const steps = Math.floor(duration / 16.67); // 60fps
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
    }, 16.67);
  }

  /**
   * Get speed multiplier for mood
   */
  private getMoodSpeedMultiplier(mood: MoodType): number {
    const multipliers: Record<MoodType, number> = {
      neutral: 1.0,
      energetic: 2.0,
      romantic: 0.5,
      happy: 1.2,
      calming: 0.3,
      partying: 2.5
    };
    return multipliers[mood];
  }

  /**
   * Get behavior pattern for mood
   */
  private getMoodBehavior(mood: MoodType): string {
    const behaviors: Record<MoodType, string> = {
      neutral: 'drift',
      energetic: 'chaotic',
      romantic: 'paired_flow',
      happy: 'bouncy',
      calming: 'wave',
      partying: 'pulse'
    };
    return behaviors[mood];
  }

  /**
   * Update all particles
   */
  update(mouseX: number, mouseY: number, deltaTime: number = 1): void {
    this.particles.forEach(particle => {
      // Mouse attraction (only when mouse is moving)
      if (mouseX > 0 && mouseY > 0) {
        particle.attractToPoint(mouseX, mouseY, 0.05);
      }

      // Apply mood-specific behaviors
      this.applyMoodBehavior(particle);

      // Update particle physics
      particle.update(this.p5, deltaTime);
    });

    // Monitor performance
    this.recordFrame();
  }

  /**
   * Apply mood-specific behavior to particle
   */
  private applyMoodBehavior(particle: Particle): void {
    switch (particle.moodBehavior) {
      case 'chaotic':
        // Random force bursts for energetic mood
        if (this.p5.random(1) < 0.01) {
          particle.applyForce(this.p5.random(-5, 5), this.p5.random(-5, 5));
        }
        break;

      case 'bouncy':
        // Sine wave vertical motion for happy mood
        particle.ay += Math.sin(this.p5.frameCount * 0.05) * 0.1;
        break;

      case 'wave':
        // Gentle wave motion for calming mood
        particle.ax += Math.sin(particle.y * 0.01 + this.p5.frameCount * 0.02) * 0.05;
        break;

      case 'pulse':
        // Radial pulsing from center for partying mood
        const dx = this.p5.width / 2 - particle.x;
        const dy = this.p5.height / 2 - particle.y;
        const pulseStrength = Math.sin(this.p5.frameCount * 0.1) * 0.02;
        particle.applyForce(dx * pulseStrength, dy * pulseStrength);
        break;

      case 'paired_flow':
        // Romantic mood: slower, paired movement (future enhancement)
        break;

      case 'drift':
      default:
        // Neutral: just Perlin noise, already handled in Particle.update()
        break;
    }
  }

  /**
   * Display all particles
   */
  display(): void {
    // Note: Background is cleared in P5Canvas component
    this.particles.forEach(particle => particle.display(this.p5));
  }

  /**
   * Handle mouse click - scatter particles
   */
  handleClick(x: number, y: number): void {
    this.particles.forEach(particle => {
      particle.repelFromPoint(x, y, 10.0);
    });
  }

  /**
   * Record frame for FPS monitoring
   */
  private recordFrame(): void {
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

  /**
   * Check if quality should be reduced
   */
  shouldReduceQuality(): boolean {
    return this.currentFPS < this.targetFPS * 0.8; // 20% below target
  }

  /**
   * Reduce particle count to improve performance
   */
  reduceQuality(): void {
    const reductionFactor = 0.8;
    const targetCount = Math.floor(this.particles.length * reductionFactor);
    this.particles = this.particles.slice(0, targetCount);
    console.log(`Reduced particle count to ${targetCount} (${this.currentFPS.toFixed(1)} FPS)`);
  }

  /**
   * Get current FPS for monitoring
   */
  getFPS(): number {
    return this.currentFPS;
  }
}
