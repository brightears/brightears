/**
 * Particle Class - Individual particle with physics and mood-based behavior
 *
 * Features:
 * - Position, velocity, acceleration physics
 * - Perlin noise for organic "firefly" drift
 * - Mass-based physics for natural movement
 * - Color, size, opacity properties
 * - Mood-based behavior modifiers
 * - TeamLab Borderless-inspired organic movement
 */

import type p5 from 'p5';

export interface ParticleConfig {
  x: number;
  y: number;
  color: p5.Color;
  size?: number;
  opacity?: number;
  mass?: number;
}

export type MoodType = 'neutral' | 'energetic' | 'romantic' | 'happy' | 'calming' | 'partying';

export class Particle {
  // Position
  x: number;
  y: number;

  // Velocity
  vx: number;
  vy: number;

  // Acceleration
  ax: number;
  ay: number;

  // Physics properties
  mass: number;
  friction: number;
  maxSpeed: number;

  // Visual properties
  color: p5.Color;
  size: number;
  opacity: number;
  blur: number;

  // Noise offsets for organic movement
  noiseOffsetX: number;
  noiseOffsetY: number;
  noiseScale: number;

  // Mood-based behavior
  moodSpeed: number;
  moodBehavior: string;

  constructor(p5Instance: p5, config: ParticleConfig) {
    this.x = config.x;
    this.y = config.y;
    this.color = config.color;
    this.size = config.size || p5Instance.random(2, 4);
    this.opacity = config.opacity || p5Instance.random(0.3, 0.8);
    this.mass = config.mass || p5Instance.random(0.8, 1.2);

    // Initialize velocity with small random values
    this.vx = p5Instance.random(-0.5, 0.5);
    this.vy = p5Instance.random(-0.5, 0.5);

    // No initial acceleration
    this.ax = 0;
    this.ay = 0;

    // Physics constants
    this.friction = 0.98;
    this.maxSpeed = 2.0;

    // Perlin noise parameters for organic movement
    this.noiseOffsetX = p5Instance.random(1000);
    this.noiseOffsetY = p5Instance.random(1000);
    this.noiseScale = 0.01;

    // Subtle blur for glow effect (only on high-end devices)
    this.blur = 0;

    // Mood modifiers
    this.moodSpeed = 1.0;
    this.moodBehavior = 'drift';
  }

  /**
   * Update particle position and physics
   */
  update(p5: p5, deltaTime: number = 1): void {
    // Apply Perlin noise for organic, firefly-like movement
    const noiseForceX = (p5.noise(this.noiseOffsetX) - 0.5) * 0.1;
    const noiseForceY = (p5.noise(this.noiseOffsetY) - 0.5) * 0.1;

    this.applyForce(noiseForceX, noiseForceY);

    // Increment noise offsets for continuous variation
    this.noiseOffsetX += 0.01 * this.moodSpeed;
    this.noiseOffsetY += 0.01 * this.moodSpeed;

    // Apply acceleration to velocity
    this.vx += this.ax;
    this.vy += this.ay;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Cap speed based on mood
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    if (speed > this.maxSpeed * this.moodSpeed) {
      const cappedSpeed = this.maxSpeed * this.moodSpeed;
      this.vx = (this.vx / speed) * cappedSpeed;
      this.vy = (this.vy / speed) * cappedSpeed;
    }

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Reset acceleration for next frame
    this.ax = 0;
    this.ay = 0;

    // Wrap around screen edges (borderless)
    if (this.x < 0) this.x = p5.width;
    if (this.x > p5.width) this.x = 0;
    if (this.y < 0) this.y = p5.height;
    if (this.y > p5.height) this.y = 0;
  }

  /**
   * Render particle to canvas
   */
  display(p5: p5): void {
    p5.noStroke();

    // Extract RGB values and apply opacity
    const r = p5.red(this.color);
    const g = p5.green(this.color);
    const b = p5.blue(this.color);
    p5.fill(r, g, b, this.opacity * 255);

    // Optional blur/glow effect (expensive, only for high-end)
    if (this.blur > 0) {
      const ctx = (p5 as any).drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur = this.blur;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
    }

    // Draw particle as circle
    p5.ellipse(this.x, this.y, this.size);

    // Reset shadow to avoid affecting other particles
    if (this.blur > 0) {
      const ctx = (p5 as any).drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur = 0;
    }
  }

  /**
   * Apply force to particle (F = ma)
   */
  applyForce(fx: number, fy: number): void {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  /**
   * Attract particle toward a point (mouse interaction)
   */
  attractToPoint(px: number, py: number, strength: number = 0.05): void {
    const dx = px - this.x;
    const dy = py - this.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    // Only attract within radius, avoid division by zero
    if (distance < 150 && distance > 5) {
      const force = strength / distance;
      this.applyForce(dx * force, dy * force);
    }
  }

  /**
   * Scatter particle away from a point (click ripple)
   */
  repelFromPoint(px: number, py: number, force: number = 10.0): void {
    const dx = this.x - px;
    const dy = this.y - py;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    if (distance < 200 && distance > 0) {
      const repelForce = force / (distance + 1);
      this.applyForce(dx * repelForce, dy * repelForce);
    }
  }
}
