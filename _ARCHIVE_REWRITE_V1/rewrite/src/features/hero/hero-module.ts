/**
 * Hero Kernel Module — Phase 7.
 * C-HERO-01, C-A11Y-02 (reduced-motion). Motion only via adapter; no timers.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { KernelModule } from '@/kernel/index.js';
import type { IAnimationPort } from '@/adapters/index.js';
import { createHeroDOM } from './hero-dom.js';
import { runHeroIntro, killHeroMotion } from './hero-motion.js';

export interface HeroModuleOptions {
  bus: TypedEventBus;
  animation: IAnimationPort;
  getSection0: () => HTMLElement | null;
  getReducedMotion: () => boolean;
}

export function createHeroModule(options: HeroModuleOptions): KernelModule {
  const { bus, animation, getSection0, getReducedMotion } = options;
  let el: ReturnType<typeof createHeroDOM> | null = null;
  let activeKills: Array<() => void> = [];
  let unsubSectionChange: (() => void) | null = null;
  let reducedMotionMedia: MediaQueryList | null = null;
  let reducedMotionHandler: (() => void) | null = null;

  function applyReducedMotionClass(): void {
    if (typeof document === 'undefined' || !document.documentElement) return;
    if (getReducedMotion()) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }

  return {
    id: 'hero',

    init(): void {
      applyReducedMotionClass();
      const section0 = getSection0();
      if (!section0) return;

      el = createHeroDOM();
      section0.innerHTML = '';
      section0.appendChild(el.container);
      section0.classList.add('hero-section-wrapper');

      const reducedMotion = getReducedMotion();
      activeKills = runHeroIntro(el, { animation, reducedMotion });

      unsubSectionChange = bus.on('app:sectionChange', (payload) => {
        if (payload.activeIndex === 0) {
          killHeroMotion(activeKills);
          if (el) {
            activeKills = runHeroIntro(el, { animation, reducedMotion: getReducedMotion() });
          }
        } else {
          killHeroMotion(activeKills);
          activeKills = [];
        }
      });

      reducedMotionMedia = document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
      reducedMotionHandler = (): void => {
        applyReducedMotionClass();
        killHeroMotion(activeKills);
        activeKills = [];
        if (el) {
          activeKills = runHeroIntro(el, { animation, reducedMotion: getReducedMotion() });
        }
      };
      reducedMotionMedia?.addEventListener('change', reducedMotionHandler);
    },

    dispose(): void {
      if (reducedMotionMedia && reducedMotionHandler) {
        reducedMotionMedia.removeEventListener('change', reducedMotionHandler);
      }
      reducedMotionMedia = null;
      reducedMotionHandler = null;
      unsubSectionChange?.();
      unsubSectionChange = null;
      killHeroMotion(activeKills);
      activeKills = [];
      el = null;
    },
  };
}
