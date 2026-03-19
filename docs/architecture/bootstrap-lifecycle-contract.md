# Bootstrap Lifecycle Contract (MP-04)

## Контракт модуля

Каждый runtime-модуль должен соответствовать сигнатуре:

```js
function init(context) {
  // optional setup
  return () => {
    // optional cleanup
  };
}
```

Где `context` предоставляется через `createRuntimeContext()` и включает:

- `context.window`
- `context.document`
- `context.env` (`prefersReducedMotion`, `isMobile`)
- `context.on(event, handler, options)`
- `context.emit(event, detail, options)`
- `context.addCleanup(fn)`
- `context.cleanup()`

## Lifecycle

`assets/js/main.js` использует `createBootstrap({ modules, context })`:

1. `runtime.start()` инициализирует модули по фиксированному списку.
2. Повторный `start()` идемпотентен (уже инициализированные модули пропускаются).
3. `runtime.destroy()` вызывает cleanup каждого модуля и затем `context.cleanup()`.

## Ограничения

- Импорт модуля не должен менять DOM напрямую (side effects запрещены).
- Новый код не должен создавать `window.*`-глобалы.
- Хрупкий legacy-контур (`core/app.js`, `swiper-init.js`, `section1-*`, `ticker-*`) остается в классических скриптах до отдельной декомпозиции.
