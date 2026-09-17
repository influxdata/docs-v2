/**
 * Self-tests for check-release-gate.js.
 * Run: node --test .ci/scripts/check-release-gate.test.js
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import {
  gatedBumps,
  latestReviewStates,
  evaluate,
  formatReport,
  mergeGates,
} from './check-release-gate.js';

const SCRIPT = join(
  dirname(fileURLToPath(import.meta.url)),
  'check-release-gate.js'
);

const gates = {
  enterprise_influxdb: {
    field: 'latest_patches.v1',
    team: 'influxdata/influxdb-v1-release-owners',
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
  assert.equal(bumps[0].team, 'influxdata/influxdb-v1-release-owners');
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
  team: 'influxdata/influxdb-v1-release-owners',
  note: 'n',
};

test('approval from a team member → approved', () => {
  const r = evaluate(
    [bump],
    [review('alice', 'APPROVED', '2026-09-01T10:00:00Z')],
    { 'influxdata/influxdb-v1-release-owners': ['Alice'] }
  );
  assert.equal(r[0].status, 'approved');
  assert.deepEqual(r[0].approvedBy, ['alice']);
});

test('approval from a non-member → missing', () => {
  const r = evaluate(
    [bump],
    [review('mallory', 'APPROVED', '2026-09-01T10:00:00Z')],
    { 'influxdata/influxdb-v1-release-owners': ['alice'] }
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
    { 'influxdata/influxdb-v1-release-owners': ['alice'] }
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
      'influxdata/influxdb-v1-release-owners': ['alice'],
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
    { 'influxdata/influxdb-v1-release-owners': null }
  );
  assert.equal(r[0].status, 'unresolved');
  const r2 = evaluate([bump], [], {});
  assert.equal(r2[0].status, 'unresolved');
});

test('report names the team and note when blocked', () => {
  const text = formatReport(
    evaluate([bump], [], { 'influxdata/influxdb-v1-release-owners': [] })
  );
  assert.match(text, /@influxdata\/influxdb-v1-release-owners/);
  assert.match(text, /1\.13\.0 → 1\.13\.1/);
  assert.match(text, /\n {2}n\n/);
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

test('mergeGates: a gate deleted on the head still applies', () => {
  const merged = mergeGates(gates, {});
  assert.deepEqual(Object.keys(merged).sort(), Object.keys(gates).sort());
});

test('mergeGates: the base team wins when the head repoints a gate', () => {
  const merged = mergeGates(gates, {
    enterprise_influxdb: { field: 'latest_patch', team: 'influxdata/friendly' },
  });
  assert.equal(
    merged.enterprise_influxdb.team,
    'influxdata/influxdb-v1-release-owners'
  );
  assert.equal(merged.enterprise_influxdb.field, 'latest_patches.v1');
});

test('mergeGates: a head-only gate is an addition and applies', () => {
  const merged = mergeGates(
    {},
    { telegraf: { field: 'latest_patches.v1', team: 'influxdata/t' } }
  );
  assert.equal(merged.telegraf.team, 'influxdata/t');
});

test('a PR that bumps and deletes its gate in one commit still triggers', () => {
  const head = structuredClone(base);
  head.enterprise_influxdb.latest_patches.v1 = '1.13.1';
  // Head policy drops the enterprise gate entirely.
  const headGates = { influxdb3_enterprise: gates.influxdb3_enterprise };
  const bumps = gatedBumps(base, head, mergeGates(gates, headGates));
  assert.equal(bumps.length, 1);
  assert.equal(bumps[0].product, 'enterprise_influxdb');
  assert.equal(bumps[0].team, 'influxdata/influxdb-v1-release-owners');
});

test('a value that is unusable on both sides does not trigger', () => {
  const b = structuredClone(base);
  b.influxdb3_enterprise.latest_patch = null;
  assert.deepEqual(gatedBumps(b, structuredClone(b), gates), []);
});

/**
 * --print-teams drives the workflow's `triggered` output, so its stdout is a
 * contract: one team per line, nothing at all when no gate fires.
 */
describe('--print-teams', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'release-gate-teams-'));
  const write = (name, obj) => {
    const p = join(tmp, name);
    writeFileSync(p, yaml.dump(obj));
    return p;
  };
  const twoGates = {
    influxdb3_core: { field: 'latest_patch', team: 'influxdata/monolith' },
    influxdb3_enterprise: {
      field: 'latest_patch',
      team: 'influxdata/monolith',
    },
    enterprise_influxdb: {
      field: 'latest_patches.v1',
      team: 'influxdata/v1',
    },
  };
  const products = {
    influxdb3_core: { latest_patch: '3.11.4' },
    influxdb3_enterprise: { latest_patch: '3.11.4' },
    enterprise_influxdb: { latest_patches: { v1: '1.12.4' } },
  };
  const printTeams = (extra) =>
    spawnSync(process.execPath, [SCRIPT, '--print-teams', ...extra], {
      encoding: 'utf8',
    });

  test('prints nothing when no gated field changed', () => {
    const base = write('same-a.yml', products);
    const head = write('same-b.yml', products);
    const r = printTeams([
      '--base',
      base,
      '--head',
      head,
      '--gates',
      write('g1.yml', twoGates),
    ]);
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), '');
  });

  test('prints one line per team, deduplicated across products', () => {
    const head = structuredClone(products);
    head.influxdb3_core.latest_patch = '3.11.5';
    head.influxdb3_enterprise.latest_patch = '3.11.5';
    const r = printTeams([
      '--base',
      write('base-a.yml', products),
      '--head',
      write('head-a.yml', head),
      '--gates',
      write('g2.yml', twoGates),
    ]);
    assert.equal(r.status, 0);
    assert.deepEqual(r.stdout.trim().split('\n'), ['influxdata/monolith']);
  });

  test('prints every distinct team when gates for two teams fire', () => {
    const head = structuredClone(products);
    head.influxdb3_core.latest_patch = '3.11.5';
    head.enterprise_influxdb.latest_patches.v1 = '1.12.5';
    const r = printTeams([
      '--base',
      write('base-b.yml', products),
      '--head',
      write('head-b.yml', head),
      '--gates',
      write('g3.yml', twoGates),
    ]);
    assert.equal(r.status, 0);
    assert.deepEqual(r.stdout.trim().split('\n').sort(), [
      'influxdata/monolith',
      'influxdata/v1',
    ]);
  });

  test('honors base precedence when the head policy drops the gate', () => {
    const head = structuredClone(products);
    head.influxdb3_core.latest_patch = '3.11.5';
    const r = printTeams([
      '--base',
      write('base-c.yml', products),
      '--head',
      write('head-c.yml', head),
      '--gates-base',
      write('g-base.yml', twoGates),
      '--gates-head',
      write('g-head.yml', {
        enterprise_influxdb: twoGates.enterprise_influxdb,
      }),
    ]);
    assert.equal(r.status, 0);
    assert.deepEqual(r.stdout.trim().split('\n'), ['influxdata/monolith']);
  });
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
