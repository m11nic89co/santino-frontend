# Vendor Adapters — Phase 5

Внешние библиотеки изолированы за портами. Feature-слой и UI **не имеют права** импортировать Swiper или GSAP напрямую — только через адаптеры из `@/adapters`.

---

## 1. Строгий запрет direct vendor usage

- **Запрещено** в коде features и UI:
  - `import Swiper from 'swiper'`
  - `import gsap from 'gsap'`
  - `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
  - Любой прямой доступ к глобальному `window.Swiper` / `window.gsap` из feature-модулей (кроме точки инъекции при старте приложения).
- **Разрешено:** импорт портов и фабрик адаптеров из `@/adapters`, использование только типов и методов портов (`ISwiperPort`, `IAnimationPort`, `ISwiperInstance` и т.д.).
- Инъекция vendor (например, передача `() => window.Swiper` в фабрику адаптера) выполняется **один раз** при инициализации приложения (например, в bootstrap или корневой точке входа), не внутри feature-модулей.

---

## 2. Порты (интерфейсы)

| Порт | Назначение |
|------|------------|
| `ISwiperPort` | Создание экземпляра слайдера: `create(selector, options)` → `ISwiperInstance \| null`. |
| `ISwiperInstance` | `slideTo`, `on`, `off`, `getActiveIndex`, `destroy`. |
| `IAnimationPort` | Анимации: `to`, `from`, `fromTo`, `scrollTrigger`. |

Опции и конфиги описаны в `SwiperOptionsPort`, `TweenVarsPort`, `ScrollTriggerConfigPort` — без зависимостей от типов vendor.

---

## 3. Адаптеры и fallback

- **createSwiperAdapter(bus, getVendor)** — возвращает `ISwiperPort`. Если `getVendor()` возвращает `null`/`undefined` или при создании экземпляра происходит ошибка, эмитится `kernel:error`, метод `create` возвращает `null`. Все вызовы методов обёрнутого экземпляра перехватывают ошибки и эмитят `kernel:error`, не роняя ядро.
- **createFallbackSwiperPort()** — порт, всегда возвращающий no-op реализацию `ISwiperInstance`. Используется, когда vendor не загружен (например, после неудачной загрузки скрипта).
- **createGsapAdapter(bus, getGsap, getScrollTrigger?)** — возвращает `IAnimationPort`. При отсутствии GSAP или при ошибке вызова эмитится `kernel:error`, методы возвращают объект с no-op `kill()`. Ошибки внутри твинов/ScrollTrigger не пробрасываются наружу.

---

## 4. Adapter readiness checklist

- [ ] В точке входа приложения определена инъекция vendor (например, передача в адаптер `getSwiper` / `getGsap`).
- [ ] При загрузке vendor через скрипт обработана ошибка загрузки: при неудаче используется fallback-порт (например, `createFallbackSwiperPort()`), чтобы feature не падал.
- [ ] Ни один feature-модуль не импортирует `swiper` или `gsap` напрямую.
- [ ] Все вызовы слайдера и анимаций идут через порты (`ISwiperPort`, `IAnimationPort`).
- [ ] Подписка на `kernel:error` при необходимости обрабатывает контексты `adapters:swiper*` и `adapters:gsap*` (логирование, метрики).

---

## 5. Стратегия замены vendor без переписывания features

- Замена библиотеки (например, смена версии Swiper или замена на другую карусель) выполняется **только внутри адаптера** и, при необходимости, в типах порта (расширение опций/методов).
- Feature-слой продолжает зависеть только от `ISwiperPort` / `ISwiperInstance` и `IAnimationPort`. Реализация под капотом меняется без правок в feature-модулях.
- Новая библиотека должна быть обёрнута в класс/функцию, реализующую тот же порт; инъекция в bootstrap подменяется на новую фабрику.
