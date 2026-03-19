/**
 * Collection DOM — Phase 8. C-S1-01, C-S1-02.
 * Carousel container + stats. Swiper instance created via port, not here.
 */
export interface CollectionElements {
  sectionRoot: HTMLElement;
  carouselRoot: HTMLElement;
  swiperSelector: string;
  statsContainer: HTMLElement;
  statElements: HTMLElement[];
}

const SLIDE_LABELS = [
  'Arte',
  'Arte-Dea',
  'Dali-Dea',
  'Dali-Soft',
  'Deco',
  'Jardi',
  'LATINA',
  'Lilia',
  'Orchidea',
  'Ritual',
  'Terra',
];
const STAT_IDS = ['models', 'years', 'clients'] as const;
const STAT_DEFAULTS: Record<(typeof STAT_IDS)[number], number> = {
  models: 11,
  years: 15,
  clients: 120,
};

export function createCollectionDOM(section1: HTMLElement): CollectionElements {
  section1.innerHTML = '';
  section1.id = 'section-1';
  section1.className = 'swiper-slide section-content theme-light';
  section1.setAttribute('aria-labelledby', 'section-1-title');
  const title = document.createElement('h2');
  title.id = 'section-1-title';
  title.className = 'sr-only';
  title.textContent = 'Коллекция';
  section1.appendChild(title);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'content-wrapper';

  const carouselRoot = document.createElement('div');
  carouselRoot.id = 'section1-carousel-root';
  carouselRoot.className = 'section1-carousel-root';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'mySwiper collection-swiper';
  swiperEl.setAttribute('aria-label', 'Карусель коллекции');

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';
  for (let i = 0; i < SLIDE_LABELS.length; i++) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    const label = document.createElement('span');
    label.className = 'collection-slide-label';
    label.textContent = SLIDE_LABELS[i] ?? '';
    slide.appendChild(label);
    wrapper.appendChild(slide);
  }
  swiperEl.appendChild(wrapper);

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';
  swiperEl.appendChild(pagination);
  carouselRoot.appendChild(swiperEl);
  contentWrapper.appendChild(carouselRoot);
  section1.appendChild(contentWrapper);

  const statsContainer = document.createElement('div');
  statsContainer.className = 'section1-stats';
  statsContainer.setAttribute('aria-live', 'polite');
  const statElements: HTMLElement[] = [];
  for (const id of STAT_IDS) {
    const stat = document.createElement('div');
    stat.className = 'stat';
    stat.setAttribute('data-target', String(STAT_DEFAULTS[id]));
    const lbl = document.createElement('div');
    lbl.className = 'stat-label';
    if (id === 'models') {
      lbl.innerHTML = '<span>ПАЛИТРА</span><span>ЦВЕТОВ</span>';
    } else if (id === 'years') {
      lbl.innerHTML = '<span>ЛЕТ НА</span><span>РЫНКЕ</span>';
    } else {
      lbl.innerHTML = '<span>КЛИЕНТОВ</span><span>РФ И СНГ</span>';
    }
    stat.appendChild(lbl);
    const num = document.createElement('span');
    num.className = 'stat-number';
    num.setAttribute('data-target', String(STAT_DEFAULTS[id]));
    num.textContent = '0';
    stat.appendChild(num);
    statsContainer.appendChild(stat);
    statElements.push(num);
  }
  section1.appendChild(statsContainer);

  return {
    sectionRoot: section1,
    carouselRoot,
    swiperSelector: '#section1-carousel-root .mySwiper',
    statsContainer,
    statElements,
  };
}

export function getStatTargets(): Record<string, number> {
  return { ...STAT_DEFAULTS };
}
