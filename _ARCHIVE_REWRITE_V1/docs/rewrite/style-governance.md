# Style Governance — SANTINO v2 Rewrite

Документ описывает правила визуального слоя и доступности (Phase 10).

## 1. CSS Layers

Порядок слоёв (каскад): `reset` < `base` < `tokens` < `components` < `utilities`.

- **reset** — box-sizing, минимальная нормализация.
- **base** — шрифт, цвет, фон документа; глобальные `:focus` / `:focus-visible`.
- **tokens** — дизайн-токены (`:root`): цвета, типографика, отступы, z-index, радиус, длительности.
- **components** — стили фич (App Shell, Hero, Collection, Ticker); каждый файл объявляет `@layer components { ... }`.
- **utilities** — утилитарные классы (например `.sr-only`). Использовать по минимуму.

Запрещено использовать `!important` для обхода каскада; при необходимости повышать специфичность или порядок в слоях.

## 2. Design Tokens

Токены определены в `rewrite/src/style.css` в `@layer tokens`.

- **Цвета:** `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-surface`, `--color-focus-ring`.
- **Типографика:** `--font-family-base`, `--font-size-*`, `--font-weight-*`, `--line-height-*`.
- **Отступы:** `--space-1` … `--space-12`.
- **Z-index:** `--z-skip`, `--z-loader`, `--z-mobile-nav`, `--z-header`, `--z-base`, `--z-below`.
- **Радиусы:** `--radius-sm`, `--radius-md`.
- **Длительности:** `--duration-motion`, `--duration-motion-slow`.
- **Фокус:** `--focus-outline-width`, `--focus-outline-offset`.

В стилях фич использовать только токены; хардкод цветов/отступов/z-index не допускается (кроме локальных констант вроде `--ticker-duration`).

## 3. A11y (Accessibility)

- **Фокус:** Все интерактивные элементы должны иметь видимый фокус при навигации с клавиатуры. Использовать `:focus-visible` (и при необходимости переопределять в компоненте), не полагаться на `:focus` для outline, чтобы не показывать ring при клике мышью.
- **Контраст:** Цвета текста и фона соответствуют WCAG AA (контраст не ниже 4.5:1 для обычного текста).
- **ARIA:** Навигация — `aria-label`, `aria-current="page"` для активного пункта, `aria-expanded` / `aria-controls` для мобильного меню. Секции — `aria-hidden`, `aria-labelledby`. Лоадер — `aria-hidden="true"`. Skip-link и `main` — семантика без дублирования ролей.
- **Иерархия:** Заголовки секций доступны для скринридеров (например, через `.sr-only`).

## 4. Reduced Motion

Предпочтение пользователя `prefers-reduced-motion: reduce` обрабатывается модулем Hero (установка класса `reduced-motion` на `html`). Компоненты Hero и Ticker в своих CSS реагируют на `html.reduced-motion` (отключение/пауза анимаций и переходов). Не вводить глобальное переопределение длительностей через `@media (prefers-reduced-motion: reduce)` без согласования, чтобы не конфликтовать с существующей логикой.

## 5. Запрещённые паттерны

- Inline-стили как основной способ управления состоянием UI.
- Прямые значения цветов/отступов/z-index в фичах вместо токенов.
- Удаление outline без замены на `:focus-visible`.
- Использование только `:focus` для кольца фокуса (нужен `:focus-visible` для клавиатуры).

Версия: Phase 10. Дата: 2025.
