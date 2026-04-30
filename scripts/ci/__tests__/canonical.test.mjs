import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveCanonicalSource, findPagesReferencingSharedContent, getSourceFromFrontmatter } from '../../lib/content-utils.js';

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

test('findPagesReferencingSharedContent finds consumers using quoted source: values', () => {
  // Regression: the grep prefilter previously matched only unquoted
  // `source: /shared/...`, missing pages that quote the value:
  //   source: "/shared/foo.md"
  //   source: '/shared/foo.md'
  // No content pages currently use quoted source values, but the
  // prefilter must cover them so adding one in the future doesn't
  // silently drop the consumer from shared-content expansion.
  const sharedPath = 'content/shared/example.md';
  const dir = mkdtempSync(join(tmpdir(), 'quoted-consumers-'));
  try {
    const dq = join(dir, 'double-quoted.md');
    writeFileSync(dq, `---\nsource: "/shared/example.md"\n---\n\nBody.\n`);

    const sq = join(dir, 'single-quoted.md');
    writeFileSync(sq, `---\nsource: '/shared/example.md'\n---\n\nBody.\n`);

    const results = findPagesReferencingSharedContent(sharedPath, { searchRoot: dir });
    assert.ok(results.includes(dq), 'double-quoted consumer should be found');
    assert.ok(results.includes(sq), 'single-quoted consumer should be found');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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

test('normalizes source: /content/shared/... to content/shared/... (not content/content/)', async () => {
  // Regression: sourcePath.startsWith('/') was blindly prepending 'content',
  // turning /content/shared/x into content/content/shared/x (nonexistent).
  const { writeFileSync, mkdtempSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const dir = mkdtempSync(join(tmpdir(), 'canonical-'));
  const file = join(dir, 'page.md');
  writeFileSync(file, '---\nsource: /content/shared/v3-process-data/downsample/quix.md\n---\n\nBody.\n');
  const r = resolveCanonicalSource(file);
  assert.equal(r, 'content/shared/v3-process-data/downsample/quix.md');
  assert.ok(!r.includes('content/content/'), 'must not double-prefix with content/content/');
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

test('rejects malformed quoting rather than silently repairing it', () => {
  // getSourceFromFrontmatter previously stripped quotes independently
  // (["']?...["']?), so `source: "/shared/foo.md` (missing close quote)
  // would canonicalize as content/shared/foo.md. Now requires both ends
  // to match — malformed quoting falls through to null.
  const dir = mkdtempSync(join(tmpdir(), 'malformed-'));
  try {
    const cases = [
      ['missing-close.md', '---\nsource: "/shared/foo.md\n---\n'],
      ['mismatched.md', '---\nsource: "/shared/x.md\'\n---\n'],
    ];
    for (const [name, content] of cases) {
      const file = join(dir, name);
      writeFileSync(file, content);
      // resolveCanonicalSource falls back to file itself when source: is unparseable.
      assert.equal(resolveCanonicalSource(file), file, `${name}: malformed source: should not canonicalize`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('preserves # inside quoted source: values', () => {
  // # is only a YAML comment delimiter when preceded by whitespace and
  // outside quotes. Quoted values may legitimately contain literal #.
  const dir = mkdtempSync(join(tmpdir(), 'hash-in-quote-'));
  try {
    const file = join(dir, 'page.md');
    writeFileSync(file, '---\nsource: "/shared/has#hash.md"\n---\n');
    assert.equal(resolveCanonicalSource(file), 'content/shared/has#hash.md');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('tolerates trailing whitespace on --- delimiters (parity with bash hook)', () => {
  // Bash check uses /^---[[:space:]]*$/, so a stray space after the
  // delimiter passes the commit-time gate. The JS extractor must agree
  // or canonical-source resolution drifts (file passes hook, lint stage
  // fails to find consumers).
  const dir = mkdtempSync(join(tmpdir(), 'delim-ws-'));
  try {
    const file = join(dir, 'page.md');
    writeFileSync(file, '---  \nsource: /shared/foo.md\n---\t\n\nBody.\n');
    assert.equal(resolveCanonicalSource(file), 'content/shared/foo.md');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('preserves # in unquoted plain scalars (YAML rule: # only starts a comment after whitespace)', () => {
  // Plain scalar `foo#bar` is a literal value; `foo #bar` has trailing comment.
  const dir = mkdtempSync(join(tmpdir(), 'hash-plain-'));
  try {
    const file1 = join(dir, 'inline-hash.md');
    writeFileSync(file1, '---\nsource: /shared/has#hash.md\n---\n');
    assert.equal(resolveCanonicalSource(file1), 'content/shared/has#hash.md');

    const file2 = join(dir, 'inline-hash-with-comment.md');
    writeFileSync(file2, '---\nsource: /shared/has#hash.md  # note\n---\n');
    assert.equal(resolveCanonicalSource(file2), 'content/shared/has#hash.md');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('CONTRACT: bash and JS source: parsers agree on YAML shape acceptance', () => {
  // Bash (.ci/scripts/check-source-paths.sh) and JS (getSourceFromFrontmatter)
  // are intentionally divergent on canonical-form enforcement: bash is the
  // stricter CI gate that requires `/shared/...`, while JS is the forgiving
  // runtime that normalizes any recognized form. They MUST agree, however,
  // on:
  //   1. parsing valid YAML scalar shapes (any of: plain, single-quoted,
  //      double-quoted, with optional inline # comments)
  //   2. rejecting malformed quoting (missing close quote, etc.)
  //
  // Drift here would let one accept what the other rejects on the same
  // syntactic input, producing inconsistent behavior between commit-time
  // validation and runtime canonicalization.
  const repoRoot = resolve(__dirname, '../../..');
  const script = join(repoRoot, '.ci/scripts/check-source-paths.sh');

  // YAML-valid shapes: bash should accept (canonical /shared/...) AND JS
  // should extract a non-null path. The path string each produces should
  // also agree (modulo bash returning the raw value, JS returning the
  // normalized content/shared/... form).
  const valid = [
    { name: 'plain canonical', fm: '---\nsource: /shared/foo.md\n---\n', expectPath: 'content/shared/foo.md' },
    { name: 'double-quoted', fm: '---\nsource: "/shared/foo.md"\n---\n', expectPath: 'content/shared/foo.md' },
    { name: 'single-quoted', fm: "---\nsource: '/shared/foo.md'\n---\n", expectPath: 'content/shared/foo.md' },
    { name: 'quoted with trailing comment', fm: '---\nsource: "/shared/foo.md"  # note\n---\n', expectPath: 'content/shared/foo.md' },
    { name: 'plain with trailing comment', fm: '---\nsource: /shared/foo.md  # note\n---\n', expectPath: 'content/shared/foo.md' },
    { name: 'quoted with literal #', fm: '---\nsource: "/shared/has#hash.md"\n---\n', expectPath: 'content/shared/has#hash.md' },
    { name: 'plain with mid-value #', fm: '---\nsource: /shared/has#hash.md\n---\n', expectPath: 'content/shared/has#hash.md' },
    // Lenient YAML: js-yaml accepts no-space before # after a closing quote.
    // Both implementations must follow that lenient interpretation.
    { name: 'double-quoted, no-space comment', fm: '---\nsource: "/shared/foo.md"#note\n---\n', expectPath: 'content/shared/foo.md' },
    { name: 'single-quoted, no-space comment', fm: "---\nsource: '/shared/foo.md'#note\n---\n", expectPath: 'content/shared/foo.md' },
  ];

  // YAML-invalid shapes: both must reject.
  const invalid = [
    { name: 'malformed (missing close quote)', fm: '---\nsource: "/shared/foo.md\n---\n' },
    { name: 'malformed (mismatched quotes)', fm: "---\nsource: \"/shared/x.md'\n---\n" },
  ];

  const dir = mkdtempSync(join(tmpdir(), 'contract-'));
  try {
    for (const { name, fm, expectPath } of valid) {
      const file = join(dir, `valid_${name.replace(/\W+/g, '_')}.md`);
      writeFileSync(file, fm);
      const bash = spawnSync('/bin/bash', [script, file], { encoding: 'utf8' });
      assert.equal(bash.status, 0, `bash rejected valid YAML: ${name}\nstdout: ${bash.stdout}\nstderr: ${bash.stderr}`);
      assert.equal(getSourceFromFrontmatter(file), expectPath, `JS extracted wrong path for: ${name}`);
    }
    for (const { name, fm } of invalid) {
      const file = join(dir, `invalid_${name.replace(/\W+/g, '_')}.md`);
      writeFileSync(file, fm);
      const bash = spawnSync('/bin/bash', [script, file], { encoding: 'utf8' });
      assert.notEqual(bash.status, 0, `bash accepted malformed YAML: ${name}`);
      assert.equal(getSourceFromFrontmatter(file), null, `JS extracted from malformed YAML: ${name}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
