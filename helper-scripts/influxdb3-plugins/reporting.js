/**
 * Reporting surface for the plugin documentation sync.
 *
 * The sync produces one result per plugin, not per file: a plugin can touch a
 * shared page, two product stubs, and the shared data file, and a table with a
 * row per artifact is too long to read. `detail` names the artifacts.
 */

import { appendFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

// `error` means the sync could not do its job: a malformed generated-region
// marker, or a target it could not write. Those must fail the run, because the
// alternative is a green build that silently stopped syncing -- the failure
// mode this pipeline already had for eight months.
//
// `skipped`, `scaffolded`, and `removed` are all "a human should look at this
// pull request", not "the sync is broken". A plugin published without a README
// the transform can read, a plugin that just gained its first stub, and a
// plugin that vanished upstream are each resolved by review, not by a red X.
const FATAL_STATUSES = new Set(['error']);
const ATTENTION_STATUSES = new Set([
  'scaffolded',
  'skipped',
  'removed',
  'error',
]);

// Ordered from the status a reviewer most needs to see to the one they least
// need to see. A plugin's row takes the worst of its artifact outcomes, so a
// plugin whose page was unchanged but whose stub is new still reads as new.
const STATUS_SEVERITY = [
  'error',
  'removed',
  'skipped',
  'scaffolded',
  'updated',
  'unchanged',
];

/**
 * The most attention-worthy of several artifact statuses for one plugin.
 */
function worstStatus(statuses) {
  return STATUS_SEVERITY.find((status) => statuses.includes(status));
}

/**
 * Collapse per-artifact results into one row per plugin.
 *
 * A plugin can touch a shared page, two product stubs, and the shared data
 * file. The row reports the worst of those outcomes, and its detail describes
 * only the artifacts that produced that outcome -- a row that says `error`
 * should explain the error, not also mention the two files that were fine.
 */
function collapseByPlugin(artifactResults) {
  const byPlugin = new Map();

  for (const artifact of artifactResults) {
    const existing = byPlugin.get(artifact.plugin);
    if (existing) existing.push(artifact);
    else byPlugin.set(artifact.plugin, [artifact]);
  }

  return [...byPlugin].map(([plugin, artifacts]) => {
    const status = worstStatus(artifacts.map((a) => a.status));
    return {
      plugin,
      status,
      detail: artifacts
        .filter((a) => a.status === status)
        .map((a) => a.detail)
        .join('; '),
    };
  });
}

// Files that live alongside the generated plugin pages but do not describe a
// plugin. Without this, every run reports them as removed plugins.
const NON_PLUGIN_PAGES = new Set(['_index.md', 'CLAUDE.md', 'README.md']);

/**
 * Shared pages that no longer have a plugin in the registry index.
 *
 * The sync never deletes these. A rename is indistinguishable from a delete
 * plus an add at the file level, and auto-deleting would break a live URL on
 * every upstream rename, so removals are reported and resolved by hand.
 *
 * Matching is on `slug` -- the shared page name -- not `stubSlug`, which names
 * the product stub and differs for at least `mad_check`.
 */
function detectRemovedPlugins(discoveredPlugins, sharedPageFilenames) {
  const known = new Set(discoveredPlugins.map((plugin) => plugin.slug));

  return sharedPageFilenames
    .filter(
      (filename) => filename.endsWith('.md') && !NON_PLUGIN_PAGES.has(filename)
    )
    .map((filename) => filename.slice(0, -'.md'.length))
    .filter((slug) => !known.has(slug));
}

/**
 * Sanitize a value for use inside a GitHub Flavored Markdown table cell.
 * Pipe characters would break the column structure; newlines would break the row.
 */
function sanitizeTableCell(s) {
  return String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');
}

/**
 * Render the per-plugin results as a markdown table.
 */
function formatSummary(results) {
  const rows = results.map((r) => {
    const plugin = sanitizeTableCell(r.plugin);
    const status = sanitizeTableCell(r.status);
    const detail = sanitizeTableCell(r.detail);
    return `| \`${plugin}\` | ${status} | ${detail} |`;
  });
  return ['| Plugin | Status | Detail |', '| --- | --- | --- |', ...rows].join(
    '\n'
  );
}

/**
 * True when any plugin result should draw a reviewer's eye.
 */
function needsAttention(results) {
  return results.some((r) => ATTENTION_STATUSES.has(r.status));
}

/**
 * True when any plugin result should fail the job.
 */
function hasFatal(results) {
  return results.some((r) => FATAL_STATUSES.has(r.status));
}

/**
 * Append step outputs to `$GITHUB_OUTPUT`, or do nothing when the sync runs
 * outside GitHub Actions.
 *
 * Multi-line values use a heredoc with a random delimiter, so a value that
 * happens to contain a delimiter-shaped line cannot terminate its own block.
 */
function writeStepOutputs(outputs) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;

  const lines = [];
  for (const [key, value] of Object.entries(outputs)) {
    if (typeof value === 'string' && value.includes('\n')) {
      const delimiter = `EOF_${randomBytes(8).toString('hex')}`;
      lines.push(`${key}<<${delimiter}`, value, delimiter);
    } else {
      lines.push(`${key}=${value}`);
    }
  }
  appendFileSync(file, lines.join('\n') + '\n');
}

/**
 * Append markdown to `$GITHUB_STEP_SUMMARY`, or do nothing when the sync runs
 * outside GitHub Actions.
 */
function writeStepSummary(markdown) {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (!file) return;
  appendFileSync(file, markdown + '\n');
}

export {
  collapseByPlugin,
  detectRemovedPlugins,
  formatSummary,
  hasFatal,
  needsAttention,
  worstStatus,
  writeStepOutputs,
  writeStepSummary,
};
