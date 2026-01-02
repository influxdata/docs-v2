#!/usr/bin/env node
/**
 * Generate OpenAPI Articles Script
 *
 * Generates Hugo data files and content pages from OpenAPI specifications
 * for all InfluxDB products.
 *
 * This script:
 * 1. Runs getswagger.sh to fetch/bundle OpenAPI specs
 * 2. Copies specs to static directory for download
 * 3. Generates path group fragments (YAML and JSON)
 * 4. Creates article metadata (YAML and JSON)
 * 5. Generates Hugo content pages from article data
 *
 * Usage:
 *   node generate-openapi-articles.js                    # Generate all products
 *   node generate-openapi-articles.js cloud-v2           # Generate single product
 *   node generate-openapi-articles.js cloud-v2 oss-v2    # Generate multiple products
 *
 * @module generate-openapi-articles
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Import the OpenAPI to Hugo converter
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');

/**
 * Operation metadata structure from tag-based articles
 */
interface OperationMeta {
  operationId: string;
  method: string;
  path: string;
  summary: string;
  tags: string[];
  /** Compatibility version (v1 or v2) for migration context */
  compatVersion?: string;
  /** External documentation link */
  externalDocs?: {
    description: string;
    url: string;
  };
}

/**
 * Product configuration for API generation
 */
interface ProductConfig {
  /** Path to the OpenAPI spec file */
  specFile: string;
  /** Path to the Hugo content directory for generated pages */
  pagesDir: string;
  /** Optional description of the product */
  description?: string;
  /** Hugo menu identifier for this product (e.g., 'influxdb3_core') */
  menuKey?: string;
  /** Skip adding menu entry to generated parent page (use when existing reference page has menu entry) */
  skipParentMenu?: boolean;
  /** Use tag-based generation instead of path-based (default: false) */
  useTagBasedGeneration?: boolean;
}

/**
 * Map of product identifiers to their configuration
 */
type ProductConfigMap = Record<string, ProductConfig>;

// Calculate the relative paths
const DOCS_ROOT = '.';
const API_DOCS_ROOT = 'api-docs';

// CLI flags
const validateLinks = process.argv.includes('--validate-links');

/**
 * Execute a shell command and handle errors
 *
 * @param command - Command to execute
 * @param description - Human-readable description of the command
 * @throws Exits process with code 1 on error
 */
function execCommand(command: string, description?: string): void {
  try {
    if (description) {
      console.log(`\n${description}...`);
    }
    console.log(`Executing: ${command}\n`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Error executing command: ${command}`);
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

/**
 * Generate a clean static directory name from a product key.
 * Handles the influxdb3_* products to avoid redundant 'influxdb-influxdb3' prefixes.
 *
 * @param productKey - Product identifier (e.g., 'cloud-v2', 'influxdb3_core')
 * @returns Clean directory name (e.g., 'influxdb-cloud-v2', 'influxdb3-core')
 */
function getStaticDirName(productKey: string): string {
  // For influxdb3_* products, convert underscore to hyphen and don't add prefix
  if (productKey.startsWith('influxdb3_')) {
    return productKey.replace('_', '-');
  }
  // For other products, add 'influxdb-' prefix
  return `influxdb-${productKey}`;
}

/**
 * Generate Hugo data files from OpenAPI specification
 *
 * @param specFile - Path to the OpenAPI spec file
 * @param dataOutPath - Output path for OpenAPI path fragments
 * @param articleOutPath - Output path for article metadata
 */
function generateDataFromOpenAPI(
  specFile: string,
  dataOutPath: string,
  articleOutPath: string
): void {
  if (!fs.existsSync(dataOutPath)) {
    fs.mkdirSync(dataOutPath, { recursive: true });
  }

  openapiPathsToHugo.generateHugoData({
    dataOutPath,
    articleOutPath,
    specFile,
  });
}

/**
 * Options for generating pages from article data
 */
interface GeneratePagesOptions {
  /** Path to the articles data directory */
  articlesPath: string;
  /** Output path for generated content pages */
  contentPath: string;
  /** Hugo menu identifier for navigation (e.g., 'influxdb3_core') */
  menuKey?: string;
  /** Parent menu item name (e.g., 'InfluxDB HTTP API') */
  menuParent?: string;
  /** Product description for the parent page */
  productDescription?: string;
  /** Skip adding menu entry to generated parent page */
  skipParentMenu?: boolean;
}

/**
 * Generate Hugo content pages from article data
 *
 * Creates markdown files with frontmatter from article metadata.
 * Each article becomes a page with type: api that renders via RapiDoc.
 *
 * @param options - Generation options
 */
function generatePagesFromArticleData(options: GeneratePagesOptions): void {
  const {
    articlesPath,
    contentPath,
    menuKey,
    menuParent,
    productDescription,
    skipParentMenu,
  } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');

  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }

  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent) as {
    articles: Array<{
      path: string;
      fields: Record<string, unknown>;
    }>;
  };

  if (!data.articles || !Array.isArray(data.articles)) {
    console.warn(`⚠️  No articles found in ${articlesFile}`);
    return;
  }

  // Ensure content directory exists
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
  }

  // Determine the API parent directory from the first article's path
  // e.g., if article path is "api/v1/health", the API root is "api"
  const firstArticlePath = data.articles[0]?.path || '';
  const apiRootDir = firstArticlePath.split('/')[0];

  // Generate parent _index.md for the API section
  if (apiRootDir) {
    const apiParentDir = path.join(contentPath, apiRootDir);
    const parentIndexFile = path.join(apiParentDir, '_index.md');

    if (!fs.existsSync(apiParentDir)) {
      fs.mkdirSync(apiParentDir, { recursive: true });
    }

    if (!fs.existsSync(parentIndexFile)) {
      // Build description - use product description or generate from product name
      const apiDescription =
        productDescription ||
        `Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.`;

      const parentFrontmatter: Record<string, unknown> = {
        title: menuParent || 'InfluxDB HTTP API',
        description: apiDescription,
        weight: 104,
        type: 'api',
      };

      // Add menu entry for parent page (unless skipParentMenu is true)
      if (menuKey && !skipParentMenu) {
        parentFrontmatter.menu = {
          [menuKey]: {
            name: menuParent || 'InfluxDB HTTP API',
            parent: 'Reference',
          },
        };
      }

      // Build page content with intro paragraph and children listing
      const introText = apiDescription.replace(
        'InfluxDB',
        '{{% product-name %}}'
      );
      const parentContent = `---
${yaml.dump(parentFrontmatter)}---

${introText}

{{< children >}}
`;

      fs.writeFileSync(parentIndexFile, parentContent);
      console.log(`✓ Generated parent index at ${parentIndexFile}`);
    }
  }

  // Generate a page for each article
  for (const article of data.articles) {
    const pagePath = path.join(contentPath, article.path);
    const pageFile = path.join(pagePath, '_index.md');

    // Create directory if needed
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }

    // Build frontmatter object
    // Use menuName for display (actual endpoint path like /health)
    // Fall back to name or path if menuName is not set
    const displayName =
      article.fields.menuName || article.fields.name || article.path;
    const frontmatter: Record<string, unknown> = {
      title: displayName,
      description: `API reference for ${displayName}`,
      type: 'api',
      // Use explicit layout to override Hugo's default section template lookup
      // (Hugo's section lookup ignores `type`, so we need `layout` for the 3-column API layout)
      layout: 'list',
      staticFilePath: article.fields.staticFilePath,
      weight: 100,
    };

    // Add menu entry if menuKey is provided
    // Use menuName for menu display (shows actual endpoint path like /health)
    if (menuKey) {
      frontmatter.menu = {
        [menuKey]: {
          name: displayName,
          ...(menuParent && { parent: menuParent }),
        },
      };
    }

    // Add related links if present in article fields
    if (
      article.fields.related &&
      Array.isArray(article.fields.related) &&
      article.fields.related.length > 0
    ) {
      frontmatter.related = article.fields.related;
    }

    // Add OpenAPI tags if present in article fields (for frontmatter metadata)
    if (
      article.fields.apiTags &&
      Array.isArray(article.fields.apiTags) &&
      article.fields.apiTags.length > 0
    ) {
      frontmatter.api_tags = article.fields.apiTags;
    }

    const pageContent = `---
${yaml.dump(frontmatter)}---
`;

    fs.writeFileSync(pageFile, pageContent);
  }

  console.log(
    `✓ Generated ${data.articles.length} content pages in ${contentPath}`
  );
}

/**
 * Options for generating tag-based pages from article data
 */
interface GenerateTagPagesOptions {
  /** Path to the articles data directory */
  articlesPath: string;
  /** Output path for generated content pages */
  contentPath: string;
  /** Hugo menu identifier for navigation (e.g., 'influxdb3_core') */
  menuKey?: string;
  /** Parent menu item name (e.g., 'InfluxDB HTTP API') */
  menuParent?: string;
  /** Product description for the parent page */
  productDescription?: string;
  /** Skip adding menu entry to generated parent page */
  skipParentMenu?: boolean;
  /** Map of API path to path-specific spec file (for single-operation rendering) */
  pathSpecFiles?: Map<string, string>;
}

/**
 * Generate Hugo content pages from tag-based article data
 *
 * Creates markdown files with frontmatter from article metadata.
 * Each article becomes a page with type: api that renders via RapiDoc.
 * Includes operation metadata for TOC generation.
 *
 * @param options - Generation options
 */
function generateTagPagesFromArticleData(
  options: GenerateTagPagesOptions
): void {
  const {
    articlesPath,
    contentPath,
    menuKey,
    menuParent,
    productDescription,
    skipParentMenu,
    pathSpecFiles,
  } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');

  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }

  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent) as {
    articles: Array<{
      path: string;
      fields: {
        name?: string;
        title?: string;
        description?: string;
        tag?: string;
        isConceptual?: boolean;
        showSecuritySchemes?: boolean;
        tagDescription?: string;
        menuGroup?: string;
        staticFilePath?: string;
        operations?: OperationMeta[];
        related?: string[];
      };
    }>;
  };

  if (!data.articles || !Array.isArray(data.articles)) {
    console.warn(`⚠️  No articles found in ${articlesFile}`);
    return;
  }

  // Ensure content directory exists
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
  }

  // Generate parent _index.md for the API section
  const apiParentDir = path.join(contentPath, 'api');
  const parentIndexFile = path.join(apiParentDir, '_index.md');

  if (!fs.existsSync(apiParentDir)) {
    fs.mkdirSync(apiParentDir, { recursive: true });
  }

  if (!fs.existsSync(parentIndexFile)) {
    // Build description - use product description or generate from product name
    const apiDescription =
      productDescription ||
      `Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.`;

    const parentFrontmatter: Record<string, unknown> = {
      title: menuParent || 'InfluxDB HTTP API',
      description: apiDescription,
      weight: 104,
      type: 'api',
    };

    // Add menu entry for parent page (unless skipParentMenu is true)
    if (menuKey && !skipParentMenu) {
      parentFrontmatter.menu = {
        [menuKey]: {
          name: menuParent || 'InfluxDB HTTP API',
          parent: 'Reference',
        },
      };
    }

    // Build page content with intro paragraph and children listing
    const introText = apiDescription.replace(
      'InfluxDB',
      '{{% product-name %}}'
    );
    const parentContent = `---
${yaml.dump(parentFrontmatter)}---

${introText}

{{< children >}}
`;

    fs.writeFileSync(parentIndexFile, parentContent);
    console.log(`✓ Generated parent index at ${parentIndexFile}`);
  }

  // Generate a page for each article (tag)
  for (const article of data.articles) {
    const pagePath = path.join(contentPath, article.path);
    const pageFile = path.join(pagePath, '_index.md');

    // Create directory if needed
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }

    // Build frontmatter object
    const title = article.fields.title || article.fields.name || article.path;
    const isConceptual = article.fields.isConceptual === true;

    const frontmatter: Record<string, unknown> = {
      title,
      description: article.fields.description || `API reference for ${title}`,
      type: 'api',
      layout: isConceptual ? 'single' : 'list',
      staticFilePath: article.fields.staticFilePath,
      weight: 100,
      // Tag-based fields
      tag: article.fields.tag,
      isConceptual,
      menuGroup: article.fields.menuGroup,
    };

    // Add operations for TOC generation (only for non-conceptual pages)
    if (
      !isConceptual &&
      article.fields.operations &&
      article.fields.operations.length > 0
    ) {
      frontmatter.operations = article.fields.operations;
    }

    // Add tag description for conceptual pages
    if (isConceptual && article.fields.tagDescription) {
      frontmatter.tagDescription = article.fields.tagDescription;
    }

    // Add showSecuritySchemes flag for authentication pages
    if (article.fields.showSecuritySchemes) {
      frontmatter.showSecuritySchemes = true;
    }

    // Note: We deliberately don't add menu entries for tag-based API pages.
    // The API sidebar navigation (api/sidebar-nav.html) handles navigation
    // for API reference pages, avoiding conflicts with existing menu items
    // like "Query data" and "Write data" that exist in the main sidebar.

    // Add related links if present in article fields
    if (
      article.fields.related &&
      Array.isArray(article.fields.related) &&
      article.fields.related.length > 0
    ) {
      frontmatter.related = article.fields.related;
    }

    const pageContent = `---
${yaml.dump(frontmatter)}---
`;

    fs.writeFileSync(pageFile, pageContent);
  }

  console.log(
    `✓ Generated ${data.articles.length} tag-based content pages in ${contentPath}`
  );

  // Generate individual operation pages for standalone URLs
  generateOperationPages({
    articlesPath,
    contentPath,
    pathSpecFiles,
  });
}

/**
 * Options for generating operation pages
 */
interface GenerateOperationPagesOptions {
  /** Path to the articles data directory */
  articlesPath: string;
  /** Output path for generated content pages */
  contentPath: string;
  /** Map of API path to path-specific spec file (for single-operation rendering) */
  pathSpecFiles?: Map<string, string>;
}

/**
 * Convert API path to URL-safe slug with normalized version prefix
 *
 * Transforms an API path to a URL-friendly format:
 * - Removes leading "/api" prefix (added by parent directory structure)
 * - Ensures all paths have a version prefix (defaults to v1 if none)
 * - Removes leading slash
 *
 * Examples:
 * - "/write" → "v1/write"
 * - "/api/v3/configure/database" → "v3/configure/database"
 * - "/api/v2/write" → "v2/write"
 * - "/health" → "v1/health"
 *
 * @param apiPath - The API path (e.g., "/write", "/api/v3/write_lp")
 * @returns URL-safe path slug with version prefix (e.g., "v1/write", "v3/configure/database")
 */
function apiPathToSlug(apiPath: string): string {
  // Remove leading "/api" prefix if present
  let normalizedPath = apiPath.replace(/^\/api/, '');
  // Remove leading slash
  normalizedPath = normalizedPath.replace(/^\//, '');

  // If path doesn't start with version prefix, add v1/
  if (!/^v\d+\//.test(normalizedPath)) {
    normalizedPath = `v1/${normalizedPath}`;
  }

  return normalizedPath;
}

/**
 * Generate standalone Hugo content pages for each API operation
 *
 * Creates individual pages at path-based URLs like /api/write/post/
 * for each operation, using RapiDoc Mini.
 *
 * When pathSpecFiles is provided, uses path-specific specs for single-operation
 * rendering (filters by method only, avoiding path prefix conflicts).
 * Falls back to tag-based specs when pathSpecFiles is not available.
 *
 * @param options - Generation options
 */
function generateOperationPages(options: GenerateOperationPagesOptions): void {
  const { articlesPath, contentPath, pathSpecFiles } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');

  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }

  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent) as {
    articles: Array<{
      path: string;
      fields: {
        name?: string;
        title?: string;
        tag?: string;
        isConceptual?: boolean;
        showSecuritySchemes?: boolean;
        staticFilePath?: string;
        operations?: OperationMeta[];
        related?: string[];
      };
    }>;
  };

  if (!data.articles || !Array.isArray(data.articles)) {
    console.warn(`⚠️  No articles found in ${articlesFile}`);
    return;
  }

  let operationCount = 0;

  // Process each article (tag) and generate pages for its operations
  for (const article of data.articles) {
    // Skip conceptual articles (they don't have operations)
    if (article.fields.isConceptual) {
      continue;
    }

    const operations = article.fields.operations || [];
    const tagSpecFile = article.fields.staticFilePath;
    const tagName = article.fields.tag || article.fields.name || '';

    for (const op of operations) {
      // Build operation page path: api/{path}/{method}/
      // e.g., /write -> api/write/post/
      // e.g., /api/v3/write_lp -> api/v3/write_lp/post/
      const pathSlug = apiPathToSlug(op.path);
      const method = op.method.toLowerCase();
      // Only add 'api/' prefix if the path doesn't already start with 'api/'
      const basePath = pathSlug.startsWith('api/')
        ? pathSlug
        : `api/${pathSlug}`;
      const operationDir = path.join(contentPath, basePath, method);
      const operationFile = path.join(operationDir, '_index.md');

      // Create directory if needed
      if (!fs.existsSync(operationDir)) {
        fs.mkdirSync(operationDir, { recursive: true });
      }

      // Build frontmatter
      const title = op.summary || `${op.method} ${op.path}`;

      // Determine spec file and match-paths based on availability of path-specific specs
      // Path-specific specs isolate the path at file level, so we only filter by method
      // This avoids substring matching issues (e.g., /admin matching /admin/regenerate)
      const pathSpecFile = pathSpecFiles?.get(op.path);
      const specFile = pathSpecFile || tagSpecFile;
      const matchPaths = pathSpecFile ? method : `${method} ${op.path}`;

      const frontmatter: Record<string, unknown> = {
        title,
        description: `API reference for ${op.method} ${op.path}`,
        type: 'api-operation',
        layout: 'operation',
        // RapiDoc Mini configuration
        specFile,
        // When using path-specific spec: just method (e.g., "post")
        // When using tag spec: method + path (e.g., "post /write")
        matchPaths,
        // Operation metadata
        operationId: op.operationId,
        method: op.method,
        apiPath: op.path,
        tag: tagName,
      };

      // Add compatibility version if present
      if (op.compatVersion) {
        frontmatter.compatVersion = op.compatVersion;
      }

      // Add related links from operation's externalDocs
      if (op.externalDocs?.url) {
        frontmatter.related = [op.externalDocs.url];
      }

      const pageContent = `---
${yaml.dump(frontmatter)}---
`;

      fs.writeFileSync(operationFile, pageContent);
      operationCount++;
    }
  }

  console.log(
    `✓ Generated ${operationCount} operation pages in ${contentPath}/api/`
  );
}

/**
 * Product configurations for all InfluxDB editions
 *
 * Maps product identifiers to their OpenAPI specs and content directories
 */
const productConfigs: ProductConfigMap = {
  // TODO: v2 products (cloud-v2, oss-v2) are disabled for now because they
  // have existing Redoc-based API reference at /reference/api/
  // Uncomment when ready to migrate v2 products to RapiDoc
  // 'cloud-v2': {
  //   specFile: path.join(API_DOCS_ROOT, 'influxdb/cloud/v2/ref.yml'),
  //   pagesDir: path.join(DOCS_ROOT, 'content/influxdb/cloud/api'),
  //   description: 'InfluxDB Cloud (v2 API)',
  //   menuKey: 'influxdb_cloud',
  // },
  // 'oss-v2': {
  //   specFile: path.join(API_DOCS_ROOT, 'influxdb/v2/v2/ref.yml'),
  //   pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v2/api'),
  //   description: 'InfluxDB OSS v2',
  //   menuKey: 'influxdb_v2',
  // },
  // InfluxDB 3 products use tag-based generation for better UX
  // Keys use underscores to match Hugo data directory structure
  influxdb3_core: {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/core/v3/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/core'),
    description: 'InfluxDB 3 Core',
    menuKey: 'influxdb3_core',
    useTagBasedGeneration: true,
  },
  influxdb3_enterprise: {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/enterprise/v3/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/enterprise'),
    description: 'InfluxDB 3 Enterprise',
    menuKey: 'influxdb3_enterprise',
    useTagBasedGeneration: true,
  },
  // Note: Cloud Dedicated, Serverless, and Clustered use management APIs
  // with paths like /accounts/{accountId}/... so we put them under /api/
  // These products have existing /reference/api/ pages with menu entries,
  // so we skip adding menu entries to the generated parent pages.
  'cloud-dedicated': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/cloud-dedicated/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-dedicated'),
    description: 'InfluxDB Cloud Dedicated',
    menuKey: 'influxdb3_cloud_dedicated',
    skipParentMenu: true,
  },
  'cloud-serverless': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/cloud-serverless/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-serverless'),
    description: 'InfluxDB Cloud Serverless',
    menuKey: 'influxdb3_cloud_serverless',
    skipParentMenu: true,
  },
  clustered: {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/clustered/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/clustered'),
    description: 'InfluxDB Clustered',
    menuKey: 'influxdb3_clustered',
    skipParentMenu: true,
  },
};

/** Fields that can contain markdown with links */
const MARKDOWN_FIELDS = new Set(['description', 'summary']);

/** Link placeholder pattern */
const LINK_PATTERN = /\/influxdb\/version\//g;

/**
 * Derive documentation root from spec file path.
 *
 * @example
 * 'api-docs/influxdb3/core/v3/ref.yml' → '/influxdb3/core'
 * 'api-docs/influxdb3/enterprise/v3/ref.yml' → '/influxdb3/enterprise'
 * 'api-docs/influxdb/v2/ref.yml' → '/influxdb/v2'
 */
function deriveProductPath(specPath: string): string {
  // Match: api-docs/(influxdb3|influxdb)/(product-or-version)/...
  const match = specPath.match(/api-docs\/(influxdb3?)\/([\w-]+)\//);
  if (!match) {
    throw new Error(`Cannot derive product path from: ${specPath}`);
  }
  return `/${match[1]}/${match[2]}`;
}

/**
 * Transform documentation links in OpenAPI spec markdown fields.
 * Replaces `/influxdb/version/` with the actual product path.
 *
 * @param spec - Parsed OpenAPI spec object
 * @param productPath - Target path (e.g., '/influxdb3/core')
 * @returns Spec with transformed links (new object, original unchanged)
 */
function transformDocLinks(
  spec: Record<string, unknown>,
  productPath: string
): Record<string, unknown> {
  function transformValue(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replace(LINK_PATTERN, `${productPath}/`);
    }
    if (Array.isArray(value)) {
      return value.map(transformValue);
    }
    if (value !== null && typeof value === 'object') {
      return transformObject(value as Record<string, unknown>);
    }
    return value;
  }

  function transformObject(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (MARKDOWN_FIELDS.has(key) && typeof value === 'string') {
        result[key] = value.replace(LINK_PATTERN, `${productPath}/`);
      } else if (value !== null && typeof value === 'object') {
        result[key] = transformValue(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return transformObject(spec);
}

/**
 * Resolve a URL path to a content file path.
 *
 * @example
 * '/influxdb3/core/api/auth/' → 'content/influxdb3/core/api/auth/_index.md'
 */
function resolveContentPath(urlPath: string, contentDir: string): string {
  const normalized = urlPath.replace(/\/$/, '');
  const indexPath = path.join(contentDir, normalized, '_index.md');
  const directPath = path.join(contentDir, normalized + '.md');

  if (fs.existsSync(indexPath)) {
    return indexPath;
  }
  if (fs.existsSync(directPath)) {
    return directPath;
  }
  return indexPath; // Return expected path for error message
}

/**
 * Validate that transformed links point to existing content.
 *
 * @param spec - Transformed OpenAPI spec
 * @param contentDir - Path to Hugo content directory
 * @returns Array of error messages for broken links
 */
function validateDocLinks(
  spec: Record<string, unknown>,
  contentDir: string
): string[] {
  const errors: string[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  function extractLinks(value: unknown, jsonPath: string): void {
    if (typeof value === 'string') {
      let match;
      while ((match = linkPattern.exec(value)) !== null) {
        const [, linkText, linkUrl] = match;
        // Only validate internal links (start with /)
        if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
          const contentPath = resolveContentPath(linkUrl, contentDir);
          if (!fs.existsSync(contentPath)) {
            errors.push(
              `Broken link at ${jsonPath}: [${linkText}](${linkUrl})`
            );
          }
        }
      }
      // Reset regex lastIndex for next string
      linkPattern.lastIndex = 0;
    } else if (Array.isArray(value)) {
      value.forEach((item, index) =>
        extractLinks(item, `${jsonPath}[${index}]`)
      );
    } else if (value !== null && typeof value === 'object') {
      for (const [key, val] of Object.entries(
        value as Record<string, unknown>
      )) {
        extractLinks(val, `${jsonPath}.${key}`);
      }
    }
  }

  extractLinks(spec, 'spec');
  return errors;
}

/**
 * Process a single product: fetch spec, generate data, and create pages
 *
 * @param productKey - Product identifier (e.g., 'cloud-v2')
 * @param config - Product configuration
 */
function processProduct(productKey: string, config: ProductConfig): void {
  console.log('\n' + '='.repeat(80));
  console.log(`Processing ${config.description || productKey}`);
  console.log('='.repeat(80));

  const staticPath = path.join(DOCS_ROOT, 'static/openapi');
  const staticDirName = getStaticDirName(productKey);
  const staticSpecPath = path.join(staticPath, `${staticDirName}.yml`);
  const staticJsonSpecPath = path.join(staticPath, `${staticDirName}.json`);
  const staticPathsPath = path.join(staticPath, `${staticDirName}/paths`);
  const articlesPath = path.join(
    DOCS_ROOT,
    `data/article_data/influxdb/${productKey}`
  );

  // Check if spec file exists
  if (!fs.existsSync(config.specFile)) {
    console.warn(`⚠️  Spec file not found: ${config.specFile}`);
    console.log('Skipping this product. Run getswagger.sh first if needed.\n');
    return;
  }

  try {
    // Step 1: Execute the getswagger.sh script to fetch/bundle the spec
    // Note: getswagger.sh must run from api-docs/ because it uses relative paths
    const getswaggerScript = path.join(API_DOCS_ROOT, 'getswagger.sh');
    if (fs.existsSync(getswaggerScript)) {
      execCommand(
        `cd ${API_DOCS_ROOT} && ./getswagger.sh ${productKey} -B`,
        `Fetching OpenAPI spec for ${productKey}`
      );
    } else {
      console.log(`⚠️  getswagger.sh not found, skipping fetch step`);
    }

    // Step 2: Ensure static directory exists
    if (!fs.existsSync(staticPath)) {
      fs.mkdirSync(staticPath, { recursive: true });
    }

    // Step 3: Load spec, transform documentation links, and write to static folder
    if (fs.existsSync(config.specFile)) {
      try {
        const yaml = require('js-yaml');
        const specContent = fs.readFileSync(config.specFile, 'utf8');
        const specObject = yaml.load(specContent) as Record<string, unknown>;

        // Transform documentation links (/influxdb/version/ -> actual product path)
        const productPath = deriveProductPath(config.specFile);
        const transformedSpec = transformDocLinks(specObject, productPath);
        console.log(`✓ Transformed documentation links to ${productPath}`);

        // Validate links if enabled
        if (validateLinks) {
          const contentDir = path.resolve(__dirname, '../../content');
          const linkErrors = validateDocLinks(transformedSpec, contentDir);
          if (linkErrors.length > 0) {
            console.warn(
              `\n⚠️  Link validation warnings for ${config.specFile}:`
            );
            linkErrors.forEach((err) => console.warn(`   ${err}`));
          }
        }

        // Write transformed spec to static folder (YAML)
        fs.writeFileSync(staticSpecPath, yaml.dump(transformedSpec));
        console.log(`✓ Wrote transformed spec to ${staticSpecPath}`);

        // Step 4: Generate JSON version of the spec
        fs.writeFileSync(
          staticJsonSpecPath,
          JSON.stringify(transformedSpec, null, 2)
        );
        console.log(`✓ Generated JSON spec at ${staticJsonSpecPath}`);
      } catch (specError) {
        console.warn(`⚠️  Could not process spec: ${specError}`);
      }
    }

    // Step 5: Generate Hugo data from OpenAPI spec (using transformed spec)
    if (config.useTagBasedGeneration) {
      // Tag-based generation: group operations by OpenAPI tag
      const staticTagsPath = path.join(staticPath, `${staticDirName}/tags`);
      console.log(`\n📋 Using tag-based generation for ${productKey}...`);
      openapiPathsToHugo.generateHugoDataByTag({
        specFile: staticSpecPath,
        dataOutPath: staticTagsPath,
        articleOutPath: articlesPath,
        includePaths: true, // Also generate path-based files for backwards compatibility
      });

      // Step 5b: Generate path-specific specs for operation pages
      // Each path gets its own spec file, enabling method-only filtering
      // This avoids substring matching issues (e.g., /admin matching /admin/regenerate)
      console.log(
        `\n📋 Generating path-specific specs in ${staticPathsPath}...`
      );
      const pathSpecFiles = openapiPathsToHugo.generatePathSpecificSpecs(
        staticSpecPath,
        staticPathsPath
      );

      // Step 6: Generate Hugo content pages from tag-based article data
      generateTagPagesFromArticleData({
        articlesPath,
        contentPath: config.pagesDir,
        menuKey: config.menuKey,
        menuParent: 'InfluxDB HTTP API',
        skipParentMenu: config.skipParentMenu,
        pathSpecFiles,
      });
    } else {
      // Path-based generation: group paths by URL prefix (legacy)
      generateDataFromOpenAPI(staticSpecPath, staticPathsPath, articlesPath);

      // Step 6: Generate Hugo content pages from path-based article data
      generatePagesFromArticleData({
        articlesPath,
        contentPath: config.pagesDir,
        menuKey: config.menuKey,
        menuParent: 'InfluxDB HTTP API',
        skipParentMenu: config.skipParentMenu,
      });
    }

    console.log(
      `\n✅ Successfully processed ${config.description || productKey}\n`
    );
  } catch (error) {
    console.error(`\n❌ Error processing ${productKey}:`, error);
    process.exit(1);
  }
}

/**
 * Main execution function
 */
function main(): void {
  const args = process.argv.slice(2);

  // Determine which products to process
  let productsToProcess: string[];

  if (args.length === 0) {
    // No arguments: process all products
    productsToProcess = Object.keys(productConfigs);
    console.log('\n📋 Processing all products...\n');
  } else {
    // Arguments provided: process only specified products
    productsToProcess = args;
    console.log(
      `\n📋 Processing specified products: ${productsToProcess.join(', ')}\n`
    );
  }

  // Validate product keys
  const invalidProducts = productsToProcess.filter(
    (key) => !productConfigs[key]
  );
  if (invalidProducts.length > 0) {
    console.error(
      `\n❌ Invalid product identifier(s): ${invalidProducts.join(', ')}`
    );
    console.error('\nValid products:');
    Object.keys(productConfigs).forEach((key) => {
      console.error(`  - ${key}: ${productConfigs[key].description}`);
    });
    process.exit(1);
  }

  // Process each product
  productsToProcess.forEach((productKey) => {
    const config = productConfigs[productKey];
    processProduct(productKey, config);
  });

  console.log('\n' + '='.repeat(80));
  console.log('✅ All products processed successfully!');
  console.log('='.repeat(80) + '\n');
}

// Execute if run directly
if (require.main === module) {
  main();
}

// Export for use as a module
export {
  productConfigs,
  processProduct,
  generateDataFromOpenAPI,
  generatePagesFromArticleData,
  deriveProductPath,
  transformDocLinks,
  validateDocLinks,
  resolveContentPath,
  MARKDOWN_FIELDS,
  LINK_PATTERN,
};
