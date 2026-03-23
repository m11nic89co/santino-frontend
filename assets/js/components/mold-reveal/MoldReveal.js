import gsap from 'gsap';
import './mold-reveal.css';

const POT_COLLECTION = [
  {
    id: 'wide-minimalist-bowl',
    // Width ~120, height ~36 => ratio > 3.0 (strictly wider than 2.5x)
    outer: 'M20 78 L24 54 Q80 42 136 54 L140 78 L20 78 Z',
    inner: 'M26 78 L30 57 Q80 48 130 57 L134 78 L26 78 Z',
    rim: 'M24 54 Q80 42 136 54',
    shoulder: 'M26 62 Q80 54 134 62',
  },
];

function setPath(root, selector, d) {
  const el = root.querySelector(selector);
  if (el && d) el.setAttribute('d', d);
}

function applyPot(root) {
  const p = POT_COLLECTION[0];
  setPath(root, '.pot-bp-outer', p.outer);
  setPath(root, '.pot-bp-inner', p.inner);
  setPath(root, '.pot-sk-outer', p.outer);
  setPath(root, '.pot-sk-inner', p.inner);
  setPath(root, '.pot-sr-outer', p.outer);
  setPath(root, '.pot-sr-inner', p.inner);
  setPath(root, '.pot-sr-spec', p.outer);
  setPath(root, '.pot-sr-rim', p.rim);
  setPath(root, '.pot-sr-shoulder', p.shoulder);
}

const TEMPLATE = `
<div class="mold-reveal-app kinetic-blueprint-stand">
  <div class="ghost-layer">
    <div class="hud-left">ДОПУСКИ: 0.01мм</div>
    <div class="hud-right">ВРЕМЯ СМЫКАНИЯ: 12 СЕК</div>
    <div class="reveal-stage">
      <svg class="reveal-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id="scanner-clip" clipPathUnits="userSpaceOnUse">
          <rect class="scanner-mask" x="0" y="0" width="160" height="0" />
        </clipPath>
        <linearGradient id="series-body" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" style="stop-color:#5e8792" />
          <stop offset="45%" style="stop-color:#243b43" />
          <stop offset="100%" style="stop-color:#0d1418" />
        </linearGradient>
        <filter id="specular-rim" x="-25%" y="-40%" width="150%" height="200%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="34" lighting-color="#ffffff" result="spec">
            <fePointLight x="64" y="26" z="140" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="specular" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="specular" />
          </feMerge>
        </filter>
      </defs>

      <line class="pedestal-line" x1="10" y1="86" x2="150" y2="86" />

      <g class="stage-blueprint">
        <path class="pot-bp-outer" fill="none" stroke="rgba(0,173,181,0.3)" stroke-width="0.5" vector-effect="non-scaling-stroke" />
        <path class="pot-bp-inner" fill="none" stroke="rgba(0,173,181,0.2)" stroke-width="0.5" stroke-dasharray="2 1.4" vector-effect="non-scaling-stroke" />
      </g>

      <g class="stage-sketch" clip-path="url(#scanner-clip)" opacity="0">
        <path class="pot-sk-outer" fill="#111111" stroke="none" />
        <path class="pot-sk-inner" fill="#0d0d0d" stroke="none" />
      </g>

      <g class="stage-series" opacity="0">
        <path class="pot-sr-outer" fill="url(#series-body)" stroke="rgba(255,255,255,0.08)" stroke-width="0.3" vector-effect="non-scaling-stroke" />
        <path class="pot-sr-inner" fill="rgba(0,0,0,0.25)" stroke="none" />
        <path class="pot-sr-spec" fill="url(#series-body)" filter="url(#specular-rim)" opacity="0.95" />
        <path class="pot-sr-rim" fill="none" stroke="rgba(244,253,255,0.95)" stroke-width="0.6" vector-effect="non-scaling-stroke" />
        <path class="pot-sr-shoulder" fill="none" stroke="rgba(215,242,255,0.4)" stroke-width="0.75" vector-effect="non-scaling-stroke" />
      </g>

      <g class="scanner-group" opacity="0">
        <line class="scanner-line" x1="8" y1="24" x2="152" y2="24" />
      </g>

        <g class="flash-group" opacity="0">
          <rect x="0" y="0" width="160" height="100" fill="rgba(220,255,255,0.05)" />
        </g>
      </svg>
    </div>
    <p class="mold-status-label" aria-live="polite">СБРОС</p>
  </div>
  <a class="btn ghost cta-calculate" href="https://santino.market" target="_blank" rel="noopener noreferrer">Рассчитать выпуск</a>
</div>
`;

function setStatus(el, text) {
  if (el) el.textContent = text;
}

function buildTimeline(app) {
  const bp = app.querySelector('.stage-blueprint');
  const sk = app.querySelector('.stage-sketch');
  const sr = app.querySelector('.stage-series');
  const scanner = app.querySelector('.scanner-group');
  const scannerLine = app.querySelector('.scanner-line');
  const scannerMask = app.querySelector('.scanner-mask');
  const flash = app.querySelector('.flash-group');
  const status = app.querySelector('.mold-status-label');
  const hudLeft = app.querySelector('.hud-left');
  const hudRight = app.querySelector('.hud-right');
  const cta = app.querySelector('.cta-calculate');

  if (!bp || !sk || !sr || !scanner || !scannerLine || !scannerMask || !flash) return null;

  gsap.set(bp, { opacity: 0.85 });
  gsap.set(sk, { opacity: 0, filter: 'blur(5px)' });
  gsap.set(sr, { opacity: 0, filter: 'blur(6px)' });
  gsap.set(scanner, { opacity: 0 });
  gsap.set(flash, { opacity: 0 });
  gsap.set(scannerLine, { attr: { y1: 24, y2: 24 } });
  gsap.set(scannerMask, { attr: { height: 0 } });
  gsap.set(hudLeft, { opacity: 1 });
  gsap.set(hudRight, { opacity: 1 });
  gsap.set(cta, { opacity: 1, y: 0, pointerEvents: 'auto' });

  return gsap
    .timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' } })
    // Phase 0: Reset / Step Back (0.0 - 1.5)
    .call(() => setStatus(status, 'СБРОС'), [], 0)
    .to(sr, { opacity: 0, filter: 'blur(8px)', duration: 0.55 }, 0.05)
    .to(sk, { opacity: 0, filter: 'blur(7px)', duration: 0.45 }, 0.1)
    .to(bp, { opacity: 0.16, duration: 0.45 }, 0.2)
    .to(scanner, { opacity: 0, duration: 0.2 }, 0)
    .set(scannerLine, { attr: { y1: 24, y2: 24 } }, 1.2)
    .set(scannerMask, { attr: { height: 0 } }, 1.2)
    // Phase 1: Blueprint (1.5 - 4.0)
    .call(() => setStatus(status, 'ИДЕЯ'), [], 1.5)
    .to(bp, { opacity: 0.88, duration: 0.55 }, 1.5)
    .to(sk, { opacity: 0, duration: 0.3 }, 1.5)
    .to(sr, { opacity: 0, duration: 0.3 }, 1.5)
    // Phase 2: Sketch (4.0 - 6.5)
    .call(() => setStatus(status, 'СОЗИДАНИЕ'), [], 4)
    .to(scanner, { opacity: 0.85, duration: 0.2 }, 4)
    .to(sk, { opacity: 0.84, filter: 'blur(0px)', duration: 0.5 }, 4.1)
    .to(bp, { opacity: 0.34, duration: 0.5 }, 4.1)
    .to(scannerLine, { attr: { y1: 78, y2: 78 }, duration: 2.2, ease: 'none' }, 4.2)
    .to(scannerMask, { attr: { height: 78 }, duration: 2.2, ease: 'none' }, 4.2)
    .to(scanner, { opacity: 0, duration: 0.2 }, 6.35)
    // Phase 3: Series (6.5 - 9.0)
    .call(() => setStatus(status, 'ФОРМА'), [], 6.5)
    .to(flash, { opacity: 0.42, duration: 0.12 }, 6.52)
    .to(flash, { opacity: 0, duration: 0.22 }, 6.64)
    .to(sk, { opacity: 0.15, filter: 'blur(3px)', duration: 0.45 }, 6.5)
    .to(bp, { opacity: 0.05, duration: 0.45 }, 6.5)
    .to(sr, { opacity: 1, filter: 'blur(0px)', duration: 0.65 }, 6.58)
    .to(cta, { scale: 1.04, boxShadow: '0 0 16px rgba(0,255,245,0.45)', duration: 0.35 }, 7.05)
    .to(cta, { scale: 1, boxShadow: '0 0 0 rgba(0,255,245,0)', duration: 0.45 }, 7.4)
    .to({}, { duration: 1.25 }, 7.75);
}

export default function mountMoldReveal(anchor) {
  if (!anchor || anchor.dataset.moldRevealInit === '1') return { play: () => {}, pause: () => {} };
  anchor.dataset.moldRevealInit = '1';
  anchor.innerHTML = TEMPLATE.trim();

  const app = anchor.querySelector('.kinetic-blueprint-stand');
  if (!app) return { play: () => {}, pause: () => {} };

  applyPot(app);
  const tl = buildTimeline(app);
  /** @type {HTMLElement & { __timeline?: import('gsap').Timeline | null }} */
  (app).__timeline = tl;

  return {
    play: () => {
      if (tl) tl.play();
    },
    pause: () => {
      if (tl) tl.pause();
    },
  };
}

export function destroyMoldReveal(anchor) {
  if (!anchor) return;
  const app = anchor.querySelector('.kinetic-blueprint-stand');
  const tl = app && /** @type {HTMLElement & { __timeline?: import('gsap').Timeline }} */ (app).__timeline;
  if (tl) tl.kill();
  anchor.dataset.moldRevealInit = '0';
  anchor.innerHTML = '';
}
