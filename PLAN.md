# Design Spec: Migrate `code-placeholders` shortcode → `placeholders` fence attribute

> Ephemeral. This file (spec + implementation plan) is auto-removed by
> `.github/workflows/cleanup-ephemeral-docs.yml` on merge to `master`.

## Problem

Documentation wraps code blocks in a `code-placeholders` shortcode to mark
editable placeholder tokens:

````md
{{% code-placeholders "REGEXP" %}}
```syntax
Some code
```
{{% /code-placeholders %}}
````

When this wrapper is used inside a list (or other nested block), the shortcode
must be indented to the list-item column while the fenced code block is left at
column 0 — a Hugo rendering workaround. This is brittle: it frequently breaks
list nesting and resets list-item counters.

The `placeholders` fenced-code-block attribute produces identical rendered
output without a wrapper and survives list nesting cleanly:

````md
```syntax { placeholders="REGEXP" }
Some code
```
````

The attribute is already implemented in
`layouts/_default/_markup/render-codeblock.html` and exercised in
`content/example.md`. No template work is required.

## Goal

Convert every `code-placeholders` shortcode wrapper in `content/` to the
equivalent per-fence `placeholders="REGEXP"` attribute and remove the wrapper,
with no change to rendered output (except intended list-nesting fixes).

- Scope: ~654 wrapper open-tags across ~231 files in `content/`.
- Both delimiter forms: `{{% code-placeholders "…" %}}` (~629) and
  `{{< code-placeholders "…" >}}` (~25), with matching close tags.

## Out of scope

- `code-placeholder-key` — a separate inline `<span>` legend shortcode
  (~247 files). Unrelated; not modified.
- The optional second positional color arg of `code-placeholders` — verified
  zero usages in `content/`.
- Template/render-hook changes — the attribute path already works.

## Approach

A single throwaway Node codemod script (e.g.
`scripts/migrate-code-placeholders.mjs`). It is **not** retained: it is removed
before merge along with this `PLAN.md`.

### Per-file transform

Process each file with a line-oriented model that tracks:

- Fenced-code state — both ` ``` ` and `~~~` fences, including the info string
  (language + optional `{ … }` attribute block).
- `code-placeholders` wrapper open/close tags, both `%` and `<` delimiters, at
  any indentation.
- The indentation column of the wrapper open tag.

For each wrapper region (open → close):

1. **Identify every top-level fenced code block** between the open and close
   tags. (Prose and blank lines between fences are preserved — multi-fence
   spans get the attribute applied to *each* fence.)
2. **Inject the attribute** into each fence's info string:
   - Bare info string: ` ```py ` → ` ```py { placeholders="REGEXP" } `
   - Existing brace attributes: ` ```sh { callout="--host" } ` →
     ` ```sh { callout="--host" placeholders="REGEXP" } ` (merge, do not
     overwrite or duplicate the brace block).
   - If a fence already has `placeholders=`: leave it unchanged and record it
     in the report (avoid double application).
3. **Delete** the wrapper open and close tag lines, and any blank lines that
   existed solely to separate the wrapper tags from the fence(s).
4. **Re-indent for list nesting**: if the wrapper open tag was indented (column
   > 0), indent the fence opener, fence body, and fence closer to the open
   tag's column. Top-level (column-0) wrappers leave fences at column 0.
   Interleaved lines inside the region (e.g. prose, `<!--pytest-codeblocks…-->`
   comments) are re-indented to the same column.
5. **Skip + report** any wrapper region containing a `code-tabs-wrapper`,
   `code-tabs`, or `code-tab-content` shortcode. These are structurally
   trickier and rare; they are listed for manual conversion rather than
   auto-transformed.

### Edge cases handled explicitly

- `{{< … >}}` delimiter variant — same transform; close tag is
  `{{< /code-placeholders >}}`.
- `<!--pytest-codeblocks:cont-->` and similar HTML comments interleaved between
  the wrapper open and a fence — preserved and re-indented with the block.
- `~~~` fences as well as ` ``` ` fences.
- Deeper / nested-list indentation — re-indent uses the wrapper open tag's
  actual column, not a hardcoded width.
- Shortcodes inside a fence (e.g. `{{% latest-patch %}}`) — no special
  handling needed; Hugo processes shortcodes inside fences regardless of the
  wrapper.
- Wrapper containing no fenced code block — none found in sampling; if
  encountered, skip + report rather than guess.

## Verification

Rendered-HTML diff on affected pages:

1. Capture the affected file list (files containing `code-placeholders`).
2. Clean tree: `npx hugo --quiet`; snapshot rendered HTML for the affected
   pages; extract and normalize the code-block / `code-placeholder-wrapper`
   DOM.
3. Run the codemod.
4. `npx hugo --quiet` again; extract and normalize the same DOM.
5. Diff normalized before/after code-block HTML.
   - Expected: zero diff for auto-transformed files.
   - Known intended difference: list-nested blocks now render *inside* their
     list item where the old column-0 fence rendered outside it / reset the
     counter. The diff review distinguishes these intended nesting fixes from
     regressions; nesting-context changes are accepted as correct-by-design.
6. Manually convert + re-verify the reported `code-tabs-wrapper` files and any
   other skip+report cases.
7. Final full `npx hugo` build passes cleanly.

## Deliverables

- Migrated `content/` files.
- Throwaway codemod script (removed before merge).
- A short migration report: counts of fences transformed, files skipped for
  manual handling, files manually edited.
- Verification summary: result of the before/after normalized-HTML diff.

## Risks

- **Re-indent correctness** in deeply nested or mixed-indentation list
  contexts. Mitigated by the rendered-HTML diff and explicit nesting-context
  review.
- **Attribute-merge** into pre-existing brace blocks (e.g. `callout=`).
  Mitigated by fixture tests in the plan and the HTML diff.
- **Hidden wrapper-without-fence or unusual nesting** patterns. Mitigated by
  skip + report (never silently guess).

---

# Code-placeholders → fence-attribute migration: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert every `code-placeholders` shortcode wrapper in `content/` to
the per-fence `placeholders="REGEXP"` attribute, with verified rendered-output
parity.

**Architecture:** A throwaway Node ESM codemod built as small pure helpers
(`injectAttr`, `parseOpenTag`, `isCloseTag`, `regionContainsTabs`,
`reindentRegion`) composed by a pure `migrate(source)` function, each
unit-tested with `node --test` fixtures. A thin CLI walks `content/`. A
separate verification script diffs normalized rendered HTML (textual code
content + placeholder token set) before vs. after a full Hugo build. Script
and tests are removed before merge along with this `PLAN.md`.

**Tech Stack:** Node.js ≥22 ESM, built-in `node:test`/`node:assert`,
`glob` (already a dependency), Hugo (`npx hugo`).

**File structure:**
- Create (throwaway): `scripts/migrate-code-placeholders.mjs` — helpers +
  `migrate()` + CLI.
- Create (throwaway): `scripts/migrate-code-placeholders.test.mjs` — unit
  tests / fixtures.
- Create (throwaway): `scripts/verify-placeholders-migration.mjs` — HTML
  parity checker.
- Modify: files under `content/**/*.md` (the migration output).

---

### Task 1: Scaffold module + `injectAttr` (bare / empty-lang / `~~~`)

**Files:**
- Create: `scripts/migrate-code-placeholders.mjs`
- Test: `scripts/migrate-code-placeholders.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `scripts/migrate-code-placeholders.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { injectAttr } from './migrate-code-placeholders.mjs';

test('injectAttr: bare language fence', () => {
  const r = injectAttr('```py', 'API_TOKEN');
  assert.equal(r.line, '```py { placeholders="API_TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: empty language fence', () => {
  const r = injectAttr('```', 'TOKEN');
  assert.equal(r.line, '``` { placeholders="TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: tilde fence preserves marker', () => {
  const r = injectAttr('~~~sh', 'X|Y');
  assert.equal(r.line, '~~~sh { placeholders="X|Y" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: preserves leading indentation', () => {
  const r = injectAttr('    ```js', 'TOK');
  assert.equal(r.line, '    ```js { placeholders="TOK" }');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: FAIL — `Cannot find module './migrate-code-placeholders.mjs'` (or
`injectAttr is not a function`).

- [ ] **Step 3: Write minimal implementation**

Create `scripts/migrate-code-placeholders.mjs`:

```js
// THROWAWAY codemod. Removed before merge with PLAN.md.
// Converts {{% code-placeholders "RE" %}} ... wrappers to the
// ```lang { placeholders="RE" } fenced-code attribute.

/**
 * Inject (or merge) a placeholders attribute into a fence opening line.
 * @param {string} line  the fence-open line (may be indented)
 * @param {string} regex the placeholder regexp from the wrapper
 * @returns {{line:string, status:'injected'|'merged'|'present'|'skip'}}
 */
export function injectAttr(line, regex) {
  const m = line.match(/^(\s*)(`{3,}|~{3,})[ \t]*(.*?)\s*$/);
  if (!m) return { line, status: 'skip' };
  const [, indent, fence, info] = m;
  if (/\bplaceholders\s*=/.test(info)) {
    return { line, status: 'present' };
  }
  const brace = info.match(/^(.*?)\{\s*([\s\S]*?)\s*\}\s*$/);
  if (brace) {
    const lang = brace[1].trim();
    const inner = brace[2].trim();
    const merged = inner.length
      ? `${inner} placeholders="${regex}"`
      : `placeholders="${regex}"`;
    const langPart = lang.length ? `${lang} ` : '';
    return {
      line: `${indent}${fence}${langPart}{ ${merged} }`,
      status: 'merged',
    };
  }
  const lang = info.trim();
  return {
    line: `${indent}${fence}${lang} { placeholders="${regex}" }`,
    status: 'injected',
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.mjs scripts/migrate-code-placeholders.test.mjs
git commit -m "chore(migration): scaffold code-placeholders codemod, injectAttr"
```

---

### Task 2: `injectAttr` — merge into existing brace, skip if present

**Files:**
- Modify: `scripts/migrate-code-placeholders.mjs` (replace `injectAttr` body —
  full function shown below; it is already complete from Task 1, this task
  adds tests proving the merge/present branches and the empty-lang `{` form).
- Test: `scripts/migrate-code-placeholders.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to `scripts/migrate-code-placeholders.test.mjs`:

```js
test('injectAttr: merges into existing brace attributes', () => {
  const r = injectAttr('```sh { callout="--host" callout-color="orange" }', 'DB_NAME');
  assert.equal(
    r.line,
    '```sh { callout="--host" callout-color="orange" placeholders="DB_NAME" }'
  );
  assert.equal(r.status, 'merged');
});

test('injectAttr: merges into brace with no spaces', () => {
  const r = injectAttr('```bash {callout="--x"}', 'TOK');
  assert.equal(r.line, '```bash { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: empty brace block', () => {
  const r = injectAttr('```sh {  }', 'TOK');
  assert.equal(r.line, '```sh { placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: already has placeholders -> present, unchanged', () => {
  const original = '```sh { placeholders="OLD" }';
  const r = injectAttr(original, 'NEW');
  assert.equal(r.line, original);
  assert.equal(r.status, 'present');
});
```

- [ ] **Step 2: Run test to verify it fails or passes**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS — the Task 1 implementation already covers these branches.
If any FAIL, fix `injectAttr` so all 8 tests pass (the function above is the
intended final form).

- [ ] **Step 3: No code change needed if green**

If Step 2 is fully green, no implementation change. If red, reconcile
`injectAttr` to the Task 1 listing exactly.

- [ ] **Step 4: Re-run**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.test.mjs scripts/migrate-code-placeholders.mjs
git commit -m "test(migration): cover injectAttr merge/present branches"
```

---

### Task 3: `parseOpenTag`, `isCloseTag`, `isOpenTagAny`

**Files:**
- Modify: `scripts/migrate-code-placeholders.mjs` (add three exports)
- Test: `scripts/migrate-code-placeholders.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append to the test file:

```js
import {
  parseOpenTag,
  isCloseTag,
  isOpenTagAny,
} from './migrate-code-placeholders.mjs';

test('parseOpenTag: percent delimiter, no indent', () => {
  const r = parseOpenTag('{{% code-placeholders "API_TOKEN" %}}');
  assert.deepEqual(r, { indent: '', regex: 'API_TOKEN' });
});

test('parseOpenTag: angle delimiter, indented', () => {
  const r = parseOpenTag('    {{< code-placeholders "DB|AUTH" >}}');
  assert.deepEqual(r, { indent: '    ', regex: 'DB|AUTH' });
});

test('parseOpenTag: complex regex with nested groups', () => {
  const r = parseOpenTag(
    '{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}'
  );
  assert.equal(r.regex, '(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)');
});

test('parseOpenTag: non-open returns null', () => {
  assert.equal(parseOpenTag('```py'), null);
  assert.equal(parseOpenTag('{{% code-placeholder-key %}}'), null);
});

test('isCloseTag: both delimiters, indented, spaced slash', () => {
  assert.equal(isCloseTag('{{% /code-placeholders %}}'), true);
  assert.equal(isCloseTag('   {{< /code-placeholders >}}'), true);
  assert.equal(isCloseTag('{{% / code-placeholders %}}'), true);
  assert.equal(isCloseTag('{{% code-placeholders "X" %}}'), false);
});

test('isOpenTagAny: detects any open regardless of regex', () => {
  assert.equal(isOpenTagAny('{{% code-placeholders "X" %}}'), true);
  assert.equal(isOpenTagAny('{{< code-placeholders "Y" >}}'), true);
  assert.equal(isOpenTagAny('{{% /code-placeholders %}}'), false);
  assert.equal(isOpenTagAny('plain text'), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: FAIL — `parseOpenTag is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `scripts/migrate-code-placeholders.mjs`:

```js
const OPEN_RE =
  /^(\s*)\{\{[%<]\s*code-placeholders\s+"([^"]*)"(?:\s+\S+)*\s*[%>]\}\}\s*$/;
const CLOSE_RE =
  /^\s*\{\{[%<]\s*\/\s*code-placeholders\s*[%>]\}\}\s*$/;
const OPEN_ANY_RE =
  /^\s*\{\{[%<]\s*code-placeholders\s+"[^"]*"(?:\s+\S+)*\s*[%>]\}\}\s*$/;

/** @returns {{indent:string, regex:string}|null} */
export function parseOpenTag(line) {
  const m = line.match(OPEN_RE);
  return m ? { indent: m[1], regex: m[2] } : null;
}

/** @returns {boolean} */
export function isCloseTag(line) {
  return CLOSE_RE.test(line);
}

/** @returns {boolean} */
export function isOpenTagAny(line) {
  return OPEN_ANY_RE.test(line);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS (all prior + 6 new).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.mjs scripts/migrate-code-placeholders.test.mjs
git commit -m "feat(migration): add wrapper open/close tag parsers"
```

---

### Task 4: `regionContainsTabs` and `reindentRegion`

**Files:**
- Modify: `scripts/migrate-code-placeholders.mjs` (add two exports)
- Test: `scripts/migrate-code-placeholders.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append:

```js
import {
  regionContainsTabs,
  reindentRegion,
} from './migrate-code-placeholders.mjs';

test('regionContainsTabs: detects code-tabs-wrapper family', () => {
  assert.equal(regionContainsTabs(['```sh', 'x', '```']), false);
  assert.equal(
    regionContainsTabs(['{{< code-tabs-wrapper >}}', '```sh', '```']),
    true
  );
  assert.equal(regionContainsTabs(['{{% code-tab-content %}}']), true);
  assert.equal(regionContainsTabs(['{{% code-tabs %}}']), true);
});

test('reindentRegion: rebases min-indent to target width', () => {
  const out = reindentRegion(['```py', 'a = 1', '    nested', '```'], 4);
  assert.deepEqual(out, [
    '    ```py',
    '    a = 1',
    '        nested',
    '    ```',
  ]);
});

test('reindentRegion: blank lines stay empty', () => {
  const out = reindentRegion(['```py', '', 'x', '```'], 2);
  assert.deepEqual(out, ['  ```py', '', '  x', '  ```']);
});

test('reindentRegion: preserves relative indent when base > 0', () => {
  const out = reindentRegion(['  ```py', '  x', '    y', '  ```'], 4);
  assert.deepEqual(out, ['    ```py', '    x', '      y', '    ```']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: FAIL — `regionContainsTabs is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `scripts/migrate-code-placeholders.mjs`:

```js
const TABS_RE =
  /\{\{[%<]\s*\/?\s*(code-tabs-wrapper|code-tabs|code-tab-content)\b/;

/** @param {string[]} lines @returns {boolean} */
export function regionContainsTabs(lines) {
  return lines.some((l) => TABS_RE.test(l));
}

/**
 * Rebase the region's minimum indentation to `width` spaces,
 * preserving relative indentation. Blank lines become ''.
 * @param {string[]} region @param {number} width
 * @returns {string[]}
 */
export function reindentRegion(region, width) {
  const nonBlank = region.filter((l) => l.trim() !== '');
  const minIndent = nonBlank.length
    ? Math.min(...nonBlank.map((l) => l.match(/^ */)[0].length))
    : 0;
  const pad = ' '.repeat(width);
  return region.map((l) => (l.trim() === '' ? '' : pad + l.slice(minIndent)));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.mjs scripts/migrate-code-placeholders.test.mjs
git commit -m "feat(migration): add tabs detection and region re-indent"
```

---

### Task 5: `migrate(source)` — compose all helpers

**Files:**
- Modify: `scripts/migrate-code-placeholders.mjs` (add `migrate` export +
  internal `regionFenceOpenIndices`)
- Test: `scripts/migrate-code-placeholders.test.mjs`

- [ ] **Step 1: Write the failing tests**

Append (fixtures cover every spec case):

```js
import { migrate } from './migrate-code-placeholders.mjs';

const NL = '\n';

test('migrate: simple single-fence percent wrapper', () => {
  const src = [
    '{{% code-placeholders "API_TOKEN" %}}',
    '',
    '```sh',
    'echo API_TOKEN',
    '```',
    '',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'a.md' });
  assert.equal(
    content,
    ['```sh { placeholders="API_TOKEN" }', 'echo API_TOKEN', '```'].join(NL)
  );
  assert.equal(report.transformed, 1);
  assert.equal(report.skipped.length, 0);
});

test('migrate: multi-fence span with prose between', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    '```sh',
    'one',
    '```',
    '',
    'prose here',
    '',
    '```sh',
    'two',
    '```',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'b.md' });
  assert.equal(
    content,
    [
      '```sh { placeholders="RE" }',
      'one',
      '```',
      '',
      'prose here',
      '',
      '```sh { placeholders="RE" }',
      'two',
      '```',
    ].join(NL)
  );
  assert.equal(report.transformed, 2);
});

test('migrate: list-nested indented wrapper re-indents block', () => {
  const src = [
    '1.  Do this',
    '2.  Update the following code:',
    '',
    '    {{% code-placeholders "TOK" %}}',
    '```py',
    'x = TOK',
    '```',
    '    {{% /code-placeholders %}}',
    '',
    '3.  Now do this!',
  ].join(NL);
  const { content } = migrate(src, { file: 'c.md' });
  assert.equal(
    content,
    [
      '1.  Do this',
      '2.  Update the following code:',
      '',
      '    ```py { placeholders="TOK" }',
      '    x = TOK',
      '    ```',
      '',
      '3.  Now do this!',
    ].join(NL)
  );
});

test('migrate: angle-bracket delimiter variant', () => {
  const src = [
    '{{< code-placeholders "DB|AUTH" >}}',
    '```sh',
    'q',
    '```',
    '{{< /code-placeholders >}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'd.md' });
  assert.equal(
    content,
    ['```sh { placeholders="DB|AUTH" }', 'q', '```'].join(NL)
  );
  assert.equal(report.transformed, 1);
});

test('migrate: code-tabs-wrapper region is skipped + reported', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    '{{< code-tabs-wrapper >}}',
    '```bash',
    'x',
    '```',
    '{{< /code-tabs-wrapper >}}',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'e.md' });
  assert.equal(content, src); // unchanged
  assert.equal(report.transformed, 0);
  assert.equal(report.skipped.length, 1);
  assert.equal(report.skipped[0].reason, 'code-tabs-wrapper');
  assert.equal(report.skipped[0].file, 'e.md');
});

test('migrate: wrapper with no fence is skipped + reported', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    'just prose, no code',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'f.md' });
  assert.equal(content, src);
  assert.equal(report.skipped[0].reason, 'no-fence');
});

test('migrate: fence already has placeholders -> counted, left intact', () => {
  const src = [
    '{{% code-placeholders "NEW" %}}',
    '```sh { placeholders="OLD" }',
    'x',
    '```',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'g.md' });
  assert.equal(
    content,
    ['```sh { placeholders="OLD" }', 'x', '```'].join(NL)
  );
  assert.equal(report.alreadyPresent, 1);
  assert.equal(report.transformed, 0);
});

test('migrate: nested open before close -> skipped unchanged', () => {
  const src = [
    '{{% code-placeholders "A" %}}',
    '{{% code-placeholders "B" %}}',
    '```sh',
    'x',
    '```',
    '{{% /code-placeholders %}}',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'h.md' });
  assert.equal(content, src);
  assert.equal(report.skipped.some((s) => s.reason === 'nested'), true);
});

test('migrate: preserves interleaved pytest comment, re-indented', () => {
  const src = [
    '1.  Step',
    '',
    '    {{< code-placeholders "DB" >}}',
    '',
    '    <!--pytest-codeblocks:cont-->',
    '```sh',
    'q DB',
    '```',
    '    {{< /code-placeholders >}}',
  ].join(NL);
  const { content } = migrate(src, { file: 'i.md' });
  assert.equal(
    content,
    [
      '1.  Step',
      '',
      '    <!--pytest-codeblocks:cont-->',
      '    ```sh { placeholders="DB" }',
      '    q DB',
      '    ```',
    ].join(NL)
  );
});

test('migrate: file with no wrapper is returned unchanged', () => {
  const src = '# Title\n\n```sh\necho hi\n```\n';
  const { content, report } = migrate(src, { file: 'j.md' });
  assert.equal(content, src);
  assert.equal(report.transformed, 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: FAIL — `migrate is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `scripts/migrate-code-placeholders.mjs`:

```js
/**
 * Indices (within `region`) of fence-OPEN lines at top level
 * (not inside another fence). Handles ``` and ~~~, length-aware close.
 * @param {string[]} region @returns {number[]}
 */
function regionFenceOpenIndices(region) {
  const opens = [];
  let marker = null; // { char, len }
  for (let i = 0; i < region.length; i++) {
    const m = region[i].match(/^\s*(`{3,}|~{3,})(.*)$/);
    if (!marker) {
      if (m) {
        marker = { char: m[1][0], len: m[1].length };
        opens.push(i);
      }
    } else if (
      m &&
      m[1][0] === marker.char &&
      m[1].length >= marker.len &&
      m[2].trim() === ''
    ) {
      marker = null;
    }
  }
  return opens;
}

/**
 * Convert all code-placeholders wrappers in `source`.
 * @param {string} source
 * @param {{file?:string}} [opts]
 * @returns {{content:string, report:{
 *   transformed:number, alreadyPresent:number,
 *   skipped:{file:string,line:number,reason:string}[]
 * }}}
 */
export function migrate(source, opts = {}) {
  const file = opts.file ?? '<unknown>';
  const lines = source.split('\n');
  const out = [];
  const report = { transformed: 0, alreadyPresent: 0, skipped: [] };
  let i = 0;

  while (i < lines.length) {
    const open = parseOpenTag(lines[i]);
    if (!open) {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Find matching close; guard against nested open.
    let j = i + 1;
    let nested = false;
    while (j < lines.length && !isCloseTag(lines[j])) {
      if (isOpenTagAny(lines[j])) {
        nested = true;
        break;
      }
      j++;
    }

    if (nested || j >= lines.length) {
      report.skipped.push({
        file,
        line: i + 1,
        reason: nested ? 'nested' : 'unclosed',
      });
      out.push(lines[i]);
      i++;
      continue;
    }

    let region = lines.slice(i + 1, j);

    if (regionContainsTabs(region)) {
      report.skipped.push({ file, line: i + 1, reason: 'code-tabs-wrapper' });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    const fenceIdx = regionFenceOpenIndices(region);
    if (fenceIdx.length === 0) {
      report.skipped.push({ file, line: i + 1, reason: 'no-fence' });
      for (let k = i; k <= j; k++) out.push(lines[k]);
      i = j + 1;
      continue;
    }

    for (const idx of fenceIdx) {
      const res = injectAttr(region[idx], open.regex);
      region[idx] = res.line;
      if (res.status === 'present') report.alreadyPresent++;
      else if (res.status === 'injected' || res.status === 'merged')
        report.transformed++;
    }

    // Trim blank lines at region boundaries (separators to the
    // removed wrapper tags).
    while (region.length && region[0].trim() === '') region.shift();
    while (region.length && region[region.length - 1].trim() === '')
      region.pop();

    if (open.indent.length > 0) {
      region = reindentRegion(region, open.indent.length);
    }

    for (const rl of region) out.push(rl);
    i = j + 1;
  }

  return { content: out.join('\n'), report };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS (all tasks' tests green).

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.mjs scripts/migrate-code-placeholders.test.mjs
git commit -m "feat(migration): implement migrate() composing all helpers"
```

---

### Task 6: CLI runner over `content/`

**Files:**
- Modify: `scripts/migrate-code-placeholders.mjs` (add CLI `main`, run on
  direct invocation)
- Test: manual (dry-run output inspected in Task 8)

- [ ] **Step 1: Add the CLI**

Append to `scripts/migrate-code-placeholders.mjs`:

```js
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

async function main(argv) {
  const dryRun = argv.includes('--dry-run');
  const files = await glob('content/**/*.md', { nodir: true });
  const summary = {
    filesScanned: 0,
    filesChanged: 0,
    transformed: 0,
    alreadyPresent: 0,
    skipped: [],
  };

  for (const f of files.sort()) {
    const src = await readFile(f, 'utf8');
    if (!/\{\{[%<]\s*code-placeholders\s+"/.test(src)) continue;
    summary.filesScanned++;
    const { content, report } = migrate(src, { file: f });
    summary.transformed += report.transformed;
    summary.alreadyPresent += report.alreadyPresent;
    summary.skipped.push(...report.skipped);
    if (content !== src) {
      summary.filesChanged++;
      if (!dryRun) await writeFile(f, content, 'utf8');
    }
  }

  console.log(JSON.stringify(summary, null, 2));
  console.log(
    `\n${dryRun ? '[DRY RUN] ' : ''}scanned=${summary.filesScanned} ` +
      `changed=${summary.filesChanged} transformed=${summary.transformed} ` +
      `alreadyPresent=${summary.alreadyPresent} ` +
      `skipped=${summary.skipped.length}`
  );
  if (summary.skipped.length) {
    console.log('\nSkipped (manual handling required):');
    for (const s of summary.skipped)
      console.log(`  ${s.file}:${s.line}  (${s.reason})`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
```

- [ ] **Step 2: Verify unit tests still pass (no regression from import)**

Run: `node --test scripts/migrate-code-placeholders.test.mjs`
Expected: PASS (imports are top-level but unused by tests; module still
loads).

- [ ] **Step 3: Smoke-test the CLI dry-run loads**

Run: `node scripts/migrate-code-placeholders.mjs --dry-run | tail -5`
Expected: prints a `scanned=… changed=… transformed=…` summary line and a
skipped list, makes **no file changes** (`git status --porcelain content/`
is empty).

- [ ] **Step 4: Confirm no content changed**

Run: `git status --porcelain content/ | head`
Expected: empty output.

- [ ] **Step 5: Commit**

```bash
git add scripts/migrate-code-placeholders.mjs
git commit -m "feat(migration): add content/ CLI runner with --dry-run"
```

---

### Task 7: Verification harness (rendered-HTML parity)

**Files:**
- Create: `scripts/verify-placeholders-migration.mjs`

- [ ] **Step 1: Write the verifier**

Create `scripts/verify-placeholders-migration.mjs`:

```js
// THROWAWAY. Compares normalized rendered code-block output between
// two snapshot dirs of `public/`. Invariants checked per HTML page:
//   1. Text content of every <pre>...</pre> (tags stripped).
//   2. The ordered list of data-code-var="..." placeholder tokens.
// Cosmetic wrapper/class differences (e.g. color class) are ignored.
import { readFile } from 'node:fs/promises';
import { glob } from 'glob';
import path from 'node:path';

function extract(html) {
  const pres = [...html.matchAll(/<pre[\s\S]*?<\/pre>/g)].map((m) =>
    m[0]
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim()
  );
  const vars = [...html.matchAll(/data-code-var="([^"]*)"/g)].map((m) => m[1]);
  return { pres, vars };
}

async function snapshot(dir) {
  const files = await glob('**/index.html', { cwd: dir, nodir: true });
  const map = new Map();
  for (const rel of files) {
    const html = await readFile(path.join(dir, rel), 'utf8');
    if (!html.includes('code-placeholder')) continue;
    map.set(rel, extract(html));
  }
  return map;
}

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('usage: verify-placeholders-migration.mjs <before> <after>');
  process.exit(2);
}

const before = await snapshot(beforeDir);
const after = await snapshot(afterDir);
const pages = new Set([...before.keys(), ...after.keys()]);
let diffs = 0;

for (const p of [...pages].sort()) {
  const b = before.get(p);
  const a = after.get(p);
  if (!b || !a) {
    console.log(`PAGE-PRESENCE-CHANGED ${p} (before=${!!b} after=${!!a})`);
    diffs++;
    continue;
  }
  const preB = JSON.stringify(b.pres);
  const preA = JSON.stringify(a.pres);
  const varB = JSON.stringify(b.vars);
  const varA = JSON.stringify(a.vars);
  if (preB !== preA || varB !== varA) {
    diffs++;
    console.log(`DIFF ${p}`);
    if (preB !== preA) {
      console.log('  <pre> text differs');
      console.log(`   before: ${preB.slice(0, 400)}`);
      console.log(`   after : ${preA.slice(0, 400)}`);
    }
    if (varB !== varA) {
      console.log(`  placeholder tokens differ`);
      console.log(`   before: ${varB}`);
      console.log(`   after : ${varA}`);
    }
  }
}

console.log(
  `\npages=${pages.size} diffs=${diffs} ` +
    `(0 expected; investigate any DIFF that is not an intended list-nesting fix)`
);
process.exit(diffs === 0 ? 0 : 1);
```

- [ ] **Step 2: Lint the verifier loads**

Run: `node --check scripts/verify-placeholders-migration.mjs`
Expected: no output (syntax OK).

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-placeholders-migration.mjs
git commit -m "feat(migration): add rendered-HTML parity verifier"
```

---

### Task 8: Baseline build + dry-run review

**Files:** none modified (analysis only)

- [ ] **Step 1: Ensure clean working tree on content**

Run: `git status --porcelain content/`
Expected: empty.

- [ ] **Step 2: Build the site (baseline)**

Run: `npx hugo --quiet`
Expected: completes (~75s, do NOT cancel), exit 0.

- [ ] **Step 3: Snapshot baseline rendered HTML**

Run:
```bash
rm -rf /tmp/ph-before && mkdir -p /tmp/ph-before
rsync -a --include='*/' --include='index.html' --exclude='*' \
  public/ /tmp/ph-before/
```
Expected: copies the page tree (index.html only) into `/tmp/ph-before`.

- [ ] **Step 4: Dry-run the codemod and capture the report**

Run: `node scripts/migrate-code-placeholders.mjs --dry-run | tee /tmp/ph-dry.json`
Expected: a summary line; `git status --porcelain content/` still empty.

- [ ] **Step 5: Review the skipped list**

Read the `Skipped (manual handling required)` section of `/tmp/ph-dry.json`.
Record the file:line list for `code-tabs-wrapper`, `nested`, `unclosed`,
`no-fence` reasons — these are handled manually in Task 10.
Expected: a small finite list (the rare structural cases). No action yet.

- [ ] **Step 6: Commit the dry-run report into PLAN.md notes**

Append the dry-run summary + skipped list to `PLAN.md` under a new
`## Migration run log` heading (so reviewers see scope), then:
```bash
git add PLAN.md
git commit -m "docs(migration): record dry-run report"
```

---

### Task 9: Execute migration + verify parity

**Files:** `content/**/*.md` (generated changes)

- [ ] **Step 1: Run the codemod for real**

Run: `node scripts/migrate-code-placeholders.mjs | tee /tmp/ph-run.json`
Expected: `changed=` matches the dry-run; files written.

- [ ] **Step 2: Sanity-check no shortcode wrappers remain (except skipped)**

Run:
```bash
grep -rn '{{[%<] *code-placeholders "' content/ | wc -l
```
Expected: equals the count of `code-tabs-wrapper`/`nested`/`no-fence`/
`unclosed` skipped regions from Task 8 Step 5 (only intentionally-skipped
wrappers remain). If higher, investigate before continuing.

- [ ] **Step 3: Rebuild the site**

Run: `npx hugo --quiet`
Expected: completes (~75s, do NOT cancel), exit 0. A non-zero exit or
template error here is a regression — stop and debug with
superpowers:systematic-debugging.

- [ ] **Step 4: Snapshot post-migration HTML**

Run:
```bash
rm -rf /tmp/ph-after && mkdir -p /tmp/ph-after
rsync -a --include='*/' --include='index.html' --exclude='*' \
  public/ /tmp/ph-after/
```

- [ ] **Step 5: Run the parity verifier**

Run: `node scripts/verify-placeholders-migration.mjs /tmp/ph-before /tmp/ph-after | tee /tmp/ph-verify.txt`
Expected: `diffs=0`. Any `DIFF`/`PAGE-PRESENCE-CHANGED` line must be triaged
in Step 6.

- [ ] **Step 6: Triage diffs**

For each reported page:
- If `<pre>` text differs or placeholder tokens differ → **regression**.
  Open the file, fix the codemod or the specific file, re-run from Step 1.
- If it is purely a list-nesting/structure change with identical `<pre>`
  text and identical placeholder tokens, the verifier will NOT flag it
  (those invariants are wrapper-agnostic) — so any flagged page is a real
  problem to fix, not an accepted nesting change.
Expected end state: `diffs=0`.

- [ ] **Step 7: Commit the migrated content**

```bash
git add content/
git commit -m "refactor(content): migrate code-placeholders shortcode to fence attribute"
```

---

### Task 10: Manually convert skipped regions

**Files:** the specific `content/**/*.md` files listed as skipped in Task 8

- [ ] **Step 1: For each `code-tabs-wrapper` skip, convert by hand**

For each file:line from the skipped list, remove the
`{{% code-placeholders "RE" %}}` / `{{% /code-placeholders %}}` wrapper and
add `{ placeholders="RE" }` to every fenced code block inside each
`{{% code-tab-content %}}` (and any fence outside the tabs but inside the
old wrapper). Re-indent only if the wrapper was list-nested (match the
surrounding list-item column). Preserve the `code-tabs-wrapper`/`code-tabs`/
`code-tab-content` shortcodes unchanged.

- [ ] **Step 2: Handle `no-fence` / `unclosed` / `nested` skips**

Inspect each. `no-fence`: if the wrapper truly contains no code, remove the
wrapper (it was a no-op). `unclosed`/`nested`: fix the malformed markup so a
single wrapper cleanly surrounds its fences, then re-run the codemod on just
that file:
`node -e "import('./scripts/migrate-code-placeholders.mjs').then(async m=>{const fs=await import('node:fs/promises');const f='PATH';const s=await fs.readFile(f,'utf8');const r=m.migrate(s,{file:f});await fs.writeFile(f,r.content);console.log(r.report)})"`
(replace `PATH`).

- [ ] **Step 3: Confirm zero wrappers remain**

Run: `grep -rn '{{[%<] *code-placeholders "' content/ | wc -l`
Expected: `0`.

- [ ] **Step 4: Rebuild + re-verify the changed pages**

Run:
```bash
npx hugo --quiet
rm -rf /tmp/ph-after2 && mkdir -p /tmp/ph-after2
rsync -a --include='*/' --include='index.html' --exclude='*' public/ /tmp/ph-after2/
node scripts/verify-placeholders-migration.mjs /tmp/ph-before /tmp/ph-after2
```
Expected: `diffs=0`.

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "refactor(content): manually convert tabs-wrapped code-placeholders"
```

---

### Task 11: Lint, finalize, remove throwaway tooling

**Files:**
- Delete: `scripts/migrate-code-placeholders.mjs`,
  `scripts/migrate-code-placeholders.test.mjs`,
  `scripts/verify-placeholders-migration.mjs`
- `PLAN.md` (left in place — auto-removed on merge by
  `cleanup-ephemeral-docs.yml`)

- [ ] **Step 1: Run the code-block parse lint on changed files**

Run:
```bash
git diff --name-only origin/master...HEAD -- 'content/**/*.md' \
  | xargs yarn lint-codeblocks
```
Expected: exit 0 (no JSON/YAML/TOML parse regressions introduced by the
attribute edits). Investigate any `::error::`.

- [ ] **Step 2: Spot-check representative files visually**

Pick one simple, one list-nested, one multi-fence, and one
formerly-tabs-wrapped file from the diff. Confirm each fence carries
`{ placeholders="…" }`, no `code-placeholders` shortcode remains, and list
numbering/indentation looks correct in the rendered `public/...index.html`.

- [ ] **Step 3: Final full build**

Run: `npx hugo --quiet`
Expected: exit 0, no errors.

- [ ] **Step 4: Remove throwaway tooling**

```bash
git rm scripts/migrate-code-placeholders.mjs \
  scripts/migrate-code-placeholders.test.mjs \
  scripts/verify-placeholders-migration.mjs
git commit -m "chore(migration): remove throwaway codemod and verifier"
```

- [ ] **Step 5: Final status summary**

Run: `grep -rn '{{[%<] *code-placeholders "' content/ | wc -l`
Expected: `0`. Report final counts (transformed, manually handled) from
`/tmp/ph-run.json` and Task 10 into the `## Migration run log` section of
`PLAN.md`, then:
```bash
git add PLAN.md
git commit -m "docs(migration): final run log"
```

---

## Self-review (writing-plans)

**Spec coverage:**
- Convert `%` and `<` wrappers → Tasks 3, 5 (`parseOpenTag`/`isCloseTag`
  both delimiters), exercised in Task 5 tests.
- Per-fence attribute, multi-fence spans → Task 5 (`regionFenceOpenIndices`,
  multi-fence test).
- Merge into existing brace attrs / skip if `placeholders=` present →
  Tasks 1–2, 5 (`alreadyPresent`).
- Re-indent list-nested blocks; top-level untouched → Task 4
  (`reindentRegion`), Task 5 (`open.indent.length > 0`).
- Interleaved pytest comments preserved + re-indented → Task 5 test.
- `~~~` fences → Tasks 1, 5 (`regionFenceOpenIndices`).
- Skip + report `code-tabs-wrapper`, no-fence, nested, unclosed →
  Tasks 4, 5; manual handling Task 10.
- Out of scope: `code-placeholder-key` untouched — the codemod only matches
  `code-placeholders\s+"` (Task 3 test asserts `code-placeholder-key`
  returns null); color arg tolerated by `(?:\s+\S+)*` and unused.
- Rendered-HTML parity verification → Tasks 7, 9, 10.
- Throwaway script removed before merge → Task 11.
- Deliverables (migrated content, report, verification summary) → Tasks
  8–11 (`## Migration run log`).

**Placeholder scan:** No TBD/TODO/"handle edge cases" — every step has
concrete code or exact commands and expected output.

**Type consistency:** `migrate()` return shape
`{content, report:{transformed, alreadyPresent, skipped:[{file,line,reason}]}}`
is consistent across Tasks 5, 6, 9. `injectAttr` status enum
(`injected|merged|present|skip`) consistent Tasks 1, 2, 5. Helper names
(`parseOpenTag`, `isCloseTag`, `isOpenTagAny`, `regionContainsTabs`,
`reindentRegion`, `regionFenceOpenIndices`) match between definition and use.

---

## Migration run log

### Baseline build

- Hugo build: exit 0, ~15.8s
- Baseline snapshot: **5784** `index.html` files in `/tmp/ph-before`

### Dry-run summary

```
[DRY RUN] scanned=231 changed=220 transformed=729 alreadyPresent=0 skipped=64
```

### Skipped entries by reason

| Reason | Occurrences (file:line entries) | Distinct files |
| --- | --- | --- |
| `code-tabs-wrapper` | 62 | 26 |
| `unclosed` | 2 | 2 |
| `nested` | 0 | — |
| `no-fence` | 0 | — |

**Total skipped: 64** (62 tabs-wrapper, 2 unclosed)

### Unclosed entries (manual attention required in Task 10)

```
content/influxdb3/cloud-dedicated/reference/cli/influxctl/management/revoke.md:59  (unclosed)
content/influxdb3/clustered/reference/cli/influxctl/management/revoke.md:59  (unclosed)
```

Both are at the same line in parallel cloud-dedicated/clustered files.

### code-tabs-wrapper skips: distinct files (26 files, 62 occurrences)

```
content/influxdb3/cloud-dedicated/admin/query-system-data.md
content/influxdb3/cloud-dedicated/admin/tokens/database/create.md
content/influxdb3/cloud-dedicated/admin/tokens/database/update.md
content/influxdb3/cloud-dedicated/query-data/execute-queries/influxctl-cli.md
content/influxdb3/cloud-dedicated/reference/cli/influxctl/query.md
content/influxdb3/cloud-dedicated/reference/cli/influxctl/token/create.md
content/influxdb3/cloud-dedicated/reference/cli/influxctl/write.md
content/influxdb3/clustered/admin/query-system-data.md
content/influxdb3/clustered/admin/scale-cluster.md
content/influxdb3/clustered/admin/tokens/database/create.md
content/influxdb3/clustered/install/set-up-cluster/licensing.md
content/influxdb3/clustered/query-data/execute-queries/influxctl-cli.md
content/influxdb3/clustered/query-data/troubleshoot-and-optimize/report-query-performance-issues.md
content/influxdb3/clustered/reference/cli/influxctl/query.md
content/influxdb3/clustered/reference/cli/influxctl/token/create.md
content/influxdb3/clustered/reference/cli/influxctl/write.md
content/influxdb3/enterprise/admin/tokens/resource/create.md
content/influxdb3/enterprise/admin/tokens/resource/list.md
content/shared/influxdb-v2/api-guide/api_intro.md
content/shared/influxdb-v2/api-guide/influxdb-1x/_index.md
content/shared/influxdb-v2/query-data/execute-queries/influx-api.md
content/shared/influxdb3-admin/tokens/admin/list.md
content/shared/influxdb3-cli/query.md
content/shared/influxdb3-get-started/query.md
content/shared/influxdb3-query-guides/execute-queries/influxdb3-cli.md
content/telegraf/v1/install.md
```

### content/ unchanged after dry-run

Confirmed: `git status --porcelain content/` was empty both before and after
the dry-run.
