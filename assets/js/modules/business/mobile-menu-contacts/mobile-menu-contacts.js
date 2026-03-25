export function initMobileMenuContacts(context) {
  const PHONE = '+79685452136';
  const EMAIL = 'office@santino.com.ru';
  const SUBJECT = 'Сообщение с сайта santino.com.ru';

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

  function schedule() {
    if (applyLinks()) return;
    const t1 = setTimeout(applyLinks, 150);
    const t2 = setTimeout(applyLinks, 600);
    const t3 = setTimeout(applyLinks, 1500);
    context.addCleanup(() => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    });
  }

  // Legacy chain creates the mobile menu DOM. We patch after it loads.
  context.on('legacyChainReady', schedule, { target: document });

  // Also try early (in case of cached/instant legacy load).
  schedule();
}

