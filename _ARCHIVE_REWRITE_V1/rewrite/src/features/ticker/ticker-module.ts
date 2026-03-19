/**
 * Ticker Kernel Module — Phase 9. Single owner of ticker state.
 * C-TICK-01. Reduced-motion + pause when off-section; no double init.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { KernelModule } from '@/kernel/index.js';
import { createTickerDOM } from './ticker-dom.js';

/** Sections where ticker is visible and should run. Others: pause to save CPU. */
const TICKER_VISIBLE_SECTIONS = new Set([0, 1, 2]);

export interface TickerModuleOptions {
  bus: TypedEventBus;
  getMountTarget: () => HTMLElement | null;
  getReducedMotion: () => boolean;
}

export function createTickerModule(options: TickerModuleOptions): KernelModule {
  const { bus, getMountTarget, getReducedMotion } = options;
  let el: ReturnType<typeof createTickerDOM> | null = null;
  let unsubSectionChange: (() => void) | null = null;

  return {
    id: 'ticker',

    init(): void {
      const mount = getMountTarget();
      if (!mount) return;
      if (mount.querySelector('#ticker-track')) return;

      el = createTickerDOM();
      mount.appendChild(el.wrap);

      const reducedMotion = getReducedMotion();
      if (reducedMotion) {
        el.wrap.classList.add('ticker-paused');
      }

      unsubSectionChange = bus.on('app:sectionChange', (payload) => {
        if (!el) return;
        const reduced = getReducedMotion();
        const visible = TICKER_VISIBLE_SECTIONS.has(payload.activeIndex);
        if (reduced || !visible) {
          el.wrap.classList.add('ticker-paused');
        } else {
          el.wrap.classList.remove('ticker-paused');
        }
      });

      const initialVisible = TICKER_VISIBLE_SECTIONS.has(0);
      if (reducedMotion || !initialVisible) {
        el.wrap.classList.add('ticker-paused');
      }
    },

    dispose(): void {
      unsubSectionChange?.();
      unsubSectionChange = null;
      if (el?.wrap.parentNode) {
        el.wrap.parentNode.removeChild(el.wrap);
      }
      el = null;
    },
  };
}
