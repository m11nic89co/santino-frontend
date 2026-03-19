/**
 * Swiper Port — Phase 5.
 * Contract for slide/scroll UI. No vendor types; feature layer depends only on this.
 */

/** Options our app needs; adapter maps to vendor options. */
export interface SwiperOptionsPort {
  direction?: 'horizontal' | 'vertical';
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  loop?: boolean;
  speed?: number;
  effect?: string;
  pagination?: { el: string; clickable?: boolean };
  keyboard?: { enabled?: boolean };
  mousewheel?: boolean | Record<string, unknown>;
  a11y?: { enabled?: boolean };
  /** Rest as passthrough for vendor. */
  [key: string]: unknown;
}

/** Instance contract: what features use. */
export interface ISwiperInstance {
  slideTo(_index: number, _speed?: number): void;
  on(_event: string, _handler: (..._args: unknown[]) => void): void;
  off(_event: string, _handler?: (..._args: unknown[]) => void): void;
  getActiveIndex(): number;
  destroy(): void;
  /** Optional: pause autoplay when leaving section. */
  pause?(): void;
  /** Optional: resume when entering section. */
  resume?(): void;
}

/** Port: create swiper instance from selector and options. Returns null if vendor unavailable. */
export interface ISwiperPort {
  create(_selector: string, _options: SwiperOptionsPort): ISwiperInstance | null;
}
