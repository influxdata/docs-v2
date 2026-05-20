/*
  Blocking-modal controller (Subscriber UX Standard). currentBlockingId pins
  the post actively shown (distinct from the queue). Source is the docs
  effective-presentation bucket so display_override is honored. No Escape /
  backdrop close — explicit Acknowledge only.

  Stack behavior: bucketBySurface returns the blocking queue sorted by
  severity (critical → warning → info) then UUIDv7 desc within severity
  (newest first). Acknowledging the top item drops it from the queue; the
  next item slides in via a measure-swap-animate transition (height
  animates from old to new natural height while content fades out then in).
  The modal closes — also animated — only when the queue is empty.
*/

import { bucketBySurface } from '../effective-presentation.js';
import { renderTopBarCard } from './shared.js';

// CSS-aligned durations. Keep in sync with the `data-transition` rules in
// _notifications.scss. The fallback timeouts guarantee progress under
// prefers-reduced-motion (where transition-duration is forced to 1ms).
const OUT_MS = 160;
const IN_MS = 200;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export function initBlocking(manager, ctx) {
  const mount = document.getElementById('notif-blocking-mount');
  if (!mount) return;

  let currentBlockingId = null;
  // Suppresses render() while an animated swap is in flight. Without this,
  // a `change` emitted by manager.acknowledgeBlocking would race the ack
  // handler's own transition-to-next.
  let transitioning = false;

  function buildBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'notif-modal-backdrop';
    return backdrop;
  }

  function buildModal(item) {
    const modal = document.createElement('div');
    modal.className = 'notif-modal';
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `notif-modal-title-${item.id}`);

    const body = document.createElement('div');
    body.className = 'notif-modal__body';
    const card = renderTopBarCard(item, 'blocking', manager);
    const title = card.querySelector('.notif-card__title');
    if (title) title.id = `notif-modal-title-${item.id}`;
    body.appendChild(card);
    modal.appendChild(body);

    // Footer holds only the Acknowledge button — CTAs are rendered inside
    // the card itself by renderTopBarCard.
    const footer = document.createElement('footer');
    footer.className = 'notif-modal__footer';
    const ack = document.createElement('button');
    ack.className = 'notif-modal__ack';
    ack.type = 'button';
    ack.textContent = 'Acknowledge';
    ack.addEventListener('click', onAcknowledge);
    footer.appendChild(ack);
    modal.appendChild(footer);
    return modal;
  }

  function getBackdrop() {
    return mount.querySelector('.notif-modal-backdrop');
  }
  function getModal() {
    return mount.querySelector('.notif-modal');
  }

  function nextFromQueue(excludeId) {
    const queue = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    ).blocking;
    return queue.find((i) => i.id !== excludeId) ?? null;
  }

  function mountFresh(item) {
    const backdrop = buildBackdrop();
    backdrop.appendChild(buildModal(item));
    mount.appendChild(backdrop);
    currentBlockingId = item.id;
    manager.recordImpressionOnce(item.id);
  }

  // Animated swap from the current modal to a new item (or close if null).
  async function swapTo(nextItem) {
    if (transitioning) return;
    transitioning = true;

    const backdrop = getBackdrop();
    const oldModal = getModal();
    const oldH = oldModal ? oldModal.offsetHeight : 0;

    if (oldModal) {
      // Lock current height so the new content can animate from it.
      oldModal.style.height = `${oldH}px`;
      oldModal.dataset.transition = 'leaving';
      await delay(OUT_MS);
    }

    if (!nextItem) {
      // Queue empty: fade the backdrop out and remove it.
      if (backdrop) {
        backdrop.dataset.transition = 'leaving';
        await delay(OUT_MS);
      }
      mount.innerHTML = '';
      currentBlockingId = null;
      transitioning = false;
      return;
    }

    // Build the new modal and place it inside the existing backdrop so the
    // backdrop never blinks.
    const newModal = buildModal(nextItem);
    // Start collapsed at old height + invisible so the entrance animates.
    newModal.style.height = `${oldH}px`;
    newModal.dataset.transition = 'entering';

    if (backdrop) {
      backdrop.innerHTML = '';
      backdrop.appendChild(newModal);
    } else {
      const b = buildBackdrop();
      b.appendChild(newModal);
      mount.appendChild(b);
    }
    currentBlockingId = nextItem.id;
    manager.recordImpressionOnce(nextItem.id);

    // Measure new natural height by briefly setting auto.
    newModal.style.height = 'auto';
    const newH = newModal.offsetHeight;
    newModal.style.height = `${oldH}px`;
    // Force reflow so the transition picks up the height change below.
    void newModal.offsetHeight;

    // Phase 2: animate to natural height + fade content in.
    newModal.style.height = `${newH}px`;
    newModal.dataset.transition = 'entered';
    await delay(IN_MS);

    // Clear transition state so the modal's height reverts to content-driven.
    newModal.style.height = '';
    delete newModal.dataset.transition;
    transitioning = false;
  }

  function onAcknowledge() {
    if (transitioning) return;
    const id = currentBlockingId;
    // Mark acknowledged. If the post was already read (e.g. via a CTA
    // click which marks read silently on blocking surface), this is a
    // no-op (no `change` emitted). Either way, the ack handler drives
    // the transition explicitly so the modal advances or closes.
    manager.acknowledgeBlocking(id);
    swapTo(nextFromQueue(id));
  }

  function render() {
    if (transitioning) return;
    const queue = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    ).blocking;
    const top = queue[0] ?? null;

    if (currentBlockingId) {
      const stillActive = queue.some((i) => i.id === currentBlockingId);
      if (stillActive) return; // current modal still valid; nothing to do
      // Current item was removed externally (retracted / expired). Advance.
      swapTo(top);
      return;
    }

    if (top) mountFresh(top);
  }

  manager.addEventListener('change', render);
  render();
}
