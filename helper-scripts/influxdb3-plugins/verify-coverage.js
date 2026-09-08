#!/usr/bin/env node
/**
 * Reconcile official plugins upstream against what docs-v2 publishes.
 *
 * Run from `helper-scripts/influxdb3-plugins`, or through
 * `yarn verify-plugin-coverage`.
 *
 * This file is the adapter: it reads the registry, the data file, and the
 * content directories, then hands plain lists to `coverage.js`, which holds
 * the reconciliation itself and the tests for it.
 */

import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import { fetchRegistryIndex, parseRegistryIndex } from './discovery.js';
import {
  computeCoverage,
  compareToBaseline,
  formatCoverageTable,
} from './coverage.js';
import { writeStepOutputs, writeStepSummary } from './reporting.js';

const MAPPING_CONFIG = 'docs_mapping.yaml';
const BASELINE_FILE = 'coverage-baseline.json';
const DATA_FILE = '../../data/influxdb3_plugins.yml';
const SHARED_DIR =
  '../../content/shared/influxdb3-plugins/plugins-library/official';
const stubDir = (product) =>
  `../../content/influxdb3/${product}/plugins/library/official`;

// Files that sit alongside the plugin pages without describing a plugin.
const NON_PLUGIN_PAGES = new Set(['_index', 'CLAUDE', 'README']);

/**
 * Markdown basenames in a directory, minus the pages that aren't plugins.
 */
async function pageNames(dir) {
  const filenames = await fs.readdir(dir);
  return filenames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -'.md'.length))
    .filter((name) => !NON_PLUGIN_PAGES.has(name));
}

async function main() {
  const config = yaml.load(await fs.readFile(MAPPING_CONFIG, 'utf8'));

  // A registry fetch failure is a network problem, not drift. Report it and
  // exit 0, for the same reason the sync reports it as a skip: a red nightly
  // nobody can reproduce locally gets ignored.
  let parsed;
  try {
    parsed = parseRegistryIndex(await fetchRegistryIndex(), {
      overrides: config.overrides ?? {},
      exclude: config.exclude ?? [],
    });
  } catch (error) {
    console.warn(`⚠️  Could not read the registry index: ${error.message}`);
    console.warn('   Coverage was not measured on this run.');
    process.exit(0);
  }

  const dataFile = yaml.load(await fs.readFile(DATA_FILE, 'utf8')) ?? [];

  const coverage = computeCoverage({
    plugins: parsed.plugins,
    excluded: parsed.excluded,
    dataFileIds: dataFile.map((entry) => entry.id),
    sharedPages: await pageNames(SHARED_DIR),
    coreStubs: await pageNames(stubDir('core')),
    enterpriseStubs: await pageNames(stubDir('enterprise')),
  });

  const baseline = JSON.parse(await fs.readFile(BASELINE_FILE, 'utf8'));
  const { ok, regressions, improvements } = compareToBaseline(
    coverage,
    baseline.missing ?? {}
  );

  const table = formatCoverageTable(coverage);
  console.log(table);

  for (const [axis, names] of Object.entries(improvements)) {
    console.log(`\n✅ Newly covered (${axis}): ${names.join(', ')}`);
  }
  for (const [axis, names] of Object.entries(regressions)) {
    console.error(`\n❌ Beyond the baseline (${axis}): ${names.join(', ')}`);
  }
  if (!ok) {
    console.error(
      `\nUpdate ${BASELINE_FILE} only to record an accepted gap, never to ` +
        'silence one the sync just introduced.'
    );
  }

  writeStepSummary(`## Plugin documentation coverage\n\n${table}`);
  writeStepOutputs({ coverage_table: table });

  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});
