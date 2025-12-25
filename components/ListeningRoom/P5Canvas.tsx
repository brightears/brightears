"use client";

/**
 * P5Canvas Component - Full-screen p5.js particle system
 *
 * Phase 2: Visual System with TeamLab Borderless aesthetic
 *
 * Features:
 * - Device tier detection (high/medium/low)
 * - Adaptive particle count (100k/50k/10k)
 * - Perlin noise organic movement (firefly-like)
 * - Mouse attraction physics (150px radius)
 * - Click ripple effects
 * - 60 FPS performance target with adaptive quality
 * - Mood-based color palette switching
 *
 * Technical:
 * - Uses native p5.js (not react-p5 wrapper for better performance)
 * - Dynamic import to avoid SSR issues
 * - Fullscreen canvas background layer
 * - Respects window resize
 */

import { useEffect, useRef, useState } from 'react';
import type p5 from 'p5';
import { ParticleSystemManager } from '@/lib/visual/ParticleSystemManager';
import type { MoodType } from '@/lib/visual/Particle';
import { detectDeviceTier } from '@/lib/visual/deviceDetection';

export interface P5CanvasProps {
  mood?: MoodType;
  onFPSUpdate?: (fps: number) => void;
}

export function P5Canvas({ mood = 'neutral', onFPSUpdate }: P5CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const particleSystemRef = useRef<ParticleSystemManager | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('p5').then((p5Module) => {
      const P5 = p5Module.default;

      if (!containerRef.current || p5InstanceRef.current) return;

      // Detect device tier for adaptive performance
      const deviceTier = detectDeviceTier();
      console.log(`Device tier: ${deviceTier}`);

      // Create p5 sketch
      const sketch = (p: p5) => {
        let particleSystem: ParticleSystemManager;
        let lastFrameTime = 0;

        p.setup = () => {
          // Create fullscreen canvas
          const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
          canvas.parent(containerRef.current!);

          // Initialize particle system
          particleSystem = new ParticleSystemManager(p, {
            deviceTier,
            enableBlur: deviceTier === 'high' // Only blur on high-end
          });

          particleSystemRef.current = particleSystem;

          // Set frame rate target
          p.frameRate(deviceTier === 'low' ? 30 : 60);

          console.log(`Initialized ${particleSystem.particles.length} particles`);
          setIsLoaded(true);
        };

        p.draw = () => {
          // Clear background (deep space black)
          p.background('#030129');

          // Calculate delta time for smooth animation
          const currentTime = p.millis();
          const deltaTime = lastFrameTime > 0 ? (currentTime - lastFrameTime) / 16.67 : 1;
          lastFrameTime = currentTime;

          // Update and display particles
          if (particleSystem) {
            particleSystem.update(p.mouseX, p.mouseY, deltaTime);
            particleSystem.display();

            // Monitor performance and reduce quality if needed
            if (p.frameCount % 120 === 0) { // Check every 2 seconds
              if (particleSystem.shouldReduceQuality()) {
                particleSystem.reduceQuality();
              }

              // Report FPS to parent
              if (onFPSUpdate) {
                onFPSUpdate(particleSystem.getFPS());
              }
            }
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        p.mouseClicked = () => {
          // Trigger ripple effect and scatter particles
          if (particleSystem && p.mouseX > 0 && p.mouseY > 0) {
            particleSystem.handleClick(p.mouseX, p.mouseY);
          }
        };
      };

      // Create p5 instance
      p5InstanceRef.current = new P5(sketch);
    });

    // Cleanup on unmount
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Handle mood changes
  useEffect(() => {
    if (particleSystemRef.current && isLoaded) {
      particleSystemRef.current.morphToMood(mood, 4000);
    }
  }, [mood, isLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    />
  );
}

