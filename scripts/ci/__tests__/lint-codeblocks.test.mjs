import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = join(__dirname, '../lint-codeblocks.mjs');
const fx = (name) => join(__dirname, 'fixtures/lint', name);

function run(files, env = {}) {
  return spawnSync('node', [cli, ...files], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

test('exits 0 when all JSON blocks are valid', () => {
  const r = run([fx('good-json.md')]);
  assert.equal(r.status, 0, r.stderr);
});

test('exits 1 when a JSON block fails to parse', () => {
  const r = run([fx('bad-json.md')]);
  assert.equal(r.status, 1);
  assert.match(r.stdout + r.stderr, /bad-json\.md/);
});

test('dedupes inputs that resolve to the same canonical source', () => {
  // Pass the same consumer file twice — canonical should be grouped once.
  const consumer = fx('consumer.md');
  const r = run([consumer, consumer]);
  // No code blocks in the shared fixture, exit 0.
  assert.equal(r.status, 0, r.stderr);
  // The grouped log shows the canonical (shared) path, not the consumer.
  assert.match(r.stdout, /content\/shared\/example\.md/);
});

test('writes a step summary when GITHUB_STEP_SUMMARY is set', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lint-summary-'));
  const summaryPath = join(dir, 'summary.md');
  writeFileSync(summaryPath, '');
  const r = run([fx('bad-json.md')], { GITHUB_STEP_SUMMARY: summaryPath });
  assert.equal(r.status, 1);
  const summary = readFileSync(summaryPath, 'utf8');
  assert.match(summary, /## Code-block lint/);
  assert.match(summary, /\| File \| Line \| Language \| Message \|/);
  assert.match(summary, /bad-json\.md/);
});
