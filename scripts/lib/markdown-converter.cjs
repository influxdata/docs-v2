/**
 * Markdown Converter Library
 *
 * Core conversion logic for transforming HTML to Markdown.
 * This library is used by both:
 * - docs-v2 build scripts (html-to-markdown.js)
 * - docs-tooling Lambda@Edge function
 *
 * Exports reusable functions for HTML→Markdown conversion
 */

const TurndownService = require('turndown');
const { JSDOM, VirtualConsole } = require('jsdom');
const yaml = require('js-yaml');

// Try to load Rust converter (10x faster), fall back to JavaScript
let rustConverter = null;
let USE_RUST = false;
try {
  rustConverter = require('../rust-markdown-converter');
  USE_RUST = true;
  console.log('✓ Rust markdown converter loaded');
} catch (err) {
  console.log('ℹ Using JavaScript converter (Rust not available)');
  rustConverter = null;
}

// Built-in product mappings (fallback since ESM module can't be required from CommonJS)
const URL_PATTERN_MAP = {
  '/influxdb3/core/': 'influxdb3_core',
  '/influxdb3/enterprise/': 'influxdb3_enterprise',
  '/influxdb3/cloud-dedicated/': 'influxdb3_cloud_dedicated',
  '/influxdb3/cloud-serverless/': 'influxdb3_cloud_serverless',
  '/influxdb3/clustered/': 'influxdb3_clustered',
  '/influxdb3/explorer/': 'influxdb3_explorer',
  '/influxdb/cloud/': 'influxdb_cloud',
  '/influxdb/v2': 'influxdb_v2',
  '/influxdb/v1': 'influxdb_v1',
  '/enterprise_influxdb/': 'enterprise_influxdb',
  '/telegraf/': 'telegraf',
  '/chronograf/': 'chronograf',
  '/kapacitor/': 'kapacitor',
  '/flux/': 'flux',
};

const PRODUCT_NAME_MAP = {
  influxdb3_core: { name: 'InfluxDB 3 Core', version: 'core' },
  influxdb3_enterprise: { name: 'InfluxDB 3 Enterprise', version: 'enterprise' },
  influxdb3_cloud_dedicated: { name: 'InfluxDB Cloud Dedicated', version: 'cloud-dedicated' },
  influxdb3_cloud_serverless: { name: 'InfluxDB Cloud Serverless', version: 'cloud-serverless' },
  influxdb3_clustered: { name: 'InfluxDB Clustered', version: 'clustered' },
  influxdb3_explorer: { name: 'InfluxDB 3 Explorer', version: 'explorer' },
  influxdb_cloud: { name: 'InfluxDB Cloud (TSM)', version: 'cloud' },
  influxdb_v2: { name: 'InfluxDB OSS v2', version: 'v2' },
  influxdb_v1: { name: 'InfluxDB OSS v1', version: 'v1' },
  enterprise_influxdb: { name: 'InfluxDB Enterprise v1', version: 'v1' },
  telegraf: { name: 'Telegraf', version: 'v1' },
  chronograf: { name: 'Chronograf', version: 'v1' },
  kapacitor: { name: 'Kapacitor', version: 'v1' },
  flux: { name: 'Flux', version: 'v0' },
};

// Note: ESM product-mappings module can't be required from CommonJS
// Using built-in mappings above instead
let productMappings = null;

// Debug mode - set to true to enable verbose logging
const DEBUG = false;

// Product data cache
let productsData = null;

/**
 * Detect base URL for the current environment
 * @returns {string} Base URL (http://localhost:1313, staging URL, or production URL)
 */
function detectBaseUrl() {
  // Check environment variables first
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  // Check if Hugo dev server is running on localhost
  if (process.env.HUGO_ENV === 'development' || process.env.NODE_ENV === 'development') {
    return 'http://localhost:1313';
  }

  // Check for staging environment
  if (process.env.HUGO_ENV === 'staging' || process.env.DEPLOY_ENV === 'staging') {
    return process.env.STAGING_URL || 'https://test2.docs.influxdata.com';
  }

  // Default to production
  return 'https://docs.influxdata.com';
}

/**
 * Initialize product data
 * Uses the product-mappings module (compiled from TypeScript)
 */
async function ensureProductDataInitialized() {
  if (productsData) {
    return;
  }

  if (productMappings && productMappings.initializeProductData) {
    try {
      await productMappings.initializeProductData();
      productsData = true; // Mark as initialized
    } catch (err) {
      console.warn('Failed to initialize product-mappings:', err.message);
      productsData = true; // Mark as initialized anyway to avoid retries
    }
  } else {
    productsData = true; // Mark as initialized (fallback mode)
  }
}

/**
 * Get product info from URL path
 * Uses built-in URL pattern maps for detection
 */
function getProductFromPath(urlPath) {
  // Find matching product key from URL patterns
  for (const [pattern, productKey] of Object.entries(URL_PATTERN_MAP)) {
    if (urlPath.includes(pattern)) {
      const productInfo = PRODUCT_NAME_MAP[productKey];
      if (productInfo) {
        return productInfo;
      }
    }
  }
  return null;
}

/**
 * Detect product context from URL path
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
    replacement: function (_content, node, options) {
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
    replacement: function (_content, node) {
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
function extractArticleContent(htmlContent, contextInfo = '') {
  // Create a virtual console to suppress CSS parsing errors
  // JSDOM attempts to parse stylesheets which is unnecessary for markdown conversion
  const virtualConsole = new VirtualConsole();
  // Optionally forward errors to console for debugging (commented out to suppress)
  // virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  const dom = new JSDOM(htmlContent, {
    virtualConsole,
    // Don't load external resources (stylesheets, scripts, images)
    resources: 'usable',
  });
  const document = dom.window.document;

  try {
    // Find the main article content
    const article = document.querySelector('article.article--content');

    // Debug logging
    if (DEBUG) {
      console.log(`[DEBUG] Looking for article in ${contextInfo}`);
      console.log(`[DEBUG] HTML length: ${htmlContent.length}`);
      console.log(`[DEBUG] Article found: ${!!article}`);
    }

    if (!article) {
      // Try alternative selectors to debug
      if (DEBUG) {
        const anyArticle = document.querySelector('article');
        const articleContent = document.querySelector('.article--content');
        console.log(`[DEBUG] Any article element: ${!!anyArticle}`);
        console.log(`[DEBUG] .article--content element: ${!!articleContent}`);
      }

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
 * @param {string} baseUrl - Base URL for full URL construction
 * @returns {string} YAML frontmatter as string
 */
function generateFrontmatter(metadata, urlPath, baseUrl = '') {
  const product = detectProduct(urlPath);

  // Sanitize description (remove newlines, truncate to reasonable length)
  let description = metadata.description || '';
  description = description
    .replace(/\s+/g, ' ')  // Replace all whitespace (including newlines) with single space
    .trim()
    .substring(0, 500);     // Truncate to 500 characters max

  // Add token estimate (rough: 4 chars per token)
  const contentLength = metadata.content?.length || 0;
  const estimatedTokens = Math.ceil(contentLength / 4);

  // Build full URL (baseUrl + path)
  const fullUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}${urlPath}` : urlPath;

  // Build frontmatter object (will be serialized to YAML)
  const frontmatterObj = {
    title: metadata.title,
    description: description,
    url: fullUrl,
    estimated_tokens: estimatedTokens
  };

  if (product) {
    frontmatterObj.product = product.name;
    if (product.version) {
      frontmatterObj.version = product.version;
    }
  }

  // Serialize to YAML (handles special characters properly)
  return '---\n' + yaml.dump(frontmatterObj, {
    lineWidth: -1, // Disable line wrapping
    noRefs: true   // Disable anchors/aliases
  }).trim() + '\n---';
}

/**
 * Generate enhanced frontmatter for section aggregation
 * @param {Object} metadata - Object with title, description
 * @param {string} urlPath - URL path for the section
 * @param {Array} childPages - Array of child page objects with url and title
 * @param {string} baseUrl - Base URL for full URL construction
 * @returns {string} YAML frontmatter as string
 */
function generateSectionFrontmatter(metadata, urlPath, childPages, baseUrl = '') {
  const product = detectProduct(urlPath);

  // Sanitize description (remove newlines, truncate to reasonable length)
  let description = metadata.description || '';
  description = description
    .replace(/\s+/g, ' ')  // Replace all whitespace (including newlines) with single space
    .trim()
    .substring(0, 500);     // Truncate to 500 characters max

  // Add token estimate (rough: 4 chars per token)
  const contentLength = metadata.content?.length || 0;
  const childContentLength = childPages.reduce(
    (sum, child) => sum + (child.content?.length || 0),
    0
  );
  const totalLength = contentLength + childContentLength;
  const estimatedTokens = Math.ceil(totalLength / 4);

  // Build full URL (baseUrl + path)
  const fullUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}${urlPath}` : urlPath;
  const normalizedBaseUrl = baseUrl ? baseUrl.replace(/\/$/, '') : '';

  // Build frontmatter object (will be serialized to YAML)
  const frontmatterObj = {
    title: metadata.title,
    description: description,
    url: fullUrl,
    type: 'section',
    pages: childPages.length,
    estimated_tokens: estimatedTokens
  };

  if (product) {
    frontmatterObj.product = product.name;
    if (product.version) {
      frontmatterObj.version = product.version;
    }
  }

  // List child pages with full URLs
  if (childPages.length > 0) {
    frontmatterObj.child_pages = childPages.map(child => ({
      url: normalizedBaseUrl ? `${normalizedBaseUrl}${child.url}` : child.url,
      title: child.title
    }));
  }

  // Serialize to YAML (handles special characters properly)
  return '---\n' + yaml.dump(frontmatterObj, {
    lineWidth: -1, // Disable line wrapping
    noRefs: true   // Disable anchors/aliases
  }).trim() + '\n---';
}

/**
 * Convert HTML content to Markdown (single page)
 * @param {string} htmlContent - Raw HTML content
 * @param {string} urlPath - URL path for the page (for frontmatter)
 * @returns {Promise<string|null>} Markdown content with frontmatter or null if conversion fails
 */
async function convertToMarkdown(htmlContent, urlPath) {
  await ensureProductDataInitialized();

  // Detect base URL for the environment
  const baseUrl = detectBaseUrl();
  if (DEBUG) {
    console.log(`[DEBUG] Base URL detected: ${baseUrl} (NODE_ENV=${process.env.NODE_ENV}, HUGO_ENV=${process.env.HUGO_ENV}, BASE_URL=${process.env.BASE_URL})`);
  }

  // Use Rust converter if available (10× faster)
  if (USE_RUST && rustConverter) {
    try {
      return rustConverter.convertToMarkdown(htmlContent, urlPath, baseUrl);
    } catch (err) {
      console.warn(`Rust conversion failed for ${urlPath}, falling back to JavaScript:`, err.message);
      // Fall through to JavaScript implementation
    }
  }

  // JavaScript fallback implementation
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

  // Generate frontmatter with full URL
  const frontmatter = generateFrontmatter(metadata, urlPath, baseUrl);

  return `${frontmatter}\n\n${markdown}\n`;
}

/**
 * Convert section HTML with child pages to aggregated Markdown
 * @param {string} sectionHtml - HTML content of the section index page
 * @param {string} sectionUrlPath - URL path for the section
 * @param {Array} childHtmls - Array of objects with {html, url} for each child page
 * @returns {Promise<string|null>} Aggregated markdown content or null if conversion fails
 */
async function convertSectionToMarkdown(
  sectionHtml,
  sectionUrlPath,
  childHtmls
) {
  await ensureProductDataInitialized();

  // Detect base URL for the environment
  const baseUrl = detectBaseUrl();

  // Use Rust converter if available (10× faster)
  if (USE_RUST && rustConverter) {
    try {
      return rustConverter.convertSectionToMarkdown(sectionHtml, sectionUrlPath, childHtmls, baseUrl);
    } catch (err) {
      console.warn(`Rust section conversion failed for ${sectionUrlPath}, falling back to JavaScript:`, err.message);
      // Fall through to JavaScript implementation
    }
  }

  // JavaScript fallback implementation
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

  // Generate section frontmatter with child page info and full URLs
  const frontmatter = generateSectionFrontmatter(
    { ...sectionMetadata, content: sectionMarkdown },
    sectionUrlPath,
    childPageInfo,
    baseUrl
  );

  // Combine section content with child pages
  const allContent = [sectionMarkdown, ...childContents].join('\n\n---\n\n');

  return `${frontmatter}\n\n${allContent}\n`;
}

// Export all functions for CommonJS
module.exports = {
  detectProduct,
  createTurndownService,
  extractArticleContent,
  generateFrontmatter,
  generateSectionFrontmatter,
  convertToMarkdown,
  convertSectionToMarkdown,
};
