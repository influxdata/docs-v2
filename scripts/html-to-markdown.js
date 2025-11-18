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
 * URL Pattern: Generates markdown at /path/to/page/index.md
 * This differs from llmstxt.org spec (/path/to/page/index.html.md) for:
 * - Cleaner URLs without .html.md extension
 * - Better integration with Hugo's native structure
 * - More intuitive file naming when downloaded
 * LLMs can easily adapt to this pattern for content retrieval.
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
import {
  getProductFromPath,
  initializeProductData,
} from '../dist/utils/product-mappings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize product data from YAML
await initializeProductData();

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
 * Detect product context from URL path
 * Uses shared product mappings from assets/js/utils/product-mappings.ts
 */
function detectProduct(urlPath) {
  return getProductFromPath(urlPath);
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

  // Improve list item handling - ensure proper spacing
  turndownService.addRule('listItems', {
    filter: 'li',
    replacement: function (content, node, options) {
      content = content
        .replace(/^\n+/, '') // Remove leading newlines
        .replace(/\n+$/, '\n') // Single trailing newline
        .replace(/\n/gm, '\n    '); // Indent nested content

      let prefix = options.bulletListMarker + '   '; // Dash + 3 spaces for unordered lists
      const parent = node.parentNode;

      if (parent.nodeName === 'OL') {
        const start = parent.getAttribute('start');
        const index = Array.prototype.indexOf.call(parent.children, node);
        prefix = (start ? Number(start) + index : index + 1) + '. ';
      }

      return (
        prefix +
        content +
        (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
      );
    },
  });

  // Convert HTML tables to Markdown tables
  turndownService.addRule('tables', {
    filter: 'table',
    replacement: function (content, node) {
      // Get all rows from tbody and thead
      const theadRows = Array.from(node.querySelectorAll('thead tr'));
      const tbodyRows = Array.from(node.querySelectorAll('tbody tr'));

      // If no thead/tbody, fall back to all tr elements
      const allRows =
        theadRows.length || tbodyRows.length
          ? [...theadRows, ...tbodyRows]
          : Array.from(node.querySelectorAll('tr'));

      if (allRows.length === 0) return '';

      // Extract headers from first row
      const headerRow = allRows[0];
      const headers = Array.from(headerRow.querySelectorAll('th, td')).map(
        (cell) => cell.textContent.trim()
      );

      // Build separator row
      const separator = headers.map(() => '---').join(' | ');

      // Extract data rows (skip first row which is the header)
      const dataRows = allRows
        .slice(1)
        .map((row) => {
          const cells = Array.from(row.querySelectorAll('td, th')).map((cell) =>
            cell.textContent.trim().replace(/\n/g, ' ')
          );
          return '| ' + cells.join(' | ') + ' |';
        })
        .join('\n');

      return (
        '\n| ' +
        headers.join(' | ') +
        ' |\n| ' +
        separator +
        ' |\n' +
        dataRows +
        '\n\n'
      );
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
      const emoji =
        {
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
    '.format-selector', // Remove format selector buttons (Copy page, etc.)
    '.page-feedback', // Remove page feedback form
    '#page-feedback', // Remove feedback modal
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
      '.format-selector', // Remove format selector buttons
      '.page-feedback', // Remove page feedback form
      '#page-feedback', // Remove feedback modal
      '.feedback-widget', // Remove any feedback widgets
      '.helpful', // Remove "Was this page helpful?" section
      '.feedback.block', // Remove footer feedback/support section
      'hr', // Remove horizontal rules (often used as separators before footer)
    ];

    elementsToRemove.forEach((selector) => {
      const elements = article.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Extract metadata
    const title =
      document.querySelector('h1')?.textContent?.trim() ||
      document.querySelector('title')?.textContent?.trim() ||
      'Untitled';

    const description =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ||
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content') ||
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
    const urlPath =
      '/' + relativePath.replace(/\/index\.html$/, '/').replace(/\\/g, '/');

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
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/\* \* \*\s*\n\s*\* \* \*/g, '') // Remove duplicate horizontal rules
      .replace(/\* \* \*\s*$/g, '') // Remove trailing horizontal rules
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
 * Generate enhanced frontmatter for section aggregation
 */
function generateSectionFrontmatter(metadata, urlPath, childPages) {
  const product = detectProduct(urlPath);
  const frontmatter = ['---'];

  frontmatter.push(`title: ${metadata.title} (Complete Section)`);
  if (metadata.description) {
    frontmatter.push(`description: ${metadata.description}`);
  }
  frontmatter.push(`url: ${urlPath}`);

  if (product) {
    frontmatter.push(`product: ${product.name}`);
    frontmatter.push(`product_version: ${product.version}`);
  }

  frontmatter.push('section_type: aggregated');
  frontmatter.push(`child_count: ${childPages.length}`);

  // Add child page metadata
  frontmatter.push('child_pages:');
  childPages.forEach((childPath) => {
    const childUrlPath =
      '/' +
      path
        .relative(options.publicDir, childPath)
        .replace(/\/index\.html$/, '/')
        .replace(/\\/g, '/');

    // Extract child page title
    try {
      const childHtml = fs.readFileSync(childPath, 'utf-8');
      const childDom = new JSDOM(childHtml);
      const childTitle =
        childDom.window.document.querySelector('h1')?.textContent?.trim() ||
        path.basename(path.dirname(childPath));
      childDom.window.close();

      frontmatter.push(`  - url: ${childUrlPath}`);
      frontmatter.push(`    title: ${childTitle}`);
    } catch (error) {
      // Skip if we can't read the child page
    }
  });

  const now = new Date().toISOString().split('T')[0];
  frontmatter.push(`date: ${now}`);
  frontmatter.push(`lastmod: ${now}`);

  frontmatter.push('---');
  frontmatter.push('');

  return frontmatter.join('\n');
}

/**
 * Aggregate section and child page markdown
 */
function aggregateSectionMarkdown(sectionHtmlPath) {
  try {
    const sectionDir = path.dirname(sectionHtmlPath);

    // Convert section's own content
    const sectionHtml = fs.readFileSync(sectionHtmlPath, 'utf-8');
    const sectionUrlPath =
      '/' +
      path
        .relative(options.publicDir, sectionHtmlPath)
        .replace(/\/index\.html$/, '/')
        .replace(/\\/g, '/');

    const sectionMetadata = extractArticleContent(sectionHtml, sectionHtmlPath);
    if (!sectionMetadata) {
      return null;
    }

    const turndownService = createTurndownService();
    let sectionMarkdown = turndownService.turndown(sectionMetadata.content);
    sectionMarkdown = sectionMarkdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')
      .replace(/\* \* \*\s*$/g, '')
      .trim();

    // Find and convert child pages
    const childPages = findChildPages(sectionDir);
    const childContents = [];

    for (const childPath of childPages) {
      try {
        const childHtml = fs.readFileSync(childPath, 'utf-8');
        const childMetadata = extractArticleContent(childHtml, childPath);

        if (childMetadata) {
          let childMarkdown = turndownService.turndown(childMetadata.content);
          childMarkdown = childMarkdown
            .replace(/\n{3,}/g, '\n\n')
            .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')
            .replace(/\* \* \*\s*$/g, '')
            .trim();

          // Add child page title as heading
          childContents.push(`## ${childMetadata.title}\n\n${childMarkdown}`);
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(`  ⚠️  Could not convert child page: ${childPath}`);
        }
      }
    }

    // Combine section and child content with separators
    const separator = '\n\n---\n\n';
    const aggregatedContent = [sectionMarkdown, ...childContents].join(
      separator
    );

    // Generate enhanced frontmatter
    const frontmatter = generateSectionFrontmatter(
      sectionMetadata,
      sectionUrlPath,
      childPages
    );

    // Add product context header
    const product = detectProduct(sectionUrlPath);
    let productHeader = '';
    if (product) {
      productHeader = `\n**Product**: ${product.name} (${product.version})\n\n`;
    }

    return frontmatter + productHeader + aggregatedContent;
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
    const result = convertHtmlToMarkdown(htmlFile);
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
