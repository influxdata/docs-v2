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
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import {
  emitWarnings,
  evaluate,
  evaluateNotifications,
  buildReport,
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
const OSS_V1 = 'content/influxdb/v1/about_the_project/release-notes.md';
const ENTERPRISE_V1 =
  'content/enterprise_influxdb/v1/about-the-project/release-notes.md';

const patchNotification = {
  id: 'oss-release',
  title: 'InfluxDB OSS 1.13.1 is now available',
  message:
    '[Release notes](/influxdb/v1/about_the_project/release-notes/#v1131)',
};

test('latest-patch notification mismatch is reported even when release notes and product data agree', () => {
  const current = { influxdb: { latest_patches: { v1: '1.13.2' } } };
  const checked = evaluate(current, new Set([OSS_V1]), () => '1.13.2');
  const results = evaluateNotifications(current, [patchNotification], checked);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].status, 'notification-drift');
  assert.strictEqual(results[0].announced, '1.13.1');
  assert.strictEqual(results[0].current, '1.13.2');
  const warnings = [];
  emitWarnings(results, (warning) => warnings.push(warning));
  assert.ok(warnings[0].includes('file=data/notifications.yaml'));
  assert.ok(warnings[0].includes('oss-release'));
  assert.ok(buildReport(checked, results).includes('1.13.1'));
});

test('matching patch announcement reports in sync', () => {
  const checked = evaluate(products, new Set([OSS_V1]), () => '1.12.4');
  const results = evaluateNotifications(
    products,
    [
      {
        ...patchNotification,
        title: 'InfluxDB OSS 1.12.4 is now available',
      },
    ],
    checked
  );
  assert.strictEqual(results[0].status, 'ok');
});

test('minor-release announcements and historical advisory notifications are excluded', () => {
  const checked = evaluate(products, null, () => null);
  const results = evaluateNotifications(
    products,
    [
      { ...patchNotification, title: 'InfluxDB OSS 1.13 is now available' },
      {
        ...patchNotification,
        title: 'InfluxDB OSS 1.13.1: API tokens are hashed by default',
      },
    ],
    checked
  );
  assert.deepStrictEqual(results, []);
});

test('notification product comes from its release-notes link, not related product mentions', () => {
  const current = {
    influxdb: { latest_patches: { v1: '1.13.2' } },
    enterprise_influxdb: { latest_patches: { v1: '1.13.1' } },
  };
  const checked = evaluate(current, new Set([ENTERPRISE_V1]), () => null);
  const results = evaluateNotifications(
    current,
    [
      {
        id: 'enterprise-release',
        title: 'InfluxDB Enterprise 1.13.1 is now available',
        slug: 'Includes OSS 1.13.0 updates.',
        message:
          '[Release notes](/enterprise_influxdb/v1/about-the-project/release-notes/#v1131)',
      },
    ],
    checked
  );
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].product, 'enterprise_influxdb');
  assert.strictEqual(results[0].status, 'ok');
});

test('unrelated product edits do not report OSS notification mismatches', () => {
  const checked = evaluate(products, new Set([V3]), () => '3.10.3');
  assert.deepStrictEqual(
    evaluateNotifications(products, [patchNotification], checked),
    []
  );
});

test('Core and Enterprise patch announcements use their own product versions', () => {
  const current = {
    influxdb3_core: { latest_patch: '3.12.2' },
    influxdb3_enterprise: { latest_patch: '3.12.3' },
  };
  const checked = evaluate(current, new Set([V3]), () => null);
  const notifications = ['core', 'enterprise'].map((edition) => ({
    id: `${edition}-patch`,
    title: `InfluxDB 3 ${edition} 3.12.2 is now available`,
    slug: `[Release notes](/influxdb3/${edition}/release-notes/#v3122)`,
  }));
  const results = evaluateNotifications(current, notifications, checked);
  assert.strictEqual(results.length, 2);
  assert.strictEqual(results[0].product, 'influxdb3_core');
  assert.strictEqual(results[0].status, 'ok');
  assert.strictEqual(results[1].product, 'influxdb3_enterprise');
  assert.strictEqual(results[1].status, 'notification-drift');
});

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

test('drift annotations write outside the Markdown report stream', () => {
  const warnings = [];
  emitWarnings(
    [
      {
        status: 'drift',
        notesFile: V3,
        documented: '3.11.0',
        selector: 'latest_patch',
        product: 'influxdb3_core',
        current: '3.10.3',
      },
    ],
    (warning) => warnings.push(warning)
  );
  assert.deepStrictEqual(warnings, [
    `::warning file=${V3}::Release notes show v3.11.0 but ` +
      'data/products.yml latest_patch for influxdb3_core is 3.10.3 — bump products.yml.',
  ]);
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

for (const file of ['data/products.yml', 'data/notifications.yaml']) {
  test(`${file} checks every tracked product`, () => {
    const versions = lookup({ [OSS_V1]: '1.13.2' });
    const results = evaluate(products, new Set([file]), versions);
    assert.deepStrictEqual(results, evaluate(products, null, versions));
    const oss = results.find(
      (r) => r.product === 'influxdb' && r.selector === 'latest_patches.v1'
    );
    assert.strictEqual(oss.status, 'drift');
    assert.strictEqual(oss.documented, '1.13.2');
  });
}

test('Enterprise v1 link correction also detects inherited OSS version drift', () => {
  const results = evaluate(
    { ...products, enterprise_influxdb: { latest_patches: { v1: '1.13.1' } } },
    new Set([ENTERPRISE_V1]),
    lookup({ [OSS_V1]: '1.13.2', [ENTERPRISE_V1]: '1.13.1' })
  );
  assert.strictEqual(
    results.find((r) => r.product === 'enterprise_influxdb').status,
    'ok'
  );
  assert.strictEqual(
    results.find((r) => r.product === 'influxdb').status,
    'drift'
  );
  assert.ok(!results.some((r) => r.product === 'influxdb3_core'));
});

test('OSS v1 release edits also check Enterprise without assuming equal versions', () => {
  const results = evaluate(
    { ...products, enterprise_influxdb: { latest_patches: { v1: '1.13.1' } } },
    new Set([OSS_V1]),
    lookup({ [OSS_V1]: '1.12.4', [ENTERPRISE_V1]: '1.13.1' })
  );
  assert.strictEqual(results.length, 2);
  assert.ok(results.every((r) => r.status === 'ok'));
});

test('workflow triggers on notifications, product data, and checker tests', () => {
  const workflow = yaml.load(
    readFileSync(
      new URL('../../.github/workflows/pr-release-check.yml', import.meta.url),
      'utf8'
    )
  );
  for (const path of [
    'data/notifications.yaml',
    'data/products.yml',
    '.ci/scripts/check-release-notes-version.test.js',
  ])
    assert.ok(workflow.on.pull_request.paths.includes(path), path);
  assert.ok(
    workflow.jobs['version-reminder'].steps.some((step) =>
      step.run?.includes('node .ci/scripts/check-release-notes-version.test.js')
    )
  );
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
