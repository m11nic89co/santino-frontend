/**
 * App Shell Kernel Module — Phase 6.
 * C-APP-01, C-APP-02, C-NAV-01. Navigation only via Event Bus and State Machine.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { StateMachine } from '@/kernel/index.js';
import type { KernelModule } from '@/kernel/index.js';
import { createShellDOM } from './shell-dom.js';
import { bindNavigation, updateNavActiveState } from './navigation.js';

export interface AppShellModuleOptions {
  bus: TypedEventBus;
  stateMachine: StateMachine;
  getMountTarget: () => HTMLElement | null;
}

export function createAppShellModule(options: AppShellModuleOptions): KernelModule {
  const { bus, stateMachine, getMountTarget } = options;
  let el: ReturnType<typeof createShellDOM> | null = null;
  let unbindNav: (() => void) | null = null;
  let unsubNavRequest: (() => void) | null = null;
  let unsubSectionChange: (() => void) | null = null;
  let unsubKernelReady: (() => void) | null = null;
  let activeSectionIndex = 0;

  return {
    id: 'app-shell',

    init(): void {
      const mount = getMountTarget();
      if (!mount) return;

      el = createShellDOM();
      mount.appendChild(el.root);

      if (document.body) {
        document.body.dataset['activeSection'] = '0';
      }

      unbindNav = bindNavigation(el, bus);

      unsubNavRequest = bus.on('app:navRequest', (payload) => {
        const target = payload.targetIndex;
        if (target < 0 || target >= 5) return;
        if (!stateMachine.canTransitionTo('navigating')) return;
        stateMachine.transition('navigating');
        const previous = activeSectionIndex;
        activeSectionIndex = target;
        if (document.body) document.body.dataset['activeSection'] = String(target);
        bus.emit('app:sectionChange', { activeIndex: target, previousIndex: previous });
        stateMachine.transition('ready');
        if (el) updateNavActiveState(el, activeSectionIndex);
      });

      unsubSectionChange = bus.on('app:sectionChange', (payload) => {
        if (document.body) document.body.dataset['activeSection'] = String(payload.activeIndex);
        activeSectionIndex = payload.activeIndex;
        if (el) updateNavActiveState(el, payload.activeIndex);
      });

      unsubKernelReady = bus.on('kernel:ready', () => {
        if (el) {
          el.loader.classList.add('hide');
          if (el.main) el.main.classList.add('site-visible');
        }
        if (document.body) {
          document.body.classList.add('fab-intro-done');
        }
      });

      updateNavActiveState(el, 0);
      el.loader.classList.add('hide');
      el.main.classList.add('site-visible');
      document.body?.classList.add('fab-intro-done');
    },

    dispose(): void {
      if (document.body) document.body.style.overflow = '';
      unsubKernelReady?.();
      unsubSectionChange?.();
      unsubNavRequest?.();
      unbindNav?.();
      unsubKernelReady = null;
      unsubSectionChange = null;
      unsubNavRequest = null;
      unbindNav = null;
      if (el?.root.parentNode) {
        el.root.parentNode.removeChild(el.root);
      }
      el = null;
    },
  };
}
