/**
 * Reconcile official plugins upstream against what docs-v2 publishes.
 *
 * The sync reported success for eight months while documenting 11 of 34
 * plugins, and nothing in the repository could tell a healthy pipeline from a
 * dormant one. This module is that signal.
 */

const AXES = ['data', 'shared', 'core', 'enterprise'];

/**
 * Coverage per axis, with the plugins missing from each one named.
 *
 * Reconciles per axis rather than as a single number: a plugin can have a
 * shared page and no Enterprise stub, and a bare count would hide that.
 *
 * Presence is keyed differently per axis, matching how each artifact is named.
 * The data file and the product stubs key on `stubSlug`; the shared page keys
 * on `slug`. They differ for `mad_check`.
 */
export function computeCoverage({
  plugins,
  excluded = [],
  dataFileIds,
  sharedPages,
  coreStubs,
  enterpriseStubs,
}) {
  const axis = (present, key) => {
    const found = new Set(present);
    const missing = plugins
      .filter((plugin) => !found.has(plugin[key]))
      .map((plugin) => plugin.name);
    return { present: plugins.length - missing.length, missing };
  };

  return {
    total: plugins.length,
    excluded,
    axes: {
      data: axis(dataFileIds, 'stubSlug'),
      shared: axis(sharedPages, 'slug'),
      core: axis(coreStubs, 'stubSlug'),
      enterprise: axis(enterpriseStubs, 'stubSlug'),
    },
  };
}

/**
 * Compare measured coverage against the committed baseline.
 *
 * The baseline records the gap the repository has already accepted, per axis.
 * A gap that grows past it fails the check and names what grew. A gap that
 * shrinks is reported and does not fail, so the backfill can land in batches
 * without the check standing in its way.
 */
export function compareToBaseline(coverage, baseline) {
  const regressions = {};
  const improvements = {};

  for (const axis of AXES) {
    const accepted = baseline[axis] ?? [];
    const acceptedSet = new Set(accepted);
    const missing = coverage.axes[axis]?.missing ?? [];
    const missingSet = new Set(missing);

    const grown = missing.filter((name) => !acceptedSet.has(name));
    if (grown.length > 0) regressions[axis] = grown;

    const closed = accepted.filter((name) => !missingSet.has(name));
    if (closed.length > 0) improvements[axis] = closed;
  }

  return {
    ok: Object.keys(regressions).length === 0,
    regressions,
    improvements,
  };
}

const AXIS_LABELS = {
  data: 'Data file',
  shared: 'Shared page',
  core: 'Core stub',
  enterprise: 'Enterprise stub',
};

/**
 * Render coverage as a markdown table for the step summary and the pull
 * request body.
 *
 * Names the missing plugins in the row rather than only counting them: the
 * whole point of this check is that "11 of 34" was visible for eight months
 * and told nobody which 23 were absent.
 */
export function formatCoverageTable(coverage) {
  const rows = AXES.map((axis) => {
    const { present, missing } = coverage.axes[axis];
    const gap = missing.length === 0 ? '—' : missing.join(', ');
    return `| ${AXIS_LABELS[axis]} | ${present} of ${coverage.total} | ${gap} |`;
  });

  const table = [
    '| Axis | Documented | Missing |',
    '| --- | --- | --- |',
    ...rows,
  ].join('\n');

  const excluded = coverage.excluded ?? [];
  if (excluded.length === 0) return table;

  return `${table}\n\nExcluded by \`docs_mapping.yaml\`: ${excluded.join(', ')}`;
}
