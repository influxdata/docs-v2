/*
  Blocking modal view. Renders the FIRST item of the blocking-effective queue
  as a modal requiring explicit Acknowledge. CTA clicks here use surface
  'blocking' (mark read silently; modal stays open until Acknowledge).
*/

import { bucketBySurface } from '../effective-presentation.js';
import { buildCard } from './shared.js';

export function initBlocking(manager, ctx) {
  const root = document.getElementById('notif-blocking');
  if (!root) return;

  function render() {
    root.textContent = '';
    const { blocking } = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    );
    if (!blocking.length) {
      root.hidden = true;
      return;
    }
    const item = blocking[0];
    root.hidden = false;

    const overlay = document.createElement('div');
    overlay.className = 'notif-blocking-overlay';

    const modal = document.createElement('div');
    modal.className = 'notif-blocking-modal';
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');

    const card = buildCard(item.post, {
      onExpand: () => {},
      onCTA: (post, i) => manager.handleCTAClick(post, i, 'blocking'),
    });
    modal.appendChild(card);

    const ack = document.createElement('button');
    ack.className = 'notif-ack btn';
    ack.type = 'button';
    ack.textContent = 'Acknowledge';
    ack.addEventListener('click', () => manager.acknowledgeBlocking(item.id));
    modal.appendChild(ack);

    overlay.appendChild(modal);
    root.appendChild(overlay);
    manager.recordImpressionOnce(item.id);
  }

  manager.addEventListener('change', render);
  render();
}
