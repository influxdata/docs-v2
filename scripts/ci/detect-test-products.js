#!/usr/bin/env node
/**
 * Detect which products need testing based on changed content files.
 *
 * Usage:
 *   echo "content/influxdb3/core/page.md" | node scripts/ci/detect-test-products.js
 *   node scripts/ci/detect-test-products.js < changed-files.txt
 *
 * Output (JSON):
 *   {"products":["influxdb3_core","telegraf"],"files":["content/influxdb3/core/page.md",...]}
 *
 * This script:
 * 1. Reads changed file paths from stdin (one per line)
 * 2. Expands shared content changes to find all affected product pages
 * 3. Extracts unique products from the affected file paths
 * 4. Outputs JSON with products array and expanded files array
 */

import { expandSharedContentChanges, resolveCanonicalSource } from '../lib/content-utils.js';

// Product path mappings
const PRODUCT_PATTERNS = [
  { pattern: /^content\/influxdb3\/core\//, product: 'influxdb3_core' },
  { pattern: /^content\/influxdb3\/enterprise\//, product: 'influxdb3_enterprise' },
  { pattern: /^content\/influxdb3\/cloud-dedicated\//, product: 'cloud-dedicated' },
  { pattern: /^content\/influxdb3\/cloud-serverless\//, product: 'cloud-serverless' },
  { pattern: /^content\/influxdb3\/clustered\//, product: 'clustered' },
  { pattern: /^content\/influxdb3\/explorer\//, product: 'explorer' },
  { pattern: /^content\/influxdb\/cloud\//, product: 'cloud' },
  { pattern: /^content\/influxdb\/v2\//, product: 'v2' },
  { pattern: /^content\/influxdb\/v1\//, product: 'v1' },
  { pattern: /^content\/telegraf\//, product: 'telegraf' },
];

/**
 * Extract product identifier from a content file path
 * @param {string} filePath - Content file path
 * @returns {string|null} Product identifier or null
 */
function getProductFromPath(filePath) {
  for (const { pattern, product } of PRODUCT_PATTERNS) {
    if (pattern.test(filePath)) {
      return product;
    }
  }
  return null;
}

/**
 * Main function
 */
async function main() {
  // Read changed files from stdin
  const input = await new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));

    // Handle case where stdin is empty/closed immediately
    if (process.stdin.isTTY) {
      resolve('');
    }
  });

  const changedFiles = input
    .trim()
    .split('\n')
    .filter((f) => f && f.endsWith('.md'));

  if (changedFiles.length === 0) {
    console.log(JSON.stringify({ products: [], files: [], canonical: [] }));
    process.exit(0);
  }

  // Expand shared content changes to find all affected pages
  const verbose = process.env.VERBOSE === 'true';
  const expandedFiles = expandSharedContentChanges(changedFiles, { verbose });

  // Extract unique products from expanded file list
  const products = new Set();
  for (const file of expandedFiles) {
    const product = getProductFromPath(file);
    if (product) {
      products.add(product);
    }
  }

  // Compute canonical sources (deduped) for the lint-codeblocks job.
  // Resolves any consumer page with `source:` frontmatter to its shared
  // source, so the linter runs once per underlying content file.
  // Only include paths under content/ — if frontmatter parsing returns
  // something outside that, skip it rather than hand the linter an
  // unreadable path.
  //
  // NOTE: we intentionally do NOT filter by existsSync here. A missing
  // canonical (broken source: path, or a file deleted in this PR) should
  // reach lint-codeblocks.mjs, which already emits ::warning:: for
  // unreadable sources. Filtering here would silently suppress that signal.
  const canonicalSet = new Set();
  for (const file of changedFiles) {
    const canonical = resolveCanonicalSource(file);
    if (canonical.startsWith('content/')) {
      canonicalSet.add(canonical);
    }
  }

  // Output JSON result
  const result = {
    products: Array.from(products).sort(),
    files: expandedFiles.sort(),
    canonical: Array.from(canonicalSet).sort(),
  };

  console.log(JSON.stringify(result));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
