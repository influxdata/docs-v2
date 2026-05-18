/*
  Notification system boot. Fetches the canonical topic list, constructs the
  hub client + manager + per-browser storage, applies docs scope/exclude via
  contextFilter, and wires the drawer/banner/blocking views. Non-critical:
  any failure logs and leaves the page untouched.
*/

import {
  NotificationClient,
  NotificationManager,
  LocalOnlyStorage,
} from '@influxdata/notification-hub-client';
import { inDocsScope } from './scope-matcher.js';
import { initDrawer } from './views/drawer.js';
import { initBanner } from './views/banner.js';
import { initBlocking } from './views/blocking.js';

function readConfig() {
  const el = document.getElementById('notif-config');
  if (!el) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

async function initialize() {
  const cfg = readConfig();
  if (!cfg || !cfg.hubUrl) return;
  const productMap = cfg.productMap || {};
  const pathname = window.location.pathname;

  try {
    const res = await fetch(`${cfg.hubUrl}/api/topics`);
    if (!res.ok) throw new Error(`topics ${res.status}`);
    const { product: topics } = await res.json();
    if (!topics || !topics.length) throw new Error('no topics');

    const client = new NotificationClient({
      hub: cfg.hubUrl,
      client: 'docs',
      version: cfg.version || undefined,
      topics,
      autoRecordImpressions: false,
      contextFilter: (post) =>
        inDocsScope(post.contexts && post.contexts.docs, pathname, productMap),
    });

    let manager;
    const storage = new LocalOnlyStorage({
      client: 'docs',
      onReconciled: () => manager && manager.notifyExternalChange(),
    });
    manager = new NotificationManager({ client, storage });

    initDrawer(manager, { pathname, productMap });
    initBanner(manager, { pathname, productMap });
    initBlocking(manager, { pathname, productMap });

    client.addEventListener('error', (e) => {
      const phase = e.detail && e.detail.phase;
      const err = e.detail && e.detail.error;
      console.warn('[notifications]', phase, err && err.message);
    });

    await manager.start();
    await client.start();
  } catch (err) {
    console.warn('[notifications] init failed, disabled:', err);
  }
}

export { initialize };
