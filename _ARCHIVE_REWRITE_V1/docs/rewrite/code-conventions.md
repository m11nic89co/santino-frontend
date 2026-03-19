# Code Conventions — SANTINO v2

Phase 2 baseline. Enforced via ESLint, Prettier, and TypeScript strict mode.

## 1. Allowed directories

- All application and tooling code for v2 lives under **`/rewrite/`** (repository path: `.../SC/rewrite/`).
- Documentation for the rewrite program lives under **`/docs/rewrite/`**.
- No edits outside these directories for v2 work.

## 2. TypeScript

- **Strict mode** is mandatory: `strict: true` and related flags in `tsconfig.json` must not be relaxed.
- Prefer `interface` for public contracts; use `type` for unions and mapped types.
- No `any`. Use `unknown` and narrow, or generic constraints.
- Use `@/` path alias for `src/` imports (e.g. `import { x } from '@/kernel/events'`).

## 3. No `window.*` in source

- **Rule:** Do not use the global `window` object in feature, kernel, or UI code under `src/`.
- **Reason:** v2 uses a platform boundary (adapter) for browser globals. Direct `window.*` bypasses that and couples code to the environment.
- **Enforcement:** ESLint `no-restricted-syntax` for `MemberExpression[object.name='window']` in `src/`.
- **Exception:** Config or build scripts (e.g. `vite.config.ts`) may use Node/browser globals as needed.

## 4. No inline styles for UI state

- **Rule:** Do not set UI state or layout via `element.style.*` (or `setAttribute('style', ...)`). Use CSS classes and design tokens (CSS Layers: `tokens`, `components`, `utilities`).
- **Reason:** Keeps styling in the cascade, avoids specificity wars and improves maintainability.
- **Enforcement:** ESLint `no-restricted-syntax` for assignments to `.style`; code review for style-related attributes.
- **Exception:** Rare cases (e.g. dynamic dimensions from measurement) may be allowed with an explicit comment and Architect approval.

## 5. No timer-based logic for flow control

- **Rule:** Do not use `setTimeout` / `setInterval` as the primary way to orchestrate application flow or state transitions. Use the Runtime Kernel (events, lifecycle, scheduler) instead.
- **Reason:** Timers are non-deterministic and hard to test; kernel provides a single place for orchestration.
- **Exception:** Build tooling, debounce/throttle utilities, or explicit scheduler abstraction are acceptable when documented.

## 6. Naming

- **Files:** `kebab-case` (e.g. `event-bus.ts`, `section-title.ts`).
- **Types/Interfaces:** `PascalCase`.
- **Functions/variables:** `camelCase`. Constants: `UPPER_SNAKE_CASE` only for true constants.
- **CSS classes:** `kebab-case`; BEM-like modifiers when needed (e.g. `card--active`).

## 7. CSS Layers

- Use the declared order: **reset → base → tokens → components → utilities**.
- Prefer **tokens** for colors, spacing, motion duration; **components** for component-scoped rules; **utilities** for one-off helpers.
- Avoid `!important`; use layer order and specificity instead.

## 8. Quality gate

Before commit / PR, run:

```bash
npm run quality
```

This runs `typecheck`, `lint`, and `format:check`. All must pass.

---

Version: 1.0 (Phase 2). Owner: Principal Systems Architect.
