/*
  Drawer controller (Subscriber UX Standard). Pure render off the manager;
  no notification state held here. Path-independent — uses
  manager.getDrawerItems() (the docs scope/exclude/display_override layer is
  applied upstream in contextFilter / effective-presentation).
*/

import { renderDrawerCard } from './shared.js';

export function initDrawer(manager) {
  const bellBtn = document.getElementById('notif-bell-btn');
  const badge = document.getElementById('notif-badge');
  const drawer = document.getElementById('notif-drawer');
  if (!bellBtn || !badge || !drawer) return;
  const list = drawer.querySelector('#notif-drawer-list');
  const closeBtn = drawer.querySelector('#notif-drawer-close');
  if (!list) return;

  let open = false;

  function renderCounter() {
    const n = manager.getUnreadCount();
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.dataset.count = String(n);
    badge.hidden = n === 0;
    bellBtn.setAttribute('aria-label', `Notifications, ${n} unread`);
  }

  function renderList() {
    list.innerHTML = '';
    const items = manager.getDrawerItems();
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'notif-drawer__empty';
      empty.textContent = "You're all caught up.";
      list.appendChild(empty);
      return;
    }
    for (const item of items) {
      list.appendChild(renderDrawerCard(item, manager));
      if (open) manager.recordImpressionOnce(item.id);
    }
  }

  function render() {
    drawer.dataset.state = open ? 'open' : 'closed';
    bellBtn.setAttribute('aria-expanded', String(open));
    renderCounter();
    renderList();
  }

  function setOpen(next) {
    open = next;
    render();
  }

  bellBtn.addEventListener('click', () => setOpen(!open));
  if (closeBtn) closeBtn.addEventListener('click', () => setOpen(false));

  // composedPath stays stable even when the click target is detached by a
  // synchronous re-render (e.g. dismiss). contains(e.target) would not.
  document.addEventListener('click', (e) => {
    if (!open) return;
    const path = e.composedPath();
    if (path.includes(drawer) || path.includes(bellBtn)) return;
    setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  manager.addEventListener('change', render);
  render();
}
