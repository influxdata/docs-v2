/*
  Banner-stack controller (Subscriber UX Standard). Diffs the visible queue
  against mounted DOM by post id, animating enter/leave. Source is the docs
  effective-presentation bucket (NOT manager.getBannerQueue) so per-page
  display_override is honored.
*/

import { bucketBySurface } from '../effective-presentation.js';
import { renderTopBarCard } from './shared.js';

const BANNER_CAP = 3;

export function initBanner(manager, ctx) {
  const stack = document.getElementById('notif-banner-stack');
  if (!stack) return;

  function render() {
    const visible = bucketBySurface(
      manager.getItems(),
      ctx.pathname,
      ctx.productMap
    ).banner.slice(0, BANNER_CAP);
    const visibleIds = new Set(visible.map((i) => i.id));

    // Leave: banners no longer in the queue.
    for (const child of Array.from(stack.children)) {
      if (!visibleIds.has(child.dataset.postId)) {
        if (child.dataset.state === 'leaving') continue;
        child.dataset.state = 'leaving';
        child.addEventListener('animationend', () => child.remove(), {
          once: true,
        });
      }
    }

    // Enter: banners newly in the queue.
    const present = new Set(
      Array.from(stack.children).map((c) => c.dataset.postId)
    );
    for (const item of visible) {
      if (present.has(item.id)) continue;
      const card = renderTopBarCard(item, 'banner', manager);
      card.classList.add('notif-banner');
      card.dataset.state = 'entering';
      card.addEventListener(
        'animationend',
        () => {
          if (card.dataset.state === 'entering') {
            card.removeAttribute('data-state');
          }
        },
        { once: true }
      );
      stack.appendChild(card);
      manager.recordImpressionOnce(item.id);
    }
  }

  manager.addEventListener('change', render);
  render();

  // The docs topnav is `position: relative` and scrolls 1:1 with the page.
  // Goal: stack starts at --notif-banner-top (matches the CSS fallback),
  // decreases with scrollY as the topnav rides out, and clamps at
  // --notif-banner-right so the "stuck" position has symmetric top/right
  // padding from the viewport corner.
  let initialTop = 0;
  let rightPad = 0;
  const refreshOffsets = () => {
    const cs = getComputedStyle(stack);
    initialTop =
      parseFloat(cs.getPropertyValue('--notif-banner-top').trim()) || 0;
    rightPad =
      parseFloat(cs.getPropertyValue('--notif-banner-right').trim()) || 0;
  };
  const syncStackOffset = () => {
    const top = Math.max(rightPad, initialTop - window.scrollY);
    stack.style.top = `${top}px`;
  };
  refreshOffsets();
  syncStackOffset();
  window.addEventListener('scroll', syncStackOffset, { passive: true });
  window.addEventListener('resize', () => {
    refreshOffsets();
    syncStackOffset();
  });
}
