/**
 * Lifecycle contract — Phase 4.
 * init/dispose for kernel modules. No UI, no vendor.
 */

import type { TypedEventBus } from './event-bus.js';
import type { StateMachine } from './state-machine.js';
import { runWithErrorBoundaryAsync } from './error-boundary.js';

/** Contract for any module that participates in kernel lifecycle. */
export interface KernelModule {
  readonly id: string;
  init(): void | Promise<void>;
  dispose(): void | Promise<void>;
}

export interface KernelOptions {
  eventBus: TypedEventBus;
  stateMachine: StateMachine;
}

/**
 * Orchestrates init/dispose of modules and state transitions.
 * Side effects: only via eventBus.emit and stateMachine.transition.
 */
export class LifecycleController {
  private readonly bus: TypedEventBus;
  private readonly machine: StateMachine;
  private readonly modules: KernelModule[] = [];
  private initialised = false;

  constructor(options: KernelOptions) {
    this.bus = options.eventBus;
    this.machine = options.stateMachine;
  }

  register(module: KernelModule): void {
    if (this.modules.some((m) => m.id === module.id)) {
      throw new Error(`Kernel: duplicate module id "${module.id}"`);
    }
    this.modules.push(module);
  }

  async start(): Promise<void> {
    if (this.initialised) return;
    if (!this.machine.transition('booting')) {
      throw new Error(`Kernel: cannot start from state ${this.machine.getState()}`);
    }
    for (const mod of this.modules) {
      this.bus.emit('kernel:moduleInit', { moduleId: mod.id });
      await runWithErrorBoundaryAsync(
        this.bus,
        () => Promise.resolve(mod.init()),
        `module.init:${mod.id}`
      );
      this.bus.emit('kernel:moduleReady', { moduleId: mod.id });
    }
    this.machine.transition('ready');
    this.initialised = true;
    this.bus.emit('kernel:ready', {});
  }

  async stop(): Promise<void> {
    if (!this.initialised) return;
    if (!this.machine.transition('disposing')) {
      return;
    }
    for (const mod of [...this.modules].reverse()) {
      this.bus.emit('kernel:moduleDispose', { moduleId: mod.id });
      await runWithErrorBoundaryAsync(
        this.bus,
        () => Promise.resolve(mod.dispose()),
        `module.dispose:${mod.id}`
      );
    }
    this.machine.transition('idle');
    this.initialised = false;
  }

  isReady(): boolean {
    return this.initialised && this.machine.getState() === 'ready';
  }
}
