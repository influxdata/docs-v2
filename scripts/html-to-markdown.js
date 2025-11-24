#!/usr/bin/env node

/**
 * HTML to Markdown Converter CLI for InfluxData Documentation
 *
 * Generates LLM-friendly Markdown from Hugo-generated HTML documentation.
 * This script is the local CLI companion to the Lambda@Edge function that serves
 * Markdown on-demand at docs.influxdata.com.
 *
 * ## Architecture
 *
 * The core conversion logic lives in ./lib/markdown-converter.js, which is shared
 * between this CLI tool and the Lambda@Edge function in deploy/llm-markdown/.
 * This ensures local builds and production Lambda use identical conversion logic.
 *
 * ## Prerequisites
 *
 * Before running this script, you must:
 *
 * 1. Install dependencies:
 *    ```bash
 *    yarn install
 *    ```
 *
 * 2. Compile TypeScript (for product mappings):
 *    ```bash
 *    yarn build:ts
 *    ```
 *
 * 3. Build the Hugo site:
 *    ```bash
 *    npx hugo --quiet
 *    ```
 *
 * ## Usage
 *
 * Basic usage:
 *   ```bash
 *   node scripts/html-to-markdown.js [options]
 *   ```
 *
 * ## Options
 *
 *   --path <path>    Process specific content path relative to public/ directory
 *                    Example: influxdb3/core/get-started
 *
 *   --limit <n>      Limit number of files to process (useful for testing)
 *                    Example: --limit 10
 *
 *   --verbose        Enable detailed logging showing each file processed
 *
 * ## Examples
 *
 * Generate Markdown for all documentation:
 *   ```bash
 *   node scripts/html-to-markdown.js
 *   ```
 *
 * Generate Markdown for InfluxDB 3 Core documentation:
 *   ```bash
 *   node scripts/html-to-markdown.js --path influxdb3/core
 *   ```
 *
 * Generate Markdown for a specific section (testing):
 *   ```bash
 *   node scripts/html-to-markdown.js --path influxdb3/core/get-started --limit 10
 *   ```
 *
 * Generate with verbose output:
 *   ```bash
 *   node scripts/html-to-markdown.js --path influxdb3/core --limit 5 --verbose
 *   ```
 *
 * ## Output Files
 *
 * This script generates two types of Markdown files:
 *
 * 1. **Single page**: `index.md`
 *    - Mirrors the HTML page structure
 *    - Contains YAML frontmatter with title, description, URL, product info
 *    - Located alongside the source `index.html`
 *
 * 2. **Section aggregation**: `index.section.md`
 *    - Combines parent page + all child pages in one file
 *    - Optimized for LLM context windows
 *    - Only generated for pages that have child pages
 *    - Enhanced frontmatter includes child page list and token estimate
 *
 * ## Frontmatter Structure
 *
 * Single page frontmatter:
 *   ```yaml
 *   ---
 *   title: Page Title
 *   description: Page description from meta tags
 *   url: /influxdb3/core/path/to/page/
 *   product: InfluxDB 3 Core
 *   version: core
 *   ---
 *   ```
 *
 * Section aggregation frontmatter includes additional fields:
 *   ```yaml
 *   ---
 *   title: Section Title
 *   description: Section description
 *   url: /influxdb3/core/section/
 *   type: section
 *   pages: 5
 *   estimated_tokens: 12500
 *   product: InfluxDB 3 Core
 *   version: core
 *   child_pages:
 *     - url: /influxdb3/core/section/page1/
 *       title: Page 1 Title
 *     - url: /influxdb3/core/section/page2/
 *       title: Page 2 Title
 *   ---
 *   ```
 *
 * ## Testing Generated Markdown
 *
 * Use Cypress to validate generated Markdown:
 *   ```bash
 *   node cypress/support/run-e2e-specs.js \
 *     --spec "cypress/e2e/content/markdown-content-validation.cy.js"
 *   ```
 *
 * ## Common Issues
 *
 * **Error: Directory not found**
 *   - Solution: Run `npx hugo --quiet` first to generate HTML files
 *
 * **No article content found warnings**
 *   - This is normal for alias/redirect pages
 *   - The script skips these pages automatically
 *
 * **Memory issues with large builds**
 *   - Use `--path` to process specific sections
 *   - Use `--limit` for testing with small batches
 *   - Script includes periodic garbage collection hints
 *
 * ## Related Files
 *
 * - Core logic: `scripts/lib/markdown-converter.js`
 * - Lambda handler: `deploy/llm-markdown/lambda-edge/markdown-generator/index.js`
 * - Product detection: `dist/utils/product-mappings.js` (compiled from TypeScript)
 * - Cypress tests: `cypress/e2e/content/markdown-content-validation.cy.js`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  convertToMarkdown,
  convertSectionToMarkdown,
} from './lib/markdown-converter.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  publicDir: path.join(__dirname, '..', 'public'),
  limit: null,
  verbose: false,
  specificPath: null,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--path' && args[i + 1]) {
    options.specificPath = args[++i];
  } else if (args[i] === '--limit' && args[i + 1]) {
    options.limit = parseInt(args[++i], 10);
  } else if (args[i] === '--verbose') {
    options.verbose = true;
  }
}

/**
 * Check if a directory is a section (has child directories with index.html)
 */
function isSection(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.some((file) => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      return (
        stat.isDirectory() && fs.existsSync(path.join(fullPath, 'index.html'))
      );
    });
  } catch (error) {
    return false;
  }
}

/**
 * Find all child page HTML files in a section
 */
function findChildPages(sectionPath) {
  try {
    const files = fs.readdirSync(sectionPath);
    const childPages = [];

    for (const file of files) {
      const fullPath = path.join(sectionPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const childIndexPath = path.join(fullPath, 'index.html');
        if (fs.existsSync(childIndexPath)) {
          childPages.push(childIndexPath);
        }
      }
    }

    return childPages;
  } catch (error) {
    console.error(
      `Error finding child pages in ${sectionPath}:`,
      error.message
    );
    return [];
  }
}

/**
 * Convert single HTML file to Markdown using the shared library
 */
function convertHtmlFileToMarkdown(htmlFilePath) {
  try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    // Derive URL path from file path
    const relativePath = path.relative(options.publicDir, htmlFilePath);
    const urlPath =
      '/' + relativePath.replace(/\/index\.html$/, '/').replace(/\\/g, '/');

    // Use shared conversion function
    const markdown = convertToMarkdown(htmlContent, urlPath);
    if (!markdown) {
      return null;
    }

    // Write to index.md in same directory
    const markdownFilePath = htmlFilePath.replace(/index\.html$/, 'index.md');
    fs.writeFileSync(markdownFilePath, markdown, 'utf-8');

    if (options.verbose) {
      console.log(`  ✓ Converted: ${relativePath}`);
    }

    return markdownFilePath;
  } catch (error) {
    console.error(`  ✗ Error converting ${htmlFilePath}:`, error.message);
    return null;
  }
}

/**
 * Aggregate section and child page markdown using the shared library
 */
function aggregateSectionMarkdown(sectionHtmlPath) {
  try {
    const sectionDir = path.dirname(sectionHtmlPath);

    // Read section HTML
    const sectionHtml = fs.readFileSync(sectionHtmlPath, 'utf-8');

    // Derive URL path
    const sectionUrlPath =
      '/' +
      path
        .relative(options.publicDir, sectionHtmlPath)
        .replace(/\/index\.html$/, '/')
        .replace(/\\/g, '/');

    // Find and read child pages
    const childPaths = findChildPages(sectionDir);
    const childHtmls = [];

    for (const childPath of childPaths) {
      try {
        const childHtml = fs.readFileSync(childPath, 'utf-8');
        const childUrl =
          '/' +
          path
            .relative(options.publicDir, childPath)
            .replace(/\/index\.html$/, '/')
            .replace(/\\/g, '/');

        childHtmls.push({ html: childHtml, url: childUrl });
      } catch (error) {
        if (options.verbose) {
          console.warn(`  ⚠️  Could not read child page: ${childPath}`);
        }
      }
    }

    // Use shared conversion function
    const markdown = convertSectionToMarkdown(
      sectionHtml,
      sectionUrlPath,
      childHtmls
    );

    return markdown;
  } catch (error) {
    console.error(
      `Error aggregating section ${sectionHtmlPath}:`,
      error.message
    );
    return null;
  }
}

/**
 * Find all HTML files recursively
 */
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file === 'index.html') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting HTML to Markdown conversion...\n');

  const startDir = options.specificPath
    ? path.join(options.publicDir, options.specificPath)
    : options.publicDir;

  if (!fs.existsSync(startDir)) {
    console.error(`❌ Error: Directory not found: ${startDir}`);
    console.error('   Run "npx hugo --quiet" first to generate HTML files.');
    process.exit(1);
  }

  console.log(`📂 Scanning: ${path.relative(process.cwd(), startDir)}`);

  const htmlFiles = findHtmlFiles(startDir);

  // Sort files by depth (shallow first) so root index.html files are processed first
  htmlFiles.sort((a, b) => {
    const depthA = a.split(path.sep).length;
    const depthB = b.split(path.sep).length;
    return depthA - depthB;
  });

  const totalFiles = options.limit
    ? Math.min(htmlFiles.length, options.limit)
    : htmlFiles.length;

  console.log(`📄 Found ${htmlFiles.length} HTML files`);
  if (options.limit) {
    console.log(
      `🎯 Processing first ${totalFiles} files (--limit ${options.limit})`
    );
  }
  console.log('');

  let converted = 0;
  let skipped = 0;
  let sectionsGenerated = 0;

  const filesToProcess = htmlFiles.slice(0, totalFiles);

  for (let i = 0; i < filesToProcess.length; i++) {
    const htmlFile = filesToProcess[i];

    if (!options.verbose && i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${totalFiles} files...`);
    }

    // Generate regular index.md
    const result = convertHtmlFileToMarkdown(htmlFile);
    if (result) {
      converted++;
    } else {
      skipped++;
    }

    // Check if this is a section and generate aggregated markdown
    const htmlDir = path.dirname(htmlFile);
    if (result && isSection(htmlDir)) {
      try {
        const sectionMarkdown = aggregateSectionMarkdown(htmlFile);
        if (sectionMarkdown) {
          const sectionFilePath = htmlFile.replace(
            /index\.html$/,
            'index.section.md'
          );
          fs.writeFileSync(sectionFilePath, sectionMarkdown, 'utf-8');
          sectionsGenerated++;

          if (options.verbose) {
            const relativePath = path.relative(
              options.publicDir,
              sectionFilePath
            );
            console.log(`  ✓ Generated section: ${relativePath}`);
          }
        }
      } catch (error) {
        console.error(
          `  ✗ Error generating section for ${htmlFile}:`,
          error.message
        );
      }
    }

    // Periodic garbage collection hint every 100 files
    if (i > 0 && i % 100 === 0 && global.gc) {
      global.gc();
    }
  }

  console.log('\n✅ Conversion complete!');
  console.log(`   Converted: ${converted} files`);
  console.log(`   Sections: ${sectionsGenerated} aggregated files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log(`   Total: ${totalFiles} files processed`);
}

// Run main function
main();
