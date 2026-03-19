# Critical Legacy Contract (MP-05 + MP-12)

## Legacy-frozen контур

До отдельной декомпозиции считаются хрупкими и «замороженными»:

- `assets/js/modules/core/app.js`
- `assets/js/modules/ui/carousel/swiper-init.js`
- `assets/js/modules/ui/carousel/section1-carousel.js`
- `assets/js/modules/business/stats/section1-stats.js`
- `assets/js/modules/business/stats/section1-stats-size.js`
- `assets/js/modules/utils/ticker/ticker-unified-module.js`

## Контракт порядка

Single-entry runtime (`assets/js/main.js`) загружает legacy цепочку через
`assets/js/runtime/legacy-chain-loader.js` в порядке:

1. `core/app.js`
2. `swiper-init.js`
3. `section1-carousel.js`
4. `section1-stats.js`
5. `section1-stats-size.js`
6. `ticker-unified-module.js`

Vendor (Swiper/GSAP) должны быть загружены до `main.js`.

## Контракт совместимости

- `swiper-init.js` диспатчит событие `swiperSlideChange`.
- `core/app.js` должен предоставлять `window.startBtnCycle/window.stopBtnCycle`.
- `section1-stats.js` зависит от `swiperSlideChange`.
- Изменения в этих файлах разрешены только через отдельный ADR и с rollback-планом.

## Запрещено в рамках обычных задач

- Перевод `core/app.js` и `swiper-init.js` в ESM без safety-net сценария.
- Нарушение порядка legacy chain в `legacy-chain-loader.js`.
- Удаление глобалов-контрактов без адаптера.

## Runtime health-check

Для раннего обнаружения регрессий подключен:

- `assets/js/runtime/legacy-health-check.js`

Проверяет (warn-only):

- `runtime activeSection state`
- `window.startBtnCycle/window.stopBtnCycle`
- наличие `#section1-carousel-root`
- наличие `.main-swiper .swiper-pagination`
- наличие ticker owner (`window.TickerModule`)

## Smoke-критерии перед merge

1. Главная открывается, loader завершается.
2. Меню слева/справа и mobile-menu переключаются корректно.
3. Переход в секцию «Наша коллекция» показывает карусель и статистику.
4. Тикер анимируется, без удвоения скорости.
5. Консоль без критических ошибок.
