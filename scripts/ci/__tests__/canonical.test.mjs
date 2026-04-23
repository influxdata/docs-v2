import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveCanonicalSource } from '../../lib/content-utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name) => join(__dirname, 'fixtures/lint', name);

test('returns self when file has no source: frontmatter', () => {
  const path = fx('simple.md');
  const r = resolveCanonicalSource(path);
  assert.equal(r, path);
});

test('resolves source: /shared/... to content/shared/... path', () => {
  const r = resolveCanonicalSource(fx('consumer.md'));
  assert.equal(r, 'content/shared/example.md');
});

test('returns file path if it does not exist', () => {
  const r = resolveCanonicalSource('content/does-not-exist.md');
  assert.equal(r, 'content/does-not-exist.md');
});
