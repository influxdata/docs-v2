import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  collapseByPlugin,
  detectRemovedPlugins,
  formatSummary,
  hasFatal,
  needsAttention,
  worstStatus,
  writeStepOutputs,
  writeStepSummary,
} from '../reporting.js';

/**
 * Run `fn` with `envVar` pointing at a fresh file, and return what was written.
 * Exercises the real GitHub Actions file contract rather than mocking `fs`.
 */
function captureGithubFile(envVar, fn) {
  const file = join(mkdtempSync(join(tmpdir(), 'plugin-sync-')), envVar);
  const previous = process.env[envVar];
  process.env[envVar] = file;
  try {
    fn();
  } finally {
    if (previous === undefined) delete process.env[envVar];
    else process.env[envVar] = previous;
  }
  return readFileSync(file, 'utf8');
}

test('formats one row per plugin, whatever the artifact count', () => {
  const results = [
    {
      plugin: 'basic_transformation',
      status: 'updated',
      detail: 'shared page',
    },
    {
      plugin: 'mad_check',
      status: 'scaffolded',
      detail: 'core stub, enterprise stub',
    },
    {
      plugin: 'notifier',
      status: 'skipped',
      detail: 'source README not found',
    },
  ];

  assert.equal(
    formatSummary(results),
    `| Plugin | Status | Detail |
| --- | --- | --- |
| \`basic_transformation\` | updated | shared page |
| \`mad_check\` | scaffolded | core stub, enterprise stub |
| \`notifier\` | skipped | source README not found |`
  );
});

const row = (status) => ({ plugin: 'p', status, detail: '' });

test('a routine run needs no attention and is not fatal', () => {
  const results = [row('updated'), row('unchanged')];

  assert.equal(needsAttention(results), false);
  assert.equal(hasFatal(results), false);
});

test('a new stub, a skip, or a removal needs attention but does not fail', () => {
  for (const status of ['scaffolded', 'skipped', 'removed']) {
    const results = [row('unchanged'), row(status)];

    assert.equal(needsAttention(results), true, `${status} needs attention`);
    assert.equal(hasFatal(results), false, `${status} is not fatal`);
  }
});

test('an error needs attention and fails the run', () => {
  const results = [row('updated'), row('error')];

  assert.equal(needsAttention(results), true);
  assert.equal(hasFatal(results), true);
});

test('writes a single-line output as a plain key=value pair', () => {
  const written = captureGithubFile('GITHUB_OUTPUT', () =>
    writeStepOutputs({ needs_attention: 'true' })
  );

  assert.equal(written, 'needs_attention=true\n');
});

test('wraps a multi-line output in a random heredoc delimiter', () => {
  const summary = '| Plugin |\n| --- |\n| `notifier` |';

  const written = captureGithubFile('GITHUB_OUTPUT', () =>
    writeStepOutputs({ summary })
  );

  const match = written.match(/^summary<<(EOF_[0-9a-f]{16})\n/);
  assert.ok(
    match,
    `expected a heredoc header, got: ${JSON.stringify(written)}`
  );
  const delimiter = match[1];
  assert.equal(written, `summary<<${delimiter}\n${summary}\n${delimiter}\n`);
  assert.ok(
    !summary.includes(delimiter),
    'delimiter must not occur in the value'
  );
});

test('uses a different delimiter on each call, so a value cannot forge one', () => {
  const read = () =>
    captureGithubFile('GITHUB_OUTPUT', () =>
      writeStepOutputs({ summary: 'a\nb' })
    );

  assert.notEqual(read(), read());
});

test('writing an output is a no-op outside GitHub Actions', () => {
  const previous = process.env.GITHUB_OUTPUT;
  delete process.env.GITHUB_OUTPUT;
  try {
    assert.doesNotThrow(() => writeStepOutputs({ needs_attention: 'true' }));
  } finally {
    if (previous !== undefined) process.env.GITHUB_OUTPUT = previous;
  }
});

test('appends the summary markdown to the step summary file', () => {
  const written = captureGithubFile('GITHUB_STEP_SUMMARY', () => {
    writeStepSummary('## Plugin documentation sync');
    writeStepSummary('| Plugin |');
  });

  assert.equal(written, '## Plugin documentation sync\n| Plugin |\n');
});

test('collapses one plugin’s artifacts into a single row', () => {
  const artifacts = [
    { plugin: 'notifier', status: 'unchanged', detail: 'shared page' },
    { plugin: 'notifier', status: 'scaffolded', detail: 'core stub' },
    { plugin: 'notifier', status: 'scaffolded', detail: 'enterprise stub' },
  ];

  assert.deepEqual(collapseByPlugin(artifacts), [
    {
      plugin: 'notifier',
      status: 'scaffolded',
      detail: 'core stub; enterprise stub',
    },
  ]);
});

test('a collapsed row explains the status it reports, not the ones it hides', () => {
  const artifacts = [
    { plugin: 'notifier', status: 'unchanged', detail: 'shared page' },
    { plugin: 'notifier', status: 'error', detail: 'unterminated marker' },
  ];

  const [row] = collapseByPlugin(artifacts);

  assert.equal(row.status, 'error');
  assert.equal(row.detail, 'unterminated marker');
});

test('keeps plugins in first-seen order and does not merge across plugins', () => {
  const artifacts = [
    { plugin: 'notifier', status: 'unchanged', detail: 'a' },
    { plugin: 'downsampler', status: 'updated', detail: 'b' },
    { plugin: 'notifier', status: 'unchanged', detail: 'c' },
  ];

  assert.deepEqual(
    collapseByPlugin(artifacts).map((r) => r.plugin),
    ['notifier', 'downsampler']
  );
});

test('a plugin row takes the status a reviewer most needs to see', () => {
  // One plugin produces a shared-page outcome and two stub outcomes. The row
  // must not report `unchanged` for a plugin that also just gained a stub.
  assert.equal(worstStatus(['unchanged', 'scaffolded']), 'scaffolded');
  assert.equal(worstStatus(['updated', 'scaffolded']), 'scaffolded');
  assert.equal(worstStatus(['scaffolded', 'skipped']), 'skipped');
  assert.equal(worstStatus(['skipped', 'error']), 'error');
  assert.equal(worstStatus(['unchanged', 'unchanged']), 'unchanged');
});

test('worstStatus is order-independent', () => {
  assert.equal(worstStatus(['error', 'unchanged']), 'error');
  assert.equal(worstStatus(['unchanged', 'error']), 'error');
});

test('reports a shared page whose plugin is gone from the registry', () => {
  const discovered = [{ name: 'notifier', slug: 'notifier' }];
  const filenames = ['notifier.md', 'downsampler.md'];

  assert.deepEqual(detectRemovedPlugins(discovered, filenames), [
    'downsampler',
  ]);
});

test('matches the shared page on slug, not on the product stub slug', () => {
  // `mad_check` publishes shared/mad-check.md but stubs
  // mad-anomaly-detection.md. Comparing on stubSlug would report the live
  // page as removed on every run.
  const discovered = [
    { name: 'mad_check', slug: 'mad-check', stubSlug: 'mad-anomaly-detection' },
  ];

  assert.deepEqual(detectRemovedPlugins(discovered, ['mad-check.md']), []);
});

test('ignores the section index and the writer guidance file', () => {
  assert.deepEqual(
    detectRemovedPlugins([], ['_index.md', 'CLAUDE.md', 'README.md']),
    []
  );
});

test('ignores non-markdown files', () => {
  assert.deepEqual(detectRemovedPlugins([], ['notes.txt', 'img.png']), []);
});

test('writing a summary is a no-op outside GitHub Actions', () => {
  const previous = process.env.GITHUB_STEP_SUMMARY;
  delete process.env.GITHUB_STEP_SUMMARY;
  try {
    assert.doesNotThrow(() => writeStepSummary('## Plugin documentation sync'));
  } finally {
    if (previous !== undefined) process.env.GITHUB_STEP_SUMMARY = previous;
  }
});
