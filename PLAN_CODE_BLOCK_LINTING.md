# Plan: Parse/Compile-Only Code Block Linting (PR CI)

## Goal

Add a fast, low-noise PR check that fails only when documentation code blocks contain syntax or compile errors. This is a documentation quality guardrail, not an exhaustive test suite.

## Non-goals

1. Do not execute snippets.
2. Do not require network access, running services, or credentials.
3. Do not enforce style, formatting, or best practices.
4. Do not attempt full semantic correctness (for example, whether a CLI flag exists).
5. Do not report the same underlying source content more than once.

## Relationship to existing pytest testing

This check complements the existing `Test Code Blocks` workflow, which runs pytest against real servers on manual dispatch. Parse/compile linting provides a fast, deterministic syntax signal on every content PR; pytest execution remains valuable for the smaller allowlisted subset of runnable examples. The two checks stay separate so execution complexity and flakiness do not block the syntax smoke signal.

## Language scope

**v1 (this plan):** bash, python, javascript, json, yaml, toml.

**v2 follow-up (priority):** SQL and InfluxQL. These are the highest-volume languages in the repo (~3,600 fences) but require dialect-aware parsing that isn't straightforward for InfluxData docs (InfluxQL vs SQL-on-IOx vs DataFusion-SQL vs v1 SQL-over-HTTP). Blocked on a dialect-detection strategy; tracked as a follow-up issue after v1 proves stable.

**Out of scope:** go, java, powershell, http, text, csv, diff, xml. Under ~5% of fences combined, and no obvious low-noise parser path.

## Blocking policy

| Language | Policy on parse failure |
| --- | --- |
| JSON, YAML, TOML | `::error::` — fails the job |
| bash, python, javascript | `::warning::` — does not fail the job |

**Rationale:** JSON/YAML/TOML parsers rarely produce false positives on real-world snippets. If one fails to parse, the snippet is almost certainly broken — gating is defensible from day one. Bash and JavaScript are the ones most likely to trip on Hugo shortcodes or placeholder tokens. Starting them as warnings lets the normalization layer get tuned against real PRs without blocking people. Graduation path to blocking is covered in "Rollout" below.

## Architecture

### Job topology

New `lint-codeblocks` job in `.github/workflows/test.yml`:

```
detect-changes ──┬──► suggest-tests   (existing, informational)
                 ├──► lint-codeblocks (NEW — PR-always, fails on errors)
                 └──► test-codeblocks (existing, workflow_dispatch only)
```

`detect-changes` gains a new output `canonical-sources` — a JSON array of file paths with shared-source deduplication applied. `lint-codeblocks` consumes that output and runs the linter against those files.

### Files to create

| Path | Purpose |
| --- | --- |
| `scripts/ci/lint-codeblocks.mjs` | Orchestrator — reads the canonical file list, drives extraction and validation, emits GitHub workflow commands and step summary |
| `scripts/lib/codeblock-extractor.mjs` | Remark-based fence extraction, language alias normalization, fence attribute parsing, continuation joining |
| `scripts/lib/codeblock-normalizer.mjs` | Pure-function hybrid two-phase normalization |
| `scripts/lib/codeblock-validators/json.mjs` | `JSON.parse()` wrapper |
| `scripts/lib/codeblock-validators/yaml.mjs` | `js-yaml` wrapper with `CORE_SCHEMA` |
| `scripts/lib/codeblock-validators/toml.mjs` | `@iarna/toml` wrapper |
| `scripts/lib/codeblock-validators/bash.mjs` | Spawns `bash -n` |
| `scripts/lib/codeblock-validators/python.mjs` | Spawns `python3 -c 'import sys, ast; ast.parse(sys.stdin.read())'` |
| `scripts/lib/codeblock-validators/javascript.mjs` | Spawns `node --check` on a temp file |

### Files to modify

- `.github/workflows/test.yml` — add `canonical-sources` output to `detect-changes`, add `lint-codeblocks` job
- `scripts/ci/detect-test-products.js` — extend output to include canonical-source list (applies shared-source dedup)
- `scripts/lib/content-utils.js` — add `resolveCanonicalSource(filePath)` helper

### New dependency

`@iarna/toml` (~30 KB, zero transitive deps). Everything else is already in `package.json` (`js-yaml`, `remark`, `remark-parse`, `p-limit`) or the Node stdlib.

## Extraction and continuation joining

**Fence detection.** Use `remark` + `remark-parse` (already devDependencies). Walk the AST, collect `code` nodes with `lang`, `meta`, `value`, and `position.start.line`.

**Language alias normalization.** Fence tags map to canonical keys before dispatch:

```
bash | sh | shell | zsh    → bash
js   | javascript          → javascript
py   | python              → python
yml  | yaml                → yaml
json | jsonl               → json   (jsonl validated line-by-line)
toml                       → toml
```

Anything outside this list is ignored (not linted, no annotation).

**Fence attribute parsing.** The `meta` string is everything after the language tag. Parse `{ key="value" ... }` into an object. v1 uses only `placeholders="A|B|C"`. Unknown keys are retained but unused.

**HTML comment stripping.** Strip `<!-- ... -->` from the block body before continuation join and before validation. `<!--pytest.mark.skip-->`, `<!--pytest-codeblocks:cont-->`, and `<!--pytest-codeblocks:expected-output-->` are markers for pytest, not syntax.

**Continuation joining.** AST walk:

1. Walk `code` nodes in document order.
2. If the previous non-whitespace, non-paragraph sibling is an `html` node whose value matches `/^<!--\s*pytest-codeblocks:cont\s*-->$/`, join this fence to the preceding logical unit.
3. The joined unit inherits language from the first fence. If a later fence has a different language tag, emit a warning and continue (almost always a bug).
4. Join text is `"\n"`.
5. Position tracking: the joined unit has a `startLine` (first fence's line) and `blocks[]` array with per-fence line numbers. Errors anchor to `startLine`.

**Skip blocks.** Fences marked with `<!--pytest.mark.skip-->` are still validated (syntax is a concern independent of execution). The marker is for pytest; not the linter.

**Output assertion blocks.** Fences immediately following `<!--pytest-codeblocks:expected-output-->` are skipped by the linter — they're test assertions in `text` or no language.

**Canonical source resolution.** For each changed file:

1. Read frontmatter. If it has `source: /shared/...`, the canonical source is `content/shared/...`.
2. Otherwise the file is its own canonical.
3. Dedupe the final list.
4. If a changed file **is** a shared source, add its consumer pages via `findPagesReferencingSharedContent` to a "referenced by" list attached to the canonical entry (for error attribution only; consumers are not re-validated).

## Per-language validators

Each validator exports `validate(code) → { ok, errors }` where `errors` is an array of `{ line, column?, message }` relative to the start of the code block.

**JSON** (`json.mjs`). `JSON.parse(code)`. On `SyntaxError`, parse the message to extract `position N` and convert to line/column. `jsonl`: split on `\n`, parse each non-empty line, report per-line errors.

**YAML** (`yaml.mjs`). `yaml.load(code, { schema: yaml.CORE_SCHEMA })`. Catch `YAMLException` — already has `.mark.line` and `.mark.column`.

**TOML** (`toml.mjs`). `TOML.parse(code)` from `@iarna/toml`. Thrown errors include `.line` and `.col`.

**Bash** (`bash.mjs`). Spawn `bash -n` via `child_process.spawn`, pipe `code` to stdin. Parse stderr lines matching `bash: line N: ...` for position. Not `shellcheck` in v1; see "Rollout" for graduation path.

**Python** (`python.mjs`). Spawn `python3 -c 'import sys, ast; ast.parse(sys.stdin.read())'`, pipe `code` to stdin. Parse stderr for `File "<unknown>", line N` patterns. `ast.parse` avoids bytecode side effects that `py_compile` would produce.

**JavaScript** (`javascript.mjs`). Write `code` to a temp file via `fs.mkdtemp` (unique per invocation), spawn `node --check <tempfile>`. Parse stderr for `<path>:<line>\n  ^^^^\n\nSyntaxError: ...`. Node 22 handles ESM, top-level await, and private class fields out of the box.

**Subprocess concurrency.** Use `p-limit` (already a dep) with concurrency = `os.cpus().length` for bash/python/javascript. JSON/YAML/TOML are synchronous and unthrottled.

**Per-block timeout.** 5 seconds per subprocess. Timeout → error with a `<lang>: validator timeout` message.

## Normalization pipeline (hybrid)

The normalizer is a pure function per block. No I/O, no subprocesses.

**Phase 1 — try raw.** Strip HTML comments, hand the block to the validator. If it parses, emit `status: "passed"` and stop.

**Phase 2 — retry on failure.** Apply substitutions in the order below and re-run the validator. If any rule fires **and** the retry parses, emit `status: "passed"` with `notice: "normalized before parse: <rules applied>"`. If the retry still fails, emit `status: "failed"` with the **phase-1 error position** so line numbers remain honest to source.

**Substitution rules** (in order):

1. **Declared placeholders** from `{ placeholders="A|B|C" }`. For each token, replace word-bounded matches in the code:

   | Language | Substitution for token `X` |
   | --- | --- |
   | bash, python, javascript | `X` → `X_placeholder_ci` (valid identifier) |
   | json | `X` → `"X_placeholder_ci"` (only when appearing as bare key/value; untouched inside existing strings) |
   | yaml, toml | `X` → `"X_placeholder_ci"` |

2. **Hugo shortcodes inside the fence.** Regex: `{{[%<].*?[%>]}}` with dotall for multi-line. Replacement:

   | Language | Replacement |
   | --- | --- |
   | bash | `: SHORTCODE` (bash no-op) |
   | python, javascript | `__SHORTCODE__` (valid identifier) |
   | json, yaml, toml | `"__SHORTCODE__"` |

**Out of scope for v1:** guessing at undeclared ALL_CAPS placeholders, prompt stripping (`$ `, `>`), line-ending / trailing-whitespace / trailing-comma fixes, re-indentation. Any rule that could silently turn invalid code into valid code is excluded.

**Rule attribution.** The notice lists which rules fired, e.g. `normalized before parse: placeholder substitution; shortcode strip`. Over time this becomes the signal for whether a rule is earning its complexity — if the audit table in the step summary shows a rule rarely fires, remove it.

## Reporting

**Step log (grouped).** Every block's status is logged under `::group::<file>` / `::endgroup::` so readers can see the full picture without digging into annotations:

```
::group::content/influxdb3/core/admin/tokens/admin/preconfigured.md
  ✓ line 42  bash       passed
  ✓ line 58  json       passed (normalized: placeholder substitution)
  ✓ line 74  yaml       passed
  ✗ line 91  json       failed: Unexpected token } at position 45
::endgroup::
```

**GitHub annotations** (surface in PR UI):

- `::error file=<path>,line=<N>::<lang>: <message>` — JSON/YAML/TOML failures, fails job
- `::warning file=<path>,line=<N>::<lang>: <message>` — bash/python/javascript failures, does not fail job
- `::notice file=<path>,line=<N>::normalized before parse: <rules>` — informational audit trail

**Shared-source attribution.** For canonical sources under `content/shared/`, append a consumer list to the annotation message. Show up to 3 consumer paths; if there are more, append `and N more`:

```
::error file=content/shared/admin/tokens.md,line=91::json: ... (referenced by 5 pages: influxdb3/core/..., influxdb3/enterprise/..., influxdb3/cloud-dedicated/..., and 2 more)
```

**Step summary** (Markdown, renders on the job page):

- Totals: blocks checked, passed, passed-with-normalization, warnings, errors
- Errors table: file, line, language, message
- Warnings table: same columns
- Normalization audit table: file, line, language, rules applied (this is the signal for rule pruning)

**Exit code.** `exit 1` if `errors.length > 0`, else `exit 0`.

**Deliberately not in v1.** No PR comment, no artifact upload, no JUnit XML.

## Testing the linter itself

Unit tests in `scripts/ci/__tests__/`:

- `extractor.test.mjs` — fence detection, language aliasing, fence attribute parsing, continuation joining, HTML-comment stripping, cross-language continuation warning, `expected-output` marker skipping
- `normalizer.test.mjs` — phase-1 pass, phase-2 pass with notice, phase-2 fail with phase-1 position, per-language substitution rules, shortcode strip rules
- `validators/<lang>.test.mjs` — one test file per validator, covering "valid passes", "invalid fails with position", and any language-specific quirk (jsonl line-by-line, bash multi-line quoting, Python indentation errors, etc.)
- `lint-codeblocks.test.mjs` — end-to-end on a fixture directory, asserts exit code, step-summary content, annotation format, shared-source attribution

Fixtures live in `scripts/ci/__tests__/fixtures/lint/`.

## Rollout

1. **Ship v1** with the policy above: JSON/YAML/TOML block, bash/python/javascript warn.
2. **Watch two weeks of PRs**: collect normalization-notice counts per rule, false-positive reports on warnings.
3. **Prune or tune normalization** based on audit data. Rules that never fire get removed. Rules that fire on every other PR are a signal to fix the underlying content pattern rather than entrench the normalizer.
4. **Graduate bash to blocking** (`::error::`) once the warning-to-content-bug ratio stabilizes. Consider swapping `bash -n` for `shellcheck -S error` at this point.
5. **Graduate python and javascript to blocking** the same way.
6. **Land v2: SQL + InfluxQL** as a follow-up once dialect detection is designed.
7. **Optional**: nightly full-repo scan for long-tail breakage without adding PR latency.

## Success criteria

1. PR CI catches common snippet syntax/compile mistakes early — measurable via real PRs that would have merged broken examples under the pre-linter regime.
2. False-positive rate on blocking languages (JSON/YAML/TOML) stays near zero — no PR blocked by a false failure in the first month.
3. Errors reported once per canonical source file.
4. Runtime under 60 seconds for a typical PR touching 10–50 content files.

## Open questions (tracked, not blocking v1)

1. SQL and InfluxQL — dialect detection strategy. Likely per-product tagging: parse SQL fences under `content/influxdb/v1/` as InfluxQL, under `content/influxdb3/**/admin/` as SQL-on-IOx, etc. Needs its own spec.
2. "Referenced by" consumer lists on shared-source failures — is the 3-name truncation the right default, or should it show all consumers?
3. Nightly full-repo scan — useful, but adds maintenance. Defer until v1 has run long enough to show what it misses.
