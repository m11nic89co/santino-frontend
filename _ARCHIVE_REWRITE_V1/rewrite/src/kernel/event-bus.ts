/**
 * Typed Event Bus — Phase 4.
 * Single in-process pub/sub. No window, no DOM.
 */

import type { KernelEventMap, KernelEventName } from './types.js';

type Listener<T extends KernelEventName> = (_payload: KernelEventMap[T]) => void;

export class TypedEventBus {
  private listeners = new Map<KernelEventName, Set<Listener<KernelEventName>>>();

  on<K extends KernelEventName>(event: K, handler: Listener<K>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as Listener<KernelEventName>);
    return () => {
      set?.delete(handler as Listener<KernelEventName>);
    };
  }

  once<K extends KernelEventName>(event: K, handler: Listener<K>): () => void {
    const unsubscribe = this.on(event, ((payload: KernelEventMap[K]) => {
      unsubscribe();
      handler(payload);
    }) as Listener<K>);
    return unsubscribe;
  }

  emit<K extends KernelEventName>(event: K, payload: KernelEventMap[K]): void {
    const set = this.listeners.get(event);
    if (!set) return;
    const handlers = Array.from(set);
    for (const fn of handlers) {
      try {
        fn(payload);
      } catch (err) {
        this.emit('kernel:error', {
          error: err instanceof Error ? err : new Error(String(err)),
          context: `event-bus:${String(event)}`,
          recoverable: true,
        });
      }
    }
  }

  removeAllListeners(event?: KernelEventName): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: KernelEventName): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
