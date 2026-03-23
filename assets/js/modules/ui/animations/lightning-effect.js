/**
 * Эффект молний (hero / paparazzi-flash). P1.2 — ESM. Устанавливает window.activateLightning.
 */
export function initLightningEffect() {
  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduced-motion');

  if (reducedMotion) {
    window.activateLightning = function () {};
    return;
  }

  function activateLightning() {
    const el =
      document.querySelector('.lightning-effect') || document.getElementById('paparazzi-flash');
    if (!el) {
      console.error('❌ Элемент молнии не найден!');
      return;
    }
    if (el.id === 'paparazzi-flash') {
      el.classList.add('lightning-series');
      el.style.display = 'block';
    } else {
      el.classList.add('active');
    }
    setTimeout(function () {
      if (el.id === 'paparazzi-flash') {
        el.classList.remove('lightning-series');
        el.style.display = 'none';
      } else {
        el.classList.remove('active');
      }
    }, 9000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.addEventListener('load', function () {
        setTimeout(activateLightning, 1000);
      });
    });
  } else {
    setTimeout(activateLightning, 1000);
  }
  window.activateLightning = activateLightning;
}
