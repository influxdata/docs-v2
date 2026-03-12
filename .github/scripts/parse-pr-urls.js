/**
 * Parse Documentation URLs from PR Description
 * Extracts docs.influxdata.com URLs and relative paths from PR body text.
 * Used when layout/asset changes require author-specified preview pages.
 */

import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load valid product namespaces from products.yml
 * @returns {string[]} - Array of valid namespace prefixes
 * @throws {Error} - If products.yml cannot be read
 */
function loadProductNamespaces() {
  // Navigate from .github/scripts/ to data/products.yml
  const productsPath = join(__dirname, '../../data/products.yml');
  const productsYaml = readFileSync(productsPath, 'utf8');
  const products = load(productsYaml);

  // Extract unique namespaces from all products
  const namespaces = new Set();
  for (const product of Object.values(products)) {
    if (product.namespace) {
      namespaces.add(product.namespace);
    }
  }

  if (namespaces.size === 0) {
    throw new Error('No product namespaces found in products.yml');
  }

  return Array.from(namespaces);
}

// Load namespaces once at module initialization
const PRODUCT_NAMESPACES = loadProductNamespaces();

/**
 * Validate URL path for security
 * @param {string} path - URL path to validate
 * @returns {boolean} - True if path is safe
 */
function isValidUrlPath(path) {
  if (!path || typeof path !== 'string') return false;

  // Reject path traversal attempts
  if (path.includes('..')) return false;

  // Reject paths with suspicious characters
  // Note: Backticks are in this list, but the extraction regex stops AT backticks,
  // so they act as delimiters rather than being included in paths
  // (includes ' to prevent JS injection)
  if (/[<>"|{}`\\^[\]']/.test(path)) return false;

  // Reject URL-encoded characters (potential encoding attacks)
  if (path.includes('%')) return false;

  // Must start with /
  if (!path.startsWith('/')) return false;

  // Must start with known product prefix (loaded from products.yml)
  const validPrefixes = PRODUCT_NAMESPACES.map((ns) => `/${ns}/`);

  return validPrefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * Build regex pattern for relative paths
 * @returns {RegExp} - Pattern matching valid product URL paths
 */
function buildRelativePattern() {
  const namespaceAlternation = PRODUCT_NAMESPACES.join('|');
  // Match relative paths starting with known product prefixes
  // Captures paths in various contexts: markdown links, parentheses, backticks, etc.
  // Delimiters: start of string, whitespace, ], ), (, or `
  // Note: Backtick appears in both the delimiter list and negated character class
  // for defense-in-depth - delimiter stops extraction, character class prevents
  // any edge cases where backticks might slip through
  return new RegExp(
    `(?:^|\\s|\\]|\\)|\\(|\`)(\\/(?:${namespaceAlternation})[^\\s)\\]>"'\`]*)`,
    'gm'
  );
}

const RELATIVE_PATTERN = buildRelativePattern();

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
    const path = normalizeUrlPath(match[1]);
    if (isValidUrlPath(path)) {
      urls.add(path);
    }
  }

  // Pattern 2: Localhost dev URLs
  // http://localhost:1313/influxdb3/core/
  const localUrlPattern = /https?:\/\/localhost:\d+(\/[^\s)\]>"']+)/g;
  while ((match = localUrlPattern.exec(text)) !== null) {
    const path = normalizeUrlPath(match[1]);
    if (isValidUrlPath(path)) {
      urls.add(path);
    }
  }

  // Pattern 3: Relative paths starting with known product prefixes
  // /influxdb3/core/admin/ or /telegraf/v1/plugins/
  // Reset lastIndex to ensure fresh matching
  RELATIVE_PATTERN.lastIndex = 0;
  while ((match = RELATIVE_PATTERN.exec(text)) !== null) {
    const path = normalizeUrlPath(match[1]);
    if (isValidUrlPath(path)) {
      urls.add(path);
    }
  }

  return Array.from(urls);
}

/**
 * Normalize URL path to consistent format
 * @param {string} urlPath - URL path to normalize
 * @returns {string} - Normalized path with trailing slash, wildcards stripped
 */
function normalizeUrlPath(urlPath) {
  // Remove anchor fragments
  let normalized = urlPath.split('#')[0];
  // Remove query strings
  normalized = normalized.split('?')[0];
  // Remove wildcard characters (* is often used to indicate "all pages")
  // Do this BEFORE collapsing slashes to handle patterns like /path/*/
  normalized = normalized.replace(/\*/g, '');
  // Collapse multiple consecutive slashes into single slash
  // This handles cases like /path/*/ → /path// → /path/
  normalized = normalized.replace(/\/+/g, '/');
  // Ensure trailing slash (important for Hugo's URL structure)
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
  return urlPaths.map((urlPath) => {
    // Remove leading/trailing slashes and add content prefix
    const cleanPath = urlPath.replace(/^\/|\/$/g, '');
    return `content/${cleanPath}/_index.md`;
  });
}

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('parse-pr-urls.js')) {
  const text = process.argv[2] || '';
  const urls = extractDocsUrls(text);
  console.log(JSON.stringify(urls, null, 2));
}
