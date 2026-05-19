/*
  Blocking-modal controller (Subscriber UX Standard). currentBlockingId pins
  the post actively shown (distinct from the queue). Source is the docs
  effective-presentation bucket so display_override is honored. No Escape /
  backdrop close — explicit Acknowledge only.
*/

import { bucketBySurface } from '../effective-presentation.js';
import { renderTopBarCard, renderCTA } from './shared.js';

export function initBlocking(manager, ctx) {
  const mount = document.getElementById('notif-blocking-mount');
  if (!mount) return;

  let currentBlockingId = null;

  function buildModal(item) {
    const backdrop = document.createElement('div');
    backdrop.className = 'notif-modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'notif-modal';
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `notif-modal-title-${item.id}`);
    backdrop.appendChild(modal);

    const body = document.createElement('div');
    body.className = 'notif-modal__body';
    const card = renderTopBarCard(item, 'blocking', manager);
    const title = card.querySelector('.notif-card__title');
    if (title) title.id = `notif-modal-title-${item.id}`;
    body.appendChild(card);
    modal.appendChild(body);

    const footer = document.createElement('footer');
    footer.className = 'notif-modal__footer';
    if (item.post.ctas && item.post.ctas.length > 0) {
      item.post.ctas.forEach((cta, idx) => {
        const a = renderCTA(cta);
        a.addEventListener('click', () =>
          manager.handleCTAClick(item.post, idx, 'blocking')
        );
        footer.appendChild(a);
      });
    }
    const ack = document.createElement('button');
    ack.className = 'notif-modal__ack';
    ack.type = 'button';
    ack.textContent = 'Acknowledge';
    ack.addEventListener('click', () => {
      const id = currentBlockingId;
      // Eager close: clear mount + id before calling the manager. If the user
      // CTA-clicked first the post is already read and acknowledgeBlocking is
      // a no-op (no emit) — the modal must still close.
      currentBlockingId = null;
      mount.innerHTML = '';
      manager.acknowledgeBlocking(id);
      render();
    });
    footer.appendChild(ack);
    modal.appendChild(footer);
    return backdrop;
  }

  function render() {
    const queue = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    ).blocking;
    const top = queue[0] ?? null;

    if (currentBlockingId) {
      const stillActive = manager
        .getItems()
        .some((i) => i.id === currentBlockingId && !i.read && !i.dismissed);
      if (!stillActive) {
        mount.innerHTML = '';
        currentBlockingId = null;
      }
    }

    if (!currentBlockingId && top) {
      currentBlockingId = top.id;
      mount.appendChild(buildModal(top));
      manager.recordImpressionOnce(top.id);
    }
  }

  manager.addEventListener('change', render);
  render();
}
