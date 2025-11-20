/**
 * Markdown Converter Library
 *
 * Core conversion logic for transforming HTML to Markdown.
 * This library is used by both:
 * - docs-v2 build scripts (html-to-markdown.js)
 * - docs-tooling Lambda@Edge function
 *
 * Exports reusable functions for HTML→Markdown conversion without
 * file system dependencies.
 */

import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';
import {
  getProductFromPath,
  initializeProductData,
} from '../../dist/utils/product-mappings.js';

// Initialize product data from YAML (called once when module loads)
await initializeProductData();

/**
 * Detect product context from URL path
 * Uses shared product mappings from assets/js/utils/product-mappings.ts
 */
export function detectProduct(urlPath) {
  return getProductFromPath(urlPath);
}

/**
 * Configure Turndown for InfluxData documentation
 */
export function createTurndownService() {
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
 * @param {string} htmlContent - Raw HTML content
 * @param {string} contextInfo - Context info for error messages (file path or URL)
 * @returns {Object|null} Object with title, description, content or null if not found
 */
export function extractArticleContent(htmlContent, contextInfo = '') {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  try {
    // Find the main article content
    const article = document.querySelector('article.article--content');
    if (!article) {
      console.warn(
        `  ⚠️  No article content found in ${contextInfo}. This is typically not a problem and represents an aliased path.`
      );
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
 * Generate frontmatter for markdown file (single page)
 * @param {Object} metadata - Object with title, description
 * @param {string} urlPath - URL path for the page
 * @returns {string} YAML frontmatter as string
 */
export function generateFrontmatter(metadata, urlPath) {
  const product = detectProduct(urlPath);
  const frontmatter = ['---'];

  frontmatter.push(`title: ${metadata.title}`);
  if (metadata.description) {
    frontmatter.push(`description: ${metadata.description}`);
  }
  frontmatter.push(`url: ${urlPath}`);

  if (product) {
    frontmatter.push(`product: ${product.name}`);
    if (product.version) {
      frontmatter.push(`version: ${product.version}`);
    }
  }

  frontmatter.push('---');
  return frontmatter.join('\n');
}

/**
 * Generate enhanced frontmatter for section aggregation
 * @param {Object} metadata - Object with title, description
 * @param {string} urlPath - URL path for the section
 * @param {Array} childPages - Array of child page objects with url and title
 * @returns {string} YAML frontmatter as string
 */
export function generateSectionFrontmatter(metadata, urlPath, childPages) {
  const product = detectProduct(urlPath);
  const frontmatter = ['---'];

  frontmatter.push(`title: ${metadata.title}`);
  if (metadata.description) {
    frontmatter.push(`description: ${metadata.description}`);
  }
  frontmatter.push(`url: ${urlPath}`);
  frontmatter.push(`type: section`);
  frontmatter.push(`pages: ${childPages.length}`);

  // Add token estimate (rough: 4 chars per token)
  const contentLength = metadata.content?.length || 0;
  const childContentLength = childPages.reduce(
    (sum, child) => sum + (child.content?.length || 0),
    0
  );
  const totalLength = contentLength + childContentLength;
  const estimatedTokens = Math.ceil(totalLength / 4);
  frontmatter.push(`estimated_tokens: ${estimatedTokens}`);

  if (product) {
    frontmatter.push(`product: ${product.name}`);
    if (product.version) {
      frontmatter.push(`version: ${product.version}`);
    }
  }

  // List child pages
  if (childPages.length > 0) {
    frontmatter.push(`child_pages:`);
    childPages.forEach((child) => {
      frontmatter.push(`  - url: ${child.url}`);
      frontmatter.push(`    title: ${child.title}`);
    });
  }

  frontmatter.push('---');
  return frontmatter.join('\n');
}

/**
 * Convert HTML content to Markdown (single page)
 * @param {string} htmlContent - Raw HTML content
 * @param {string} urlPath - URL path for the page (for frontmatter)
 * @returns {string|null} Markdown content with frontmatter or null if conversion fails
 */
export function convertToMarkdown(htmlContent, urlPath) {
  const turndownService = createTurndownService();
  const metadata = extractArticleContent(htmlContent, urlPath);

  if (!metadata) {
    return null;
  }

  // Convert HTML to markdown
  let markdown = turndownService.turndown(metadata.content);

  // Clean up excessive newlines and separator artifacts
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')
    .replace(/\* \* \*\s*$/g, '')
    .trim();

  // Generate frontmatter
  const frontmatter = generateFrontmatter(metadata, urlPath);

  return `${frontmatter}\n\n${markdown}\n`;
}

/**
 * Convert section HTML with child pages to aggregated Markdown
 * @param {string} sectionHtml - HTML content of the section index page
 * @param {string} sectionUrlPath - URL path for the section
 * @param {Array} childHtmls - Array of objects with {html, url} for each child page
 * @returns {string|null} Aggregated markdown content or null if conversion fails
 */
export function convertSectionToMarkdown(
  sectionHtml,
  sectionUrlPath,
  childHtmls
) {
  const turndownService = createTurndownService();

  // Extract section metadata and content
  const sectionMetadata = extractArticleContent(sectionHtml, sectionUrlPath);
  if (!sectionMetadata) {
    return null;
  }

  // Convert section content to markdown
  let sectionMarkdown = turndownService.turndown(sectionMetadata.content);
  sectionMarkdown = sectionMarkdown
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')
    .replace(/\* \* \*\s*$/g, '')
    .trim();

  // Process child pages
  const childContents = [];
  const childPageInfo = [];

  for (const { html, url } of childHtmls) {
    const childMetadata = extractArticleContent(html, url);
    if (childMetadata) {
      let childMarkdown = turndownService.turndown(childMetadata.content);
      childMarkdown = childMarkdown
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\* \* \*\s*\n\s*\* \* \*/g, '')
        .replace(/\* \* \*\s*$/g, '')
        .trim();

      // Remove the first h1 heading (page title) to avoid redundancy
      // since we're adding it as an h2 heading
      childMarkdown = childMarkdown.replace(/^#\s+.+?\n+/, '');

      // Add child page title as heading
      childContents.push(`## ${childMetadata.title}\n\n${childMarkdown}`);

      // Track child page info for frontmatter
      childPageInfo.push({
        url: url,
        title: childMetadata.title,
        content: childMarkdown,
      });
    }
  }

  // Generate section frontmatter with child page info
  const frontmatter = generateSectionFrontmatter(
    { ...sectionMetadata, content: sectionMarkdown },
    sectionUrlPath,
    childPageInfo
  );

  // Combine section content with child pages
  const allContent = [sectionMarkdown, ...childContents].join('\n\n---\n\n');

  return `${frontmatter}\n\n${allContent}\n`;
}
