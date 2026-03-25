export function initMobileMenuContacts(context) {
  const PHONE = '+79685452136';
  const EMAIL = 'office@santino.com.ru';
  const SUBJECT = 'Сообщение с сайта santino.com.ru';

  let observer = null;

  function applyLinks() {
    const root = document.querySelector('.mobile-nav');
    if (!root) return false;

    const phoneLink = root.querySelector('.mobile-social .social-phone');
    const emailLink = root.querySelector('.mobile-social .social-email');
    const waLink = root.querySelector('.mobile-social .social-wa');

    if (!phoneLink || !emailLink || !waLink) return false;

    phoneLink.setAttribute('href', `tel:${PHONE}`);

    const subject = encodeURIComponent(SUBJECT);
    emailLink.setAttribute('href', `mailto:${EMAIL}?subject=${subject}`);

    const waDigits = PHONE.replace(/[^0-9]/g, '');
    waLink.setAttribute('href', `https://wa.me/${waDigits}`);
    waLink.setAttribute('target', '_blank');
    waLink.setAttribute('rel', 'noopener');

    return true;
  }

  function ensureObserver() {
    if (observer) return;

    observer = new MutationObserver(() => {
      // Re-apply whenever menu DOM changes (it is rebuilt by legacy script on resize too).
      applyLinks();
    });

    const target = document.body || document.documentElement;
    if (target) observer.observe(target, { childList: true, subtree: true });

    context.addCleanup(() => {
      if (observer) observer.disconnect();
      observer = null;
    });
  }

  function schedule() {
    // Try immediately; if menu isn't ready yet, observer will catch it later.
    applyLinks();
    ensureObserver();

    // Also re-apply on viewport changes (legacy rebuilds menu on resize/orientationchange).
    const onResize = () => applyLinks();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    context.addCleanup(() => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    });
  }

  // Legacy chain creates the mobile menu DOM. We patch after it loads.
  context.on('legacyChainReady', schedule, { target: document });

  // Also try early (in case of cached/instant legacy load).
  schedule();
}

