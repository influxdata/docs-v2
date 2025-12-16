# PR Preview System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy selective GitHub Pages previews for docs-v2 pull requests, showing only changed pages to save storage.

**Architecture:** Reuse existing `content-utils.js` for change detection. Build full Hugo site, then copy only affected pages to a staging directory. PR Preview Action deploys staging directory to `gh-pages` branch under `pr-preview/pr-{number}/`.

**Tech Stack:** Node.js (ES modules), GitHub Actions, Hugo, rossjrw/pr-preview-action

**Design Document:** `docs/plans/2025-12-16-pr-preview-design.md`

---

## Task 1: Create PR URL Parser Script

Parse documentation URLs from PR description to determine which pages to preview for layout/asset changes.

**Files:**
- Create: `.github/scripts/parse-pr-urls.js`

**Step 1: Create the script with URL extraction logic**

```javascript
/**
 * Parse Documentation URLs from PR Description
 * Extracts docs.influxdata.com URLs and relative paths from PR body text.
 * Used when layout/asset changes require author-specified preview pages.
 */

/**
 * Extract documentation URLs from text
 * @param {string} text - PR description or comment text
 * @returns {string[]} - Array of URL paths (e.g., ['/influxdb3/core/', '/telegraf/v1/'])
 */
export function extractDocsUrls(text) {
  if (!text) return [];

  const urls = new Set();

  // Pattern 1: Full production URLs
  // https://docs.influxdata.com/influxdb3/core/get-started/
  const prodUrlPattern = /https?:\/\/docs\.influxdata\.com(\/[^\s)\]>"']+)/g;
  let match;
  while ((match = prodUrlPattern.exec(text)) !== null) {
    urls.add(normalizeUrlPath(match[1]));
  }

  // Pattern 2: Localhost dev URLs
  // http://localhost:1313/influxdb3/core/
  const localUrlPattern = /https?:\/\/localhost:\d+(\/[^\s)\]>"']+)/g;
  while ((match = localUrlPattern.exec(text)) !== null) {
    urls.add(normalizeUrlPath(match[1]));
  }

  // Pattern 3: Relative paths starting with known product prefixes
  // /influxdb3/core/admin/ or /telegraf/v1/plugins/
  const relativePattern = /(?:^|\s)(\/(?:influxdb3|influxdb|telegraf|kapacitor|chronograf|flux|enterprise_influxdb)[^\s)\]>"']*)/gm;
  while ((match = relativePattern.exec(text)) !== null) {
    urls.add(normalizeUrlPath(match[1]));
  }

  return Array.from(urls);
}

/**
 * Normalize URL path to consistent format
 * @param {string} urlPath - URL path to normalize
 * @returns {string} - Normalized path with trailing slash
 */
function normalizeUrlPath(urlPath) {
  // Remove anchor fragments
  let normalized = urlPath.split('#')[0];
  // Remove query strings
  normalized = normalized.split('?')[0];
  // Ensure trailing slash
  if (!normalized.endsWith('/')) {
    normalized += '/';
  }
  return normalized;
}

/**
 * Convert URL paths to content file paths
 * @param {string[]} urlPaths - Array of URL paths
 * @returns {string[]} - Array of content file paths
 */
export function urlPathsToContentPaths(urlPaths) {
  return urlPaths.map(urlPath => {
    // Remove leading/trailing slashes and add content prefix
    const cleanPath = urlPath.replace(/^\/|\/$/g, '');
    return `content/${cleanPath}/_index.md`;
  });
}

// CLI execution
if (process.argv[1].endsWith('parse-pr-urls.js')) {
  const text = process.argv[2] || '';
  const urls = extractDocsUrls(text);
  console.log(JSON.stringify(urls, null, 2));
}
```

**Step 2: Test the script manually**

Run:
```bash
node .github/scripts/parse-pr-urls.js "Check these pages:
https://docs.influxdata.com/influxdb3/core/get-started/
/telegraf/v1/plugins/"
```

Expected output:
```json
[
  "/influxdb3/core/get-started/",
  "/telegraf/v1/plugins/"
]
```

**Step 3: Commit**

```bash
git add .github/scripts/parse-pr-urls.js
git commit -m "feat(ci): add PR URL parser for preview page detection"
```

---

## Task 2: Create Change Detection Script

Detect changed files and determine which pages need to be previewed.

**Files:**
- Create: `.github/scripts/detect-preview-pages.js`

**Step 1: Create the detection script**

```javascript
/**
 * Detect Preview Pages
 * Determines which pages should be included in PR preview based on changed files.
 *
 * Outputs (for GitHub Actions):
 * - pages-to-deploy: JSON array of URL paths to deploy
 * - has-layout-changes: 'true' if layout/asset/data changes detected
 * - needs-author-input: 'true' if author must select pages
 * - change-summary: Human-readable summary of changes
 */

import { execSync } from 'child_process';
import { appendFileSync, existsSync } from 'fs';
import { extractDocsUrls, urlPathsToContentPaths } from './parse-pr-urls.js';
import {
  getChangedContentFiles,
  mapContentToPublic,
} from '../../scripts/lib/content-utils.js';

const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT || '/dev/stdout';
const PR_BODY = process.env.PR_BODY || '';
const BASE_REF = process.env.BASE_REF || 'origin/master';
const MAX_PAGES = 50; // Limit to prevent storage bloat

/**
 * Get all changed files in the PR
 * @returns {string[]} Array of changed file paths
 */
function getAllChangedFiles() {
  try {
    const output = execSync(
      `git diff --name-only ${BASE_REF}...HEAD`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return output.trim().split('\n').filter(Boolean);
  } catch (err) {
    console.error(`Error detecting changes: ${err.message}`);
    return [];
  }
}

/**
 * Categorize changed files by type
 * @param {string[]} files - All changed files
 * @returns {Object} Categorized files
 */
function categorizeChanges(files) {
  return {
    content: files.filter(f => f.startsWith('content/') && f.endsWith('.md')),
    layouts: files.filter(f => f.startsWith('layouts/')),
    assets: files.filter(f => f.startsWith('assets/')),
    data: files.filter(f => f.startsWith('data/')),
    apiDocs: files.filter(f => f.startsWith('api-docs/') || f.startsWith('openapi/')),
  };
}

/**
 * Check if PR only contains deletions (no additions/modifications)
 * @returns {boolean}
 */
function isOnlyDeletions() {
  try {
    const output = execSync(
      `git diff --diff-filter=d --name-only ${BASE_REF}...HEAD`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    // If there are no non-deletion changes, this returns empty
    return output.trim() === '';
  } catch {
    return false;
  }
}

/**
 * Write output for GitHub Actions
 */
function setOutput(name, value) {
  const output = typeof value === 'string' ? value : JSON.stringify(value);
  appendFileSync(GITHUB_OUTPUT, `${name}=${output}\n`);
  console.log(`::set-output name=${name}::${output}`);
}

// Main execution
function main() {
  console.log('🔍 Detecting changes for PR preview...\n');

  // Check for deletions-only PR
  if (isOnlyDeletions()) {
    console.log('📭 PR contains only deletions - skipping preview');
    setOutput('pages-to-deploy', '[]');
    setOutput('has-layout-changes', 'false');
    setOutput('needs-author-input', 'false');
    setOutput('change-summary', 'No pages to preview (content removed)');
    setOutput('skip-reason', 'deletions-only');
    return;
  }

  const allChangedFiles = getAllChangedFiles();
  const changes = categorizeChanges(allChangedFiles);

  console.log(`📁 Changed files breakdown:`);
  console.log(`   Content: ${changes.content.length}`);
  console.log(`   Layouts: ${changes.layouts.length}`);
  console.log(`   Assets: ${changes.assets.length}`);
  console.log(`   Data: ${changes.data.length}`);
  console.log(`   API Docs: ${changes.apiDocs.length}\n`);

  const hasLayoutChanges =
    changes.layouts.length > 0 ||
    changes.assets.length > 0 ||
    changes.data.length > 0 ||
    changes.apiDocs.length > 0;

  let pagesToDeploy = [];

  // Strategy 1: Content-only changes - use existing change detection
  if (changes.content.length > 0) {
    console.log('📝 Processing content changes...');
    const expandedContent = getChangedContentFiles(BASE_REF, { verbose: true });
    const htmlPaths = mapContentToPublic(expandedContent, 'public');

    // Convert HTML paths to URL paths
    pagesToDeploy = Array.from(htmlPaths).map(htmlPath => {
      return '/' + htmlPath.replace('public/', '').replace('/index.html', '/');
    });
    console.log(`   Found ${pagesToDeploy.length} affected pages\n`);
  }

  // Strategy 2: Layout/asset changes - parse URLs from PR body
  if (hasLayoutChanges) {
    console.log('🎨 Layout/asset changes detected, checking PR description for URLs...');
    const prUrls = extractDocsUrls(PR_BODY);

    if (prUrls.length > 0) {
      console.log(`   Found ${prUrls.length} URLs in PR description`);
      // Merge with content pages (deduplicate)
      pagesToDeploy = [...new Set([...pagesToDeploy, ...prUrls])];
    } else if (changes.content.length === 0) {
      // No content changes AND no URLs specified - need author input
      console.log('   ⚠️  No URLs found in PR description - author input needed');
      setOutput('pages-to-deploy', '[]');
      setOutput('has-layout-changes', 'true');
      setOutput('needs-author-input', 'true');
      setOutput('change-summary', 'Layout/asset changes detected - please specify pages to preview');
      return;
    }
  }

  // Apply page limit
  if (pagesToDeploy.length > MAX_PAGES) {
    console.log(`⚠️  Limiting preview to ${MAX_PAGES} pages (found ${pagesToDeploy.length})`);
    pagesToDeploy = pagesToDeploy.slice(0, MAX_PAGES);
  }

  // Generate summary
  const summary = pagesToDeploy.length > 0
    ? `${pagesToDeploy.length} page(s) will be previewed`
    : 'No pages to preview';

  console.log(`\n✅ ${summary}`);

  setOutput('pages-to-deploy', JSON.stringify(pagesToDeploy));
  setOutput('has-layout-changes', String(hasLayoutChanges));
  setOutput('needs-author-input', 'false');
  setOutput('change-summary', summary);
}

main();
```

**Step 2: Test the script locally**

Run:
```bash
# Set up test environment
export BASE_REF="origin/master"
export PR_BODY="Please review /influxdb3/core/get-started/"
export GITHUB_OUTPUT="/tmp/github-output.txt"

# Run detection
node .github/scripts/detect-preview-pages.js

# Check outputs
cat /tmp/github-output.txt
```

**Step 3: Commit**

```bash
git add .github/scripts/detect-preview-pages.js
git commit -m "feat(ci): add change detection script for PR previews"
```

---

## Task 3: Create Preview File Staging Script

Copy only affected pages to a staging directory for selective deployment.

**Files:**
- Create: `.github/scripts/prepare-preview-files.js`

**Step 1: Create the staging script**

```javascript
/**
 * Prepare Preview Files
 * Copies selected pages and required assets to a staging directory for deployment.
 *
 * Usage: node prepare-preview-files.js <pages-json> <public-dir> <staging-dir>
 * Example: node prepare-preview-files.js '["/influxdb3/core/"]' public preview-staging
 */

import { cpSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';

const GLOBAL_ASSETS = ['css', 'js', 'fonts', 'img', 'favicons'];

/**
 * Copy a file or directory, creating parent directories as needed
 * @param {string} src - Source path
 * @param {string} dest - Destination path
 */
function safeCopy(src, dest) {
  if (!existsSync(src)) {
    console.log(`  ⚠️  Skipping missing: ${src}`);
    return false;
  }

  mkdirSync(dirname(dest), { recursive: true });

  const stat = statSync(src);
  if (stat.isDirectory()) {
    cpSync(src, dest, { recursive: true });
  } else {
    cpSync(src, dest);
  }
  return true;
}

/**
 * Convert URL path to public HTML path
 * @param {string} urlPath - URL path (e.g., '/influxdb3/core/')
 * @param {string} publicDir - Public directory
 * @returns {string} - HTML file path
 */
function urlToHtmlPath(urlPath, publicDir) {
  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  return join(publicDir, cleanPath, 'index.html');
}

/**
 * Copy page and its local assets
 * @param {string} urlPath - URL path to copy
 * @param {string} publicDir - Source public directory
 * @param {string} stagingDir - Target staging directory
 */
function copyPage(urlPath, publicDir, stagingDir) {
  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  const srcDir = join(publicDir, cleanPath);
  const destDir = join(stagingDir, cleanPath);

  // Copy the index.html
  const htmlSrc = join(srcDir, 'index.html');
  const htmlDest = join(destDir, 'index.html');

  if (safeCopy(htmlSrc, htmlDest)) {
    console.log(`  ✓ ${urlPath}`);
  }

  // Copy any local assets in the same directory (images, etc.)
  if (existsSync(srcDir)) {
    const files = readdirSync(srcDir);
    for (const file of files) {
      if (file === 'index.html') continue;
      const filePath = join(srcDir, file);
      const stat = statSync(filePath);
      if (!stat.isDirectory()) {
        safeCopy(filePath, join(destDir, file));
      }
    }
  }
}

/**
 * Main function to prepare preview files
 * @param {string[]} pages - Array of URL paths to deploy
 * @param {string} publicDir - Hugo public output directory
 * @param {string} stagingDir - Staging directory for preview
 */
function preparePreviewFiles(pages, publicDir, stagingDir) {
  console.log(`\n📦 Preparing preview files...`);
  console.log(`   Source: ${publicDir}`);
  console.log(`   Target: ${stagingDir}`);
  console.log(`   Pages: ${pages.length}\n`);

  // Create staging directory
  mkdirSync(stagingDir, { recursive: true });

  // Copy global assets first
  console.log('📁 Copying global assets...');
  for (const asset of GLOBAL_ASSETS) {
    const src = join(publicDir, asset);
    const dest = join(stagingDir, asset);
    if (safeCopy(src, dest)) {
      console.log(`  ✓ ${asset}/`);
    }
  }

  // Copy selected pages
  console.log('\n📄 Copying pages...');
  let copiedCount = 0;
  for (const page of pages) {
    copyPage(page, publicDir, stagingDir);
    copiedCount++;
  }

  console.log(`\n✅ Prepared ${copiedCount} pages for preview`);
}

// CLI execution
if (process.argv[1].endsWith('prepare-preview-files.js')) {
  const pagesJson = process.argv[2];
  const publicDir = process.argv[3] || 'public';
  const stagingDir = process.argv[4] || 'preview-staging';

  if (!pagesJson) {
    console.error('Usage: node prepare-preview-files.js <pages-json> [public-dir] [staging-dir]');
    process.exit(1);
  }

  try {
    const pages = JSON.parse(pagesJson);
    preparePreviewFiles(pages, publicDir, stagingDir);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

export { preparePreviewFiles, urlToHtmlPath };
```

**Step 2: Test locally (requires Hugo build)**

Run:
```bash
# Build Hugo first (if not already built)
npx hugo --quiet

# Test the staging script
node .github/scripts/prepare-preview-files.js \
  '["/influxdb3/core/", "/influxdb3/core/get-started/"]' \
  public \
  /tmp/preview-staging

# Verify output
ls -la /tmp/preview-staging/
ls -la /tmp/preview-staging/influxdb3/core/
```

**Step 3: Commit**

```bash
git add .github/scripts/prepare-preview-files.js
git commit -m "feat(ci): add preview file staging script for selective deployment"
```

---

## Task 4: Create Preview Comment Manager

Manage the sticky PR comment that shows preview status and links.

**Files:**
- Create: `.github/scripts/preview-comment.js`

**Step 1: Create the comment manager script**

```javascript
/**
 * Preview Comment Manager
 * Creates and updates sticky PR comments for preview status.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 */

const COMMENT_MARKER = '<!-- pr-preview-comment -->';

/**
 * Generate preview comment body
 * @param {Object} options - Comment options
 * @returns {string} - Markdown comment body
 */
export function generatePreviewComment(options) {
  const {
    status,           // 'success' | 'pending' | 'failed' | 'skipped'
    previewUrl,       // Preview URL (for success)
    pages,            // Array of page URLs (for success)
    buildTime,        // Build duration string (for success)
    errorMessage,     // Error message (for failed)
    skipReason,       // Skip reason (for skipped)
    needsInput,       // Boolean (for pending)
    prNumber,
  } = options;

  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC';

  let body = `${COMMENT_MARKER}\n## PR Preview\n\n`;

  switch (status) {
    case 'success':
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Preview** | [View preview](${previewUrl}) |\n`;
      body += `| **Pages** | ${pages.length} page(s) deployed |\n`;
      if (buildTime) {
        body += `| **Build time** | ${buildTime} |\n`;
      }
      body += `| **Last updated** | ${timestamp} |\n\n`;

      if (pages.length > 0) {
        body += `<details>\n<summary>Pages included in this preview</summary>\n\n`;
        const displayPages = pages.slice(0, 20);
        displayPages.forEach(page => {
          body += `- \`${page}\`\n`;
        });
        if (pages.length > 20) {
          body += `- ... and ${pages.length - 20} more\n`;
        }
        body += `\n</details>\n\n`;
      }
      body += `---\n<sub>Preview auto-deploys on push. Will be cleaned up when PR closes.</sub>`;
      break;

    case 'pending':
      if (needsInput) {
        body += `### Preview pages needed\n\n`;
        body += `This PR changes layout/asset files but doesn't specify which pages to preview.\n\n`;
        body += `**To generate a preview**, add documentation URLs to your PR description, for example:\n`;
        body += `\`\`\`\nPlease review:\n- https://docs.influxdata.com/influxdb3/core/get-started/\n- /telegraf/v1/plugins/\n\`\`\`\n\n`;
        body += `Then re-run the workflow or push a new commit.\n\n`;
        body += `---\n<sub>Last checked: ${timestamp}</sub>`;
      } else {
        body += `⏳ **Preview building...**\n\n`;
        body += `---\n<sub>Started: ${timestamp}</sub>`;
      }
      break;

    case 'failed':
      body += `### Preview failed\n\n`;
      body += `The preview build encountered an error:\n\n`;
      body += `\`\`\`\n${errorMessage || 'Unknown error'}\n\`\`\`\n\n`;
      body += `[View workflow logs](https://github.com/influxdata/docs-v2/actions)\n\n`;
      body += `---\n<sub>Failed: ${timestamp}</sub>`;
      break;

    case 'skipped':
      body += `### Preview skipped\n\n`;
      body += `${skipReason || 'No previewable changes detected.'}\n\n`;
      body += `---\n<sub>Checked: ${timestamp}</sub>`;
      break;
  }

  return body;
}

/**
 * Find existing preview comment on PR
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @returns {Object|null} - Existing comment or null
 */
export async function findExistingComment(github, context) {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  return comments.find(comment => comment.body.includes(COMMENT_MARKER));
}

/**
 * Create or update preview comment
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {Object} options - Comment options
 */
export async function upsertPreviewComment(github, context, options) {
  const body = generatePreviewComment(options);
  const existingComment = await findExistingComment(github, context);

  if (existingComment) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
      body,
    });
    console.log(`Updated existing comment: ${existingComment.id}`);
  } else {
    const { data: newComment } = await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body,
    });
    console.log(`Created new comment: ${newComment.id}`);
  }
}

/**
 * Delete preview comment (used on PR close)
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 */
export async function deletePreviewComment(github, context) {
  const existingComment = await findExistingComment(github, context);

  if (existingComment) {
    await github.rest.issues.deleteComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
    });
    console.log(`Deleted comment: ${existingComment.id}`);
  }
}
```

**Step 2: Test comment generation locally**

Run:
```bash
node -e "
import { generatePreviewComment } from './.github/scripts/preview-comment.js';
console.log(generatePreviewComment({
  status: 'success',
  previewUrl: 'https://influxdata.github.io/docs-v2/pr-preview/pr-123/',
  pages: ['/influxdb3/core/', '/influxdb3/core/get-started/'],
  buildTime: '1m 42s',
  prNumber: 123
}));
"
```

**Step 3: Commit**

```bash
git add .github/scripts/preview-comment.js
git commit -m "feat(ci): add preview comment manager for sticky PR comments"
```

---

## Task 5: Create Main PR Preview Workflow

Create the GitHub Actions workflow that orchestrates the preview process.

**Files:**
- Create: `.github/workflows/pr-preview.yml`

**Step 1: Create the workflow file**

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

concurrency:
  group: pr-preview-${{ github.event.number }}
  cancel-in-progress: true

jobs:
  # Skip draft PRs entirely
  check-draft:
    runs-on: ubuntu-latest
    outputs:
      should-run: ${{ steps.check.outputs.should-run }}
    steps:
      - id: check
        run: |
          if [[ "${{ github.event.pull_request.draft }}" == "true" ]]; then
            echo "should-run=false" >> $GITHUB_OUTPUT
            echo "Skipping draft PR"
          else
            echo "should-run=true" >> $GITHUB_OUTPUT
          fi

  # Build and deploy preview
  preview:
    needs: check-draft
    if: |
      needs.check-draft.outputs.should-run == 'true' &&
      github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Detect preview pages
        id: detect
        env:
          PR_BODY: ${{ github.event.pull_request.body }}
          BASE_REF: origin/${{ github.base_ref }}
          GITHUB_OUTPUT: ${{ github.output }}
        run: node .github/scripts/detect-preview-pages.js

      - name: Post pending comment (needs input)
        if: steps.detect.outputs.needs-author-input == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const { upsertPreviewComment } = await import('${{ github.workspace }}/.github/scripts/preview-comment.js');
            await upsertPreviewComment(github, context, {
              status: 'pending',
              needsInput: true,
              prNumber: context.issue.number
            });

      - name: Skip if no pages to deploy
        if: steps.detect.outputs.pages-to-deploy == '[]'
        run: |
          echo "No pages to deploy - skipping preview"
          echo "Reason: ${{ steps.detect.outputs.skip-reason || steps.detect.outputs.change-summary }}"

      - name: Build Hugo site
        if: steps.detect.outputs.pages-to-deploy != '[]'
        id: build
        run: |
          START_TIME=$(date +%s)
          npx hugo --minify
          END_TIME=$(date +%s)
          DURATION=$((END_TIME - START_TIME))
          echo "build-time=${DURATION}s" >> $GITHUB_OUTPUT

      - name: Prepare preview files
        if: steps.detect.outputs.pages-to-deploy != '[]'
        run: |
          node .github/scripts/prepare-preview-files.js \
            '${{ steps.detect.outputs.pages-to-deploy }}' \
            public \
            preview-staging

      - name: Deploy preview
        if: steps.detect.outputs.pages-to-deploy != '[]'
        uses: rossjrw/pr-preview-action@v1
        with:
          source-dir: ./preview-staging
          preview-branch: gh-pages
          umbrella-dir: pr-preview
          action: deploy

      - name: Post success comment
        if: steps.detect.outputs.pages-to-deploy != '[]'
        uses: actions/github-script@v7
        with:
          script: |
            const { upsertPreviewComment } = await import('${{ github.workspace }}/.github/scripts/preview-comment.js');
            const pages = JSON.parse('${{ steps.detect.outputs.pages-to-deploy }}');
            const previewUrl = `https://influxdata.github.io/docs-v2/pr-preview/pr-${{ github.event.number }}/`;
            await upsertPreviewComment(github, context, {
              status: 'success',
              previewUrl,
              pages,
              buildTime: '${{ steps.build.outputs.build-time }}',
              prNumber: context.issue.number
            });

      - name: Post skipped comment
        if: steps.detect.outputs.pages-to-deploy == '[]' && steps.detect.outputs.needs-author-input != 'true'
        uses: actions/github-script@v7
        with:
          script: |
            const { upsertPreviewComment } = await import('${{ github.workspace }}/.github/scripts/preview-comment.js');
            await upsertPreviewComment(github, context, {
              status: 'skipped',
              skipReason: '${{ steps.detect.outputs.change-summary }}',
              prNumber: context.issue.number
            });

  # Cleanup on PR close
  cleanup:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gh-pages
        uses: actions/checkout@v4
        with:
          ref: gh-pages

      - name: Remove preview directory
        run: |
          PREVIEW_DIR="pr-preview/pr-${{ github.event.number }}"
          if [ -d "$PREVIEW_DIR" ]; then
            rm -rf "$PREVIEW_DIR"
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add -A
            git commit -m "Clean up preview for PR #${{ github.event.number }}" || echo "Nothing to commit"
            git push
            echo "Cleaned up $PREVIEW_DIR"
          else
            echo "No preview directory found for PR #${{ github.event.number }}"
          fi

      - name: Delete preview comment
        uses: actions/github-script@v7
        with:
          script: |
            const { deletePreviewComment } = await import('${{ github.workspace }}/.github/scripts/preview-comment.js');
            await deletePreviewComment(github, context);
```

**Step 2: Validate workflow syntax**

Run:
```bash
# Check YAML syntax
npx yaml-lint .github/workflows/pr-preview.yml || echo "Install: npm install -g yaml-lint"

# Or use GitHub's workflow validator (requires gh CLI)
gh workflow view pr-preview.yml 2>&1 || echo "Workflow not yet pushed"
```

**Step 3: Commit**

```bash
git add .github/workflows/pr-preview.yml
git commit -m "feat(ci): add PR preview workflow for GitHub Pages deployment"
```

---

## Task 6: Create Stale Preview Cleanup Workflow

Weekly cleanup for orphaned previews.

**Files:**
- Create: `.github/workflows/cleanup-stale-previews.yml`

**Step 1: Create the cleanup workflow**

```yaml
name: Cleanup Stale Previews

on:
  schedule:
    # Run every Sunday at midnight UTC
    - cron: '0 0 * * 0'
  workflow_dispatch: # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gh-pages
        uses: actions/checkout@v4
        with:
          ref: gh-pages
        continue-on-error: true

      - name: Check if gh-pages exists
        id: check-branch
        run: |
          if [ -d "pr-preview" ]; then
            echo "has-previews=true" >> $GITHUB_OUTPUT
          else
            echo "has-previews=false" >> $GITHUB_OUTPUT
            echo "No pr-preview directory found"
          fi

      - name: Get open PR numbers
        if: steps.check-branch.outputs.has-previews == 'true'
        id: open-prs
        uses: actions/github-script@v7
        with:
          script: |
            const { data: prs } = await github.rest.pulls.list({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open'
            });
            const prNumbers = prs.map(pr => pr.number);
            core.setOutput('numbers', JSON.stringify(prNumbers));
            console.log(`Open PRs: ${prNumbers.join(', ')}`);

      - name: Remove stale previews
        if: steps.check-branch.outputs.has-previews == 'true'
        run: |
          OPEN_PRS='${{ steps.open-prs.outputs.numbers }}'
          REMOVED=0

          for dir in pr-preview/pr-*/; do
            if [ -d "$dir" ]; then
              PR_NUM=$(echo "$dir" | grep -oP 'pr-\K\d+')

              # Check if PR is still open
              if ! echo "$OPEN_PRS" | grep -q "\"$PR_NUM\""; then
                echo "Removing stale preview: $dir (PR #$PR_NUM is closed)"
                rm -rf "$dir"
                REMOVED=$((REMOVED + 1))
              else
                echo "Keeping preview: $dir (PR #$PR_NUM is open)"
              fi
            fi
          done

          if [ $REMOVED -gt 0 ]; then
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add -A
            git commit -m "chore: clean up $REMOVED stale preview(s)"
            git push
            echo "Cleaned up $REMOVED stale previews"
          else
            echo "No stale previews to clean up"
          fi

      - name: Report cleanup summary
        if: always()
        run: |
          echo "## Stale Preview Cleanup Summary" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          if [ -d "pr-preview" ]; then
            REMAINING=$(ls -d pr-preview/pr-*/ 2>/dev/null | wc -l || echo "0")
            echo "Remaining previews: $REMAINING" >> $GITHUB_STEP_SUMMARY
          else
            echo "No preview directory exists" >> $GITHUB_STEP_SUMMARY
          fi
```

**Step 2: Commit**

```bash
git add .github/workflows/cleanup-stale-previews.yml
git commit -m "feat(ci): add weekly stale preview cleanup workflow"
```

---

## Task 7: Update Repository Settings Documentation

Document the required repository settings.

**Files:**
- Modify: `docs/plans/2025-12-16-pr-preview-design.md` (add setup section)
- Create: `.github/PREVIEW_SETUP.md`

**Step 1: Create setup documentation**

```markdown
# PR Preview Setup Guide

This document describes the repository settings required for PR previews to work.

## Required Repository Settings

### 1. GitHub Pages Configuration

Go to **Settings > Pages** and configure:

- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `/ (root)`

The `gh-pages` branch will be created automatically on the first preview deployment.

### 2. Actions Permissions

Go to **Settings > Actions > General** and configure:

- **Workflow permissions**: Read and write permissions
- **Allow GitHub Actions to create and approve pull requests**: ✓ (checked)

### 3. Branch Protection (Optional)

If you have branch protection on `gh-pages`, ensure GitHub Actions can push:

- Allow force pushes: GitHub Actions
- Or add a bypass for the `github-actions[bot]` user

## How It Works

1. When a PR is opened/updated with changes to `content/`, `layouts/`, `assets/`, `data/`, `api-docs/`, or `openapi/`:
   - The workflow detects which pages are affected
   - Hugo builds the full site
   - Only affected pages are copied to a staging directory
   - The staging directory is deployed to `gh-pages` under `pr-preview/pr-{number}/`

2. A sticky comment is posted on the PR with the preview link

3. When the PR is closed/merged:
   - The preview directory is removed from `gh-pages`
   - The PR comment is deleted

4. Weekly cleanup removes any orphaned previews

## Preview URL Format

```
https://influxdata.github.io/docs-v2/pr-preview/pr-{number}/
```

## Troubleshooting

### Preview not deploying

1. Check if the PR is a draft (drafts don't get previews)
2. Check if the changed files match the trigger paths
3. Check the workflow run logs for errors

### Preview shows 404

1. The page might not be included in the preview (check PR comment for page list)
2. The preview might still be deploying (wait a few minutes)
3. GitHub Pages might have caching (try hard refresh)

### Cleanup not working

1. Check if the `gh-pages` branch exists
2. Verify Actions have write permissions
3. Run the cleanup workflow manually via Actions tab
```

**Step 2: Commit**

```bash
git add .github/PREVIEW_SETUP.md
git commit -m "docs(ci): add PR preview setup guide"
```

---

## Task 8: Test the Complete Workflow

End-to-end test of the preview system.

**Step 1: Push all changes to the branch**

```bash
git push origin ci-pr-preview
```

**Step 2: Create a test PR**

```bash
# Create a small content change for testing
echo "" >> content/influxdb3/core/_index.md
git add content/influxdb3/core/_index.md
git commit -m "test: trigger PR preview workflow"
git push origin ci-pr-preview
```

**Step 3: Open PR via GitHub UI or CLI**

```bash
gh pr create \
  --title "feat(ci): add PR preview system" \
  --body "## Summary
This PR adds automatic GitHub Pages previews for documentation PRs.

## Test pages
- https://docs.influxdata.com/influxdb3/core/
- /influxdb3/core/get-started/

## Changes
- Added PR preview workflow
- Added change detection scripts
- Added preview comment manager
- Added cleanup workflows"
```

**Step 4: Verify the workflow**

1. Check Actions tab - workflow should trigger
2. Wait for build to complete (~2-3 minutes)
3. Check PR for preview comment with link
4. Click preview link and verify pages render

**Step 5: Verify cleanup**

1. Close the PR (without merging)
2. Check that cleanup job runs
3. Verify preview directory is removed from `gh-pages`

---

## Summary

| Task | Files | Purpose |
|------|-------|---------|
| 1 | `.github/scripts/parse-pr-urls.js` | Extract URLs from PR description |
| 2 | `.github/scripts/detect-preview-pages.js` | Determine which pages to preview |
| 3 | `.github/scripts/prepare-preview-files.js` | Stage files for selective deployment |
| 4 | `.github/scripts/preview-comment.js` | Manage sticky PR comments |
| 5 | `.github/workflows/pr-preview.yml` | Main preview workflow |
| 6 | `.github/workflows/cleanup-stale-previews.yml` | Weekly orphan cleanup |
| 7 | `.github/PREVIEW_SETUP.md` | Setup documentation |
| 8 | (testing) | End-to-end verification |

**Estimated total implementation time**: 2-3 hours

**Dependencies on existing code**:
- `scripts/lib/content-utils.js` - Change detection (no modifications needed)
- `rossjrw/pr-preview-action@v1` - GitHub Action for deployment
