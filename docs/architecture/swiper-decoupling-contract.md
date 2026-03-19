# Swiper Decoupling Contract (MP-06)

## Цель

Снизить связность модулей с `window.swiper` и перейти на event/state контракт runtime-слоя.

## Реализация

Добавлен bridge:

- `assets/js/runtime/swiper-bridge.js`

Bridge синхронизирует active section через:

1. событие `swiperSlideChange` (dispatch из `swiper-init.js`),
2. `document.body.dataset.activeSection` (fallback через `MutationObserver`).

Результат bridge:

- `context.setState('activeSection', index)`
- `context.emit('runtime:section-change', { activeIndex: index })`

## Гарантии

- Runtime-модули (ESM-слой) больше не должны читать `window.swiper` напрямую.
- Legacy-контур (`core/app.js`, `swiper-init.js`) временно сохраняет прямые зависимости до отдельной декомпозиции.

## Текущее состояние

Прямое чтение `window.swiper` осталось только в:

- `assets/js/modules/core/app.js` (legacy)
- `assets/js/modules/ui/carousel/swiper-init.js` (legacy)

Новый runtime-код (`assets/js/runtime/*`, `assets/js/main.js`) не использует `window.swiper` как источник состояния.
