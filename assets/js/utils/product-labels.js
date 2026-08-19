/**
 * Product labels for search results, derived from data/products.yml.
 *
 * Hugo passes data/products.yml into the browser bundle as a js.Build param
 * (see layouts/partials/header/javascript.html). This module takes that
 * object as an argument rather than importing it, so the lookup stays pure
 * and testable outside the browser.
 *
 * @module utils/product-labels
 */

/**
 * Path segments that have no products.yml entry but still appear in search
 * results. `resources` reaches the results list through the OR'd `resources`
 * facet filter.
 */
const NON_PRODUCT_LABELS = {
  platform: 'InfluxData Platform',
  resources: 'Additional Resources',
};

/**
 * @typedef {object} ProductLabelEntry
 * @property {string[]} segments - content_path split into path segments
 * @property {string} name - display name for pages under that path
 */

/**
 * Build the content-path lookup used by formatProductLabel().
 *
 * Products that publish multiple content paths (currently InfluxDB v1 and v2)
 * get one entry per version, with the version appended to the name. A
 * single-entry map explicitly identifies an unversioned URL root and keeps the
 * product name unchanged.
 *
 * @param {Record<string, object>} products - data/products.yml contents
 * @returns {ProductLabelEntry[]} entries, longest content path first
 */
export function buildProductIndex(products) {
  const entries = [];

  for (const product of Object.values(products ?? {})) {
    const contentPath = product?.content_path;
    const name = product?.name;
    if (!contentPath || !name) {
      continue;
    }

    if (typeof contentPath === 'string') {
      entries.push({ segments: contentPath.split('/'), name });
    } else {
      const versionedPaths = Object.entries(contentPath);
      const appendVersion = versionedPaths.length > 1;
      for (const [version, path] of versionedPaths) {
        entries.push({
          segments: path.split('/'),
          name: appendVersion ? `${name} ${version}` : name,
        });
      }
    }
  }

  // Longest content path first so /telegraf/controller/ wins over /telegraf/.
  return entries.sort((a, b) => b.segments.length - a.segments.length);
}

/**
 * Format the product label for a docs URL path.
 *
 * Matches whole path segments, so a product never matches a sibling whose
 * path shares a string prefix (/influxdb3/cloud/ vs
 * /influxdb3/cloud-dedicated/).
 *
 * @param {string} pathname - URL path (e.g. '/influxdb3/cloud/admin/')
 * @param {ProductLabelEntry[]} index - from buildProductIndex()
 * @returns {string} display name, or the first path segment when unmatched
 */
export function formatProductLabel(pathname, index) {
  const segments = String(pathname ?? '')
    .split('/')
    .filter(Boolean);

  if (segments.length === 0) {
    return '';
  }

  const entry = (index ?? []).find((candidate) =>
    candidate.segments.every((segment, i) => segments[i] === segment)
  );

  return entry?.name ?? NON_PRODUCT_LABELS[segments[0]] ?? segments[0];
}
