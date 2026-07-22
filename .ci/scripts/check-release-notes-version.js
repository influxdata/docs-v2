#!/usr/bin/env node
/**
 * check-release-notes-version.js
 *
 * Non-blocking reminder check that guards against version drift between a
 * product's release notes page and the version number in data/products.yml.
 *
 * Why this exists:
 *   The `latest_patch` / `latest_patches` value in data/products.yml is read by
 *   the {{< latest-patch >}} shortcode (layouts/shortcodes/latest-patch.html),
 *   which builds every dl.influxdata.com download URL and the version strings in
 *   install/code examples. When a release notes page gains a new
 *   `## vX.Y.Z {date="…"}` heading but products.yml is not bumped, the docs keep
 *   advertising the previous release everywhere, silently. This check compares
 *   the two and prints a reminder when they disagree.
 *
 * Telegraf is checked and reported like every other product (no special-casing).
 * Its internal release automation keeps products.yml in sync, so it normally
 * reports success — and a mismatch would surface a regression in that automation.
 *
 * Output: a Markdown report on stdout (the workflow posts it as a PR comment and
 * to the step summary), plus GitHub Actions ::warning:: annotations for drift.
 *
 * Exit code: always 0. This is a reminder, not a gate.
 *
 * Usage: node .ci/scripts/check-release-notes-version.js [changed-file ...]
 */
import { readFileSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const PRODUCTS_YAML = join(REPO_ROOT, 'data', 'products.yml');

const V3_SHARED_NOTES =
  'content/shared/v3-core-enterprise-release-notes/_index.md';

/**
 * Authoritative release-notes source for each product that tracks a patch
 * version. `notesFile` is where the version headings live; `triggerPaths` are
 * the changed files that put the product in scope (usually just the notes file,
 * plus thin stub pages that `source:` it — the Core/Enterprise stubs render the
 * shared v3 file). `selector` locates the version in products.yml: a string is a
 * scalar field; an array is a nested lookup.
 */
const RELEASE_NOTES = [
  {
    product: 'influxdb3_core',
    selector: 'latest_patch',
    notesFile: V3_SHARED_NOTES,
    triggerPaths: [
      V3_SHARED_NOTES,
      'content/influxdb3/core/release-notes/_index.md',
    ],
  },
  {
    product: 'influxdb3_enterprise',
    selector: 'latest_patch',
    notesFile: V3_SHARED_NOTES,
    triggerPaths: [
      V3_SHARED_NOTES,
      'content/influxdb3/enterprise/release-notes/_index.md',
    ],
  },
  {
    product: 'influxdb3_explorer',
    selector: 'latest_patch',
    notesFile: 'content/influxdb3/explorer/release-notes/_index.md',
  },
  {
    product: 'telegraf',
    selector: ['latest_patches', 'v1'],
    notesFile: 'content/telegraf/v1/release-notes.md',
  },
  {
    product: 'telegraf_controller',
    selector: 'latest_patch',
    notesFile: 'content/telegraf/controller/reference/release-notes.md',
  },
  {
    product: 'chronograf',
    selector: ['latest_patches', 'v1'],
    notesFile: 'content/chronograf/v1/about_the_project/release-notes.md',
  },
  {
    product: 'kapacitor',
    selector: ['latest_patches', 'v1'],
    notesFile: 'content/kapacitor/v1/reference/about_the_project/release-notes.md',
  },
  {
    product: 'enterprise_influxdb',
    selector: ['latest_patches', 'v1'],
    notesFile: 'content/enterprise_influxdb/v1/about-the-project/release-notes.md',
  },
  {
    product: 'influxdb',
    selector: ['latest_patches', 'v2'],
    notesFile: 'content/influxdb/v2/reference/release-notes/influxdb.md',
  },
  {
    product: 'influxdb',
    selector: ['latest_patches', 'v1'],
    notesFile: 'content/influxdb/v1/about_the_project/release-notes.md',
  },
];

// Matches the newest release heading, e.g. `## v3.10.3 {date="2026-07-07"}`.
// products.yml stores the number without the leading `v`.
const HEADING_RE = /^##\s+v?(\d+\.\d+\.\d+[^\s{]*)/m;

/** Read a nested value from products.yml given a scalar or array selector. */
function readSelector(product, selector) {
  if (typeof selector === 'string') return product?.[selector];
  return selector.reduce((acc, key) => (acc == null ? acc : acc[key]), product);
}

function selectorLabel(selector) {
  return Array.isArray(selector) ? selector.join('.') : selector;
}

/** Parse the topmost documented version from a release-notes file. */
function documentedVersion(notesFile) {
  const abs = join(REPO_ROOT, notesFile);
  if (!existsSync(abs)) return null;
  const match = readFileSync(abs, 'utf8').match(HEADING_RE);
  return match ? match[1] : null;
}

/** Strip a leading `v` and split into numeric parts for comparison. */
function parseVersion(v) {
  return String(v)
    .replace(/^v/, '')
    .split('.')
    .map((n) => parseInt(n, 10));
}

/** Return 1 if a > b, -1 if a < b, 0 if equal (numeric, dotted). */
function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

/**
 * Compute per-product results. Exported for the test file. `lookup` is injected
 * so tests can run without touching disk; it defaults to reading the notes file.
 * @param {object} products  Parsed data/products.yml.
 * @param {Set<string>|null} changed  Changed paths, or null to check everything.
 * @param {(notesFile: string) => string|null} lookup  Documented-version reader.
 */
export function evaluate(products, changed, lookup = documentedVersion) {
  const results = [];
  for (const entry of RELEASE_NOTES) {
    const triggers = entry.triggerPaths || [entry.notesFile];
    const inScope = changed === null || triggers.some((p) => changed.has(p));
    if (!inScope) continue;

    const product = products[entry.product];
    const sel = selectorLabel(entry.selector);
    const label = `${entry.product} (${sel})`;
    const base = {
      product: entry.product,
      label,
      selector: sel,
      notesFile: entry.notesFile,
    };
    const current = product ? readSelector(product, entry.selector) : undefined;
    const documented = lookup(entry.notesFile);

    if (current == null) {
      results.push({ ...base, status: 'info', message: `no ${sel} field in products.yml` });
      continue;
    }
    if (documented == null) {
      results.push({ ...base, status: 'info', message: `no version heading in ${entry.notesFile}` });
      continue;
    }

    const cmp = compareVersions(documented, current);
    if (cmp === 0) results.push({ ...base, status: 'ok', documented, current });
    else if (cmp > 0) results.push({ ...base, status: 'drift', documented, current });
    // products.yml ahead of the notes — unusual, informational only.
    else results.push({ ...base, status: 'ahead', documented, current });
  }
  return results;
}

const BADGE_REMINDER = [
  '### 💡 Badge new features with the version',
  '',
  'Documenting a new feature? Add a version badge in the page frontmatter — the',
  'same mechanism used elsewhere in the docs:',
  '',
  '- `metadata: [InfluxDB 3 Core v3.11+]` — badge list under the page title',
  '- `updated_in: v3.11` — an "Updated in v3.11" badge',
  '- `introduced: v3.11` — a "‹Product› v3.11+" badge',
  '- `menu.params.state: new` — a "NEW" pill on the sidebar nav item',
  '',
  'For inline version text, use `{{< latest-patch >}}` / `{{< current-version >}}`,',
  'which read the value from `data/products.yml` so it stays correct automatically.',
].join('\n');

function buildReport(results) {
  const lines = ['## Release version check', ''];

  if (results.length === 0) {
    lines.push('No release-notes pages with a tracked version changed in this PR.');
  } else {
    lines.push('| Product | Release notes | data/products.yml | Status |');
    lines.push('| --- | --- | --- | --- |');
    for (const r of results) {
      if (r.status === 'ok') {
        lines.push(`| \`${r.label}\` | ${r.documented} | ${r.current} | ✅ in sync |`);
      } else if (r.status === 'drift') {
        lines.push(`| \`${r.label}\` | ${r.documented} | ${r.current} | ⚠️ **bump needed** |`);
      } else if (r.status === 'ahead') {
        lines.push(`| \`${r.label}\` | ${r.documented} | ${r.current} | ℹ️ products.yml ahead |`);
      } else {
        lines.push(`| \`${r.label}\` | — | — | ℹ️ ${r.message} |`);
      }
    }
    lines.push('');

    const drift = results.filter((r) => r.status === 'drift');
    if (drift.length) {
      lines.push('### Action needed', '');
      for (const r of drift) {
        lines.push(
          `- Release notes document v${r.documented}, but ` +
            `\`data/products.yml\` \`${r.selector}\` for ${r.product} is ` +
            `${r.current}. Bump it so \`{{< latest-patch >}}\` download links ` +
            `and examples update.`
        );
      }
      lines.push('');
    }
  }

  lines.push(BADGE_REMINDER);
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const changed = args.length ? new Set(args) : null;
  const products = yaml.load(readFileSync(PRODUCTS_YAML, 'utf8'));
  const results = evaluate(products, changed);

  for (const r of results.filter((x) => x.status === 'drift')) {
    console.log(
      `::warning file=${r.notesFile}::Release notes show v${r.documented} but ` +
        `data/products.yml ${r.selector} for ${r.product} is ${r.current} — bump products.yml.`
    );
  }

  const report = buildReport(results);
  console.log(report);

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
    } catch {
      /* best-effort; stdout already carries the report */
    }
  }

  // Never fail — this is a reminder, not a gate.
  process.exit(0);
}

// Only run main() when invoked directly, so the test file can import evaluate().
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
