#!/usr/bin/env node
/**
 * Build LLM-friendly Markdown from Hugo-generated HTML
 *
 * This script generates static .md files at build time for optimal performance.
 * Two-phase approach:
 * 1. Convert HTML → individual page markdown (memory-bounded parallelism)
 * 2. Combine pages → section bundles (fast string concatenation)
 *
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import yaml from 'js-yaml';
import pLimit from 'p-limit';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create require function for CommonJS modules
const require = createRequire(import.meta.url);
const { convertToMarkdown } = require('./lib/markdown-converter.cjs');

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Minimum file size threshold for processing HTML files.
 * Files smaller than this are assumed to be Hugo alias redirects and skipped.
 *
 * Hugo alias redirects are typically 300-400 bytes (simple meta refresh pages).
 * Content pages are typically 30KB-100KB+.
 *
 * Set to 0 to disable redirect detection (process all files).
 *
 * @default 1024 (1KB) - Safe threshold with large margin
 */
const MIN_HTML_SIZE_BYTES = 1024;

/**
 * Approximate character-to-token ratio for estimation.
 * Used to estimate token count from markdown content length.
 *
 * @default 4 - Rough heuristic (4 characters ≈ 1 token)
 */
const CHARS_PER_TOKEN = 4;

// ============================================================================
// PHASE 1: HTML → MARKDOWN CONVERSION
// ============================================================================

/**
 * Phase 1: Convert all HTML files to individual page markdown
 * Uses memory-bounded parallelism to avoid OOM in CI
 */
async function buildPageMarkdown() {
  console.log('📄 Converting HTML to Markdown (individual pages)...\n');
  const startTime = Date.now();

  // Find all HTML files
  const htmlFiles = await glob('public/**/index.html', {
    ignore: ['**/node_modules/**', '**/api-docs/**'],
  });

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Memory-bounded concurrency
  // CircleCI medium (2GB RAM): 10 workers safe
  // Local development (16GB RAM): 20 workers faster
  const CONCURRENCY = process.env.CI ? 10 : 20;
  const limit = pLimit(CONCURRENCY);

  let converted = 0;
  let skipped = 0;
  const errors = [];

  // Map all files to limited-concurrency tasks
  const tasks = htmlFiles.map((htmlPath) =>
    limit(async () => {
      try {
        // Check file size before reading (skip Hugo alias redirects)
        if (MIN_HTML_SIZE_BYTES > 0) {
          const stats = await fs.stat(htmlPath);
          if (stats.size < MIN_HTML_SIZE_BYTES) {
            skipped++;
            return; // Skip redirect page
          }
        }

        // Read HTML
        const html = await fs.readFile(htmlPath, 'utf-8');

        // Derive URL path for frontmatter
        const urlPath = htmlPath
          .replace(/^public/, '')
          .replace(/\/index\.html$/, '/');

        // Convert to markdown (JSDOM + Turndown processing)
        const markdown = await convertToMarkdown(html, urlPath);

        if (!markdown) {
          skipped++;
          return;
        }

        // Write .md file next to .html
        const mdPath = htmlPath.replace(/index\.html$/, 'index.md');
        await fs.writeFile(mdPath, markdown, 'utf-8');

        converted++;

        // Progress logging
        if (converted % 100 === 0) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = ((converted / (Date.now() - startTime)) * 1000).toFixed(
            0
          );
          const memUsed = (
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(0);
          console.log(
            `  ✓ ${converted}/${htmlFiles.length} (${rate}/sec, ${elapsed}s elapsed, ${memUsed}MB memory)`
          );
        }
      } catch (error) {
        errors.push({ file: htmlPath, error: error.message });
        console.error(`  ✗ ${htmlPath}: ${error.message}`);
      }
    })
  );

  // Execute all tasks (p-limit ensures only CONCURRENCY run simultaneously)
  await Promise.all(tasks);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const rate = ((converted / (Date.now() - startTime)) * 1000).toFixed(0);

  console.log(`\n✅ Converted ${converted} files (${rate}/sec)`);
  if (MIN_HTML_SIZE_BYTES > 0) {
    console.log(
      `⏭️  Skipped ${skipped} files (Hugo alias redirects < ${MIN_HTML_SIZE_BYTES} bytes)`
    );
  } else {
    console.log(`⏭️  Skipped ${skipped} files (no article content)`);
  }
  console.log(`⏱️  Phase 1 time: ${duration}s`);

  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} errors occurred`);
  }

  console.log('');

  return { converted, skipped, errors };
}

/**
 * Phase 2: Build section bundles by combining individual markdown files
 * Fast string concatenation with minimal memory usage
 */
async function buildSectionBundles() {
  console.log('📦 Building section bundles...\n');
  const startTime = Date.now();

  // Find all sections (directories with index.md + child index.md files)
  const sections = await findSections();

  console.log(`Found ${sections.length} sections\n`);

  let built = 0;
  const errors = [];

  // High concurrency OK - just string operations, minimal memory
  const limit = pLimit(50);

  const tasks = sections.map((section) =>
    limit(async () => {
      try {
        // Read parent markdown
        const parentMd = await fs.readFile(section.mdPath, 'utf-8');

        // Read all child markdowns
        const childMds = await Promise.all(
          section.children.map(async (child) => ({
            markdown: await fs.readFile(child.mdPath, 'utf-8'),
            url: child.url,
            title: child.title,
          }))
        );

        // Combine markdown files (string manipulation only)
        const combined = combineMarkdown(parentMd, childMds, section.url);

        // Write section bundle
        const sectionMdPath = section.mdPath.replace(
          /index\.md$/,
          'index.section.md'
        );
        await fs.writeFile(sectionMdPath, combined, 'utf-8');

        built++;

        if (built % 50 === 0) {
          console.log(`  ✓ Built ${built}/${sections.length} sections`);
        }
      } catch (error) {
        errors.push({ section: section.url, error: error.message });
        console.error(`  ✗ ${section.url}: ${error.message}`);
      }
    })
  );

  await Promise.all(tasks);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Built ${built} section bundles`);
  console.log(`⏱️  Phase 2 time: ${duration}s`);

  if (errors.length > 0) {
    console.log(`⚠️  ${errors.length} errors occurred`);
  }

  console.log('');

  return { built, errors };
}

/**
 * Find all sections (parent pages with child pages)
 */
async function findSections() {
  const allMdFiles = await glob('public/**/index.md');
  const sections = [];

  for (const mdPath of allMdFiles) {
    const dir = path.dirname(mdPath);

    // Find child directories with index.md
    const childMdFiles = await glob(path.join(dir, '*/index.md'));

    if (childMdFiles.length === 0) continue; // Not a section

    sections.push({
      mdPath: mdPath,
      url: dir.replace(/^public/, '') + '/',
      children: childMdFiles.map((childMdPath) => ({
        mdPath: childMdPath,
        url: path.dirname(childMdPath).replace(/^public/, '') + '/',
        title: extractTitleFromMd(childMdPath),
      })),
    });
  }

  return sections;
}

/**
 * Extract title from markdown file (quick regex, no full parsing)
 */
function extractTitleFromMd(mdPath) {
  try {
    const content = readFileSync(mdPath, 'utf-8');
    const match = content.match(/^---[\s\S]+?title:\s*(.+?)$/m);
    return match ? match[1].trim() : 'Untitled';
  } catch {
    return 'Untitled';
  }
}

/**
 * Combine parent and child markdown into section bundle
 */
function combineMarkdown(parentMd, childMds, sectionUrl) {
  // Parse parent frontmatter + content
  const parent = parseMarkdown(parentMd);

  // Parse child frontmatter + content
  const children = childMds.map(({ markdown, url, title }) => {
    const child = parseMarkdown(markdown);

    // Remove h1 heading (will be added as h2 to avoid duplicate)
    const contentWithoutH1 = child.content.replace(/^#\s+.+?\n+/, '');

    return {
      title: child.frontmatter.title || title,
      url: url,
      content: `## ${child.frontmatter.title || title}\n\n${contentWithoutH1}`,
      tokens: child.frontmatter.estimated_tokens || 0,
    };
  });

  // Calculate total tokens
  const totalTokens =
    (parent.frontmatter.estimated_tokens || 0) +
    children.reduce((sum, c) => sum + c.tokens, 0);

  // Sanitize description (remove newlines, truncate to reasonable length)
  let description = parent.frontmatter.description || '';
  description = description
    .replace(/\s+/g, ' ') // Replace all whitespace (including newlines) with single space
    .trim()
    .substring(0, 500); // Truncate to 500 characters max

  // Build section frontmatter object (will be serialized to YAML)
  const frontmatterObj = {
    title: parent.frontmatter.title,
    description: description,
    url: sectionUrl,
    product: parent.frontmatter.product || '',
    type: 'section',
    pages: children.length + 1,
    estimated_tokens: totalTokens,
    child_pages: children.map((c) => ({
      url: c.url,
      title: c.title,
    })),
  };

  // Serialize to YAML (handles special characters properly)
  const sectionFrontmatter =
    '---\n' +
    yaml
      .dump(frontmatterObj, {
        lineWidth: -1, // Disable line wrapping
        noRefs: true, // Disable anchors/aliases
      })
      .trim() +
    '\n---';

  // Combine all content
  const allContent = [parent.content, ...children.map((c) => c.content)].join(
    '\n\n---\n\n'
  );

  return `${sectionFrontmatter}\n\n${allContent}\n`;
}

/**
 * Parse markdown into frontmatter + content
 */
function parseMarkdown(markdown) {
  const match = markdown.match(/^---\n([\s\S]+?)\n---\n\n([\s\S]+)$/);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  try {
    const frontmatter = yaml.load(match[1]);
    const content = match[2];
    return { frontmatter, content };
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error.message);
    return { frontmatter: {}, content: markdown };
  }
}

// ============================================================================
// COMMAND-LINE ARGUMENT PARSING
// ============================================================================

/**
 * Parse command-line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    environment: null,
  };

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '-e' || args[i] === '--env') && args[i + 1]) {
      options.environment = args[++i];
    }
  }

  return options;
}

// Parse arguments and set environment
const cliOptions = parseArgs();
if (cliOptions.environment) {
  process.env.HUGO_ENV = cliOptions.environment;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Building LLM-friendly Markdown\n');

  // Show environment if specified
  if (cliOptions.environment) {
    console.log(`🌍 Environment: ${cliOptions.environment}\n`);
  }

  console.log('════════════════════════════════\n');

  const overallStart = Date.now();

  // Phase 1: Generate individual page markdown
  const pageResults = await buildPageMarkdown();

  // Phase 2: Build section bundles
  const sectionResults = await buildSectionBundles();

  // Summary
  const totalDuration = ((Date.now() - overallStart) / 1000).toFixed(1);
  const totalFiles = pageResults.converted + sectionResults.built;

  console.log('════════════════════════════════\n');
  console.log('📊 Summary:');
  console.log(`   Pages: ${pageResults.converted}`);
  console.log(`   Sections: ${sectionResults.built}`);
  console.log(`   Total: ${totalFiles} markdown files`);
  console.log(`   Skipped: ${pageResults.skipped} (no article content)`);

  const totalErrors = pageResults.errors.length + sectionResults.errors.length;
  if (totalErrors > 0) {
    console.log(`   Errors: ${totalErrors}`);
  }

  console.log(`   Time: ${totalDuration}s\n`);

  // Exit with error code if there were errors
  if (totalErrors > 0) {
    process.exit(1);
  }
}

// Run if called directly
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Export functions for testing
export {
  buildPageMarkdown,
  buildSectionBundles,
  findSections,
  combineMarkdown,
  parseMarkdown,
};
