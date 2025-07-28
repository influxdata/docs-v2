/**
 * URL Transformation Utilities
 * Shared logic for converting file paths to URL paths
 * Used across documentation testing and build tools
 */

/**
 * Convert a content file path to its corresponding URL path
 * @param {string} filePath - File path starting with 'content/'
 * @returns {string} - URL path (starts with '/')
 */
function filePathToUrl(filePath) {
  // Map to URL
  let url = filePath.replace(/^content/, '');
  url = url.replace(/\/_index\.(html|md)$/, '/');
  url = url.replace(/\.md$/, '/');
  url = url.replace(/\.html$/, '/');
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  return url;
}

export { filePathToUrl };
