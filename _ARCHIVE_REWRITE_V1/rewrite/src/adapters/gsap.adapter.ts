/**
 * GSAP Adapter — Phase 5.
 * Anti-corruption layer: wraps vendor GSAP/ScrollTrigger. Errors isolated; kernel:error emitted.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type {
  IAnimationPort,
  ScrollTriggerConfigPort,
  TweenVarsPort,
} from './ports/animation.port.js';

/** Vendor shape (injected; no direct import). */
export interface GsapVendor {
  to(_target: unknown, _vars: Record<string, unknown>): { kill: () => void };
  from(_target: unknown, _vars: Record<string, unknown>): { kill: () => void };
  fromTo(
    _target: unknown,
    _fromVars: Record<string, unknown>,
    _toVars: Record<string, unknown>
  ): { kill: () => void };
}

export interface ScrollTriggerVendor {
  create(_config: Record<string, unknown>): { kill: () => void };
}

/** Returns the adapter. If vendor unavailable, returns no-op implementation. */
export function createGsapAdapter(
  bus: TypedEventBus,
  getGsap: () => GsapVendor | null | undefined,
  getScrollTrigger?: () => ScrollTriggerVendor | null | undefined
): IAnimationPort {
  const noopKill = (): void => {};
  const safeTween = (name: string, fn: () => { kill: () => void }) => {
    try {
      return fn();
    } catch (err) {
      bus.emit('kernel:error', {
        error: err instanceof Error ? err : new Error(String(err)),
        context: `adapters:gsap:${name}`,
        recoverable: true,
      });
      return { kill: noopKill };
    }
  };

  return {
    to(target: unknown, vars: TweenVarsPort): { kill: () => void } {
      const gsap = getGsap();
      if (!gsap) {
        bus.emit('kernel:error', {
          error: new Error('GSAP adapter: vendor not available'),
          context: 'adapters:gsap',
          recoverable: true,
        });
        return { kill: noopKill };
      }
      return safeTween('to', () => gsap.to(target, vars as Record<string, unknown>));
    },
    from(target: unknown, vars: TweenVarsPort): { kill: () => void } {
      const gsap = getGsap();
      if (!gsap) return { kill: noopKill };
      return safeTween('from', () => gsap.from(target, vars as Record<string, unknown>));
    },
    fromTo(target: unknown, fromVars: TweenVarsPort, toVars: TweenVarsPort): { kill: () => void } {
      const gsap = getGsap();
      if (!gsap) return { kill: noopKill };
      return safeTween('fromTo', () =>
        gsap.fromTo(target, fromVars as Record<string, unknown>, toVars as Record<string, unknown>)
      );
    },
    scrollTrigger(config: ScrollTriggerConfigPort): { kill: () => void } {
      const st = getScrollTrigger?.();
      if (!st) return { kill: noopKill };
      return safeTween('scrollTrigger', () => st.create(config as Record<string, unknown>));
    },
  };
}
