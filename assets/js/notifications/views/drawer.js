/*
  Drawer (inbox) view. Wires the topnav bell + badge to a slide-out panel
  rendered from manager.getDrawerItems(). Pure render — all state lives in
  the manager.
*/

import { buildCard } from './shared.js';

export function initDrawer(manager) {
  const bellBtn = document.getElementById('notif-bell-btn');
  const badge = document.getElementById('notif-badge');
  const panel = document.getElementById('notif-drawer');
  if (!bellBtn || !panel) return;

  const list = panel.querySelector('.notif-drawer-list');
  let open = false;

  function renderBadge() {
    const count = manager.getUnreadCount();
    if (count > 0) {
      badge.textContent = String(count);
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  }

  function renderList() {
    list.textContent = '';
    const items = manager.getDrawerItems();
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'notif-empty';
      empty.textContent = 'No notifications';
      list.appendChild(empty);
      return;
    }
    for (const item of items) {
      const card = buildCard(item.post, {
        onExpand: () => manager.expandSummary(item.id),
        onCTA: (post, i) => manager.handleCTAClick(post, i, 'drawer'),
      });
      if (item.read) card.classList.add('notif-read');
      const dismiss = document.createElement('button');
      dismiss.className = 'notif-dismiss';
      dismiss.type = 'button';
      dismiss.setAttribute('aria-label', 'Dismiss');
      dismiss.innerHTML = '<span class="cf-icon Remove_New"></span>';
      dismiss.addEventListener('click', () =>
        manager.dismissFromDrawer(item.id)
      );
      card.appendChild(dismiss);
      list.appendChild(card);
      manager.recordImpressionOnce(item.id);
    }
  }

  function setOpen(next) {
    open = next;
    panel.hidden = !open;
    bellBtn.setAttribute('aria-expanded', String(open));
    if (open) renderList();
  }

  bellBtn.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  manager.addEventListener('change', () => {
    renderBadge();
    if (open) renderList();
  });

  renderBadge();
}
