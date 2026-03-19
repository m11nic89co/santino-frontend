/**
 * SANTINO — ESM-точка входа (P1.2, без eval).
 * MP-04: запуск через единый bootstrap lifecycle-контракт init(context).
 * Карусель и счётчики секции 1 остаются в классических defer-скриптах.
 */
import { createRuntimeContext } from './runtime/context.js';
import { createBootstrap } from './runtime/bootstrap.js';
import { initLegacyHealthChecks } from './runtime/legacy-health-check.js';
import { initSwiperBridge } from './runtime/swiper-bridge.js';
import { initReducedMotionGuard } from './runtime/reduced-motion-guard.js';
import { initLegacyChainLoader } from './runtime/legacy-chain-loader.js';

import { initViewport } from './modules/core/viewport-utils.js';
import { initPerformance } from './modules/core/utils/performance.js';
import { initUiiCarousel } from './modules/ui/carousel/uii-carousel.js';
import { initLightningEffect } from './modules/ui/animations/lightning-effect.js';
import { initPointerCrosshair } from './modules/ui/animations/pointer-crosshair.js';
import { initTiltHover } from './modules/ui/animations/tilt-hover.js';
import { initBlueprintsBg } from './modules/ui/animations/blueprints-bg.js';
import { initSection2Grid } from './modules/ui/interactions/section2-grid.js';
import { initCollectionCtaPosition } from './modules/business/contracts/collection-cta-position.js';

const context = createRuntimeContext();

const modules = [
  { name: 'viewport', init: initViewport },
  { name: 'reduced-motion-guard', init: initReducedMotionGuard },
  { name: 'swiper-bridge', init: initSwiperBridge },
  { name: 'legacy-chain-loader', init: initLegacyChainLoader },
  { name: 'performance', init: initPerformance },
  { name: 'uii-carousel', init: initUiiCarousel },
  { name: 'lightning-effect', init: initLightningEffect },
  { name: 'pointer-crosshair', init: initPointerCrosshair },
  { name: 'tilt-hover', init: initTiltHover },
  { name: 'blueprints-bg', init: initBlueprintsBg },
  { name: 'section2-grid', init: initSection2Grid },
  { name: 'collection-cta-position', init: initCollectionCtaPosition },
  { name: 'legacy-health-check', init: initLegacyHealthChecks },
];

const runtime = createBootstrap({ modules, context });
runtime.start();
