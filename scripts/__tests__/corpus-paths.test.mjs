/**
 * Tests for scripts/lib/corpus-paths.js.
 *
 * Run with: node --test scripts/__tests__/corpus-paths.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCorpusPaths } from '../lib/corpus-paths.js';

test('returns empty array for empty products', () => {
  assert.deepEqual(getCorpusPaths({}), []);
});

test('skips products without content_path', () => {
  const products = {
    foo: { name: 'Foo', namespace: 'foo' }, // no content_path
    bar: { name: 'Bar', namespace: 'bar', content_path: null },
  };
  assert.deepEqual(getCorpusPaths(products), []);
});

test('flat content_path with version not in path: appends version', () => {
  const products = {
    telegraf: {
      name: 'Telegraf',
      namespace: 'telegraf',
      content_path: 'telegraf',
      versions: ['v1'],
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0], {
    key: 'telegraf',
    name: 'Telegraf',
    path: 'telegraf/v1',
    version: 'v1',
  });
});

test('flat content_path with version already in path: uses as-is', () => {
  const products = {
    influxdb3_core: {
      name: 'InfluxDB 3 Core',
      content_path: 'influxdb3/core',
      versions: ['core'],
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result.length, 1);
  assert.equal(result[0].path, 'influxdb3/core');
});

test('flat content_path with no versions: uses path as-is', () => {
  const products = {
    explorer: {
      name: 'InfluxDB 3 Explorer',
      content_path: 'influxdb3/explorer',
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result.length, 1);
  assert.equal(result[0].path, 'influxdb3/explorer');
  assert.equal(result[0].version, null);
});

test('object content_path: yields one entry per version', () => {
  const products = {
    influxdb: {
      name: 'InfluxDB',
      name__v2: 'InfluxDB OSS v2',
      name__v1: 'InfluxDB OSS v1',
      content_path: { v2: 'influxdb/v2', v1: 'influxdb/v1' },
      versions: ['v2', 'v1'],
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result.length, 2);
  const v2 = result.find((r) => r.version === 'v2');
  const v1 = result.find((r) => r.version === 'v1');
  assert.equal(v2.path, 'influxdb/v2');
  assert.equal(v2.name, 'InfluxDB OSS v2'); // uses name__v2
  assert.equal(v1.path, 'influxdb/v1');
  assert.equal(v1.name, 'InfluxDB OSS v1'); // uses name__v1
});

test('falls back to product.name when name__<version> missing', () => {
  const products = {
    foo: {
      name: 'Foo',
      content_path: { v1: 'foo/v1' },
      versions: ['v1'],
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result[0].name, 'Foo');
});

test('handles multiple versions on a single flat content_path', () => {
  const products = {
    bar: {
      name: 'Bar',
      content_path: 'bar',
      versions: ['v1', 'v2'],
    },
  };
  const result = getCorpusPaths(products);
  assert.equal(result.length, 2);
  assert.deepEqual(
    result.map((r) => r.path).sort(),
    ['bar/v1', 'bar/v2']
  );
});
