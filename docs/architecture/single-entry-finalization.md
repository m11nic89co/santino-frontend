# Single App Entry Finalization (MP-12)

## Цель

Перейти к одному app entry в `index.html` без регрессий поведения.

## Выполнено

1. В `index.html` оставлен один app script:
   - `assets/js/main.js` (`type="module"`)
2. Удалены прямые app script-теги legacy-контура из `index.html`:
   - `core/app.js`
   - `swiper-init.js`
   - `section1-carousel.js`
   - `section1-stats.js`
   - `section1-stats-size.js`
   - `ticker-unified-module.js`
3. Добавлен runtime loader:
   - `assets/js/runtime/legacy-chain-loader.js`
   - загружает legacy-файлы последовательно и детерминированно.
4. Добавлен late-event compatibility layer в loader:
   - корректно обрабатывает legacy `addEventListener('DOMContentLoaded'|'load', ...)` даже при поздней загрузке.

## Проверка

- `npm run lint` — green
- `npm run format:check` — green
- `npm run test:smoke` — 2 passed

## Ограничения

- Legacy-монолиты не декомпозированы; single-entry достигнут через controlled runtime loader.
- Это целевой промежуточный шаг перед полной ESM-декомпозицией legacy-контура.
