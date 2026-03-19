# Глобальные переменные (window.\*)

Актуальное состояние runtime после MP-01 инвентаризации.

## Активные (подключены в `index.html`)

| Глобал                      | Producer                                                  | Consumer                                          | Статус          |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------------- | --------------- |
| `window.swiper`             | `assets/js/modules/ui/carousel/swiper-init.js`            | `assets/js/modules/core/app.js`                   | legacy-контракт |
| `window.startBtnCycle`      | `assets/js/modules/core/app.js`                           | `assets/js/modules/ui/carousel/swiper-init.js`    | legacy-контракт |
| `window.stopBtnCycle`       | `assets/js/modules/core/app.js`                           | `assets/js/modules/ui/carousel/swiper-init.js`    | legacy-контракт |
| `window.lampFlickerChange`  | `assets/js/modules/core/app.js`                           | нет жестких consumers                             | legacy          |
| `window.activateLightning`  | `assets/js/modules/ui/animations/lightning-effect.js`     | нет жестких consumers                             | transitional    |
| `window.boostBlueprintsNow` | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js` (self-use)        | legacy          |
| `window.recalcMenuMM`       | `assets/js/modules/ui/carousel/swiper-init.js`            | нет жестких consumers                             | legacy          |
| `window.__flashTimers`      | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`, `swiper-init.js` | internal        |
| `window.__flashActive`      | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`                   | internal        |
| `window.__flashHasPlayed`   | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`                   | internal        |
| `window.__flashLastAt`      | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`                   | internal        |
| `window.__flashSlideBound`  | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`                   | internal        |
| `window.__mm_resize_raf`    | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`                   | internal        |
| `window.__sectionBpTimer`   | `assets/js/modules/core/app.js`                           | `assets/js/modules/core/app.js`, `swiper-init.js` | internal        |
| `window.__section2Grid`     | `assets/js/modules/ui/interactions/section2-grid.js`      | нет жестких consumers                             | transitional    |
| `window.section1Carousel`   | `assets/js/modules/ui/carousel/section1-carousel.js`      | нет жестких consumers                             | legacy          |
| `window.TickerModule`       | `assets/js/modules/utils/ticker/ticker-unified-module.js` | runtime side-effect                               | legacy          |

## Внешние (vendor)

| Глобал                 | Source                                      |
| ---------------------- | ------------------------------------------- |
| `window.Swiper`        | `assets/vendor/swiper/swiper-bundle.min.js` |
| `window.gsap`          | `assets/vendor/gsap/gsap.min.js`            |
| `window.ScrollTrigger` | `assets/vendor/gsap/ScrollTrigger.min.js`   |

## Событийный контракт

- `swiperSlideChange`:
  - dispatch: `assets/js/modules/ui/carousel/swiper-init.js`
  - listen: `assets/js/modules/business/stats/section1-stats.js`

## Политика

- Новые `window.*` запрещены.
- Для новых модулей использовать только `init(context)` + event/service API.
