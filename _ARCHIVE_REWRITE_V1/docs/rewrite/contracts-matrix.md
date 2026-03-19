# Contract Matrix (Behavioral Specification v2)

Версия: **contracts-v1**  
Источник: legacy как Read-Only Behavioral Specification.  
Legacy-код расположен в корне репозитория: `assets/js/`, `index.html`, `assets/css/` (не в `src/`).

---

## 1. Реестр контрактов (уникальные ID)

| ID | Название | Приоритет | Владелец среза |
|----|----------|-----------|----------------|
| C-APP-01 | Loader & First Paint | P0 | App Shell |
| C-APP-02 | Active Section State | P0 | Runtime / Navigation |
| C-NAV-01 | Desktop & Mobile Navigation | P0 | App Shell / Navigation |
| C-NAV-02 | Section Subtitle & Number Indicator | P1 | App Shell |
| C-HERO-01 | Hero Visible & CTA | P0 | Hero |
| C-HERO-02 | Hero Button Cycle (start/stop) | P1 | Hero |
| C-HERO-03 | Paparazzi Flash (motion) | P2 | Hero |
| C-S1-01 | Collection Carousel Rendered | P0 | Collection |
| C-S1-02 | Collection Stats (flip digits) | P0 | Collection / Stats |
| C-S1-03 | Collection CTA Position | P1 | Collection |
| C-S2-01 | Contract Section Grid Overlay | P1 | Section 2 |
| C-TICK-01 | Main Ticker Animation | P0 | Ticker |
| C-TICK-02 | Features Tickers (incl. mobile second) | P1 | Ticker |
| C-A11Y-01 | Skip Link & Focus | P0 | NFR |
| C-A11Y-02 | Reduced Motion | P0 | NFR |
| C-A11Y-03 | Section/Swiper ARIA & Live Regions | P1 | NFR |
| C-PERF-01 | Main Swiper & Pagination Present | P0 | NFR |
| C-PERF-02 | No Critical Console Errors | P1 | NFR |

---

## 2. Входы / выходы / состояния / ошибки по контрактам

### C-APP-01 — Loader & First Paint

- **Входы:** Загрузка страницы (document load, legacy chain выполнен).
- **Выходы:** Элемент `#loader-bg` получает класс `hide`; контент main виден; body получает класс `fab-intro-done`.
- **Состояния:** До завершения — loader видим; после — loader скрыт, основной контент доступен.
- **Ошибки:** Если legacy chain не выполнился (например, ошибка в app.js), loader может не скрыться — блокировка взаимодействия.
- **Измеримость:** Наличие `#loader-bg.hide`, `.site-visible`, `body.fab-intro-done` в DOM после таймаута (~3–4 с).

---

### C-APP-02 — Active Section State

- **Входы:** Инициализация main Swiper; события slideChange; клик по nav/pagination.
- **Выходы:** `document.body.dataset.activeSection` = "0"|"1"|"2"|"3"|"4"; событие `swiperSlideChange` с `detail.activeIndex`; runtime state `activeSection` синхронизирован.
- **Состояния:** Целое 0..4 — индекс активной секции.
- **Ошибки:** Рассинхрон state и DOM — health-check предупреждение (E_ACTIVE_SECTION_STATE_MISSING).
- **Измеримость:** Чтение `document.body.dataset.activeSection` и runtime state после навигации.

---

### C-NAV-01 — Desktop & Mobile Navigation

- **Входы:** Клик по `.main-nav a[data-index]`, `.logo-link`, `.mobile-nav a`, `.swiper-pagination` bullet; клавиши Enter/Space на фокусе; открытие/закрытие hamburger.
- **Выходы:** Main Swiper переходит на слайд с индексом = data-index; активная ссылка с классом `active` и `aria-current="page"`; mobile menu открыт/закрыт (`#mobile-nav.is-open`, `#hamburger-menu.is-active`, `aria-expanded`).
- **Состояния:** activeSection; меню открыто/закрыто; scroll lock на body при открытом меню.
- **Ошибки:** Неверный индекс или отсутствие Swiper — переход не выполняется.
- **Измеримость:** После клика по ссылке с data-index="1" значение `body.dataset.activeSection === "1"`; видимость ожидаемой секции и активной ссылки.

---

### C-NAV-02 — Section Subtitle & Number Indicator

- **Входы:** Смена активной секции (slideChange).
- **Выходы:** `#section-subtitle` содержит текст заголовка секции (кроме hero); `#section-number` на mobile — "N/4" (например "1/4"); классы видимости добавлены по контракту.
- **Состояния:** Текст и число соответствуют activeSection.
- **Ошибки:** Отсутствие элемента — тихий сбой отображения.
- **Измеримость:** Проверка textContent и видимости при заданном activeSection.

---

### C-HERO-01 — Hero Visible & CTA

- **Входы:** Секция section-0 активна; loader скрыт.
- **Выходы:** Hero-секция видима; CTA-кнопка (например «Получить прайс-лист») доступна и кликабельна; ссылка на #contact.
- **Состояния:** Hero — активная секция; body может иметь классы grid-hero / fog-in по контракту legacy.
- **Ошибки:** Нет.
- **Измеримость:** Видимость `#section-0`, наличие и кликабельность .hero .btn или аналога.

---

### C-HERO-02 — Hero Button Cycle (start/stop)

- **Входы:** API `window.startBtnCycle` / `window.stopBtnCycle` (legacy); активная секция = 0 запускает цикл, смена секции — останавливает.
- **Выходы:** Текст кнопки в hero периодически меняется (набор текстов из контракта); при уходе с hero цикл останавливается.
- **Состояния:** Цикл включён/выключен в зависимости от активной секции.
- **Ошибки:** Отсутствие API — health-check E_BTN_CYCLE_API_MISSING.
- **Измеримость:** Наличие глобального API; опционально — смена текста кнопки при длительном нахождении на hero.

---

### C-HERO-03 — Paparazzi Flash (motion)

- **Входы:** Первый показ hero после загрузки; активная секция 0; не reduced-motion.
- **Выходы:** Элемент `#paparazzi-flash` кратковременно показывается с анимацией (серия вспышек); один раз за сессию.
- **Состояния:** Флаг «flash уже показан»; таймеры вспышек.
- **Ошибки:** При reduced-motion или is-low-power эффект не показывается.
- **Измеримость:** Наличие элемента и опционально класс/атрибут при срабатывании; в v2 — через motion policy.

---

### C-S1-01 — Collection Carousel Rendered

- **Входы:** DOM готов; наличие `#section-1 #section1-carousel-root`; загружена библиотека Swiper; legacy section1-carousel выполнен.
- **Выходы:** Внутри `#section1-carousel-root` появляется `.mySwiper` с обвязкой Swiper (coverflow); слайды с изображениями коллекции (Arte, Arte-Dea, Dali-Dea, …); пагинация; при необходимости `window.section1Carousel` — экземпляр.
- **Состояния:** Карусель инициализирована, слайды переключаются.
- **Ошибки:** Отсутствие Swiper или контейнера — карусель не создаётся (health-check E_SECTION1_ROOT_MISSING).
- **Измеримость:** Селектор `#section-1 #section1-carousel-root .mySwiper` видим после ~2–3 с.

---

### C-S1-02 — Collection Stats (flip digits)

- **Входы:** Секция #section-1 в viewport или активна; событие `swiperSlideChange` с activeIndex === 1; элементы `#section-1 .section1-stats .stat-number` с `data-target`.
- **Выходы:** Цифры в блоках .stat-number анимированно «перелистываются» от 0 до значения data-target (24, 18, 4); при уходе с секции анимация повторного счета останавливается; при возврате — обновление/повтор по контракту.
- **Состояния:** Счётчики показывают целевые значения; интервал обновления при активной секции 1.
- **Ошибки:** Нет swiperSlideChange или неверный detail — счётчики не запускаются.
- **Измеримость:** Видимость `#section-1 .section1-stats .stat-number`; числовое значение (включая sr-only) равно data-target после перехода в секцию.

---

### C-S1-03 — Collection CTA Position

- **Входы:** Наличие `.collection-cta` в #section-1; resize/orientationchange.
- **Выходы:** Кнопка «Вся коллекция» позиционируется fixed внизу экрана (значения bottom по breakpoint); ссылка на santino.market.
- **Состояния:** Позиция пересчитывается при изменении размера.
- **Ошибки:** Нет.
- **Измеримость:** Наличие и видимость кнопки; позиция в пределах ожидаемой области.

---

### C-S2-01 — Contract Section Grid Overlay

- **Входы:** Секция #section-2 в DOM; активная секция = 2.
- **Выходы:** Оверлей `.section2-grid-overlay` видим (opacity по контракту); при неактивной секции — скрыт.
- **Состояния:** Видимость оверлея привязана к классу swiper-slide-active на #section-2.
- **Ошибки:** Нет.
- **Измеримость:** При activeSection=2 оверлей видим; при других — скрыт.

---

### C-TICK-01 — Main Ticker Animation

- **Входы:** DOM с `#ticker-track`, `#ticker-segment`; TickerModule инициализирован (lazy по IntersectionObserver или DOMContentLoaded); не reduced-motion — иначе pause.
- **Выходы:** Бесконечная горизонтальная анимация ленты логотипов; CSS-переменная --ticker-duration; один владелец (window.TickerModule), без дублирования.
- **Состояния:** Инициализирован/не инициализирован; при reduced-motion — анимация на паузе.
- **Ошибки:** Отсутствие TickerModule — health-check E_TICKER_ENGINE_MISSING.
- **Измеримость:** Наличие window.TickerModule; анимация не «двойная»; при prefers-reduced-motion — тикер не крутится.

---

### C-TICK-02 — Features Tickers

- **Входы:** Элементы `.features-ticker-track`, в т.ч. внутри `.features-ticker-mobile-second`; тот же TickerModule.
- **Выходы:** Дополнительные тикеры анимированы (направление для mobile-second — обратное); единая длительность; при reduced-motion — пауза.
- **Состояния:** Аналогично C-TICK-01 для нескольких треков.
- **Ошибки:** Нет.
- **Измеримость:** Наличие нескольких треков с анимацией; один источник правды (TickerModule).

---

### C-A11Y-01 — Skip Link & Focus

- **Входы:** Фокус на skip-link; переход по ссылке.
- **Входы:** Элемент `.skip-link` с href="#main-content"; на mobile без принудительного скрытия до :focus-visible.
- **Выходы:** По фокусу skip-link виден; по активации фокус переносится в main (или якорь).
- **Ошибки:** Скрытие через display:none без focus-visible — нарушение a11y.
- **Измеримость:** Наличие .skip-link; видимость при :focus-visible; переход к #main-content.

---

### C-A11Y-02 — Reduced Motion

- **Входы:** `prefers-reduced-motion: reduce`.
- **Выходы:** На корень документа добавлен класс `reduced-motion`; тикер приостановлен (TickerModule.pause); hero/анимации без навязчивой motion по контракту (CSS и JS guards).
- **Состояния:** Режим reduced-motion включён глобально.
- **Ошибки:** Игнорирование настройки — нарушение a11y.
- **Измеримость:** При включённом prefers-reduced-motion: html.reduced-motion; тикер в паузе; ключевые анимации отключены.

---

### C-A11Y-03 — Section/Swiper ARIA & Live Regions

- **Входы:** Наличие main-swiper, пагинации, субтитров, номера секции.
- **Выходы:** main-swiper с aria-live="polite"; пагинация с доступными bullet (роль, aria-label); #section-subtitle и #section-number с aria-live="polite", aria-atomic="true"; hamburger с aria-expanded, aria-controls.
- **Ошибки:** Нет.
- **Измеримость:** Наличие атрибутов в DOM; корректные подписи для перехода по секциям.

---

### C-PERF-01 — Main Swiper & Pagination Present

- **Входы:** Загрузка страницы; vendor Swiper загружен; swiper-init выполнен.
- **Выходы:** Элемент `.main-swiper` присутствует и инициализирован; `.swiper-pagination` присутствует; window.swiper — экземпляр.
- **Ошибки:** Отсутствие — health-check E_MAIN_SWIPER_PAGINATION_MISSING; страница не переключается по секциям.
- **Измеримость:** Наличие .main-swiper, .swiper-pagination, window.swiper.

---

### C-PERF-02 — No Critical Console Errors

- **Входы:** Выполнение всего runtime (ESM + legacy chain).
- **Выходы:** В консоли нет необработанных исключений и критических ошибок, блокирующих сценарии; допускаются предупреждения health-check при сбое контракта.
- **Ошибки:** Ошибки скриптов — риск неработающего loader, навигации, карусели.
- **Измеримость:** Отсутствие console.error / uncaught exception в ключевых сценариях.

---

## 3. Карта «Legacy behavior → v2 contract»

| Legacy артефакт / поведение | Контракт(ы) v2 |
|-----------------------------|-----------------|
| `assets/js/modules/core/app.js`: loader, intro, hero CTA, startBtnCycle/stopBtnCycle, flash | C-APP-01, C-HERO-01, C-HERO-02, C-HERO-03 |
| `assets/js/modules/ui/carousel/swiper-init.js`: main Swiper, slideChange, body.dataset.activeSection, nav, mobile menu, subtitle/number | C-APP-02, C-NAV-01, C-NAV-02, C-PERF-01 |
| `assets/js/modules/ui/carousel/section1-carousel.js`: #section1-carousel-root, .mySwiper, coverflow | C-S1-01 |
| `assets/js/modules/business/stats/section1-stats.js`: swiperSlideChange, flip digits | C-S1-02 |
| `assets/js/modules/business/stats/section1-stats-size.js`: --stat-size, resize | C-S1-02 (layout) |
| `assets/js/modules/business/contracts/collection-cta-position.js`: .collection-cta fixed | C-S1-03 |
| `assets/js/modules/ui/interactions/section2-grid.js`: .section2-grid-overlay | C-S2-01 |
| `assets/js/modules/utils/ticker/ticker-unified-module.js`: main + features ticker, pause | C-TICK-01, C-TICK-02, C-A11Y-02 |
| `assets/js/runtime/reduced-motion-guard.js`, CSS prefers-reduced-motion | C-A11Y-02 |
| Skip-link в HTML/CSS | C-A11Y-01 |
| Пагинация, aria, live regions в HTML/swiper-init | C-A11Y-03, C-PERF-01 |
| Health-check (legacy-health-check.js) | C-PERF-01, C-PERF-02, косвенно другие |

---

## 4. NFR-контракты (сводка)

- **A11y:** C-A11Y-01 (skip-link, focus), C-A11Y-02 (reduced-motion), C-A11Y-03 (ARIA, live regions).
- **Motion:** C-A11Y-02; C-HERO-03 и прочие анимации — с условием отключения при reduced-motion.
- **Perf baseline:** C-PERF-01 (main swiper и пагинация присутствуют), C-PERF-02 (нет критических ошибок в консоли). Явные метрики (LCP, FID и т.д.) могут быть добавлены в следующих версиях спецификации.

---

## 5. Приоритеты для тестов и реализации

- **P0 (критический путь):** C-APP-01, C-APP-02, C-NAV-01, C-HERO-01, C-S1-01, C-S1-02, C-TICK-01, C-A11Y-01, C-A11Y-02, C-PERF-01.
- **P1:** C-NAV-02, C-HERO-02, C-S1-03, C-S2-01, C-TICK-02, C-A11Y-03, C-PERF-02.
- **P2:** C-HERO-03 и остальные декоративные/вспомогательные.

Версия спецификации: **contracts-v1**.
