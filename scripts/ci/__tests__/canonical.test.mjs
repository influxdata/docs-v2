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

test('findPagesReferencingSharedContent excludes prose mentions of source:', async () => {
  // grep -rFl matches anywhere in the file; post-filtering must discard files
  // where "source: /shared/x.md" appears only in prose or code examples.
  const dir = mkdtempSync(join(tmpdir(), 'find-consumers-'));
  try {
    const sharedPath = 'content/shared/example.md';

    // Real consumer: source: in frontmatter
    const consumer = join(dir, 'consumer.md');
    writeFileSync(consumer, `---\nsource: /shared/example.md\n---\n\nBody.\n`);

    // False positive: source: only in prose, not frontmatter
    const prose = join(dir, 'prose.md');
    writeFileSync(prose, `---\ntitle: Example\n---\n\nSee \`source: /shared/example.md\` for details.\n`);

    // findPagesReferencingSharedContent greps inside content/ — we need to
    // mock its grep scope. Since it hard-codes "content/", we test the
    // post-filter logic indirectly via getSourceFromFrontmatter equality:
    // a file whose getSourceFromFrontmatter !== sharedPath must be excluded.
    const { getSourceFromFrontmatter } = await import('../../lib/content-utils.js');
    assert.equal(getSourceFromFrontmatter(consumer), sharedPath, 'consumer resolves correctly');
    assert.notEqual(getSourceFromFrontmatter(prose), sharedPath, 'prose file does not resolve to shared path');
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
