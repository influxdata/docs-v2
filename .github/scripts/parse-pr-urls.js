/**
 * Parse Documentation URLs from PR Description
 * Extracts docs.influxdata.com URLs and relative paths from PR body text.
 * Used when layout/asset changes require author-specified preview pages.
 */

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
    urls.add(normalizeUrlPath(match[1]));
  }

  // Pattern 2: Localhost dev URLs
  // http://localhost:1313/influxdb3/core/
  const localUrlPattern = /https?:\/\/localhost:\d+(\/[^\s)\]>"']+)/g;
  while ((match = localUrlPattern.exec(text)) !== null) {
    urls.add(normalizeUrlPath(match[1]));
  }

  // Pattern 3: Relative paths starting with known product prefixes
  // /influxdb3/core/admin/ or /telegraf/v1/plugins/
  const relativePattern = /(?:^|\s)(\/(?:influxdb3|influxdb|telegraf|kapacitor|chronograf|flux|enterprise_influxdb)[^\s)\]>"']*)/gm;
  while ((match = relativePattern.exec(text)) !== null) {
    urls.add(normalizeUrlPath(match[1]));
  }

  return Array.from(urls);
}

/**
 * Normalize URL path to consistent format
 * @param {string} urlPath - URL path to normalize
 * @returns {string} - Normalized path with trailing slash
 */
function normalizeUrlPath(urlPath) {
  // Remove anchor fragments
  let normalized = urlPath.split('#')[0];
  // Remove query strings
  normalized = normalized.split('?')[0];
  // Ensure trailing slash
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
  return urlPaths.map(urlPath => {
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
