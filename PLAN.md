# Carry InfluxData provenance into LLM-native artifacts (#7290)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stamp InfluxData publisher/origin provenance onto the LLM-native artifacts (per-page Markdown twins, `llms-full.txt`, `llms.txt`) so agents and RAG pipelines can attribute content to the authoritative source.

**Architecture:** One source of truth — `data/influxdata.yml` (added in #7291) — feeds all three surfaces. Provenance is injected at the **build-orchestration layer**, never inside the HTML→Markdown converter, so it is correct regardless of whether the Rust fast path or the JS fallback runs, and the converter stays pure.

**Tech Stack:** Node.js ESM build scripts, `js-yaml`, `node:test`, Hugo templates, Cypress.

Follow-up to #7291 (closed #7243). Parent epic: #7230.

***

## Background (why this design)

The HTML JSON-LD from #7291 never reaches the Markdown twins: the converter
serializes only `article.article--content`, so head JSON-LD is dropped. The twins
carry only `title, description, url, product, version` — no publisher, no
authoritative-source signal.

`scripts/lib/markdown-converter.cjs` has **two** implementations — a Rust fast
path (`scripts/rust-markdown-converter/`, its own `generate_frontmatter`) and a
JS fallback selected at runtime via `USE_RUST`. Editing either converter's
frontmatter generator would drift from the other and require rebuilding the
`.node` binary. Org identity is build-pipeline metadata, not a converter concern,
so we inject it in `scripts/build-llm-markdown.js` after the converter returns.

## File structure

- **Create** `scripts/lib/provenance.js` — load org identity, read sitemap
  origin, inject provenance into a twin string. One responsibility: provenance.
- **Create** `scripts/__tests__/provenance.test.mjs` — unit tests for the module.
- **Create** `scripts/__tests__/build-llm-markdown.test.mjs` — `combineMarkdown`
  provenance test.
- **Create** `cypress/e2e/content/llms-txt-provenance.cy.js` — runtime check of
  the `/llms.txt` publisher line.
- **Modify** `scripts/build-llm-markdown.js` — thread provenance into phase 1
  (page twins) and phase 2 (section bundles); guard `main()` so the module is
  importable by tests.
- **Modify** `scripts/build-llms-full-txt.js` — emit the identity block once per
  corpus header.
- **Modify** `scripts/__tests__/build-llms-full-txt.test.mjs` — assert the
  identity block appears exactly once.
- **Modify** `layouts/index.llmstxt.txt` — one publisher line in the header.
- **Modify** `package.json` — add a `test:build-md` script.
- **Modify** `DOCS-TESTING.md` — document the new provenance fields.

***

## Task 1: Provenance module

**Files:**

- Create: `scripts/lib/provenance.js`

- Test: `scripts/__tests__/provenance.test.mjs`

- [ ] **Step 1: Write the module**

Create `scripts/lib/provenance.js`:

```js
/**
 * Provenance helpers for LLM-native artifacts (issue #7290).
 *
 * Single source of truth for InfluxData org identity is data/influxdata.yml
 * (also consumed by the Organization JSON-LD partial). These helpers let the
 * Markdown/llms build scripts stamp publisher + canonical provenance without
 * duplicating the identity list.
 */
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const FALLBACK_ORIGIN = 'https://docs.influxdata.com';

/**
 * Load InfluxData org identity from data/influxdata.yml.
 * @param {string} dataPath
 * @returns {Promise<{name: string, url: string, sameAs: string[]}>}
 */
export async function loadOrgIdentity(dataPath = 'data/influxdata.yml') {
  const raw = await fs.readFile(dataPath, 'utf-8');
  const data = yaml.load(raw);
  const org = data && data.organization;
  if (!org || !org.name) {
    throw new Error(`Missing organization.name in ${dataPath}`);
  }
  return {
    name: org.name,
    url: org.url || '',
    sameAs: Array.isArray(org.sameAs) ? org.sameAs : [],
  };
}

/**
 * Read the production site origin from public/sitemap-md.xml.
 * Mirrors loadEligibleUrls() in build-llms-full-txt.js so staging builds
 * produce staging URLs and prod builds produce prod URLs.
 * @param {string} publicDir
 * @returns {Promise<string>} origin like "https://docs.influxdata.com"
 */
export async function readSitemapOrigin(publicDir = 'public') {
  const sitemapPath = path.join(publicDir, 'sitemap-md.xml');
  try {
    const xml = await fs.readFile(sitemapPath, 'utf-8');
    const match = xml.match(/<loc>([^<]+)<\/loc>/);
    if (match) return new URL(match[1]).origin;
  } catch {
    /* fall through to fallback */
  }
  return FALLBACK_ORIGIN;
}

/**
 * Inject publisher + canonical into an already-serialized twin Markdown
 * string. Converter-agnostic: works whether the Rust or JS converter produced
 * the frontmatter. Returns the input unchanged if it has no frontmatter.
 * @param {string} markdown
 * @param {{publisher: string, canonical: string}} provenance
 * @returns {string}
 */
export function injectPageProvenance(markdown, { publisher, canonical }) {
  const match = markdown.match(/^---\n([\s\S]+?)\n---\n\n([\s\S]+)$/);
  if (!match) return markdown;
  let fm;
  try {
    fm = yaml.load(match[1]);
  } catch {
    return markdown;
  }
  if (!fm || typeof fm !== 'object') return markdown;
  fm.publisher = publisher;
  fm.canonical = canonical;
  const body = match[2];
  const serialized = yaml.dump(fm, { lineWidth: -1, noRefs: true }).trim();
  return `---\n${serialized}\n---\n\n${body}`;
}
```

- [ ] **Step 2: Write the failing test**

Create `scripts/__tests__/provenance.test.mjs`:

```js
/**
 * Tests for scripts/lib/provenance.js.
 * Run with: node --test scripts/__tests__/provenance.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  loadOrgIdentity,
  readSitemapOrigin,
  injectPageProvenance,
} from '../lib/provenance.js';

test('loadOrgIdentity reads name, url, and sameAs from data file', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    const file = join(dir, 'influxdata.yml');
    writeFileSync(
      file,
      'organization:\n  name: InfluxData\n  url: https://www.influxdata.com\n  sameAs:\n    - https://github.com/influxdata\n    - https://hub.docker.com/u/influxdata\n'
    );
    const org = await loadOrgIdentity(file);
    assert.equal(org.name, 'InfluxData');
    assert.equal(org.url, 'https://www.influxdata.com');
    assert.equal(org.sameAs.length, 2);
    assert.ok(org.sameAs.includes('https://github.com/influxdata'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readSitemapOrigin extracts origin from sitemap-md.xml', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    writeFileSync(
      join(dir, 'sitemap-md.xml'),
      '<urlset><url><loc>https://test2.docs.influxdata.com/influxdb3/core/index.md</loc></url></urlset>'
    );
    assert.equal(
      await readSitemapOrigin(dir),
      'https://test2.docs.influxdata.com'
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readSitemapOrigin falls back to prod origin when sitemap missing', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    assert.equal(await readSitemapOrigin(dir), 'https://docs.influxdata.com');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('injectPageProvenance adds publisher and canonical fields', () => {
  const twin = '---\ntitle: Admin\nurl: http://localhost:1313/influxdb3/core/admin/\n---\n\nBody text.\n';
  const out = injectPageProvenance(twin, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/influxdb3/core/admin/',
  });
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.match(fm, /publisher: InfluxData/);
  assert.match(fm, /canonical: https:\/\/docs\.influxdata\.com\/influxdb3\/core\/admin\//);
  // Original fields preserved
  assert.match(fm, /title: Admin/);
  // Body preserved
  assert.match(out, /Body text\./);
});

test('injectPageProvenance canonical does not use the localhost build url', () => {
  const twin = '---\ntitle: T\nurl: http://localhost:1313/x/\n---\n\nb\n';
  const out = injectPageProvenance(twin, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/x/',
  });
  assert.match(out, /canonical: https:\/\/docs\.influxdata\.com\/x\//);
});

test('injectPageProvenance returns input unchanged when no frontmatter', () => {
  const input = 'no frontmatter here';
  assert.equal(injectPageProvenance(input, { publisher: 'X', canonical: 'Y' }), input);
});
```

- [ ] **Step 3: Run the test to verify it passes**

Run: `node --test scripts/__tests__/provenance.test.mjs`
Expected: PASS (6 tests). The module and test are written together; run confirms green.

- [ ] **Step 4: Commit**

```bash
git add scripts/lib/provenance.js scripts/__tests__/provenance.test.mjs
git commit -m "feat(llm): provenance helpers for LLM-native artifacts (#7290)"
```

***

## Task 2: Wire provenance into Markdown twins

**Files:**

- Modify: `scripts/build-llm-markdown.js`

- Test: `scripts/__tests__/build-llm-markdown.test.mjs`

- Modify: `package.json`

- [ ] **Step 1: Import the provenance helpers**

In `scripts/build-llm-markdown.js`, after the existing import of `content-utils.js`
(around line 45), add:

```js
import {
  loadOrgIdentity,
  readSitemapOrigin,
  injectPageProvenance,
} from './lib/provenance.js';
```

- [ ] **Step 2: Inject provenance in phase 1 (page twins)**

In `buildPageMarkdown`, change the options destructure (line 63) to accept
`provenance`:

```js
const { onlyChanged = false, baseBranch = 'origin/master', provenance = null } =
  options;
```

Then replace the write block (lines 141-143) so the twin is stamped before
writing:

```js
        // Write .md file next to .html
        const mdPath = htmlPath.replace(/index\.html$/, 'index.md');
        const output = provenance
          ? injectPageProvenance(markdown, {
              publisher: provenance.publisher,
              canonical: `${provenance.origin}${urlPath}`,
            })
          : markdown;
        await fs.writeFile(mdPath, output, 'utf-8');
```

- [ ] **Step 3: Inject provenance in phase 2 (section bundles)**

Change `buildSectionBundles` signature (line 199) to accept options:

```js
async function buildSectionBundles(publicDir = 'public', options = {}) {
  const { provenance = null } = options;
```

Change the `combineMarkdown` call (line 230) to pass provenance and the section
path:

```js
        const combined = combineMarkdown(parentMd, childMds, section.url, provenance);
```

In `combineMarkdown` (line 313), add the `provenance` parameter and the two
fields on the section frontmatter object (after `child_pages`, lines 353-357):

```js
function combineMarkdown(parentMd, childMds, sectionUrl, provenance = null) {
```

```js
    child_pages: children.map((c) => ({
      url: c.url,
      title: c.title,
    })),
  };

  if (provenance) {
    frontmatterObj.publisher = provenance.publisher;
    frontmatterObj.canonical = `${provenance.origin}${sectionUrl}`;
  }
```

- [ ] **Step 4: Load provenance once in main() and guard main() for import**

In `main()` (after line 459, `const overallStart = Date.now();`), load identity
and origin once and build the provenance context:

```js
  const overallStart = Date.now();

  // Load org identity + production origin once for provenance stamping (#7290).
  const [org, origin] = await Promise.all([
    loadOrgIdentity(),
    readSitemapOrigin(cliOptions.publicDir),
  ]);
  const provenance = { publisher: org.name, origin };
  console.log(`🏷️  Provenance: publisher=${org.name}, origin=${origin}\n`);
```

Pass it into both phases:

```js
  // Phase 1: Generate individual page markdown
  const pageResults = await buildPageMarkdown(cliOptions.publicDir, {
    onlyChanged: cliOptions.onlyChanged,
    baseBranch: cliOptions.baseBranch,
    provenance,
  });

  // Phase 2: Build section bundles
  const sectionResults = await buildSectionBundles(cliOptions.publicDir, {
    provenance,
  });
```

Replace the unconditional run block (lines 494-498) with an `isMain` guard so the
module can be imported by tests without triggering a build:

```js
// Run if called directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
```

Add `combineMarkdown` to the exports (it is already exported at line 505 — verify
it is present; no change if so).

- [ ] **Step 5: Write the failing test for combineMarkdown provenance**

Create `scripts/__tests__/build-llm-markdown.test.mjs`:

```js
/**
 * Tests for scripts/build-llm-markdown.js (provenance stamping).
 * Run with: node --test scripts/__tests__/build-llm-markdown.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combineMarkdown } from '../build-llm-markdown.js';

const PARENT = '---\ntitle: Get started\ndescription: Intro\nurl: http://localhost:1313/influxdb3/core/get-started/\nproduct: InfluxDB 3 Core\nestimated_tokens: 10\n---\n\nParent body.\n';
const CHILD = '---\ntitle: Setup\nurl: http://localhost:1313/influxdb3/core/get-started/setup/\nestimated_tokens: 5\n---\n\n# Setup\n\nChild body.\n';

test('combineMarkdown stamps publisher and canonical on section frontmatter', () => {
  const out = combineMarkdown(
    PARENT,
    [{ markdown: CHILD, url: '/influxdb3/core/get-started/setup/', title: 'Setup' }],
    '/influxdb3/core/get-started/',
    { publisher: 'InfluxData', origin: 'https://docs.influxdata.com' }
  );
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.match(fm, /publisher: InfluxData/);
  assert.match(fm, /canonical: https:\/\/docs\.influxdata\.com\/influxdb3\/core\/get-started\//);
  assert.match(fm, /type: section/);
});

test('combineMarkdown omits provenance when none supplied', () => {
  const out = combineMarkdown(
    PARENT,
    [{ markdown: CHILD, url: '/x/setup/', title: 'Setup' }],
    '/x/'
  );
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.doesNotMatch(fm, /publisher:/);
  assert.doesNotMatch(fm, /canonical:/);
});
```

- [ ] **Step 6: Add the test script to package.json**

In `package.json` `scripts`, after `"test:corpus-paths"`, add:

```json
    "test:build-md": "node --test scripts/__tests__/build-llm-markdown.test.mjs scripts/__tests__/provenance.test.mjs",
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `yarn test:build-md`
Expected: PASS (8 tests across both files). Confirms `combineMarkdown` stamps
provenance and the module imports cleanly (no build triggered).

- [ ] **Step 8: Commit**

```bash
git add scripts/build-llm-markdown.js scripts/__tests__/build-llm-markdown.test.mjs package.json
git commit -m "feat(llm): stamp publisher + canonical on Markdown twins (#7290)"
```

***

## Task 3: Identity block in llms-full.txt

**Files:**

- Modify: `scripts/build-llms-full-txt.js`

- Test: `scripts/__tests__/build-llms-full-txt.test.mjs`

- [ ] **Step 1: Import loadOrgIdentity**

In `scripts/build-llms-full-txt.js`, near the existing `getCorpusPaths` import
(line 28), add:

```js
import { loadOrgIdentity } from './lib/provenance.js';
```

- [ ] **Step 2: Accept org in buildProduct and emit the identity block once**

Change the `buildProduct` signature (line 139) to accept an optional `org`:

```js
export async function buildProduct(product, eligible, root = PUBLIC_ROOT, org) {
```

Replace the header array (lines 171-178) so the publisher + sameAs lines are
included once per corpus when `org` is supplied:

```js
  const identityLines =
    org && org.name
      ? [
          `> Publisher: ${org.name} (${org.url})`,
          `> sameAs: ${org.sameAs.join(', ')}`,
        ]
      : [];
  const header = [
    `# ${product.name} — full Markdown corpus`,
    '',
    `> Generated ${timestamp} from ${origin}/${product.path}/`,
    `> See ${origin}/llms.txt for the cross-product table of contents.`,
    ...identityLines,
    '',
  ].join('\n');
```

- [ ] **Step 3: Load org once in main() and pass it to buildProduct**

In `main()` (after `const eligible = await loadEligibleUrls();`, line 196), load
org once:

```js
  const eligible = await loadEligibleUrls();
  const org = await loadOrgIdentity();
```

Change the `buildProduct` call in the loop (line 204):

```js
      const result = await buildProduct(product, eligible, PUBLIC_ROOT, org);
```

- [ ] **Step 4: Write the failing test (identity block exactly once)**

In `scripts/__tests__/build-llms-full-txt.test.mjs`, add this test at the end of
the file (the fixture has two eligible pages: alpha, gamma):

```js
test('buildProduct emits the org identity block exactly once per corpus', async () => {
  const { root, productPath } = setupFixture();
  try {
    const eligible = await loadEligibleUrls(root);
    const org = {
      name: 'InfluxData',
      url: 'https://www.influxdata.com',
      sameAs: ['https://github.com/influxdata', 'https://hub.docker.com/u/influxdata'],
    };
    await buildProduct({ path: productPath, name: 'Foo v1' }, eligible, root, org);

    const corpus = readFileSync(join(root, productPath, 'llms-full.txt'), 'utf-8');
    // Publisher line appears exactly once (corpus header), not per page.
    const publisherMatches = corpus.match(/> Publisher: InfluxData/g) || [];
    assert.equal(publisherMatches.length, 1, 'publisher line must appear once');
    assert.match(corpus, /> sameAs: https:\/\/github\.com\/influxdata/);
    // Still has both page bodies (block did not displace content).
    assert.match(corpus, /# Alpha Page/);
    assert.match(corpus, /# Gamma Page/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `yarn test:build-llms-full`
Expected: PASS, including the new "exactly once" test. The pre-existing
`buildProduct` tests call it with 3 args (no `org`), so they emit no identity
block and remain green.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-llms-full-txt.js scripts/__tests__/build-llms-full-txt.test.mjs
git commit -m "feat(llm): org identity block in llms-full.txt corpus header (#7290)"
```

***

## Task 4: Publisher line in llms.txt + runtime check

**Files:**

- Modify: `layouts/index.llmstxt.txt`

- Create: `cypress/e2e/content/llms-txt-provenance.cy.js`

- [ ] **Step 1: Add the publisher line to the template**

In `layouts/index.llmstxt.txt`, replace the blockquote/intro block (the lines
`# InfluxData Documentation` through the "This documentation covers..."
paragraph) with a version that reads org identity from `site.Data.influxdata`:

```go-html-template
{{- $org := site.Data.influxdata.organization -}}
# InfluxData Documentation

> Documentation for InfluxDB time series database and related tools including Telegraf, Chronograf, and Kapacitor.

> Publisher: {{ $org.name }} ({{ $org.url }}). Authoritative source for InfluxData product documentation.

This documentation covers all InfluxDB versions and ecosystem tools. Each section provides comprehensive guides, API references, and tutorials.
```

(Use a literal em dash only inside Markdown content; here the line uses plain
parentheses, so no typographer concern.)

- [ ] **Step 2: Write the runtime check**

Create `cypress/e2e/content/llms-txt-provenance.cy.js`:

```js
/**
 * Verifies /llms.txt carries the InfluxData publisher line (#7290).
 * Runtime check: the line is rendered by the Hugo template from
 * data/influxdata.yml, so it must be asserted against a built/served file.
 */
describe('llms.txt provenance', () => {
  it('includes the InfluxData publisher line', () => {
    cy.request('/llms.txt').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include('Publisher: InfluxData');
      expect(response.body).to.include('https://www.influxdata.com');
    });
  });
});
```

- [ ] **Step 3: Build and run the runtime check**

The Hugo dev server must be running (see the `cypress-e2e-testing` skill). Then:

```bash
npx hugo --quiet
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/llms-txt-provenance.cy.js" --no-mapping
```

Expected: 1 passing test. `/llms.txt` contains `Publisher: InfluxData` and the
company URL.

- [ ] **Step 4: Commit**

```bash
git add layouts/index.llmstxt.txt cypress/e2e/content/llms-txt-provenance.cy.js
git commit -m "feat(llm): publisher line in llms.txt header (#7290)"
```

***

## Task 5: Document the provenance fields

**Files:**

- Modify: `DOCS-TESTING.md`

- [ ] **Step 1: Update the frontmatter structure docs**

In `DOCS-TESTING.md`, in the "LLM-Friendly Markdown Generation" → "Frontmatter
Structure" section, add the two new fields to the per-page YAML example and a
short note. After the existing `estimated_tokens: 2500` line in the page-frontmatter
block, add:

```yaml
publisher: InfluxData
canonical: https://docs.influxdata.com/influxdb3/core/get-started/
```

Then add this paragraph immediately below that code block:

```markdown
**Provenance fields (#7290):** `publisher` and `canonical` identify InfluxData as
the authoritative source. Both are stamped at build time from
`data/influxdata.yml` by `scripts/lib/provenance.js`. `canonical` always uses the
production origin from `public/sitemap-md.xml`, not the build `url` (which may be
`localhost` in dev). `llms-full.txt` carries the same identity (publisher + url +
`sameAs`) once in each corpus header; `llms.txt` carries a single publisher line.
```

- [ ] **Step 2: Commit**

```bash
git add DOCS-TESTING.md
git commit -m "docs(testing): document LLM-artifact provenance fields (#7290)"
```

***

## Task 6: Full-build verification

**Files:** none (verification only)

- [ ] **Step 1: Run all unit tests**

```bash
yarn test:build-md && yarn test:build-llms-full && yarn test:corpus-paths
```

Expected: all PASS.

- [ ] **Step 2: Build the site and the artifacts**

```bash
yarn build:ts && npx hugo --quiet && yarn build:md && yarn build:llms-full
```

Expected: completes without errors. (`build:md` prints a `🏷️ Provenance:` line.)

- [ ] **Step 3: Verify a page twin carries provenance**

```bash
grep -E '^(publisher|canonical):' public/influxdb3/core/admin/index.md
```

Expected: two lines — `publisher: InfluxData` and a `canonical:` URL beginning
`https://` (not `localhost`).

- [ ] **Step 4: Verify the corpus header carries the identity block once**

```bash
grep -c '> Publisher: InfluxData' public/influxdb3/core/llms-full.txt
```

Expected: `1`.

- [ ] **Step 5: Verify llms.txt carries the publisher line**

```bash
grep 'Publisher: InfluxData' public/llms.txt
```

Expected: one matching line.

- [ ] **Step 6: Confirm no provenance leaked into corpus page bodies**

```bash
grep -c '^canonical:' public/influxdb3/core/llms-full.txt
```

Expected: `0` (page twins' frontmatter is stripped when flattened into the
corpus; the corpus carries identity only in its header).

***

## Acceptance criteria (from #7290)

- [ ] Twin frontmatter includes `publisher` and a canonical production URL. (Tasks 1, 2, 6)
- [ ] `llms-full.txt` carries an org-identity header block exactly once per corpus. (Tasks 3, 6)
- [ ] `llms.txt` carries a publisher line. (Tasks 4, 6)
- [ ] All values sourced from `data/influxdata.yml` (no duplicated list). (Tasks 1, 3, 4)
- [ ] Tests assert the twin fields, the single corpus-header block, and the `llms.txt` line. (Tasks 1, 2, 3, 4)
- [ ] `DOCS-TESTING.md` updated. (Task 5)

## Out of scope (flagged, not actioned)

- **Dead code:** the Lambda\@Edge on-demand twin generator is dead; `DOCS-TESTING.md`
  still references `deploy/llm-markdown/lambda-edge/markdown-generator/` and
  `scripts/lib/markdown-converter.js` (now `.cjs`); that dir does not exist.
- **Converter duality:** if Rust is the only intended converter, the JS
  `generateFrontmatter()` and the `USE_RUST` fallback in `markdown-converter.cjs`
  are dead/divergent. Separate cleanup.
- HTML JSON-LD (done in #7291). SoftwareApplication `sameAs` (no issue yet).
