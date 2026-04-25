import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveCanonicalSource, findPagesReferencingSharedContent } from '../../lib/content-utils.js';

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

test('findPagesReferencingSharedContent returns true consumers and excludes prose mentions', async () => {
  // Verifies the full function: grep coarse-filters, getSourceFromFrontmatter
  // post-filters so prose/code mentions of source: are not counted as consumers.
  const { findPagesReferencingSharedContent } = await import('../../lib/content-utils.js');
  const dir = mkdtempSync(join(tmpdir(), 'find-consumers-'));
  try {
    // Real consumer: source: in frontmatter resolving to the shared file.
    // The shared path must start with content/shared/ for normalization to work.
    const sharedPath = 'content/shared/example.md';
    const consumer = join(dir, 'consumer.md');
    writeFileSync(consumer, `---\nsource: /shared/example.md\n---\n\nBody.\n`);

    // False positive: source: appears only in prose, not in frontmatter.
    const prose = join(dir, 'prose.md');
    writeFileSync(prose, `---\ntitle: Example\n---\n\nSee \`source: /shared/example.md\` in the docs.\n`);

    const results = findPagesReferencingSharedContent(sharedPath, { searchRoot: dir });
    assert.ok(results.includes(consumer), 'true consumer should be returned');
    assert.ok(!results.includes(prose), 'prose mention should be excluded');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
