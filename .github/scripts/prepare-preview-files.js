/**
 * Prepare Preview Files
 * Copies selected pages and required assets to a staging directory for deployment.
 *
 * Usage: node prepare-preview-files.js <pages-json> <public-dir> <staging-dir>
 * Example: node prepare-preview-files.js '["/influxdb3/core/"]' public preview-staging
 */

import { cpSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';

const GLOBAL_ASSETS = ['css', 'js', 'fonts', 'img', 'favicons'];

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
  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  return join(publicDir, cleanPath, 'index.html');
}

/**
 * Copy page and its local assets
 * @param {string} urlPath - URL path to copy
 * @param {string} publicDir - Source public directory
 * @param {string} stagingDir - Target staging directory
 */
function copyPage(urlPath, publicDir, stagingDir) {
  const cleanPath = urlPath.replace(/^\/|\/$/g, '');
  const srcDir = join(publicDir, cleanPath);
  const destDir = join(stagingDir, cleanPath);

  // Copy the index.html
  const htmlSrc = join(srcDir, 'index.html');
  const htmlDest = join(destDir, 'index.html');

  if (safeCopy(htmlSrc, htmlDest)) {
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
}

/**
 * Main function to prepare preview files
 * @param {string[]} pages - Array of URL paths to deploy
 * @param {string} publicDir - Hugo public output directory
 * @param {string} stagingDir - Staging directory for preview
 */
function preparePreviewFiles(pages, publicDir, stagingDir) {
  console.log(`\n📦 Preparing preview files...`);
  console.log(`   Source: ${publicDir}`);
  console.log(`   Target: ${stagingDir}`);
  console.log(`   Pages: ${pages.length}\n`);

  // Create staging directory
  mkdirSync(stagingDir, { recursive: true });

  // Copy global assets first
  console.log('📁 Copying global assets...');
  for (const asset of GLOBAL_ASSETS) {
    const src = join(publicDir, asset);
    const dest = join(stagingDir, asset);
    if (safeCopy(src, dest)) {
      console.log(`  ✓ ${asset}/`);
    }
  }

  // Copy selected pages
  console.log('\n📄 Copying pages...');
  let copiedCount = 0;
  for (const page of pages) {
    copyPage(page, publicDir, stagingDir);
    copiedCount++;
  }

  console.log(`\n✅ Prepared ${copiedCount} pages for preview`);
}

// CLI execution
if (process.argv[1]?.endsWith('prepare-preview-files.js')) {
  const pagesJson = process.argv[2];
  const publicDir = process.argv[3] || 'public';
  const stagingDir = process.argv[4] || 'preview-staging';

  if (!pagesJson) {
    console.error('Usage: node prepare-preview-files.js <pages-json> [public-dir] [staging-dir]');
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
