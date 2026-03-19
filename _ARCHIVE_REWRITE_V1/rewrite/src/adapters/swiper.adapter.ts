/**
 * Swiper Adapter — Phase 5.
 * Anti-corruption layer: wraps vendor Swiper. Errors isolated; kernel:error emitted on failure.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { ISwiperInstance, SwiperOptionsPort } from './ports/swiper.port.js';
import type { ISwiperPort } from './ports/swiper.port.js';

/** Vendor constructor shape (injected; no direct import). */
export type SwiperVendorConstructor = new (
  _selector: string,
  _options: Record<string, unknown>
) => SwiperVendorInstance;

export interface SwiperVendorInstance {
  slideTo(_index: number, _speed?: number): void;
  on(_event: string, _handler: (..._args: unknown[]) => void): void;
  off(_event: string, _handler?: (..._args: unknown[]) => void): void;
  activeIndex: number;
  destroy(_deleteInstance?: boolean): void;
}

/** Returns the adapter or null if vendor unavailable. Does not throw. */
export function createSwiperAdapter(
  bus: TypedEventBus,
  getVendor: () => SwiperVendorConstructor | null | undefined
): ISwiperPort {
  return {
    create(selector: string, options: SwiperOptionsPort): ISwiperInstance | null {
      try {
        const SwiperClass = getVendor();
        if (!SwiperClass) {
          bus.emit('kernel:error', {
            error: new Error('Swiper adapter: vendor not available'),
            context: 'adapters:swiper',
            recoverable: true,
          });
          return null;
        }
        const instance = new SwiperClass(selector, options as Record<string, unknown>);
        return wrapSwiperInstance(bus, instance);
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:create',
          recoverable: true,
        });
        return null;
      }
    },
  };
}

function wrapSwiperInstance(bus: TypedEventBus, raw: SwiperVendorInstance): ISwiperInstance {
  return {
    slideTo(index: number, speed?: number): void {
      try {
        raw.slideTo(index, speed);
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:slideTo',
          recoverable: true,
        });
      }
    },
    on(event: string, handler: (..._args: unknown[]) => void): void {
      try {
        raw.on(event, handler);
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:on',
          recoverable: true,
        });
      }
    },
    off(event: string, handler?: (..._args: unknown[]) => void): void {
      try {
        raw.off(event, handler);
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:off',
          recoverable: true,
        });
      }
    },
    getActiveIndex(): number {
      try {
        return raw.activeIndex;
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:activeIndex',
          recoverable: true,
        });
        return 0;
      }
    },
    destroy(): void {
      try {
        raw.destroy();
      } catch (err) {
        bus.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: 'adapters:swiper:destroy',
          recoverable: true,
        });
      }
    },
    pause(): void {
      try {
        (raw as { pause?: () => void }).pause?.();
      } catch {
        /* no-op if vendor has no pause */
      }
    },
    resume(): void {
      try {
        (raw as { resume?: () => void }).resume?.();
      } catch {
        /* no-op if vendor has no resume */
      }
    },
  };
}
