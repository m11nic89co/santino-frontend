/**
 * SANTINO v2 — ESM entry (Phase 6+7, Phase 11: real vendor injection).
 * Bootstrap: Kernel + App Shell + Hero. No window.* in feature code.
 * Vendors (gsap, swiper) injected here only; adapters stay vendor-agnostic.
 */
import './style.css';
import './features/app-shell/app-shell.css';
import './features/hero/hero.css';
import './features/collection/collection.css';
import './features/ticker/ticker.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper/bundle';

import { TypedEventBus } from '@/kernel/index.js';
import { StateMachine } from '@/kernel/index.js';
import { LifecycleController } from '@/kernel/index.js';
import { createGsapAdapter, createSwiperAdapter } from '@/adapters/index.js';
import { createAppShellModule } from '@/features/app-shell/index.js';
import { createHeroModule } from '@/features/hero/index.js';
import { createCollectionModule } from '@/features/collection/index.js';
import { createTickerModule } from '@/features/ticker/index.js';

gsap.registerPlugin(ScrollTrigger);

const bus = new TypedEventBus();
const stateMachine = new StateMachine();
const lifecycle = new LifecycleController({ eventBus: bus, stateMachine });

const animation = createGsapAdapter(bus, () => gsap, () => ScrollTrigger);
const swiperPort = createSwiperAdapter(bus, () => Swiper);
const getReducedMotion = (): boolean =>
  typeof document !== 'undefined' &&
  document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const mount = document.getElementById('app');
if (mount) {
  const appShell = createAppShellModule({
    bus,
    stateMachine,
    getMountTarget: () => document.getElementById('app'),
  });
  lifecycle.register(appShell);

  const hero = createHeroModule({
    bus,
    animation,
    getSection0: () => document.getElementById('section-0'),
    getReducedMotion,
  });
  lifecycle.register(hero);

  const collection = createCollectionModule({
    bus,
    swiperPort,
    getSection1: () => document.getElementById('section-1'),
  });
  lifecycle.register(collection);

  const ticker = createTickerModule({
    bus,
    getMountTarget: () => document.getElementById('main-content'),
    getReducedMotion,
  });
  lifecycle.register(ticker);

  lifecycle.start();
}
