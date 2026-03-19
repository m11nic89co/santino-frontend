/**
 * Kernel-level acceptance checks — Phase 4.
 * Pure unit tests; no DOM, no Playwright.
 */
import { describe, it, expect } from 'vitest';
import { TypedEventBus } from './event-bus.js';
import { StateMachine } from './state-machine.js';
import { DEFAULT_TRANSITIONS } from './types.js';
import { LifecycleController } from './lifecycle.js';
import { runWithErrorBoundary, setKernelErrorHandler } from './error-boundary.js';
import type { KernelModule } from './lifecycle.js';

describe('TypedEventBus', () => {
  it('emits and receives typed events', () => {
    const bus = new TypedEventBus();
    let received: number | undefined;
    bus.on('app:sectionChange', (p) => {
      received = p.activeIndex;
    });
    bus.emit('app:sectionChange', { activeIndex: 2, previousIndex: 1 });
    expect(received).toBe(2);
  });

  it('unsubscribe removes listener', () => {
    const bus = new TypedEventBus();
    let count = 0;
    const off = bus.on('kernel:ready', () => {
      count++;
    });
    bus.emit('kernel:ready', {});
    off();
    bus.emit('kernel:ready', {});
    expect(count).toBe(1);
  });

  it('errors in listener emit kernel:error', () => {
    const bus = new TypedEventBus();
    let captured: Error | undefined;
    bus.on('kernel:error', (p) => {
      captured = p.error;
    });
    bus.on('app:sectionChange', () => {
      throw new Error('test');
    });
    bus.emit('app:sectionChange', { activeIndex: 0, previousIndex: 0 });
    expect(captured?.message).toBe('test');
  });
});

describe('StateMachine', () => {
  it('starts idle and allows booting -> ready', () => {
    const sm = new StateMachine();
    expect(sm.getState()).toBe('idle');
    expect(sm.transition('booting')).toBe(true);
    expect(sm.transition('ready')).toBe(true);
    expect(sm.getState()).toBe('ready');
  });

  it('rejects invalid transition', () => {
    const sm = new StateMachine({ initial: 'idle' });
    expect(sm.transition('ready')).toBe(false);
    expect(sm.getState()).toBe('idle');
  });

  it('transitionOrThrow throws on invalid', () => {
    const sm = new StateMachine({ initial: 'ready' });
    expect(() => sm.transitionOrThrow('booting')).toThrow();
  });

  it('uses custom transition map when provided', () => {
    const sm = new StateMachine({
      initial: 'idle',
      transitions: { ...DEFAULT_TRANSITIONS, idle: ['ready'] as const },
    });
    expect(sm.transition('ready')).toBe(true);
  });
});

describe('LifecycleController', () => {
  it('init/dispose runs modules in order', async () => {
    const bus = new TypedEventBus();
    const sm = new StateMachine();
    const order: string[] = [];
    const mod: KernelModule = {
      id: 'test',
      init() {
        order.push('init');
      },
      dispose() {
        order.push('dispose');
      },
    };
    const lc = new LifecycleController({ eventBus: bus, stateMachine: sm });
    lc.register(mod);
    await lc.start();
    expect(sm.getState()).toBe('ready');
    expect(order).toEqual(['init']);
    await lc.stop();
    expect(order).toEqual(['init', 'dispose']);
    expect(sm.getState()).toBe('idle');
  });

  it('rejects duplicate module id', () => {
    const bus = new TypedEventBus();
    const sm = new StateMachine();
    const lc = new LifecycleController({ eventBus: bus, stateMachine: sm });
    lc.register({ id: 'a', init() {}, dispose() {} });
    expect(() => lc.register({ id: 'a', init() {}, dispose() {} })).toThrow(/duplicate/);
  });
});

describe('Error boundary', () => {
  it('runWithErrorBoundary catches and emits', () => {
    const bus = new TypedEventBus();
    let err: Error | undefined;
    setKernelErrorHandler(bus, (p) => {
      err = p.error;
    });
    runWithErrorBoundary(
      bus,
      () => {
        throw new Error('bound');
      },
      'ctx'
    );
    expect(err?.message).toBe('bound');
  });
});
