# Doc Review Pipeline — Implementation Plan

**Status:** In progress — label migration scripts remaining
**Repository:** influxdata/docs-v2
**Author:** Triage agent (Claude Code)
**Date:** 2026-02-28

---

## Table of Contents

1. [Goal](#goal)
2. [What Already Exists](#what-already-exists)
3. [Architecture Overview](#architecture-overview)
4. [Phase 1: Label System Overhaul](#phase-1-label-system-overhaul)
5. [Phase 2: Doc Review Workflow](#phase-2-doc-review-workflow)
6. [Phase 3: Documentation and Agent Instructions](#phase-3-documentation-and-agent-instructions)
7. [Future Phases (Not In Scope)](#future-phases-not-in-scope)
8. [Decisions (Resolved)](#decisions-resolved)
9. [Risk Assessment](#risk-assessment)

---

## Goal

Build two interconnected systems:

1. **Label system** — An automation-driven label taxonomy that supports
   cross-repo automation, agentic workflows, and human-in-the-loop review.
2. **Doc review pipeline** — A GitHub Actions workflow that automates
   documentation PR review using Copilot for both code review (diff-based,
   using auto-loaded instruction files) and visual review (rendered HTML
   at preview URLs), with rendered-page verification that catches issues
   invisible in the Markdown source.

The pipeline catches issues only visible in rendered output — expanded
shortcodes, broken layouts, incorrect product names — by having Copilot
analyze the rendered HTML of deployed preview pages.

---

## What Already Exists

### Infrastructure

| Component | Location | Notes |
|-----------|----------|-------|
| PR preview deployment | `.github/workflows/pr-preview.yml` | Builds Hugo site, deploys to `gh-pages` branch at `influxdata.github.io/docs-v2/pr-preview/pr-{N}/` |
| Changed file detection | `.github/scripts/detect-preview-pages.js` | Detects changed files, maps content to public URLs, handles shared content |
| Content-to-URL mapping | `scripts/lib/content-utils.js` | `getChangedContentFiles()`, `mapContentToPublic()`, `expandSharedContentChanges()` |
| Screenshot tooling | `scripts/puppeteer/screenshot.js` | Puppeteer-based screenshot utility (already a dependency) |
| Playwright | `package.json` | Already a dependency (`^1.58.1`) |
| Claude agent instructions | `CLAUDE.md`, `AGENTS.md`, `.claude/` | Review criteria, style guide, skills, commands |
| Copilot instructions | `.github/copilot-instructions.md` | Style guide, repo structure, patterns |
| Copilot pattern instructions | `.github/instructions/` | Auto-loaded by Copilot based on changed file patterns |
| Auto-labeling (path-based) | Not yet implemented | Needed for Phase 1 |
| Link checker workflow | `.github/workflows/pr-link-check.yml` | Validates links on PR changes |
| Sync plugins workflow | `.github/workflows/sync-plugins.yml` | Issue-triggered workflow pattern to follow |
| Audit documentation workflow | `.github/workflows/audit-documentation.yml` | Creates issues from audit results |

### Labels (Current State)

The repo has 30+ labels with inconsistent naming patterns and significant
overlap. Product labels use long names (`InfluxDB 3 Core and Enterprise`),
workflow states are minimal (`release:pending` is the only actively used one),
and there is no agent-readiness or blocking-state taxonomy.

---

## Architecture Overview

```
PR opened/updated (content paths)
        │
        ├──────────────────────────┐
        ▼                          ▼
┌─ Job 1: Resolve URLs ────┐  ┌─ Job 2: Copilot Code Review ───┐
│  resolve-review-urls.js   │  │  gh pr edit --add-reviewer      │
│  changed files → URLs     │  │  copilot-reviews                │
│  Output: url list         │  │  Uses .github/instructions/     │
└──────────┬───────────────┘  │  for auto-loaded review rules   │
           │                   └──────────────┬─────────────────┘
           ▼                                  │
┌─ Job 3: Copilot Visual Review ────────┐     │
│  Wait for preview deployment          │     │
│  Post preview URLs + review prompt    │     │
│  @copilot analyzes rendered HTML      │     │
│  Checks: layout, shortcodes, 404s    │     │
└──────────────┬───────────────────────┘     │
               │                              │
               ▼                              ▼
         Human reviews what remains
```

**Job 2 (Copilot code review) runs in parallel with Jobs 1→3** — it uses
GitHub's native Copilot reviewer, which analyzes the PR diff using
auto-loaded instruction files from `.github/instructions/`.

---

## Phase 1: Label System Overhaul

### Rationale

The label system is a prerequisite for agentic workflows. Agents need clear
signals about issue readiness (`agent-ready`), blocking states
(`waiting:engineering`, `waiting:product`), and product scope
(`product:v3-monolith`, `product:v3-distributed`).
Consistent label patterns also enable GitHub API queries for dashboards and
automation.

### 1.1 — Label taxonomy

> **Note:** The tables below are a planning snapshot. The authoritative
> definitions live in `data/labels.yml` (non-product labels) and
> `data/products.yml` (product labels). See `.github/LABEL_GUIDE.md` for
> the current index.

**24 labels organized into 6 categories:**

#### Product labels (11) — Color: `#FFA500` (yellow)

| Label | Description |
|-------|-------------|
| `product:v3-monolith` | InfluxDB 3 Core and Enterprise (single-node / clusterable) |
| `product:v3-distributed` | InfluxDB 3 Cloud Serverless, Cloud Dedicated, Clustered |
| `product:v2` | InfluxDB v2 (Cloud, OSS) |
| `product:v1` | InfluxDB v1 OSS |
| `product:v1-enterprise` | InfluxDB Enterprise v1 |
| `product:telegraf` | Telegraf documentation |
| `product:chronograf` | Chronograf documentation |
| `product:kapacitor` | Kapacitor documentation |
| `product:flux` | Flux language documentation |
| `product:explorer` | InfluxDB 3 Explorer |
| `product:shared` | Shared content across products |

#### Source tracking labels (4) — Color: `#9370DB` (purple)

| Label | Description |
|-------|-------------|
| `source:auto-detected` | Created by change detection within this repo |
| `source:dar` | Generated by DAR pipeline (issue analysis → draft) |
| `source:sync` | Synced from an external repository |
| `source:manual` | Human-created issue |

#### Waiting states (2) — Color: `#FF8C00` (orange)

| Label | Description |
|-------|-------------|
| `waiting:engineering` | Waiting for engineer confirmation |
| `waiting:product` | Waiting for product/PM decision |

#### Workflow states (2) — Color: `#00FF00` / `#1E90FF`

| Label | Description |
|-------|-------------|
| `agent-ready` | Agent can work on this autonomously |
| `skip-review` | Skip automated doc review pipeline |

> [!Note]
> Human codeowner approval uses GitHub's native PR review mechanism (CODEOWNERS file), not a label. The `review:*` labels below are applied **manually** after reviewing Copilot feedback.

#### Review outcome labels (3) — Color: `#28A745` / `#DC3545` / `#FFC107`

| Label | Description |
|-------|-------------|
| `review:approved` | Review passed — no blocking issues found |
| `review:changes-requested` | Review found blocking issues |
| `review:needs-human` | Review inconclusive, needs human |

> [!Note]
> All labels use colons (`:`) as separators for consistency. The `review:*` labels
> are mutually exclusive. They are applied manually after review — the CI workflow
> does not manage labels. Copilot code review uses GitHub's native "Comment"
> review type.

#### Existing labels to keep (renamed) (2)

| Old Name | New Name | Description |
|----------|----------|-------------|
| `AI assistant tooling` | `ai:tooling` | Related to AI assistant infrastructure |
| `ci:testing-and-validation` | `ci:testing` | CI/testing infrastructure |

### 1.2 — Migration scripts

Create migration scripts in `helper-scripts/label-migration/`:

- **`create-labels.sh`** — Creates all new labels using `gh label create --force` (idempotent)
- **`migrate-labels.sh`** — Migrates existing issues from old labels to new labels using `gh issue edit`
- **`delete-labels.sh`** — Deletes old labels (requires interactive confirmation)
- **`README.md`** — Execution order, prerequisites, rollback instructions

**Migration mapping:**

| Old Label | New Label |
|-----------|-----------|
| `InfluxDB 3 Core and Enterprise` | `product:v3-monolith` |
| `InfluxDB v3` | `product:v3-monolith` (review individually — some may be distributed) |
| `Processing engine` | `product:v3-monolith` |
| `InfluxDB v2` | `product:v2` |
| `InfluxDB v1` | `product:v1` |
| `Enterprise 1.x` | `product:v1-enterprise` |
| `Chronograf 1.x` | `product:chronograf` |
| `Kapacitor` | `product:kapacitor` |
| `Flux` | `product:flux` |
| `InfluxDB 3 Explorer` | `product:explorer` |
| `Pending Release` | `release:pending` |
| `release/influxdb3` | `release:pending` |
| `sync-plugin-docs` | `source:sync` |

> [!Important]
> **Workflow Updates Required:**
> The `sync-plugin-docs` label is used in GitHub Actions workflows. After migrating this label to `source:sync`, the following files must be updated:
> - `.github/workflows/sync-plugins.yml` (lines 28, 173, 421)
> - `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml` (line 4)
>
> Update all references from `sync-plugin-docs` to `source:sync` to ensure the plugin sync automation continues to work after the label migration.

> [!Note]
> `release:pending` is an existing workflow state label that we are keeping as-is.
> The migration scripts **must ensure** this label exists (create it if missing) and **must not** delete it in the cleanup step.
**Labels to delete after migration:**
`bug`, `priority`, `documentation`, `Proposal`, `Research Phase`,
`ready-for-collaboration`, `ui`, `javascript`, `dependencies`,
`integration-demo-blog`, `API`, `Docker`, `Grafana`, `Ask AI`,
plus all old product labels listed above.

**Execution:**
1. Run `create-labels.sh` (safe, idempotent)
2. Run `migrate-labels.sh`
3. Human verifies a sample of issues
4. Run `delete-labels.sh` (destructive, requires confirmation)

### 1.3 — Auto-labeling workflow

**File:** `.github/workflows/auto-label.yml`

**Trigger:** `pull_request: [opened, synchronize]`

**Logic:**
- List changed files via `github.rest.pulls.listFiles()`
- Read `data/products.yml` for path-to-label mappings (single source of truth):
  - Each product entry has `content_path` and `label_group` fields
  - Match file paths against `content/{content_path}/` → `product:{label_group}`
  - Example: `content/influxdb3/core/` matches `content_path: influxdb3/core`,
    `label_group: v3-monolith` → applies `product:v3-monolith`
- Shared content handling:
  - `content/shared/` changes apply `product:shared` label
  - Additionally expand shared content to affected products using
    `expandSharedContentChanges()` from `scripts/lib/content-utils.js`
  - Apply all affected product labels (additive)
- Multi-product PRs: apply all matching `product:*` labels (additive)
- Only add labels that are not already present (idempotent)
- Runs as `actions/github-script@v7`

---

## Phase 2: Doc Review Workflow

### 2.1 — Workflow file

**File:** `.github/workflows/doc-review.yml`

**Trigger:**

```yaml
on:
  pull_request:
    types: [opened, synchronize, ready_for_review]
    paths:
      - 'content/**'
      - 'layouts/**'
      - 'assets/**'
      - 'data/**'
```

**Permissions:** `contents: read`, `pull-requests: write`

**Concurrency:** `group: doc-review-${{ github.event.number }}`, `cancel-in-progress: true`

**Skip conditions:** Draft PRs, fork PRs, PRs with a `skip-review` label (new label to be added in Phase 1 via the label migration scripts).

### 2.2 — Job 1: Resolve URLs

**Purpose:** Map changed files to preview URLs.

**Implementation:**
- Reuse the existing `detect-preview-pages.js` script and `content-utils.js` library
- Same logic as `pr-preview.yml` Job 1, but output a JSON artifact instead of deploying
- Output format: `[{"file": "content/influxdb3/core/write-data/_index.md", "url": "/influxdb3/core/write-data/"}]`
- Upload as `urls.json` workflow artifact

**Key detail:** This job runs `getChangedContentFiles()` and `mapContentToPublic()`
from `scripts/lib/content-utils.js`, which already handles shared content
expansion (if `content/shared/foo.md` changes, all pages with
`source: /shared/foo.md` are included).

### 2.3 — Job 2: Copilot Code Review

**Purpose:** Review Markdown changes against the style guide and documentation
standards using GitHub's native Copilot code review. Visual review of rendered
pages is handled separately in Job 3.

**Dependencies:** None beyond the PR itself. This job runs in parallel with
Jobs 1→3.

**Implementation:**
- Adds `copilot-reviews` as a PR reviewer via `gh pr edit --add-reviewer`
- Copilot automatically reviews the PR diff using instruction files from
  `.github/instructions/` that are auto-loaded based on changed file patterns
- No custom prompt or API key required

**Review criteria file:** `.github/instructions/content-review.instructions.md`

This file is auto-loaded by Copilot for PRs that change `content/**/*.md`
files. It checks for:

1. **Frontmatter correctness** — Required fields, menu structure, weights
2. **Shortcode syntax** — Correct usage, closing tags, parameters
3. **Semantic line feeds** — One sentence per line
4. **Heading hierarchy** — No h1 in content (title comes from frontmatter)
5. **Product-specific terminology** — Correct product names, versions
6. **Link format** — Relative links, proper shortcode links
7. **Shared content** — `source:` frontmatter correctness
8. **Code blocks** — Language identifiers, line length, long CLI options

**Severity classification:**
- `BLOCKING` — Wrong product names, invalid frontmatter, broken shortcode syntax
- `WARNING` — Style inconsistencies, missing semantic line feeds
- `INFO` — Suggestions, not problems

**Output:**
- Copilot posts inline review comments using GitHub's native "Comment"
  review type
- `review:*` labels are applied manually by humans after reviewing the
  Copilot feedback — the workflow does not manage labels

### 2.4 — Job 3: Copilot Visual Review (rendered HTML)

**Purpose:** Have Copilot analyze the rendered preview pages to catch visual
and structural issues invisible in the Markdown source.

**Dependencies:** Depends on Job 1 (needs URL list). Must wait for the
`pr-preview.yml` deployment to be live.

**Why Copilot for visual review:**
- Copilot can analyze rendered HTML content at public preview URLs — no
  screenshot capture or image upload required.
- Visual review is a good fit for Copilot because the rendered pages are
  self-contained artifacts (no need to cross-reference repo files).
- Copilot code review (Job 2) handles the diff; visual review catches what
  the diff review cannot.

**Implementation:**

1. **Wait for preview deployment:**
   - Poll `https://influxdata.github.io/docs-v2/pr-preview/pr-{N}/` with
     `curl --head` until it returns 200
   - Timeout: 10 minutes (preview build takes ~75s + deploy time)
   - Poll interval: 15 seconds
   - If timeout, skip visual review; Copilot code review (Job 2) still runs

2. **Post preview URLs and trigger Copilot review:**
   - Use `actions/github-script@v7` to post a PR comment listing the preview
     URLs from Job 1, formatted as clickable links
   - Post a follow-up comment tagging `@copilot` with instructions to review
     the rendered pages at the preview URLs. The comment should instruct
     Copilot to check each page for:
     - Raw shortcode syntax visible on the page (`{{<` or `{{%`)
     - Placeholder text that should have been replaced
     - Broken layouts: overlapping text, missing images, collapsed sections
     - Code blocks rendered incorrectly (raw HTML/Markdown fences visible)
     - Navigation/sidebar entries correct
     - Visible 404 or error state
     - Product name inconsistencies in the rendered page header/breadcrumbs
   - The review instruction template is stored in
     `.github/prompts/copilot-visual-review.md` for maintainability
   - Preview URL count capped at 50 pages (matching `MAX_PAGES` in
     `detect-preview-pages.js`)

3. **Comment upsert pattern:**
   - Visual review comments use a marker-based upsert pattern — the workflow
     updates an existing comment if one with the marker exists, otherwise
     creates a new one. This prevents duplicate comments on `synchronize`
     events.

### 2.6 — Workflow failure handling

- If preview deployment times out: skip Copilot visual review (Job 3),
  Copilot code review (Job 2) still runs independently. Post a comment
  explaining visual review was skipped.
- If Copilot does not respond to the `@copilot` mention: the preview URLs
  remain in the comment for human review.
- Never block PR merge on workflow failures — the workflow adds comments
  but does not set required status checks or manage labels.

---

## Phase 3: Documentation and Agent Instructions

### 3.1 — Instruction file architecture

**Principle:** One `CLAUDE.md` that references role-specific files. No per-role
CLAUDE files — Claude Code only reads one `CLAUDE.md` per directory level. The
role context comes from the task prompt (GitHub Actions workflow), not the config
file.

```
CLAUDE.md                                  ← lightweight pointer (already exists)
  ├── references .github/LABEL_GUIDE.md    ← label taxonomy + usage
  ├── references .claude/agents/           ← role-specific agent instructions
  │     ├── doc-triage-agent.md            ← triage + auto-label logic
  │     └── doc-review-agent.md            ← local review sessions (Claude Code)
  └── references .github/instructions/     ← Copilot auto-loaded instructions
        └── content-review.instructions.md ← review criteria for content/**/*.md
```

**How review roles are assigned at runtime:**
- **Copilot code review (CI):** GitHub's native reviewer. Auto-loads
  instruction files from `.github/instructions/` based on changed file
  patterns. No custom prompt or API key needed.
- **Copilot visual review (CI):** Triggered by `@copilot` mention in a PR
  comment with preview URLs and a review template.
- **Claude local review:** Uses `.claude/agents/doc-review-agent.md` for
  local Claude Code sessions. Not used in CI.
- Shared rules (style guide, frontmatter, shortcodes) stay in the existing
  referenced files (`DOCS-CONTRIBUTING.md`, `DOCS-SHORTCODES.md`, etc.)
- No duplication — each instruction file says what's unique to that context

### 3.2 — Agent instruction files

#### `.claude/agents/doc-triage-agent.md`

Role-specific instructions for issue/PR triage. Contents:

- **Label taxonomy** — Full label list with categories, colors, descriptions
- **Path-to-product mapping** — Which content paths map to which `product:*` labels
- **Priority rules** — How to assess priority based on product, scope, and issue type
- **Decision logic** — When to apply `agent-ready`, `waiting:*`, `review:needs-human`
- **Migration context** — Old label → new label mapping (useful during transition)

This file does NOT duplicate style guide rules. It references
`DOCS-CONTRIBUTING.md` for those.

#### `.claude/agents/doc-review-agent.md`

Role-specific instructions for **local** Claude Code review sessions. This
file is NOT used in CI — the CI review is handled by Copilot using
`.github/instructions/content-review.instructions.md`.

Contents:

- **Review scope** — Markdown diff review only (frontmatter, shortcodes,
  semantic line feeds, heading hierarchy, terminology, links, shared content).
- **Severity classification** — BLOCKING / WARNING / INFO definitions with examples
- **Output format** — Structured review comment template

This file references `DOCS-CONTRIBUTING.md` for style rules and
`DOCS-SHORTCODES.md` for shortcode syntax — it does NOT restate them.

### 3.3 — Label usage guide

**File:** `.github/LABEL_GUIDE.md`

Contents:
- Label categories with descriptions and colors
- Common workflows (issue triage, DAR pipeline, manual work)
- GitHub filter queries for agents and humans
- Auto-labeling behavior reference

### 3.4 — Update existing pointer files

**`CLAUDE.md`** — Add one line to the "Full instruction resources" list:
```markdown
- [.github/LABEL_GUIDE.md](.github/LABEL_GUIDE.md) - Label taxonomy and pipeline usage
```

**`AGENTS.md`** — Add a section referencing the label guide and agent roles:
```markdown
## Doc Review Pipeline
- Label guide: `.github/LABEL_GUIDE.md`
- Triage agent: `.claude/agents/doc-triage-agent.md`
- Review agent: `.claude/agents/doc-review-agent.md`
```

**`.github/copilot-instructions.md`** — Add the label guide to the
"Specialized Resources" table.

These are small additions — no restructuring of existing files.

### 3.5 — Review instruction files

#### `.github/instructions/content-review.instructions.md` (Copilot code review)

Auto-loaded by Copilot for PRs that change `content/**/*.md` files. Contains
the review criteria (frontmatter, shortcodes, heading hierarchy, terminology,
links, code blocks) with severity classification.

This file replaces the original `.github/prompts/doc-review.md` Claude prompt.
The review criteria are the same but delivered through Copilot's native
instruction file mechanism instead of a custom action.

#### `.github/templates/review-comment.md` (shared format)

Shared definitions for severity levels, comment structure, and result → label
mapping. Used by `doc-review-agent.md` (local review sessions) and the
Copilot visual review template.

#### Copilot visual review template

The `@copilot` visual review comment is constructed inline in the
`doc-review.yml` workflow using the review template from
`.github/templates/review-comment.md`. Contains:

- The visual review checklist (raw shortcodes, broken layouts, 404s, etc.)
- Instructions for analyzing the rendered pages at the preview URLs
- Output format guidance (what to flag, severity levels)

---

## Future Phases (Not In Scope)

These are explicitly **not** part of this plan. Documented here for context.

### v2 — Screenshot-based visual review
- Add Playwright screenshot capture script (`.github/scripts/capture-screenshots.js`)
  for design/layout PRs where HTML analysis isn't sufficient.
- Capture full-page PNGs of preview pages, upload as workflow artifacts.
- Useful for PRs touching `layouts/`, `assets/css/`, or template changes
  where visual regression matters.
- The existing `scripts/puppeteer/screenshot.js` remains for local debugging;
  the CI script should use Playwright for reliability.

### v3 — Stale PR management
- Cron job that scans for stale PRs (draft >3 days with no review activity)
  and pings the author.
- Metrics tracking: % of PRs that pass Copilot review on first attempt.

### v4 — Agent-driven issue resolution
- Auto-assign doc issues to agents based on `agent-ready` label.
- Claude or Copilot drafts the fix, then the other agent reviews.
- Closes the loop: issue → draft → review → human approval.

---

## Decisions (Resolved)

### Q1: How should Copilot review rendered pages? — RESOLVED

**Decision:** Copilot reviews rendered HTML at public preview URLs — no
screenshots needed. Job 3 posts preview URLs in a PR comment, then tags
`@copilot` with a review prompt. See section 2.5 for implementation details.

This approach works because:
- Preview pages are publicly accessible at `influxdata.github.io/docs-v2/pr-preview/pr-{N}/`
- Copilot can analyze HTML content at public URLs
- No screenshot capture, image upload, or artifact management required

Screenshot capture is deferred to Future Phases (v2) for design/layout PRs
where visual regression testing matters.

### Q2: Should the review workflow be a required status check? — RESOLVED

**Decision:** No. Start as advisory (comments only). The workflow posts review
comments but does not set required status checks or manage labels. `review:*`
labels are applied manually after review. Make it required only after the team
confirms the false-positive rate is acceptable (see Future Phases).

### Q3: Should screenshots use Playwright or Puppeteer? — DEFERRED

**Decision:** Deferred to Future Phases (v2). The current implementation
reviews rendered HTML at preview URLs, not screenshots. When screenshot
capture is added later, use Playwright for CI and keep Puppeteer for local
debugging.

### Q4: How to handle the `pr-preview.yml` dependency? — RESOLVED

**Decision:** Option A — poll the preview URL with timeout. Job 3 polls
`https://influxdata.github.io/docs-v2/pr-preview/pr-{N}/` with `curl --head`
every 15 seconds until it returns 200, with a 10-minute timeout. If timeout is
reached, skip Copilot visual review; Copilot code review (Job 2) still runs
independently.

Rationale: Polling is simple, self-contained, and resilient. The URL pattern is
deterministic. Option B (`workflow_run`) adds complexity and doesn't handle
cases where preview doesn't deploy. Option C (combined workflow) makes the
workflow too large and eliminates the parallelism benefit.

### Q5: Cost and rate limiting — RESOLVED

**Decision:** Acceptable. Both code review and visual review use the repo's
Copilot allocation. No external API keys or per-call costs.

Mitigations already designed into the workflow:
- `paths` filter ensures only doc-content PRs trigger the workflow.
- `skip-review` label allows trivial PRs to opt out.
- Concurrency group cancels in-progress reviews when the PR is updated.
- Preview URL count is capped at 50 pages (matching `MAX_PAGES` in
  `resolve-review-urls.js`).
- Draft and fork PRs are skipped entirely.

### Q6: Label separator convention — RESOLVED

**Decision:** Use colons (`:`) everywhere. No slashes. One separator for
consistency — expecting humans or agents to infer different semantics from
separator choice is unrealistic. Mutually exclusive behavior (e.g., `review:*`
labels) is enforced in workflow code, not punctuation.

### Q7: Human approval mechanism — RESOLVED

**Decision:** Use GitHub's native PR review system (CODEOWNERS file) for human
approval. No `approval:codeowner` label. The `review:*` labels are exclusively
for automated pipeline outcomes.

### Q8: Product path mapping — RESOLVED

**Decision:** Extend `data/products.yml` with `content_path` and `label_group`
fields. This file becomes the single source of truth for path-to-product
resolution, used by the auto-label workflow, matrix-generator, and documentation
(AGENTS.md). Eliminates duplicated mappings across multiple files.

### Q9: `sync-plugin-docs` label migration — RESOLVED

**Decision:** Migrate to `source:sync` (not `source:auto-detected`). Plugin
sync is a distinct operation from change detection. `source:sync` is general
enough to cover future external repo syncs without being hyper-specific.

### Q10: Multi-product and shared content labeling — RESOLVED

**Decision:** Auto-labeling is additive — apply all matching `product:*` labels.
Changes to `content/shared/` get the `product:shared` label plus all expanded
product labels (resolved via `expandSharedContentChanges()`).

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Preview not deployed in time | Low | 10-minute polling timeout, fall back to code-only review |
| False positives in review | Medium | Start as advisory (not required check), iterate instruction files |
| Label migration data loss | Low | Migrate before deleting; human verification gate |
| Copilot visual review misses issues | Medium | Preview URLs remain in comment for human review; start advisory |
| Copilot code review quality | Medium | Review criteria in `.github/instructions/` can be iterated; local Claude review available as backup |
| Product mapping drift | Low | Single source of truth in `data/products.yml`; auto-label and matrix-generator both derive from it |

---

## File Summary

Files to create or modify:

| Action | File | Phase | Status |
|--------|------|-------|--------|
| Modify | `data/products.yml` | 1.0 | Done |
| Create | `helper-scripts/label-migration/create-labels.sh` | 1.2 | |
| Create | `helper-scripts/label-migration/migrate-labels.sh` | 1.2 | |
| Create | `helper-scripts/label-migration/delete-labels.sh` | 1.2 | |
| Create | `helper-scripts/label-migration/README.md` | 1.2 | |
| Create | `.github/workflows/auto-label.yml` | 1.3 | Done |
| Create | `.github/workflows/doc-review.yml` | 2.1 | Done |
| Create | `.claude/agents/doc-triage-agent.md` | 3.2 | Done |
| Create | `.claude/agents/doc-review-agent.md` | 3.2 | Done |
| Create | `.github/LABEL_GUIDE.md` | 3.3 | Done |
| Create | `.github/instructions/content-review.instructions.md` | 3.5 | Done |
| Create | `.github/templates/review-comment.md` | 2.5/3.5 | Done |
| Modify | `CLAUDE.md` | 3.4 | Done |
| Modify | `AGENTS.md` | 3.4 | Done |
| Modify | `.github/copilot-instructions.md` | 3.4 | Done |

---

## Implementation Order

1. ~~**Phase 1.0** — Extend `data/products.yml` with `content_path` and `label_group`~~ ✅
2. **Phase 1.1–1.2** — Create label migration scripts
3. ~~**Phase 1.3** — Create auto-label workflow~~ ✅
4. **Execute label migration** — Run scripts with human gates (not a code PR)
5. ~~**Phase 3.2** — Create agent instruction files~~ ✅
6. ~~**Phase 2.1–2.3** — Workflow skeleton + URL resolution + Copilot code review~~ ✅
7. ~~**Phase 2.5** — Copilot visual review job~~ ✅
8. ~~**Phase 3.3–3.5** — Label guide, instruction files, pointer updates~~ ✅
9. **Test end-to-end** — Open a test PR touching docs content, verify full pipeline
