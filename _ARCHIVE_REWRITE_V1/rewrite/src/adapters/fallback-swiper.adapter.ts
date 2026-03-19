/**
 * Fallback Swiper Port — Phase 5.
 * No-op implementation when vendor is unavailable. Prevents kernel/feature crash.
 */
import type { ISwiperInstance, ISwiperPort, SwiperOptionsPort } from './ports/swiper.port.js';

const noopInstance: ISwiperInstance = {
  slideTo: () => {},
  on: () => {},
  off: () => {},
  getActiveIndex: () => 0,
  destroy: () => {},
};

/** Port that always returns a no-op instance. Use when vendor load failed. */
export function createFallbackSwiperPort(): ISwiperPort {
  return {
    create(_sel: string, _opts: SwiperOptionsPort): ISwiperInstance {
      return noopInstance;
    },
  };
}
