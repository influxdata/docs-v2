# Design: Automated InfluxDB v3 client library release notes

**Date:** 2026-04-23
**Status:** Design approved, implementation plan pending
**Scope:** MVP for publishing v3 client library release notes in docs.influxdata.com

## Problem

The InfluxData v3 client libraries (Python, Go, JS, C#, Java) ship independent releases
from repos under `InfluxCommunity/`, but `docs.influxdata.com` has no published release
notes for any of them. Existing client library pages at
`/influxdb3/<product>/reference/client-libraries/v3/<lang>/` are stale because there is no
time to maintain them manually.

At minimum, users and the Kapa.ai knowledge base should have current release notes per
client. Ideally, upstream repos stay the source of truth and docs-v2 publishes
downstream automatically.

## Decisions

| Decision       | Choice                                                                                                 | Rationale                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MVP scope      | Changelog sync now, README sync later (phased)                                                         | Low coordination cost; proves the pipeline before asking for upstream template work. README sync is a clean follow-up once the client team opts in.                                          |
| URL structure  | Mirror existing per-product pattern; use `canonical` frontmatter                                       | Adding `/influxdb3/` general content breaks a pattern we do not otherwise have. Defer hub-style consolidation to a separate spec.                                                            |
| Trigger model  | Nightly cron + `workflow_dispatch` override                                                            | Zero-coordination routine path; manual escape hatch for post-release urgency. Avoids modifying the 5 upstream client repos.                                                                  |
| Transformation | Raw markdown body + light regex; top version/date to frontmatter; per-heading `{date="..."}` attribute | Matches existing release notes convention (`## vX.Y.Z {date="YYYY-MM-DD"}`). Extracts the minimum structured data needed for cross-page consumption without maintaining a per-client parser. |
| Client scope   | v3 only (5 InfluxCommunity repos)                                                                      | v2 Java client is a different org and cadence; defer to avoid widening MVP.                                                                                                                  |

## Architecture

### Source repos

Five repos on `main`, each with `CHANGELOG.md`:

- `InfluxCommunity/influxdb3-python`
- `InfluxCommunity/influxdb3-go`
- `InfluxCommunity/influxdb3-js`
- `InfluxCommunity/influxdb3-csharp`
- `InfluxCommunity/influxdb3-java`

### Sync workflow

`.github/workflows/sync-client-library-release-notes.yml`

- **Triggers:**
  - `schedule`: nightly cron (initial value `0 6 * * *` UTC, adjust as needed).
  - `workflow_dispatch`: input for client selection (`python`, `go`, `js`, `csharp`, `java`, `all`; default `all`).
- **Per client:**
  1. Fetch `CHANGELOG.md` from upstream (sparse checkout of `main`).
  2. Run transform script.
  3. Write to the shared source file.
  4. If content unchanged, skip this client.
- **Failure isolation:** one client's parse or fetch failure records a warning and does
  not block the other clients.
- **PR behavior:** if any client produced changes, open or update a single PR titled
  `sync(client-libs): update release notes` using `peter-evans/create-pull-request`'s
  default "update existing open PR on the same branch" behavior. Avoids PR churn on
  days with multiple releases (e.g., the 2026-04-22 announcement shipping 5 clients).

### Transform script

`helper-scripts/client-libraries/sync-release-notes.js`

- **Body transform:** line-by-line regex pass on the raw `CHANGELOG.md` body.
  - Match `## [X.Y.Z] - YYYY-MM-DD` (and common variants: unbracketed version, `(YYYY-MM-DD)` parens) and rewrite to `## vX.Y.Z {date="YYYY-MM-DD"}`.
  - Non-matching lines pass through unchanged.
  - Strip or preserve the upstream `# Changelog` H1 (TBD in implementation plan; likely strip since Hugo renders its own H1 from frontmatter `title`).
- **Frontmatter generation:** extract the first version heading and date, emit as
  `latest_version` and `latest_release_date` frontmatter fields. Include a `generated`
  marker and source URL so the file is self-identifying:
  ```yaml
  ---
  title: influxdb3-python release notes
  description: Release notes for the influxdb3-python client library.
  latest_version: 0.19.0
  latest_release_date: 2026-04-23
  source_repo: https://github.com/InfluxCommunity/influxdb3-python
  source_file: CHANGELOG.md
  generated: true
  ---
  <!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->
  ```

### File layout

**Shared source (one per client, written by the sync):**

```
content/shared/influxdb-client-libraries-reference/v3/release-notes/
  python.md
  go.md
  javascript.md
  csharp.md
  java.md
```

**Per-product stubs (5 products x 5 clients = 25 thin stubs, hand-written once):**

```
content/influxdb3/{core,enterprise,cloud-dedicated,cloud-serverless,clustered}/
  reference/client-libraries/v3/<lang>/release-notes.md
```

Each stub contains only frontmatter:

```yaml
---
title: influxdb3-python release notes
menu:
  influxdb3_<product>:
    name: Release notes
    parent: influxdb3-python
canonical: /influxdb3/core/reference/client-libraries/v3/python/release-notes/
source: /shared/influxdb-client-libraries-reference/v3/release-notes/python.md
---
```

Canonical URL points all five product variants at the Core copy so search engines and
Kapa.ai deduplicate near-identical pages.

### Downstream integration

- Existing landing pages at `.../client-libraries/v3/<lang>/` gain a "Latest version"
  callout that reads the child release-notes page's `latest_version` and
  `latest_release_date` via Hugo's `.Site.GetPage`. One template/partial change,
  applied via the shared source so it lives in one place.
- No other changes to existing landing pages in MVP. Phase 2 (README sync) is what
  updates body content.

## Non-goals

- README-as-source-of-truth sync for client library landing pages (phase 2).
- v2 Java client (`influxdata/influxdb-client-java`) release notes.
- `/influxdb3/` general content hub — a separate architectural decision with its own
  SEO and nav implications.
- Retrofitting `sync-plugins.yml` to the cron + dispatch trigger model — worth doing
  once the client-library sync is proven, tracked as a follow-up.

## Risks and mitigations

| Risk                                                                      | Mitigation                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Upstream CHANGELOG format drifts (e.g., someone adds a new heading style) | Regex transform is defensive — non-matching lines pass through. Worst case: a heading renders without its date badge. Alerting: transform script logs a warning when no version heading is parsed; the PR body surfaces these warnings. |
| Kapa retrieves all 5 product-variant pages for the same release note      | Canonical URL frontmatter. All 5 stubs canonicalize to Core.                                                                                                                                                                            |
| Nightly cron creates noisy PR activity                                    | Single rolling PR per sync branch; updated in place when the branch already exists. No PR opened when no content changed.                                                                                                               |
| A single client's fetch fails (e.g., repo briefly unavailable)            | Per-client isolation — the job records the failure and continues with the other clients. Next cron run retries.                                                                                                                         |

## Open items (for implementation plan)

- Cron time (current guess `0 6 * * *` UTC).
- Whether to strip the upstream `# Changelog` H1 or pass it through.
- Whether the transform needs to handle `[Unreleased]` sections (likely strip or convert
  to a normal heading without a date).
- Exact Hugo partial for the "Latest version" callout on existing landing pages.
- Whether to add a smoke test (e.g., a JSON snapshot test of the transform on a fixture
  CHANGELOG per client).

***

# Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish nightly-synced release notes for the five v3 client libraries under each v3 product, with a "Latest version" callout on the existing client library landing pages.

**Architecture:** Node.js transform script (pure function, TDD with `node:test`) that rewrites upstream `CHANGELOG.md` into Hugo-flavored markdown with frontmatter. GitHub Actions workflow runs the transform on a nightly cron, opens a rolling PR. Content lives as one shared source file per client, with 25 thin per-product stubs pointing at the shared file via `source:` frontmatter.

**Tech Stack:** Node.js 20 (already in repo), `node:test` (built-in, no new deps), `js-yaml` (already in repo deps), GitHub Actions, Hugo templates.

## Resolved from open items

- **Cron time:** `0 6 * * *` UTC (06:00 UTC = 23:00 PT previous day / 02:00 ET — quiet hours for US-based reviewers so PRs are waiting at start of day).
- **Upstream `# Changelog` H1:** strip it. Hugo renders the page H1 from frontmatter `title`; a second H1 in the body would produce duplicate top-level headings.
- **`[Unreleased]` sections:** strip them from published output. Unreleased content is upstream churn, not documentation. Regex match + drop the section (heading through to the next `## ` or EOF).
- **"Latest version" callout:** Hugo partial `layouts/partials/client-libraries/latest-version.html`, included from the shared landing-page source. Reads the child release-notes page via `.Page.GetPage "release-notes"`.
- **Smoke tests:** yes — fixture CHANGELOGs in `helper-scripts/client-libraries/test/fixtures/` (one per upstream client style), snapshot-compared via `node:test`.

## File structure

**New files:**

| File                                                                                                                                                               | Responsibility                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `helper-scripts/client-libraries/transform-changelog.js`                                                                                                           | Pure function: `(rawChangelog, opts) => {frontmatterPartial, body}`. No I/O, no network.                            |
| `helper-scripts/client-libraries/sync-release-notes.js`                                                                                                            | CLI entrypoint. Reads upstream CHANGELOG from disk, calls transform, writes output file. Handles per-client config. |
| `helper-scripts/client-libraries/clients.js`                                                                                                                       | Single source of truth for the 5 clients: display name, npm-style slug, upstream repo URL, output path.             |
| `helper-scripts/client-libraries/test/transform-changelog.test.js`                                                                                                 | Unit tests for the transform (using `node:test`).                                                                   |
| `helper-scripts/client-libraries/test/fixtures/*.md`                                                                                                               | Fixture CHANGELOGs (one per client, copied from real upstream) + expected outputs.                                  |
| `.github/workflows/sync-client-library-release-notes.yml`                                                                                                          | Nightly cron + manual dispatch, drives the sync.                                                                    |
| `content/shared/influxdb-client-libraries-reference/v3/release-notes/{python,go,javascript,csharp,java}.md`                                                        | Shared source files (written by the sync; committed once as empty scaffolds to prove the Hugo path resolves).       |
| `content/influxdb3/{core,enterprise,cloud-dedicated,cloud-serverless,clustered}/reference/client-libraries/v3/{python,go,javascript,csharp,java}/release-notes.md` | 25 per-product stubs.                                                                                               |
| `layouts/partials/client-libraries/latest-version.html`                                                                                                            | Hugo partial rendering the "Latest version" callout.                                                                |

**Modified files:**

- `content/shared/influxdb-client-libraries-reference/v3/{python,go,javascript,csharp,java}.md` — inject one-line include of the `latest-version.html` partial near the top.

**Note on per-product stubs:** existing client library landing pages use a flat `<lang>.md` per product (not a directory). To add a `release-notes.md` child, we either (a) convert each landing page into a directory with `_index.md` + `release-notes.md`, or (b) use a separate filename like `<lang>-release-notes.md` as a sibling. Tasks 7–8 use approach (a) because it's the standard Hugo section pattern and plays correctly with `.Page.GetPage "release-notes"`.

***

## Task 1: Scaffold helper-scripts directory and client config

**Files:**

- Create: `helper-scripts/client-libraries/README.md`

- Create: `helper-scripts/client-libraries/clients.js`

- [ ] **Step 1: Create `helper-scripts/client-libraries/clients.js`**

```javascript
// Single source of truth for the v3 client libraries synced by this tooling.
// Each entry describes one upstream client repo and the corresponding output
// path inside content/shared/.

export const CLIENTS = [
  {
    slug: 'python',
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md',
  },
  {
    slug: 'go',
    displayName: 'influxdb3-go',
    language: 'Go',
    repo: 'InfluxCommunity/influxdb3-go',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/go.md',
  },
  {
    slug: 'javascript',
    displayName: 'influxdb3-js',
    language: 'JavaScript',
    repo: 'InfluxCommunity/influxdb3-js',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/javascript.md',
  },
  {
    slug: 'csharp',
    displayName: 'influxdb3-csharp',
    language: 'C#',
    repo: 'InfluxCommunity/influxdb3-csharp',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/csharp.md',
  },
  {
    slug: 'java',
    displayName: 'influxdb3-java',
    language: 'Java',
    repo: 'InfluxCommunity/influxdb3-java',
    sourceFile: 'CHANGELOG.md',
    outputPath:
      'content/shared/influxdb-client-libraries-reference/v3/release-notes/java.md',
  },
];

export function getClient(slug) {
  const client = CLIENTS.find((c) => c.slug === slug);
  if (!client) {
    throw new Error(
      `Unknown client slug: ${slug}. Valid slugs: ${CLIENTS.map((c) => c.slug).join(', ')}`
    );
  }
  return client;
}
```

- [ ] **Step 2: Create `helper-scripts/client-libraries/README.md`**

````markdown
# Client library release notes sync

Syncs `CHANGELOG.md` from the five InfluxDB v3 client library repos
(`InfluxCommunity/influxdb3-{python,go,js,csharp,java}`) into Hugo-flavored
release notes pages under `content/shared/`.

Driven by `.github/workflows/sync-client-library-release-notes.yml`
(nightly cron + manual dispatch).

## Local usage

```sh
# Sync one client (reads from a local checkout you provide).
node helper-scripts/client-libraries/sync-release-notes.js \
  --client python \
  --source-path /path/to/influxdb3-python

# Sync all five (expects --source-root with each repo checked out as a subdir).
node helper-scripts/client-libraries/sync-release-notes.js \
  --all \
  --source-root /path/to/InfluxCommunity
````

## Tests

```sh
node --test helper-scripts/client-libraries/test/
```

See [PLAN.md](../../PLAN.md) at the repo root for design context.

````

- [ ] **Step 3: Verify files parse**

Run: `node -e "import('./helper-scripts/client-libraries/clients.js').then(m => console.log(m.CLIENTS.map(c => c.slug)))"`
Expected: `[ 'python', 'go', 'javascript', 'csharp', 'java' ]`

- [ ] **Step 4: Commit**

```sh
git add helper-scripts/client-libraries/
git commit -m "feat(client-libs): add client config for release notes sync"
````

***

## Task 2: TDD the transform — basic version-heading rewrite

**Files:**

- Create: `helper-scripts/client-libraries/transform-changelog.js`

- Create: `helper-scripts/client-libraries/test/transform-changelog.test.js`

- [ ] **Step 1: Write the failing test**

```javascript
// helper-scripts/client-libraries/test/transform-changelog.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformChangelog } from '../transform-changelog.js';

test('rewrites bracketed version heading to Hugo date-attribute form', () => {
  const input = `# Changelog\n\n## [0.19.0] - 2026-04-23\n### Added\n- New feature.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v0\.19\.0 \{date="2026-04-23"\}/);
});

test('rewrites unbracketed version heading', () => {
  const input = `## 2.14.0 - 2026-04-23\n### Fixed\n- Bug.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v2\.14\.0 \{date="2026-04-23"\}/);
});

test('rewrites version heading with parens around date', () => {
  const input = `## [1.8.0] (2026-04-23)\n### Added\n- Feature.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v1\.8\.0 \{date="2026-04-23"\}/);
});

test('passes through non-matching lines unchanged', () => {
  const input = `## Some other heading\n\nArbitrary text.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## Some other heading/);
  assert.match(result.body, /Arbitrary text\./);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: FAIL with `Cannot find module '../transform-changelog.js'`

- [ ] **Step 3: Write minimal implementation**

```javascript
// helper-scripts/client-libraries/transform-changelog.js

// Matches h2 version headings in any of these forms:
//   ## [0.19.0] - 2026-04-23
//   ## 0.19.0 - 2026-04-23
//   ## [0.19.0] (2026-04-23)
//   ## v0.19.0 - 2026-04-23
// Captures: 1 = version (no leading v), 2 = date (YYYY-MM-DD).
const VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*[-(\s]+\s*(\d{4}-\d{2}-\d{2})\)?\s*$/;

export function transformChangelog(rawChangelog) {
  const lines = rawChangelog.split('\n');
  const outLines = [];

  for (const line of lines) {
    const match = line.match(VERSION_HEADING_RE);
    if (match) {
      const [, version, date] = match;
      outLines.push(`## v${version} {date="${date}"}`);
    } else {
      outLines.push(line);
    }
  }

  return { body: outLines.join('\n') };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```sh
git add helper-scripts/client-libraries/transform-changelog.js \
        helper-scripts/client-libraries/test/transform-changelog.test.js
git commit -m "feat(client-libs): transform CHANGELOG version headings to Hugo form"
```

***

## Task 3: Extend transform — strip `# Changelog` H1 and `[Unreleased]` section

**Files:**

- Modify: `helper-scripts/client-libraries/transform-changelog.js`

- Modify: `helper-scripts/client-libraries/test/transform-changelog.test.js`

- [ ] **Step 1: Add failing tests**

Append to `test/transform-changelog.test.js`:

```javascript
test('strips leading `# Changelog` H1', () => {
  const input = `# Changelog\n\nSome preamble.\n\n## [0.19.0] - 2026-04-23\n`;
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /^# Changelog/m);
  assert.match(result.body, /Some preamble\./);
});

test('strips `## [Unreleased]` section through to next version heading', () => {
  const input = [
    '## [Unreleased]',
    '### Added',
    '- Speculative feature.',
    '',
    '## [0.19.0] - 2026-04-23',
    '### Added',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /Unreleased/);
  assert.doesNotMatch(result.body, /Speculative feature/);
  assert.match(result.body, /Real feature/);
});

test('strips `## [Unreleased]` section through EOF when no later version', () => {
  const input = `## [Unreleased]\n### Added\n- Only speculative content.\n`;
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /Unreleased/);
  assert.doesNotMatch(result.body, /Only speculative/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: 3 new failures.

- [ ] **Step 3: Extend transform**

Replace the body of `transformChangelog` in `transform-changelog.js`:

```javascript
const VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*[-(\s]+\s*(\d{4}-\d{2}-\d{2})\)?\s*$/;
const UNRELEASED_HEADING_RE = /^##\s+\[?Unreleased\]?\s*$/i;
const CHANGELOG_H1_RE = /^#\s+Changelog\s*$/i;
const ANY_H2_RE = /^##\s+/;

export function transformChangelog(rawChangelog) {
  const lines = rawChangelog.split('\n');
  const outLines = [];

  let skippingUnreleased = false;
  let seenFirstLine = false;

  for (const line of lines) {
    if (!seenFirstLine && CHANGELOG_H1_RE.test(line)) {
      seenFirstLine = true;
      continue;
    }
    seenFirstLine = true;

    if (skippingUnreleased) {
      if (ANY_H2_RE.test(line) && !UNRELEASED_HEADING_RE.test(line)) {
        skippingUnreleased = false;
        // fall through to process this heading below
      } else {
        continue;
      }
    }

    if (UNRELEASED_HEADING_RE.test(line)) {
      skippingUnreleased = true;
      continue;
    }

    const match = line.match(VERSION_HEADING_RE);
    if (match) {
      const [, version, date] = match;
      outLines.push(`## v${version} {date="${date}"}`);
    } else {
      outLines.push(line);
    }
  }

  return { body: outLines.join('\n') };
}
```

- [ ] **Step 4: Run tests to verify all pass**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```sh
git add helper-scripts/client-libraries/transform-changelog.js \
        helper-scripts/client-libraries/test/transform-changelog.test.js
git commit -m "feat(client-libs): strip Changelog H1 and Unreleased section"
```

***

## Task 4: Extend transform — extract latest version + emit frontmatter

**Files:**

- Modify: `helper-scripts/client-libraries/transform-changelog.js`

- Modify: `helper-scripts/client-libraries/test/transform-changelog.test.js`

- [ ] **Step 1: Add failing tests**

Append to `test/transform-changelog.test.js`:

```javascript
test('extracts latest version and date to return value', () => {
  const input = `## [0.19.0] - 2026-04-23\n\n## [0.18.0] - 2026-03-10\n`;
  const result = transformChangelog(input);
  assert.equal(result.latestVersion, '0.19.0');
  assert.equal(result.latestReleaseDate, '2026-04-23');
});

test('returns null latestVersion when no version heading present', () => {
  const input = `Some text with no versioned heading.\n`;
  const result = transformChangelog(input);
  assert.equal(result.latestVersion, null);
  assert.equal(result.latestReleaseDate, null);
});

test('renders full page with frontmatter when client metadata is provided', () => {
  const input = `## [0.19.0] - 2026-04-23\n### Added\n- Thing.\n`;
  const result = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.match(result.page, /^---\n/);
  assert.match(result.page, /title: influxdb3-python release notes/);
  assert.match(result.page, /latest_version: 0\.19\.0/);
  assert.match(result.page, /latest_release_date: 2026-04-23/);
  assert.match(result.page, /source_repo: https:\/\/github\.com\/InfluxCommunity\/influxdb3-python/);
  assert.match(result.page, /generated: true/);
  assert.match(
    result.page,
    /<!-- Generated from CHANGELOG\.md\. Edit upstream and re-sync; do not edit here\. -->/
  );
  assert.match(result.page, /## v0\.19\.0 \{date="2026-04-23"\}/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: 3 new failures.

- [ ] **Step 3: Extend transform**

Modify `transform-changelog.js` — update the return of `transformChangelog` to track latest version, and add a `renderPage` helper. Replace the file body with:

```javascript
const VERSION_HEADING_RE =
  /^##\s+v?\[?(\d+\.\d+\.\d+(?:[-+][\w.]+)?)\]?\s*[-(\s]+\s*(\d{4}-\d{2}-\d{2})\)?\s*$/;
const UNRELEASED_HEADING_RE = /^##\s+\[?Unreleased\]?\s*$/i;
const CHANGELOG_H1_RE = /^#\s+Changelog\s*$/i;
const ANY_H2_RE = /^##\s+/;

export function transformChangelog(rawChangelog, meta) {
  const lines = rawChangelog.split('\n');
  const outLines = [];

  let skippingUnreleased = false;
  let seenFirstLine = false;
  let latestVersion = null;
  let latestReleaseDate = null;

  for (const line of lines) {
    if (!seenFirstLine && CHANGELOG_H1_RE.test(line)) {
      seenFirstLine = true;
      continue;
    }
    seenFirstLine = true;

    if (skippingUnreleased) {
      if (ANY_H2_RE.test(line) && !UNRELEASED_HEADING_RE.test(line)) {
        skippingUnreleased = false;
      } else {
        continue;
      }
    }

    if (UNRELEASED_HEADING_RE.test(line)) {
      skippingUnreleased = true;
      continue;
    }

    const match = line.match(VERSION_HEADING_RE);
    if (match) {
      const [, version, date] = match;
      if (latestVersion === null) {
        latestVersion = version;
        latestReleaseDate = date;
      }
      outLines.push(`## v${version} {date="${date}"}`);
    } else {
      outLines.push(line);
    }
  }

  const body = outLines.join('\n');
  const result = { body, latestVersion, latestReleaseDate };

  if (meta) {
    result.page = renderPage(body, { ...meta, latestVersion, latestReleaseDate });
  }

  return result;
}

function renderPage(body, meta) {
  const frontmatter = [
    '---',
    `title: ${meta.displayName} release notes`,
    `description: Release notes for the ${meta.displayName} ${meta.language} client library for InfluxDB 3.`,
    meta.latestVersion !== null ? `latest_version: ${meta.latestVersion}` : null,
    meta.latestReleaseDate !== null ? `latest_release_date: ${meta.latestReleaseDate}` : null,
    `source_repo: https://github.com/${meta.repo}`,
    `source_file: CHANGELOG.md`,
    `generated: true`,
    '---',
  ]
    .filter((line) => line !== null)
    .join('\n');

  const comment =
    '<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->';

  return `${frontmatter}\n\n${comment}\n\n${body.trimStart()}`;
}
```

- [ ] **Step 4: Run tests to verify all pass**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: all 10 tests pass.

- [ ] **Step 5: Commit**

```sh
git add helper-scripts/client-libraries/transform-changelog.js \
        helper-scripts/client-libraries/test/transform-changelog.test.js
git commit -m "feat(client-libs): extract latest version and render full page"
```

***

## Task 5: Fixture-based end-to-end tests

**Files:**

- Create: `helper-scripts/client-libraries/test/fixtures/python-CHANGELOG.md`

- Create: `helper-scripts/client-libraries/test/fixtures/python-expected.md`

- Create: `helper-scripts/client-libraries/test/fixtures/go-CHANGELOG.md`

- Create: `helper-scripts/client-libraries/test/fixtures/go-expected.md`

- Modify: `helper-scripts/client-libraries/test/transform-changelog.test.js`

- [ ] **Step 1: Create Python fixture (representative sample of real format)**

Create `test/fixtures/python-CHANGELOG.md`:

```markdown
# Changelog

## [Unreleased]

### Added
- Nothing yet.

## [0.19.0] - 2026-04-23

### Added
- New `query_stream` method for large result sets.

### Fixed
- Connection pool leak on timeout.

## [0.18.0] - 2026-03-10

### Added
- Support for custom timeout per query.
```

- [ ] **Step 2: Create expected Python output**

Create `test/fixtures/python-expected.md`:

```markdown
---
title: influxdb3-python release notes
description: Release notes for the influxdb3-python Python client library for InfluxDB 3.
latest_version: 0.19.0
latest_release_date: 2026-04-23
source_repo: https://github.com/InfluxCommunity/influxdb3-python
source_file: CHANGELOG.md
generated: true
---

<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v0.19.0 {date="2026-04-23"}

### Added
- New `query_stream` method for large result sets.

### Fixed
- Connection pool leak on timeout.

## v0.18.0 {date="2026-03-10"}

### Added
- Support for custom timeout per query.
```

- [ ] **Step 3: Create Go fixture (different style — version prefix `v`)**

Create `test/fixtures/go-CHANGELOG.md`:

```markdown
# Changelog

## v2.14.0 - 2026-04-23

### Added
- Context-aware cancellation for long queries.

## v2.13.0 (2026-02-14)

### Fixed
- Retry backoff calculation.
```

- [ ] **Step 4: Create expected Go output**

Create `test/fixtures/go-expected.md`:

```markdown
---
title: influxdb3-go release notes
description: Release notes for the influxdb3-go Go client library for InfluxDB 3.
latest_version: 2.14.0
latest_release_date: 2026-04-23
source_repo: https://github.com/InfluxCommunity/influxdb3-go
source_file: CHANGELOG.md
generated: true
---

<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v2.14.0 {date="2026-04-23"}

### Added
- Context-aware cancellation for long queries.

## v2.13.0 {date="2026-02-14"}

### Fixed
- Retry backoff calculation.
```

- [ ] **Step 5: Add fixture-based tests**

Append to `test/transform-changelog.test.js`:

```javascript
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(__dirname, 'fixtures');

function readFixture(name) {
  return readFileSync(join(FIXTURES, name), 'utf8');
}

test('python fixture produces expected full-page output', () => {
  const input = readFixture('python-CHANGELOG.md');
  const expected = readFixture('python-expected.md');
  const { page } = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.equal(page.trim(), expected.trim());
});

test('go fixture produces expected full-page output', () => {
  const input = readFixture('go-CHANGELOG.md');
  const expected = readFixture('go-expected.md');
  const { page } = transformChangelog(input, {
    displayName: 'influxdb3-go',
    language: 'Go',
    repo: 'InfluxCommunity/influxdb3-go',
  });
  assert.equal(page.trim(), expected.trim());
});
```

- [ ] **Step 6: Run tests to verify all pass**

Run: `node --test helper-scripts/client-libraries/test/transform-changelog.test.js`
Expected: all 12 tests pass. If the expected fixtures don't match, update the fixtures (not the transform) — the transform is already specified by the earlier unit tests.

- [ ] **Step 7: Commit**

```sh
git add helper-scripts/client-libraries/test/fixtures/ \
        helper-scripts/client-libraries/test/transform-changelog.test.js
git commit -m "test(client-libs): fixture-based end-to-end transform tests"
```

***

## Task 6: CLI entrypoint `sync-release-notes.js`

**Files:**

- Create: `helper-scripts/client-libraries/sync-release-notes.js`

- [ ] **Step 1: Implement the CLI**

Create `sync-release-notes.js`:

```javascript
#!/usr/bin/env node
// Reads a client repo's CHANGELOG.md, runs the transform, and writes the
// shared source file. Designed to run from the docs-v2 repo root.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { CLIENTS, getClient } from './clients.js';
import { transformChangelog } from './transform-changelog.js';

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      client: { type: 'string' },
      all: { type: 'boolean', default: false },
      'source-path': { type: 'string' },
      'source-root': { type: 'string' },
      'docs-root': { type: 'string', default: process.cwd() },
    },
  });

  if (!values.all && !values.client) {
    throw new Error('Must provide --client <slug> or --all');
  }
  if (values.all && values.client) {
    throw new Error('Use --client or --all, not both');
  }
  if (values.client && !values['source-path']) {
    throw new Error('--client requires --source-path <dir>');
  }
  if (values.all && !values['source-root']) {
    throw new Error('--all requires --source-root <dir>');
  }

  return values;
}

function syncOne(client, sourcePath, docsRoot) {
  const changelogPath = join(sourcePath, client.sourceFile);
  if (!existsSync(changelogPath)) {
    return {
      client: client.slug,
      status: 'skipped',
      reason: `No ${client.sourceFile} at ${changelogPath}`,
    };
  }

  const raw = readFileSync(changelogPath, 'utf8');
  const { page, latestVersion } = transformChangelog(raw, {
    displayName: client.displayName,
    language: client.language,
    repo: client.repo,
  });

  if (latestVersion === null) {
    return {
      client: client.slug,
      status: 'warning',
      reason: `No version headings parsed in ${changelogPath}`,
    };
  }

  const outPath = resolve(docsRoot, client.outputPath);
  mkdirSync(dirname(outPath), { recursive: true });

  const previous = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
  if (previous === page) {
    return { client: client.slug, status: 'unchanged', latestVersion };
  }

  writeFileSync(outPath, page);
  return {
    client: client.slug,
    status: 'updated',
    latestVersion,
    outputPath: client.outputPath,
  };
}

function main() {
  const args = parseCliArgs();
  const results = [];

  const targets = args.all
    ? CLIENTS.map((c) => ({ client: c, sourcePath: join(args['source-root'], c.repo.split('/')[1]) }))
    : [{ client: getClient(args.client), sourcePath: args['source-path'] }];

  for (const { client, sourcePath } of targets) {
    try {
      results.push(syncOne(client, sourcePath, args['docs-root']));
    } catch (err) {
      results.push({ client: client.slug, status: 'error', reason: err.message });
    }
  }

  console.log(JSON.stringify(results, null, 2));

  const hadError = results.some((r) => r.status === 'error');
  process.exit(hadError ? 1 : 0);
}

main();
```

- [ ] **Step 2: Smoke test with a hand-crafted fixture**

Run:

```sh
mkdir -p /tmp/fake-python
cp helper-scripts/client-libraries/test/fixtures/python-CHANGELOG.md /tmp/fake-python/CHANGELOG.md
node helper-scripts/client-libraries/sync-release-notes.js \
  --client python \
  --source-path /tmp/fake-python
```

Expected: JSON output with `"status": "updated"` and `"latestVersion": "0.19.0"`. File exists at `content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md`.

- [ ] **Step 3: Verify idempotency**

Run the same command again.
Expected: `"status": "unchanged"`.

- [ ] **Step 4: Clean up smoke-test output (don't commit it yet — Task 7 commits scaffolds)**

Run: `rm -rf content/shared/influxdb-client-libraries-reference/v3/release-notes/`

- [ ] **Step 5: Commit**

```sh
git add helper-scripts/client-libraries/sync-release-notes.js
git commit -m "feat(client-libs): CLI to sync release notes from upstream CHANGELOGs"
```

***

## Task 7: Convert existing client library pages to section directories

**Files:**

- Rename: `content/influxdb3/{core,enterprise,cloud-dedicated,cloud-serverless,clustered}/reference/client-libraries/v3/{python,go,javascript,csharp,java}.md` → `.../<lang>/_index.md` (25 files)

Hugo treats a directory with `_index.md` as a section, which is required for child pages (release notes) to resolve via `.Page.GetPage`. Content of each page stays identical — only the path changes.

- [ ] **Step 1: Run the rename for all 25 files**

```sh
for product in core enterprise cloud-dedicated cloud-serverless clustered; do
  for lang in python go javascript csharp java; do
    src="content/influxdb3/$product/reference/client-libraries/v3/$lang.md"
    dst_dir="content/influxdb3/$product/reference/client-libraries/v3/$lang"
    if [ -f "$src" ]; then
      mkdir -p "$dst_dir"
      git mv "$src" "$dst_dir/_index.md"
    fi
  done
done
```

- [ ] **Step 2: Build Hugo to verify nothing broke**

Run: `npx hugo --quiet 2>&1 | tail -20`
Expected: build succeeds, no REF\_NOT\_FOUND errors. (Warnings unrelated to our changes are OK.)

- [ ] **Step 3: Verify one page renders**

Run:

```sh
npx hugo server --quiet &
HUGO_PID=$!
sleep 10
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/
kill $HUGO_PID
```

Expected: `200`. If `404`, inspect `hugo.yaml` / menu config for `identifier: influxdb3-python` references (menu `identifier` lookups are unaffected by file→dir rename, but confirm).

- [ ] **Step 4: Commit**

```sh
git add content/influxdb3/
git commit -m "refactor(client-libs): convert v3 client pages to section directories"
```

***

## Task 8: Scaffold shared release-notes source files

**Files:**

- Create: `content/shared/influxdb-client-libraries-reference/v3/release-notes/{python,go,javascript,csharp,java}.md` (5 files)

Write placeholder content so per-product stubs added in Task 9 have a valid `source:` target before the first sync runs. The nightly sync will overwrite these.

- [ ] **Step 1: Create all five scaffold files**

```sh
mkdir -p content/shared/influxdb-client-libraries-reference/v3/release-notes
for slug in python go javascript csharp java; do
  case "$slug" in
    python) name="influxdb3-python"; lang="Python" ;;
    go) name="influxdb3-go"; lang="Go" ;;
    javascript) name="influxdb3-js"; lang="JavaScript" ;;
    csharp) name="influxdb3-csharp"; lang="C#" ;;
    java) name="influxdb3-java"; lang="Java" ;;
  esac
  cat > "content/shared/influxdb-client-libraries-reference/v3/release-notes/$slug.md" <<EOF
---
title: $name release notes
description: Release notes for the $name $lang client library for InfluxDB 3.
source_repo: https://github.com/InfluxCommunity/$name
source_file: CHANGELOG.md
generated: true
---

<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

Release notes will appear here after the first sync.
EOF
done
```

- [ ] **Step 2: Verify files were created**

Run: `ls content/shared/influxdb-client-libraries-reference/v3/release-notes/`
Expected: `csharp.md  go.md  java.md  javascript.md  python.md`

- [ ] **Step 3: Commit**

```sh
git add content/shared/influxdb-client-libraries-reference/v3/release-notes/
git commit -m "feat(client-libs): scaffold shared release-notes source files"
```

***

## Task 9: Create 25 per-product release-notes stubs

**Files:**

- Create: `content/influxdb3/{core,enterprise,cloud-dedicated,cloud-serverless,clustered}/reference/client-libraries/v3/{python,go,javascript,csharp,java}/release-notes.md`

Each stub uses `source:` to point at the shared file and `canonical:` to point at the Core variant for search/Kapa deduplication.

- [ ] **Step 1: Generate all 25 stubs**

```sh
for product in core enterprise cloud-dedicated cloud-serverless clustered; do
  # Menu identifier uses underscores, not hyphens
  menu_id=$(echo "influxdb3_$product" | tr '-' '_')
  for slug in python go javascript csharp java; do
    case "$slug" in
      python) name="influxdb3-python"; identifier="influxdb3-python" ;;
      go) name="influxdb3-go"; identifier="influxdb3-go" ;;
      javascript) name="influxdb3-js"; identifier="influxdb3-js" ;;
      csharp) name="influxdb3-csharp"; identifier="influxdb3-csharp" ;;
      java) name="influxdb3-java"; identifier="influxdb3-java" ;;
    esac
    out="content/influxdb3/$product/reference/client-libraries/v3/$slug/release-notes.md"
    cat > "$out" <<EOF
---
title: $name release notes
list_title: Release notes
description: Release notes for the $name client library for InfluxDB 3.
menu:
  $menu_id:
    name: Release notes
    parent: $identifier
    identifier: $identifier-release-notes
weight: 301
canonical: /influxdb3/core/reference/client-libraries/v3/$slug/release-notes/
source: /shared/influxdb-client-libraries-reference/v3/release-notes/$slug.md
---

<!-- Content sourced from content/shared/influxdb-client-libraries-reference/v3/release-notes/$slug.md -->
EOF
  done
done
```

- [ ] **Step 2: Verify menu identifiers match the existing landing pages**

Run:

```sh
for p in core enterprise cloud-dedicated cloud-serverless clustered; do
  menu_id=$(echo "influxdb3_$p" | tr '-' '_')
  echo "--- $p (menu $menu_id) ---"
  grep "^  $menu_id:" -A3 "content/influxdb3/$p/reference/client-libraries/v3/python/_index.md" | head -6
done
```

Expected: each product's existing landing page uses the same menu ID the stub script generated. If any differ (e.g., `cloud-dedicated` using `influxdb3_cloud_dedicated` rather than `influxdb3_cloud-dedicated`), the stub script is already correct because `tr '-' '_'` produces `influxdb3_cloud_dedicated`.

- [ ] **Step 3: Build Hugo and check for errors**

Run: `npx hugo --quiet 2>&1 | grep -iE "error|warn" | head -20`
Expected: no new errors about the release-notes stubs. Pre-existing warnings are fine.

- [ ] **Step 4: Spot-check one rendered page**

Run:

```sh
npx hugo server --quiet &
HUGO_PID=$!
sleep 10
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/release-notes/
kill $HUGO_PID
```

Expected: `200`.

- [ ] **Step 5: Commit**

```sh
git add content/influxdb3/
git commit -m "feat(client-libs): add release-notes stubs for each v3 product"
```

***

## Task 10: "Latest version" partial and landing-page integration

**Files:**

- Create: `layouts/partials/client-libraries/latest-version.html`

- Modify: `content/shared/influxdb-client-libraries-reference/v3/{python,go,javascript,csharp,java}.md`

- [ ] **Step 1: Create the partial**

```html
{{/*
  Renders a "Latest version" callout for a v3 client library.
  Expects the current page to have a child "release-notes" with `latest_version`
  and `latest_release_date` in frontmatter. Silently renders nothing if the
  child page or the metadata is missing.
*/}}
{{ $rn := .GetPage "release-notes" }}
{{ if $rn }}
  {{ $v := $rn.Params.latest_version }}
  {{ $d := $rn.Params.latest_release_date }}
  {{ if and $v $d }}
    <div class="client-library-latest-version">
      <strong>Latest version:</strong>
      <a href="{{ $rn.RelPermalink }}">v{{ $v }}</a>
      <span class="latest-release-date"> ({{ $d }})</span>
    </div>
  {{ end }}
{{ end }}
```

- [ ] **Step 2: Inject the partial into each shared landing page**

For each of the five shared source files at
`content/shared/influxdb-client-libraries-reference/v3/{python,go,javascript,csharp,java}.md`,
insert this line immediately after the first paragraph of body content (after the
opening sentence introducing the client):

```
{{< partial "client-libraries/latest-version.html" >}}
```

Hugo's `partial` shortcode doesn't exist by default — use `{{ partial "..." . }}` inside a template or wrap in a custom shortcode. Since this repo uses Hugo's render pattern with partials-in-shortcodes, the correct pattern is to **add a shortcode that wraps the partial**.

Create the wrapper shortcode at `layouts/shortcodes/client-latest-version.html`:

```html
{{ partial "client-libraries/latest-version.html" .Page }}
```

Then in each of the five shared source files, add this line after the introductory paragraph:

```
{{< client-latest-version >}}
```

- [ ] **Step 3: Build Hugo and verify the callout renders**

Scaffolds from Task 8 contain no `latest_version`, so the partial should silently render nothing — **this is the expected behavior before the first sync**. After Task 11 runs the transform against a real fixture, the partial will surface the version.

Run:

```sh
npx hugo server --quiet &
HUGO_PID=$!
sleep 10
curl -sS http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/ | grep -c "client-library-latest-version" || echo 0
kill $HUGO_PID
```

Expected: `0` (scaffold has no version yet — silent render is correct).

- [ ] **Step 4: Manually seed one release-notes file and re-verify**

```sh
sed -i.bak 's/^source_file: CHANGELOG.md$/source_file: CHANGELOG.md\nlatest_version: 0.19.0\nlatest_release_date: 2026-04-23/' \
  content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md
npx hugo server --quiet &
HUGO_PID=$!
sleep 10
curl -sS http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/ | grep -o "Latest version:" | head -1
kill $HUGO_PID
```

Expected output: `Latest version:`

Restore: `mv content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md.bak content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md`

- [ ] **Step 5: Commit**

```sh
git add layouts/partials/client-libraries/ \
        layouts/shortcodes/client-latest-version.html \
        content/shared/influxdb-client-libraries-reference/v3/
git commit -m "feat(client-libs): add Latest version callout to landing pages"
```

***

## Task 11: GitHub Actions workflow

**Files:**

- Create: `.github/workflows/sync-client-library-release-notes.yml`

- [ ] **Step 1: Create the workflow**

````yaml
name: Sync client library release notes

on:
  schedule:
    # 06:00 UTC daily — quiet hours for US reviewers, PR ready by morning.
    - cron: '0 6 * * *'
  workflow_dispatch:
    inputs:
      client:
        description: 'Client to sync (python, go, javascript, csharp, java, or all)'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - python
          - go
          - javascript
          - csharp
          - java

permissions:
  contents: write
  pull-requests: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout docs-v2
        uses: actions/checkout@v4
        with:
          path: docs-v2

      - name: Checkout influxdb3-python
        uses: actions/checkout@v4
        with:
          repository: InfluxCommunity/influxdb3-python
          path: sources/influxdb3-python
          sparse-checkout: |
            CHANGELOG.md

      - name: Checkout influxdb3-go
        uses: actions/checkout@v4
        with:
          repository: InfluxCommunity/influxdb3-go
          path: sources/influxdb3-go
          sparse-checkout: |
            CHANGELOG.md

      - name: Checkout influxdb3-js
        uses: actions/checkout@v4
        with:
          repository: InfluxCommunity/influxdb3-js
          path: sources/influxdb3-js
          sparse-checkout: |
            CHANGELOG.md

      - name: Checkout influxdb3-csharp
        uses: actions/checkout@v4
        with:
          repository: InfluxCommunity/influxdb3-csharp
          path: sources/influxdb3-csharp
          sparse-checkout: |
            CHANGELOG.md

      - name: Checkout influxdb3-java
        uses: actions/checkout@v4
        with:
          repository: InfluxCommunity/influxdb3-java
          path: sources/influxdb3-java
          sparse-checkout: |
            CHANGELOG.md

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Run sync
        id: sync
        working-directory: docs-v2
        run: |
          CLIENT="${{ github.event.inputs.client || 'all' }}"
          if [ "$CLIENT" = "all" ]; then
            node helper-scripts/client-libraries/sync-release-notes.js \
              --all \
              --source-root "$GITHUB_WORKSPACE/sources" \
              --docs-root "$GITHUB_WORKSPACE/docs-v2" \
              | tee sync-results.json
          else
            node helper-scripts/client-libraries/sync-release-notes.js \
              --client "$CLIENT" \
              --source-path "$GITHUB_WORKSPACE/sources/influxdb3-$CLIENT" \
              --docs-root "$GITHUB_WORKSPACE/docs-v2" \
              | tee sync-results.json
          fi

      - name: Create or update pull request
        uses: peter-evans/create-pull-request@v6
        with:
          path: docs-v2
          branch: sync/client-library-release-notes
          commit-message: 'sync(client-libs): update release notes'
          title: 'sync(client-libs): update release notes'
          body: |
            Automated sync from the v3 client library CHANGELOGs.

            Results:
            ```json
            ${{ steps.sync.outputs.stdout }}
            ```

            Sources:
            - https://github.com/InfluxCommunity/influxdb3-python/blob/main/CHANGELOG.md
            - https://github.com/InfluxCommunity/influxdb3-go/blob/main/CHANGELOG.md
            - https://github.com/InfluxCommunity/influxdb3-js/blob/main/CHANGELOG.md
            - https://github.com/InfluxCommunity/influxdb3-csharp/blob/main/CHANGELOG.md
            - https://github.com/InfluxCommunity/influxdb3-java/blob/main/CHANGELOG.md
          labels: |
            sync
            client-libraries
````

- [ ] **Step 2: Lint the workflow**

Run: `npx actionlint .github/workflows/sync-client-library-release-notes.yml`
Expected: no errors. If `actionlint` isn't available, `npx prettier --check .github/workflows/sync-client-library-release-notes.yml` at minimum.

- [ ] **Step 3: Commit**

```sh
git add .github/workflows/sync-client-library-release-notes.yml
git commit -m "feat(ci): nightly sync workflow for v3 client library release notes"
```

***

## Task 12: Manual end-to-end dry-run

**Files:** (none created)

- [ ] **Step 1: Trigger the workflow manually in GitHub UI**

In the docs-v2 GitHub Actions UI, run the workflow with input `client: python`.

- [ ] **Step 2: Verify the PR**

Expected:

- A PR opens on branch `sync/client-library-release-notes`.

- Single changed file: `content/shared/influxdb-client-libraries-reference/v3/release-notes/python.md`.

- PR body contains the sync results JSON with `"status": "updated"` and a real `latestVersion`.

- [ ] **Step 3: Sanity-check the rendered output locally**

Check out the PR branch and run:

```sh
git checkout sync/client-library-release-notes
npx hugo server --quiet &
HUGO_PID=$!
sleep 10
curl -sS http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/release-notes/ | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' | head -3
curl -sS http://localhost:1313/influxdb3/core/reference/client-libraries/v3/python/ | grep -o "Latest version:" | head -1
kill $HUGO_PID
```

Expected: version strings from the CHANGELOG appear, and the landing page shows "Latest version:".

- [ ] **Step 4: Merge the PR**

Once content looks correct, merge. The next nightly cron will handle the remaining four clients (or trigger `client: all` manually for a bulk first sync).

***

## Spec coverage check

- **MVP scope (changelog sync now):** Tasks 1–6 (script) + Task 11 (workflow). ✅
- **URL structure (per-product pattern + canonical):** Task 9 generates 25 stubs with `canonical:` to Core. ✅
- **Trigger model (nightly cron + dispatch):** Task 11 workflow has both triggers. ✅
- **Transformation (raw body + regex + top-version frontmatter):** Tasks 2–5. ✅
- **v3 only scope:** `clients.js` defines exactly five v3 clients; v2 Java not listed. ✅
- **"Latest version" callout:** Task 10. ✅
- **Rolling PR on same branch:** Task 11 uses a fixed branch name (`sync/client-library-release-notes`), so `peter-evans/create-pull-request` updates it in place. ✅
- **Failure isolation:** `syncOne` returns `{status: 'error', reason}` per client; main loop continues. Task 6 Step 1. ✅
- **Open items resolved:** cron time, `# Changelog` H1, `[Unreleased]` handling, partial mechanism, smoke tests — all spelled out above. ✅
