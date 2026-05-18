import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePath,
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

test('bare token resolves to /token/ namespace prefix', () => {
  assert.equal(
    entryMatches('telegraf', '/telegraf/controller/', productMap),
    true
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
