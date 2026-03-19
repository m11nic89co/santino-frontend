/**
 * Collection Kernel Module — Phase 8.
 * C-S1-01, C-S1-02. Carousel via ISwiperPort only. Stats via typed bus events.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { KernelModule } from '@/kernel/index.js';
import type { ISwiperPort, ISwiperInstance } from '@/adapters/index.js';
import { createCollectionDOM } from './collection-dom.js';
import { createCollectionCarousel } from './collection-carousel.js';
import { bindCollectionStats } from './collection-stats.js';

const COLLECTION_SECTION_INDEX = 1;

export interface CollectionModuleOptions {
  bus: TypedEventBus;
  swiperPort: ISwiperPort;
  getSection1: () => HTMLElement | null;
}

export function createCollectionModule(options: CollectionModuleOptions): KernelModule {
  const { bus, swiperPort, getSection1 } = options;
  let el: ReturnType<typeof createCollectionDOM> | null = null;
  let carousel: ISwiperInstance | null = null;
  let unsubSectionChange: (() => void) | null = null;
  let unsubStats: (() => void) | null = null;

  return {
    id: 'collection',

    init(): void {
      const section1 = getSection1();
      if (!section1) return;

      el = createCollectionDOM(section1);
      carousel = createCollectionCarousel(swiperPort, bus, el.swiperSelector);
      unsubStats = bindCollectionStats(el, bus);

      unsubSectionChange = bus.on('app:sectionChange', (payload) => {
        const { activeIndex, previousIndex } = payload;
        const isNowActive = activeIndex === COLLECTION_SECTION_INDEX;
        const wasActive = previousIndex === COLLECTION_SECTION_INDEX;

        if (carousel) {
          if (wasActive && !isNowActive) {
            carousel.pause?.();
          }
          if (isNowActive) {
            carousel.resume?.();
          }
        }
      });

      if (carousel) {
        carousel.resume?.();
      }
    },

    dispose(): void {
      unsubSectionChange?.();
      unsubStats?.();
      unsubSectionChange = null;
      unsubStats = null;
      if (carousel) {
        carousel.destroy();
        carousel = null;
      }
      el = null;
    },
  };
}
