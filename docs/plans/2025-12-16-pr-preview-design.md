# PR Preview System Design

**Date**: 2025-12-16
**Status**: Approved
**Branch**: `ci-pr-preview`

## Overview

Generate GitHub Pages previews for docs-v2 pull requests, giving reviewers, authors, and stakeholders a visual preview without needing to build locally.

### Goals

- Provide visual previews for content, layout, asset, and API documentation changes
- Minimize storage usage by deploying only changed pages (not full 529MB site)
- Auto-cleanup previews when PRs close
- Support all audiences: PR reviewers, documentation authors, non-technical stakeholders

### Non-goals

- Replace staging environment (staging used for infrastructure/integration testing)
- Preview draft PRs
- Block PR merges on preview failures

## Workflow

```
PR Opened/Updated
       │
       ▼
   Is PR draft? ──yes──► Skip (no preview)
       │ no
       ▼
   Detect changed files
   (content/, layouts/, assets/, data/, api-docs/, openapi/)
       │
       ▼
   No relevant changes? ──yes──► Skip (no preview)
       │ no
       ▼
   Only deletions? ──yes──► Skip (no preview)
       │ no
       ▼
   Content changes only? ──yes──► Build full site, deploy changed pages
       │ no
       ▼
   Layout/asset/API changes ──► Parse URLs from PR description
       │                              │
       │                         URLs found? ──yes──► Deploy those pages
       │                              │ no
       │                              ▼
       │                         Bot comments asking author
       │                         to select pages to preview
       ▼
   PR Closed ──► Auto-cleanup preview from gh-pages
```

**Preview URL format**: `https://influxdata.github.io/docs-v2/pr-preview/pr-{number}/`

## Change Detection & Selective Deployment

### Trigger Conditions

All must be true:
- PR is not a draft
- PR modifies files in: `content/**`, `layouts/**`, `assets/**`, `data/**`, `api-docs/**`, or `openapi/**`

### Change Detection Logic

Reuses existing infrastructure from `scripts/lib/content-utils.js`:

```javascript
import { getChangedContentFiles, mapContentToPublic } from './content-utils.js';

// Get changed content files vs base branch (handles shared content expansion)
const changedContent = getChangedContentFiles('origin/master');

// Map to public HTML paths
const htmlPaths = mapContentToPublic(changedContent, 'public');
```

### Deployment Strategy by Change Type

| Change Type | Detection | Deployment |
|-------------|-----------|------------|
| Content only | `content/**/*.md` changed | Deploy only affected pages |
| Shared content | `content/shared/**` changed | Deploy all pages referencing that shared file |
| Layout/asset/data/API | `layouts/**`, `assets/**`, `data/**`, `api-docs/**`, `openapi/**` changed | Deploy pages from PR-mentioned URLs, or prompt author |
| Mixed | Both content and layout/asset | Union of both strategies |
| Deletions only | Only file deletions, no additions/modifications | Skip preview |
| Deletions + other changes | Deletions mixed with other changes | Follow normal rules for the other changes |

### Storage Management

- Only changed HTML files are deployed per PR (not full 529MB site)
- Typical content PR: 5-50MB of affected pages
- `gh-pages` branch stays well under 1GB limit

## Handling Layout/Asset/API Changes

When layout, asset, data, or API files change, the entire site could be affected. Instead of deploying everything, we use a targeted approach.

### Step 1: Parse URLs from PR Description

The workflow scans the PR body for documentation URLs:

```javascript
const urlPatterns = [
  /https?:\/\/docs\.influxdata\.com(\/[^\s)]+)/g,  // Production URLs
  /https?:\/\/localhost:\d+(\/[^\s)]+)/g,          // Local dev URLs
  /(?:^|\s)(\/influxdb[^\s)]+)/gm,                 // Relative paths
];
```

### Step 2: If No URLs Found, Prompt the Author

Bot posts a comment:

> **Preview pages needed**
>
> This PR changes layout/asset files but doesn't specify which pages to preview. Please select pages to include in the preview:
>
> - [ ] `/influxdb3/core/` (InfluxDB 3 Core landing)
> - [ ] `/influxdb3/enterprise/` (InfluxDB 3 Enterprise landing)
> - [ ] `/telegraf/v1/` (Telegraf landing)
> - [ ] `/influxdb/cloud/` (InfluxDB Cloud landing)
>
> Or add URLs to your PR description and re-run the workflow.

### Step 3: Author Checks Boxes

The workflow watches for comment edits and extracts checked items to deploy.

## GitHub Actions Workflow

**File**: `.github/workflows/pr-preview.yml`

```yaml
name: PR Preview

on:
  pull_request:
    types: [opened, reopened, synchronize, closed]
    paths:
      - 'content/**'
      - 'layouts/**'
      - 'assets/**'
      - 'data/**'
      - 'api-docs/**'
      - 'openapi/**'

jobs:
  preview:
    if: github.event.pull_request.draft == false
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout & Setup
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for git diff

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - run: yarn install --frozen-lockfile

      # 2. Detect changes & determine pages to deploy
      - name: Detect changes
        id: changes
        run: node .github/scripts/detect-preview-pages.js
        # Outputs: pages-to-deploy, has-layout-changes, needs-author-input

      # 3. Prompt author if needed (layout changes, no URLs)
      - name: Request page selection
        if: steps.changes.outputs.needs-author-input == 'true'
        uses: actions/github-script@v7
        with:
          script: # Posts checkbox comment

      # 4. Build Hugo site
      - name: Build site
        if: steps.changes.outputs.pages-to-deploy != ''
        run: npx hugo --minify

      # 5. Deploy preview (selective files only)
      - name: Deploy preview
        if: steps.changes.outputs.pages-to-deploy != ''
        uses: rossjrw/pr-preview-action@v1
        with:
          source-dir: ./preview-staging
          # Custom script copies only affected files to preview-staging/
```

## Selective File Deployment

The PR Preview Action deploys an entire directory. To deploy only changed files, we create a staging directory with just the affected pages.

**Script**: `.github/scripts/prepare-preview-files.js`

```javascript
import { cpSync, mkdirSync } from 'fs';
import { dirname } from 'path';

function preparePreviewFiles(pagesToDeploy, publicDir, stagingDir) {
  for (const htmlPath of pagesToDeploy) {
    const relativePath = htmlPath.replace(`${publicDir}/`, '');
    const destPath = `${stagingDir}/${relativePath}`;

    // Create directory structure
    mkdirSync(dirname(destPath), { recursive: true });

    // Copy the HTML file
    cpSync(htmlPath, destPath);
  }

  // Always include global assets (CSS, JS, fonts)
  cpSync(`${publicDir}/css`, `${stagingDir}/css`, { recursive: true });
  cpSync(`${publicDir}/js`, `${stagingDir}/js`, { recursive: true });
  cpSync(`${publicDir}/fonts`, `${stagingDir}/fonts`, { recursive: true });
}
```

**Output structure** (deployed to `gh-pages` branch):

```
pr-preview/
  pr-123/
    css/           # Global styles
    js/            # Global scripts
    fonts/         # Global fonts
    influxdb3/
      core/
        get-started/
          index.html
        admin/
          index.html
```

## Error Handling

### Build Failures

| Scenario | Handling |
|----------|----------|
| Hugo build fails | Post comment with error summary, link to workflow logs |
| Node/yarn install fails | Retry once, then fail with clear error |
| Deployment fails | Post comment, don't block PR merge |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| PR has only deletions | Skip preview, post comment: "No pages to preview (content removed)" |
| PR has deletions + other changes | Follow normal rules - deploy the changed/remaining pages |
| Shared content deleted | Find all referencing pages, deploy them to show breakage |
| Author never selects pages | Preview stays pending; doesn't block PR |
| Very large PR (100+ pages) | Deploy up to 50 pages, post warning about limit |
| Concurrent PRs exceed storage | Oldest previews auto-cleaned after 7 days |

### Workflow Status

- Preview deployment is **not** a required check (shouldn't block merge)
- Runs as informational status only

## PR Comment Format

**Sticky comment** (updated on each push, not duplicated):

```markdown
## PR Preview

| Status | Details |
|--------|---------|
| **Preview** | [View preview](https://influxdata.github.io/docs-v2/pr-preview/pr-123/) |
| **Pages** | 8 pages deployed |
| **Build time** | 1m 42s |
| **Last updated** | 2025-12-16 14:32 UTC |

<details>
<summary>Pages included in this preview</summary>

- `/influxdb3/core/get-started/`
- `/influxdb3/core/admin/databases/`
- `/influxdb3/core/admin/tokens/`

</details>

---
Preview auto-deploys on push. Will be cleaned up when PR closes.
```

### Comment States

| State | Message |
|-------|---------|
| Success | Preview ready with link and page list |
| Pending author input | Preview pending: Please select pages to preview |
| Build failed | Preview failed: Hugo build error (link to logs) |
| Skipped | Preview skipped: No previewable content changes detected |

## Cleanup & Storage Management

### Automatic Cleanup on PR Close

When a PR is closed or merged, the workflow removes the preview:

```yaml
cleanup:
  if: github.event.action == 'closed'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        ref: gh-pages

    - name: Remove preview directory
      run: |
        rm -rf pr-preview/pr-${{ github.event.number }}
        git add -A
        git commit -m "Clean up preview for PR #${{ github.event.number }}" || exit 0
        git push
```

### Stale Preview Cleanup

A scheduled workflow runs weekly to catch orphaned previews:

```yaml
name: Cleanup Stale Previews

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: gh-pages

      - name: Remove stale previews
        run: |
          # Find preview directories older than 14 days
          # Cross-reference with open PRs via GitHub API
          # Remove directories for closed/merged PRs
```

### Storage Budget

| Constraint | Limit | Target |
|------------|-------|--------|
| GitHub Pages soft limit | 1GB | Stay under 500MB |
| Max previews at once | ~10-15 (at 30-50MB each) | Typical: 5-8 open PRs |
| Preview retention | Until PR closes | Max 14 days for orphans |

## Implementation Summary

### Files to Create

| File | Purpose |
|------|---------|
| `.github/workflows/pr-preview.yml` | Main workflow orchestrating the preview |
| `.github/scripts/detect-preview-pages.js` | Determines which pages to deploy based on changes |
| `.github/scripts/prepare-preview-files.js` | Copies selected pages to staging directory |
| `.github/scripts/parse-pr-urls.js` | Extracts documentation URLs from PR description |
| `.github/scripts/post-preview-comment.js` | Manages the sticky PR comment |

### Existing Files to Reuse

| File | What it provides |
|------|------------------|
| `scripts/lib/content-utils.js` | `getChangedContentFiles()`, `expandSharedContentChanges()`, `mapContentToPublic()` |
| `.github/scripts/utils/url-transformer.js` | `filePathToUrl()` |

### Dependencies

Already in package.json:
- `gray-matter` - Frontmatter parsing
- `glob` - File pattern matching

GitHub Actions (no npm install):
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/github-script@v7`
- `rossjrw/pr-preview-action@v1`

### Configuration Required

1. **Repository Settings > Pages**: Set to "Deploy from branch" → `gh-pages`
2. **Repository Settings > Actions**: Enable "Read and write permissions"
3. **Existing deploy workflow** (if any): Add `clean-exclude: pr-preview/` to avoid deleting previews

## Related Links

- [PR Preview Action](https://github.com/rossjrw/pr-preview-action)
- [Existing content-utils.js](../scripts/lib/content-utils.js)
- [Existing pr-link-check workflow](../.github/workflows/pr-link-check.yml)
