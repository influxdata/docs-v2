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
import { extractDocsUrls } from './parse-pr-urls.js';
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
