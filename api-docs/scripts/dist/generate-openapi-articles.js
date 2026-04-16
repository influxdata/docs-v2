#!/usr/bin/env node
'use strict';
/**
 * Generate OpenAPI Articles Script
 *
 * Processes OpenAPI specs for Hugo-native API documentation. This script
 * expects specs to already be fetched (via getswagger.sh) and post-processed
 * (via post-process-specs.ts) before it runs.
 *
 * Modes:
 * - Default: copy specs to static/ + generate Hugo article pages
 * - --static-only: copy specs to static/ only (no article generation)
 *
 * Usage:
 *   node generate-openapi-articles.js                    # Full generation (static + articles)
 *   node generate-openapi-articles.js cloud-v2           # Single product
 *   node generate-openapi-articles.js --static-only      # Copy specs to static/ only
 *   node generate-openapi-articles.js --no-clean         # Generate without cleaning
 *   node generate-openapi-articles.js --dry-run          # Preview what would be cleaned
 *   node generate-openapi-articles.js --validate-links   # Validate documentation links
 *
 * @module generate-openapi-articles
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
exports.LINK_PATTERN =
  exports.MARKDOWN_FIELDS =
  exports.productConfigs =
    void 0;
exports.processProduct = processProduct;
exports.generateDataFromOpenAPI = generateDataFromOpenAPI;
exports.generatePagesFromArticleData = generatePagesFromArticleData;
exports.deriveProductPath = deriveProductPath;
exports.transformDocLinks = transformDocLinks;
exports.validateDocLinks = validateDocLinks;
exports.resolveContentPath = resolveContentPath;
const path = __importStar(require('path'));
const fs = __importStar(require('fs'));
// Import the OpenAPI to Hugo converter
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');
// Calculate the relative paths
const DOCS_ROOT = '.';
// Read resolved specs from _build/ (written by post-process-specs.ts).
// Source specs in api-docs/ are never read directly by this script.
const API_DOCS_ROOT = 'api-docs/_build';
// CLI flags
const validateLinks = process.argv.includes('--validate-links');
const staticOnly = process.argv.includes('--static-only');
const noClean = process.argv.includes('--no-clean');
const dryRun = process.argv.includes('--dry-run');
/**
 * File patterns to preserve (skip overwriting) during generation.
 * Set via --preserve=<glob> (may repeat). Patterns are matched against the
 * absolute path of each would-be-written file. Uses simple glob matching:
 * `*` matches any character except `/`, `**` matches across directories.
 *
 * Default is empty — all generated files are overwritten on each run.
 */
const preservePatterns = process.argv
  .filter((a) => a.startsWith('--preserve='))
  .map((a) => a.slice('--preserve='.length));
/**
 * Test whether a file path matches any --preserve glob pattern.
 * Returns true when the file should be skipped (preserved).
 */
function shouldPreserve(filePath) {
  if (preservePatterns.length === 0) return false;
  const normalized = path.resolve(filePath);
  return preservePatterns.some((pattern) => {
    const absPattern = pattern.startsWith('/')
      ? pattern
      : path.resolve(pattern);
    // Convert glob to regex: ** → .*, * → [^/]*, . → \.
    const regex = new RegExp(
      '^' +
        absPattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\*\*/g, '\x00')
          .replace(/\*/g, '[^/]*')
          .replace(/\x00/g, '.*') +
        '$'
    );
    return regex.test(normalized);
  });
}
/**
 * Write a generated file, respecting --preserve patterns.
 * Always overwrites unless the path matches a preserve pattern.
 * Returns true if the file was written, false if preserved.
 */
function writeGeneratedFile(filePath, content) {
  if (shouldPreserve(filePath)) {
    console.log(`⏭  Preserved (not overwritten): ${filePath}`);
    return false;
  }
  fs.writeFileSync(filePath, content);
  return true;
}
/**
 * Load the cross-product API path map from data/api_products.yml.
 * Returns a map of alt_link_key to API path for alt_links generation.
 * The alt_link_key matches what the Hugo product-selector template expects.
 */
function loadApiProducts() {
  const yaml = require('js-yaml');
  const apiProductsFile = path.join(DOCS_ROOT, 'data/api_products.yml');
  if (!fs.existsSync(apiProductsFile)) {
    console.warn(
      '⚠️  data/api_products.yml not found, skipping alt_links generation'
    );
    return new Map();
  }
  const content = fs.readFileSync(apiProductsFile, 'utf8');
  const productMap = yaml.load(content);
  return new Map(Object.entries(productMap || {}));
}
// Load API products at module initialization
const apiProductsMap = loadApiProducts();
/**
 * Execute a shell command and handle errors
 *
 * @param command - Command to execute
 * @param description - Human-readable description of the command
 * @throws Exits process with code 1 on error
 */
/**
 * Derive the content-relative path from a product's pagesDir.
 * This mirrors the content directory structure for data file output,
 * so data paths match content paths (e.g., influxdb3/core, influxdb/v2).
 *
 * @param pagesDir - Product content directory (e.g., './content/influxdb3/core')
 * @returns Relative path (e.g., 'influxdb3/core')
 */
function getContentRelPath(pagesDir) {
  return path.relative(path.join(DOCS_ROOT, 'content'), pagesDir);
}
/**
 * Generate a clean static directory name from a product key.
 * Handles the influxdb3_* products to avoid redundant 'influxdb-influxdb3' prefixes.
 *
 * @param productKey - Product identifier (e.g., 'cloud-v2', 'influxdb3_core')
 * @returns Clean directory name (e.g., 'influxdb-cloud-v2', 'influxdb3-core')
 */
function getStaticDirName(productKey) {
  // For influxdb3_* products, convert underscore to hyphen and don't add prefix
  if (productKey.startsWith('influxdb3_')) {
    return productKey.replace('_', '-');
  }
  // For other products, add 'influxdb-' prefix
  return `influxdb-${productKey}`;
}
/**
 * Get all paths that would be cleaned for a product
 *
 * @param productKey - Product identifier (e.g., 'influxdb3_core')
 * @param config - Product configuration
 * @returns Object with directories and files arrays
 */
function getCleanupPaths(productKey, config) {
  const staticDirName = getStaticDirName(productKey);
  const staticPath = path.join(DOCS_ROOT, 'static/openapi');
  const directories = [];
  const files = [];
  // Tag specs directory: static/openapi/{staticDirName}/
  const tagSpecsDir = path.join(staticPath, staticDirName);
  if (fs.existsSync(tagSpecsDir)) {
    directories.push(tagSpecsDir);
  }
  // Article data directory mirrors content path: data/article_data/{contentRelPath}/
  const contentRelPath = getContentRelPath(config.pagesDir);
  const articleDataDir = path.join(
    DOCS_ROOT,
    'data/article_data',
    contentRelPath
  );
  if (fs.existsSync(articleDataDir)) {
    directories.push(articleDataDir);
  }
  // Content pages directory: content/{pagesDir}/api/
  const contentApiDir = path.join(config.pagesDir, 'api');
  if (fs.existsSync(contentApiDir)) {
    directories.push(contentApiDir);
  }
  // Root spec files: static/openapi/{staticDirName}-*.yml and .json
  if (fs.existsSync(staticPath)) {
    const staticFiles = fs.readdirSync(staticPath);
    const pattern = new RegExp(`^${staticDirName}-.*\\.(yml|json)$`);
    staticFiles
      .filter((f) => pattern.test(f))
      .forEach((f) => {
        files.push(path.join(staticPath, f));
      });
  }
  return { directories, files };
}
/**
 * Clean output directories for a product before regeneration
 *
 * @param productKey - Product identifier
 * @param config - Product configuration
 */
function cleanProductOutputs(productKey, config) {
  const { directories, files } = getCleanupPaths(productKey, config);
  // Remove directories recursively
  for (const dir of directories) {
    console.log(`🧹 Removing directory: ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
  // Remove individual files
  for (const file of files) {
    console.log(`🧹 Removing file: ${file}`);
    fs.unlinkSync(file);
  }
  const total = directories.length + files.length;
  if (total > 0) {
    console.log(
      `✓ Cleaned ${directories.length} directories, ${files.length} files for ${productKey}`
    );
  }
}
/**
 * Display dry-run preview of what would be cleaned
 *
 * @param productKey - Product identifier
 * @param config - Product configuration
 */
function showDryRunPreview(productKey, config) {
  const { directories, files } = getCleanupPaths(productKey, config);
  console.log(`\nDRY RUN: Would clean the following for ${productKey}:\n`);
  if (directories.length > 0) {
    console.log('Directories to remove:');
    directories.forEach((dir) => console.log(`  - ${dir}`));
  }
  if (files.length > 0) {
    console.log('\nFiles to remove:');
    files.forEach((file) => console.log(`  - ${file}`));
  }
  if (directories.length === 0 && files.length === 0) {
    console.log('  (no files to clean)');
  }
  console.log(
    `\nSummary: ${directories.length} directories, ${files.length} files would be removed`
  );
}
/**
 * Generate Hugo data files from OpenAPI specification
 *
 * @param specFile - Path to the OpenAPI spec file
 * @param dataOutPath - Output path for OpenAPI path fragments
 * @param articleOutPath - Output path for article metadata
 */
function generateDataFromOpenAPI(specFile, dataOutPath, articleOutPath) {
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
 * Generate Hugo content pages from article data
 *
 * Creates markdown files with frontmatter from article metadata.
 * Each article becomes a page with type: api that renders via Hugo-native templates.
 *
 * @param options - Generation options
 */
function generatePagesFromArticleData(options) {
  const {
    articlesPath,
    contentPath,
    menuKey,
    menuParent,
    productDescription,
    menuParentName,
  } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');
  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }
  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent);
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
    {
      // Build description - use product description or generate from product name
      const apiDescription =
        productDescription ||
        'Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.';
      const parentFrontmatter = {
        title: menuParent || 'InfluxDB HTTP API',
        description: apiDescription,
        weight: 104,
        type: 'api',
      };
      // Add menu entry for parent page (menuParentName controls sidebar placement)
      if (menuKey && menuParentName) {
        parentFrontmatter.menu = {
          [menuKey]: {
            name: menuParent || 'InfluxDB HTTP API',
            parent: menuParentName,
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
`;
      if (writeGeneratedFile(parentIndexFile, parentContent)) {
        console.log(`✓ Generated parent index at ${parentIndexFile}`);
      }
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
    const frontmatter = {
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
    writeGeneratedFile(pageFile, pageContent);
  }
  console.log(
    `✓ Generated ${data.articles.length} content pages in ${contentPath}`
  );
}
/**
 * Generate Hugo content pages from tag-based article data
 *
 * Creates markdown files with frontmatter from article metadata.
 * Each article becomes a page with type: api that renders via Hugo-native templates.
 * Includes operation metadata for TOC generation.
 *
 * @param options - Generation options
 */
function generateTagPagesFromArticleData(options) {
  const {
    articlesPath,
    contentPath,
    menuKey,
    menuParent,
    productDescription,
    bodyExtra,
    menuParentName,
    pathSpecFiles: _pathSpecFiles,
    subSection,
    specDownloadPath: explicitSpecDownloadPath,
  } = options;
  const yaml = require('js-yaml');
  const articlesFile = path.join(articlesPath, 'articles.yml');
  if (!fs.existsSync(articlesFile)) {
    console.warn(`⚠️  Articles file not found: ${articlesFile}`);
    return;
  }
  // Read articles data
  const articlesContent = fs.readFileSync(articlesFile, 'utf8');
  const data = yaml.load(articlesContent);
  if (!data.articles || !Array.isArray(data.articles)) {
    console.warn(`⚠️  No articles found in ${articlesFile}`);
    return;
  }
  // Ensure content directory exists
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
  }
  // Determine which directory holds the tag pages:
  // - single-spec: api/
  // - multi-spec sub-section: api/{subSection}/
  const apiParentDir = path.join(contentPath, 'api');
  const tagPagesDir = subSection
    ? path.join(apiParentDir, subSection)
    : apiParentDir;
  const parentIndexFile = path.join(apiParentDir, '_index.md');
  if (!fs.existsSync(apiParentDir)) {
    fs.mkdirSync(apiParentDir, { recursive: true });
  }
  if (subSection && !fs.existsSync(tagPagesDir)) {
    fs.mkdirSync(tagPagesDir, { recursive: true });
  }
  // specDownloadPath:
  // - explicit: caller passes the exact path (fixes single-spec products with displayName)
  // - single-spec: derived from staticDirName (e.g., /openapi/influxdb3-core.yml)
  // - multi-spec sub-section: derived from per-spec slug
  //   (e.g., /openapi/influxdb-cloud-dedicated-management-api.yml)
  const specSlugFromPath = path.basename(articlesPath); // e.g., "data-api" or "management-api"
  const specDownloadPath =
    explicitSpecDownloadPath ??
    (subSection
      ? `/openapi/${options.staticDirName || path.dirname(articlesPath)}-${specSlugFromPath}.yml`
      : `/openapi/${options.staticDirName || path.basename(articlesPath)}.yml`);
  // Write api/_index.md only for single-spec products (multi-spec caller writes it)
  if (!subSection) {
    // Load page.yml overlay if it exists (for custom description and body content)
    const contentRelPath = getContentRelPath(contentPath);
    const pageOverlayPaths = [
      path.join('api-docs', contentRelPath, 'content', 'page.yml'),
      path.join('api-docs', contentRelPath, 'page.yml'),
    ];
    let pageOverlay = {};
    for (const p of pageOverlayPaths) {
      if (fs.existsSync(p)) {
        pageOverlay = yaml.load(fs.readFileSync(p, 'utf8'));
        break;
      }
    }
    // Build description - page.yml > options > default
    const apiDescription =
      pageOverlay.description ||
      productDescription ||
      'Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.';
    const effectiveBodyExtra = pageOverlay.body_extra || bodyExtra || '';
    const parentFrontmatter = {
      title: menuParent || 'InfluxDB HTTP API',
      description: apiDescription,
      weight: 104,
      type: 'api',
      specDownloadPath,
    };
    // Add aliases from page.yml (e.g., redirects from legacy hand-written pages)
    if (pageOverlay.aliases && pageOverlay.aliases.length > 0) {
      parentFrontmatter.aliases = pageOverlay.aliases;
    }
    // Add menu entry for parent page (menuParentName controls sidebar placement)
    if (menuKey && menuParentName) {
      parentFrontmatter.menu = {
        [menuKey]: {
          name: menuParent || 'InfluxDB HTTP API',
          parent: menuParentName,
        },
      };
    }
    // Add alt_links for cross-product API navigation
    if (apiProductsMap.size > 0) {
      const altLinks = {};
      apiProductsMap.forEach((apiPath, productName) => {
        altLinks[productName] = apiPath;
      });
      parentFrontmatter.alt_links = altLinks;
    }
    // Build page content with intro paragraph and children listing
    const introText = apiDescription.replace(
      'InfluxDB',
      '{{% product-name %}}'
    );
    const extraContent = effectiveBodyExtra ? `\n${effectiveBodyExtra}\n` : '';
    const parentContent = `---
${yaml.dump(parentFrontmatter)}---

${introText}
${extraContent}`;
    if (writeGeneratedFile(parentIndexFile, parentContent)) {
      console.log(`✓ Generated parent index at ${parentIndexFile}`);
    }
  }
  // For sub-sections, write a sub-section _index.md
  if (subSection) {
    const subSectionIndexFile = path.join(tagPagesDir, '_index.md');
    // Convert slug to title (data-api → Data API, management-api → Management API)
    const UPPERCASE_WORDS = new Set(['api']);
    const subSectionTitle = subSection
      .split('-')
      .map((w) =>
        UPPERCASE_WORDS.has(w)
          ? w.toUpperCase()
          : w.charAt(0).toUpperCase() + w.slice(1)
      )
      .join(' ');
    const subSectionFrontmatter = {
      title: subSectionTitle,
      description: `${subSectionTitle} reference for ${productDescription || 'InfluxDB'}.`,
      weight: subSection === 'data-api' ? 10 : 20,
      type: 'api',
      specDownloadPath,
    };
    // Add alt_links for cross-product API navigation
    if (apiProductsMap.size > 0) {
      const altLinks = {};
      apiProductsMap.forEach((apiPath, productName) => {
        altLinks[productName] = apiPath;
      });
      subSectionFrontmatter.alt_links = altLinks;
    }
    const subSectionContent = `---
${yaml.dump(subSectionFrontmatter)}---
`;
    if (writeGeneratedFile(subSectionIndexFile, subSectionContent)) {
      console.log(`✓ Generated sub-section index at ${subSectionIndexFile}`);
    }
  }
  // Generate "All endpoints" page (under tagPagesDir, not apiParentDir)
  const allEndpointsDir = path.join(tagPagesDir, 'all-endpoints');
  const allEndpointsFile = path.join(allEndpointsDir, '_index.md');
  if (!fs.existsSync(allEndpointsDir)) {
    fs.mkdirSync(allEndpointsDir, { recursive: true });
  }
  const allEndpointsFrontmatter = {
    title: 'All endpoints',
    description: 'View all API endpoints sorted by path.',
    type: 'api',
    layout: 'all-endpoints',
    weight: 999,
    isAllEndpoints: true,
  };
  // Add menu entry for all-endpoints page (single-spec only; sub-sections
  // don't add menu entries — sidebar drives navigation via article data)
  if (menuKey && !subSection) {
    allEndpointsFrontmatter.menu = {
      [menuKey]: {
        name: 'All endpoints',
        parent: menuParent || 'InfluxDB HTTP API',
      },
    };
  }
  // Add alt_links for cross-product API navigation
  if (apiProductsMap.size > 0) {
    const altLinks = {};
    apiProductsMap.forEach((apiPath, productName) => {
      altLinks[productName] = apiPath;
    });
    allEndpointsFrontmatter.alt_links = altLinks;
  }
  const allEndpointsContent = `---
${yaml.dump(allEndpointsFrontmatter)}---

All {{% product-name %}} API endpoints, sorted by path.
`;
  if (writeGeneratedFile(allEndpointsFile, allEndpointsContent)) {
    console.log(`✓ Generated all-endpoints page at ${allEndpointsFile}`);
  }
  // Generate a page for each article (tag).
  // For sub-section mode, article.path is "api/<tag-slug>"; we rewrite it to
  // "api/<subSection>/<tag-slug>" so pages land in the right directory.
  for (const article of data.articles) {
    const articleRelPath = subSection
      ? article.path.replace(/^api\//, `api/${subSection}/`)
      : article.path;
    const pagePath = path.join(contentPath, articleRelPath);
    const pageFile = path.join(pagePath, '_index.md');
    // Create directory if needed
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }
    // Build frontmatter object
    const title = article.fields.title || article.fields.name || article.path;
    const isConceptual = article.fields.isConceptual === true;
    // Determine weight: use article.fields.weight if set, otherwise default to 100
    const weight = article.fields.weight ?? 100;
    const frontmatter = {
      title,
      description: article.fields.description || `API reference for ${title}`,
      type: 'api',
      layout: isConceptual ? 'single' : 'list',
      staticFilePath: article.fields.staticFilePath,
      specDownloadPath,
      weight,
      tag: article.fields.tag,
      isConceptual,
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
    // Add client library related link for InfluxDB 3 products
    if (contentPath.includes('influxdb3/') && !isConceptual) {
      // Extract product segment from contentPath (e.g., "core" from ".../influxdb3/core")
      const influxdb3Match = contentPath.match(/influxdb3\/([^/]+)/);
      if (influxdb3Match) {
        const productSegment = influxdb3Match[1];
        const clientLibLink = {
          title: 'InfluxDB 3 API client libraries',
          href: `/influxdb3/${productSegment}/reference/client-libraries/v3/`,
        };
        const existing = frontmatter.related || [];
        const alreadyHas = existing.some(
          (r) => typeof r === 'object' && r.href === clientLibLink.href
        );
        if (!alreadyHas) {
          frontmatter.related = [...existing, clientLibLink];
        }
      }
    }
    // Add alt_links for cross-product API navigation
    if (apiProductsMap.size > 0) {
      const altLinks = {};
      apiProductsMap.forEach((apiPath, productName) => {
        altLinks[productName] = apiPath;
      });
      frontmatter.alt_links = altLinks;
    }
    const pageContent = `---
${yaml.dump(frontmatter)}---
`;
    writeGeneratedFile(pageFile, pageContent);
  }
  console.log(
    `✓ Generated ${data.articles.length} tag-based content pages in ${contentPath}`
  );
  // NOTE: Path page generation is disabled - all operations are now displayed
  // inline on tag pages using Hugo-native templates with hash-based navigation
  // for deep linking. The tag pages render all operations in a single scrollable
  // view with a server-side generated TOC for quick navigation.
}
/**
 * Merge article data from multiple specs into a single articles.yml
 *
 * Articles are merged by tag name. Operations from different specs are combined
 * into the same article if they share the same tag.
 *
 * @param articlesFiles - Array of paths to articles.yml files to merge
 * @param outputPath - Path to write the merged articles.yml
 */
function mergeArticleData(articlesFiles, outputPath) {
  const yaml = require('js-yaml');
  const mergedArticles = new Map();
  for (const file of articlesFiles) {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️  Articles file not found for merge: ${file}`);
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const data = yaml.load(content);
    if (!data.articles || !Array.isArray(data.articles)) {
      console.warn(`⚠️  No articles found in ${file}`);
      continue;
    }
    for (const article of data.articles) {
      const key = article.fields.tag || article.path;
      const existing = mergedArticles.get(key);
      if (existing) {
        // Merge operations from this spec into existing article
        if (article.fields.operations && article.fields.operations.length > 0) {
          existing.fields.operations = [
            ...(existing.fields.operations || []),
            ...article.fields.operations,
          ];
        }
        // Merge related links (dedup by href for both strings and objects)
        if (article.fields.related && article.fields.related.length > 0) {
          const existingRelated = existing.fields.related || [];
          const existingHrefs = new Set(
            existingRelated.map((r) => (typeof r === 'string' ? r : r.href))
          );
          const newRelated = article.fields.related.filter((r) => {
            const href = typeof r === 'string' ? r : r.href;
            return !existingHrefs.has(href);
          });
          existing.fields.related = [...existingRelated, ...newRelated];
        }
        // Keep the longest/most detailed description
        if (
          article.fields.description &&
          (!existing.fields.description ||
            article.fields.description.length >
              existing.fields.description.length)
        ) {
          existing.fields.description = article.fields.description;
        }
        // Merge tagDescription if not already set
        if (article.fields.tagDescription && !existing.fields.tagDescription) {
          existing.fields.tagDescription = article.fields.tagDescription;
        }
      } else {
        // Add new article
        mergedArticles.set(key, JSON.parse(JSON.stringify(article)));
      }
    }
  }
  // Convert map to array and write
  const mergedData = {
    articles: Array.from(mergedArticles.values()),
  };
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  // Write both YAML and JSON versions
  const yamlPath = outputPath.endsWith('.yml')
    ? outputPath
    : `${outputPath}.yml`;
  const jsonPath = yamlPath.replace(/\.yml$/, '.json');
  fs.writeFileSync(yamlPath, yaml.dump(mergedData));
  fs.writeFileSync(jsonPath, JSON.stringify(mergedData, null, 2));
  console.log(
    `✓ Merged ${mergedArticles.size} articles from ${articlesFiles.length} specs to ${outputPath}`
  );
}
/**
 * Product configurations for all InfluxDB editions
 *
 * Maps product identifiers to their OpenAPI specs and content directories
 */
const productConfigs = {
  // InfluxDB v2 products - use tag-based generation for consistency
  // These have existing /reference/api/ pages with menu entries,
  // so we skip adding menu entries to the generated parent pages.
  'cloud-v2': {
    specFiles: [
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb/cloud/influxdb-cloud-v2-openapi.yaml'
        ),
        displayName: 'API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/cloud'),
    description: 'InfluxDB Cloud (v2 API)',
    menuKey: 'influxdb_cloud',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  'oss-v2': {
    specFiles: [
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb/v2/influxdb-oss-v2-openapi.yaml'
        ),
        displayName: 'API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v2'),
    description: 'InfluxDB OSS v2',
    menuKey: 'influxdb_v2',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  // InfluxDB 3 products use tag-based generation for better UX
  influxdb3_core: {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/core/influxdb3-core-openapi.yaml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/core'),
    description: 'InfluxDB 3 Core',
    menuKey: 'influxdb3_core',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  influxdb3_enterprise: {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/enterprise/influxdb3-enterprise-openapi.yaml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/enterprise'),
    description: 'InfluxDB 3 Enterprise',
    menuKey: 'influxdb3_enterprise',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  // Cloud Dedicated and Clustered use multiple specs:
  // - Management API: database, token, and cluster management (runs on management console)
  // - v2 Data API: write, query, and compatibility endpoints (runs on cluster host)
  // Both specs are kept separate for downloads (different servers/auth) but article
  // data is merged so the sidebar shows functional tags from both.
  // These products have existing /reference/api/ pages with menu entries,
  // so we skip adding menu entries to the generated parent pages.
  'cloud-dedicated': {
    specFiles: [
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb3/cloud-dedicated/management/openapi.yml'
        ),
        displayName: 'Management API',
      },
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb3/cloud-dedicated/influxdb3-cloud-dedicated-openapi.yaml'
        ),
        displayName: 'Data API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-dedicated'),
    description: 'InfluxDB Cloud Dedicated',
    menuKey: 'influxdb3_cloud_dedicated',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  'cloud-serverless': {
    specFiles: [
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb3/cloud-serverless/influxdb3-cloud-serverless-openapi.yaml'
        ),
        displayName: 'API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-serverless'),
    description: 'InfluxDB Cloud Serverless',
    menuKey: 'influxdb3_cloud_serverless',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  clustered: {
    specFiles: [
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb3/clustered/management/openapi.yml'
        ),
        displayName: 'Management API',
      },
      {
        path: path.join(
          API_DOCS_ROOT,
          'influxdb3/clustered/influxdb3-clustered-openapi.yaml'
        ),
        displayName: 'Data API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/clustered'),
    description: 'InfluxDB Clustered',
    menuKey: 'influxdb3_clustered',
    menuParentName: 'Reference',
    useTagBasedGeneration: true,
  },
  // InfluxDB v1 products - use tag-based generation
  // These have existing /tools/api/ pages with menu entries,
  // so we skip adding menu entries to the generated parent pages.
  'oss-v1': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb/v1/influxdb-oss-v1-openapi.yaml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v1'),
    description: 'InfluxDB OSS v1',
    menuKey: 'influxdb_v1',
    menuParentName: 'Tools',
    useTagBasedGeneration: true,
  },
  'enterprise-v1': {
    specFile: path.join(
      API_DOCS_ROOT,
      'enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/enterprise_influxdb/v1'),
    description: 'InfluxDB Enterprise v1',
    menuKey: 'enterprise_influxdb_v1',
    menuParentName: 'Tools',
    useTagBasedGeneration: true,
  },
};
exports.productConfigs = productConfigs;
/** Fields that can contain markdown with links */
const MARKDOWN_FIELDS = new Set(['description', 'summary']);
exports.MARKDOWN_FIELDS = MARKDOWN_FIELDS;
/** Link placeholder pattern */
const LINK_PATTERN = /\/influxdb\/version\//g;
exports.LINK_PATTERN = LINK_PATTERN;
/** Absolute docs site URLs → relative paths for Hugo rendering */
const DOCS_HOST_PATTERN = /https?:\/\/docs\.influxdata\.com(\/[^\s)'"]*)/g;
/** Base URL for absolutifying links in downloadable specs */
const DOCS_BASE_URL = 'https://docs.influxdata.com';
/**
 * Derive documentation root from spec file path.
 *
 * @example
 * 'api-docs/influxdb3/core/influxdb3-core-openapi.yaml' → '/influxdb3/core'
 * 'api-docs/influxdb3/enterprise/influxdb3-enterprise-openapi.yaml' → '/influxdb3/enterprise'
 * 'api-docs/influxdb/v2/influxdb-oss-v2-openapi.yaml' → '/influxdb/v2'
 * 'api-docs/influxdb/v1/influxdb-oss-v1-openapi.yaml' → '/influxdb/v1'
 * 'api-docs/enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml' → '/enterprise_influxdb/v1'
 */
function deriveProductPath(specPath) {
  // Match: api-docs/[_build/](enterprise_influxdb|influxdb3|influxdb)/(product-or-version)/...
  const match = specPath.match(
    /api-docs\/(?:_build\/)?(enterprise_influxdb|influxdb3?)\/([\w-]+)\//
  );
  if (!match) {
    throw new Error(`Cannot derive product path from: ${specPath}`);
  }
  return `/${match[1]}/${match[2]}`;
}
/**
 * Transform documentation links in OpenAPI spec markdown fields.
 *
 * 1. Replaces `/influxdb/version/` placeholder with the actual product path.
 * 2. Strips `https://docs.influxdata.com` host from absolute internal URLs,
 *    converting them to relative paths for Hugo rendering.
 *
 * Only processes `description` and `summary` fields (MARKDOWN_FIELDS).
 * Non-markdown fields like `servers[].url` are preserved as-is.
 *
 * @param spec - Parsed OpenAPI spec object
 * @param productPath - Target path (e.g., '/influxdb3/core')
 * @returns Spec with transformed links (new object, original unchanged)
 */
function transformDocLinks(spec, productPath) {
  function transformString(value) {
    return value
      .replace(LINK_PATTERN, `${productPath}/`)
      .replace(DOCS_HOST_PATTERN, '$1');
  }
  function transformValue(value) {
    if (typeof value === 'string') {
      return transformString(value);
    }
    if (Array.isArray(value)) {
      return value.map(transformValue);
    }
    if (value !== null && typeof value === 'object') {
      return transformObject(value);
    }
    return value;
  }
  function transformObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (MARKDOWN_FIELDS.has(key) && typeof value === 'string') {
        result[key] = transformString(value);
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
 * Prepend base URL to relative doc links for downloadable specs.
 * Transforms markdown link targets (`](/path)`) and `x-related` href values.
 * Skips external URLs, anchors, and protocol-relative URLs.
 *
 * @param spec - Parsed OpenAPI spec object with relative links
 * @param baseUrl - Base URL to prepend (e.g., 'https://docs.influxdata.com')
 * @returns Spec with absolute links (new object, original unchanged)
 */
function absolutifyLinks(spec, baseUrl) {
  // Match `](/path` but not `](//` (protocol-relative)
  const INTERNAL_LINK_RE = /(]\()(\/(?!\/))/g;
  function transformValue(value, key, parent) {
    if (typeof value === 'string') {
      if (key && MARKDOWN_FIELDS.has(key)) {
        return value.replace(INTERNAL_LINK_RE, `$1${baseUrl}$2`);
      }
      if (key === 'href' && parent?.title && value.startsWith('/')) {
        return `${baseUrl}${value}`;
      }
      // externalDocs.url — standard OpenAPI field
      if (key === 'url' && parent?.description && value.startsWith('/')) {
        return `${baseUrl}${value}`;
      }
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => transformValue(item));
    }
    if (value !== null && typeof value === 'object') {
      return transformObject(value);
    }
    return value;
  }
  function transformObject(obj) {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = transformValue(v, k, obj);
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
function resolveContentPath(urlPath, contentDir) {
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
function validateDocLinks(spec, contentDir) {
  const errors = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  function extractLinks(value, jsonPath) {
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
      for (const [key, val] of Object.entries(value)) {
        extractLinks(val, `${jsonPath}.${key}`);
      }
    }
  }
  extractLinks(spec, 'spec');
  return errors;
}
/**
 * Convert display name to filename-safe slug
 *
 * @param displayName - Display name (e.g., "Management API")
 * @returns Filename-safe slug (e.g., "management-api")
 */
function slugifyDisplayName(displayName) {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
/**
 * Process a single spec file: transform links, write to static folder
 *
 * @param specConfig - Spec file configuration
 * @param staticPath - Static directory path
 * @param staticDirName - Product directory name
 * @param contentRelPath - Content-relative path (e.g., 'influxdb3/core')
 * @returns Object with paths to generated files, or null if processing failed
 */
function processSpecFile(
  specConfig,
  staticPath,
  staticDirName,
  contentRelPath
) {
  const yaml = require('js-yaml');
  if (!fs.existsSync(specConfig.path)) {
    console.warn(`⚠️  Spec file not found: ${specConfig.path}`);
    return null;
  }
  // Generate filename from display name or use default.
  // Strip staticDirName prefix from the spec filename to avoid doubled names
  // (e.g., influxdb3-core + influxdb3-core-openapi → influxdb3-core-openapi).
  let specSlug;
  if (specConfig.displayName) {
    specSlug = slugifyDisplayName(specConfig.displayName);
  } else {
    const rawName = path.parse(specConfig.path).name;
    const prefix = `${staticDirName}-`;
    specSlug = rawName.startsWith(prefix)
      ? rawName.slice(prefix.length)
      : rawName;
  }
  const staticSpecPath = path.join(
    staticPath,
    `${staticDirName}-${specSlug}.yml`
  );
  const staticJsonSpecPath = path.join(
    staticPath,
    `${staticDirName}-${specSlug}.json`
  );
  const articlesPath = path.join(
    DOCS_ROOT,
    'data/article_data',
    contentRelPath,
    specSlug
  );
  try {
    const specContent = fs.readFileSync(specConfig.path, 'utf8');
    const specObject = yaml.load(specContent);
    // Transform documentation links (/influxdb/version/ -> actual product path)
    const productPath = deriveProductPath(specConfig.path);
    const transformedSpec = transformDocLinks(specObject, productPath);
    console.log(
      `✓ Transformed documentation links for ${specConfig.displayName || specSlug} to ${productPath}`
    );
    // Validate links if enabled
    if (validateLinks) {
      const contentDir = path.resolve(__dirname, '../../content');
      const linkErrors = validateDocLinks(transformedSpec, contentDir);
      if (linkErrors.length > 0) {
        console.warn(`\n⚠️  Link validation warnings for ${specConfig.path}:`);
        linkErrors.forEach((err) => console.warn(`   ${err}`));
      }
    }
    // Write Hugo spec (relative links) to _build/ for article generation.
    // Tag specs and frontmatter staticFilePath derive names from this path,
    // so it must match the final staticSpecPath basename.
    const hugoSpecPath = path.join(
      API_DOCS_ROOT,
      '_build',
      path.relative(path.join(DOCS_ROOT, 'static'), staticSpecPath)
    );
    fs.mkdirSync(path.dirname(hugoSpecPath), { recursive: true });
    fs.writeFileSync(hugoSpecPath, yaml.dump(transformedSpec));
    // Absolutify links for downloadable specs (relative paths → full URLs)
    const downloadSpec = absolutifyLinks(transformedSpec, DOCS_BASE_URL);
    // Write downloadable spec to static folder
    fs.writeFileSync(staticSpecPath, yaml.dump(downloadSpec));
    console.log(`✓ Wrote downloadable spec to ${staticSpecPath}`);
    fs.writeFileSync(staticJsonSpecPath, JSON.stringify(downloadSpec, null, 2));
    console.log(`✓ Generated JSON spec at ${staticJsonSpecPath}`);
    return { staticSpecPath, staticJsonSpecPath, hugoSpecPath, articlesPath };
  } catch (specError) {
    console.warn(`⚠️  Could not process spec: ${specError}`);
    return null;
  }
}
/**
 * Process a single product: fetch spec, generate data, and create pages
 *
 * Supports both single spec (specFile) and multiple specs (specFiles).
 * For multiple specs, article data is merged so the sidebar shows
 * functional tags from all specs.
 *
 * @param productKey - Product identifier (e.g., 'cloud-v2')
 * @param config - Product configuration
 */
function processProduct(productKey, config) {
  console.log('\n' + '='.repeat(80));
  console.log(`Processing ${config.description || productKey}`);
  console.log('='.repeat(80));
  // Clean output directories before regeneration (unless --no-clean, --dry-run, or --static-only)
  if (!noClean && !dryRun && !staticOnly) {
    cleanProductOutputs(productKey, config);
  }
  const staticPath = path.join(DOCS_ROOT, 'static/openapi');
  const staticDirName = getStaticDirName(productKey);
  const staticPathsPath = path.join(staticPath, `${staticDirName}/paths`);
  const contentRelPath = getContentRelPath(config.pagesDir);
  // Merged articles go into the 'api' subdirectory to match the URL path segment.
  // Per-spec data (e.g., management-api/) stays in its own subdirectory.
  const mergedArticlesPath = path.join(
    DOCS_ROOT,
    'data/article_data',
    contentRelPath,
    'api'
  );
  // Ensure static directory exists
  if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(staticPath, { recursive: true });
  }
  try {
    // Determine spec files to process
    const specFiles = config.specFiles
      ? config.specFiles
      : config.specFile
        ? [{ path: config.specFile }]
        : [];
    if (specFiles.length === 0) {
      console.warn(`⚠️  No spec files configured for ${productKey}`);
      return;
    }
    // Check if any spec files exist
    const existingSpecs = specFiles.filter((s) => fs.existsSync(s.path));
    if (existingSpecs.length === 0) {
      console.warn(
        `⚠️  No spec files found for ${productKey}. Run getswagger.sh first if needed.`
      );
      return;
    }
    // Process each spec file
    const processedSpecs = [];
    const allPathSpecFiles = new Map();
    for (const specConfig of specFiles) {
      console.log(
        `\n📄 Processing spec: ${specConfig.displayName || specConfig.path}`
      );
      const result = processSpecFile(
        specConfig,
        staticPath,
        staticDirName,
        contentRelPath
      );
      if (result) {
        processedSpecs.push(result);
        // Generate tag-based article data for this spec (skip in --static-only mode)
        if (!staticOnly && config.useTagBasedGeneration) {
          const specSlug = specConfig.displayName
            ? slugifyDisplayName(specConfig.displayName)
            : path.parse(specConfig.path).name;
          const staticTagsPath = path.join(
            staticPath,
            `${staticDirName}/${specSlug}`
          );
          console.log(
            `\n📋 Generating tag-based data for ${specConfig.displayName || specSlug}...`
          );
          openapiPathsToHugo.generateHugoDataByTag({
            specFile: result.hugoSpecPath,
            dataOutPath: staticTagsPath,
            articleOutPath: result.articlesPath,
            includePaths: true,
          });
          // Generate path-specific specs (use Hugo spec with relative links)
          const specPathsPath = path.join(staticPathsPath, specSlug);
          const pathSpecFiles = openapiPathsToHugo.generatePathSpecificSpecs(
            result.hugoSpecPath,
            specPathsPath
          );
          // Merge path spec files into combined map
          pathSpecFiles.forEach((value, key) => {
            allPathSpecFiles.set(key, value);
          });
        }
      }
    }
    // Article generation (skip in --static-only mode)
    if (!staticOnly) {
      if (processedSpecs.length > 1 && config.useTagBasedGeneration) {
        // Multi-spec products: generate nested sub-sections (data-api/, management-api/)
        // instead of merging into a flat api/ list.
        console.log(
          `\n📋 Generating sub-section pages for ${processedSpecs.length} specs...`
        );
        // Write the top-level api/_index.md (no specDownloadPath — each sub-section has its own)
        const apiParentDir = path.join(config.pagesDir, 'api');
        const parentIndexFile = path.join(apiParentDir, '_index.md');
        if (!fs.existsSync(apiParentDir)) {
          fs.mkdirSync(apiParentDir, { recursive: true });
        }
        {
          const yaml = require('js-yaml');
          // Load page.yml overlay if it exists (matches single-spec pattern)
          const contentRelPath = getContentRelPath(config.pagesDir);
          const pageOverlayPaths = [
            path.join('api-docs', contentRelPath, 'content', 'page.yml'),
            path.join('api-docs', contentRelPath, 'page.yml'),
          ];
          let pageOverlay = {};
          for (const p of pageOverlayPaths) {
            if (fs.existsSync(p)) {
              pageOverlay = yaml.load(fs.readFileSync(p, 'utf8'));
              break;
            }
          }
          // Default API description (not config.description, which is the product label)
          const apiDescription =
            pageOverlay.description ||
            'Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.';
          const parentFrontmatter = {
            title: 'InfluxDB HTTP API',
            description: apiDescription,
            weight: 104,
            type: 'api',
          };
          if (config.menuKey && config.menuParentName) {
            parentFrontmatter.menu = {
              [config.menuKey]: {
                name: 'InfluxDB HTTP API',
                parent: config.menuParentName,
              },
            };
          }
          if (apiProductsMap.size > 0) {
            const altLinks = {};
            apiProductsMap.forEach((apiPath, productName) => {
              altLinks[productName] = apiPath;
            });
            parentFrontmatter.alt_links = altLinks;
          }
          const introText = apiDescription.replace(
            'InfluxDB',
            '{{% product-name %}}'
          );
          const extraContent = pageOverlay.body_extra
            ? `\n${pageOverlay.body_extra}\n`
            : '';
          const parentContent = `---\n${yaml.dump(parentFrontmatter)}---\n\n${introText}\n${extraContent}`;
          if (writeGeneratedFile(parentIndexFile, parentContent)) {
            console.log(
              `✓ Generated multi-spec parent index at ${parentIndexFile}`
            );
          }
        }
        // Generate per-spec sub-section pages
        for (const spec of processedSpecs) {
          const subSection = path.basename(spec.articlesPath); // e.g., "data-api"
          console.log(`\n📄 Generating sub-section pages for: ${subSection}`);
          generateTagPagesFromArticleData({
            articlesPath: spec.articlesPath,
            contentPath: config.pagesDir,
            menuKey: config.menuKey,
            menuParent: 'InfluxDB HTTP API',
            menuParentName: config.menuParentName,
            pathSpecFiles: allPathSpecFiles,
            staticDirName,
            productKey,
            subSection,
            productDescription: config.description,
          });
        }
      } else if (processedSpecs.length === 1) {
        // Single spec - copy articles to final location if needed
        const sourceArticles = path.join(
          processedSpecs[0].articlesPath,
          'articles.yml'
        );
        const targetArticles = path.join(mergedArticlesPath, 'articles.yml');
        // Only copy if source and target are different
        if (
          sourceArticles !== targetArticles &&
          fs.existsSync(sourceArticles)
        ) {
          if (!fs.existsSync(mergedArticlesPath)) {
            fs.mkdirSync(mergedArticlesPath, { recursive: true });
          }
          fs.copyFileSync(sourceArticles, targetArticles);
          fs.copyFileSync(
            sourceArticles.replace('.yml', '.json'),
            targetArticles.replace('.yml', '.json')
          );
          console.log(`✓ Copied article data to ${mergedArticlesPath}`);
        }
        // Generate Hugo content pages from article data
        if (config.useTagBasedGeneration) {
          generateTagPagesFromArticleData({
            articlesPath: mergedArticlesPath,
            contentPath: config.pagesDir,
            menuKey: config.menuKey,
            menuParent: 'InfluxDB HTTP API',
            productDescription: config.productDescription,
            bodyExtra: config.bodyExtra,
            menuParentName: config.menuParentName,
            pathSpecFiles: allPathSpecFiles,
            staticDirName,
            productKey,
            specDownloadPath: `/openapi/${path.basename(processedSpecs[0].staticSpecPath)}`,
          });
        } else {
          generatePagesFromArticleData({
            articlesPath: mergedArticlesPath,
            contentPath: config.pagesDir,
            menuKey: config.menuKey,
            menuParent: 'InfluxDB HTTP API',
            menuParentName: config.menuParentName,
          });
        }
      } else if (!config.useTagBasedGeneration && processedSpecs.length > 0) {
        // Multi-spec without tag-based generation (unusual — fall back to merge)
        const articlesFiles = processedSpecs.map((s) =>
          path.join(s.articlesPath, 'articles.yml')
        );
        mergeArticleData(
          articlesFiles,
          path.join(mergedArticlesPath, 'articles.yml')
        );
        generatePagesFromArticleData({
          articlesPath: mergedArticlesPath,
          contentPath: config.pagesDir,
          menuKey: config.menuKey,
          menuParent: 'InfluxDB HTTP API',
          menuParentName: config.menuParentName,
        });
      }
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
function main() {
  // Filter out CLI flags from arguments
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  // Determine which products to process
  let productsToProcess;
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
  // Handle dry-run mode
  if (dryRun) {
    console.log('\n📋 DRY RUN MODE - No files will be modified\n');
    productsToProcess.forEach((productKey) => {
      showDryRunPreview(productKey, productConfigs[productKey]);
    });
    console.log('\nDry run complete. No files were modified.');
    return;
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
//# sourceMappingURL=generate-openapi-articles.js.map
