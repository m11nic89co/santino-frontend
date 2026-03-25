export function initMobileMenuContacts(context) {
  const PHONE = '+79685452136';
  const WA_PHONE = '+79533314229';
  const EMAIL = 'office@santino.com.ru';
  const SUBJECT = 'Сообщение с сайта santino.com.ru';

  let observer = null;
  let tapBound = false;

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

    const waDigits = WA_PHONE.replace(/[^0-9]/g, '');
    waLink.setAttribute('href', `https://wa.me/${waDigits}`);
    waLink.setAttribute('target', '_blank');
    waLink.setAttribute('rel', 'noopener');

    return true;
  }

  function bindTapToNavigate() {
    if (tapBound) return;
    tapBound = true;

    function closeMenuIfOpen() {
      const nav = document.querySelector('.mobile-nav');
      if (!nav || !nav.classList.contains('is-open')) return;
      const burger = document.getElementById('hamburger-menu');
      if (burger && typeof burger.click === 'function') burger.click();
    }

    function tapFx(link) {
      try {
        link.classList.add('is-tapped');
        setTimeout(() => link.classList.remove('is-tapped'), 220);
      } catch {}
    }

    document.addEventListener(
      'click',
      (e) => {
        const a = e.target && e.target.closest ? e.target.closest('.mobile-social .social-link') : null;
        if (!a) return;

        // Provide quick visual feedback and close menu first.
        tapFx(a);

        const isEmail = a.classList && a.classList.contains('social-email');
        const isPhone = a.classList && a.classList.contains('social-phone');
        const isWa = a.classList && a.classList.contains('social-wa');

        // Build targets from source-of-truth constants (do NOT trust DOM; it can be re-rendered).
        const subject = encodeURIComponent(SUBJECT);
        const waDigits = WA_PHONE.replace(/[^0-9]/g, '');
        const mailtoHref = `mailto:${EMAIL}?subject=${subject}`;
        const telHref = `tel:${PHONE}`;
        const waHref = `https://wa.me/${waDigits}`;

        if (isWa) {
          // WhatsApp: keep our "close -> open" chain reaction predictable.
          e.preventDefault();
          closeMenuIfOpen();
          a.setAttribute('href', waHref);
          window.open(waHref, '_blank', 'noopener');
          return;
        }

        if (isEmail) {
          // For mailto/tel it's best to let the browser handle navigation natively.
          // We only patch href + close menu on the next tick.
          a.setAttribute('href', mailtoHref);
          setTimeout(closeMenuIfOpen, 0);
          return;
        }

        if (isPhone) {
          a.setAttribute('href', telHref);
          setTimeout(closeMenuIfOpen, 0);
        }
      },
      { capture: true }
    );
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
    bindTapToNavigate();

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

