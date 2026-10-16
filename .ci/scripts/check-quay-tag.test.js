#!/usr/bin/env node
/**
 * Tests for check-quay-tag.js.
 * Run: node --test .ci/scripts/check-quay-tag.test.js
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findQuayTagErrors } from './check-quay-tag.js';

const SHA_A = '3ba97c65f1ee4e1f127a8266517d4d2083b7ea39';
const SHA_B = '7dd361197ee2834eaa56089b67ffe59ad02e349a';

const core = (patch, tag) => ({
  influxdb3_core: { latest_patch: patch, latest_quay_tag: tag },
});

test('passes when nothing changes', () => {
  assert.deepEqual(
    findQuayTagErrors(core('3.12.0', SHA_A), core('3.12.0', SHA_A)),
    []
  );
});

test('passes when version and tag change together', () => {
  assert.deepEqual(
    findQuayTagErrors(core('3.12.0', SHA_A), core('3.13.0', SHA_B)),
    []
  );
});

test('fails when version changes and tag does not', () => {
  const errors = findQuayTagErrors(
    core('3.12.0', SHA_A),
    core('3.13.0', SHA_A)
  );
  assert.equal(errors.length, 1);
  assert.match(
    errors[0],
    /influxdb3_core: latest_patch changed \(3\.12\.0 → 3\.13\.0\)/
  );
});

test('passes when only the tag changes (tag correction)', () => {
  assert.deepEqual(
    findQuayTagErrors(core('3.12.0', SHA_A), core('3.12.0', SHA_B)),
    []
  );
});

test('fails when the tag is removed', () => {
  const errors = findQuayTagErrors(core('3.12.0', SHA_A), {
    influxdb3_core: { latest_patch: '3.12.0' },
  });
  assert.deepEqual(errors, ['influxdb3_core: latest_quay_tag is missing.']);
});

test('fails when the tag is not a full commit SHA', () => {
  const errors = findQuayTagErrors(
    core('3.12.0', SHA_A),
    core('3.13.0', '3.13.0')
  );
  assert.equal(errors.length, 1);
  assert.match(errors[0], /isn't a full 40-character commit SHA/);
});

test('fails when a SHA-like value is truncated', () => {
  const errors = findQuayTagErrors({}, core('3.12.0', SHA_A.slice(0, 7)));
  assert.equal(errors.length, 1);
});

test('ignores products without latest_quay_tag', () => {
  const old = {
    telegraf: { latest_patches: { v1: '1.39.1' } },
    influxdb3_clustered: { latest_patch: '20260101' },
  };
  const next = {
    telegraf: { latest_patches: { v1: '1.40.0' } },
    influxdb3_clustered: { latest_patch: '20260201' },
  };
  assert.deepEqual(findQuayTagErrors(old, next), []);
});

test('accepts a new product that adds a valid tag', () => {
  assert.deepEqual(findQuayTagErrors({}, core('3.12.0', SHA_A)), []);
});

test('tolerates an empty or unreadable base file', () => {
  assert.deepEqual(findQuayTagErrors(null, core('3.12.0', SHA_A)), []);
});

test('accepts the current data/products.yml', async () => {
  const { readFileSync } = await import('node:fs');
  const yaml = (await import('js-yaml')).default;
  const products = yaml.load(
    readFileSync(new URL('../../data/products.yml', import.meta.url), 'utf8')
  );
  assert.deepEqual(findQuayTagErrors(products, products), []);
  for (const key of ['influxdb3_core', 'influxdb3_enterprise']) {
    assert.ok(products[key].latest_quay_tag, `${key} defines latest_quay_tag`);
  }
});
