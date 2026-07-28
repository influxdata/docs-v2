/**
 * Fetch Known Link Issues
 * Loads open issues labeled area:links so the link checker can downgrade
 * errors that are already tracked.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 * (see .github/workflows/pr-link-check.yml)
 */

import fs from 'fs';

export const KNOWN_ISSUES_LABEL = 'area:links';

/**
 * Fetch open issues labeled area:links, excluding pull requests.
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @returns {Promise<Array<{number:number,title:string,text:string,url:string}>>}
 */
export async function fetchKnownLinkIssues(github, context) {
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    owner: context.repo.owner,
    repo: context.repo.repo,
    labels: KNOWN_ISSUES_LABEL,
    state: 'open',
    per_page: 100,
  });

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      number: issue.number,
      title: issue.title || '',
      text: `${issue.title || ''}\n${issue.body || ''}`,
      url: issue.html_url,
    }));
}

/**
 * Fetch known link issues and write them to disk. Never throws — on
 * failure, logs a warning and writes an empty list so the classify step
 * behaves as if no issues were tracked.
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {string} outputPath - Path to write known-link-issues.json
 * @returns {Promise<number>} - Number of known issues written
 */
export async function writeKnownLinkIssues(github, context, outputPath) {
  let knownIssues = [];
  try {
    knownIssues = await fetchKnownLinkIssues(github, context);
  } catch (error) {
    console.warn(`Could not fetch known link issues: ${error.message}`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(knownIssues, null, 2));
  return knownIssues.length;
}
