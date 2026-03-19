class TickerModule {
  constructor() {
    this.isInitialized = false;
    this.observers = new Map();
    this.duration = 60;
    this.isLowPower = this.detectLowPower();
  }

  detectLowPower() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNetwork = conn && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
    const weakCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return slowNetwork || weakCpu || reducedMotion;
  }

  initLazy() {
    if (this.isInitialized) return;
    const track = document.getElementById('ticker-track');
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isInitialized) this.init();
        });
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    observer.observe(track);
    this.observers.set('main', observer);
  }

  init() {
    if (this.isInitialized) return;

    const track = document.getElementById('ticker-track');
    const segment = document.getElementById('ticker-segment');
    if (!track || !segment) {
      console.warn('TickerModule: элементы основного тикера не найдены');
      return;
    }

    this.disableOtherTickerScripts();
    this.setupInfiniteLoop(track, segment);
    this.setupMainTickerAnimation(track);
    this.setupFeaturesTickersAnimation();
    this.setupPerformanceOptimizations(track);

    this.isInitialized = true;
  }

  disableOtherTickerScripts() {
    ['unified-ticker.js', 'ticker-speed.js', 'ticker-normalize-heights.js'].forEach((name) => {
      document.querySelectorAll(`script[src*="${name}"]`).forEach((el) => el.remove());
    });
  }

  setupInfiniteLoop(track, segment) {
    const original = Array.from(segment.children).map((el) => el.cloneNode(true));

    segment.innerHTML = '';
    original.forEach((el) => segment.appendChild(el.cloneNode(true)));

    const parent = track.parentElement;
    if (parent) {
      const style = getComputedStyle(segment);
      const gap = parseFloat(style.gap || style.columnGap || '0') || 0;
      let guard = 0;
      while (segment.getBoundingClientRect().width < parent.getBoundingClientRect().width + gap + 1 && guard < 30) {
        original.forEach((el) => segment.appendChild(el.cloneNode(true)));
        guard += 1;
      }
    }

    Array.from(track.querySelectorAll('.ticker-segment')).forEach((el, idx) => {
      if (idx > 0) el.remove();
    });

    track.appendChild(segment.cloneNode(true));
  }

  setupMainTickerAnimation(track) {
    const effectiveDuration = this.isLowPower ? this.duration * 1.5 : this.duration;
    document.documentElement.style.setProperty('--ticker-duration', `${effectiveDuration}s`);
    track.style.setProperty('--ticker-duration', `${effectiveDuration}s`);
    track.style.animation = `tickerScroll ${effectiveDuration}s linear infinite`;
    track.style.animationPlayState = 'running';
  }

  setupFeaturesTickersAnimation() {
    // Для инфо-линий в секции "Контрактное литьё" делаем скорость ближе к hero-такеру
    // и гарантируем, что не будет "пустого" участка после последнего пункта.
    const baseDuration = this.isLowPower ? this.duration : this.duration * 0.5; // в 2 раза быстрее, чем main ticker

    document.querySelectorAll('.features-ticker-track').forEach((track) => {
      // Однократно дублируем содержимое сегмента, чтобы линия не обрывалась
      const segment = track.querySelector('.features-ticker-segment');
      if (segment && !track.dataset.tickerCloned) {
        const html = segment.innerHTML;
        segment.insertAdjacentHTML('beforeend', html);
        track.dataset.tickerCloned = '1';
      }

      const reverse = track.closest('.features-ticker-mobile-second');
      const animationName = reverse ? 'featuresTickerScrollReverse' : 'featuresTickerScroll';
      track.style.animation = `${animationName} ${baseDuration}s linear infinite`;
      track.style.animationPlayState = 'running';
    });
  }

  setupPerformanceOptimizations(track) {
    track.style.transform = 'translateZ(0)';
    track.style.backfaceVisibility = 'hidden';
    track.style.perspective = '1000px';
    track.style.willChange = 'transform';
    this.setupImageOptimizations(track);
  }

  setupImageOptimizations(track) {
    track.querySelectorAll('img').forEach((img) => {
      if ('loading' in img) img.loading = 'lazy';
      img.addEventListener(
        'error',
        () => {
          const badge = img.closest('.logo-badge');
          if (badge) badge.classList.add('logo-missing');
        },
        { once: true }
      );
    });
  }

  pause() {
    const mainTrack = document.getElementById('ticker-track');
    if (mainTrack) mainTrack.style.animationPlayState = 'paused';
    document.querySelectorAll('.features-ticker-track').forEach((track) => {
      track.style.animationPlayState = 'paused';
    });
  }

  resume() {
    const mainTrack = document.getElementById('ticker-track');
    if (mainTrack) mainTrack.style.animationPlayState = 'running';
    document.querySelectorAll('.features-ticker-track').forEach((track) => {
      track.style.animationPlayState = 'running';
    });
  }

  setSpeed(duration) {
    this.duration = duration;

    const mainTrack = document.getElementById('ticker-track');
    if (mainTrack) this.setupMainTickerAnimation(mainTrack);
    this.setupFeaturesTickersAnimation();
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.isInitialized = false;
  }
}

window.TickerModule = new TickerModule();

document.addEventListener('DOMContentLoaded', () => {
  window.TickerModule.initLazy();
});

if (document.readyState !== 'loading') {
  window.TickerModule.initLazy();
}
