/**
 * Prepare Preview Files
 * Copies selected pages and required assets to a staging directory for deployment.
 *
 * Usage: node prepare-preview-files.js <pages-json> <public-dir> <staging-dir>
 * Example: node prepare-preview-files.js '["/influxdb3/core/"]' public preview-staging
 */

import {
  cpSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { dirname, join } from 'path';

// Asset directories to copy (Hugo outputs these as directories)
const ASSET_DIRS = ['js', 'fonts', 'img', 'favicons'];

// File patterns to copy from public root (Hugo fingerprints CSS at root level)
const ROOT_FILE_PATTERNS = ['.css'];

/**
 * Copy a file or directory, creating parent directories as needed
 * @param {string} src - Source path
 * @param {string} dest - Destination path
 */
function safeCopy(src, dest) {
  if (!existsSync(src)) {
    console.log(`  ⚠️  Skipping missing: ${src}`);
    return false;
  }

  mkdirSync(dirname(dest), { recursive: true });

  const stat = statSync(src);
  if (stat.isDirectory()) {
    cpSync(src, dest, { recursive: true });
  } else {
    cpSync(src, dest);
  }
  return true;
}

/**
 * Convert URL path to public HTML path
 * @param {string} urlPath - URL path (e.g., '/influxdb3/core/')
 * @param {string} publicDir - Public directory
 * @returns {string} - HTML file path
 */
function urlToHtmlPath(urlPath, publicDir) {
  // Validate against path traversal attacks
  if (urlPath.includes('..')) {
    throw new Error(`Invalid path: Path traversal detected in "${urlPath}"`);
  }

  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  return join(publicDir, cleanPath, 'index.html');
}

/**
 * Copy page and its local assets
 * @param {string} urlPath - URL path to copy
 * @param {string} publicDir - Source public directory
 * @param {string} stagingDir - Target staging directory
 * @returns {boolean} - True if page was successfully copied
 */
function copyPage(urlPath, publicDir, stagingDir) {
  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  const srcDir = join(publicDir, cleanPath);
  const destDir = join(stagingDir, cleanPath);

  // Copy the index.html
  const htmlSrc = join(srcDir, 'index.html');
  const htmlDest = join(destDir, 'index.html');

  const success = safeCopy(htmlSrc, htmlDest);
  if (success) {
    console.log(`  ✓ ${urlPath}`);
  }

  // Copy any local assets in the same directory (images, etc.)
  if (existsSync(srcDir)) {
    const files = readdirSync(srcDir);
    for (const file of files) {
      if (file === 'index.html') continue;
      const filePath = join(srcDir, file);
      const stat = statSync(filePath);
      if (!stat.isDirectory()) {
        safeCopy(filePath, join(destDir, file));
      }
    }
  }

  return success;
}

/**
 * Generate an index page listing all preview pages
 * @param {string[]} pages - Array of URL paths
 * @param {string} stagingDir - Staging directory
 */
function generateIndexPage(pages, stagingDir) {
  const pageLinks = pages
    .map((page) => `      <li><a href=".${page}">${page}</a></li>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PR Preview</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333; }
    ul { line-height: 1.8; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .meta { color: #666; font-size: 0.9em; margin-top: 20px; }
  </style>
</head>
<body>
  <h1>PR Preview</h1>
  <p>This preview contains ${pages.length} page(s):</p>
  <ul>
${pageLinks}
  </ul>
  <p class="meta">Generated: ${new Date().toISOString()}</p>
</body>
</html>`;

  writeFileSync(join(stagingDir, 'index.html'), html);
  console.log('  ✓ index.html (page listing)');
}

/**
 * Main function to prepare preview files
 * @param {string[]} pages - Array of URL paths to deploy
 * @param {string} publicDir - Hugo public output directory
 * @param {string} stagingDir - Staging directory for preview
 */
function preparePreviewFiles(pages, publicDir, stagingDir) {
  // Validate input
  if (!Array.isArray(pages)) {
    throw new Error(
      `Invalid input: Expected 'pages' to be an array, got ${typeof pages}`
    );
  }

  console.log(`\n📦 Preparing preview files...`);
  console.log(`   Source: ${publicDir}`);
  console.log(`   Target: ${stagingDir}`);
  console.log(`   Pages: ${pages.length}\n`);

  // Create staging directory
  mkdirSync(stagingDir, { recursive: true });

  // Copy asset directories
  console.log('📁 Copying global assets...');
  for (const asset of ASSET_DIRS) {
    const src = join(publicDir, asset);
    const dest = join(stagingDir, asset);
    if (safeCopy(src, dest)) {
      console.log(`  ✓ ${asset}/`);
    }
  }

  // Copy root-level CSS files (Hugo fingerprints these at root)
  console.log('\n📁 Copying root CSS files...');
  if (existsSync(publicDir)) {
    const rootFiles = readdirSync(publicDir);
    for (const file of rootFiles) {
      if (ROOT_FILE_PATTERNS.some((pattern) => file.endsWith(pattern))) {
        const src = join(publicDir, file);
        const dest = join(stagingDir, file);
        if (safeCopy(src, dest)) {
          console.log(`  ✓ ${file}`);
        }
      }
    }
  }

  // Copy selected pages
  console.log('\n📄 Copying pages...');
  let copiedCount = 0;
  for (const page of pages) {
    if (copyPage(page, publicDir, stagingDir)) {
      copiedCount++;
    }
  }

  // Generate index page with clickable links
  generateIndexPage(pages, stagingDir);

  console.log(`\n✅ Prepared ${copiedCount} pages for preview`);
}

// CLI execution
if (process.argv[1]?.endsWith('prepare-preview-files.js')) {
  const pagesJson = process.argv[2];
  const publicDir = process.argv[3] || 'public';
  const stagingDir = process.argv[4] || 'preview-staging';

  if (!pagesJson) {
    console.error(
      'Usage: node prepare-preview-files.js <pages-json> [public-dir] [staging-dir]'
    );
    process.exit(1);
  }

  try {
    const pages = JSON.parse(pagesJson);
    preparePreviewFiles(pages, publicDir, stagingDir);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

export { preparePreviewFiles, urlToHtmlPath };
