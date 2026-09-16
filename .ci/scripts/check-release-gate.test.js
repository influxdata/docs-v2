/**
 * Self-tests for check-release-gate.js.
 * Run: node --test .ci/scripts/check-release-gate.test.js
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  gatedBumps,
  latestReviewStates,
  evaluate,
  formatReport,
} from './check-release-gate.js';

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  'check-release-gate.js'
);

const gates = {
  enterprise_influxdb: {
    field: 'latest_patches.v1',
    team: 'influxdata/edge',
    note: 'Publishes to all Enterprise customers.',
  },
  influxdb3_enterprise: {
    field: 'latest_patch',
    team: 'influxdata/influxdb3-monolith-release-approvers',
  },
};

const base = {
  enterprise_influxdb: { latest_patches: { v1: '1.13.0' } },
  influxdb3_enterprise: { latest_patch: '3.11.3' },
  influxdb3_core: { latest_patch: '3.11.2' },
};

const review = (login, state, at, id = 1) => ({
  id,
  state,
  submitted_at: at,
  user: { login },
});

test('no change → no gated bumps', () => {
  assert.deepEqual(gatedBumps(base, structuredClone(base), gates), []);
});

test('ungated product bump does not trigger', () => {
  const head = structuredClone(base);
  head.influxdb3_core.latest_patch = '3.11.3';
  assert.deepEqual(gatedBumps(base, head, gates), []);
});

test('gated nested field bump triggers with from/to and team', () => {
  const head = structuredClone(base);
  head.enterprise_influxdb.latest_patches.v1 = '1.13.1';
  const bumps = gatedBumps(base, head, gates);
  assert.equal(bumps.length, 1);
  assert.equal(bumps[0].product, 'enterprise_influxdb');
  assert.equal(bumps[0].from, '1.13.0');
  assert.equal(bumps[0].to, '1.13.1');
  assert.equal(bumps[0].team, 'influxdata/edge');
});

test('gated scalar field bump triggers', () => {
  const head = structuredClone(base);
  head.influxdb3_enterprise.latest_patch = '3.11.4';
  const bumps = gatedBumps(base, head, gates);
  assert.equal(bumps.length, 1);
  assert.equal(bumps[0].product, 'influxdb3_enterprise');
});

test('a gate entry without field or team is a config error', () => {
  assert.throws(() => gatedBumps(base, base, { x: { field: 'latest_patch' } }));
});

test('latest decisive review per user wins; COMMENTED ignored', () => {
  const states = latestReviewStates([
    review('alice', 'APPROVED', '2026-09-01T10:00:00Z', 1),
    review('alice', 'COMMENTED', '2026-09-01T11:00:00Z', 2),
    review('bob', 'APPROVED', '2026-09-01T10:00:00Z', 3),
    review('bob', 'CHANGES_REQUESTED', '2026-09-01T12:00:00Z', 4),
    review('carol', 'APPROVED', '2026-09-01T10:00:00Z', 5),
    review('carol', 'DISMISSED', '2026-09-01T13:00:00Z', 6),
  ]);
  assert.equal(states.get('alice'), 'APPROVED');
  assert.equal(states.get('bob'), 'CHANGES_REQUESTED');
  assert.equal(states.get('carol'), 'DISMISSED');
});

const bump = {
  product: 'enterprise_influxdb',
  field: 'latest_patches.v1',
  from: '1.13.0',
  to: '1.13.1',
  team: 'influxdata/edge',
  note: 'n',
};

test('approval from a team member → approved', () => {
  const r = evaluate(
    [bump],
    [review('alice', 'APPROVED', '2026-09-01T10:00:00Z')],
    { 'influxdata/edge': ['Alice'] }
  );
  assert.equal(r[0].status, 'approved');
  assert.deepEqual(r[0].approvedBy, ['alice']);
});

test('approval from a non-member → missing', () => {
  const r = evaluate(
    [bump],
    [review('mallory', 'APPROVED', '2026-09-01T10:00:00Z')],
    { 'influxdata/edge': ['alice'] }
  );
  assert.equal(r[0].status, 'missing');
});

test('approval then changes-requested by the same member → missing', () => {
  const r = evaluate(
    [bump],
    [
      review('alice', 'APPROVED', '2026-09-01T10:00:00Z', 1),
      review('alice', 'CHANGES_REQUESTED', '2026-09-01T11:00:00Z', 2),
    ],
    { 'influxdata/edge': ['alice'] }
  );
  assert.equal(r[0].status, 'missing');
});

test('member approval for one gate does not satisfy another team gate', () => {
  const other = {
    ...bump,
    product: 'influxdb3_enterprise',
    field: 'latest_patch',
    team: 'influxdata/influxdb3-monolith-release-approvers',
  };
  const r = evaluate(
    [bump, other],
    [review('alice', 'APPROVED', '2026-09-01T10:00:00Z')],
    {
      'influxdata/edge': ['alice'],
      'influxdata/influxdb3-monolith-release-approvers': ['pm'],
    }
  );
  assert.equal(r[0].status, 'approved');
  assert.equal(r[1].status, 'missing');
});

test('unresolvable team → unresolved (fails closed)', () => {
  const r = evaluate(
    [bump],
    [review('alice', 'APPROVED', '2026-09-01T10:00:00Z')],
    { 'influxdata/edge': null }
  );
  assert.equal(r[0].status, 'unresolved');
  const r2 = evaluate([bump], [], {});
  assert.equal(r2[0].status, 'unresolved');
});

test('report names the team and note when blocked', () => {
  const text = formatReport(evaluate([bump], [], { 'influxdata/edge': [] }));
  assert.match(text, /@influxdata\/edge/);
  assert.match(text, /1\.13\.0 → 1\.13\.1/);
  assert.match(text, /\n  n\n/);
});

test('report is quiet when nothing is gated', () => {
  assert.match(formatReport([]), /No gated version bump/);
});

for (const [label, value] of [
  ['null', null],
  ['empty string', ''],
  ['whitespace', '   '],
  ['nested map', { v1: '1.13.1' }],
]) {
  test(`gated value set to ${label} → invalid; approval cannot clear it`, () => {
    const head = structuredClone(base);
    head.influxdb3_enterprise.latest_patch = value;
    const bumps = gatedBumps(base, head, gates);
    assert.equal(bumps.length, 1);
    assert.equal(bumps[0].invalid, true);
    const r = evaluate(
      bumps,
      [review('pm', 'APPROVED', '2026-09-01T10:00:00Z')],
      { 'influxdata/influxdb3-monolith-release-approvers': ['pm'] }
    );
    assert.equal(r[0].status, 'invalid');
    assert.match(formatReport(r), /empty or not a version/);
  });
}

test('a value that is unusable on both sides does not trigger', () => {
  const b = structuredClone(base);
  b.influxdb3_enterprise.latest_patch = null;
  assert.deepEqual(gatedBumps(b, structuredClone(b), gates), []);
});

test('CLI exits 2 with a clear error on unreadable or malformed products.yml', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'release-gate-'));
  const good = join(tmp, 'good.yml');
  const bad = join(tmp, 'bad.yml');
  writeFileSync(good, 'influxdb3_enterprise:\n  latest_patch: 3.11.3\n');
  writeFileSync(bad, 'influxdb3_enterprise:\n  latest_patch: [unclosed\n');
  const gatesFile = join(tmp, 'gates.yml');
  writeFileSync(
    gatesFile,
    'influxdb3_enterprise:\n  field: latest_patch\n  team: influxdata/x\n'
  );
  const run = (head) =>
    spawnSync(
      process.execPath,
      [SCRIPT, '--base', good, '--head', head, '--gates', gatesFile],
      { encoding: 'utf8' }
    );
  const malformed = run(bad);
  assert.equal(malformed.status, 2);
  assert.match(malformed.stderr, /cannot parse .*bad\.yml/);
  const missing = run(join(tmp, 'nope.yml'));
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /cannot read .*nope\.yml/);
});
