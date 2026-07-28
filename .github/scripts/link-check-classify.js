/**
 * Link Check Result Classifier
 * Reclassifies link-checker results before they reach CI's pass/fail logic:
 *
 *   1. "Cannot find file" warnings become errors (missing local files are
 *      genuinely broken links, but the checker reports them as warnings
 *      since they carry no HTTP status code).
 *   2. Errors whose URL matches an open `area:links` issue are downgraded
 *      to warnings, so a tracked, already-reported broken link doesn't
 *      block unrelated PRs.
 *
 * Usage: node link-check-classify.js <results.json> [known-issues.json]
 * Rewrites <results.json> in place.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';

const FILE_NOT_FOUND_PATTERN = /Cannot find file/;
// Characters that may legitimately follow a matched URL inside issue text;
// prevents 'https://a/b' from matching an occurrence of 'https://a/bc'.
const BOUNDARY_CHARS = new Set(['/', ')', '"', "'", '>', '`', ',']);

/**
 * Strip surrounding whitespace and a single trailing slash.
 * @param {string} url
 * @returns {string}
 */
export function normalizeUrl(url) {
  if (!url) return '';
  return url.trim().replace(/\/+$/, '');
}

/**
 * Check whether a normalized URL occurs in issue text at a word boundary.
 * @param {string} url - Broken link URL (will be normalized)
 * @param {string} issueText - Issue title + body
 * @returns {boolean}
 */
export function urlMatchesIssueText(url, issueText) {
  const needle = normalizeUrl(url);
  if (!needle || !issueText) return false;

  let fromIndex = 0;
  while (true) {
    const index = issueText.indexOf(needle, fromIndex);
    if (index === -1) return false;

    const nextChar = issueText[index + needle.length];
    const isBoundary =
      nextChar === undefined ||
      BOUNDARY_CHARS.has(nextChar) ||
      /\s/.test(nextChar);

    if (isBoundary) return true;
    fromIndex = index + 1;
  }
}

/**
 * Find the first known issue whose title/body mentions this URL.
 * @param {string} url
 * @param {Array<{number:number,title:string,text:string,url:string}>} knownIssues
 * @returns {{number:number,title:string,url:string}|null}
 */
export function matchKnownIssue(url, knownIssues) {
  if (!url || !Array.isArray(knownIssues)) return null;
  const match = knownIssues.find((issue) =>
    urlMatchesIssueText(url, issue.text)
  );
  if (!match) return null;
  return { number: match.number, title: match.title, url: match.url };
}

function recomputeSummary(results) {
  results.summary = results.summary || {};
  results.summary.error_count = results.errors.length;
  results.summary.warning_count = results.warnings.length;
  results.summary.known_issue_count = results.warnings.filter(
    (w) => w.knownIssue
  ).length;
}

/**
 * Move "Cannot find file" warnings into errors (port of the previous
 * inline jq reclassification).
 * @param {Object} results - Parsed link-check-results.json
 * @returns {Object} - New results object (input is not mutated)
 */
export function reclassifyFileNotFound(results) {
  const errors = [...(results.errors || [])];
  const warnings = [];

  for (const entry of results.warnings || []) {
    if (FILE_NOT_FOUND_PATTERN.test(entry.error || '')) {
      errors.push({ ...entry, severity: 'error' });
    } else {
      warnings.push(entry);
    }
  }

  const next = { ...results, errors, warnings };
  recomputeSummary(next);
  return next;
}

/**
 * Downgrade errors matching an open area:links issue to warnings.
 * @param {Object} results - Parsed link-check-results.json
 * @param {Array} knownIssues - Known issue records (see fetch-known-link-issues.js)
 * @returns {Object} - New results object (input is not mutated)
 */
export function applyKnownIssueDowngrade(results, knownIssues) {
  if (!Array.isArray(knownIssues) || knownIssues.length === 0) {
    return { ...results, warnings: [...(results.warnings || [])] };
  }

  const errors = [];
  const warnings = [...(results.warnings || [])];

  for (const entry of results.errors || []) {
    const knownIssue = matchKnownIssue(entry.url, knownIssues);
    if (knownIssue) {
      warnings.push({ ...entry, severity: 'warning', knownIssue });
    } else {
      errors.push(entry);
    }
  }

  const next = { ...results, errors, warnings };
  recomputeSummary(next);
  return next;
}

/**
 * Full classification pipeline: reclassify file-not-found, then downgrade
 * known issues (so a known internal broken link is downgradable too).
 * @param {Object} results
 * @param {Array} knownIssues
 * @returns {Object}
 */
export function classify(results, knownIssues) {
  return applyKnownIssueDowngrade(reclassifyFileNotFound(results), knownIssues);
}

function loadJson(path, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    console.warn(`Could not load ${path}: ${error.message}`);
    return fallback;
  }
}

function main() {
  const [resultsPath, knownIssuesPath] = process.argv.slice(2);

  if (!resultsPath) {
    console.error(
      'Usage: node link-check-classify.js <results.json> [known-issues.json]'
    );
    process.exit(1);
  }

  const results = loadJson(resultsPath, null);
  if (!results) {
    console.error(`No results to classify at ${resultsPath}`);
    process.exit(1);
  }

  const knownIssues = knownIssuesPath ? loadJson(knownIssuesPath, []) : [];
  const classified = classify(results, knownIssues);

  const downgraded = classified.warnings.filter((w) => w.knownIssue);
  for (const entry of downgraded) {
    console.log(
      `⤵ Downgraded (known issue #${entry.knownIssue.number}): ${entry.url}`
    );
  }

  fs.writeFileSync(resultsPath, JSON.stringify(classified, null, 2));
  console.log(
    `Classified: ${classified.errors.length} error(s), ${classified.warnings.length} warning(s), ` +
      `${downgraded.length} known issue(s)`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
