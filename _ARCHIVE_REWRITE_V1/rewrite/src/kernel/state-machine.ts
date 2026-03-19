/**
 * State Machine — Phase 4.
 * Deterministic transitions only. No side effects inside; transitions are validated by map.
 */

import type { AppState, TransitionMap } from './types.js';
import { DEFAULT_TRANSITIONS } from './types.js';

export interface StateMachineOptions {
  initial?: AppState;
  transitions?: TransitionMap;
}

export class StateMachine {
  private state: AppState;
  private readonly transitions: TransitionMap;

  constructor(options: StateMachineOptions = {}) {
    this.state = options.initial ?? 'idle';
    this.transitions = options.transitions ?? DEFAULT_TRANSITIONS;
  }

  getState(): AppState {
    return this.state;
  }

  /** Returns whether transition was allowed and applied. */
  transition(to: AppState): boolean {
    const allowed = this.transitions[this.state];
    if (!allowed?.includes(to)) return false;
    this.state = to;
    return true;
  }

  /** Throws if transition is invalid (for strict callers). */
  transitionOrThrow(to: AppState): void {
    if (!this.transition(to)) {
      throw new Error(
        `Invalid transition: ${this.state} -> ${to}. Allowed: ${String(this.transitions[this.state])}`
      );
    }
  }

  canTransitionTo(to: AppState): boolean {
    return this.transitions[this.state]?.includes(to) ?? false;
  }
}
