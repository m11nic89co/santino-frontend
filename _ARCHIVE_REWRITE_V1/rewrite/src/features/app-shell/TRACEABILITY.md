# App Shell — Traceability to Contract ID (Phase 6)

| Contract ID    | Реализация                                                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-APP-01       | `shell-dom.ts`: #loader-bg, .loader-bg.hide; app-shell-module: kernel:ready → loader.hide, main.site-visible, body.fab-intro-done                                                              |
| C-APP-02       | app-shell-module: body.dataset.activeSection при app:sectionChange и app:navRequest; единственный источник — состояние модуля + Event Bus                                                      |
| C-NAV-01       | navigation.ts: клик/Enter/Space по .nav-link[data-index] → app:navRequest; app-shell-module обрабатывает → app:sectionChange, .active, aria-current="page"; mobile menu is-open, aria-expanded |
| C-A11Y-01      | shell-dom.ts: .skip-link href="#main-content", main#main-content; navigation.ts: keydown Enter/Space на ссылках                                                                                |
| C-A11Y-03 (P1) | shell-dom: секции с aria-labelledby; nav aria-label; hamburger aria-expanded, aria-controls                                                                                                    |

Навигация управляется только через Kernel Event Bus и State Machine (app:navRequest → transition navigating → app:sectionChange → transition ready). Глобальные переменные и прямой window.location не используются.
