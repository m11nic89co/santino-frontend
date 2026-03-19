/**
 * Collection Carousel — Phase 8. C-S1-01.
 * Only via ISwiperPort. No direct vendor.
 */
import type { ISwiperPort, ISwiperInstance, SwiperOptionsPort } from '@/adapters/index.js';
import type { TypedEventBus } from '@/kernel/index.js';

export function createCollectionCarousel(
  swiperPort: ISwiperPort,
  bus: TypedEventBus,
  selector: string
): ISwiperInstance | null {
  const options: SwiperOptionsPort = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: true,
    speed: 400,
    effect: 'coverflow',
    pagination: { el: '#section1-carousel-root .swiper-pagination', clickable: true },
    keyboard: { enabled: true },
    a11y: { enabled: true },
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
  };
  const instance = swiperPort.create(selector, options);
  if (!instance) return null;

  instance.on('slideChange', () => {
    const idx = instance.getActiveIndex();
    const stats = [
      { id: 'models', value: 11 + (idx % 3), label: 'Моделей' },
      { id: 'years', value: 15 + (idx % 5), label: 'Лет' },
      { id: 'clients', value: 120 + idx * 2, label: 'Клиентов' },
    ];
    bus.emit('app:collectionStats', { stats });
  });

  bus.emit('app:collectionStats', {
    stats: [
      { id: 'models', value: 11, label: 'Моделей' },
      { id: 'years', value: 15, label: 'Лет' },
      { id: 'clients', value: 120, label: 'Клиентов' },
    ],
  });
  return instance;
}
