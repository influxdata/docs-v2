/**
 * Detect the base URL for the current build environment.
 * Ported from the removed markdown-converter.cjs so the build script can pass
 * base_url to the Rust converter (which no longer resolves it internally).
 * @returns {string}
 */
export function detectBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (
    process.env.HUGO_ENV === 'development' ||
    process.env.NODE_ENV === 'development'
  ) {
    return 'http://localhost:1313';
  }
  if (
    process.env.HUGO_ENV === 'staging' ||
    process.env.DEPLOY_ENV === 'staging'
  ) {
    return process.env.STAGING_URL || 'https://test2.docs.influxdata.com';
  }
  return 'https://docs.influxdata.com';
}
