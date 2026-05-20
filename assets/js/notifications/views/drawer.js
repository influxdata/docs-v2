/*
  Drawer controller (Subscriber UX Standard). Pure render off the manager;
  no notification state held here.

  Docs scope/exclude is applied at RENDER time per page (not at ingest), so
  the drawer is page-scoped: only posts whose `contexts.docs` matches
  ctx.pathname appear in the drawer, and the bell counter reflects unread
  in-scope items on the current page.
*/

import { renderDrawerCard } from './shared.js';
import { inDocsScope } from '../scope-matcher.js';

export function initDrawer(manager, ctx = {}) {
  const { pathname = '/', productMap = {} } = ctx;
  const bellBtn = document.getElementById('notif-bell-btn');
  const badge = document.getElementById('notif-badge');
  const drawer = document.getElementById('notif-drawer');
  if (!bellBtn || !badge || !drawer) return;
  const list = drawer.querySelector('#notif-drawer-list');
  const closeBtn = drawer.querySelector('#notif-drawer-close');
  if (!list) return;

  let open = false;
  // Per-card expanded state owned by the controller so it survives the
  // full re-render triggered by `manager.expandSummary` (which fires
  // `change`). Without this, the first Show-more click expands the body
  // briefly and the re-render destroys it.
  const expandedIds = new Set();

  function isInScope(item) {
    return inDocsScope(
      item.post.contexts && item.post.contexts.docs,
      pathname,
      productMap
    );
  }

  function pageScopedItems() {
    return manager.getDrawerItems().filter(isInScope);
  }

  function pageScopedUnreadCount() {
    return manager
      .getItems()
      .filter((i) => !i.read && !i.dismissed && isInScope(i)).length;
  }

  function renderCounter() {
    const n = pageScopedUnreadCount();
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.dataset.count = String(n);
    badge.hidden = n === 0;
    bellBtn.setAttribute('aria-label', `Notifications, ${n} unread`);
  }

  function renderList() {
    list.innerHTML = '';
    const items = pageScopedItems();
    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'notif-drawer__empty';
      empty.textContent = "You're all caught up.";
      list.appendChild(empty);
      return;
    }
    // Prune ids no longer in the visible list so the Set doesn't grow
    // unbounded (dismissed/expired/retracted ids fall off).
    const visibleIds = new Set(items.map((i) => i.id));
    for (const id of expandedIds) {
      if (!visibleIds.has(id)) expandedIds.delete(id);
    }
    for (const item of items) {
      list.appendChild(
        renderDrawerCard(item, manager, {
          initialExpanded: expandedIds.has(item.id),
          onToggle: (expanded) => {
            if (expanded) expandedIds.add(item.id);
            else expandedIds.delete(item.id);
          },
        })
      );
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
