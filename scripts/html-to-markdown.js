#!/usr/bin/env node

/**
 * HTML to Markdown Converter for InfluxData Documentation
 *
 * Converts Hugo-generated HTML files to clean Markdown with:
 * - Evaluated shortcodes (no raw Hugo syntax)
 * - Dereferenced shared content
 * - Removed comments
 * - Product context in frontmatter
 *
 * Usage:
 *   node scripts/html-to-markdown.js [options]
 *
 * Options:
 *   --path <path>    Process specific path (default: public/)
 *   --limit <n>      Limit number of files to process (for testing)
 *   --verbose        Enable verbose logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

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
 * Product context mapping based on URL paths
 */
const PRODUCT_MAP = {
  '/influxdb3/core/': { name: 'InfluxDB 3 Core', version: 'core' },
  '/influxdb3/enterprise/': { name: 'InfluxDB 3 Enterprise', version: 'enterprise' },
  '/influxdb3/cloud-dedicated/': { name: 'InfluxDB Cloud Dedicated', version: 'cloud-dedicated' },
  '/influxdb3/cloud-serverless/': { name: 'InfluxDB Cloud Serverless', version: 'cloud-serverless' },
  '/influxdb3/clustered/': { name: 'InfluxDB Clustered', version: 'clustered' },
  '/influxdb/cloud/': { name: 'InfluxDB Cloud (TSM)', version: 'cloud' },
  '/influxdb/v2': { name: 'InfluxDB OSS v2', version: 'v2' },
  '/influxdb/v1': { name: 'InfluxDB OSS v1', version: 'v1' },
  '/enterprise_influxdb/': { name: 'InfluxDB Enterprise v1', version: 'v1' },
  '/telegraf/': { name: 'Telegraf', version: 'v1' },
  '/chronograf/': { name: 'Chronograf', version: 'v1' },
  '/kapacitor/': { name: 'Kapacitor', version: 'v1' },
  '/flux/': { name: 'Flux', version: 'v0' },
  '/influxdb3_explorer/': { name: 'InfluxDB 3 Explorer', version: 'explorer' },
};

/**
 * Detect product context from URL path
 */
function detectProduct(urlPath) {
  for (const [pathPrefix, product] of Object.entries(PRODUCT_MAP)) {
    if (urlPath.startsWith(pathPrefix)) {
      return product;
    }
  }
  return null;
}

/**
 * Configure Turndown for InfluxData documentation
 */
function createTurndownService() {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '*',
    strongDelimiter: '**',
    // Note: linkStyle: 'inline' breaks link conversion in Turndown 7.2.2
    // Using default 'referenced' style which works correctly
    bulletListMarker: '-',
  });

  // Preserve code block language identifiers
  turndownService.addRule('fencedCodeBlock', {
    filter: function (node, options) {
      return (
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      );
    },
    replacement: function (content, node, options) {
      const code = node.firstChild;
      const language = code.className.replace(/^language-/, '') || '';
      const fence = options.fence;
      return `\n\n${fence}${language}\n${code.textContent}\n${fence}\n\n`;
    },
  });

  // Handle GitHub-style callouts (notes, warnings, etc.)
  turndownService.addRule('githubCallouts', {
    filter: function (node) {
      return (
        node.nodeName === 'BLOCKQUOTE' &&
        node.classList &&
        (node.classList.contains('note') ||
          node.classList.contains('warning') ||
          node.classList.contains('important') ||
          node.classList.contains('tip') ||
          node.classList.contains('caution'))
      );
    },
    replacement: function (content, node) {
      const type = Array.from(node.classList).find((c) =>
        ['note', 'warning', 'important', 'tip', 'caution'].includes(c)
      );
      const emoji = {
        note: 'Note',
        warning: 'Warning',
        caution: 'Caution',
        important: 'Important',
        tip: 'Tip',
      }[type] || 'Note';

      return `\n> [!${emoji}]\n> ${content.trim().replace(/\n/g, '\n> ')}\n\n`;
    },
  });

  // Remove navigation, footer, and other non-content elements
  turndownService.remove([
    'nav',
    'header',
    'footer',
    'script',
    'style',
    'noscript',
    'iframe',
    '.format-selector',  // Remove format selector buttons (Copy page, etc.)
    '.page-feedback',    // Remove page feedback form
    '#page-feedback',    // Remove feedback modal
  ]);

  return turndownService;
}

/**
 * Extract article content from HTML
 */
function extractArticleContent(htmlContent, filePath) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  try {
    // Find the main article content
    const article = document.querySelector('article.article--content');
    if (!article) {
      if (options.verbose) {
        console.warn(`  ⚠️  No article content found in ${filePath}`);
      }
      return null;
    }

    // Remove unwanted elements from article before conversion
    const elementsToRemove = [
      '.format-selector',     // Remove format selector buttons
      '.page-feedback',       // Remove page feedback form
      '#page-feedback',       // Remove feedback modal
      '.feedback-widget',     // Remove any feedback widgets
      '.helpful',             // Remove "Was this page helpful?" section
      '.feedback.block',      // Remove footer feedback/support section
      'hr',                   // Remove horizontal rules (often used as separators before footer)
    ];

    elementsToRemove.forEach(selector => {
      const elements = article.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Extract metadata
    const title =
      document.querySelector('h1')?.textContent?.trim() ||
      document.querySelector('title')?.textContent?.trim() ||
      'Untitled';

    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content') ||
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      '';

    // Get the content before closing the DOM
    const content = article.innerHTML;

    return {
      title,
      description,
      content,
    };
  } finally {
    // Clean up JSDOM to prevent memory leaks
    dom.window.close();
  }
}

/**
 * Generate frontmatter for markdown file
 */
function generateFrontmatter(metadata, urlPath) {
  const product = detectProduct(urlPath);
  const frontmatter = ['---'];

  frontmatter.push(`title: ${metadata.title}`);
  if (metadata.description) {
    frontmatter.push(`description: ${metadata.description}`);
  }
  frontmatter.push(`url: ${urlPath}`);

  if (product) {
    frontmatter.push(`product: ${product.name}`);
    frontmatter.push(`product_version: ${product.version}`);
  }

  const now = new Date().toISOString().split('T')[0];
  frontmatter.push(`date: ${now}`);
  frontmatter.push(`lastmod: ${now}`);

  frontmatter.push('---');
  frontmatter.push('');

  return frontmatter.join('\n');
}

/**
 * Convert single HTML file to Markdown
 */
function convertHtmlToMarkdown(htmlFilePath) {
  try {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    // Derive URL path from file path
    const relativePath = path.relative(options.publicDir, htmlFilePath);
    const urlPath = '/' + relativePath.replace(/\/index\.html$/, '/').replace(/\\/g, '/');

    // Extract article content
    const metadata = extractArticleContent(htmlContent, htmlFilePath);
    if (!metadata) {
      return null;
    }

    // Convert HTML to Markdown
    const turndownService = createTurndownService();
    let markdownContent = turndownService.turndown(metadata.content);

    // Clean up extra whitespace and unwanted elements
    markdownContent = markdownContent
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')  // Remove duplicate horizontal rules
      .replace(/\* \* \*\s*$/g, '')  // Remove trailing horizontal rules
      .trim();

    // Generate frontmatter
    const frontmatter = generateFrontmatter(metadata, urlPath);

    // Add product context header
    const product = detectProduct(urlPath);
    let productHeader = '';
    if (product) {
      productHeader = `\n**Product**: ${product.name} (${product.version})\n\n`;
    }

    // Combine frontmatter + content
    const fullMarkdown = frontmatter + productHeader + markdownContent;

    // Write to index.md in same directory
    const markdownFilePath = htmlFilePath.replace(/index\.html$/, 'index.md');
    fs.writeFileSync(markdownFilePath, fullMarkdown, 'utf-8');

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

  const totalFiles = options.limit ? Math.min(htmlFiles.length, options.limit) : htmlFiles.length;

  console.log(`📄 Found ${htmlFiles.length} HTML files`);
  if (options.limit) {
    console.log(`🎯 Processing first ${totalFiles} files (--limit ${options.limit})`);
  }
  console.log('');

  let converted = 0;
  let skipped = 0;

  const filesToProcess = htmlFiles.slice(0, totalFiles);

  for (let i = 0; i < filesToProcess.length; i++) {
    const htmlFile = filesToProcess[i];

    if (!options.verbose && i > 0 && i % 100 === 0) {
      console.log(`  Progress: ${i}/${totalFiles} files...`);
    }

    const result = convertHtmlToMarkdown(htmlFile);
    if (result) {
      converted++;
    } else {
      skipped++;
    }

    // Periodic garbage collection hint every 100 files
    if (i > 0 && i % 100 === 0 && global.gc) {
      global.gc();
    }
  }

  console.log('\n✅ Conversion complete!');
  console.log(`   Converted: ${converted} files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log(`   Total: ${totalFiles} files processed`);
}

// Run main function
main();
