# CSS Debt Program (MP-10)

## Базовая проблема

- Основной CSS: `assets/css/style.css` (legacy монолит).
- Высокая плотность `!important` в legacy-зонах.
- Runtime ранее имел inline/head-overrides c `!important` для hero/nav/mm.

## Что сделано в MP-10

1. Зафиксирован layer scaffold в `assets/css/main.css`:
   - `@layer base, components, layout, utilities`
   - imports из `base/components/layout/utilities`
2. Hero/Nav/MM runtime overrides вынесены в:
   - `assets/css/layers/runtime-overrides.css`
3. Убран `assets/css/head-overrides.css` (удален).
4. В `index.html` подключен `assets/css/layers/runtime-overrides.css`.

## Влияние

- Для зон hero/nav/header/mm overrides теперь без `!important` (локально снижает CSS debt в приоритетных зонах).
- Legacy `style.css` сохраняется как source-of-truth до поэтапной миграции.

## Следующий этап миграции CSS

- Переносить из `style.css` в слои по зонам:
  1. header/nav
  2. hero
  3. ticker
- После каждого шага прогонять smoke (`npm run test:smoke`) и visual check.
