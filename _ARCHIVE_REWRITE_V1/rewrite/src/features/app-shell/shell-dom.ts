/**
 * App Shell DOM structure — Phase 6.
 * C-APP-01 (loader, main), C-A11Y-01 (skip link, main landmark). No window.*
 */
import { SECTION_COUNT, SECTION_TITLES, type SectionIndex } from './constants.js';

export interface ShellElements {
  root: HTMLDivElement;
  loader: HTMLDivElement;
  skipLink: HTMLAnchorElement;
  main: HTMLElement;
  header: HTMLElement;
  nav: HTMLElement;
  navLinks: HTMLAnchorElement[];
  mobileMenuButton: HTMLButtonElement;
  mobileNav: HTMLElement;
  mobileNavLinks: HTMLAnchorElement[];
  sections: HTMLElement[];
}

function makeSection(id: string, index: SectionIndex): HTMLElement {
  const section = document.createElement('section');
  section.id = id;
  section.className = `section-${index}`;
  section.setAttribute('aria-labelledby', `section-title-${index}`);
  const title = document.createElement('h2');
  title.id = `section-title-${index}`;
  title.className = 'sr-only';
  title.textContent = SECTION_TITLES[index];
  section.appendChild(title);
  const placeholder = document.createElement('p');
  placeholder.className = 'section-placeholder';
  placeholder.textContent = `Секция ${index + 1}`;
  section.appendChild(placeholder);
  return section;
}

export function createShellDOM(): ShellElements {
  const root = document.createElement('div');
  root.className = 'app-shell';

  const loader = document.createElement('div');
  loader.id = 'loader-bg';
  loader.className = 'loader-bg';
  loader.setAttribute('aria-hidden', 'true');
  const loaderContent = document.createElement('div');
  loaderContent.className = 'loader-content';
  const loaderLogo = document.createElement('span');
  loaderLogo.className = 'loader-logo';
  loaderLogo.setAttribute('aria-label', 'Santino');
  const logoImg = document.createElement('img');
  logoImg.src = '/assets/img/santino_magneto_outlined.svg';
  logoImg.alt = 'Santino logo';
  logoImg.loading = 'eager';
  loaderLogo.appendChild(logoImg);
  const loaderBarWrap = document.createElement('div');
  loaderBarWrap.className = 'loader-bar-wrap';
  const loaderBar = document.createElement('div');
  loaderBar.className = 'loader-bar';
  loaderBar.id = 'loader-bar';
  loaderBarWrap.appendChild(loaderBar);
  loaderContent.appendChild(loaderLogo);
  loaderContent.appendChild(loaderBarWrap);
  loader.appendChild(loaderContent);
  root.appendChild(loader);

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Перейти к основному содержимому';
  root.appendChild(skipLink);

  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');

  const header = document.createElement('header');
  header.className = 'app-header';
  header.setAttribute('role', 'banner');

  const headerLeft = document.createElement('div');
  headerLeft.className = 'header-left';
  const headerRight = document.createElement('div');
  headerRight.className = 'header-right';

  const nav = document.createElement('nav');
  nav.className = 'main-nav main-nav-left';
  nav.setAttribute('aria-label', 'Основная навигация слева');
  const navRight = document.createElement('nav');
  navRight.className = 'main-nav main-nav-right';
  navRight.setAttribute('aria-label', 'Основная навигация справа');
  const navLinks: HTMLAnchorElement[] = [];
  for (let i = 1; i < SECTION_COUNT; i++) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'nav-link';
    a.dataset['index'] = String(i);
    a.textContent = SECTION_TITLES[i as SectionIndex];
    a.setAttribute('aria-controls', `section-${i}`);
    if (i <= 2) nav.appendChild(a);
    else navRight.appendChild(a);
    navLinks.push(a);
  }
  headerLeft.appendChild(nav);
  headerRight.appendChild(navRight);

  const logoLink = document.createElement('a');
  logoLink.href = '#';
  logoLink.className = 'logo logo-link';
  logoLink.id = 'main-logo';
  logoLink.dataset['index'] = '0';
  logoLink.setAttribute('aria-label', 'На главную');
  logoLink.setAttribute('aria-controls', 'section-0');
  const logo = document.createElement('img');
  logo.src = '/assets/img/santino_magneto_outlined.svg';
  logo.alt = 'Santino logo';
  logo.loading = 'eager';
  logoLink.appendChild(logo);
  navLinks.push(logoLink);

  header.appendChild(headerLeft);
  header.appendChild(logoLink);
  header.appendChild(headerRight);

  const mobileMenuButton = document.createElement('button');
  mobileMenuButton.type = 'button';
  mobileMenuButton.className = 'hamburger-menu';
  mobileMenuButton.id = 'hamburger-menu';
  mobileMenuButton.setAttribute('aria-label', 'Открыть меню');
  mobileMenuButton.setAttribute('aria-expanded', 'false');
  mobileMenuButton.setAttribute('aria-controls', 'mobile-nav');
  mobileMenuButton.innerHTML =
    '<span class="hamburger-lines"><span></span><span></span><span></span><span></span></span><span class="hamburger-label" aria-hidden="true">меню</span>';
  header.appendChild(mobileMenuButton);

  main.appendChild(header);

  const mobileNav = document.createElement('nav');
  mobileNav.id = 'mobile-nav';
  mobileNav.className = 'mobile-nav';
  mobileNav.setAttribute('aria-label', 'Мобильное меню');
  mobileNav.setAttribute('aria-hidden', 'true');
  const mobileNavLinks: HTMLAnchorElement[] = [];
  for (let i = 1; i < SECTION_COUNT; i++) {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'nav-link';
    a.dataset['index'] = String(i);
    a.textContent = SECTION_TITLES[i as SectionIndex];
    mobileNav.appendChild(a);
    mobileNavLinks.push(a);
  }
  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.className = 'nav-link';
  homeLink.dataset['index'] = '0';
  homeLink.textContent = SECTION_TITLES[0];
  mobileNav.prepend(homeLink);
  mobileNavLinks.push(homeLink);
  main.appendChild(mobileNav);

  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'sections-container';
  const sections: HTMLElement[] = [];
  for (let i = 0; i < SECTION_COUNT; i++) {
    const section = makeSection(`section-${i}`, i as SectionIndex);
    if (i === 0) {
      section.className = 'swiper-slide hero-section fullscreen hero-scale-95';
      section.setAttribute('data-title', 'Главная');
    } else if (i === 1) {
      section.className = 'swiper-slide section-content theme-light';
      section.setAttribute('data-title', 'НАША КОЛЛЕКЦИЯ');
    } else {
      section.className = 'swiper-slide section-content';
    }
    sections.push(section);
    sectionsContainer.appendChild(section);
  }
  main.appendChild(sectionsContainer);

  root.appendChild(main);

  return {
    root,
    loader,
    skipLink,
    main,
    header,
    nav,
    navLinks,
    mobileMenuButton,
    mobileNav,
    mobileNavLinks,
    sections,
  };
}
