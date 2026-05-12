---
name: content-editing
description: "Create, edit, and validate InfluxData documentation. Manages Hugo shared content across InfluxDB products, runs Vale style linting and Hugo builds, validates frontmatter and code blocks, and fact-checks via the documentation MCP server. Use when creating new doc pages, editing markdown .md files, managing shared content, running Vale or Hugo builds, or testing InfluxDB, Telegraf, or Flux documentation."
author: InfluxData
version: "1.0"
---

# Content Editing Workflow

## Quick Decision Tree

```
CLI vs direct editing? → See docs-cli-workflow skill
Shared content changes? → Touch sourcing files (Part 1)
Run tests? → Hugo build, Vale, code-block lint, E2E (Part 2)
Verify technical accuracy? → MCP server (Part 3)
Write/debug Vale rules? → See vale-linting and vale-rule-config skills
```

## Using `docs create` and `docs edit`

**For detailed guidance on when and how to use the docs CLI tools**, see the **docs-cli-workflow** skill, which covers:

- When to suggest `docs create` vs direct file creation
- When to suggest `docs edit` vs direct file editing
- CLI command syntax and examples
- How to present recommendations to users
- Edge cases and user preference handling

**Quick reference for this workflow:**

```bash
# Create new documentation from draft
docs create <draft-path> --products <product-key>

# Edit existing documentation by URL or path
docs edit <url-or-path>

# List files without opening editor (agent-friendly)
docs edit <url-or-path> --list

# Add placeholder syntax to code blocks
docs placeholders <file.md>

# Important: Both commands are non-blocking by default
# - Launch editor in background
# - Return immediately (agent-friendly)
# - Use --wait flag for blocking behavior
```

## Part 1: Shared Content Management

Content that appears in multiple products uses Hugo's **content adapter** pattern:

```
content/
├── shared/
│   └── influxdb3/
│       └── admin/
│           └── databases.md          # Actual content here
├── influxdb3/
│   ├── core/
│   │   └── admin/
│   │       └── databases.md         # Frontmatter only, has source:
│   └── enterprise/
│       └── admin/
│           └── databases.md         # Frontmatter only, has source:
```

**Frontmatter file example:**

```yaml
---
title: Database Management
source: /shared/influxdb3/admin/databases.md
---
```

### CRITICAL: Touching Sourcing Files

**When you edit a shared content file, Hugo does NOT automatically rebuild pages that reference it.**

You MUST touch the frontmatter files to trigger a rebuild:

```bash
# Manual approach
touch content/influxdb3/core/admin/databases.md
touch content/influxdb3/enterprise/admin/databases.md
```

### Automatic (Recommended)

**Use `docs edit`** - it handles this automatically:

```bash
# This command will:
# 1. Find the shared source file
# 2. Find ALL frontmatter files that reference it
# 3. Open all files for editing
# 4. You edit the shared file
# 5. Hugo sees changes to frontmatter files and rebuilds

docs edit /influxdb3/core/admin/databases/
```

### Detecting Shared Content Programmatically

A sourcing file has `source:` frontmatter and minimal/no body content. Parse with `gray-matter`:

```javascript
import { readFileSync } from 'fs';
import matter from 'gray-matter';

function isSharedContent(filePath) {
  const { data, content: body } = matter(readFileSync(filePath, 'utf8'));
  return data.source && body.trim().length < 50;
}
```

### Why This Matters

**Failure to touch sourcing files means:**

- Hugo won't rebuild the pages
- Your changes won't appear in test/preview
- Tests will fail because content hasn't changed
- Published site won't reflect your edits

### Check for Path Differences and Add `alt_links`

When creating or editing shared content, check if the URL paths differ between products. If they do, add `alt_links` frontmatter to each product file to cross-reference the equivalent pages.

See [DOCS-FRONTMATTER.md](../../../DOCS-FRONTMATTER.md#alternative-links-alt_links) for syntax and examples.

### Check product resource terms are cross-referenced

Product resource terms often appear inside `code-placeholder-key` shortcode text and bullet item text.
Example product resource terms:

- "database token"
- "database name"

## Part 2: Testing Workflow

After making content changes, run tests to validate:

### 1. Hugo Build Test (Required)

```bash
# Verify Hugo can build the site
yarn hugo --quiet

# Look for errors like:
# - Template errors
# - Missing partials
# - Invalid frontmatter
# - Broken shortcodes
```

### 2. Link Validation (Recommended)

```bash
# Test all links in the documentation
yarn test:links

# This checks:
# - Internal links (relative paths)
# - Cross-references
# - Anchor links
```

### 3. Code Block Syntax Lint (Fast — Runs on Every PR)

Parse/compile-only check for fenced code blocks. No credentials, no network, no Docker needed.

```bash
# Lint changed content files (exits 1 if any JSON/YAML/TOML block fails)
yarn lint-codeblocks content/influxdb3/core/admin/tokens/*.md

# Run the linter's own test suite
yarn test:lint-codeblocks
```

**Blocking policy (mirrors CI):**

| Language | On failure |
| --- | --- |
| JSON, YAML, TOML | `::error::` — fails the PR check |
| bash, python, javascript | `::warning::` — informational only |

**Normalization:** declared `placeholders="TOKEN|DURATION"` fence attributes and Hugo shortcodes (`{{< >}}`, `{{% %}}`) are substituted before parsing. See `DOCS-TESTING.md § "Parse/compile code-block lint"` for details.

### 4. Code Block Execution Testing (For Pages with Runnable Examples)

```bash
# Test all code examples in documentation
yarn test:codeblocks:all

# Tests code blocks marked with:
# - testable: true
# - Validates syntax
# - Can execute examples (for supported languages)
```

### 5. E2E Testing (For Specific Pages)

Use the **cypress-e2e-testing** skill for comprehensive page testing:

```bash
# Test specific content file
node cypress/support/run-e2e-specs.js content/influxdb3/core/admin/databases/_index.md

# Test API reference pages (requires yarn build:api-docs first)
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/api-reference.cy.js" \
  content/influxdb3/core/api/_index.md
```

**Important prerequisites:**

- API tests: Run `yarn build:api-docs` first
- Markdown validation: Run `yarn hugo --quiet && yarn build:md` first

See **cypress-e2e-testing** skill for detailed test workflow.

### 6. Style Linting (Pre-commit)

Vale style linting runs automatically via pre-commit hooks, but you can run it manually:

```bash
# Lint specific files
.ci/vale/vale.sh --config=.vale.ini content/influxdb3/core/path/to/file.md

# Lint with minimum alert level
.ci/vale/vale.sh --config=.vale.ini --minAlertLevel=warning content/path/

# Sync Vale packages (after .vale.ini changes)
.ci/vale/vale.sh sync
```

**Common issues:**

- `admin` flagged → Use "administrator" in prose, or it's in a code context
- Duration literals (`30d`) → These are valid InfluxDB syntax
- Technical terms flagged → Add to `.ci/vale/styles/InfluxDataDocs/Terms/ignore.txt`

See **vale-linting** skill for comprehensive Vale workflow.

### 7. Visual Preview (Optional)

```bash
# Start Hugo development server
yarn hugo server

# Visit http://localhost:1313
# Preview your changes in browser
```

## Part 3: Vale Style Linting Quick Reference

For comprehensive Vale workflows, see the **vale-linting** skill. For writing custom rules, see **vale-rule-config**.

```bash
# Lint all markdown files
.ci/vale/vale.sh content/**/*.md

# Lint specific product with config and alert level
.ci/vale/vale.sh \
  --config=content/influxdb/cloud-dedicated/.vale.ini \
  --minAlertLevel=error \
  content/influxdb/cloud-dedicated/write-data/**/*.md
```

**Fixing common issues:**

- **Spelling**: Add legitimate terms to `.ci/vale/styles/config/vocabularies/InfluxDataDocs/accept.txt`
- **False positives**: Disable inline with `<!-- vale InfluxDataDocs.RuleName = NO -->` / `YES`
- **`admin` flagged**: Use "administrator" in prose; code contexts are fine
- **Duration literals (`30d`)**: Valid InfluxDB syntax — no change needed

## Part 4: Fact-Checking with the Documentation MCP Server

The **InfluxDB documentation MCP server** lets you search InfluxDB documentation and related InfluxData references directly from your AI assistant via the `search_influxdb_knowledge_sources` tool.

**Use for:**

- Verifying technical accuracy of claims
- Checking current API syntax
- Confirming feature availability across products
- Understanding complex product behavior
- Finding related documentation and code examples
- Identifying and analyzing content gaps in the documentation

**Don't use for:**

- Basic style/grammar checks (use Vale)
- Link validation (use `yarn test:links`)
- Testing code examples (use `yarn test:codeblocks`)

### Setup

The documentation MCP server is hosted at `https://influxdb-docs.mcp.kapa.ai`—no local installation required.

Already configured in [`.mcp.json`](/.mcp.json). Two server entries are available:

- **`influxdb-docs`** (API key) — Set `INFLUXDATA_DOCS_KAPA_API_KEY` env var. 60 req/min.
- **`influxdb-docs-oauth`** (OAuth) — No setup. Authenticates via Google or GitHub on first use. 40 req/hr, 200 req/day.

### Example queries

- "How do I create a database in InfluxDB 3 Core?"
- "What's the difference between InfluxDB 3 Core and Enterprise clustering?"
- "Show me InfluxQL SELECT syntax for filtering by time range"

Always cross-check MCP results against source URLs returned — it searches rendered docs, not live systems.

## Part 4: Example Workflows

### Creating New Multi-Product Documentation

```bash
docs create database-tutorial.md --products influxdb3-core,influxdb3-enterprise
# Fact-check with MCP, then validate
yarn hugo --quiet
node cypress/support/run-e2e-specs.js content/influxdb3/core/guides/database-tutorial.md
yarn test:links
yarn test:codeblocks:all
```

### Editing Shared Content

```bash
# CLI finds shared source + all sourcing files, touches them automatically
docs edit https://docs.influxdata.com/influxdb3/core/reference/sql/
# Fact-check with MCP, then validate
yarn hugo --quiet
node cypress/support/run-e2e-specs.js \
  content/influxdb3/core/reference/sql/_index.md
yarn test:links
```

### Quick Fix (No CLI Needed)

```bash
# Edit file directly, then build-test
yarn hugo --quiet
yarn hugo server  # Preview at http://localhost:1313
```

## Part 5: Troubleshooting

| Problem | Solution |
| --- | --- |
| Hugo build fails | Run `yarn hugo` (no `--quiet`) for detailed errors — check frontmatter YAML, shortcode tags, partial refs |
| Shared content edits not appearing | Touch sourcing files: `grep -r "source: /shared/path" content/` then `touch` each, or use `docs edit` |
| MCP not responding | Verify `INFLUXDATA_DOCS_KAPA_API_KEY` is set, check rate limits (60 req/min API key, 40 req/hr OAuth) |
| Cypress tests fail | See **cypress-e2e-testing** skill; check `cat /tmp/hugo_server.log`, run `yarn build:api-docs` if API content missing |

## Part 6: Quick Reference

| Task                       | Command                                                                           |
| -------------------------- | --------------------------------------------------------------------------------- |
| Create new content         | `docs create draft.md --products <key-or-path>`                                   |
| Edit by URL                | `docs edit https://docs.influxdata.com/...`                                       |
| List files without editing | `docs edit <url> --list`                                                          |
| Add placeholders to code   | `docs placeholders file.md` or `docs placeholders file.md --dry`                  |
| Audit documentation        | `docs audit --products influxdb3_core` or `docs audit --products /influxdb3/core` |
| Generate release notes     | `docs release-notes v3.1.0 v3.2.0 --products influxdb3_core`                      |
| Build Hugo site            | `yarn hugo --quiet`                                                               |
| Run Vale linting           | `.ci/vale/vale.sh --config=.vale.ini content/path/`                               |
| Test links                 | `yarn test:links`                                                                 |
| Lint code block syntax     | `yarn lint-codeblocks content/path/*.md`                                          |
| Test code blocks           | `yarn test:codeblocks:all`                                                        |
| Test specific page         | `yarn test:e2e content/path/file.md`                                              |
| Fact-check with MCP        | Ask AI assistant with `search_influxdb_knowledge_sources` tool configured         |
| Preview locally            | `yarn hugo server` (visit localhost:1313)                                         |
| Generate API docs          | `yarn build:api-docs` (before API reference tests)                                |

**Note:** `--products` accepts both product keys (`influxdb3_core`) and content paths (`/influxdb3/core`).

## Related Skills

- **docs-cli-workflow** - When to use CLI vs direct editing (decision guidance)
- **vale-rule-config** - Writing Vale rules and understanding regex patterns (for CI/Quality Engineers)
- **cypress-e2e-testing** - Detailed Cypress test execution and debugging
- **hugo-template-dev** - Hugo template syntax and development
- **vale-linting** - Vale style linting configuration and debugging

## Checklist: Before Claiming Content is Complete

- [ ] Content created/edited using appropriate method (CLI or direct)
- [ ] If shared content: Sourcing files touched (or used `docs edit`)
- [ ] If shared content: Check for path differences and add `alt_links` if paths vary
- [ ] Technical accuracy verified (MCP fact-check if needed)
- [ ] Hugo builds without errors (`yarn hugo --quiet`)
- [ ] Vale style linting passes (`.ci/vale/vale.sh --config=.vale.ini content/path/`)
- [ ] Links validated (`yarn test:links`)
- [ ] Code examples tested (if applicable)
- [ ] E2E tests pass for affected pages
- [ ] Visual preview confirms changes look correct
- [ ] Related documentation updated (if needed)
