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
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.productConfigs = void 0;
exports.processProduct = processProduct;
exports.generateDataFromOpenAPI = generateDataFromOpenAPI;
exports.generatePagesFromArticleData = generatePagesFromArticleData;
const child_process_1 = require('child_process');
const path = __importStar(require('path'));
const fs = __importStar(require('fs'));
// Import the OpenAPI to Hugo converter
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');
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
 * Each article becomes a page with type: api that renders via Scalar.
 *
 * @param articlesPath - Path to the articles data directory
 * @param contentPath - Output path for generated content pages
 */
function generatePagesFromArticleData(articlesPath, contentPath) {
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
  // Generate a page for each article
  for (const article of data.articles) {
    const pagePath = path.join(contentPath, article.path);
    const pageFile = path.join(pagePath, '_index.md');
    // Create directory if needed
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }
    // Generate frontmatter
    const frontmatter = {
      title: article.fields.name || article.path,
      description: `API reference for ${article.fields.name || article.path}`,
      type: 'api',
      staticFilePath: article.fields.staticFilePath,
      weight: 100,
    };
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
 * Product configurations for all InfluxDB editions
 *
 * Maps product identifiers to their OpenAPI specs and content directories
 */
const productConfigs = {
  'cloud-v2': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb/cloud/v2/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/cloud/api/v2'),
    description: 'InfluxDB Cloud (v2 API)',
  },
  'oss-v2': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb/v2/v2/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb/v2/api/v2'),
    description: 'InfluxDB OSS v2',
  },
  'influxdb3-core': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/core/v3/ref.yml'),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/core/reference/api'),
    description: 'InfluxDB 3 Core',
  },
  'influxdb3-enterprise': {
    specFile: path.join(API_DOCS_ROOT, 'influxdb3/enterprise/v3/ref.yml'),
    pagesDir: path.join(
      DOCS_ROOT,
      'content/influxdb3/enterprise/reference/api'
    ),
    description: 'InfluxDB 3 Enterprise',
  },
  'cloud-dedicated': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/cloud-dedicated/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-dedicated/api'),
    description: 'InfluxDB Cloud Dedicated',
  },
  'cloud-serverless': {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/cloud-serverless/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/cloud-serverless/api'),
    description: 'InfluxDB Cloud Serverless',
  },
  clustered: {
    specFile: path.join(
      API_DOCS_ROOT,
      'influxdb3/clustered/management/openapi.yml'
    ),
    pagesDir: path.join(DOCS_ROOT, 'content/influxdb3/clustered/api'),
    description: 'InfluxDB Clustered',
  },
};
exports.productConfigs = productConfigs;
/**
 * Process a single product: fetch spec, generate data, and create pages
 *
 * @param productKey - Product identifier (e.g., 'cloud-v2')
 * @param config - Product configuration
 */
function processProduct(productKey, config) {
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
    const getswaggerScript = path.join(API_DOCS_ROOT, 'getswagger.sh');
    if (fs.existsSync(getswaggerScript)) {
      execCommand(
        `${getswaggerScript} ${productKey} -B`,
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
    // Step 5: Generate Hugo data from OpenAPI spec (path fragments for AI agents)
    generateDataFromOpenAPI(config.specFile, staticPathsPath, articlesPath);
    // Step 6: Generate Hugo content pages from article data
    generatePagesFromArticleData(articlesPath, config.pagesDir);
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
  const args = process.argv.slice(2);
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
