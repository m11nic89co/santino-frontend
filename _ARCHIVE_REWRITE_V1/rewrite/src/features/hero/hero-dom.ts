/**
 * Hero DOM — Phase 7 + Visual restore. C-HERO-01.
 * Structure 1:1 with legacy: hero-bg, machine SVG, text container (backdrop blur), CTA, scroll indicator.
 */
export interface HeroElements {
  container: HTMLElement;
  title: HTMLElement;
  titleMain: HTMLElement;
  titleRest: HTMLElement;
  desc: HTMLElement;
  cta: HTMLAnchorElement;
}

const MACHINE_IMG = '/assets/img/thermoplast-machine-minimal.svg';

export function createHeroDOM(): HeroElements {
  const container = document.createElement('div');
  container.className = 'hero-inner';

  const heroBg = document.createElement('div');
  heroBg.className = 'hero-bg';
  heroBg.setAttribute('aria-hidden', 'true');
  container.appendChild(heroBg);

  const heroMachineBg = document.createElement('div');
  heroMachineBg.className = 'hero-machine-bg';
  heroMachineBg.setAttribute('aria-hidden', 'true');
  const machineImg = document.createElement('img');
  machineImg.src = MACHINE_IMG;
  machineImg.alt = 'Термопластавтомат';
  machineImg.className = 'machine-svg';
  machineImg.loading = 'lazy';
  heroMachineBg.appendChild(machineImg);
  container.appendChild(heroMachineBg);

  const heroCore = document.createElement('div');
  heroCore.className = 'hero-core';
  const heroParallax = document.createElement('div');
  heroParallax.className = 'hero-parallax';
  const textContainer = document.createElement('div');
  textContainer.className = 'hero-text-container';

  const title = document.createElement('h1');
  title.className = 'hero-title';
  const titleMain = document.createElement('span');
  titleMain.className = 'hero-title-main';
  titleMain.textContent = 'Завод';
  const titleRest = document.createElement('span');
  titleRest.className = 'hero-title-rest';
  titleRest.textContent = 'премиальных пластиковых изделий';
  title.appendChild(titleMain);
  title.appendChild(titleRest);

  const desc = document.createElement('div');
  desc.className = 'hero-desc';
  desc.textContent =
    'Современный дизайн. Высокое качество. Производство и доставка по РФ и СНГ.';

  textContainer.appendChild(title);
  textContainer.appendChild(desc);
  heroParallax.appendChild(textContainer);

  const btnContainer = document.createElement('div');
  btnContainer.className = 'hero-btn-container';
  const cta = document.createElement('a');
  cta.href = '#contact';
  cta.className = 'btn ghost hero-cta';
  cta.textContent = 'Получить прайс-лист';
  cta.setAttribute('aria-label', 'Перейти к контактам для получения прайс-листа');
  btnContainer.appendChild(cta);
  heroParallax.appendChild(btnContainer);

  heroCore.appendChild(heroParallax);
  container.appendChild(heroCore);

  const heroSubtle = document.createElement('div');
  heroSubtle.className = 'hero-subtle';
  heroSubtle.innerHTML = 'нам доверяют с&nbsp;2014&nbsp;года';
  container.appendChild(heroSubtle);

  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.setAttribute('aria-label', 'Прокрутите вниз');
  const scrollArrow = document.createElement('div');
  scrollArrow.className = 'scroll-arrow';
  scrollArrow.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  scrollIndicator.appendChild(scrollArrow);
  container.appendChild(scrollIndicator);

  return {
    container,
    title,
    titleMain,
    titleRest,
    desc,
    cta,
  };
}
