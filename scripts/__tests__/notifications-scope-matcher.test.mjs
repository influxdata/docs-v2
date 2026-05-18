import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePath,
  resolveEntry,
  entryMatches,
  matchesAny,
  inDocsScope,
} from '../../assets/js/notifications/scope-matcher.js';

const productMap = {
  influxdb3_core: ['/influxdb3/core/'],
  telegraf: ['/telegraf/'],
  influxdb: ['/influxdb/v2/', '/influxdb/v1/'],
};

test('normalizePath adds leading and trailing slash', () => {
  assert.equal(normalizePath('influxdb3/core'), '/influxdb3/core/');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath(''), '/');
});

test('home matches only the exact home page', () => {
  assert.equal(entryMatches('home', '/', productMap), true);
  assert.equal(entryMatches('home', '/telegraf/', productMap), false);
});

test('product key expands to its content path prefix', () => {
  assert.equal(
    entryMatches('influxdb3_core', '/influxdb3/core/admin/', productMap),
    true
  );
  assert.equal(
    entryMatches('influxdb3_core', '/influxdb3/enterprise/', productMap),
    false
  );
});

test('product key with multiple content paths matches any', () => {
  assert.equal(
    entryMatches('influxdb', '/influxdb/v1/query/', productMap),
    true
  );
});

test('product key takes precedence over bare-token fallback', () => {
  assert.equal(
    entryMatches('telegraf', '/telegraf/controller/', productMap),
    true
  );
});

test('bare token (not a product key) resolves to /token/ prefix', () => {
  assert.equal(entryMatches('chronograf', '/chronograf/v1/', productMap), true);
  assert.equal(
    entryMatches('chronograf', '/influxdb3/core/', productMap),
    false
  );
  assert.equal(entryMatches('influxdb3', '/influxdb3/core/', productMap), true);
});

test('literal path entry uses startsWith, no substring bleed', () => {
  assert.equal(
    entryMatches('/telegraf/v1.11/', '/telegraf/v1.11/agent/', productMap),
    true
  );
  assert.equal(
    entryMatches('/influxdb3/', '/influxdb3-foo/', productMap),
    false
  );
});

test('inDocsScope: absent context shows everywhere', () => {
  assert.equal(inDocsScope(undefined, '/anything/', productMap), true);
});

test('inDocsScope: empty scope shows everywhere, exclude subtracts', () => {
  assert.equal(
    inDocsScope({ exclude: ['/telegraf/'] }, '/influxdb3/core/', productMap),
    true
  );
  assert.equal(
    inDocsScope({ exclude: ['/telegraf/'] }, '/telegraf/x/', productMap),
    false
  );
});

test('inDocsScope: home + product, no excludes needed', () => {
  const ctx = { scope: ['home', 'telegraf'] };
  assert.equal(inDocsScope(ctx, '/', productMap), true);
  assert.equal(inDocsScope(ctx, '/telegraf/controller/', productMap), true);
  assert.equal(inDocsScope(ctx, '/influxdb3/core/', productMap), false);
});

test('matchesAny is false for empty/missing list', () => {
  assert.equal(matchesAny([], '/x/', productMap), false);
  assert.equal(matchesAny(undefined, '/x/', productMap), false);
});

// Fix 3: direct resolveEntry coverage
test('resolveEntry: home/slash/empty all resolve to the home sentinel', () => {
  assert.deepEqual(resolveEntry('home', productMap), { home: true });
  assert.deepEqual(resolveEntry('/', productMap), { home: true });
  assert.deepEqual(resolveEntry('', productMap), { home: true });
});

test('resolveEntry: product key expands to all its prefixes', () => {
  assert.deepEqual(resolveEntry('influxdb', productMap), {
    prefixes: ['/influxdb/v2/', '/influxdb/v1/'],
  });
});

test('resolveEntry: literal path gets a trailing slash', () => {
  assert.deepEqual(resolveEntry('/telegraf/v1.11', productMap), {
    prefixes: ['/telegraf/v1.11/'],
  });
});

// Fix 4: null-safety + scope/exclude composition
test('normalizePath handles null/undefined', () => {
  assert.equal(normalizePath(null), '/');
  assert.equal(normalizePath(undefined), '/');
});

test('inDocsScope: multi-prefix scope with subtractive exclude', () => {
  const ctx = { scope: ['influxdb'], exclude: ['/influxdb/v1/'] };
  assert.equal(inDocsScope(ctx, '/influxdb/v2/write/', productMap), true);
  assert.equal(inDocsScope(ctx, '/influxdb/v1/query/', productMap), false);
  assert.equal(inDocsScope(ctx, '/telegraf/', productMap), false);
});

test('literal "/" entry behaves as home, not a wildcard', () => {
  assert.equal(entryMatches('/', '/', productMap), true);
  assert.equal(entryMatches('/', '/telegraf/', productMap), false);
  assert.equal(
    inDocsScope({ scope: ['/'] }, '/influxdb3/core/', productMap),
    false
  );
});
