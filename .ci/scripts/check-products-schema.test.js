/**
 * Self-tests for check-products-schema.js.
 * Run: node --test .ci/scripts/check-products-schema.test.js
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import {
  check,
  schemaErrors,
  semanticErrors,
} from './check-products-schema.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const schema = JSON.parse(
  readFileSync(join(ROOT, 'scripts', 'schemas', 'products.schema.json'), 'utf8')
);
const gates = yaml.load(readFileSync(join(ROOT, '.ci', 'release-gates.yml')));

/** Minimal valid product; tests mutate a clone of this. */
const good = () => ({
  influxdb: {
    name: 'InfluxDB',
    namespace: 'influxdb',
    menu_category: 'self-managed',
    latest: 'v2.9',
    schema: {},
    versions: ['v2', 'v1'],
    content_path: { v2: 'influxdb/v2', v1: 'influxdb/v1' },
    latest_patches: { v2: '2.9.1', v1: '1.13.0' },
  },
  influxdb3_core: {
    name: 'InfluxDB 3 Core',
    namespace: 'influxdb3_core',
    menu_category: 'self-managed',
    latest: 'core',
    schema: {},
    versions: ['core'],
    content_path: 'influxdb3/core',
    latest_patch: '3.11.2',
  },
});

test('the real data/products.yml passes schema and semantic checks', () => {
  const products = yaml.load(
    readFileSync(join(ROOT, 'data', 'products.yml'), 'utf8')
  );
  assert.deepEqual(check(products, schema, gates), []);
});

test('minimal fixture passes', () => {
  assert.deepEqual(check(good(), schema, {}), []);
});

test('unknown field is rejected and named', () => {
  const p = good();
  p.influxdb3_core.latest_pacth = '3.11.3';
  const errs = schemaErrors(p, schema);
  assert.equal(errs.length, 1);
  assert.match(
    errs[0],
    /products\.influxdb3_core: unknown field "latest_pacth"/
  );
});

test('missing required field is rejected', () => {
  const p = good();
  delete p.influxdb3_core.namespace;
  assert.match(schemaErrors(p, schema)[0], /required property 'namespace'/);
});

test('numeric latest (unquoted YAML) is rejected with the quoting hint', () => {
  const p = good();
  p.influxdb3_core.latest = 1.1;
  const errs = schemaErrors(p, schema);
  assert.match(errs[0], /products\.influxdb3_core\.latest: must be a string/);
  assert.match(errs[0], /quote/);
});

test('latest_patch that is not MAJOR.MINOR.PATCH is rejected', () => {
  for (const bad of ['tbd', '3.12', '3.12.0-rc1', 'v3.12.0', '']) {
    const p = good();
    p.influxdb3_core.latest_patch = bad;
    const errs = schemaErrors(p, schema);
    assert.ok(errs.length, `expected an error for ${JSON.stringify(bad)}`);
    assert.match(errs[0], /products\.influxdb3_core\.latest_patch: must match/);
  }
});

test('null latest_patch is rejected', () => {
  const p = good();
  p.influxdb3_core.latest_patch = null;
  assert.match(schemaErrors(p, schema)[0], /latest_patch: must be a string/);
});

test('latest_patches values are validated too', () => {
  const p = good();
  p.influxdb.latest_patches.v1 = 'soon';
  assert.match(
    schemaErrors(p, schema)[0],
    /products\.influxdb\.latest_patches\.v1: must match/
  );
});

test('latest_patch and latest_patches together are rejected', () => {
  const p = good();
  p.influxdb.latest_patch = '2.9.1';
  assert.match(schemaErrors(p, schema)[0], /must not have both/);
});

test('bad menu_category lists the allowed values', () => {
  const p = good();
  p.influxdb3_core.menu_category = 'cloud';
  assert.match(schemaErrors(p, schema)[0], /self-managed, managed/);
});

test('per-version map keyed by an undeclared version is rejected', () => {
  const p = good();
  p.influxdb.latest_patches.v3 = '3.0.0';
  const errs = semanticErrors(p, {});
  assert.equal(errs.length, 1);
  assert.match(errs[0], /latest_patches\.v3: "v3" is not in versions/);
});

test('content_path map keyed by an undeclared version is rejected', () => {
  const p = good();
  p.influxdb.content_path.cloud = 'influxdb/cloud';
  assert.match(semanticErrors(p, {})[0], /content_path\.cloud/);
});

test('latest label must agree with the patch for that major', () => {
  const p = good();
  p.influxdb.latest_patches.v2 = '2.10.0'; // latest still v2.9
  const errs = semanticErrors(p, {});
  assert.equal(errs.length, 1);
  assert.match(
    errs[0],
    /latest: "v2\.9" disagrees with latest_patches\.v2 "2\.10\.0"/
  );
});

test('latest label check applies to latest_patch products', () => {
  const p = good();
  p.influxdb3_core.latest = '3.11';
  assert.deepEqual(semanticErrors(p, {}), []);
  p.influxdb3_core.latest = '3.12';
  assert.match(
    semanticErrors(p, {})[0],
    /disagrees with latest_patch "3\.11\.2"/
  );
});

test('non-numeric latest labels are not checked against the patch', () => {
  const p = good();
  p.influxdb3_core.latest = 'core';
  assert.deepEqual(semanticErrors(p, {}), []);
});

test('a release gate on a missing product or field is reported', () => {
  const p = good();
  const errs = semanticErrors(p, {
    nope: { field: 'latest_patch', team: 'influxdata/x' },
    influxdb: { field: 'latest_patches.v3', team: 'influxdata/x' },
    influxdb3_core: { field: 'latest_patch', team: 'influxdata/x' },
  });
  assert.equal(errs.length, 2);
  assert.match(errs[0], /gated product "nope" is not in products\.yml/);
  assert.match(errs[1], /"influxdb\.latest_patches\.v3" is not set/);
});

test('semantic checks are skipped while the schema fails', () => {
  const p = good();
  p.influxdb.latest_patches.v3 = 'tbd'; // schema error and a semantic error
  const errs = check(p, schema, {});
  assert.equal(errs.length, 1);
  assert.match(errs[0], /must match/);
});
