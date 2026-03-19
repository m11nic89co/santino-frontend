/**
 * App Shell constants — Phase 6.
 * Traceability: C-APP-02, C-NAV-01.
 */

export const SECTION_COUNT = 5;
export type SectionIndex = 0 | 1 | 2 | 3 | 4;
export const SECTION_INDICES: readonly SectionIndex[] = [0, 1, 2, 3, 4];

export const SECTION_TITLES: Record<SectionIndex, string> = {
  0: 'Главная',
  1: 'Коллекция',
  2: 'Контракт',
  3: 'Контакты',
  4: 'О нас',
};
