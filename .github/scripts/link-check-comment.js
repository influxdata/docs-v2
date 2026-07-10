/**
 * Link Check Comment Manager
 * Creates and updates sticky PR comments for link check results.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 * (see .github/workflows/pr-link-check.yml), or locally:
 *
 *   node .github/scripts/link-check-comment.js <results.json> [status]
 */

import fs from 'fs';
import { fileURLToPath } from 'url';

export const COMMENT_MARKER = '<!-- link-check-comment -->';

// GitHub caps comment bodies at 65536 characters
const MAX_COMMENT_LENGTH = 65000;
const MAX_ERRORS_SHOWN = 50;
const MAX_ERRORS_SHOWN_TRUNCATED = 20;
const MAX_WARNINGS_SHOWN = 20;
const MAX_URL_LENGTH = 100;
const MAX_ERROR_LENGTH = 80;

const REPORT_TEMPLATE = 'broken-link.yml';
const REPORT_REPO = 'influxdata/docs-v2';
const MAX_REPORT_URL_LENGTH = 400;
const MAX_REPORT_FIELD_LENGTH = 150;

/**
 * Map a built public HTML path back to its content source path.
 * Mirrors the sed mapping used for workflow annotations: strip everything
 * through ".../public/", prefix "content/", and rewrite a trailing
 * "/index.html" to "/_index.md".
 * @param {string} publicPath - Path to a file under public/
 * @returns {string} - Best-effort content/ path
 */
export function mapPublicToContentPath(publicPath) {
  if (!publicPath) return 'unknown';
  return publicPath
    .replace(/.*\/public\//, 'content/')
    .replace(/\/index\.html$/, '/_index.md');
}

/**
 * Escape and truncate text for a Markdown table cell
 * @param {string} text - Cell text
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Safe single-line cell text
 */
export function escapeTableCell(text, maxLength = MAX_ERROR_LENGTH) {
  if (!text) return '';
  const singleLine = String(text)
    .replace(/\s*\n\s*/g, ' ')
    .trim();
  const escaped = singleLine.replace(/\|/g, '\\|');
  if (escaped.length <= maxLength) return escaped;
  return `${escaped.substring(0, maxLength)}…`;
}

/**
 * Load and normalize link-check-results.json
 * @param {string} resultsPath - Path to the results JSON file
 * @returns {Object} - { status?, errors, warnings, totalLinks, errorCount,
 *   warningCount, knownIssueCount, successRate }; status 'error' when the
 *   file is missing or unreadable
 */
export function loadResults(resultsPath) {
  try {
    const raw = fs.readFileSync(resultsPath, 'utf8');
    const data = JSON.parse(raw);
    const summary = data.summary || {};
    return {
      errors: Array.isArray(data.errors) ? data.errors : [],
      warnings: Array.isArray(data.warnings) ? data.warnings : [],
      totalLinks: summary.total_checked ?? 0,
      errorCount: summary.error_count ?? 0,
      warningCount: summary.warning_count ?? 0,
      knownIssueCount: summary.known_issue_count ?? 0,
      successRate: summary.success_rate ?? 0,
    };
  } catch (error) {
    console.warn(`Could not load ${resultsPath}: ${error.message}`);
    return {
      status: 'error',
      errors: [],
      warnings: [],
      totalLinks: 0,
      errorCount: 0,
      warningCount: 0,
      knownIssueCount: 0,
      successRate: 0,
    };
  }
}

/**
 * Build a prefilled new-issue URL for an unmatched broken link, using the
 * broken-link.yml issue form. Field ids double as the query param names
 * GitHub uses to prefill issue-form fields.
 * @param {{url:string, error:string, file:string}} entry
 * @param {number|string} [prNumber] - PR number the link was found on
 * @returns {string}
 */
function buildReportUrl(
  url,
  errorStatus,
  sourcePages,
  context,
  includeSourcePages
) {
  const fields = {
    template: REPORT_TEMPLATE,
    title: `Broken link: ${url}`,
    'broken-url': url,
    'error-status': errorStatus,
    context,
  };
  if (includeSourcePages) fields['source-pages'] = sourcePages;

  const params = new URLSearchParams(fields);
  return `https://github.com/${REPORT_REPO}/issues/new?${params.toString()}`;
}

export function generateReportUrl(entry, prNumber) {
  const sourcePages = mapPublicToContentPath(entry.file);
  const context = prNumber
    ? `Found by link-checker on PR #${prNumber}`
    : 'Found by link-checker';

  // The URL appears twice (title + broken-url), so shrink progressively:
  // full fields -> drop source-pages -> shorter url/error -> minimal fields.
  const attempts = [
    [MAX_REPORT_FIELD_LENGTH, MAX_ERROR_LENGTH, true],
    [MAX_REPORT_FIELD_LENGTH, MAX_ERROR_LENGTH, false],
    [60, 40, false],
    [30, 20, false],
  ];

  let reportUrl;
  for (const [urlLen, errorLen, includeSourcePages] of attempts) {
    const url = String(entry.url || 'unknown').substring(0, urlLen);
    const errorStatus = String(entry.error || 'Unknown error').substring(
      0,
      errorLen
    );
    reportUrl = buildReportUrl(
      url,
      errorStatus,
      sourcePages,
      context,
      includeSourcePages
    );
    if (reportUrl.length <= MAX_REPORT_URL_LENGTH) break;
  }

  return reportUrl;
}

function renderErrorTable(errors, maxShown, runUrl, prNumber) {
  let section = `### Broken Links\n\n`;
  section += `| Source File | Broken URL | Error | Report |\n`;
  section += `|------------|------------|-------|--------|\n`;

  const displayErrors = errors.slice(0, maxShown);
  displayErrors.forEach((entry) => {
    const contentFile = mapPublicToContentPath(entry.file);
    const url = escapeTableCell(entry.url || 'unknown', MAX_URL_LENGTH);
    const message = escapeTableCell(entry.error || 'Unknown error');
    const reportUrl = generateReportUrl(entry, prNumber);
    section += `| \`${contentFile}\` | ${url} | ${message} | [Report](${reportUrl}) |\n`;
  });

  if (errors.length > maxShown) {
    section += `\n_Showing first ${maxShown} of ${errors.length} errors. `;
    section += `See the [workflow run](${runUrl}) for the full list._\n`;
  }

  return section + '\n';
}

function renderKnownIssuesSection(knownWarnings) {
  let section = `### ⚠️ Known Issues (downgraded to warnings)\n\n`;
  section += `| Source File | URL | Error | Issue |\n`;
  section += `|------------|-----|-------|-------|\n`;

  knownWarnings.forEach((entry) => {
    const contentFile = mapPublicToContentPath(entry.file);
    const url = escapeTableCell(entry.url || 'unknown', MAX_URL_LENGTH);
    const message = escapeTableCell(entry.error || 'Unknown');
    const issueUrl =
      entry.knownIssue.url ||
      `https://github.com/${REPORT_REPO}/issues/${entry.knownIssue.number}`;
    section += `| \`${contentFile}\` | ${url} | ${message} | [#${entry.knownIssue.number}](${issueUrl}) |\n`;
  });

  section += `\n_These match open \`area:links\` issues, so they don't fail CI. `;
  section += `If a link is actually fixed, close the issue._\n\n`;
  return section;
}

function renderWarningDetails(warnings, runUrl) {
  let section = `<details>\n`;
  section += `<summary>⚠️ ${warnings.length} warning(s) (do not fail CI)</summary>\n\n`;
  section += `| Source File | URL | Issue |\n`;
  section += `|------------|-----|-------|\n`;

  const displayWarnings = warnings.slice(0, MAX_WARNINGS_SHOWN);
  displayWarnings.forEach((entry) => {
    const contentFile = mapPublicToContentPath(entry.file);
    const url = escapeTableCell(entry.url || 'unknown', MAX_URL_LENGTH);
    const message = escapeTableCell(entry.error || 'Unknown');
    section += `| \`${contentFile}\` | ${url} | ${message} |\n`;
  });

  if (warnings.length > MAX_WARNINGS_SHOWN) {
    section += `\n_Showing first ${MAX_WARNINGS_SHOWN} of ${warnings.length} warnings. `;
    section += `See the [workflow run](${runUrl}) for full results._\n`;
  }

  section += `\n</details>\n\n`;
  return section;
}

/**
 * Generate the link check comment body
 * @param {Object} options - Comment options
 * @param {string} options.status - 'passed' | 'failed' | 'error' | 'skipped'
 * @param {string|number} [options.filesChecked] - Number of files checked
 * @param {string|number} [options.totalLinks] - Total links checked
 * @param {string|number} [options.errorCount] - Number of broken links
 * @param {string|number} [options.warningCount] - Number of warnings
 * @param {string|number} [options.knownIssueCount] - Warnings downgraded from errors
 * @param {string|number} [options.successRate] - Success rate percentage
 * @param {Array} [options.errors] - Error entries from results JSON
 * @param {Array} [options.warnings] - Warning entries from results JSON
 * @param {string} [options.runUrl] - URL of the workflow run
 * @param {number|string} [options.prNumber] - PR number, used in Report links
 * @returns {string} - Markdown comment body
 */
export function generateLinkCheckComment(options) {
  const {
    status,
    filesChecked = 0,
    totalLinks = 0,
    errorCount = 0,
    warningCount = 0,
    knownIssueCount = 0,
    successRate = 0,
    errors = [],
    warnings = [],
    runUrl = 'https://github.com/influxdata/docs-v2/actions',
    prNumber,
  } = options;

  const timestamp =
    new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC';

  const knownWarnings = warnings.filter((w) => w.knownIssue);
  const plainWarnings = warnings.filter((w) => !w.knownIssue);

  const build = (maxErrors, includeWarnings) => {
    let body = `${COMMENT_MARKER}\n## 🔗 Link Check Results — Link Check Bot\n\n`;

    switch (status) {
      case 'failed':
        body += `❌ **${errorCount} broken link(s) found** — fix them before merging.\n\n`;
        break;
      case 'error':
        body += `⚠️ **Link check could not complete** — no results were generated. `;
        body += `Check the [workflow run](${runUrl}) logs.\n\n`;
        break;
      case 'skipped':
        body += `⏭️ **No public files were link-checked for the latest commit.**\n\n`;
        break;
      default:
        body += `✅ **All links are valid**\n\n`;
    }

    if (status === 'failed' || status === 'passed') {
      body += `| Metric | Value |\n`;
      body += `|--------|-------|\n`;
      body += `| Files Checked | ${filesChecked} |\n`;
      body += `| Total Links | ${totalLinks} |\n`;
      body += `| Errors | ${errorCount} |\n`;
      body += `| Warnings | ${warningCount} |\n`;
      if (Number(knownIssueCount) > 0) {
        body += `| Known Issues | ${knownIssueCount} |\n`;
      }
      body += `| Success Rate | ${successRate}% |\n\n`;

      if (status === 'failed' && errors.length > 0) {
        body += renderErrorTable(errors, maxErrors, runUrl, prNumber);
      }

      if (knownWarnings.length > 0) {
        body += renderKnownIssuesSection(knownWarnings);
      }

      if (includeWarnings && plainWarnings.length > 0) {
        body += renderWarningDetails(plainWarnings, runUrl);
      }
    }

    body += `---\n`;
    body += `<sub>Full details: [workflow run summary and artifact](${runUrl}). `;
    body += `Last updated: ${timestamp}</sub>`;
    return body;
  };

  let body = build(MAX_ERRORS_SHOWN, true);
  if (body.length > MAX_COMMENT_LENGTH) {
    body = build(MAX_ERRORS_SHOWN_TRUNCATED, false);
  }
  return body;
}

/**
 * Find existing link check comment on the PR
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @returns {Object|undefined} - Existing comment or undefined
 */
export async function findExistingComment(github, context) {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  return comments.find((comment) => comment.body.includes(COMMENT_MARKER));
}

/**
 * Create or update the sticky link check comment.
 *
 * A comment is only created when the run found problems (broken links,
 * warnings, or a checker error). Clean runs update an existing comment to
 * the ✅ state but never create one, so PRs without link issues get no
 * extra comment. options.updateOnly forces update-or-skip behavior
 * regardless of status (used for the 'skipped' refresh).
 *
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {Object} options - See generateLinkCheckComment
 */
export async function upsertLinkCheckComment(github, context, options) {
  const status = options.status;
  const hasProblems =
    status === 'failed' ||
    status === 'error' ||
    Number(options.warningCount || 0) > 0;
  const updateOnly = options.updateOnly === true || !hasProblems;

  const existingComment = await findExistingComment(github, context);

  if (!existingComment && updateOnly) {
    console.log('No existing comment and nothing to report - skipping');
    return;
  }

  const body = generateLinkCheckComment(options);

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
 * CLI for local testing: render a comment body from a results file
 */
function main() {
  const [resultsPath, status] = process.argv.slice(2);

  if (!resultsPath) {
    console.error(
      'Usage: node link-check-comment.js <results.json> [passed|failed|error|skipped]'
    );
    process.exit(1);
  }

  const results = loadResults(resultsPath);
  const body = generateLinkCheckComment({
    ...results,
    status:
      status ||
      results.status ||
      (results.errorCount > 0 ? 'failed' : 'passed'),
    filesChecked: 'n/a',
    runUrl: 'https://github.com/influxdata/docs-v2/actions',
  });
  console.log(body);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
