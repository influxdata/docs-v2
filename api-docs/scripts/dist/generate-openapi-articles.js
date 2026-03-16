#!/usr/bin/env node
"use strict";
/**
 * Generate OpenAPI Articles Script
 *
 * Generates Hugo data files and content pages from OpenAPI specifications
 * for all InfluxDB products.
 *
 * Products are auto-discovered by scanning api-docs/ for .config.yml files.
 * Hugo paths, menu keys, and static file names are derived from directory
 * structure and existing Hugo frontmatter.
 *
 * This script:
 * 1. Discovers products from .config.yml files
 * 2. Cleans output directories (unless --no-clean)
 * 3. Transforms documentation links in specs
 * 4. Copies specs to static directory for download
 * 5. Generates tag-based data fragments (YAML and JSON)
 * 6. Generates Hugo content pages from article data
 *
 * Usage:
 *   node generate-openapi-articles.js                    # Clean and generate all products
 *   node generate-openapi-articles.js influxdb3-core     # Clean and generate single product
 *   node generate-openapi-articles.js --no-clean         # Generate without cleaning
 *   node generate-openapi-articles.js --dry-run          # Preview what would be cleaned
 *   node generate-openapi-articles.js --skip-fetch       # Skip getswagger.sh fetch step
 *   node generate-openapi-articles.js --validate-links   # Validate documentation links
 *
 * @module generate-openapi-articles
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_PATTERN = exports.MARKDOWN_FIELDS = void 0;
exports.discoverProducts = discoverProducts;
exports.processProduct = processProduct;
exports.processApiSection = processApiSection;
exports.transformDocLinks = transformDocLinks;
exports.validateDocLinks = validateDocLinks;
exports.resolveContentPath = resolveContentPath;
exports.deriveStaticDirName = deriveStaticDirName;
exports.getSectionSlug = getSectionSlug;
exports.parseApiEntry = parseApiEntry;
exports.readMenuKey = readMenuKey;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Import the OpenAPI to Hugo converter
const openapiPathsToHugo = require('./openapi-paths-to-hugo-data/index.js');
// ---------------------------------------------------------------------------
// Constants and CLI flags
// ---------------------------------------------------------------------------
const DOCS_ROOT = '.';
const API_DOCS_ROOT = 'api-docs';
const validateLinks = process.argv.includes('--validate-links');
const skipFetch = process.argv.includes('--skip-fetch');
const noClean = process.argv.includes('--no-clean');
const dryRun = process.argv.includes('--dry-run');
// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------
/**
 * Load products with API paths from data/products.yml.
 * Returns a map of alt_link_key to API path for alt_links generation.
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
    for (const [, product] of Object.entries(products)) {
        if (product.api_path && product.alt_link_key) {
            apiProducts.set(product.alt_link_key, product.api_path);
        }
    }
    return apiProducts;
}
const apiProductsMap = loadApiProducts();
/** Execute a shell command and handle errors */
function execCommand(command, description) {
    try {
        if (description) {
            console.log(`\n${description}...`);
        }
        console.log(`Executing: ${command}\n`);
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
    }
    catch (error) {
        console.error(`\n❌ Error executing command: ${command}`);
        if (error instanceof Error) {
            console.error(error.message);
        }
        process.exit(1);
    }
}
// ---------------------------------------------------------------------------
// Auto-discovery functions
// ---------------------------------------------------------------------------
/**
 * Recursively find all .config.yml files under api-docs/.
 * Excludes the root api-docs/.config.yml and internal directories.
 */
function findConfigFiles(rootDir) {
    const configs = [];
    const skipDirs = new Set([
        'node_modules',
        'dist',
        '_build',
        'scripts',
        'openapi',
    ]);
    function scanDir(dir, depth) {
        if (depth > 5)
            return;
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const entry of entries) {
            if (skipDirs.has(entry.name))
                continue;
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                scanDir(fullPath, depth + 1);
            }
            else if (entry.name === '.config.yml' && dir !== rootDir) {
                configs.push(fullPath);
            }
        }
    }
    scanDir(rootDir, 0);
    return configs.sort();
}
/**
 * Parse an API entry key like 'v3@3' into apiKey and version.
 */
function parseApiEntry(entry) {
    const atIdx = entry.indexOf('@');
    if (atIdx === -1) {
        return { apiKey: entry, version: '0' };
    }
    return {
        apiKey: entry.substring(0, atIdx),
        version: entry.substring(atIdx + 1),
    };
}
/**
 * Determine Hugo section slug from API key.
 * 'management' → 'management-api', everything else → 'api'.
 */
function getSectionSlug(apiKey) {
    if (apiKey === 'management')
        return 'management-api';
    return 'api';
}
/**
 * Derive a clean static directory name from a product directory path.
 * Replaces path separators and underscores with hyphens.
 *
 * @example 'influxdb3/core' → 'influxdb3-core'
 * @example 'enterprise_influxdb/v1' → 'enterprise-influxdb-v1'
 */
function deriveStaticDirName(productDir) {
    return productDir.replace(/[/_]/g, '-');
}
/**
 * Read the cascade.product field from a product's _index.md frontmatter.
 * This value serves as the Hugo menu key.
 */
function readMenuKey(pagesDir) {
    const yaml = require('js-yaml');
    const indexFile = path.join(pagesDir, '_index.md');
    if (!fs.existsSync(indexFile)) {
        console.warn(`⚠️  Product index not found: ${indexFile}`);
        return '';
    }
    const content = fs.readFileSync(indexFile, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch)
        return '';
    try {
        const fm = yaml.load(fmMatch[1]);
        const cascade = fm.cascade;
        if (cascade?.product)
            return cascade.product;
        // Fallback: first key of the menu map
        if (fm.menu && typeof fm.menu === 'object') {
            const keys = Object.keys(fm.menu);
            if (keys.length > 0)
                return keys[0];
        }
    }
    catch {
        console.warn(`⚠️  Could not parse frontmatter in ${indexFile}`);
    }
    return '';
}
/**
 * Check whether a hand-maintained api/_index.md already has a menu entry.
 * If so, the generator should skip adding its own parent menu entry.
 *
 * Only detects genuinely hand-maintained files — files previously generated
 * by this script (which have articleDataKey in frontmatter) are ignored,
 * since they'll be regenerated during this run.
 */
function hasExistingApiMenu(pagesDir) {
    const yaml = require('js-yaml');
    const apiIndex = path.join(pagesDir, 'api', '_index.md');
    if (!fs.existsSync(apiIndex))
        return false;
    const content = fs.readFileSync(apiIndex, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch)
        return false;
    try {
        const fm = yaml.load(fmMatch[1]);
        // Skip files generated by this script (they have articleDataKey)
        if (fm.articleDataKey)
            return false;
        return !!fm.menu;
    }
    catch {
        return false;
    }
}
/**
 * Discover all products by scanning api-docs/ for .config.yml files.
 * Derives Hugo paths from directory structure and existing frontmatter.
 */
function discoverProducts() {
    const yaml = require('js-yaml');
    const products = [];
    const configFiles = findConfigFiles(API_DOCS_ROOT);
    for (const configPath of configFiles) {
        const configDir = path.dirname(configPath);
        const productDir = path.relative(API_DOCS_ROOT, configDir);
        let config;
        try {
            const raw = fs.readFileSync(configPath, 'utf8');
            config = yaml.load(raw);
        }
        catch (err) {
            console.warn(`⚠️  Could not parse ${configPath}: ${err}`);
            continue;
        }
        if (!config.apis || Object.keys(config.apis).length === 0) {
            continue;
        }
        const pagesDir = path.join(DOCS_ROOT, 'content', productDir);
        const staticDirName = deriveStaticDirName(productDir);
        const menuKey = readMenuKey(pagesDir);
        const skipParentMenu = hasExistingApiMenu(pagesDir);
        // Parse API entries, skipping compatibility specs
        const apis = [];
        for (const [entryKey, entry] of Object.entries(config.apis)) {
            const { apiKey, version } = parseApiEntry(entryKey);
            // Skip v1-compatibility entries (being removed in pipeline restructure)
            if (apiKey.includes('compatibility'))
                continue;
            // Prefer post-processed spec from _build/ (has overlays and tag configs),
            // fall back to source spec for standalone usage
            const sourceSpec = path.join(configDir, entry.root);
            const buildSpec = path.join(API_DOCS_ROOT, '_build', productDir, entry.root);
            const specFile = fs.existsSync(buildSpec) ? buildSpec : sourceSpec;
            const sectionSlug = getSectionSlug(apiKey);
            apis.push({ apiKey, version, specFile, sectionSlug });
        }
        if (apis.length === 0)
            continue;
        products.push({
            configDir,
            productDir,
            productName: config['x-influxdata-product-name'] || productDir,
            pagesDir,
            menuKey,
            skipParentMenu,
            staticDirName,
            apis,
        });
    }
    return products;
}
// ---------------------------------------------------------------------------
// Cleanup functions
// ---------------------------------------------------------------------------
/**
 * Get all paths that would be cleaned for a product.
 *
 * @param product - The product to clean
 * @param allStaticDirNames - Names of all products (to avoid prefix collisions)
 */
function getCleanupPaths(product, allStaticDirNames) {
    const staticPath = path.join(DOCS_ROOT, 'static/openapi');
    const directories = [];
    const files = [];
    // Tag specs directory: static/openapi/{staticDirName}/
    const tagSpecsDir = path.join(staticPath, product.staticDirName);
    if (fs.existsSync(tagSpecsDir)) {
        directories.push(tagSpecsDir);
    }
    // Article data directory: data/article_data/influxdb/{staticDirName}/
    const articleDataDir = path.join(DOCS_ROOT, `data/article_data/influxdb/${product.staticDirName}`);
    if (fs.existsSync(articleDataDir)) {
        directories.push(articleDataDir);
    }
    // Content pages: content/{pagesDir}/{sectionSlug}/ for each API
    for (const api of product.apis) {
        const contentDir = path.join(product.pagesDir, api.sectionSlug);
        if (fs.existsSync(contentDir)) {
            directories.push(contentDir);
        }
    }
    // Root spec files: static/openapi/{staticDirName}*.yml and .json
    // Avoid matching files that belong to products with longer names
    // (e.g., 'influxdb-cloud' should not match 'influxdb-cloud-dedicated-*.yml')
    const longerPrefixes = allStaticDirNames.filter((n) => n !== product.staticDirName && n.startsWith(product.staticDirName + '-'));
    if (fs.existsSync(staticPath)) {
        const staticFiles = fs.readdirSync(staticPath);
        staticFiles
            .filter((f) => {
            if (!f.startsWith(product.staticDirName))
                return false;
            // Exclude files belonging to a longer-named product
            for (const longer of longerPrefixes) {
                if (f.startsWith(longer))
                    return false;
            }
            return f.endsWith('.yml') || f.endsWith('.json');
        })
            .forEach((f) => {
            files.push(path.join(staticPath, f));
        });
    }
    return { directories, files };
}
/** Clean output directories for a product before regeneration. */
function cleanProductOutputs(product, allStaticDirNames) {
    const { directories, files } = getCleanupPaths(product, allStaticDirNames);
    for (const dir of directories) {
        console.log(`🧹 Removing directory: ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
    }
    for (const file of files) {
        console.log(`🧹 Removing file: ${file}`);
        fs.unlinkSync(file);
    }
    const total = directories.length + files.length;
    if (total > 0) {
        console.log(`✓ Cleaned ${directories.length} directories, ${files.length} files for ${product.staticDirName}`);
    }
}
/** Display dry-run preview of what would be cleaned. */
function showDryRunPreview(product, allStaticDirNames) {
    const { directories, files } = getCleanupPaths(product, allStaticDirNames);
    console.log(`\nDRY RUN: Would clean the following for ${product.staticDirName}:\n`);
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
    console.log(`\nSummary: ${directories.length} directories, ${files.length} files would be removed`);
}
// ---------------------------------------------------------------------------
// Link transformation
// ---------------------------------------------------------------------------
/** Fields that can contain markdown with links */
const MARKDOWN_FIELDS = new Set(['description', 'summary']);
exports.MARKDOWN_FIELDS = MARKDOWN_FIELDS;
/** Link placeholder pattern */
const LINK_PATTERN = /\/influxdb\/version\//g;
exports.LINK_PATTERN = LINK_PATTERN;
/**
 * Transform documentation links in OpenAPI spec markdown fields.
 * Replaces `/influxdb/version/` with the actual product path.
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
            }
            else if (value !== null && typeof value === 'object') {
                result[key] = transformValue(value);
            }
            else {
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
 * @example '/influxdb3/core/api/auth/' → 'content/influxdb3/core/api/auth/_index.md'
 */
function resolveContentPath(urlPath, contentDir) {
    const normalized = urlPath.replace(/\/$/, '');
    const indexPath = path.join(contentDir, normalized, '_index.md');
    const directPath = path.join(contentDir, normalized + '.md');
    if (fs.existsSync(indexPath))
        return indexPath;
    if (fs.existsSync(directPath))
        return directPath;
    return indexPath;
}
/**
 * Validate that transformed links point to existing content.
 */
function validateDocLinks(spec, contentDir) {
    const errors = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    function extractLinks(value, jsonPath) {
        if (typeof value === 'string') {
            let match;
            while ((match = linkPattern.exec(value)) !== null) {
                const [, linkText, linkUrl] = match;
                if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
                    const contentPath = resolveContentPath(linkUrl, contentDir);
                    if (!fs.existsSync(contentPath)) {
                        errors.push(`Broken link at ${jsonPath}: [${linkText}](${linkUrl})`);
                    }
                }
            }
            linkPattern.lastIndex = 0;
        }
        else if (Array.isArray(value)) {
            value.forEach((item, index) => extractLinks(item, `${jsonPath}[${index}]`));
        }
        else if (value !== null && typeof value === 'object') {
            for (const [key, val] of Object.entries(value)) {
                extractLinks(val, `${jsonPath}.${key}`);
            }
        }
    }
    extractLinks(spec, 'spec');
    return errors;
}
/**
 * Generate Hugo content pages from tag-based article data.
 *
 * Creates markdown files with frontmatter from article metadata.
 * Each article becomes a page with type: api that renders via Hugo-native
 * templates. Includes operation metadata for TOC generation.
 */
function generateTagPagesFromArticleData(options) {
    const { articlesPath, contentPath, sectionSlug, menuKey, menuParent, productDescription, skipParentMenu, specDownloadPath, articleDataKey, articleSection, } = options;
    const yaml = require('js-yaml');
    const articlesFile = path.join(articlesPath, 'articles.yml');
    if (!fs.existsSync(articlesFile)) {
        console.warn(`⚠️  Articles file not found: ${articlesFile}`);
        return;
    }
    const articlesContent = fs.readFileSync(articlesFile, 'utf8');
    const data = yaml.load(articlesContent);
    if (!data.articles || !Array.isArray(data.articles)) {
        console.warn(`⚠️  No articles found in ${articlesFile}`);
        return;
    }
    if (!fs.existsSync(contentPath)) {
        fs.mkdirSync(contentPath, { recursive: true });
    }
    // Generate parent _index.md for the section
    const sectionDir = path.join(contentPath, sectionSlug);
    const parentIndexFile = path.join(sectionDir, '_index.md');
    if (!fs.existsSync(sectionDir)) {
        fs.mkdirSync(sectionDir, { recursive: true });
    }
    if (!fs.existsSync(parentIndexFile)) {
        const apiDescription = productDescription ||
            `Use the InfluxDB HTTP API to write data, query data, and manage databases, tables, and tokens.`;
        const parentFrontmatter = {
            title: menuParent || 'InfluxDB HTTP API',
            description: apiDescription,
            weight: 104,
            type: 'api',
            articleDataKey,
            articleSection,
        };
        if (menuKey && !skipParentMenu) {
            parentFrontmatter.menu = {
                [menuKey]: {
                    name: menuParent || 'InfluxDB HTTP API',
                    identifier: `api-reference-${articleDataKey}-${sectionSlug}`,
                    parent: 'Reference',
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
        const introText = apiDescription.replace('InfluxDB', '{{% product-name %}}');
        const parentContent = `---
${yaml.dump(parentFrontmatter)}---

${introText}

{{< children >}}
`;
        fs.writeFileSync(parentIndexFile, parentContent);
        console.log(`✓ Generated parent index at ${parentIndexFile}`);
    }
    // Generate "All endpoints" page
    const allEndpointsDir = path.join(sectionDir, 'all-endpoints');
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
        articleDataKey,
        articleSection,
    };
    if (menuKey) {
        allEndpointsFrontmatter.menu = {
            [menuKey]: {
                name: 'All endpoints',
                identifier: `all-endpoints-${articleDataKey}-${sectionSlug}`,
                parent: menuParent || 'InfluxDB HTTP API',
            },
        };
    }
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
        if (!fs.existsSync(pagePath)) {
            fs.mkdirSync(pagePath, { recursive: true });
        }
        const title = article.fields.title || article.fields.name || article.path;
        const isConceptual = article.fields.isConceptual === true;
        const weight = article.fields.weight ?? 100;
        const frontmatter = {
            title,
            description: article.fields.description || `API reference for ${title}`,
            type: 'api',
            layout: isConceptual ? 'single' : 'list',
            staticFilePath: article.fields.staticFilePath,
            weight,
            tag: article.fields.tag,
            isConceptual,
            menuGroup: article.fields.menuGroup,
            specDownloadPath,
            articleDataKey,
            articleSection,
        };
        if (!isConceptual &&
            article.fields.operations &&
            article.fields.operations.length > 0) {
            frontmatter.operations = article.fields.operations;
        }
        if (isConceptual && article.fields.tagDescription) {
            frontmatter.tagDescription = article.fields.tagDescription;
        }
        if (article.fields.showSecuritySchemes) {
            frontmatter.showSecuritySchemes = true;
        }
        // Add related links if present
        if (article.fields.related &&
            Array.isArray(article.fields.related) &&
            article.fields.related.length > 0) {
            frontmatter.related = article.fields.related;
        }
        // Add client library related link for InfluxDB 3 products
        if (contentPath.includes('influxdb3/') && !isConceptual) {
            const influxdb3Match = contentPath.match(/influxdb3\/([^/]+)/);
            if (influxdb3Match) {
                const productSegment = influxdb3Match[1];
                const clientLibLink = {
                    title: 'InfluxDB 3 API client libraries',
                    href: `/influxdb3/${productSegment}/reference/client-libraries/v3/`,
                };
                const existing = frontmatter.related || [];
                const alreadyHas = existing.some((r) => typeof r === 'object' && r.href === clientLibLink.href);
                if (!alreadyHas) {
                    frontmatter.related = [...existing, clientLibLink];
                }
            }
        }
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
    console.log(`✓ Generated ${data.articles.length} tag-based content pages in ${contentPath}`);
}
// ---------------------------------------------------------------------------
// Spec processing
// ---------------------------------------------------------------------------
/**
 * Process a single API section: transform links, write static spec,
 * generate tag data, and create Hugo content pages.
 */
function processApiSection(product, api, staticBasePath) {
    const yaml = require('js-yaml');
    const isDualApi = product.apis.length > 1;
    console.log(`\n📄 Processing ${api.sectionSlug} section (${api.apiKey})`);
    // --- 1. Determine paths ---
    // Root spec download: single → {dir}.yml, dual → {dir}-{section}.yml
    const specSuffix = isDualApi ? `-${api.sectionSlug}` : '';
    const staticSpecPath = path.join(staticBasePath, `${product.staticDirName}${specSuffix}.yml`);
    const staticJsonSpecPath = staticSpecPath.replace('.yml', '.json');
    // Tag specs directory
    const tagSpecsBase = isDualApi
        ? path.join(staticBasePath, product.staticDirName, api.sectionSlug)
        : path.join(staticBasePath, product.staticDirName);
    // Article data
    const articlesPath = path.join(DOCS_ROOT, 'data/article_data/influxdb', product.staticDirName, api.sectionSlug);
    // Download path for frontmatter
    const specDownloadPath = `/openapi/${product.staticDirName}${specSuffix}.yml`;
    // Path spec files for per-operation rendering
    const pathSpecsDir = isDualApi
        ? path.join(staticBasePath, product.staticDirName, api.sectionSlug, 'paths')
        : path.join(staticBasePath, product.staticDirName, 'paths');
    // --- 2. Read and transform spec ---
    if (!fs.existsSync(api.specFile)) {
        console.warn(`⚠️  Spec file not found: ${api.specFile}`);
        return;
    }
    const specContent = fs.readFileSync(api.specFile, 'utf8');
    const specObject = yaml.load(specContent);
    const productPath = `/${product.productDir}`;
    const transformedSpec = transformDocLinks(specObject, productPath);
    console.log(`✓ Transformed documentation links for ${api.apiKey} to ${productPath}`);
    // Validate links if enabled
    if (validateLinks) {
        const contentDir = path.join(DOCS_ROOT, 'content');
        const linkErrors = validateDocLinks(transformedSpec, contentDir);
        if (linkErrors.length > 0) {
            console.warn(`\n⚠️  Link validation warnings for ${api.specFile}:`);
            linkErrors.forEach((err) => console.warn(`   ${err}`));
        }
    }
    // --- 3. Write transformed spec to static folder ---
    if (!fs.existsSync(staticBasePath)) {
        fs.mkdirSync(staticBasePath, { recursive: true });
    }
    fs.writeFileSync(staticSpecPath, yaml.dump(transformedSpec));
    console.log(`✓ Wrote transformed spec to ${staticSpecPath}`);
    fs.writeFileSync(staticJsonSpecPath, JSON.stringify(transformedSpec, null, 2));
    console.log(`✓ Generated JSON spec at ${staticJsonSpecPath}`);
    // --- 4. Generate tag-based data ---
    console.log(`\n📋 Generating tag-based data for ${api.apiKey} in ${tagSpecsBase}...`);
    openapiPathsToHugo.generateHugoDataByTag({
        specFile: staticSpecPath,
        dataOutPath: tagSpecsBase,
        articleOutPath: articlesPath,
        includePaths: true,
    });
    // Generate path-specific specs
    openapiPathsToHugo.generatePathSpecificSpecs(staticSpecPath, pathSpecsDir);
    // --- 5. Generate Hugo content pages ---
    generateTagPagesFromArticleData({
        articlesPath,
        contentPath: product.pagesDir,
        sectionSlug: api.sectionSlug,
        menuKey: product.menuKey,
        menuParent: 'InfluxDB HTTP API',
        skipParentMenu: product.skipParentMenu,
        specDownloadPath,
        articleDataKey: product.staticDirName,
        articleSection: api.sectionSlug,
    });
}
/**
 * Process a single product: clean outputs and process each API section.
 */
function processProduct(product, allStaticDirNames) {
    console.log('\n' + '='.repeat(80));
    console.log(`Processing ${product.productName}`);
    console.log('='.repeat(80));
    // Clean output directories before regeneration
    if (!noClean && !dryRun) {
        cleanProductOutputs(product, allStaticDirNames);
    }
    const staticBasePath = path.join(DOCS_ROOT, 'static/openapi');
    // Fetch specs if needed
    if (!skipFetch) {
        const getswaggerScript = path.join(API_DOCS_ROOT, 'getswagger.sh');
        if (fs.existsSync(getswaggerScript)) {
            // The build function in generate-api-docs.sh handles per-product
            // fetching. When called standalone, use product directory name.
            execCommand(`cd ${API_DOCS_ROOT} && ./getswagger.sh ${product.productDir} -B`, `Fetching OpenAPI spec for ${product.productName}`);
        }
        else {
            console.log(`⚠️  getswagger.sh not found, skipping fetch step`);
        }
    }
    else {
        console.log(`⏭️  Skipping getswagger.sh (--skip-fetch flag set)`);
    }
    // Process each API section independently
    for (const api of product.apis) {
        processApiSection(product, api, staticBasePath);
    }
    console.log(`\n✅ Successfully processed ${product.productName}\n`);
}
// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
    const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
    // Discover all products from .config.yml files
    const allProducts = discoverProducts();
    if (allProducts.length === 0) {
        console.error('❌ No products discovered. Ensure .config.yml files exist under api-docs/.');
        process.exit(1);
    }
    // Determine which products to process
    let productsToProcess;
    if (args.length === 0) {
        productsToProcess = allProducts;
        console.log(`\n📋 Discovered ${allProducts.length} products, processing all...\n`);
    }
    else {
        // Match by staticDirName or productDir
        productsToProcess = [];
        const invalid = [];
        for (const arg of args) {
            const found = allProducts.find((p) => p.staticDirName === arg ||
                p.productDir === arg ||
                p.productDir.replace(/\//g, '-') === arg);
            if (found) {
                productsToProcess.push(found);
            }
            else {
                invalid.push(arg);
            }
        }
        if (invalid.length > 0) {
            console.error(`\n❌ Unknown product identifier(s): ${invalid.join(', ')}`);
            console.error('\nDiscovered products:');
            allProducts.forEach((p) => {
                console.error(`  - ${p.staticDirName} (${p.productName}) [${p.productDir}]`);
            });
            process.exit(1);
        }
        console.log(`\n📋 Processing specified products: ${productsToProcess.map((p) => p.staticDirName).join(', ')}\n`);
    }
    // Collect all staticDirNames for prefix-safe cleanup
    const allStaticDirNames = allProducts.map((p) => p.staticDirName);
    // Handle dry-run mode
    if (dryRun) {
        console.log('\n📋 DRY RUN MODE - No files will be modified\n');
        productsToProcess.forEach((p) => showDryRunPreview(p, allStaticDirNames));
        console.log('\nDry run complete. No files were modified.');
        return;
    }
    // Process each product
    productsToProcess.forEach((product) => {
        processProduct(product, allStaticDirNames);
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