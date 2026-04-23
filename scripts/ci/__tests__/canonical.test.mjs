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

test('does not match source: inside fenced YAML blocks', async () => {
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'canonical-'));
  const file = join(dir, 'page.md');
  writeFileSync(
    file,
    '---\ntitle: Test\n---\n\n# heading\n\n```yaml\nsource: /not-frontmatter/foo.md\n```\n',
  );
  const r = resolveCanonicalSource(file);
  assert.equal(r, file, 'should return self, not the bogus in-fence match');
});

test('handles unslashed source: shared/... form', async () => {
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'canonical-'));
  const file = join(dir, 'page.md');
  writeFileSync(file, '---\nsource: shared/foo.md\n---\n\nBody.\n');
  const r = resolveCanonicalSource(file);
  assert.equal(r, 'content/shared/foo.md');
});
