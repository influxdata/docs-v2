/*
  Notification system boot. Fetches the canonical topic list, constructs the
  hub client + manager + per-browser storage, and wires the drawer / banner /
  blocking views. Non-critical: any failure logs and leaves the page
  untouched.

  Scope/exclude/display_override is enforced at RENDER time per page (in the
  view layer via inDocsScope + bucketBySurface), NOT at ingest. Storage is
  the source of truth and holds every live post; each page evaluates scope
  freshly against window.location.pathname. Filtering at ingest would couple
  storage contents to whichever page the post first arrived on, leaking
  stored posts to pages where they shouldn't render.
*/

import {
  NotificationClient,
  NotificationManager,
  LocalOnlyStorage,
} from '@influxdata/notification-hub-client';
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

/*
  Console helper — clears every `influxdata_notif*` localStorage key (the
  client library's instance-id, last-id cursor, and items cache for this
  client) and reloads the page. Useful when a notification didn't arrive
  due to the cursor gap, or when iterating on storage state during dev.

  Usage (in DevTools console):
    influxdatadocs.notifications.resetStorage();          // clears + reloads
    influxdatadocs.notifications.resetStorage({ reload: false }); // clears only

  Returns the array of cleared keys.
*/
function resetStorage({ reload = true } = {}) {
  const removed = [];
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('influxdata_notif')) {
      localStorage.removeItem(key);
      removed.push(key);
    }
  }
  console.info('[notifications] reset storage; cleared keys:', removed);
  if (reload) location.reload();
  return removed;
}

// Diagnostic — surface the hub's client_registry state for this `client: 'docs'`
// identity. Populated after `client.start()` resolves; reads as 'unknown' until
// then (and also when the JWT can't be decoded). One of 'unknown' / 'ignored' /
// 'known' / 'disabled'. 'disabled' itself is unreachable here — disabled clients
// fail token mint and never expose a getter — but it's still useful to read
// 'known' vs 'unknown' to confirm whether `allowedClients` filtering is active.
let activeClient = null;
function getClientState() {
  return activeClient ? activeClient.clientState : 'unknown';
}

// Expose console helpers on the docs global. Defensive: if main.js hasn't
// initialized the namespace yet, create it (it merges its own props later).
if (typeof window !== 'undefined') {
  window.influxdatadocs = window.influxdatadocs || {};
  window.influxdatadocs.notifications =
    window.influxdatadocs.notifications || {};
  window.influxdatadocs.notifications.resetStorage = resetStorage;
  window.influxdatadocs.notifications.getClientState = getClientState;
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
      // No contextFilter: store every live post. Scope/exclude/display_override
      // is applied per-page at render time in the view layer.
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
      const msg = (err && err.message) || '';
      // 1.1 contract: a `token`-phase 403 means an admin has explicitly
      // disabled this client id in the hub's client_registry. The client lib
      // throws `subscriber-token failed: 403` for this case. Don't retry; just
      // surface it more loudly so it's recognizable in logs. Other phases
      // (`catchup`, `sse`, `analytics`) stay at warn-level.
      if (phase === 'token' && msg.includes('403')) {
        console.warn(
          '[notifications] hub disabled this client; notifications are off'
        );
        return;
      }
      console.warn('[notifications]', phase, msg);
    });

    activeClient = client;
    await manager.start();
    await client.start();

    // manager.start() hydrates LocalOnlyStorage from localStorage silently
    // (no `change` event), and catch-up dedups already-stored posts — so the
    // views' initial render (run before start()) shows a stale empty state
    // until the next live event or user interaction. Force one render now so
    // restored unread items (e.g. the bell counter) paint on page load.
    manager.notifyExternalChange();
  } catch (err) {
    console.warn('[notifications] init failed, disabled:', err);
  }
}

export { initialize };
