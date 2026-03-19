/**
 * Adapters — Phase 5. Public API.
 * Feature layer must use only these ports/adapters; direct vendor import is forbidden.
 */
export { createSwiperAdapter } from './swiper.adapter.js';
export { createFallbackSwiperPort } from './fallback-swiper.adapter.js';
export { createGsapAdapter } from './gsap.adapter.js';
export type { SwiperVendorConstructor, SwiperVendorInstance } from './swiper.adapter.js';
export type { GsapVendor, ScrollTriggerVendor } from './gsap.adapter.js';
export * from './ports/index.js';
