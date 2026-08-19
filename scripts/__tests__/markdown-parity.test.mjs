import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { convertToMarkdown } = require('../rust-markdown-converter');

const FIXTURE = new URL('./fixtures/get-started.html', import.meta.url);
// Stored as .txt (not .md) so markdown formatters/linters never rewrite the
// golden output (e.g. escaping `[!Note]` or reflowing tables).
const EXPECTED = new URL('./fixtures/get-started.expected.txt', import.meta.url);

test('Rust converter output matches the golden snapshot', () => {
  const html = readFileSync(FIXTURE, 'utf-8');
  const out = convertToMarkdown(
    html,
    '/influxdb3/core/get-started/',
    'https://docs.influxdata.com'
  );
  assert.equal(out, readFileSync(EXPECTED, 'utf-8'));
});

test('converter emits the drop-in base frontmatter only', () => {
  const html = readFileSync(FIXTURE, 'utf-8');
  const out = convertToMarkdown(
    html,
    '/influxdb3/core/get-started/',
    'https://docs.influxdata.com'
  );
  assert.match(out, /\nversion: core\n/);
  assert.doesNotMatch(out, /product_version:/);
  // provenance + timestamps are JS post-steps, not the converter:
  assert.doesNotMatch(out, /publisher:/);
  assert.doesNotMatch(out, /canonical:/);
  assert.doesNotMatch(out, /\ndate:/);
  assert.doesNotMatch(out, /\nlastmod:/);
  // h1 omitted; UI widget text stripped:
  assert.doesNotMatch(out, /^# Get started/m);
  assert.doesNotMatch(out, /Copy page|Copy section|^for AI$/m);
});
