/*
  Computes a post's presentation after applying docs display_override against
  the current path, and provides severity-aware sorting + surface bucketing.
  Pure — unit-tested with `node --test`.
*/

import { matchesAny } from './scope-matcher.js';

const PRECEDENCE = ['blocking', 'banner', 'drawer']; // most intrusive first
const SEVERITY_RANK = { critical: 0, warning: 1, info: 2 };

export function effectivePresentation(post, pathname, productMap) {
  const native = post.presentation || 'drawer';
  const docsCtx = post.contexts && post.contexts.docs;
  const override = docsCtx && docsCtx.display_override;
  if (!override) return native;
  for (const presentation of PRECEDENCE) {
    const entries = override[presentation];
    if (entries && matchesAny(entries, pathname, productMap))
      return presentation;
  }
  return native;
}

export function sortPosts(items) {
  return [...items].sort((a, b) => {
    const ra = SEVERITY_RANK[a.post.severity] ?? 3;
    const rb = SEVERITY_RANK[b.post.severity] ?? 3;
    if (ra !== rb) return ra - rb;
    // UUIDv7 ids are time-ordered: lexical desc == newest first
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });
}

export function bucketBySurface(items, pathname, productMap) {
  const banner = [];
  const blocking = [];
  for (const item of items) {
    if (item.dismissed || item.read) continue;
    const presentation = effectivePresentation(item.post, pathname, productMap);
    if (presentation === 'banner') banner.push(item);
    else if (presentation === 'blocking') blocking.push(item);
  }
  return {
    banner: sortPosts(banner),
    blocking: sortPosts(blocking),
  };
}
