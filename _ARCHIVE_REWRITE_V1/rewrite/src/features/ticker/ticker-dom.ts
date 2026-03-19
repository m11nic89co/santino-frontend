/**
 * Ticker DOM — Phase 9 + Visual restore. C-TICK-01.
 * Logo badges with images; paths under /assets/ (public).
 */
export interface TickerElements {
  wrap: HTMLElement;
  track: HTMLElement;
}

const TICKER_ITEMS: Array<{ label: string; src: string; alt: string }> = [
  { label: 'Магнит', src: '/assets/logos/MagnitProLogo.png', alt: 'Магнит' },
  { label: 'Ozon', src: '/assets/logos/OzonLogo.png', alt: 'Ozon' },
  { label: 'Wildberries', src: '/assets/logos/WbLogo.png', alt: 'Wildberries' },
  { label: 'Яндекс', src: '/assets/logos/YandexLogo.png', alt: 'Яндекс' },
  { label: 'ВсеИнструменты', src: '/assets/logos/VseInstrumentyLogo.png', alt: 'ВсеИнструменты' },
  { label: 'Ашан', src: '/assets/logos/AuchanProLogo.png', alt: 'Ашан' },
  { label: 'Бауцентр', src: '/assets/logos/BauLogo.png', alt: 'Бауцентр' },
  { label: 'Лемана ПРО', src: '/assets/logos/LemanaProLogo.png', alt: 'Лемана ПРО' },
  { label: 'Летто', src: '/assets/img/source/info_line/LettoLogo.png', alt: 'Летто' },
  { label: 'МегаМаркет', src: '/assets/img/source/info_line/MegaMarketLogo.png', alt: 'МегаМаркет' },
  { label: 'Порядок', src: '/assets/img/source/info_line/PoreadokLogo.png', alt: 'Порядок' },
  { label: 'Садовод', src: '/assets/img/source/info_line/SadovodLogo.png', alt: 'Садовод' },
  { label: 'САТОМ', src: '/assets/img/source/info_line/SatomLogo.png', alt: 'САТОМ' },
  { label: 'ШЕН', src: '/assets/img/source/info_line/ShenLogo.png', alt: 'ШЕН' },
  { label: 'Сима-ленд', src: '/assets/img/source/info_line/SimaLandLogo.png', alt: 'Сима-ленд' },
];

function createSegment(): HTMLDivElement {
  const segment = document.createElement('div');
  segment.className = 'ticker-segment';
  for (const item of TICKER_ITEMS) {
    const tickerItem = document.createElement('span');
    tickerItem.className = 'ticker-item';
    const badge = document.createElement('span');
    badge.className = 'logo-badge';
    const img = document.createElement('img');
    img.className = 'logo-img';
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'badge-label';
    labelSpan.textContent = item.label;
    badge.appendChild(img);
    badge.appendChild(labelSpan);
    tickerItem.appendChild(badge);
    segment.appendChild(tickerItem);
  }
  return segment;
}

export function createTickerDOM(): TickerElements {
  const wrap = document.createElement('div');
  wrap.className = 'ticker-wrap ticker-isolated';
  wrap.setAttribute('aria-hidden', 'true');

  const ticker = document.createElement('div');
  ticker.className = 'ticker';
  ticker.id = 'ticker';

  const track = document.createElement('div');
  track.id = 'ticker-track';
  track.className = 'ticker-track';
  track.setAttribute('role', 'marquee');
  track.setAttribute('aria-label', 'Бегущая строка');

  const segment = createSegment();
  segment.id = 'ticker-segment';
  track.appendChild(segment);
  track.appendChild(segment.cloneNode(true));
  ticker.appendChild(track);
  wrap.appendChild(ticker);

  return { wrap, track };
}
