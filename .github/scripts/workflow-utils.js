/**
 * Workflow Utilities
 *
 * Canonical import for GitHub Actions workflow scripts. Re-exports shared
 * utilities from scripts/lib/ and adds workflow-specific helpers.
 *
 * Usage from github-script inline steps:
 *
 *   const utils = await import(`${process.cwd()}/.github/scripts/workflow-utils.js`);
 *   const pathToLabel = await utils.getProductLabelMap();
 *   const labels = utils.matchFilesToLabels(changedFiles, pathToLabel);
 *
 * Usage from .github/scripts/ ESM modules:
 *
 *   import { getProductLabelMap, findPagesReferencingSharedContent } from './workflow-utils.js';
 */

import { readFileSync } from 'fs';
import { findPagesReferencingSharedContent } from '../../scripts/lib/content-utils.js';

// --- Re-export content utilities ---
export {
  findPagesReferencingSharedContent,
  expandSharedContentChanges,
  getChangedContentFiles,
  mapContentToPublic,
  categorizeContentFiles,
  getSourceFromFrontmatter,
} from '../../scripts/lib/content-utils.js';

/**
 * Build a Map of content path prefixes to product label names
 * by reading data/products.yml.
 *
 * Requires `js-yaml` to be installed (e.g., `npm install js-yaml`).
 *
 * @param {string} [productsPath='data/products.yml'] - Path to products.yml
 * @returns {Promise<Map<string, string>>} Map of "content/{path}/" → "product:{label_group}"
 */
export async function getProductLabelMap(productsPath = 'data/products.yml') {
  const { load } = await import('js-yaml');
  const products = load(readFileSync(productsPath, 'utf8'));
  const pathToLabel = new Map();

  for (const product of Object.values(products)) {
    const cp = product.content_path;
    const lg = product.label_group;
    if (!cp || !lg) continue;

    if (typeof cp === 'string' && typeof lg === 'string') {
      pathToLabel.set(`content/${cp}/`, `product:${lg}`);
    } else if (typeof cp === 'object' && typeof lg === 'object') {
      for (const version of Object.keys(cp)) {
        if (lg[version]) {
          pathToLabel.set(`content/${cp[version]}/`, `product:${lg[version]}`);
        }
      }
    }
  }

  return pathToLabel;
}

/**
 * Match a list of file paths against the product label map.
 * For shared content files, expands to find affected products.
 *
 * @param {string[]} files - Changed file paths
 * @param {Map<string, string>} pathToLabel - From getProductLabelMap()
 * @returns {Set<string>} Set of label names to apply
 */
export function matchFilesToLabels(files, pathToLabel) {
  const labels = new Set();

  for (const file of files) {
    if (file.startsWith('content/shared/')) {
      labels.add('product:shared');

      try {
        const referencingPages = findPagesReferencingSharedContent(file);
        for (const page of referencingPages) {
          for (const [prefix, label] of pathToLabel) {
            if (page.startsWith(prefix)) {
              labels.add(label);
              break;
            }
          }
        }
      } catch {
        // Shared content expansion failed — product:shared still applied
      }
      continue;
    }

    for (const [prefix, label] of pathToLabel) {
      if (file.startsWith(prefix)) {
        labels.add(label);
        break;
      }
    }
  }

  return labels;
}
