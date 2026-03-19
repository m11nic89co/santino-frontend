# Collection — Traceability (Phase 8)

| Contract ID  | Реализация                                                                                                                                                                                                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-S1-01      | collection-dom.ts: #section1-carousel-root, .mySwiper; collection-carousel.ts: создание карусели только через ISwiperPort.create(); collection-module регистрирует после app-shell.                         |
| C-S1-02      | app:collectionStats в kernel types; collection-carousel при slideChange эмитит stats; collection-stats подписан на app:collectionStats и обновляет .stat-number и data-target. Состояние только через шину. |
| Pause/Resume | app:sectionChange: при уходе с секции 1 — carousel.pause?(); при входе на секцию 1 — carousel.resume?(). Edge: carousel === null (vendor недоступен) — no-op.                                               |

Глобальные переменные не используются. Stats обновляются только по событию app:collectionStats.
