/**
 * URL parsing utilities for documentation scaffolding
 * Parses docs.influxdata.com URLs to extract product, version, and path information
 */

import { basename } from 'path';

// Base URL pattern for InfluxData documentation
const DOCS_BASE_URL = 'docs.influxdata.com';

/**
 * Parse a documentation URL to extract components
 * @param {string} url - Full URL or path (e.g., "https://docs.influxdata.com/influxdb3/core/admin/databases/" or "/influxdb3/core/admin/databases/")
 * @returns {object} Parsed URL components
 */
export function parseDocumentationURL(url) {
  // Remove protocol and domain if present
  let path = url;
  if (url.includes(DOCS_BASE_URL)) {
    const urlObj = new URL(url);
    path = urlObj.pathname;
  }

  // Remove leading and trailing slashes
  path = path.replace(/^\/+|\/+$/g, '');

  // Split into parts
  const parts = path.split('/').filter((p) => p.length > 0);

  if (parts.length === 0) {
    throw new Error('Invalid URL: no path components');
  }

  // First part is the namespace (influxdb3, influxdb, telegraf, etc.)
  const namespace = parts[0];

  // Determine product structure based on namespace
  let product = null;
  let section = null;
  let pagePath = [];
  let isSection = false;

  if (namespace === 'influxdb3') {
    // InfluxDB 3 structure: /influxdb3/{product}/{section}/{...path}
    if (parts.length >= 2) {
      product = parts[1]; // core, enterprise, cloud-dedicated, cloud-serverless, clustered, explorer
      if (parts.length >= 3) {
        section = parts[2]; // admin, write-data, query-data, reference, get-started, plugins
        pagePath = parts.slice(3);
      }
    }
  } else if (namespace === 'influxdb') {
    // InfluxDB 2/1 structure: /influxdb/{version}/{section}/{...path}
    if (parts.length >= 2) {
      const secondPart = parts[1];
      if (secondPart === 'cloud') {
        product = 'cloud';
        if (parts.length >= 3) {
          section = parts[2];
          pagePath = parts.slice(3);
        }
      } else if (secondPart.match(/^v\d/)) {
        // v2.x or v1.x
        product = secondPart;
        if (parts.length >= 3) {
          section = parts[2];
          pagePath = parts.slice(3);
        }
      } else {
        // Assume cloudless-v2 structure: /influxdb/{section}/{...path}
        section = secondPart;
        pagePath = parts.slice(2);
        product = 'v2'; // default
      }
    }
  } else if (namespace === 'telegraf') {
    // Telegraf structure: /telegraf/{version}/{section}/{...path}
    if (parts.length >= 2) {
      product = parts[1];
      if (parts.length >= 3) {
        section = parts[2];
        pagePath = parts.slice(3);
      }
    }
  } else if (namespace === 'kapacitor' || namespace === 'chronograf') {
    // Other products: /{product}/{version}/{section}/{...path}
    if (parts.length >= 2) {
      product = parts[1];
      if (parts.length >= 3) {
        section = parts[2];
        pagePath = parts.slice(3);
      }
    }
  }

  // Determine if this is a section (directory) or single page
  // Section URLs typically end with / or have no file extension
  // Single page URLs typically end with a page name
  if (pagePath.length === 0 && section) {
    // URL points to section landing page
    isSection = true;
  } else if (pagePath.length > 0) {
    const lastPart = pagePath[pagePath.length - 1];
    // If last part looks like a directory (no dots), it's a section
    isSection = !lastPart.includes('.');
  }

  return {
    url,
    namespace,
    product,
    section,
    pagePath: pagePath.join('/'),
    isSection,
    fullPath: parts.join('/'),
  };
}

/**
 * Validate if a URL is a valid documentation URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid documentation URL
 */
export function validateDocumentationURL(url) {
  try {
    const parsed = parseDocumentationURL(url);
    return parsed.namespace && parsed.namespace.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Convert parsed URL to potential file paths
 * @param {object} parsedURL - Parsed URL from parseDocumentationURL()
 * @returns {string[]} Array of potential file paths to check
 */
export function urlToFilePaths(parsedURL) {
  const { namespace, product, section, pagePath, isSection } = parsedURL;

  const basePaths = [];

  // Build base path based on namespace and product
  let contentPath = `content/${namespace}`;
  if (product) {
    contentPath += `/${product}`;
  }
  if (section) {
    contentPath += `/${section}`;
  }

  if (pagePath) {
    contentPath += `/${pagePath}`;
  }

  if (isSection) {
    // Section could be _index.md or directory with _index.md
    basePaths.push(`${contentPath}/_index.md`);
    basePaths.push(`${contentPath}.md`); // Sometimes sections are single files
  } else {
    // Single page
    basePaths.push(`${contentPath}.md`);
    basePaths.push(`${contentPath}/_index.md`); // Could still be a section
  }

  return basePaths;
}

/**
 * Extract page name from URL for use in file names
 * @param {object} parsedURL - Parsed URL from parseDocumentationURL()
 * @returns {string} Suggested file name
 */
export function urlToFileName(parsedURL) {
  const { pagePath, section } = parsedURL;

  if (pagePath && pagePath.length > 0) {
    // Use last part of page path
    const parts = pagePath.split('/');
    return parts[parts.length - 1];
  } else if (section) {
    // Use section name
    return section;
  }

  return 'index';
}

/**
 * Parse multiple URLs (comma-separated or array)
 * @param {string|string[]} urls - URLs to parse
 * @returns {object[]} Array of parsed URLs
 */
export function parseMultipleURLs(urls) {
  let urlArray = [];

  if (typeof urls === 'string') {
    // Split by comma if string
    urlArray = urls.split(',').map((u) => u.trim());
  } else if (Array.isArray(urls)) {
    urlArray = urls;
  } else {
    throw new Error('URLs must be a string or array');
  }

  return urlArray
    .map((url) => {
      try {
        return parseDocumentationURL(url);
      } catch (error) {
        console.error(`Error parsing URL ${url}: ${error.message}`);
        return null;
      }
    })
    .filter((parsed) => parsed !== null);
}
