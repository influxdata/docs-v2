/**
 * Detect Preview Pages
 *
 * Full-site PR previews deploy the entire built site, so this script no
 * longer decides whether a preview happens. It maps changed files (and any
 * URLs the author lists in the PR description) to a short list of "changed
 * page" links for the sticky PR comment, so reviewers get direct deep links
 * into the full preview instead of having to guess a path.
 *
 * Outputs (for GitHub Actions):
 * - changed-pages: JSON array of URL paths to link to from the PR comment
 * - change-summary: Human-readable summary of changes
 */

import { execSync } from 'child_process';
import { appendFileSync, existsSync, readFileSync } from 'fs';
import { extractDocsUrls } from './parse-pr-urls.js';
import {
  getChangedContentFiles,
  mapContentToPublic,
} from '../../scripts/lib/content-utils.js';

const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT || '/dev/stdout';
// Read PR body from file (fetched fresh from API) or fall back to env var
const PR_BODY_FILE = process.env.PR_BODY_FILE;
const PR_BODY =
  PR_BODY_FILE && existsSync(PR_BODY_FILE)
    ? readFileSync(PR_BODY_FILE, 'utf-8')
    : process.env.PR_BODY || '';
const BASE_REF = process.env.BASE_REF || 'origin/master';
const MAX_PAGES = 50; // Limit how many links the comment lists

// Validate BASE_REF to prevent command injection
// Allows branch names with letters, numbers, dots, underscores, hyphens, and slashes
if (!/^origin\/[a-zA-Z0-9._\/-]+$/.test(BASE_REF)) {
  console.error(`Invalid BASE_REF: ${BASE_REF}`);
  process.exit(1);
}

/**
 * Get all changed files in the PR
 * @returns {string[]} Array of changed file paths
 */
function getAllChangedFiles() {
  try {
    const output = execSync(`git diff --name-only ${BASE_REF}...HEAD`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
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
    content: files.filter((f) => f.startsWith('content/') && f.endsWith('.md')),
    layouts: files.filter((f) => f.startsWith('layouts/')),
    assets: files.filter((f) => f.startsWith('assets/')),
    data: files.filter((f) => f.startsWith('data/')),
    apiDocs: files.filter(
      (f) => f.startsWith('api-docs/') || f.startsWith('openapi/')
    ),
  };
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
  console.log('🔍 Detecting changed pages for the preview comment...\n');

  const allChangedFiles = getAllChangedFiles();
  const changes = categorizeChanges(allChangedFiles);

  console.log(`📁 Changed files breakdown:`);
  console.log(`   Content: ${changes.content.length}`);
  console.log(`   Layouts: ${changes.layouts.length}`);
  console.log(`   Assets: ${changes.assets.length}`);
  console.log(`   Data: ${changes.data.length}`);
  console.log(`   API Docs: ${changes.apiDocs.length}\n`);

  let changedPages = [];

  // Content changes map directly to the pages they affect.
  if (changes.content.length > 0) {
    console.log('📝 Processing content changes...');
    const expandedContent = getChangedContentFiles(BASE_REF, { verbose: true });
    const htmlPaths = mapContentToPublic(expandedContent, 'public');

    // Convert HTML paths to URL paths
    changedPages = Array.from(htmlPaths).map((htmlPath) => {
      return '/' + htmlPath.replace('public/', '').replace('/index.html', '/');
    });
    console.log(`   Found ${changedPages.length} affected pages\n`);
  }

  // Auto-add the home page when its template changes.
  if (changes.layouts.includes('layouts/index.html')) {
    changedPages = [...new Set([...changedPages, '/'])];
    console.log(
      '   🏠 Home page template (layouts/index.html) changed - auto-adding /'
    );
  }

  // Authors can list specific URLs in the PR description as extra deep links.
  const prUrls = extractDocsUrls(PR_BODY);
  if (prUrls.length > 0) {
    console.log(`   Found ${prUrls.length} URL(s) in PR description`);
    changedPages = [...new Set([...changedPages, ...prUrls])];
  }

  // Cap how many links the comment lists (the full site deploys regardless).
  if (changedPages.length > MAX_PAGES) {
    console.log(
      `⚠️  Limiting comment links to ${MAX_PAGES} (found ${changedPages.length})`
    );
    changedPages = changedPages.slice(0, MAX_PAGES);
  }

  const summary =
    changedPages.length > 0
      ? `${changedPages.length} page(s) changed`
      : 'No specific pages detected';

  console.log(`\n✅ ${summary}`);

  setOutput('changed-pages', JSON.stringify(changedPages));
  setOutput('change-summary', summary);
}

main();
