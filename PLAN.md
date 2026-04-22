# Code-Block Lint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fast, always-on PR check that parses code blocks in changed docs and fails on syntax errors in safe languages (JSON/YAML/TOML), warns on risky ones (bash/python/javascript).

**Architecture:** New `lint-codeblocks` job in `.github/workflows/test.yml`, reusing the existing `detect-changes` job. Node-only linter under `scripts/ci/` and `scripts/lib/codeblock-*`. Pure-function normalizer + per-language validators. remark-based extraction. Node's built-in test runner (`node --test`) for unit coverage.

**Tech Stack:** Node 22+, remark/remark-parse (already a dep), js-yaml (already a dep), @iarna/toml (new dep), p-limit (already a dep), built-in `node:test`, child_process for bash/python/js subprocesses.

**Source of truth for behavior:** `PLAN_CODE_BLOCK_LINTING.md` at the repo root.

---

## Phase 0 — Setup

### Task 1: Add `@iarna/toml` dependency and test script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add `@iarna/toml` to dependencies**

Edit `package.json`, add to the `dependencies` object (alphabetical order):

```json
"@iarna/toml": "^2.2.5",
```

- [ ] **Step 2: Add lint test script**

Edit `package.json`, add to the `scripts` object:

```json
"test:lint-codeblocks": "node --test scripts/ci/__tests__/",
"lint-codeblocks": "node scripts/ci/lint-codeblocks.mjs"
```

- [ ] **Step 3: Install**

Run: `yarn install`
Expected: `@iarna/toml` resolves; no peer warnings.

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore(deps): add @iarna/toml for code-block lint"
```

---

## Phase 1 — Extractor

### Task 2: Extract fenced code blocks with remark

**Files:**
- Create: `scripts/lib/codeblock-extractor.mjs`
- Create: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/simple.md`

- [ ] **Step 1: Write fixture**

Create `scripts/ci/__tests__/fixtures/lint/simple.md`:

````markdown
# Title

Some prose.

```json
{"a": 1}
```

More prose.

```bash
echo hi
```
````

- [ ] **Step 2: Write the failing test**

Create `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { extractCodeBlocks } from '../../lib/codeblock-extractor.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name) => readFileSync(join(__dirname, 'fixtures/lint', name), 'utf8');

test('extracts fenced blocks with language and start line', () => {
  const blocks = extractCodeBlocks(fx('simple.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].lang, 'json');
  assert.equal(blocks[0].value, '{"a": 1}');
  assert.equal(blocks[0].startLine, 5);
  assert.equal(blocks[1].lang, 'bash');
  assert.equal(blocks[1].value, 'echo hi');
  assert.equal(blocks[1].startLine, 11);
});
```

- [ ] **Step 3: Run test — expect failure**

Run: `yarn test:lint-codeblocks`
Expected: FAIL, "Cannot find module 'codeblock-extractor.mjs'"

- [ ] **Step 4: Implement extractor**

Create `scripts/lib/codeblock-extractor.mjs`:

```javascript
import { unified } from 'unified';
import remarkParse from 'remark-parse';

const parser = unified().use(remarkParse);

/**
 * Extract fenced code blocks from a Markdown string.
 * @param {string} markdown
 * @returns {Array<{lang: string|null, meta: string|null, value: string, startLine: number}>}
 */
export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const blocks = [];
  for (const node of tree.children) {
    if (node.type === 'code') {
      blocks.push({
        lang: node.lang ?? null,
        meta: node.meta ?? null,
        value: node.value ?? '',
        startLine: node.position?.start?.line ?? 0,
      });
    }
  }
  return blocks;
}
```

- [ ] **Step 5: Run test — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: PASS (1/1).

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/simple.md
git commit -m "feat(lint): extract fenced code blocks with remark"
```

### Task 3: Normalize language aliases, filter to supported set

**Files:**
- Modify: `scripts/lib/codeblock-extractor.mjs`
- Modify: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/aliases.md`

- [ ] **Step 1: Write alias fixture**

Create `scripts/ci/__tests__/fixtures/lint/aliases.md`:

````markdown
```sh
echo hi
```

```py
print(1)
```

```yml
a: 1
```

```go
package main
```
````

- [ ] **Step 2: Write failing tests**

Append to `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
test('normalizes language aliases to canonical keys', () => {
  const blocks = extractCodeBlocks(fx('aliases.md'));
  const langs = blocks.map((b) => b.lang);
  assert.deepEqual(langs, ['bash', 'python', 'yaml', null]);
});

test('flags unsupported langs as null (out of scope)', () => {
  const blocks = extractCodeBlocks(fx('aliases.md'));
  assert.equal(blocks[3].lang, null);
  assert.equal(blocks[3].rawLang, 'go');
});
```

- [ ] **Step 3: Run tests — expect failures**

Run: `yarn test:lint-codeblocks`
Expected: both new tests fail.

- [ ] **Step 4: Implement alias map**

Modify `scripts/lib/codeblock-extractor.mjs` — replace existing `extractCodeBlocks` with:

```javascript
const LANG_ALIASES = {
  bash: 'bash', sh: 'bash', shell: 'bash', zsh: 'bash',
  js: 'javascript', javascript: 'javascript',
  py: 'python', python: 'python',
  yml: 'yaml', yaml: 'yaml',
  json: 'json', jsonl: 'jsonl',
  toml: 'toml',
};

function normalizeLang(raw) {
  if (!raw) return null;
  return LANG_ALIASES[raw.toLowerCase()] ?? null;
}

export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const blocks = [];
  for (const node of tree.children) {
    if (node.type === 'code') {
      blocks.push({
        rawLang: node.lang ?? null,
        lang: normalizeLang(node.lang),
        meta: node.meta ?? null,
        value: node.value ?? '',
        startLine: node.position?.start?.line ?? 0,
      });
    }
  }
  return blocks;
}
```

- [ ] **Step 5: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/aliases.md
git commit -m "feat(lint): normalize language aliases, mark out-of-scope langs"
```

### Task 4: Parse `{ placeholders="A|B|C" }` fence attribute

**Files:**
- Modify: `scripts/lib/codeblock-extractor.mjs`
- Modify: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/placeholders.md`

- [ ] **Step 1: Write fixture**

Create `scripts/ci/__tests__/fixtures/lint/placeholders.md`:

````markdown
```bash { placeholders="TOKEN_NAME|DURATION" }
influxdb3 create token --name TOKEN_NAME --expiry DURATION
```

```json
{"a": 1}
```
````

- [ ] **Step 2: Write failing test**

Append to `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
test('parses placeholders attribute into array', () => {
  const blocks = extractCodeBlocks(fx('placeholders.md'));
  assert.deepEqual(blocks[0].placeholders, ['TOKEN_NAME', 'DURATION']);
  assert.deepEqual(blocks[1].placeholders, []);
});
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL with undefined `placeholders`.

- [ ] **Step 4: Implement meta parsing**

Modify `scripts/lib/codeblock-extractor.mjs` — add the helper and populate:

```javascript
function parsePlaceholders(meta) {
  if (!meta) return [];
  const m = meta.match(/\bplaceholders="([^"]+)"/);
  if (!m) return [];
  return m[1].split('|').map((s) => s.trim()).filter(Boolean);
}
```

In the loop body, after `value`, add:

```javascript
placeholders: parsePlaceholders(node.meta),
```

- [ ] **Step 5: Run test — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/placeholders.md
git commit -m "feat(lint): parse placeholders fence attribute"
```

### Task 5: Strip HTML comments from block value

**Files:**
- Modify: `scripts/lib/codeblock-extractor.mjs`
- Modify: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/html-comments.md`

- [ ] **Step 1: Write fixture**

Create `scripts/ci/__tests__/fixtures/lint/html-comments.md`:

````markdown
```bash
<!--pytest.mark.skip-->
echo hi
```
````

- [ ] **Step 2: Write failing test**

Append to `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
test('strips HTML comments from block body', () => {
  const blocks = extractCodeBlocks(fx('html-comments.md'));
  assert.equal(blocks[0].value, 'echo hi');
});
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL (value contains the comment).

- [ ] **Step 4: Strip comments in extractor**

Modify `scripts/lib/codeblock-extractor.mjs` — add:

```javascript
function stripHtmlComments(s) {
  return s.replace(/<!--[\s\S]*?-->/g, '').replace(/^\n+/, '').replace(/\n+$/, '\n').trimEnd();
}
```

In the loop, change `value: node.value ?? ''` to:

```javascript
value: stripHtmlComments(node.value ?? ''),
```

- [ ] **Step 5: Run test — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/html-comments.md
git commit -m "feat(lint): strip HTML comments from block body"
```

### Task 6: Join `<!--pytest-codeblocks:cont-->` chains

**Files:**
- Modify: `scripts/lib/codeblock-extractor.mjs`
- Modify: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/continuation.md`

- [ ] **Step 1: Write fixture**

Create `scripts/ci/__tests__/fixtures/lint/continuation.md`:

````markdown
```python
x = 1
```

<!--pytest-codeblocks:cont-->

```python
y = x + 1
```

```python
z = 3
```
````

- [ ] **Step 2: Write failing tests**

Append to `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
test('joins continuation-marked fences into one logical unit', () => {
  const blocks = extractCodeBlocks(fx('continuation.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].value, 'x = 1\ny = x + 1');
  assert.equal(blocks[0].lang, 'python');
  assert.equal(blocks[0].startLine, 1);
  assert.deepEqual(blocks[0].partLines, [1, 5]);
  assert.equal(blocks[1].value, 'z = 3');
  assert.equal(blocks[1].startLine, 9);
});
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL (3 blocks returned, not 2).

- [ ] **Step 4: Implement join pass**

Modify `scripts/lib/codeblock-extractor.mjs` — rewrite the loop to do a two-pass:

```javascript
const CONT_RE = /^<!--\s*pytest-codeblocks:cont\s*-->$/;

export function extractCodeBlocks(markdown) {
  const tree = parser.parse(markdown);
  const raw = [];
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === 'code') {
      raw.push({
        kind: 'code',
        rawLang: node.lang ?? null,
        lang: normalizeLang(node.lang),
        meta: node.meta ?? null,
        value: stripHtmlComments(node.value ?? ''),
        placeholders: parsePlaceholders(node.meta),
        startLine: node.position?.start?.line ?? 0,
      });
    } else if (node.type === 'html' && CONT_RE.test((node.value ?? '').trim())) {
      raw.push({ kind: 'cont' });
    }
  }
  const out = [];
  for (const item of raw) {
    if (item.kind === 'cont') continue;
    const prev = out[out.length - 1];
    const prevRaw = raw[raw.indexOf(item) - 1];
    if (prev && prevRaw && prevRaw.kind === 'cont') {
      prev.value = prev.value + '\n' + item.value;
      prev.partLines = (prev.partLines ?? [prev.startLine]).concat(item.startLine);
    } else {
      out.push({ ...item, partLines: [item.startLine] });
    }
  }
  return out;
}
```

- [ ] **Step 5: Run test — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/continuation.md
git commit -m "feat(lint): join pytest-codeblocks:cont chains into one unit"
```

### Task 7: Skip fences that follow `expected-output` marker

**Files:**
- Modify: `scripts/lib/codeblock-extractor.mjs`
- Modify: `scripts/ci/__tests__/extractor.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/expected-output.md`

- [ ] **Step 1: Write fixture**

Create `scripts/ci/__tests__/fixtures/lint/expected-output.md`:

````markdown
```python
print("hi")
```

<!--pytest-codeblocks:expected-output-->

```
hi
```

```json
{"ok": true}
```
````

- [ ] **Step 2: Write failing test**

Append to `scripts/ci/__tests__/extractor.test.mjs`:

```javascript
test('skips fences that follow expected-output marker', () => {
  const blocks = extractCodeBlocks(fx('expected-output.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].value, 'print("hi")');
  assert.equal(blocks[1].value, '{"ok": true}');
});
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL (3 blocks, not 2).

- [ ] **Step 4: Add expected-output skip**

Modify `scripts/lib/codeblock-extractor.mjs` — add regex and a skip flag:

```javascript
const EXPECTED_RE = /^<!--\s*pytest-codeblocks:expected-output\s*-->$/;
```

In the first-pass loop, add:

```javascript
    } else if (node.type === 'html' && EXPECTED_RE.test((node.value ?? '').trim())) {
      raw.push({ kind: 'expected' });
```

In the second pass, track a `skipNext` flag:

```javascript
  const out = [];
  let skipNext = false;
  for (let idx = 0; idx < raw.length; idx++) {
    const item = raw[idx];
    if (item.kind === 'expected') { skipNext = true; continue; }
    if (item.kind === 'cont') continue;
    if (skipNext) { skipNext = false; continue; }
    const prevRawItem = raw[idx - 1];
    const prev = out[out.length - 1];
    if (prev && prevRawItem && prevRawItem.kind === 'cont') {
      prev.value = prev.value + '\n' + item.value;
      prev.partLines = (prev.partLines ?? [prev.startLine]).concat(item.startLine);
    } else {
      out.push({ ...item, partLines: [item.startLine] });
    }
  }
```

- [ ] **Step 5: Run all extractor tests**

Run: `yarn test:lint-codeblocks`
Expected: all tests pass (including the continuation test from Task 6).

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-extractor.mjs scripts/ci/__tests__/extractor.test.mjs scripts/ci/__tests__/fixtures/lint/expected-output.md
git commit -m "feat(lint): skip fences following expected-output marker"
```

---

## Phase 2 — First validator (JSON) + orchestrator skeleton

### Task 8: JSON validator

**Files:**
- Create: `scripts/lib/codeblock-validators/json.mjs`
- Create: `scripts/ci/__tests__/validators/json.test.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/json.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/json.mjs';

test('accepts valid JSON', () => {
  const { ok, errors } = validate('{"a": 1}');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects JSON with trailing comma, returns line', () => {
  const { ok, errors } = validate('{\n  "a": 1,\n}');
  assert.equal(ok, false);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].message.length > 0);
  assert.equal(errors[0].line, 3);
});

test('jsonl mode validates each line', () => {
  const { ok, errors } = validate('{"a":1}\n{"b": bad}\n{"c":3}', { jsonl: true });
  assert.equal(ok, false);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].line, 2);
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL, "Cannot find module 'json.mjs'".

- [ ] **Step 3: Implement JSON validator**

Create `scripts/lib/codeblock-validators/json.mjs`:

```javascript
function positionToLine(source, position) {
  if (typeof position !== 'number' || position < 0) return 1;
  let line = 1;
  for (let i = 0; i < position && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

function parseOne(code) {
  try {
    JSON.parse(code);
    return null;
  } catch (err) {
    const msg = err.message ?? String(err);
    const posMatch = msg.match(/position (\d+)/);
    const lineMatch = msg.match(/line (\d+)/);
    let line = 1;
    if (lineMatch) line = Number(lineMatch[1]);
    else if (posMatch) line = positionToLine(code, Number(posMatch[1]));
    return { line, message: msg };
  }
}

export function validate(code, { jsonl = false } = {}) {
  if (!jsonl) {
    const e = parseOne(code);
    return e ? { ok: false, errors: [e] } : { ok: true, errors: [] };
  }
  const errors = [];
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const e = parseOne(line);
    if (e) errors.push({ line: i + 1, message: e.message });
  }
  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: JSON validator tests pass. (Note: older Node prints `position N` on SyntaxError; `line N` format appeared in newer Node. The test asserts line 3 for a trailing-comma example and should work under Node 22+.)

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/codeblock-validators/json.mjs scripts/ci/__tests__/validators/json.test.mjs
git commit -m "feat(lint): add JSON/JSONL validator"
```

### Task 9: Orchestrator skeleton — read file list, extract, validate, exit code

**Files:**
- Create: `scripts/ci/lint-codeblocks.mjs`
- Create: `scripts/ci/__tests__/lint-codeblocks.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/bad-json.md`
- Create: `scripts/ci/__tests__/fixtures/lint/good-json.md`

- [ ] **Step 1: Write fixtures**

Create `scripts/ci/__tests__/fixtures/lint/good-json.md`:

````markdown
```json
{"a": 1}
```
````

Create `scripts/ci/__tests__/fixtures/lint/bad-json.md`:

````markdown
```json
{"a": 1,}
```
````

- [ ] **Step 2: Write failing test**

Create `scripts/ci/__tests__/lint-codeblocks.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = join(__dirname, '../lint-codeblocks.mjs');
const fx = (name) => join(__dirname, 'fixtures/lint', name);

function run(files) {
  return spawnSync('node', [cli, ...files], { encoding: 'utf8' });
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
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL, CLI script missing.

- [ ] **Step 4: Implement orchestrator skeleton**

Create `scripts/ci/lint-codeblocks.mjs`:

```javascript
#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { extractCodeBlocks } from '../lib/codeblock-extractor.mjs';
import * as jsonValidator from '../lib/codeblock-validators/json.mjs';

const BLOCKING_LANGS = new Set(['json', 'jsonl', 'yaml', 'toml']);
const VALIDATORS = {
  json: (b) => jsonValidator.validate(b.value),
  jsonl: (b) => jsonValidator.validate(b.value, { jsonl: true }),
};

function gh(severity, file, line, message) {
  process.stdout.write(`::${severity} file=${file},line=${line}::${message}\n`);
}

async function main(files) {
  let errorCount = 0;
  for (const file of files) {
    const md = readFileSync(file, 'utf8');
    const blocks = extractCodeBlocks(md);
    process.stdout.write(`::group::${file}\n`);
    for (const block of blocks) {
      const lang = block.lang;
      const validator = lang ? VALIDATORS[lang] : null;
      if (!validator) {
        process.stdout.write(`  - line ${block.startLine}  ${block.rawLang ?? '(no lang)'}  skipped (out of scope)\n`);
        continue;
      }
      const { ok, errors } = validator(block);
      if (ok) {
        process.stdout.write(`  ✓ line ${block.startLine}  ${lang}  passed\n`);
      } else {
        const severity = BLOCKING_LANGS.has(lang) ? 'error' : 'warning';
        for (const e of errors) {
          const absLine = block.startLine + (e.line ?? 1);
          process.stdout.write(`  ✗ line ${absLine}  ${lang}  failed: ${e.message}\n`);
          gh(severity, file, absLine, `${lang}: ${e.message}`);
          if (severity === 'error') errorCount++;
        }
      }
    }
    process.stdout.write(`::endgroup::\n`);
  }
  process.exit(errorCount > 0 ? 1 : 0);
}

main(process.argv.slice(2));
```

- [ ] **Step 5: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: both orchestrator tests pass.

- [ ] **Step 6: Commit**

```bash
git add scripts/ci/lint-codeblocks.mjs scripts/ci/__tests__/lint-codeblocks.test.mjs scripts/ci/__tests__/fixtures/lint/good-json.md scripts/ci/__tests__/fixtures/lint/bad-json.md
git commit -m "feat(lint): orchestrator skeleton with JSON validation and exit codes"
```

---

## Phase 3 — Synchronous validators (YAML, TOML)

### Task 10: YAML validator

**Files:**
- Create: `scripts/lib/codeblock-validators/yaml.mjs`
- Create: `scripts/ci/__tests__/validators/yaml.test.mjs`
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/yaml.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/yaml.mjs';

test('accepts valid YAML', () => {
  const { ok, errors } = validate('a: 1\nb: two\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects YAML with bad indentation, returns line', () => {
  const { ok, errors } = validate('a: 1\n  b: bad\nc: 3\n');
  assert.equal(ok, false);
  assert.ok(errors.length >= 1);
  assert.ok(typeof errors[0].line === 'number');
});

test('rejects duplicate keys (strict mode)', () => {
  const { ok, errors } = validate('a: 1\na: 2\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.includes('duplicate'));
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: module missing.

- [ ] **Step 3: Implement YAML validator**

Create `scripts/lib/codeblock-validators/yaml.mjs`:

```javascript
import yaml from 'js-yaml';

export function validate(code) {
  try {
    yaml.load(code, { schema: yaml.CORE_SCHEMA, json: false });
    return { ok: true, errors: [] };
  } catch (err) {
    const line = err?.mark?.line != null ? err.mark.line + 1 : 1;
    const column = err?.mark?.column != null ? err.mark.column + 1 : undefined;
    return { ok: false, errors: [{ line, column, message: err.message ?? String(err) }] };
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: all YAML tests pass.

- [ ] **Step 5: Wire into orchestrator**

Modify `scripts/ci/lint-codeblocks.mjs` — add at the top:

```javascript
import * as yamlValidator from '../lib/codeblock-validators/yaml.mjs';
```

Add to `VALIDATORS`:

```javascript
  yaml: (b) => yamlValidator.validate(b.value),
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-validators/yaml.mjs scripts/ci/__tests__/validators/yaml.test.mjs scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): add YAML validator with js-yaml CORE_SCHEMA"
```

### Task 11: TOML validator

**Files:**
- Create: `scripts/lib/codeblock-validators/toml.mjs`
- Create: `scripts/ci/__tests__/validators/toml.test.mjs`
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/toml.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/toml.mjs';

test('accepts valid TOML', () => {
  const { ok, errors } = validate('[section]\nkey = "value"\nnum = 42\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects TOML with missing quote, returns line', () => {
  const { ok, errors } = validate('key = "unterminated\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
  assert.equal(typeof errors[0].line, 'number');
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: FAIL, module missing.

- [ ] **Step 3: Implement TOML validator**

Create `scripts/lib/codeblock-validators/toml.mjs`:

```javascript
import TOML from '@iarna/toml';

export function validate(code) {
  try {
    TOML.parse(code);
    return { ok: true, errors: [] };
  } catch (err) {
    const line = typeof err?.line === 'number' ? err.line + 1 : 1;
    const column = typeof err?.col === 'number' ? err.col + 1 : undefined;
    return { ok: false, errors: [{ line, column, message: err.message ?? String(err) }] };
  }
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: TOML tests pass.

- [ ] **Step 5: Wire into orchestrator**

Modify `scripts/ci/lint-codeblocks.mjs` — add at the top:

```javascript
import * as tomlValidator from '../lib/codeblock-validators/toml.mjs';
```

Add to `VALIDATORS`:

```javascript
  toml: (b) => tomlValidator.validate(b.value),
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-validators/toml.mjs scripts/ci/__tests__/validators/toml.test.mjs scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): add TOML validator with @iarna/toml"
```

---

## Phase 4 — Subprocess validators (bash, python, javascript)

### Task 12: Bash validator via `bash -n`

**Files:**
- Create: `scripts/lib/codeblock-validators/bash.mjs`
- Create: `scripts/ci/__tests__/validators/bash.test.mjs`
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/bash.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/bash.mjs';

test('accepts valid bash', async () => {
  const { ok, errors } = await validate('echo hello\nfor i in 1 2 3; do echo $i; done\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects unterminated for loop', async () => {
  const { ok, errors } = await validate('for i in 1 2 3; do echo $i\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
});

test('reports a line number within the snippet', async () => {
  const code = 'echo ok\nif true; then\n  echo missing_fi\n';
  const { ok, errors } = await validate(code);
  assert.equal(ok, false);
  assert.equal(typeof errors[0].line, 'number');
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`
Expected: module missing.

- [ ] **Step 3: Implement bash validator**

Create `scripts/lib/codeblock-validators/bash.mjs`:

```javascript
import { spawn } from 'node:child_process';

const TIMEOUT_MS = 5000;

export function validate(code) {
  return new Promise((resolve) => {
    const proc = spawn('bash', ['-n', '/dev/stdin'], { stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGKILL');
    }, TIMEOUT_MS);

    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', () => {
      clearTimeout(timer);
      if (timedOut) {
        return resolve({ ok: false, errors: [{ line: 1, message: 'bash: validator timeout' }] });
      }
      if (!stderr.trim()) return resolve({ ok: true, errors: [] });
      const errors = [];
      for (const rawLine of stderr.split('\n')) {
        if (!rawLine.trim()) continue;
        const m = rawLine.match(/line (\d+):/);
        errors.push({ line: m ? Number(m[1]) : 1, message: rawLine.replace(/^[^:]*:\s*/, '').trim() });
      }
      resolve({ ok: false, errors: errors.length ? errors : [{ line: 1, message: stderr.trim() }] });
    });
    proc.stdin.end(code);
  });
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: bash tests pass.

- [ ] **Step 5: Wire into orchestrator (async-aware)**

Modify `scripts/ci/lint-codeblocks.mjs`:

- Add import at top: `import * as bashValidator from '../lib/codeblock-validators/bash.mjs';`
- Add to `VALIDATORS`: `bash: (b) => bashValidator.validate(b.value),`
- Change the inner loop to `await` validators (since bash is async):

Replace the `const { ok, errors } = validator(block);` line with:

```javascript
        const { ok, errors } = await validator(block);
```

(Main was already `async`; the `for` loop is already awaitable.)

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-validators/bash.mjs scripts/ci/__tests__/validators/bash.test.mjs scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): add bash validator via bash -n subprocess"
```

### Task 13: Python validator via `python3 -c 'ast.parse'`

**Files:**
- Create: `scripts/lib/codeblock-validators/python.mjs`
- Create: `scripts/ci/__tests__/validators/python.test.mjs`
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/python.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/python.mjs';

test('accepts valid python', async () => {
  const { ok, errors } = await validate('x = 1\ndef f(a, b):\n    return a + b\n');
  assert.equal(ok, true);
});

test('rejects python with indentation error', async () => {
  const { ok, errors } = await validate('def f():\nreturn 1\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
  assert.equal(typeof errors[0].line, 'number');
});

test('rejects python with unmatched paren', async () => {
  const { ok, errors } = await validate('print(1\n');
  assert.equal(ok, false);
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement python validator**

Create `scripts/lib/codeblock-validators/python.mjs`:

```javascript
import { spawn } from 'node:child_process';

const TIMEOUT_MS = 5000;
const PROGRAM = 'import sys, ast; ast.parse(sys.stdin.read())';

export function validate(code) {
  return new Promise((resolve) => {
    const proc = spawn('python3', ['-c', PROGRAM], { stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, TIMEOUT_MS);

    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (exitCode) => {
      clearTimeout(timer);
      if (timedOut) return resolve({ ok: false, errors: [{ line: 1, message: 'python: validator timeout' }] });
      if (exitCode === 0) return resolve({ ok: true, errors: [] });
      const lineMatch = stderr.match(/line (\d+)/);
      const msgMatch = stderr.match(/SyntaxError: ([^\n]+)/) || stderr.match(/IndentationError: ([^\n]+)/);
      resolve({
        ok: false,
        errors: [{
          line: lineMatch ? Number(lineMatch[1]) : 1,
          message: msgMatch ? msgMatch[1].trim() : stderr.trim().split('\n').pop() || 'python syntax error',
        }],
      });
    });
    proc.stdin.end(code);
  });
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`
Expected: python tests pass (requires `python3` on PATH; all CI runners and dev setups have it).

- [ ] **Step 5: Wire into orchestrator**

Modify `scripts/ci/lint-codeblocks.mjs`:

- Add import: `import * as pythonValidator from '../lib/codeblock-validators/python.mjs';`
- Add to `VALIDATORS`: `python: (b) => pythonValidator.validate(b.value),`

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-validators/python.mjs scripts/ci/__tests__/validators/python.test.mjs scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): add python validator via ast.parse subprocess"
```

### Task 14: JavaScript validator via `node --check`

**Files:**
- Create: `scripts/lib/codeblock-validators/javascript.mjs`
- Create: `scripts/ci/__tests__/validators/javascript.test.mjs`
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/validators/javascript.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/javascript.mjs';

test('accepts valid js', async () => {
  const { ok } = await validate('const x = 1;\nfunction f(a, b) { return a + b; }\n');
  assert.equal(ok, true);
});

test('rejects js with unterminated string', async () => {
  const { ok, errors } = await validate('const s = "oops\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
});

test('rejects js with invalid token', async () => {
  const { ok, errors } = await validate('const = 1;\n');
  assert.equal(ok, false);
  assert.equal(typeof errors[0].line, 'number');
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement JS validator**

Create `scripts/lib/codeblock-validators/javascript.mjs`:

```javascript
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const TIMEOUT_MS = 5000;

export function validate(code) {
  return new Promise((resolve) => {
    const dir = mkdtempSync(join(tmpdir(), 'lint-js-'));
    const file = join(dir, 'snippet.js');
    writeFileSync(file, code, 'utf8');
    const proc = spawn(process.execPath, ['--check', file], { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; proc.kill('SIGKILL'); }, TIMEOUT_MS);
    proc.stderr.on('data', (d) => { stderr += d; });
    proc.on('close', (exitCode) => {
      clearTimeout(timer);
      rmSync(dir, { recursive: true, force: true });
      if (timedOut) return resolve({ ok: false, errors: [{ line: 1, message: 'node --check: validator timeout' }] });
      if (exitCode === 0) return resolve({ ok: true, errors: [] });
      const lineMatch = stderr.match(/:(\d+)\s*$/m) || stderr.match(/:(\d+):\d+/);
      const msgMatch = stderr.match(/SyntaxError: ([^\n]+)/);
      resolve({
        ok: false,
        errors: [{
          line: lineMatch ? Number(lineMatch[1]) : 1,
          message: msgMatch ? msgMatch[1].trim() : stderr.trim().split('\n').pop() || 'javascript syntax error',
        }],
      });
    });
  });
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Wire into orchestrator**

Modify `scripts/ci/lint-codeblocks.mjs`:

- Add import: `import * as jsValidator from '../lib/codeblock-validators/javascript.mjs';`
- Add to `VALIDATORS`: `javascript: (b) => jsValidator.validate(b.value),`

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/codeblock-validators/javascript.mjs scripts/ci/__tests__/validators/javascript.test.mjs scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): add javascript validator via node --check"
```

### Task 15: Concurrency with `p-limit`

**Files:**
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Add concurrency wrapper**

In `scripts/ci/lint-codeblocks.mjs`:

- Add imports at top:

```javascript
import { cpus } from 'node:os';
import pLimit from 'p-limit';
```

- Before the file loop, create the limiter:

```javascript
const limit = pLimit(Math.max(1, cpus().length));
```

- Change the inner validator call from `await validator(block)` to:

```javascript
        const { ok, errors } = await limit(() => validator(block));
```

- [ ] **Step 2: Re-run full suite**

Run: `yarn test:lint-codeblocks`
Expected: all tests still pass (concurrency is transparent to tests).

- [ ] **Step 3: Commit**

```bash
git add scripts/ci/lint-codeblocks.mjs
git commit -m "feat(lint): limit subprocess validator concurrency to cpu count"
```

---

## Phase 5 — Normalizer (hybrid two-phase)

### Task 16: Normalizer — phase-1 pass-through

**Files:**
- Create: `scripts/lib/codeblock-normalizer.mjs`
- Create: `scripts/ci/__tests__/normalizer.test.mjs`

- [ ] **Step 1: Write failing tests**

Create `scripts/ci/__tests__/normalizer.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWithNormalization } from '../../lib/codeblock-normalizer.mjs';

test('phase 1 passes valid block without normalization notice', async () => {
  const block = { lang: 'json', value: '{"a": 1}', placeholders: [] };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.equal(res.notice, undefined);
});

test('phase 1 fails are returned unchanged when no normalization is applicable', async () => {
  const block = { lang: 'json', value: '{"a": bad}', placeholders: [] };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, false);
  assert.ok(res.errors[0].message.length > 0);
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement phase-1 skeleton**

Create `scripts/lib/codeblock-normalizer.mjs`:

```javascript
import * as json from './codeblock-validators/json.mjs';
import * as yaml from './codeblock-validators/yaml.mjs';
import * as toml from './codeblock-validators/toml.mjs';
import * as bash from './codeblock-validators/bash.mjs';
import * as python from './codeblock-validators/python.mjs';
import * as js from './codeblock-validators/javascript.mjs';

const VALIDATORS = {
  json: (c) => json.validate(c),
  jsonl: (c) => json.validate(c, { jsonl: true }),
  yaml: (c) => yaml.validate(c),
  toml: (c) => toml.validate(c),
  bash: (c) => bash.validate(c),
  python: (c) => python.validate(c),
  javascript: (c) => js.validate(c),
};

export async function validateWithNormalization(block) {
  const run = VALIDATORS[block.lang];
  if (!run) return { ok: true, errors: [], skipped: true };
  const phase1 = await run(block.value);
  if (phase1.ok) return { ok: true, errors: [] };
  // Phase 2 added in the next task.
  return { ok: false, errors: phase1.errors };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/codeblock-normalizer.mjs scripts/ci/__tests__/normalizer.test.mjs
git commit -m "feat(lint): normalizer skeleton with phase-1 pass-through"
```

### Task 17: Normalizer — phase-2 placeholder substitution

**Files:**
- Modify: `scripts/lib/codeblock-normalizer.mjs`
- Modify: `scripts/ci/__tests__/normalizer.test.mjs`

- [ ] **Step 1: Write failing tests**

Append to `scripts/ci/__tests__/normalizer.test.mjs`:

```javascript
test('phase 2 substitutes declared placeholders and emits notice', async () => {
  const block = {
    lang: 'json',
    value: '{"key": TOKEN_NAME}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /placeholder substitution/);
});

test('phase 2 retry failure reports phase-1 position', async () => {
  const block = {
    lang: 'json',
    value: '{"a": TOKEN_NAME, "b": ,}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, false);
  // The phase-1 error position is what we report (honest to source).
  assert.ok(res.errors[0].line >= 1);
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement phase-2 substitution**

Modify `scripts/lib/codeblock-normalizer.mjs`. Replace the body of `validateWithNormalization` with:

```javascript
function identifierSub(code, token) {
  return code.replace(new RegExp(`\\b${escapeRegex(token)}\\b`, 'g'), `${token}_placeholder_ci`);
}

function quotedSub(code, token) {
  return code.replace(new RegExp(`\\b${escapeRegex(token)}\\b`, 'g'), `"${token}_placeholder_ci"`);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PLACEHOLDER_SUB = {
  bash: identifierSub,
  python: identifierSub,
  javascript: identifierSub,
  json: quotedSub,
  yaml: quotedSub,
  toml: quotedSub,
};

function applyPlaceholders(code, lang, placeholders) {
  if (!placeholders?.length) return { code, applied: false };
  const fn = PLACEHOLDER_SUB[lang];
  if (!fn) return { code, applied: false };
  let out = code;
  for (const token of placeholders) out = fn(out, token);
  return { code: out, applied: out !== code };
}

export async function validateWithNormalization(block) {
  const run = VALIDATORS[block.lang];
  if (!run) return { ok: true, errors: [], skipped: true };
  const phase1 = await run(block.value);
  if (phase1.ok) return { ok: true, errors: [] };

  const rules = [];
  let candidate = block.value;
  const subbed = applyPlaceholders(candidate, block.lang, block.placeholders);
  if (subbed.applied) {
    candidate = subbed.code;
    rules.push('placeholder substitution');
  }

  if (rules.length === 0) return { ok: false, errors: phase1.errors };

  const phase2 = await run(candidate);
  if (phase2.ok) return { ok: true, errors: [], notice: `normalized before parse: ${rules.join('; ')}` };
  return { ok: false, errors: phase1.errors };
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/codeblock-normalizer.mjs scripts/ci/__tests__/normalizer.test.mjs
git commit -m "feat(lint): normalizer phase-2 placeholder substitution with notice"
```

### Task 18: Normalizer — Hugo shortcode strip

**Files:**
- Modify: `scripts/lib/codeblock-normalizer.mjs`
- Modify: `scripts/ci/__tests__/normalizer.test.mjs`

- [ ] **Step 1: Write failing tests**

Append to `scripts/ci/__tests__/normalizer.test.mjs`:

```javascript
test('phase 2 strips Hugo shortcodes and passes on retry', async () => {
  const block = {
    lang: 'bash',
    value: 'echo {{% product-name %}}',
    placeholders: [],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /shortcode strip/);
});

test('phase 2 notice lists multiple rules when both fire', async () => {
  const block = {
    lang: 'bash',
    value: 'echo TOKEN_NAME {{% product-name %}}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  // Both rules applied; notice lists both in order.
  assert.match(res.notice, /placeholder substitution/);
  assert.match(res.notice, /shortcode strip/);
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement shortcode strip**

Modify `scripts/lib/codeblock-normalizer.mjs`. Add after `PLACEHOLDER_SUB`:

```javascript
const SHORTCODE_RE = /\{\{[%<][\s\S]*?[%>]\}\}/g;
const SHORTCODE_REPLACEMENT = {
  bash: ': SHORTCODE',
  python: '__SHORTCODE__',
  javascript: '__SHORTCODE__',
  json: '"__SHORTCODE__"',
  yaml: '"__SHORTCODE__"',
  toml: '"__SHORTCODE__"',
};

function stripShortcodes(code, lang) {
  if (!SHORTCODE_RE.test(code)) return { code, applied: false };
  SHORTCODE_RE.lastIndex = 0;
  const replacement = SHORTCODE_REPLACEMENT[lang];
  if (replacement == null) return { code, applied: false };
  return { code: code.replace(SHORTCODE_RE, replacement), applied: true };
}
```

In `validateWithNormalization`, after the placeholder block, before the `phase2` call, add:

```javascript
  const stripped = stripShortcodes(candidate, block.lang);
  if (stripped.applied) {
    candidate = stripped.code;
    rules.push('shortcode strip');
  }
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/codeblock-normalizer.mjs scripts/ci/__tests__/normalizer.test.mjs
git commit -m "feat(lint): normalizer phase-2 Hugo shortcode strip"
```

### Task 19: Integrate normalizer into orchestrator

**Files:**
- Modify: `scripts/ci/lint-codeblocks.mjs`

- [ ] **Step 1: Replace direct-validator calls with normalizer**

In `scripts/ci/lint-codeblocks.mjs`:

- Remove the individual `import * as ... from '../lib/codeblock-validators/...'` lines.
- Remove the `VALIDATORS` object.
- Add: `import { validateWithNormalization } from '../lib/codeblock-normalizer.mjs';`

Replace the block-processing body with:

```javascript
      const res = await limit(() => validateWithNormalization(block));
      if (res.skipped) {
        process.stdout.write(`  - line ${block.startLine}  ${block.rawLang ?? '(no lang)'}  skipped (out of scope)\n`);
        continue;
      }
      if (res.ok) {
        const suffix = res.notice ? ` (${res.notice})` : '';
        process.stdout.write(`  ✓ line ${block.startLine}  ${block.lang}  passed${suffix}\n`);
        if (res.notice) gh('notice', file, block.startLine, res.notice);
      } else {
        const severity = BLOCKING_LANGS.has(block.lang) ? 'error' : 'warning';
        for (const e of res.errors) {
          const absLine = block.startLine + (e.line ?? 1) - 1;
          process.stdout.write(`  ✗ line ${absLine}  ${block.lang}  failed: ${e.message}\n`);
          gh(severity, file, absLine, `${block.lang}: ${e.message}`);
          if (severity === 'error') errorCount++;
        }
      }
```

(Also keep `BLOCKING_LANGS` set and the `gh()` helper.)

- [ ] **Step 2: Run all tests**

Run: `yarn test:lint-codeblocks`
Expected: all prior tests still pass; normalizer integration is transparent.

- [ ] **Step 3: Manual smoke test with a placeholder fixture**

Create a quick fixture at `scripts/ci/__tests__/fixtures/lint/placeholder-in-json.md`:

````markdown
```json { placeholders="TOKEN" }
{"key": TOKEN}
```
````

Run: `node scripts/ci/lint-codeblocks.mjs scripts/ci/__tests__/fixtures/lint/placeholder-in-json.md`
Expected: exits 0, output includes `passed (normalized before parse: placeholder substitution)` and a `::notice::` line.

- [ ] **Step 4: Commit**

```bash
git add scripts/ci/lint-codeblocks.mjs scripts/ci/__tests__/fixtures/lint/placeholder-in-json.md
git commit -m "feat(lint): orchestrator uses hybrid normalizer; emits notices"
```

---

## Phase 6 — Canonical source resolution

### Task 20: Add `resolveCanonicalSource` helper

**Files:**
- Modify: `scripts/lib/content-utils.js`
- Create: `scripts/ci/__tests__/canonical.test.mjs`
- Create: `scripts/ci/__tests__/fixtures/lint/consumer.md`
- Create: `scripts/ci/__tests__/fixtures/lint/_shared-example.md`

- [ ] **Step 1: Write fixtures**

Create `scripts/ci/__tests__/fixtures/lint/_shared-example.md`:

```markdown
# Shared

Some shared content.
```

Create `scripts/ci/__tests__/fixtures/lint/consumer.md`:

```markdown
---
title: Consumer
source: /shared/example.md
---

Placeholder body.
```

- [ ] **Step 2: Write failing tests**

Create `scripts/ci/__tests__/canonical.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCanonicalSource } from '../../lib/content-utils.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name) => join(__dirname, 'fixtures/lint', name);

test('returns self when no source frontmatter', () => {
  // Use an existing content file without `source:`
  const path = 'content/example.md';
  const r = resolveCanonicalSource(path);
  assert.equal(r, path);
});

test('resolves source: /shared/... to content/shared/... path', () => {
  // Given a file with `source: /shared/foo.md`, canonical is content/shared/foo.md
  const r = resolveCanonicalSource(fx('consumer.md'));
  assert.equal(r.endsWith('content/shared/example.md'), true);
});
```

- [ ] **Step 3: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 4: Implement helper**

At the end of `scripts/lib/content-utils.js`, add:

```javascript
/**
 * Given a content file path, return the canonical source file path.
 * - If the file has `source: /shared/...` frontmatter, canonical is `content/shared/...`.
 * - Otherwise, canonical is the file itself.
 * @param {string} filePath - Path to a content file
 * @returns {string} Canonical source path
 */
export function resolveCanonicalSource(filePath) {
  if (!existsSync(filePath)) return filePath;
  const body = readFileSync(filePath, 'utf8');
  // Match only frontmatter block at top: --- ... ---
  const fm = body.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return filePath;
  const sourceMatch = fm[1].match(/^source:\s*["']?(\S+?)["']?\s*$/m);
  if (!sourceMatch) return filePath;
  const sourcePath = sourceMatch[1];
  if (!sourcePath.startsWith('/shared/')) return filePath;
  return `content${sourcePath}`;
}
```

- [ ] **Step 5: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/content-utils.js scripts/ci/__tests__/canonical.test.mjs scripts/ci/__tests__/fixtures/lint/consumer.md scripts/ci/__tests__/fixtures/lint/_shared-example.md
git commit -m "feat(lint): add resolveCanonicalSource helper for shared-content dedup"
```

### Task 21: Dedupe inputs in orchestrator; add "referenced by" attribution

**Files:**
- Modify: `scripts/ci/lint-codeblocks.mjs`
- Modify: `scripts/ci/__tests__/lint-codeblocks.test.mjs`

- [ ] **Step 1: Write failing test**

Append to `scripts/ci/__tests__/lint-codeblocks.test.mjs`:

```javascript
test('dedupes inputs that resolve to the same canonical source', () => {
  // Pass the same consumer file twice — canonical should be checked once.
  const consumer = fx('consumer.md');
  const r = run([consumer, consumer]);
  // No errors in consumer fixtures; exit 0.
  assert.equal(r.status, 0, r.stderr);
  // The grouped log shows the canonical (shared) path, not the consumer.
  assert.match(r.stdout, /content\/shared\/example\.md/);
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Dedupe in orchestrator**

In `scripts/ci/lint-codeblocks.mjs`:

- Import the helper: `import { resolveCanonicalSource, findPagesReferencingSharedContent } from '../lib/content-utils.js';`
- Replace the `for (const file of files)` loop header with dedup logic:

```javascript
  const canonical = new Map(); // canonicalPath -> [consumer paths]
  for (const input of files) {
    const c = resolveCanonicalSource(input);
    if (!canonical.has(c)) canonical.set(c, []);
    if (c !== input) canonical.get(c).push(input);
  }
  for (const [file, consumers] of canonical) {
```

- When emitting annotations, include a "referenced by" suffix if the file is a shared source with consumers. Replace the `gh(severity, ...)` call in the error path with:

```javascript
          let msg = `${block.lang}: ${e.message}`;
          if (file.startsWith('content/shared/')) {
            const refs = consumers.length ? consumers : findPagesReferencingSharedContent(file);
            if (refs.length) {
              const shown = refs.slice(0, 3).map((p) => p.replace(/^content\//, ''));
              const suffix = refs.length > 3 ? `, and ${refs.length - 3} more` : '';
              msg += ` (referenced by ${refs.length} pages: ${shown.join(', ')}${suffix})`;
            }
          }
          gh(severity, file, absLine, msg);
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Commit**

```bash
git add scripts/ci/lint-codeblocks.mjs scripts/ci/__tests__/lint-codeblocks.test.mjs
git commit -m "feat(lint): dedupe canonical sources, add shared-source attribution"
```

---

## Phase 7 — Step summary

### Task 22: Emit step summary table

**Files:**
- Modify: `scripts/ci/lint-codeblocks.mjs`
- Modify: `scripts/ci/__tests__/lint-codeblocks.test.mjs`

- [ ] **Step 1: Write failing test**

Append to `scripts/ci/__tests__/lint-codeblocks.test.mjs`:

```javascript
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';

test('writes a step summary when GITHUB_STEP_SUMMARY is set', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lint-summary-'));
  const summaryPath = join(dir, 'summary.md');
  writeFileSync(summaryPath, '');
  const r = spawnSync('node', [cli, fx('bad-json.md')], {
    encoding: 'utf8',
    env: { ...process.env, GITHUB_STEP_SUMMARY: summaryPath },
  });
  assert.equal(r.status, 1);
  const summary = readFileSync(summaryPath, 'utf8');
  assert.match(summary, /## Code-block lint/);
  assert.match(summary, /\| File \| Line \| Language \| Message \|/);
  assert.match(summary, /bad-json\.md/);
});
```

- [ ] **Step 2: Run test — expect fail**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 3: Implement summary writer**

In `scripts/ci/lint-codeblocks.mjs`:

- At top of `main()`, collect results. Build four arrays: `errors`, `warnings`, `notices`, and a pass count.
- After the dedupe loop finishes, write the summary if `GITHUB_STEP_SUMMARY` is set.

Add at the top:

```javascript
import { appendFileSync } from 'node:fs';
```

Track during the loop (replace ad-hoc logging with buffered entries):

```javascript
  const errorRows = [];
  const warningRows = [];
  const noticeRows = [];
  let passed = 0;
  let passedWithNormalization = 0;
```

When a block passes with notice: `passedWithNormalization++; noticeRows.push({ file, line: block.startLine, lang: block.lang, rules: res.notice });`
When a block passes without notice: `passed++;`
When errors/warnings occur: push `{ file, line: absLine, lang: block.lang, message: e.message }` into the respective array.

After the loops:

```javascript
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    const lines = [];
    lines.push('## Code-block lint', '');
    const total = passed + passedWithNormalization + warningRows.length + errorRows.length;
    lines.push(`**Checked:** ${total} blocks across ${canonical.size} canonical sources`);
    lines.push(`**Passed:** ${passed + passedWithNormalization} (${passedWithNormalization} required normalization)`);
    lines.push(`**Warnings:** ${warningRows.length}`);
    lines.push(`**Errors:** ${errorRows.length}`);
    lines.push('');
    if (errorRows.length) {
      lines.push('### Errors', '', '| File | Line | Language | Message |', '| --- | --- | --- | --- |');
      for (const r of errorRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${r.message.replace(/\|/g, '\\|')} |`);
      lines.push('');
    }
    if (warningRows.length) {
      lines.push('### Warnings', '', '| File | Line | Language | Message |', '| --- | --- | --- | --- |');
      for (const r of warningRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${r.message.replace(/\|/g, '\\|')} |`);
      lines.push('');
    }
    if (noticeRows.length) {
      lines.push('### Normalization applied', '', '| File | Line | Language | Rules |', '| --- | --- | --- | --- |');
      for (const r of noticeRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${r.rules} |`);
      lines.push('');
    }
    appendFileSync(summaryPath, lines.join('\n') + '\n');
  }
```

- [ ] **Step 4: Run tests — expect pass**

Run: `yarn test:lint-codeblocks`

- [ ] **Step 5: Commit**

```bash
git add scripts/ci/lint-codeblocks.mjs scripts/ci/__tests__/lint-codeblocks.test.mjs
git commit -m "feat(lint): emit step summary with error/warning/normalization tables"
```

---

## Phase 8 — CI integration

### Task 23: Extend detection script with canonical-sources output

**Files:**
- Modify: `scripts/ci/detect-test-products.js`
- Create: `scripts/ci/__tests__/detect-products.test.mjs` (only if not already covered)

- [ ] **Step 1: Read existing script**

Verify that `scripts/ci/detect-test-products.js` currently outputs `{products, files}`. Confirm by running:

```bash
echo "content/influxdb3/core/page.md" | node scripts/ci/detect-test-products.js
```

Expected: JSON with `products` and `files` keys.

- [ ] **Step 2: Extend output with canonical sources**

At the end of the script's `main()`, import the new helper and emit:

```javascript
import { resolveCanonicalSource } from '../lib/content-utils.js';

// ... existing logic builds `files` ...

const canonical = Array.from(new Set(files.map((f) => resolveCanonicalSource(f))));
process.stdout.write(JSON.stringify({ products, files, canonical }) + '\n');
```

- [ ] **Step 3: Manual verification**

```bash
echo "content/influxdb3/core/admin/tokens/admin/preconfigured.md" | node scripts/ci/detect-test-products.js
```

Expected: output JSON now has a `canonical` array. If the file has `source: /shared/...`, canonical should include the shared file.

- [ ] **Step 4: Commit**

```bash
git add scripts/ci/detect-test-products.js
git commit -m "feat(ci): emit canonical-sources alongside products"
```

### Task 24: Wire `lint-codeblocks` job into `test.yml`

**Files:**
- Modify: `.github/workflows/test.yml`

- [ ] **Step 1: Expose `canonical-sources` output from `detect-changes`**

In `.github/workflows/test.yml`:

- Under `jobs.detect-changes.outputs`, add:

```yaml
      canonical-sources: ${{ steps.check.outputs.canonical-sources }}
```

- In the `Analyze changes and determine products` step, after the existing `PRODUCTS_JSON` handling, add:

```bash
          # Emit canonical sources for lint job.
          CANONICAL_JSON=$(echo "$RESULT" | jq -c '.canonical // []')
          echo "canonical-sources=$CANONICAL_JSON" >> $GITHUB_OUTPUT
```

(Note: the harness-only path has no `RESULT` from the Node script. For that branch, set `canonical-sources=[]`.)

- [ ] **Step 2: Add `lint-codeblocks` job**

After the `suggest-tests` job, before `test-codeblocks`, add:

```yaml
  lint-codeblocks:
    name: Lint code blocks
    needs: detect-changes
    if: github.event_name == 'pull_request' && needs.detect-changes.outputs.has-changes == 'true' && needs.detect-changes.outputs.canonical-sources != '' && needs.detect-changes.outputs.canonical-sources != '[]'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'yarn'
      - name: Install dependencies
        run: CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile
      - name: Run lint-codeblocks
        run: |
          FILES=$(echo '${{ needs.detect-changes.outputs.canonical-sources }}' | jq -r '.[]' | tr '\n' ' ')
          if [[ -z "$FILES" ]]; then
            echo "No canonical sources to lint."
            exit 0
          fi
          node scripts/ci/lint-codeblocks.mjs $FILES
```

- [ ] **Step 3: Validate workflow syntax**

Run: `actionlint .github/workflows/test.yml 2>&1 | grep -v shellcheck | head -5`
Expected: no non-shellcheck errors.

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/test.yml
git commit -m "feat(ci): add lint-codeblocks job to Test Code Blocks workflow"
git push origin HEAD
```

- [ ] **Step 5: Verify on a real PR**

Open a small test PR that changes one content file under `content/influxdb3/core/` (or pick an existing one). Wait for CI. Confirm:

- `lint-codeblocks` job runs
- Produces grouped log output
- Step summary has the expected tables
- Exit status green if no errors, red if errors

---

## Phase 9 — Close-out

### Task 25: Update `DOCS-TESTING.md` with lint-codeblocks section

**Files:**
- Modify: `DOCS-TESTING.md`

- [ ] **Step 1: Add a "Parse/compile lint" subsection under "Code block testing in CI"**

Describe:
- What the check does (parse-only, per-language, non-executing)
- Blocking policy (JSON/YAML/TOML error, bash/python/js warn)
- How to run locally: `yarn lint-codeblocks content/path/to/file.md`
- How to skip a block (don't — use `<!--pytest.mark.skip-->` for pytest, but blocks still syntax-check; if a block is unfixably problematic, fix it)
- Where the notices come from and what they mean

- [ ] **Step 2: Commit**

```bash
git add DOCS-TESTING.md
git commit -m "docs(testing): document parse/compile lint check"
```

### Task 26: Self-review and final verification

- [ ] **Step 1: Run the full test suite**

```bash
yarn test:lint-codeblocks
```

Expected: all tests pass.

- [ ] **Step 2: Lint against a representative corpus**

```bash
node scripts/ci/lint-codeblocks.mjs $(ls content/influxdb3/core/admin/tokens/admin/*.md)
```

Expected: the script runs under 10 seconds for ~5 files, emits grouped output, exits 0 or 1 based on actual content.

- [ ] **Step 3: Lint against a file with known-good placeholder blocks**

```bash
node scripts/ci/lint-codeblocks.mjs content/shared/influxdb3-admin/tokens/admin/preconfigured.md
```

Expected: blocks with placeholders either pass raw or pass with normalization notices; no spurious errors.

- [ ] **Step 4: Confirm the PR run in GitHub is green**

Visit the PR. Confirm `lint-codeblocks` appears as a job, is green, and produces readable output.

---

## Rollout follow-ups (tracked, not in this plan)

The items below are **not** part of this implementation. They're listed for awareness and should be separate PRs:

1. After 2 weeks of PR data, tune normalization rules based on audit notices.
2. Graduate bash from warning to blocking (consider shellcheck).
3. Graduate python and javascript from warning to blocking.
4. v2: SQL + InfluxQL linting (needs its own spec; blocked on dialect detection).
5. Optional nightly full-repo scan.

---

## Self-Review Notes

- Spec coverage check: every section of `PLAN_CODE_BLOCK_LINTING.md` maps to tasks above.
  - Language scope (bash/python/js/json/yaml/toml): Tasks 8, 10–14.
  - Blocking policy: Task 9 (BLOCKING_LANGS set), reinforced in Task 19.
  - Architecture / file layout: Tasks 2–14 create files; Task 24 modifies the workflow.
  - Extraction with alias normalization, attribute parsing, HTML-comment stripping, continuation joining, expected-output skipping: Tasks 2–7.
  - Hybrid normalization (phase 1 pass-through, phase-2 placeholder sub, shortcode strip, phase-1 error position): Tasks 16–19.
  - Validators including subprocess concurrency and per-block timeout: Tasks 8, 10–15.
  - Reporting (grouped log, annotations, step summary, shared-source attribution): Tasks 9, 19, 21, 22.
  - Canonical source resolution: Tasks 20–21.
  - CI integration: Tasks 23–24.
  - Testing layout: tests created alongside each component.
- Placeholder scan: none (no "TBD"/"TODO"; every step has concrete code or command).
- Type consistency: `validate` returns `{ok, errors}` consistently across all validators; `validateWithNormalization` returns `{ok, errors, notice?, skipped?}` consistently. Fence block shape — `{rawLang, lang, meta, value, placeholders, startLine, partLines}` — is consistent across extractor tasks.
