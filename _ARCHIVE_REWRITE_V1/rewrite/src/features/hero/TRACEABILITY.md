# Hero — Traceability & Motion Fallback (Phase 7)

## Contract ID

| ID        | Реализация                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| C-HERO-01 | hero-dom.ts: hero-section, title, CTA link href="#contact"; hero-module injects into #section-0. Видимость при activeSection === 0 (app-shell). |
| C-A11Y-02 | hero-module: getReducedMotion() → html.reduced-motion; hero-motion: reducedMotion ? duration 0. CSS: html.reduced-motion отключает transition.  |

## Motion policy

- Все анимации только через IAnimationPort (createGsapAdapter). Нет setTimeout/setInterval для анимаций.
- Состояние анимации не задаётся через inline-стили; только вызовы adapter.fromTo() / to() / from().

## Reduced-motion fallback

- При `prefers-reduced-motion: reduce`: на `document.documentElement` вешается класс `reduced-motion`; в runHeroIntro передаётся `reducedMotion: true` → duration 0 (мгновенное появление без motion).
- Функциональность Hero (видимость, CTA, навигация) сохраняется; деградирует только декоративная анимация.
