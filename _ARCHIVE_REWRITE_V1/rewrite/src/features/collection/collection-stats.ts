/**
 * Collection Stats — Phase 8. C-S1-02.
 * State only via Event Bus (app:collectionStats). No globals.
 */
import type { TypedEventBus } from '@/kernel/index.js';
import type { CollectionElements } from './collection-dom.js';

export function bindCollectionStats(el: CollectionElements, bus: TypedEventBus): () => void {
  const unsub = bus.on('app:collectionStats', (payload) => {
    const { stats } = payload;
    for (let i = 0; i < el.statElements.length && i < stats.length; i++) {
      const node = el.statElements[i];
      if (!node) continue;
      const entry = stats[i];
      if (!entry) continue;
      node.textContent = String(entry.value);
      node.setAttribute('data-target', String(entry.value));
    }
  });
  return unsub;
}
