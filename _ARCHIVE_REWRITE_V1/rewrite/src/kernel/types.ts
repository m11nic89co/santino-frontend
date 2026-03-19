/**
 * Kernel types — Phase 4.
 * Typed event registry and state model. No DOM, no window, no vendor.
 */

/** Canonical event names and their payload types (single source of truth). */
export interface KernelEventMap {
  /** Application bootstrap finished; payload: initial section index if applicable. */
  'kernel:ready': { initialSection?: number };
  /** Active section changed; payload: 0..4. */
  'app:sectionChange': { activeIndex: number; previousIndex: number };
  /** Navigation requested (e.g. by user); payload: target index. */
  'app:navRequest': { targetIndex: number };
  /** Collection stats updated (typed state via bus). C-S1-02. */
  'app:collectionStats': { stats: ReadonlyArray<{ id: string; value: number; label?: string }> };
  /** Runtime error captured by kernel; payload: error and optional context. */
  'kernel:error': KernelErrorPayload;
  /** Module lifecycle: init started. */
  'kernel:moduleInit': { moduleId: string };
  /** Module lifecycle: init completed. */
  'kernel:moduleReady': { moduleId: string };
  /** Module lifecycle: dispose started. */
  'kernel:moduleDispose': { moduleId: string };
}

export interface KernelErrorPayload {
  error: Error;
  context?: string;
  recoverable?: boolean;
}

/** Allowed application states (finite set). */
export type AppState = 'idle' | 'booting' | 'ready' | 'navigating' | 'error' | 'disposing';

/** Valid transitions: from -> to[] */
export type TransitionMap = Record<AppState, readonly AppState[]>;

/** Default allowed transitions. */
export const DEFAULT_TRANSITIONS: TransitionMap = {
  idle: ['booting'],
  booting: ['ready', 'error'],
  ready: ['navigating', 'disposing', 'error'],
  navigating: ['ready', 'error'],
  error: ['ready', 'disposing'],
  disposing: ['idle'],
} as const;

export type KernelEventName = keyof KernelEventMap;
