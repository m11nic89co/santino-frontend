/**
 * Navigation — Phase 6. C-NAV-01, C-A11Y-01 (keyboard/focus).
 * All navigation flows through Kernel Event Bus; no globals, no window.location.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { ShellElements } from './shell-dom.js';
import { SECTION_COUNT, SECTION_INDICES, type SectionIndex } from './constants.js';

const VALID_INDICES = new Set(SECTION_INDICES);

function isValidIndex(n: number): n is SectionIndex {
  return Number.isInteger(n) && n >= 0 && n < SECTION_COUNT && VALID_INDICES.has(n as SectionIndex);
}

/** Binds nav UI to emit only app:navRequest. State updates happen in module handler. */
export function bindNavigation(el: ShellElements, bus: TypedEventBus): () => void {
  const allLinks = [...el.navLinks, ...el.mobileNavLinks];

  function requestNav(index: number): void {
    if (!isValidIndex(index)) return;
    bus.emit('app:navRequest', { targetIndex: index });
    closeMobileMenu();
  }

  function handleLinkClick(e: Event): void {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const raw = target.dataset['index'];
    if (raw === undefined) return;
    const index = Number.parseInt(raw, 10);
    if (!isValidIndex(index)) return;
    requestNav(index);
  }

  function handleLinkKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const raw = target.dataset['index'];
    if (raw === undefined) return;
    const index = Number.parseInt(raw, 10);
    if (!isValidIndex(index)) return;
    requestNav(index);
  }

  function openMobileMenu(): void {
    el.mobileNav.classList.add('is-open');
    el.mobileNav.setAttribute('aria-hidden', 'false');
    el.mobileMenuButton.classList.add('is-active');
    el.mobileMenuButton.setAttribute('aria-expanded', 'true');
    el.mobileMenuButton.setAttribute('aria-label', 'Закрыть меню');
    if (document.body) document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu(): void {
    el.mobileNav.classList.remove('is-open');
    el.mobileNav.setAttribute('aria-hidden', 'true');
    el.mobileMenuButton.classList.remove('is-active');
    el.mobileMenuButton.setAttribute('aria-expanded', 'false');
    el.mobileMenuButton.setAttribute('aria-label', 'Открыть меню');
    if (document.body) document.body.style.overflow = '';
  }

  function toggleMobileMenu(): void {
    const isOpen = el.mobileNav.classList.contains('is-open');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  }

  el.mobileMenuButton.addEventListener('click', toggleMobileMenu);
  el.mobileMenuButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMobileMenu();
    }
  });

  for (const link of allLinks) {
    link.addEventListener('click', handleLinkClick);
    link.addEventListener('keydown', handleLinkKeydown);
  }

  return () => {
    el.mobileMenuButton.removeEventListener('click', toggleMobileMenu);
    for (const link of allLinks) {
      link.removeEventListener('click', handleLinkClick);
      link.removeEventListener('keydown', handleLinkKeydown);
    }
  };
}

export function updateNavActiveState(el: ShellElements, activeIndex: number): void {
  const allLinks = [...el.navLinks, ...el.mobileNavLinks];
  for (const link of allLinks) {
    const idx = link.dataset['index'];
    const isActive = idx !== undefined && Number.parseInt(idx, 10) === activeIndex;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }
  for (let i = 0; i < el.sections.length; i++) {
    el.sections[i]?.setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
  }
}
