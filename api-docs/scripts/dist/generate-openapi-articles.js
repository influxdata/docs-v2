#!/usr/bin/env node
'use strict';
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
const child_process_1 = require('child_process');
const path = __importStar(require('path'));
const fs = __importStar(require('fs'));
// Import the OpenAPI to Hugo converter
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');
// Calculate the relative paths
const DOCS_ROOT = '.';
const API_DOCS_ROOT = 'api-docs';
// CLI flags
const validateLinks = process.argv.includes('--validate-links');
const skipFetch = process.argv.includes('--skip-fetch');
const noClean = process.argv.includes('--no-clean');
const dryRun = process.argv.includes('--dry-run');
/**
 * Load products with API paths from data/products.yml
 * Returns a map of alt_link_key to API path for alt_links generation
 * The alt_link_key matches what the Hugo product-selector template expects
 */
function loadApiProducts() {
  const yaml = require('js-yaml');
  const productsFile = path.join(DOCS_ROOT, 'data/products.yml');
  if (!fs.existsSync(productsFile)) {
    console.warn('⚠️  products.yml not found, skipping alt_links generation');
    return new Map();
  }
  const productsContent = fs.readFileSync(productsFile, 'utf8');
  const products = yaml.load(productsContent);
  const apiProducts = new Map();
  for (const [key, product] of Object.entries(products)) {
    if (product.api_path && product.alt_link_key) {
      // Use alt_link_key as the key (matches Hugo template expectations)
      apiProducts.set(product.alt_link_key, product.api_path);
    }
  }
  return apiProducts;
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
function execCommand(command, description) {
  try {
    if (description) {
      console.log(`\n${description}...`);
    }
    console.log(`Executing: ${command}\n`);
    (0, child_process_1.execSync)(command, { stdio: 'inherit' });
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
  // Article data directory: data/article_data/influxdb/{productKey}/
  const articleDataDir = path.join(
    DOCS_ROOT,
    `data/article_data/influxdb/${productKey}`
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
    if (!fs.existsSync(parentIndexFile)) {
      // Build description - use product description or generate from product name
      const apiDescription =
        productDescription ||
        `Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.`;
      const parentFrontmatter = {
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
    fs.writeFileSync(pageFile, pageContent);
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
  const data = yaml.load(articlesContent);
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
    const parentFrontmatter = {
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
    const parentContent = `---
${yaml.dump(parentFrontmatter)}---

${introText}

{{< children >}}
`;
    fs.writeFileSync(parentIndexFile, parentContent);
    console.log(`✓ Generated parent index at ${parentIndexFile}`);
  }
  // Generate "All endpoints" page
  const allEndpointsDir = path.join(apiParentDir, 'all-endpoints');
  const allEndpointsFile = path.join(allEndpointsDir, '_index.md');
  if (!fs.existsSync(allEndpointsDir)) {
    fs.mkdirSync(allEndpointsDir, { recursive: true });
  }
  const allEndpointsFrontmatter = {
    title: 'All endpoints',
    description: `View all API endpoints sorted by path.`,
    type: 'api',
    layout: 'all-endpoints',
    weight: 999,
    isAllEndpoints: true,
  };
  // Add menu entry for all-endpoints page
  if (menuKey) {
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
  fs.writeFileSync(allEndpointsFile, allEndpointsContent);
  console.log(`✓ Generated all-endpoints page at ${allEndpointsFile}`);
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
    // Determine weight: use article.fields.weight if set, otherwise default to 100
    const weight = article.fields.weight ?? 100;
    const frontmatter = {
      title,
      description: article.fields.description || `API reference for ${title}`,
      type: 'api',
      layout: isConceptual ? 'single' : 'list',
      staticFilePath: article.fields.staticFilePath,
      weight,
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
    fs.writeFileSync(pageFile, pageContent);
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
        // Merge related links
        if (article.fields.related && article.fields.related.length > 0) {
          const existingRelated = existing.fields.related || [];
          const newRelated = article.fields.related.filter(
            (r) => !existingRelated.includes(r)
          );
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
    specFile: path.join(API_DOCS_ROOT, 'influxdb/cloud/v2/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/cloud'),
    description: 'InfluxDB Cloud (v2 API)',
    menuKey: 'influxdb_cloud',
    skipParentMenu: true,
    useTagBasedGeneration: true,
  },
  'oss-v2': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb/v2/v2/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v2'),
    description: 'InfluxDB OSS v2',
    menuKey: 'influxdb_v2',
    skipParentMenu: true,
    useTagBasedGeneration: true,
  },
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
        path: path.join(API_DOCS_ROOT, 'influxdb3/cloud-dedicated/v2/ref.yml'),
        displayName: 'v2 Data API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-dedicated'),
    description: 'InfluxDB Cloud Dedicated',
    menuKey: 'influxdb3_cloud_dedicated',
    skipParentMenu: true,
    useTagBasedGeneration: true,
  },
  'cloud-serverless': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/cloud-serverless/v2/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-serverless'),
    description: 'InfluxDB Cloud Serverless',
    menuKey: 'influxdb3_cloud_serverless',
    skipParentMenu: true,
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
        path: path.join(API_DOCS_ROOT, 'influxdb3/clustered/v2/ref.yml'),
        displayName: 'v2 Data API',
      },
    ],
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/clustered'),
    description: 'InfluxDB Clustered',
    menuKey: 'influxdb3_clustered',
    skipParentMenu: true,
    useTagBasedGeneration: true,
  },
  // InfluxDB v1 products - use tag-based generation
  // These have existing /tools/api/ pages with menu entries,
  // so we skip adding menu entries to the generated parent pages.
  'oss-v1': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb/v1/v1/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v1'),
    description: 'InfluxDB OSS v1',
    menuKey: 'influxdb_v1',
    skipParentMenu: true,
    useTagBasedGeneration: true,
  },
  'enterprise-v1': {
    specFile: path.join(API_DOCS_ROOT, 'enterprise_influxdb/v1/v1/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/enterprise_influxdb/v1'),
    description: 'InfluxDB Enterprise v1',
    menuKey: 'enterprise_influxdb_v1',
    skipParentMenu: true,
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
/**
 * Derive documentation root from spec file path.
 *
 * @example
 * 'api-docs/influxdb3/core/v3/ref.yml' → '/influxdb3/core'
 * 'api-docs/influxdb3/enterprise/v3/ref.yml' → '/influxdb3/enterprise'
 * 'api-docs/influxdb/v2/v2/ref.yml' → '/influxdb/v2'
 * 'api-docs/influxdb/v1/v1/ref.yml' → '/influxdb/v1'
 * 'api-docs/enterprise_influxdb/v1/v1/ref.yml' → '/enterprise_influxdb/v1'
 */
function deriveProductPath(specPath) {
  // Match: api-docs/(enterprise_influxdb|influxdb3|influxdb)/(product-or-version)/...
  const match = specPath.match(
    /api-docs\/(enterprise_influxdb|influxdb3?)\/([\w-]+)\//
  );
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
function transformDocLinks(spec, productPath) {
  function transformValue(value) {
    if (typeof value === 'string') {
      return value.replace(LINK_PATTERN, `${productPath}/`);
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
 * @param productKey - Product identifier
 * @returns Object with paths to generated files, or null if processing failed
 */
function processSpecFile(specConfig, staticPath, staticDirName, productKey) {
  const yaml = require('js-yaml');
  if (!fs.existsSync(specConfig.path)) {
    console.warn(`⚠️  Spec file not found: ${specConfig.path}`);
    return null;
  }
  // Generate filename from display name or use default
  const specSlug = specConfig.displayName
    ? slugifyDisplayName(specConfig.displayName)
    : path.parse(specConfig.path).name;
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
    `data/article_data/influxdb/${productKey}/${specSlug}`
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
    // Write transformed spec to static folder
    fs.writeFileSync(staticSpecPath, yaml.dump(transformedSpec));
    console.log(`✓ Wrote transformed spec to ${staticSpecPath}`);
    fs.writeFileSync(
      staticJsonSpecPath,
      JSON.stringify(transformedSpec, null, 2)
    );
    console.log(`✓ Generated JSON spec at ${staticJsonSpecPath}`);
    return { staticSpecPath, staticJsonSpecPath, articlesPath };
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
  // Clean output directories before regeneration (unless --no-clean or --dry-run)
  if (!noClean && !dryRun) {
    cleanProductOutputs(productKey, config);
  }
  const staticPath = path.join(DOCS_ROOT, 'static/openapi');
  const staticDirName = getStaticDirName(productKey);
  const staticPathsPath = path.join(staticPath, `${staticDirName}/paths`);
  const mergedArticlesPath = path.join(
    DOCS_ROOT,
    `data/article_data/influxdb/${productKey}`
  );
  // Ensure static directory exists
  if (!fs.existsSync(staticPath)) {
    fs.mkdirSync(staticPath, { recursive: true });
  }
  try {
    // Step 1: Execute the getswagger.sh script to fetch/bundle the spec
    if (skipFetch) {
      console.log(`⏭️  Skipping getswagger.sh (--skip-fetch flag set)`);
    } else {
      const getswaggerScript = path.join(API_DOCS_ROOT, 'getswagger.sh');
      if (fs.existsSync(getswaggerScript)) {
        execCommand(
          `cd ${API_DOCS_ROOT} && ./getswagger.sh ${productKey} -B`,
          `Fetching OpenAPI spec for ${productKey}`
        );
      } else {
        console.log(`⚠️  getswagger.sh not found, skipping fetch step`);
      }
    }
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
        productKey
      );
      if (result) {
        processedSpecs.push(result);
        // Generate tag-based article data for this spec
        if (config.useTagBasedGeneration) {
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
            specFile: result.staticSpecPath,
            dataOutPath: staticTagsPath,
            articleOutPath: result.articlesPath,
            includePaths: true,
          });
          // Generate path-specific specs
          const specPathsPath = path.join(staticPathsPath, specSlug);
          const pathSpecFiles = openapiPathsToHugo.generatePathSpecificSpecs(
            result.staticSpecPath,
            specPathsPath
          );
          // Merge path spec files into combined map
          pathSpecFiles.forEach((value, key) => {
            allPathSpecFiles.set(key, value);
          });
        }
      }
    }
    // Step 5: Merge article data from all specs (for multi-spec products)
    if (processedSpecs.length > 1) {
      console.log(
        `\n📋 Merging article data from ${processedSpecs.length} specs...`
      );
      const articlesFiles = processedSpecs.map((s) =>
        path.join(s.articlesPath, 'articles.yml')
      );
      mergeArticleData(
        articlesFiles,
        path.join(mergedArticlesPath, 'articles.yml')
      );
    } else if (processedSpecs.length === 1) {
      // Single spec - copy articles to final location if needed
      const sourceArticles = path.join(
        processedSpecs[0].articlesPath,
        'articles.yml'
      );
      const targetArticles = path.join(mergedArticlesPath, 'articles.yml');
      // Only copy if source and target are different
      if (sourceArticles !== targetArticles && fs.existsSync(sourceArticles)) {
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
    }
    // Step 6: Generate Hugo content pages from (merged) article data
    if (config.useTagBasedGeneration) {
      generateTagPagesFromArticleData({
        articlesPath: mergedArticlesPath,
        contentPath: config.pagesDir,
        menuKey: config.menuKey,
        menuParent: 'InfluxDB HTTP API',
        skipParentMenu: config.skipParentMenu,
        pathSpecFiles: allPathSpecFiles,
      });
    } else {
      generatePagesFromArticleData({
        articlesPath: mergedArticlesPath,
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
