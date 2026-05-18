/*
  Pure path-matching for the docs notification context. No DOM, no imports —
  unit-tested with `node --test`. Shared by the boot module's contextFilter
  (scope/exclude) and the effective-presentation logic (display_override).

  An entry resolves in this order:
    1. "home", "/", or "" -> the exact home page only
    2. product key        -> productMap[key] content-path prefixes
    3. literal path "/x"  -> that path as a startsWith prefix
    4. bare token "tel"   -> "/tel/" namespace prefix
*/

export function normalizePath(pathname) {
  let p = pathname || '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p !== '/' && !p.endsWith('/')) p = p + '/';
  return p;
}

function withTrailingSlash(p) {
  return p.endsWith('/') ? p : p + '/';
}

export function resolveEntry(entry, productMap) {
  if (entry === 'home' || entry === '/' || entry === '') return { home: true };
  if (entry.startsWith('/')) return { prefixes: [withTrailingSlash(entry)] };
  if (productMap && productMap[entry]) {
    return { prefixes: productMap[entry].map(withTrailingSlash) };
  }
  return { prefixes: [`/${entry}/`] };
}

export function entryMatches(entry, pathname, productMap) {
  const resolved = resolveEntry(entry, productMap);
  if (resolved.home) return normalizePath(pathname) === '/';
  const path = normalizePath(pathname);
  return resolved.prefixes.some((pre) => path.startsWith(pre));
}

export function matchesAny(entries, pathname, productMap) {
  if (!entries || entries.length === 0) return false;
  return entries.some((e) => entryMatches(e, pathname, productMap));
}

export function inDocsScope(docsCtx, pathname, productMap) {
  if (!docsCtx) return true;
  const scope = docsCtx.scope || [];
  const exclude = docsCtx.exclude || [];
  const inScope = scope.length === 0 || matchesAny(scope, pathname, productMap);
  const excluded = matchesAny(exclude, pathname, productMap);
  return inScope && !excluded;
}
