# Doc Review Pipeline — Implementation Plan

**Status:** Draft — awaiting review and approval
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
8. [Open Questions and Decisions](#open-questions-and-decisions)
9. [Risk Assessment](#risk-assessment)

---

## Goal

Build two interconnected systems:

1. **Label system** — An automation-driven label taxonomy that supports
   cross-repo automation, agentic workflows, and human-in-the-loop review.
2. **Doc review pipeline** — A GitHub Actions workflow that automates
   documentation PR review using Claude (diff + visual) and Copilot
   (text/structural), with screenshot-based visual verification of rendered
   pages.

The pipeline catches issues only visible in rendered output — expanded
shortcodes, broken layouts, incorrect product names — not just what's in the
Markdown source.

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
| Claude GitHub App | Installed on repo | Can use `anthropics/claude-code-action` |
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
        ▼
┌─ Job 1: Resolve URLs ───────────────────────────────┐
│  Reuse detect-preview-pages.js + content-utils.js    │
│  changed files → preview URLs                        │
│  Output: urls.json artifact                          │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Job 2: Wait for Preview + Screenshot ──────────────┐
│  Poll until gh-pages preview deployment is live      │
│  Playwright: capture full-page PNG per URL           │
│  Output: screenshots/ artifact                       │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Job 3: Claude Review (diff + visual) ──────────────┐
│  anthropics/claude-code-action                       │
│  Inputs: PR diff + screenshots + prompt              │
│  Outputs: structured PR review comment + label       │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌─ Job 4: Copilot Review (text/structural) ───────────┐
│  Automatic (Copilot code review) or @copilot comment │
│  Text/structural review per existing config          │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
         Human reviews what remains
```

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

**23 labels organized into 6 categories:**

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

#### Source tracking labels (3) — Color: `#9370DB` (purple)

| Label | Description |
|-------|-------------|
| `source:auto-detected` | Created by change detection |
| `source:dar` | Created by DAR pipeline |
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
| `review:approved` | Codeowner approved |

#### Review outcome labels (3) — Color: `#28A745` / `#DC3545` / `#FFC107`

| Label | Description |
|-------|-------------|
| `review/approved` | Automated review passed |
| `review/changes-requested` | Automated review found blocking issues |
| `review/needs-human` | Automated review inconclusive, needs human |

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
| `sync-plugin-docs` | `source:auto-detected` |

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
- Match file paths to product labels:
  - `content/influxdb3/core/` → `product:v3-monolith`
  - `content/influxdb3/enterprise/` → `product:v3-monolith`
  - `content/influxdb3/cloud-serverless/` → `product:v3-distributed`
  - `content/influxdb3/cloud-dedicated/` → `product:v3-distributed`
  - `content/influxdb3/clustered/` → `product:v3-distributed`
  - `content/influxdb3/explorer/` → `product:explorer`
  - `content/influxdb/v2/` or `content/influxdb/cloud/` → `product:v2`
  - `content/influxdb/v1/` → `product:v1`
  - `content/enterprise_influxdb/` → `product:v1-enterprise`
  - `content/telegraf/` → `product:telegraf`
  - `content/chronograf/` → `product:chronograf`
  - `content/kapacitor/` → `product:kapacitor`
  - `content/flux/` → `product:flux`
  - `content/shared/` → `product:shared`
- Only add labels that are not already present (idempotent)
- Runs as `actions/github-script@v7` (no external dependencies)

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

**Permissions:** `contents: read`, `pull-requests: write`, `issues: write`

**Concurrency:** `group: doc-review-${{ github.event.number }}`, `cancel-in-progress: true`

**Skip conditions:** Draft PRs, fork PRs, PRs with `skip-review` label.

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

### 2.3 — Job 2: Wait for Preview + Capture Screenshots

**Purpose:** Wait for the `pr-preview.yml` workflow to deploy, then screenshot
each page.

**Dependencies:** Depends on Job 1 (needs URL list). Also depends on the
`pr-preview.yml` workflow having completed (the preview deployment must be live).

**Implementation:**

1. **Wait for preview deployment:**
   - Poll `https://influxdata.github.io/docs-v2/pr-preview/pr-{N}/` with
     `curl --head` until it returns 200
   - Timeout: 10 minutes (preview build takes ~75s + deploy time)
   - Poll interval: 15 seconds
   - If timeout, skip screenshots but still run diff-only review in Job 3

2. **Screenshot capture script:**
   - **File:** `.github/scripts/capture-screenshots.js`
   - **Runtime:** Playwright (already a dependency; more reliable than Puppeteer
     for CI headless screenshots)
   - **Input:** `urls.json` artifact from Job 1
   - **Output:** `screenshots/` directory with one PNG per page
   - **Filename convention:** Sanitized path, e.g., `content--influxdb3--core--write-data.png`
   - **Viewport:** 1280x900, full-page capture
   - **Wait strategy:** `waitUntil: 'networkidle'` (shortcodes and JS must finish)
   - **Timeout per page:** 30 seconds
   - **Error handling:** If a URL 404s, still capture the 404 page (that's a finding).
     If Playwright crashes on a page, log the error and continue to the next page.

3. **Upload screenshots as workflow artifact**

**The screenshot script should NOT duplicate the existing `scripts/puppeteer/screenshot.js`.**
Instead, create a new CI-focused script that:
- Takes a JSON file as input (not CLI args)
- Batches captures efficiently
- Uses Playwright (not Puppeteer) for better CI reliability
- Outputs a manifest JSON mapping filenames to source URLs

### 2.4 — Job 3: Claude Review (diff + visual)

**Purpose:** Run a two-part review: diff-based (Markdown) + visual (screenshots).

**Implementation:**
- Uses `anthropics/claude-code-action@v1`
- Two-part review in a single prompt (stored separately for maintainability)

**Prompt file:** `.github/prompts/doc-visual-review.md`

The prompt should instruct Claude to:

1. **Diff review** — Check the Markdown changes against existing style guide
   and agent instructions (already in the repo as `CLAUDE.md`, `AGENTS.md`,
   `DOCS-CONTRIBUTING.md`). Look for:
   - Frontmatter correctness (required fields, menu structure, weights)
   - Shortcode syntax
   - Semantic line feeds
   - Heading hierarchy (no h1 in content)
   - Product-specific terminology
   - Link format

2. **Visual review** — For each screenshot, check that the rendered page looks correct:
   - No raw shortcode syntax visible (`{{<` or `{{%`)
   - No placeholder text that should have been replaced
   - Broken layouts: overlapping text, missing images, collapsed sections
   - Code blocks rendered correctly (no raw HTML/Markdown fences visible)
   - Navigation/sidebar entries correct
   - No visible 404 or error state

3. **Severity classification:**
   - `BLOCKING` — Broken rendering, wrong product names, raw shortcodes
   - `WARNING` — Minor layout issues, style inconsistencies
   - `INFO` — Suggestions, not problems

4. **Output:**
   - Post a single structured review comment on the PR
   - Apply a review outcome label: `review/approved`, `review/changes-requested`, or `review/needs-human`

**Passing screenshots to Claude:**
- The `claude-code-action` has access to the workspace files.
  Download the screenshots artifact into the workspace before invoking the action.
- Reference them in the prompt by file path.
- If Claude Code Action doesn't support reading images from disk in the prompt,
  fall back to: post screenshots as collapsed `<details>` blocks in a PR comment,
  then reference the comment in the prompt.
  This decision will be resolved during implementation (see [Open Questions](#open-questions-and-decisions)).

### 2.5 — Job 4: Copilot Review (text/structural)

**Purpose:** Leverage Copilot's built-in code review for text/structural checks.

**Implementation:**
- Copilot code review triggers automatically if enabled for the repo — no
  custom workflow step needed.
- Optionally, after Claude's review completes, post a `@copilot review` comment
  on the PR to explicitly request Copilot review.
- This is a single `actions/github-script` step that creates a comment.

### 2.6 — Workflow failure handling

- If preview deployment times out: skip screenshots, run diff-only Claude review,
  post a comment explaining visual review was skipped.
- If a screenshot fails: log which URLs failed, continue with remaining screenshots,
  note the failures in the review comment.
- If Claude API errors: post a comment saying automated review failed, label PR
  `review/needs-human`.
- Never block PR merge on workflow failures — the workflow adds labels and comments
  but does not set required status checks.

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
  │     ├── doc-triage-agent.md            ← NEW: triage + auto-label logic
  │     └── doc-review-agent.md            ← NEW: diff + visual review logic
  └── references .github/prompts/          ← workflow-specific prompts
        └── doc-visual-review.md           ← NEW: prompt for Claude Code Action
```

**How roles are assigned at runtime:**
- GitHub Actions workflow sets the task prompt (e.g., "Review this PR using
  the instructions in `.claude/agents/doc-review-agent.md`")
- The agent file contains role-specific logic (what to check, how to label)
- Shared rules (style guide, frontmatter, shortcodes) stay in the existing
  referenced files (`DOCS-CONTRIBUTING.md`, `DOCS-SHORTCODES.md`, etc.)
- No duplication — each agent file says what's unique to that role

### 3.2 — Agent instruction files

#### `.claude/agents/doc-triage-agent.md`

Role-specific instructions for issue/PR triage. Contents:

- **Label taxonomy** — Full label list with categories, colors, descriptions
- **Path-to-product mapping** — Which content paths map to which `product:*` labels
- **Priority rules** — How to assess priority based on product, scope, and issue type
- **Decision logic** — When to apply `agent-ready`, `waiting:*`, `review/needs-human`
- **Migration context** — Old label → new label mapping (useful during transition)

This file does NOT duplicate style guide rules. It references
`DOCS-CONTRIBUTING.md` for those.

#### `.claude/agents/doc-review-agent.md`

Role-specific instructions for PR review. Contents:

- **Review scope** — What to check in diff review vs. visual review
- **Severity classification** — BLOCKING / WARNING / INFO definitions with examples
- **Output format** — Structured review comment template
- **Label application** — When to apply `review/approved`, `review/changes-requested`,
  `review/needs-human`
- **Screenshot analysis** — What to look for in rendered page screenshots
  (raw shortcodes, broken layouts, placeholder text, 404s)

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

### 3.5 — Review prompt file

**File:** `.github/prompts/doc-visual-review.md`

This is the prompt passed to `claude-code-action` in the workflow. It is
**separate from** the agent instruction file (`.claude/agents/doc-review-agent.md`)
because:

- The prompt is tightly coupled to the workflow (references artifact paths,
  PR context variables, output format for GitHub comments)
- The agent file is reusable across contexts (Claude Code CLI, manual review,
  future workflows)

The prompt should `@reference` the agent file:
```markdown
Follow the review instructions in `.claude/agents/doc-review-agent.md`.
```

This way the prompt stays small and the review logic lives in one place.

---

## Future Phases (Not In Scope)

These are explicitly **not** part of this plan. Documented here for context.

### v2 — Stale PR management
- Cron job that scans for stale PRs (draft >3 days with no review activity)
  and pings the author.
- Metrics tracking: % of PRs that pass Claude review on first attempt.

### v3 — Agent-driven issue resolution
- Auto-assign doc issues to agents based on `agent-ready` label.
- Claude or Copilot drafts the fix, then the other agent reviews.
- Closes the loop: issue → draft → review → human approval.

---

## Open Questions and Decisions

These must be resolved during implementation:

### Q1: How to pass screenshots to Claude Code Action?

**Options:**
- **A) Workspace files:** Download screenshots artifact into workspace, reference
  by path in the prompt. Simplest, but depends on Claude Code Action supporting
  image file reads.
- **B) PR comment images:** Upload screenshots to the PR as image attachments in a
  collapsed comment, reference the comment in the prompt. More robust but adds a
  visual comment.
- **C) Base64 in prompt:** Encode screenshots as base64 and include directly in
  the action's prompt input. Size-limited; impractical for large/many pages.

**Recommendation:** Try A first. If the action can read images from the workspace
filesystem, it's the simplest path. Fall back to B.

### Q2: Should the review workflow be a required status check?

**Recommendation:** No. Start as advisory (labels + comments). Make it required
only after the team confirms the false-positive rate is acceptable.

### Q3: Should screenshots use Playwright or Puppeteer?

Both are already dependencies. Playwright is generally more reliable in CI
environments and supports `waitUntil: 'networkidle'` natively. Puppeteer already
has a `screenshot.js` utility in the repo for local debugging.

**Recommendation:** Use Playwright for CI (new script), keep Puppeteer for local
debugging (existing script). No duplication of logic.

### Q4: How to handle the `pr-preview.yml` dependency?

The review workflow needs the preview to be deployed before screenshots.
Options:
- **A) Poll the preview URL** until it returns 200 (simple, self-contained).
- **B) Use `workflow_run` trigger** to start the review after `pr-preview.yml`
  completes (cleaner, but more complex to wire up since preview may not deploy
  for all PRs).
- **C) Combine into a single workflow** (avoids coordination, but makes the
  workflow very large).

**Recommendation:** A — poll with timeout. Simple and resilient. The preview
URL pattern is known (`influxdata.github.io/docs-v2/pr-preview/pr-{N}/`).

### Q5: Cost and rate limiting

Each PR review consumes Claude API tokens. Mitigations:
- `paths` filter ensures only doc-content PRs trigger the workflow.
- `skip-review` label allows trivial PRs to opt out.
- Concurrency group cancels in-progress reviews when the PR is updated.
- Screenshot count is capped at 50 pages (matching `MAX_PAGES` in
  `detect-preview-pages.js`).

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Claude API cost per PR | Medium | Path filters, skip-review label, concurrency cancellation |
| Screenshot flakiness in CI | Medium | Per-page timeout, continue-on-error, note failures in review |
| Preview not deployed in time | Low | 10-minute polling timeout, fall back to diff-only review |
| False positives in visual review | Medium | Start as advisory (not required check), iterate prompt |
| Label migration data loss | Low | Migrate before deleting; human verification gate |
| Copilot review conflicts with Claude | Low | Different scopes: Copilot = text/structural, Claude = diff + visual |

---

## File Summary

Files to create or modify:

| Action | File | Phase |
|--------|------|-------|
| Create | `helper-scripts/label-migration/create-labels.sh` | 1.2 |
| Create | `helper-scripts/label-migration/migrate-labels.sh` | 1.2 |
| Create | `helper-scripts/label-migration/delete-labels.sh` | 1.2 |
| Create | `helper-scripts/label-migration/README.md` | 1.2 |
| Create | `.github/workflows/auto-label.yml` | 1.3 |
| Create | `.github/workflows/doc-review.yml` | 2.1 |
| Create | `.github/scripts/capture-screenshots.js` | 2.3 |
| Create | `.claude/agents/doc-triage-agent.md` | 3.2 |
| Create | `.claude/agents/doc-review-agent.md` | 3.2 |
| Create | `.github/LABEL_GUIDE.md` | 3.3 |
| Create | `.github/prompts/doc-visual-review.md` | 3.5 |
| Modify | `CLAUDE.md` | 3.4 |
| Modify | `AGENTS.md` | 3.4 |
| Modify | `.github/copilot-instructions.md` | 3.4 |

---

## Implementation Order

1. **Phase 1.1–1.2** — Create label migration scripts (PR 1)
2. **Phase 1.3** — Create auto-label workflow (can be in PR 1 or separate)
3. **Execute label migration** — Run scripts with human gates (not a code PR)
4. **Phase 3.2** — Create agent instruction files (PR 2 — can start in parallel with Phase 2)
5. **Phase 2.1–2.2** — Workflow skeleton + URL resolution job (PR 3)
6. **Phase 2.3** — Screenshot capture script + job (PR 3)
7. **Phase 2.4** — Claude review job + prompt file (PR 3, uses agent files from Phase 3.2)
8. **Phase 2.5** — Copilot review step (PR 3)
9. **Phase 3.3–3.5** — Label guide, pointer updates, review prompt (PR 4 or combined with PR 3)
10. **Test end-to-end** — Open a test PR touching docs content, verify full pipeline
