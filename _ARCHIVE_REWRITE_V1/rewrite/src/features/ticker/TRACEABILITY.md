# Ticker — Traceability (Phase 9)

| Contract ID | Реализация |
|-------------|------------|
| C-TICK-01 | ticker-dom.ts: #ticker-track, .ticker-segment; ticker-module — единственный владелец (один раз создаёт DOM в init). CSS animation с --ticker-duration. |
| C-A11Y-02 | При reduced-motion: класс .ticker-paused на .ticker-wrap; в CSS html.reduced-motion .ticker-track { animation-play-state: paused }. Тикер не крутится. |
| Pause by section | app:sectionChange: тикер активен только при activeIndex in {0,1,2}; при 3,4 — .ticker-paused (экономия CPU). |
| No double init | В init проверка: если mount уже содержит #ticker-track — выход без создания. Регистрация модуля единственная в main. |
| No conflict | Не трогает Hero (section-0), Collection (section-1); монтируется в main после sections. |

Состояние (paused/playing) владеет только ticker-module; обновление только по событиям шины и getReducedMotion().
