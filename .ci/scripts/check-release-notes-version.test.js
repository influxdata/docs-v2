#!/usr/bin/env node
/**
 * Self-tests for check-release-notes-version.js.
 * Run: node .ci/scripts/check-release-notes-version.test.js
 *
 * These exercise the pure comparison/mapping logic in evaluate() with a fake
 * products object and an injected version lookup, plus parseEditionVersions()
 * with fixture text, so they don't touch disk.
 */
import assert from 'node:assert';
import {
  evaluate,
  parseEditionVersions,
} from './check-release-notes-version.js';

let pass = 0;
let fail = 0;
function test(name, fn) {
  try {
    fn();
    pass++;
    console.log(`ok - ${name}`);
  } catch (e) {
    fail++;
    console.error(`not ok - ${name}\n  ${e.message}`);
  }
}

const products = {
  influxdb3_core: { latest_patch: '3.10.3' },
  influxdb3_enterprise: { latest_patch: '3.10.3' },
  telegraf: { latest_patches: { v1: '1.39.1' } },
  influxdb: { latest_patches: { v2: '2.9.1', v1: '1.12.4' } },
};

const V3 = 'content/shared/v3-core-enterprise-release-notes/_index.md';

// Injected lookup: a `notesFile#edition` key wins over a bare `notesFile` key,
// mirroring the edition-aware default reader.
const lookup = (map) => (f, ed) => {
  const keyed = ed ? `${f}#${ed}` : null;
  if (keyed && keyed in map) return map[keyed];
  return f in map ? map[f] : null;
};

test('in sync → ok', () => {
  const r = evaluate(products, new Set([V3]), lookup({ [V3]: '3.10.3' }));
  assert.strictEqual(
    r.find((x) => x.product === 'influxdb3_core').status,
    'ok'
  );
});

test('notes newer than products.yml → drift (scalar field)', () => {
  const r = evaluate(products, new Set([V3]), lookup({ [V3]: '3.11.0' }));
  const c = r.find((x) => x.product === 'influxdb3_core');
  assert.strictEqual(c.status, 'drift');
  assert.strictEqual(c.documented, '3.11.0');
  assert.strictEqual(c.current, '3.10.3');
});

test('shared v3 file maps to both core and enterprise', () => {
  const r = evaluate(products, new Set([V3]), lookup({ [V3]: '3.11.0' }));
  const drifted = r.filter((x) => x.status === 'drift').map((x) => x.product);
  assert.ok(drifted.includes('influxdb3_core'));
  assert.ok(drifted.includes('influxdb3_enterprise'));
});

test('per-edition: Enterprise-only newer release does not flag Core', () => {
  // Enterprise documents 3.10.4, Core still at 3.10.3 (Core section pending).
  const r = evaluate(
    products,
    new Set([V3]),
    lookup({ [`${V3}#core`]: '3.10.3', [`${V3}#enterprise`]: '3.10.4' })
  );
  assert.strictEqual(
    r.find((x) => x.product === 'influxdb3_core').status,
    'ok'
  );
  assert.strictEqual(
    r.find((x) => x.product === 'influxdb3_enterprise').status,
    'drift'
  );
});

test('map-shaped product (telegraf v1) drift', () => {
  const f = 'content/telegraf/v1/release-notes.md';
  const r = evaluate(products, new Set([f]), lookup({ [f]: '1.40.0' }));
  const t = r.find((x) => x.product === 'telegraf');
  assert.strictEqual(t.status, 'drift');
  assert.strictEqual(t.current, '1.39.1');
});

test('telegraf in sync reports ok (not skipped)', () => {
  const f = 'content/telegraf/v1/release-notes.md';
  const r = evaluate(products, new Set([f]), lookup({ [f]: '1.39.1' }));
  assert.strictEqual(r.find((x) => x.product === 'telegraf').status, 'ok');
});

test('out-of-scope product is not included', () => {
  const r = evaluate(
    products,
    new Set(['content/telegraf/v1/release-notes.md']),
    lookup({})
  );
  assert.ok(!r.some((x) => x.product === 'influxdb3_core'));
});

test('products.yml ahead of notes → ahead status', () => {
  const r = evaluate(products, new Set([V3]), lookup({ [V3]: '3.10.2' }));
  assert.strictEqual(
    r.find((x) => x.product === 'influxdb3_core').status,
    'ahead'
  );
});

test('null changed set checks everything', () => {
  const r = evaluate(products, null, lookup({ [V3]: '3.10.3' }));
  assert.ok(r.length > 1);
});

test('parseEditionVersions: commented-out Core section is ignored', () => {
  const fixture = [
    '## v3.10.4 {date="2026-07-14"}',
    '',
    '<!-- Uncomment once Core v3.10.4 is released',
    '### Core',
    '#### Bug fixes',
    '- core thing',
    '-->',
    '',
    '### Enterprise',
    '#### Features',
    '- enterprise thing',
    '',
    '## v3.10.3 {date="2026-07-07"}',
    '',
    '### Core',
    '#### Bug fixes',
    '- core thing',
    '',
    '### Enterprise',
    '- enterprise thing',
    '',
  ].join('\n');
  const v = parseEditionVersions(fixture);
  assert.strictEqual(v.enterprise, '3.10.4'); // live at the top
  assert.strictEqual(v.core, '3.10.3'); // top Core is commented → next live one
});

test('parseEditionVersions: both live at top', () => {
  const fixture = [
    '## v3.10.5 {date="2026-07-20"}',
    '',
    '### Core',
    '- a',
    '',
    '### Enterprise',
    '- b',
    '',
  ].join('\n');
  const v = parseEditionVersions(fixture);
  assert.strictEqual(v.core, '3.10.5');
  assert.strictEqual(v.enterprise, '3.10.5');
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
