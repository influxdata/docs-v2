/**
 * Derive product labels for an issue.
 *
 * Pull requests get product labels from their changed files. Issues have no
 * changed files, so labels are derived from the documentation URLs an issue
 * references — the `Relevant URLs` section of the bug report template, the
 * `Broken URL` and `Source page(s)` fields of the broken link template, or any
 * docs URL pasted into the body.
 *
 * The derivation is deterministic and reuses the same primitives as the PR
 * path: `extractDocsUrls` (which strips code blocks and validates paths
 * against the namespaces in products.yml) and `matchFilesToLabels` (which
 * prefix-matches against the content_path → label_group map). No inference,
 * so a label is only ever applied when the issue names a real docs path.
 *
 * Usage:
 *
 *   import { getProductLabelMap } from './workflow-utils.js';
 *   import { getIssueProductLabels } from './label-issue.js';
 *
 *   const labels = getIssueProductLabels(issue, await getProductLabelMap());
 */

import { extractDocsUrls, urlPathsToContentPaths } from './parse-pr-urls.js';
import { matchFilesToLabels } from './workflow-utils.js';

/**
 * Derive product labels from the docs URLs an issue references.
 *
 * @param {{title?: string, body?: string}} issue - Issue title and body
 * @param {Map<string, string>} pathToLabel - From getProductLabelMap()
 * @returns {string[]} Sorted label names, empty when no docs URL is found
 */
export function getIssueProductLabels(issue, pathToLabel) {
  const text = [issue?.title, issue?.body].filter(Boolean).join('\n');
  if (!text) return [];

  const urlPaths = extractDocsUrls(text);
  if (urlPaths.length === 0) return [];

  // The docs home page (`/`) carries no product signal — it prefix-matches
  // nothing, but drop it explicitly so intent stays readable.
  const productPaths = urlPaths.filter((path) => path !== '/');
  if (productPaths.length === 0) return [];

  const contentFiles = urlPathsToContentPaths(productPaths);

  return [...matchFilesToLabels(contentFiles, pathToLabel)].sort();
}
