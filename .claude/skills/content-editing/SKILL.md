---
name: content-editing
description: Complete workflow for creating, editing, and validating InfluxData documentation content
author: InfluxData
version: "1.0"
---

# Content Editing Workflow

## Purpose

This skill guides the complete workflow for creating and editing InfluxData documentation, from initial content creation through testing and validation. It integrates docs CLI tools, MCP server fact-checking, shared content management, and comprehensive testing.

**Use this skill when:**

- Creating new documentation pages
- Editing existing documentation
- Working with shared content that affects multiple pages
- Validating documentation accuracy and functionality

## Quick Decision Tree

```
Need to decide when to use CLI vs direct editing?
└─ See docs-cli-workflow skill for decision guidance

Made content changes?
├─ To shared content? Touch sourcing files! (See Part 1: Shared Content)
├─ Run Vale linting (See Part 3: Vale Style Linting)
└─ Run tests (See Part 2: Testing)

Need to verify technical accuracy?
└─ Use documentation MCP server (See Part 4: Fact-Checking)

Need to write/debug Vale rules?
└─ See vale-rule-config skill (for CI/Quality Engineers)
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

### What is Shared Content?

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
source: /content/shared/influxdb3/admin/databases.md
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

### Programmatic Detection

If you need to handle this in code:

```javascript
// Check if a file is a sourcing file (frontmatter only)
import { readFileSync } from 'fs';
import matter from 'gray-matter';

function isSharedContent(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const { data, content: body } = matter(content);
  
  // If has source: frontmatter and minimal/no body content
  return data.source && body.trim().length < 50;
}

function getSharedSource(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const { data } = matter(content);
  return data.source; // e.g., "/content/shared/influxdb3/admin/databases.md"
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

### 3. Code Block Testing (For Pages with Examples)

```bash
# Test all code examples in documentation
yarn test:codeblocks:all

# Tests code blocks marked with:
# - testable: true
# - Validates syntax
# - Can execute examples (for supported languages)
```

### 4. E2E Testing (For Specific Pages)

Use the **cypress-e2e-testing** skill for comprehensive page testing:

```bash
# Test specific content file
node cypress/support/run-e2e-specs.js content/influxdb3/core/admin/databases/_index.md

# Test API reference pages (requires yarn build:api-docs first)
node cypress/support/run-e2e-specs.js \
  --spec "cypress/e2e/content/api-reference.cy.js" \
  content/influxdb3/core/reference/api/_index.md
```

**Important prerequisites:**

- API tests: Run `yarn build:api-docs` first
- Markdown validation: Run `yarn hugo --quiet && yarn build:md` first

See **cypress-e2e-testing** skill for detailed test workflow.

### 5. Style Linting (Pre-commit)

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

### 6. Visual Preview (Optional)

```bash
# Start Hugo development server
yarn hugo server

# Visit http://localhost:1313
# Preview your changes in browser
```

## Part 3: Vale Style Linting

Vale checks documentation for style guide violations, spelling errors, and branding consistency.

**For writing Vale rules and understanding regex patterns**, see the **vale-rule-config** skill.

### Running Vale

```bash
# Basic linting (all markdown files)
.ci/vale/vale.sh content/**/*.md

# Lint specific product
.ci/vale/vale.sh content/influxdb3/core/**/*.md

# With specific config and alert level
.ci/vale/vale.sh \
  --config=content/influxdb/cloud-dedicated/.vale.ini \
  --minAlertLevel=error \
  content/influxdb/cloud-dedicated/write-data/**/*.md
```

### Understanding Vale Alerts

Vale reports three alert levels:

- **Error** (red): Critical issues - branding violations, broken style rules, rejected terms
- **Warning** (yellow): Style guide recommendations - should be fixed
- **Suggestion** (blue): Optional improvements - consider fixing

### Fixing Common Vale Issues

**Spelling/vocabulary errors:**

```bash
# If Vale flags a legitimate term, add it to vocabulary
echo "YourTerm" >> .ci/vale/styles/config/vocabularies/InfluxDataDocs/accept.txt
```

**Style violations:**
Vale will suggest the correct form. For example:

```
content/file.md:25:1: Use 'InfluxDB 3' instead of 'InfluxDB v3'
```

Simply make the suggested change.

**False positives:**
If Vale incorrectly flags something:

1. Check if it's a new technical term that should be in vocabulary
2. See if the rule needs refinement (consult **vale-rule-config** skill)
3. Add inline comments to disable specific rules if necessary:

```markdown
<!-- vale InfluxDataDocs.TechnicalTerms = NO -->
This paragraph contains technical terms that Vale might flag.
<!-- vale InfluxDataDocs.TechnicalTerms = YES -->
```

### When to Run Vale

- **Before committing**: Pre-commit hooks run Vale automatically
- **After content changes**: Run manually to catch issues early
- **In CI/CD**: Automated on pull requests

## Part 4: Fact-Checking with the Documentation MCP Server

The **InfluxDB documentation MCP server** lets you search InfluxDB documentation (the rendered `content` managed in this repository) and related InfluxData references (source code READMEs, community forums, and some third-party tool documentation) directly from your AI assistant.

### When to Use the Documentation MCP Server

The primary source of content in the Documentation MCP Server is the fully rendered `public` HTML from this repository.
Use the Documentation MCP Server when the information here is inconclusive, when you need to deepen your understanding of InfluxData products and integrations, or when identifying content gaps in the documentation.

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

The documentation MCP server is hosted—no local installation required. Add the server URL to your AI assistant's MCP configuration.

**MCP server URL:**

```text
https://influxdb-docs.mcp.kapa.ai
```

**Claude Desktop configuration** (Settings > Developer):

```json
{
  "mcpServers": {
    "influxdb-docs": {
      "url": "https://influxdb-docs.mcp.kapa.ai"
    }
  }
}
```

For other AI assistants see the [InfluxDB documentation MCP server guide](/influxdb3/core/admin/mcp-server/)
and verify the MCP configuration options and syntax for a specific AI assistant.

**Rate limits** (per Google OAuth user):

- 40 requests per hour
- 200 requests per day

### Available Tool

The MCP server exposes a semantic search tool:

```text
search_influxdb_knowledge_sources
```

**What it does:**

- Searches all InfluxDB documentation for a given query
- Returns relevant chunks in descending order of relevance
- Each chunk includes `source_url` and Markdown `content`

**Example queries:**

- "How do I create a database in InfluxDB 3 Core?"
- "What's the difference between InfluxDB 3 Core and Enterprise clustering?"
- "Show me InfluxQL SELECT syntax for filtering by time range"

### Example Workflow: Fact-Checking During Editing

```markdown
## Scenario: Editing database management documentation

1. Draft claims: "InfluxDB 3 supports up to 10,000 databases per instance"

2. Ask your AI assistant to verify using the MCP server:
   "What are the database limits in InfluxDB 3 Core and Enterprise?"

3. MCP response returns documentation chunks with actual limits

4. Update draft with accurate information

5. Cite the source_url in documentation if needed
```

### Best Practices

**DO:**

- Ask specific, focused questions
- Verify claims about features, limits, syntax
- Cross-check answers with source URLs provided
- Use for understanding complex interactions

**DON'T:**

- Rely solely on MCP without reviewing source docs
- Use for subjective style decisions
- Expect real-time product behavior (it searches documentation, not live systems)
- Use as a replacement for testing (always test code examples)

## Part 5: Complete Example Workflows

### Example 1: Creating New Multi-Product Documentation

```bash
# Step 1: Create content from draft
docs create database-tutorial.md --products influxdb3-core,influxdb3-enterprise

# CLI scaffolds files:
# - content/shared/influxdb3/guides/database-tutorial.md
# - content/influxdb3/core/guides/database-tutorial.md (frontmatter)
# - content/influxdb3/enterprise/guides/database-tutorial.md (frontmatter)

# Step 2: Verify technical accuracy
# Ask your AI assistant (with MCP configured) to verify claims:
# "Verify database creation syntax for InfluxDB 3"

# Step 3: Test Hugo build
yarn hugo --quiet

# Step 4: Run E2E tests
node cypress/support/run-e2e-specs.js \
  content/influxdb3/core/guides/database-tutorial.md

# Step 5: Validate links
yarn test:links

# Step 6: Test code examples (if tutorial has code blocks)
yarn test:codeblocks:all
```

### Example 2: Editing Shared Content

```bash
# Step 1: Find and edit the content
docs edit https://docs.influxdata.com/influxdb3/core/reference/sql/

# CLI automatically:
# - Finds content/shared/influxdb3/reference/sql/_index.md
# - Finds ALL frontmatter files referencing it:
#   * content/influxdb3/core/reference/sql/_index.md
#   * content/influxdb3/enterprise/reference/sql/_index.md
#   * content/influxdb3/cloud-dedicated/reference/sql/_index.md
# - Opens all files (sourcing files will be touched when saved)

# Step 2: Make edits to the shared source file

# Step 3: Fact-check changes with MCP
# Ask your AI assistant: "Verify SQL WHERE clause syntax in InfluxDB 3"

# Step 4: Test the build
yarn hugo --quiet

# Step 5: Test affected pages
node cypress/support/run-e2e-specs.js \
  content/influxdb3/core/reference/sql/_index.md \
  content/influxdb3/enterprise/reference/sql/_index.md

# Step 6: Validate links in SQL reference
yarn test:links
```

### Example 3: Quick Fix Without CLI

```bash
# Step 1: Fix typo directly (you know the file)
# Edit content/influxdb3/core/get-started/_index.md

# Step 2: Test Hugo build
yarn hugo --quiet

# Step 3: Quick visual check
yarn hugo server
# Visit http://localhost:1313/influxdb3/core/get-started/

# Done! (No need for comprehensive testing on typo fixes)
```

## Part 6: Troubleshooting

### Hugo Build Fails

```bash
# Check for detailed errors
yarn hugo

# Common issues:
# - Invalid frontmatter YAML
# - Missing closing shortcode tags
# - Broken partial references
# - Invalid template syntax
```

### Tests Fail After Editing Shared Content

**Problem:** Edited shared file, but test shows old content

**Solution:** Touch the sourcing files manually

```bash
# Find pages that reference the shared file
grep -r "source: /content/shared/path/to/file.md" content/

# Touch each one
touch content/influxdb3/core/path/to/file.md
touch content/influxdb3/enterprise/path/to/file.md

# Or use docs edit (it does this automatically)
```

### MCP Server Not Responding

The hosted MCP server (`https://influxdb-docs.mcp.kapa.ai`) requires:

1. **Google OAuth authentication** - On first use, sign in with Google
2. **Rate limits** - 40 requests/hour, 200 requests/day per user

**Troubleshooting steps:**

- Verify your AI assistant has the MCP server URL configured correctly
- Check if you've exceeded rate limits (wait an hour or until the next day)
- Try re-authenticating by clearing your OAuth session
- Ensure your network allows connections to `*.kapa.ai`

### Cypress Tests Fail

See **cypress-e2e-testing** skill for comprehensive debugging:

```bash
# Check Hugo server logs
cat /tmp/hugo_server.log | tail -50

# Run tests interactively
yarn cypress open

# Check if API content was generated (for API tests)
ls content/influxdb3/core/api/
# If empty: yarn build:api-docs
```

## Part 7: Quick Reference

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
