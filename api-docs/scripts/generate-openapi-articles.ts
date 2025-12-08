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
 * Each article becomes a page with type: api that renders via Scalar.
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
      const parentFrontmatter: Record<string, unknown> = {
        title: menuParent || 'HTTP API',
        description:
          productDescription ||
          'API reference documentation for all available endpoints.',
        weight: 104,
      };

      // Add menu entry for parent page (unless skipParentMenu is true)
      if (menuKey && !skipParentMenu) {
        parentFrontmatter.menu = {
          [menuKey]: {
            name: menuParent || 'HTTP API',
          },
        };
      }

      const parentContent = `---
${yaml.dump(parentFrontmatter)}---
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
    const parentFrontmatter: Record<string, unknown> = {
      title: menuParent || 'HTTP API',
      description:
        productDescription ||
        'API reference documentation for all available endpoints.',
      weight: 104,
    };

    // Add menu entry for parent page (unless skipParentMenu is true)
    if (menuKey && !skipParentMenu) {
      parentFrontmatter.menu = {
        [menuKey]: {
          name: menuParent || 'HTTP API',
        },
      };
    }

    const parentContent = `---
${yaml.dump(parentFrontmatter)}---
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
}

/**
 * Product configurations for all InfluxDB editions
 *
 * Maps product identifiers to their OpenAPI specs and content directories
 */
const productConfigs: ProductConfigMap = {
  // TODO: v2 products (cloud-v2, oss-v2) are disabled for now because they
  // have existing Redoc-based API reference at /reference/api/
  // Uncomment when ready to migrate v2 products to Scalar
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
  'influxdb3-core': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/core/v3/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/core'),
    description: 'InfluxDB 3 Core',
    menuKey: 'influxdb3_core',
    useTagBasedGeneration: true,
  },
  'influxdb3-enterprise': {
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
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-dedicated/api'),
    description: 'InfluxDB Cloud Dedicated',
    menuKey: 'influxdb3_cloud_dedicated',
    skipParentMenu: true,
  },
  'cloud-serverless': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/cloud-serverless/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-serverless/api'),
    description: 'InfluxDB Cloud Serverless',
    menuKey: 'influxdb3_cloud_serverless',
    skipParentMenu: true,
  },
  clustered: {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/clustered/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/clustered/api'),
    description: 'InfluxDB Clustered',
    menuKey: 'influxdb3_clustered',
    skipParentMenu: true,
  },
};

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
  const staticSpecPath = path.join(staticPath, `influxdb-${productKey}.yml`);
  const staticJsonSpecPath = path.join(
    staticPath,
    `influxdb-${productKey}.json`
  );
  const staticPathsPath = path.join(staticPath, `influxdb-${productKey}/paths`);
  const articlesPath = path.join(
    DOCS_ROOT,
    `data/article-data/influxdb/${productKey}`
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

    // Step 3: Copy the generated OpenAPI spec to static folder (YAML)
    if (fs.existsSync(config.specFile)) {
      fs.copyFileSync(config.specFile, staticSpecPath);
      console.log(`✓ Copied spec to ${staticSpecPath}`);

      // Step 4: Generate JSON version of the spec
      try {
        const yaml = require('js-yaml');
        const specContent = fs.readFileSync(config.specFile, 'utf8');
        const specObject = yaml.load(specContent);
        fs.writeFileSync(
          staticJsonSpecPath,
          JSON.stringify(specObject, null, 2)
        );
        console.log(`✓ Generated JSON spec at ${staticJsonSpecPath}`);
      } catch (jsonError) {
        console.warn(`⚠️  Could not generate JSON spec: ${jsonError}`);
      }
    }

    // Step 5: Generate Hugo data from OpenAPI spec
    if (config.useTagBasedGeneration) {
      // Tag-based generation: group operations by OpenAPI tag
      const staticTagsPath = path.join(
        staticPath,
        `influxdb-${productKey}/tags`
      );
      console.log(`\n📋 Using tag-based generation for ${productKey}...`);
      openapiPathsToHugo.generateHugoDataByTag({
        specFile: config.specFile,
        dataOutPath: staticTagsPath,
        articleOutPath: articlesPath,
        includePaths: true, // Also generate path-based files for backwards compatibility
      });

      // Step 6: Generate Hugo content pages from tag-based article data
      generateTagPagesFromArticleData({
        articlesPath,
        contentPath: config.pagesDir,
        menuKey: config.menuKey,
        menuParent: 'InfluxDB HTTP API',
        skipParentMenu: config.skipParentMenu,
      });
    } else {
      // Path-based generation: group paths by URL prefix (legacy)
      generateDataFromOpenAPI(config.specFile, staticPathsPath, articlesPath);

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
};
