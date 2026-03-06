/**
 * Product resolution module
 *
 * Centralizes logic for resolving product identifiers (keys, paths, URLs)
 * to canonical product keys.
 */

import { DEFAULT_CONFIG } from './defaults.js';

/**
 * Mapping from content paths to product keys.
 * Paths are normalized (no leading/trailing slashes, no 'content/' prefix).
 */
const PATH_TO_PRODUCT_KEY = {
  // InfluxDB 3 products
  'influxdb3/core': 'influxdb3_core',
  'influxdb3/enterprise': 'influxdb3_enterprise',
  'influxdb3/cloud-serverless': 'influxdb3_cloud_serverless',
  'influxdb3/cloud-dedicated': 'influxdb3_cloud_dedicated',
  'influxdb3/clustered': 'influxdb3_clustered',
  'influxdb3/explorer': 'influxdb3_explorer',

  // InfluxDB OSS (v1/v2) - versioned paths
  'influxdb/v1': 'influxdb',
  'influxdb/v2': 'influxdb',
  'influxdb/cloud': 'influxdb_cloud',

  // Telegraf - versioned paths
  telegraf: 'telegraf',

  // Other tools
  chronograf: 'chronograf',
  kapacitor: 'kapacitor',
  enterprise_influxdb: 'enterprise_influxdb',
  flux: 'flux',
};

/**
 * Get all valid product keys from defaults.js
 * @returns {Set<string>} Set of valid product keys
 */
export function getValidProductKeys() {
  return new Set(Object.keys(DEFAULT_CONFIG.repositories));
}

/**
 * Normalize a path by removing common prefixes and cleaning up.
 * @param {string} input - Raw path input
 * @returns {string} Normalized path (e.g., "influxdb3/core")
 */
function normalizePath(input) {
  let path = input.trim();

  // Remove URL components if present
  // e.g., "https://docs.influxdata.com/influxdb3/core/admin/..." -> "/influxdb3/core/admin/..."
  if (path.includes('docs.influxdata.com')) {
    const match = path.match(/docs\.influxdata\.com(\/[^?#]*)/);
    if (match) {
      path = match[1];
    }
  }

  // Remove leading "content/" prefix
  path = path.replace(/^content\//, '');

  // Remove leading and trailing slashes
  path = path.replace(/^\/+/, '').replace(/\/+$/, '');

  // Extract just the product portion (first 1-2 segments for most products)
  const segments = path.split('/');

  // Handle telegraf with version (telegraf/v1.33 -> telegraf)
  if (segments[0] === 'telegraf') {
    // Check if second segment is a version
    if (segments[1] && /^v\d/.test(segments[1])) {
      return 'telegraf';
    }
    return 'telegraf';
  }

  // Handle influxdb3 products (influxdb3/core, influxdb3/enterprise, etc.)
  if (segments[0] === 'influxdb3' && segments[1]) {
    return `influxdb3/${segments[1]}`;
  }

  // Handle influxdb with version (influxdb/v2, influxdb/cloud)
  if (segments[0] === 'influxdb' && segments[1]) {
    return `influxdb/${segments[1]}`;
  }

  // Handle other single-segment products
  if (segments[0]) {
    return segments[0];
  }

  return path;
}

/**
 * Find similar product keys for error suggestions.
 * @param {string} input - The invalid input
 * @returns {Array<{key: string, path: string, description: string}>} Similar products
 */
function findSimilarProducts(input) {
  const normalized = input.toLowerCase().replace(/[_-]/g, '');
  const suggestions = [];

  for (const [key, config] of Object.entries(DEFAULT_CONFIG.repositories)) {
    const keyNormalized = key.toLowerCase().replace(/[_-]/g, '');

    // Check if input is a substring or similar
    if (
      keyNormalized.includes(normalized) ||
      normalized.includes(keyNormalized)
    ) {
      // Find the path that maps to this key
      const path = Object.entries(PATH_TO_PRODUCT_KEY).find(
        ([, v]) => v === key
      )?.[0];
      suggestions.push({
        key,
        path: path ? `/${path}/` : null,
        description: config.description,
      });
    }
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

/**
 * Resolve a single product identifier to a canonical product key.
 *
 * @param {string} input - Product key, content path, or URL
 * @returns {{ key: string, contentPath: string | null }} Resolved product info
 * @throws {Error} If input cannot be resolved
 *
 * @example
 * resolveProduct('influxdb3_core')
 * // => { key: 'influxdb3_core', contentPath: 'influxdb3/core' }
 *
 * resolveProduct('/influxdb3/core')
 * // => { key: 'influxdb3_core', contentPath: 'influxdb3/core' }
 *
 * resolveProduct('https://docs.influxdata.com/influxdb3/core/admin/')
 * // => { key: 'influxdb3_core', contentPath: 'influxdb3/core' }
 */
export function resolveProduct(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Product identifier is required');
  }

  const trimmed = input.trim();
  const validKeys = getValidProductKeys();

  // 1. Check if exact product key match
  if (validKeys.has(trimmed)) {
    // Find the content path for this key
    const contentPath =
      Object.entries(PATH_TO_PRODUCT_KEY).find(([, v]) => v === trimmed)?.[0] ||
      null;
    return { key: trimmed, contentPath };
  }

  // 2. Try to parse as path/URL and extract product key
  const normalizedPath = normalizePath(trimmed);

  if (PATH_TO_PRODUCT_KEY[normalizedPath]) {
    return {
      key: PATH_TO_PRODUCT_KEY[normalizedPath],
      contentPath: normalizedPath,
    };
  }

  // 3. Could not resolve - throw helpful error
  const suggestions = findSimilarProducts(trimmed);

  let errorMessage = `Could not resolve product identifier '${trimmed}'`;

  if (suggestions.length > 0) {
    errorMessage += '\n\nDid you mean one of these?';
    for (const { key, path, description } of suggestions) {
      const pathHint = path ? ` → ${path}` : '';
      errorMessage += `\n  ${key}${pathHint} (${description})`;
    }
  } else {
    errorMessage += '\n\nValid product keys:';
    const keys = Array.from(validKeys).slice(0, 10);
    for (const key of keys) {
      errorMessage += `\n  ${key}`;
    }
    if (validKeys.size > 10) {
      errorMessage += `\n  ... and ${validKeys.size - 10} more`;
    }
  }

  throw new Error(errorMessage);
}

/**
 * Resolve multiple product identifiers from a comma-separated string.
 *
 * @param {string} input - Comma-separated product identifiers
 * @returns {Array<{ key: string, contentPath: string | null }>} Array of resolved products
 * @throws {Error} If any input cannot be resolved
 *
 * @example
 * resolveProducts('influxdb3_core,influxdb3_enterprise')
 * // => [
 * //   { key: 'influxdb3_core', contentPath: 'influxdb3/core' },
 * //   { key: 'influxdb3_enterprise', contentPath: 'influxdb3/enterprise' }
 * // ]
 *
 * resolveProducts('/influxdb3/core,/influxdb3/enterprise')
 * // => [
 * //   { key: 'influxdb3_core', contentPath: 'influxdb3/core' },
 * //   { key: 'influxdb3_enterprise', contentPath: 'influxdb3/enterprise' }
 * // ]
 */
export function resolveProducts(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Product identifiers are required');
  }

  const identifiers = input
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (identifiers.length === 0) {
    throw new Error('At least one product identifier is required');
  }

  return identifiers.map((identifier) => resolveProduct(identifier));
}

/**
 * Get the content path for a product key.
 *
 * @param {string} key - Product key
 * @returns {string | null} Content path or null if not found
 */
export function getContentPath(key) {
  return (
    Object.entries(PATH_TO_PRODUCT_KEY).find(([, v]) => v === key)?.[0] || null
  );
}

/**
 * Get product info including description from defaults.
 *
 * @param {string} key - Product key
 * @returns {{ key: string, contentPath: string | null, description: string } | null}
 */
export function getProductInfo(key) {
  const config = DEFAULT_CONFIG.repositories[key];
  if (!config) {
    return null;
  }

  return {
    key,
    contentPath: getContentPath(key),
    description: config.description,
    url: config.url || null,
  };
}

/**
 * Validate that --products and --repos are mutually exclusive.
 * Exits with error if both are provided.
 *
 * @param {object} options - Parsed command options
 * @param {string} [options.products] - Products flag value
 * @param {string} [options.repos] - Repos flag value
 */
export function validateMutualExclusion(options) {
  if (options.products && options.repos) {
    console.error('Error: --products and --repos are mutually exclusive');
    console.error(
      'Use --products for product keys/paths, or --repos for direct repository paths'
    );
    process.exit(1);
  }
}
