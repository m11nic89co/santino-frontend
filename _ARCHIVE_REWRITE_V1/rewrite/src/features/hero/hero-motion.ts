/**
 * Hero motion — Phase 7. All animation via IAnimationPort only.
 * No setTimeout, setInterval, or inline styles for animation state.
 * Reduced-motion: when true, no motion (duration 0 or skip).
 */
import type { IAnimationPort } from '@/adapters/index.js';
import type { HeroElements } from './hero-dom.js';

export interface HeroMotionOptions {
  animation: IAnimationPort;
  reducedMotion: boolean;
}

const INTRO_DURATION = 0.6;
const INTRO_DELAY_TITLE = 0.1;
const INTRO_DELAY_CTA = 0.3;

export function runHeroIntro(el: HeroElements, options: HeroMotionOptions): (() => void)[] {
  const { animation, reducedMotion } = options;
  const duration = reducedMotion ? 0 : INTRO_DURATION;
  const kills: Array<() => void> = [];

  const fromVars = { opacity: 0, y: 28 };
  const toVars = { opacity: 1, y: 0, duration, ease: 'power2.out' };

  const t1 = animation.fromTo(el.title, fromVars, { ...toVars, delay: INTRO_DELAY_TITLE });
  kills.push(() => t1.kill());

  const t2 = animation.fromTo(el.cta, fromVars, { ...toVars, delay: INTRO_DELAY_CTA });
  kills.push(() => t2.kill());

  return kills;
}

export function killHeroMotion(kills: Array<() => void>): void {
  for (const k of kills) k();
}
