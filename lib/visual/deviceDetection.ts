/**
 * Device Detection Utilities
 *
 * Detects device capabilities to optimize particle system performance
 * Adapts particle count, blur effects, and frame rate targets
 */

import type { DeviceTier } from '@/types/listening-room';

/**
 * Detect device tier for adaptive performance
 *
 * Tiers:
 * - High: Desktop 8+ cores, 8GB+ RAM (100k particles, 60fps, blur enabled)
 * - Medium: Desktop 4+ cores, flagship mobile (50k particles, 60fps, no blur)
 * - Low: Budget mobile, old hardware (10k particles, 30fps, no blur)
 */
export function detectDeviceTier(): DeviceTier {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return 'medium';

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

  // Low: Everything else (budget mobile, old hardware)
  return 'low';
}

/**
 * Get performance configuration for device tier
 */
export function getPerformanceConfig(tier: DeviceTier) {
  const configs = {
    high: {
      particleCount: 100000,
      fps: 60,
      blur: true,
      resolution: 1.0
    },
    medium: {
      particleCount: 50000,
      fps: 60,
      blur: false,
      resolution: 1.0
    },
    low: {
      particleCount: 10000,
      fps: 30,
      blur: false,
      resolution: 0.5
    }
  };

  return configs[tier];
}

/**
 * Check if device supports WebGL
 */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Get device info for debugging
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      tier: 'medium' as DeviceTier,
      cores: 0,
      memory: 0,
      isMobile: false,
      webgl: false
    };
  }

  const tier = detectDeviceTier();
  const cores = navigator.hardwareConcurrency || 0;
  const memory = (navigator as any).deviceMemory || 0;
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const webgl = supportsWebGL();

  return { tier, cores, memory, isMobile, webgl };
}
