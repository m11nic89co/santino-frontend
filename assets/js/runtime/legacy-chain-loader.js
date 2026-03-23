/**
 * MP-12: Single app entry legacy loader.
 * Загружает критичный legacy-контур в фиксированном порядке из main.js.
 */
function resolveChainPaths(paths) {
  // Derive base path from the current script location so paths work
  // both on localhost (/) and on GitHub Pages (/santino-frontend/).
  const base = (() => {
    try {
      const url = new URL(import.meta.url);
      // strip everything after the last "/" that is inside /santino-frontend/
      return url.pathname.replace(/\/assets\/js\/runtime\/legacy-chain-loader\.js$/, '/');
    } catch {
      return '/';
    }
  })();
  return paths.map((p) => base + p);
}

const LEGACY_CHAIN = resolveChainPaths([
  'assets/js/modules/core/app.js',
  'assets/js/modules/ui/carousel/swiper-init.js',
  'assets/js/modules/ui/carousel/section1-carousel.js',
  'assets/js/modules/business/stats/section1-stats.js',
  'assets/js/modules/business/stats/section1-stats-size.js',
  'assets/js/modules/utils/ticker/ticker-unified-module.js',
]);

let started = false;

function invokeListener(target, type, listener) {
  const event = new Event(type);
  if (typeof listener === 'function') {
    listener.call(target, event);
    return;
  }
  if (listener && typeof listener.handleEvent === 'function') {
    listener.handleEvent(event);
  }
}

function createLateEventCompatLayer() {
  const originalDocumentAddEventListener = document.addEventListener.bind(document);
  const originalWindowAddEventListener = window.addEventListener.bind(window);

  function shouldInvokeImmediately(type) {
    if (type === 'DOMContentLoaded') return document.readyState !== 'loading';
    if (type === 'load') return document.readyState === 'complete';
    return false;
  }

  document.addEventListener = function patchedDocumentAddEventListener(type, listener, options) {
    if (shouldInvokeImmediately(type)) {
      queueMicrotask(() => {
        try {
          invokeListener(document, type, listener);
        } catch (error) {
          console.error('[legacy-chain-loader] listener invocation failed:', error);
        }
      });
      return;
    }

    return originalDocumentAddEventListener(type, listener, options);
  };

  window.addEventListener = function patchedWindowAddEventListener(type, listener, options) {
    if (shouldInvokeImmediately(type)) {
      queueMicrotask(() => {
        try {
          invokeListener(window, type, listener);
        } catch (error) {
          console.error('[legacy-chain-loader] listener invocation failed:', error);
        }
      });
      return;
    }

    return originalWindowAddEventListener(type, listener, options);
  };

  return function restoreLateEventCompatLayer() {
    document.addEventListener = originalDocumentAddEventListener;
    window.addEventListener = originalWindowAddEventListener;
  };
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;

    script.addEventListener(
      'load',
      () => {
        resolve();
      },
      { once: true }
    );

    script.addEventListener(
      'error',
      () => {
        reject(new Error(`Failed to load legacy script: ${src}`));
      },
      { once: true }
    );

    document.head.appendChild(script);
  });
}

export function initLegacyChainLoader() {
  if (started) return;
  started = true;

  const restoreLateEventCompatLayer = createLateEventCompatLayer();

  (async () => {
    try {
      for (const src of LEGACY_CHAIN) {
        await loadScript(src);
      }

      document.dispatchEvent(new CustomEvent('legacyChainReady'));
    } finally {
      restoreLateEventCompatLayer();
    }
  })().catch((error) => {
    console.error('[legacy-chain-loader] bootstrap failed:', error);
  });
}
