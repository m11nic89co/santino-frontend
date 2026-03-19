# Kernel API — для feature-команд

Версия: **kernel-api-v1** (Phase 4).

Ядро приложения: типизированная шина событий, машина состояний, контракт жизненного цикла, обработка ошибок. Без UI, без DOM, без `window`, без внешних библиотек.

---

## 1. Зависимости и границы

- **Разрешено:** импорт из `@/kernel` или `rewrite/src/kernel` (TypedEventBus, StateMachine, LifecycleController, типы, error boundary).
- **Запрещено в ядре:** обращение к `window`, DOM, HTML/CSS, импорт Swiper/GSAP или иных vendor-библиотек.
- **Направление зависимостей:** feature → kernel (не наоборот). Ядро не импортирует feature-модули.

---

## 2. Typed Event Bus

Единый реестр событий: тип `KernelEventMap` в `@/kernel`.

| Событие | Payload | Назначение |
|--------|---------|------------|
| `kernel:ready` | `{ initialSection?: number }` | Приложение инициализировано |
| `app:sectionChange` | `{ activeIndex, previousIndex }` | Смена активной секции |
| `app:navRequest` | `{ targetIndex }` | Запрос навигации |
| `kernel:error` | `KernelErrorPayload` | Ошибка на уровне ядра |
| `kernel:moduleInit` / `moduleReady` / `moduleDispose` | `{ moduleId }` | Жизненный цикл модуля |

**API:**

- `bus.on(event, handler)` — подписка; возвращает функцию отписки.
- `bus.once(event, handler)` — однократная подписка.
- `bus.emit(event, payload)` — отправка. Ошибки в обработчиках перехватываются и уходят в `kernel:error`.

---

## 3. State Machine

Конечный набор состояний: `AppState = 'idle' | 'booting' | 'ready' | 'navigating' | 'error' | 'disposing'`.

Допустимые переходы задаются `TransitionMap` (по умолчанию — `DEFAULT_TRANSITIONS`).

**API:**

- `machine.getState()` — текущее состояние.
- `machine.transition(to)` — переход, если разрешён; возвращает `true`/`false`.
- `machine.transitionOrThrow(to)` — переход или выброс ошибки.
- `machine.canTransitionTo(to)` — проверка без перехода.

---

## 4. Lifecycle-контракт модулей

Интерфейс `KernelModule`:

- `id: string` — уникальный идентификатор.
- `init(): void | Promise<void>` — инициализация при старте ядра.
- `dispose(): void | Promise<void>` — очистка при остановке.

`LifecycleController`:

- `register(module)` — регистрация модуля (дубликаты по `id` запрещены).
- `start()` — переход в `booting`, вызов `init()` у всех модулей по порядку, переход в `ready`, эмит `kernel:ready`.
- `stop()` — переход в `disposing`, вызов `dispose()` в обратном порядке, переход в `idle`.

Ошибки в `init`/`dispose` перехватываются и эмитятся в `kernel:error`; остальные модули продолжают выполняться.

---

## 5. Ограничение побочных эффектов

- Побочные эффекты в ядре: только через `bus.emit` и `machine.transition`.
- Нет таймеров, нет прямого I/O внутри ядра (кроме вызова переданных обработчиков).
- Feature-модули подписываются на события и выполняют эффекты сами; ядро только координирует.

---

## 6. Error boundary (ядро)

- `runWithErrorBoundary(bus, fn, context?)` — синхронный вызов; при исключении эмитится `kernel:error`.
- `runWithErrorBoundaryAsync(bus, fn, context?)` — асинхронный аналог.
- `setKernelErrorHandler(bus, handler)` — подписка на `kernel:error` (например, логирование).

Ошибки в подписчиках Event Bus также приводят к эмиту `kernel:error`.

---

## 7. Kernel-level acceptance checks

- Юнит-тесты: `src/kernel/kernel.test.ts` (Vitest).
- Запуск: из папки `rewrite`: `npm run test`.
- Проверяется: TypedEventBus (emit/on/once, ошибки в listener), StateMachine (переходы, запрещённые переходы), LifecycleController (init/dispose, дубликаты id), error boundary.

---

## 8. Сборка ядра

Публичный API — только экспорты из `@/kernel` (файл `src/kernel/index.ts`). Внутренние файлы ядра не импортировать из feature-слоя.
