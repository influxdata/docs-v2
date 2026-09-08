import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCoverage,
  compareToBaseline,
  formatCoverageTable,
} from '../coverage.js';

const PLUGINS = [
  { name: 'notifier', slug: 'notifier', stubSlug: 'notifier' },
  { name: 'mad_check', slug: 'mad-check', stubSlug: 'mad-anomaly-detection' },
];

test('names excluded plugins instead of counting them as a gap', () => {
  // parseRegistryIndex already drops excluded plugins from `plugins`, so the
  // count is right either way. What matters is that an excluded plugin is
  // named in the report, not silently absent from it.
  const coverage = computeCoverage({
    plugins: [PLUGINS[0]],
    excluded: ['bird_data_simulator'],
    dataFileIds: ['notifier'],
    sharedPages: ['notifier'],
    coreStubs: ['notifier'],
    enterpriseStubs: ['notifier'],
  });

  assert.equal(coverage.total, 1);
  assert.deepEqual(coverage.excluded, ['bird_data_simulator']);
  assert.equal(coverage.axes.data.missing.length, 0);
});

test('names what is missing on each axis, not just a total', () => {
  const coverage = computeCoverage({
    plugins: PLUGINS,
    dataFileIds: ['notifier', 'mad-anomaly-detection'],
    sharedPages: ['notifier'],
    coreStubs: ['notifier', 'mad-anomaly-detection'],
    enterpriseStubs: ['notifier'],
  });

  assert.equal(coverage.total, 2);
  assert.deepEqual(coverage.axes.data, { present: 2, missing: [] });
  assert.deepEqual(coverage.axes.shared, {
    present: 1,
    missing: ['mad_check'],
  });
  assert.deepEqual(coverage.axes.core, { present: 2, missing: [] });
  assert.deepEqual(coverage.axes.enterprise, {
    present: 1,
    missing: ['mad_check'],
  });
});

const COVERAGE = {
  total: 2,
  excluded: [],
  axes: {
    data: { present: 2, missing: [] },
    shared: { present: 1, missing: ['mad_check'] },
    core: { present: 2, missing: [] },
    enterprise: { present: 1, missing: ['mad_check'] },
  },
};

test('fails and names the plugin when a gap grows past the baseline', () => {
  const { ok, regressions } = compareToBaseline(COVERAGE, {
    shared: ['mad_check'],
    enterprise: [],
  });

  assert.equal(ok, false);
  assert.deepEqual(regressions, { enterprise: ['mad_check'] });
});

test('reports a shrinking gap without failing, so a batched backfill can land', () => {
  const { ok, regressions, improvements } = compareToBaseline(COVERAGE, {
    shared: ['mad_check', 'notifier'],
    core: ['notifier'],
    enterprise: ['mad_check'],
  });

  assert.equal(ok, true);
  assert.deepEqual(regressions, {});
  assert.deepEqual(improvements, { shared: ['notifier'], core: ['notifier'] });
});

test('formats a table naming the gap per axis', () => {
  const table = formatCoverageTable(COVERAGE);

  assert.match(table, /\| Axis \| Documented \| Missing \|/);
  assert.match(table, /\| Data file \| 2 of 2 \| — \|/);
  assert.match(table, /\| Shared page \| 1 of 2 \| mad_check \|/);
  assert.match(table, /\| Enterprise stub \| 1 of 2 \| mad_check \|/);
});

test('names excluded plugins under the table rather than hiding them', () => {
  const table = formatCoverageTable({
    ...COVERAGE,
    excluded: ['bird_data_simulator'],
  });

  assert.match(table, /Excluded by `docs_mapping\.yaml`: bird_data_simulator/);
});
