/**
 * Animation Port — Phase 5.
 * Contract for timeline/tween animations (GSAP). No vendor types.
 */

export interface TweenVarsPort {
  duration?: number;
  delay?: number;
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
  [key: string]: unknown;
}

/** Port: run animations. Returns a handle to kill if needed. */
export interface IAnimationPort {
  to(target: unknown, vars: TweenVarsPort): { kill: () => void };
  from(target: unknown, vars: TweenVarsPort): { kill: () => void };
  fromTo(target: unknown, fromVars: TweenVarsPort, toVars: TweenVarsPort): { kill: () => void };
  /** ScrollTrigger: register and return kill. */
  scrollTrigger(config: ScrollTriggerConfigPort): { kill: () => void };
}

export interface ScrollTriggerConfigPort {
  trigger?: unknown;
  start?: string;
  end?: string;
  onUpdate?: (_self: { progress: number }) => void;
  [key: string]: unknown;
}
