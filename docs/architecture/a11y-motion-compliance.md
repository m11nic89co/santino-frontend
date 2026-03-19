# Accessibility & Motion Compliance (MP-11)

## Что исправлено

1. Восстановлен `skip-link` на mobile (`assets/css/style.css`):
   - удалено принудительное скрытие `display: none !important`.
   - сохранено безопасное позиционирование вне видимой области до `:focus-visible`.
2. Добавлен runtime guard:
   - `assets/js/runtime/reduced-motion-guard.js`
   - при `prefers-reduced-motion: reduce` выставляется `html.reduced-motion` и останавливается ticker (`window.TickerModule.pause()`).
3. Добавлены module-level guards для motion-heavy модулей:
   - `ui/animations/lightning-effect.js`
   - `ui/animations/pointer-crosshair.js`
   - `ui/animations/tilt-hover.js`
   - `ui/carousel/uii-carousel.js` (без постоянного rAF auto-rotate в reduced-motion)
4. Добавлен CSS guard в `assets/css/style.css` для ключевых animated зон:
   - `.scroll-indicator`
   - `.ticker-track`
   - `.features-ticker-track`
   - `.caliper-animation`
   - `.sparks-overlay`

## Цель результата

- UI сохраняет работоспособность без навязчивой анимации для пользователей с системной настройкой reduced motion.
- Skip-link снова доступен на узких экранах.
