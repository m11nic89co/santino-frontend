/**
 * Kernel — Phase 4. Public API.
 * Typed Event Bus, State Machine, Lifecycle contract, Error boundary.
 * No UI, no DOM, no window, no vendor.
 */

export { TypedEventBus } from './event-bus.js';
export { StateMachine } from './state-machine.js';
export type { StateMachineOptions } from './state-machine.js';
export { LifecycleController } from './lifecycle.js';
export type { KernelModule, KernelOptions } from './lifecycle.js';
export {
  runWithErrorBoundary,
  runWithErrorBoundaryAsync,
  setKernelErrorHandler,
} from './error-boundary.js';
export type { ErrorBoundaryHandler } from './error-boundary.js';
export { DEFAULT_TRANSITIONS } from './types.js';
export type {
  AppState,
  KernelEventMap,
  KernelEventName,
  KernelErrorPayload,
  TransitionMap,
} from './types.js';
