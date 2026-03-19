# PROJECT AUDIT

Дата аудита: 2026-03-18  
Проект: SANTINO (frontend, static site)

## 1) Глобальная архитектура и стек

### Технологии и библиотеки
- HTML: `index.html` (единая страница со слайд-секциями).
- CSS: основной файл `assets/css/style.css` + слои/утилиты в `assets/css/**`.
- JS: ESM-entry `assets/js/main.js` + runtime bootstrap + legacy-цепочка скриптов.
- Слайдер: `swiper` (npm dependency `^12.0.2`) + локальный vendor-bundle.
- Анимации: `gsap` (npm dependency `^3.13.0`) + `ScrollTrigger` (vendor script подключён в HTML).
- Инструменты: Vite (`^5.4.11`), ESLint (`^10.x`), Prettier (`^3.8.1`), Playwright (`^1.58.2`).

### Высокоуровневая структура
- Корень:
  - `index.html`
  - `assets/` (прод-код фронтенда и ассеты)
  - `docs/` (архитектурные/прогресс-документы)
  - `tests/` (smoke)
  - `_ARCHIVE_REWRITE_V1/` (архив rewrite-ветки)
- JS:
  - `assets/js/main.js` — точка входа ESM runtime.
  - `assets/js/runtime/*` — bootstrap, context, bridge, legacy loader/checks.
  - `assets/js/modules/*` — анимации, карусели, бизнес-логика, утилиты.
  - `assets/js/modules/ui/carousel/swiper-init.js` и `section1-carousel.js` — legacy/defer контур.
- CSS:
  - Фактически основной и наиболее нагруженный файл: `assets/css/style.css`.
  - Дополнительно: `assets/css/main.css`, `assets/css/layers/runtime-overrides.css`, `assets/css/vendors/ticker.css`, и т.д.

## 2) Статус готовности секций (по `index.html`)

- [DONE] `section-0` — Hero (заголовок, CTA, бегущая строка логотипов, фоновые анимации/blueprints).
- [IN PROGRESS] `section-1` — Коллекция (Swiper coverflow + overlay-статистика + CTA).  
  Признаки активной итерации: частые правки адаптива статистики и слоёв фона.
- [DONE] `section-2` — Контрактное литьё (контент, анимационные элементы, тикеры).
- [TODO/EMPTY] `section-3` — Контакты (внутри `content-wrapper` пометка «текст удалён по запросу»).
- [DONE] `section-4` — О нас (большой текстовый блок/credits track).

## 3) Техдолг и остатки экспериментов

### 3.1 Остатки от 3D-menu эксперимента
- Файл `assets/js/modules/ui/animations/menu-text-3d.js` оставлен как no-op:
  - `export function initMenuText3d() {}`
- В `assets/js/main.js` модуль больше не импортируется — runtime не ломается, но файл является архивным хвостом.
- Рекомендация: удалить файл или переместить в архив/`deprecated/`, чтобы не вводить в заблуждение.

### 3.2 CSS-остатки/перекрытия по section-1
- Обнаружен блок `#section-1::after` с фоновыми `repeating-linear-gradient` (остаточный визуальный оверлей).
- Одновременно внизу есть «FINAL GUARD», который гасит overlays через:
  - `#section-1.section-content::before`,
  - `.main-swiper > .swiper-wrapper > #section-1.swiper-slide::before/::after`.
- Это создаёт конфликтующие намерения (оверлей создаётся и затем частично/условно гасится).
- Рекомендация: оставить один источник истины:
  - либо полностью убрать `#section-1::after`,
  - либо убрать guard-подавление и описать корректный слой явно.

### 3.3 CSS-дубли и каскадные конфликты (mobile stats)
- Для `#section-1 .section1-stats` есть несколько блоков `@media (max-width: 900px)` с разными стратегиями:
  - nowrap + проценты,
  - абсолютное позиционирование,
  - отдельные typography overrides.
- Итог: поведение зависит от порядка правил и трудно предсказуемо при дальнейших изменениях.
- Рекомендация: свести mobile-логику статистики в один блок и удалить дубль.

### 3.4 Артефакты проекта
- В репозитории присутствуют backup-файлы стилей:
  - `assets/css/style.css.backup`
  - `assets/css/style.css.backup-20251020-103848`
  - `assets/css/style.css.backup-20251020-115448`
- Это увеличивает шум и риск «редактирования не того файла».
- Рекомендация: перенести в архивную папку или удалить из рабочей ветки.

## 4) Производительность и best practices

### Что уже сделано хорошо
- В blueprints-фоне используется `gsap.quickTo` для parallax-осей (лучше, чем частые `gsap.to` в raw-loop).
- Для coverflow уже отключены slide-shadows (`slideShadows: false`) в `section1-carousel.js`.
- Декуплинг через runtime bootstrap + modules уже есть, это хороший фундамент.

### Потенциальные узкие места
- Legacy `swiper-init.js` (minified, большой монолит) содержит много слушателей и логики в одном месте:
  - множественные `setTimeout`, `requestAnimationFrame`, обработчики resize/hashchange/visibility.
  - сложнее профилировать и безопасно менять локально.
- Непрерывные анимационные циклы/таймеры:
  - `requestAnimationFrame` в `uii-carousel.js`,
  - периодические таймеры в lightning/ticker/health-check.
- Глобальные селекторы и перегруженный `style.css` (много каскадных переопределений по одной зоне) увеличивают стоимость поддержки и риск регрессий.

### Практические рекомендации (приоритет)
1. **Стабилизировать section-1 CSS**
   - Удалить остаточный `#section-1::after` или окончательно зафиксировать его использование.
   - Сконсолидировать mobile-правила `section1-stats` в единый блок.
2. **Вычистить мёртвые артефакты**
   - Удалить/архивировать `menu-text-3d.js` (no-op),
   - убрать `.backup` файлы из рабочей области.
3. **Постепенно декомпозировать legacy carousel init**
   - Разнести `swiper-init.js` на модули, чтобы снизить связность.
4. **Добавить регулярный smoke-профиль**
   - Проверять FPS/long tasks на `section-1` и `section-0` после каждого визуального эксперимента.

## 5) Краткое резюме для roadmap

- База проекта рабочая: core-секции 0/1/2/4 существуют и функциональны.
- Ключевая зона риска — `section-1` (накопленные CSS-итерации и конфликтные слои).
- Перед следующими крупными задачами целесообразен короткий cleanup-спринт (1-2 итерации):
  - удалить остатки экспериментов,
  - упростить и стабилизировать каскад в `style.css`,
  - зафиксировать единый адаптивный контракт для `section1-stats`.
