/**
 * Resolve Review URLs
 *
 * Maps changed content files to URL paths for the doc-review workflow.
 * Reuses the same content-utils functions as detect-preview-pages.js.
 *
 * Outputs (for GitHub Actions):
 * - urls: JSON array of URL paths
 * - url-count: Number of URLs
 * - skipped: Boolean indicating if review was skipped
 * - skip-reason: Reason for skipping (if applicable)
 */

import { appendFileSync } from 'fs';
import { execSync } from 'child_process';
import {
  getChangedContentFiles,
  mapContentToPublic,
} from '../../scripts/lib/content-utils.js';

const GITHUB_OUTPUT = process.env.GITHUB_OUTPUT || '/dev/stdout';
const BASE_REF = process.env.BASE_REF || 'origin/master';
const MAX_PAGES = 50;

if (!/^origin\/[a-zA-Z0-9._/-]+$/.test(BASE_REF)) {
  console.error(`Invalid BASE_REF: ${BASE_REF}`);
  process.exit(1);
}

const changed = getChangedContentFiles(BASE_REF);
const htmlPaths = mapContentToPublic(changed, 'public');

const contentUrls = Array.from(htmlPaths)
  .sort()
  .map((p) => '/' + p.replace(/^public\//, '').replace(/\/index\.html$/, '/'))
  .slice(0, MAX_PAGES);

// Check if the home page template changed (layouts/index.html → /)
let homePageUrls = [];
try {
  const homePageChanged = execSync(
    `git diff --name-only ${BASE_REF}...HEAD -- layouts/index.html`,
    { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
  ).trim();
  if (homePageChanged) {
    homePageUrls = ['/'];
    console.log(
      'Home page template (layouts/index.html) changed - adding / to review URLs'
    );
  }
} catch {
  // Ignore errors - fall back to content-only URLs
}

const urls = [...new Set([...homePageUrls, ...contentUrls])].slice(
  0,
  MAX_PAGES
);

appendFileSync(GITHUB_OUTPUT, `urls=${JSON.stringify(urls)}\n`);
appendFileSync(GITHUB_OUTPUT, `url-count=${urls.length}\n`);

// Output skip status for downstream jobs
if (urls.length === 0) {
  appendFileSync(GITHUB_OUTPUT, `skipped=true\n`);
  const skipReason =
    changed.length === 0
      ? 'No content files changed in this PR'
      : 'Changed files do not map to previewable URLs';
  appendFileSync(GITHUB_OUTPUT, `skip-reason=${skipReason}\n`);
  console.log(`Visual review skipped: ${skipReason}`);
} else {
  appendFileSync(GITHUB_OUTPUT, `skipped=false\n`);
}

console.log(`Detected ${urls.length} preview URLs`);
