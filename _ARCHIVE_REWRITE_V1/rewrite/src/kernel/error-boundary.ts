/**
 * Kernel-level error boundary — Phase 4.
 * Capture errors, emit kernel:error, optional global handler. No window.
 */

import type { TypedEventBus } from './event-bus.js';
import type { KernelErrorPayload } from './types.js';

export type ErrorBoundaryHandler = (_payload: KernelErrorPayload) => void;

/** Runs fn; on throw, emits kernel:error and optionally calls handler. Does not rethrow by default. */
export function runWithErrorBoundary(bus: TypedEventBus, fn: () => void, context?: string): void {
  try {
    fn();
  } catch (err) {
    const payload: KernelErrorPayload = {
      error: err instanceof Error ? err : new Error(String(err)),
      recoverable: true,
      ...(context !== undefined ? { context } : {}),
    };
    bus.emit('kernel:error', payload);
  }
}

/** Async variant. */
export async function runWithErrorBoundaryAsync(
  bus: TypedEventBus,
  fn: () => Promise<void>,
  context?: string
): Promise<void> {
  try {
    await fn();
  } catch (err) {
    const payload: KernelErrorPayload = {
      error: err instanceof Error ? err : new Error(String(err)),
      recoverable: true,
      ...(context !== undefined ? { context } : {}),
    };
    bus.emit('kernel:error', payload);
  }
}

/** Install a single global error handler (e.g. logging). Side effect: only registration. */
export function setKernelErrorHandler(
  bus: TypedEventBus,
  handler: ErrorBoundaryHandler
): () => void {
  return bus.on('kernel:error', handler);
}
