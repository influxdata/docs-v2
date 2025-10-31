/**
 * Content scaffolding utilities for InfluxData documentation
 * Analyzes repository structure and prepares context for Claude
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import {
  readDraft,
  writeJson,
  writeMarkdownFile,
  writeFrontmatterFile,
  validatePath,
  ensureDirectory,
} from './file-operations.js';
import { urlToFilePaths } from './url-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Repository root is two levels up from scripts/lib/
const REPO_ROOT = join(__dirname, '../..');

/**
 * Load products configuration from data/products.yml
 * @returns {object} Products configuration
 */
export function loadProducts() {
  const productsPath = join(REPO_ROOT, 'data/products.yml');

  if (!existsSync(productsPath)) {
    throw new Error('products.yml not found at ' + productsPath);
  }

  const productsYaml = readFileSync(productsPath, 'utf8');
  const products = yaml.load(productsYaml);

  // Transform into more useful structure
  const productMap = {};
  for (const [key, value] of Object.entries(products)) {
    productMap[key] = {
      key,
      name: value.name,
      namespace: value.namespace,
      menu_category: value.menu_category,
      versions: value.versions || [],
      latest: value.latest,
    };
  }

  return productMap;
}

/**
 * Extract product mentions from draft content
 * @param {string} content - Draft content to analyze
 * @param {object} products - Products map from loadProducts()
 * @returns {string[]} Array of product keys mentioned
 */
export function extractProductMentions(content, products) {
  const mentioned = new Set();
  const contentLower = content.toLowerCase();

  // Product name patterns to search for
  const patterns = {
    influxdb3_core: [
      'influxdb 3 core',
      'influxdb3 core',
      'influxdb core',
      'core version',
    ],
    influxdb3_enterprise: [
      'influxdb 3 enterprise',
      'influxdb3 enterprise',
      'influxdb enterprise',
      'enterprise version',
    ],
    influxdb3_cloud_dedicated: [
      'cloud dedicated',
      'influxdb cloud dedicated',
      'dedicated cluster',
    ],
    influxdb3_cloud_serverless: [
      'cloud serverless',
      'influxdb cloud serverless',
      'serverless',
    ],
    influxdb3_clustered: ['clustered', 'influxdb clustered', 'kubernetes'],
    influxdb_cloud: ['influxdb cloud', 'influxdb 2 cloud'],
    influxdb_v2: ['influxdb 2', 'influxdb v2', 'influxdb 2.x'],
    influxdb_v1: ['influxdb 1', 'influxdb v1', 'influxdb 1.x'],
  };

  // Check for each product's patterns
  for (const [productKey, productPatterns] of Object.entries(patterns)) {
    for (const pattern of productPatterns) {
      if (contentLower.includes(pattern)) {
        mentioned.add(productKey);
        break;
      }
    }
  }

  return Array.from(mentioned);
}

/**
 * Detect InfluxDB version and related tools from draft content
 * @param {string} content - Draft content to analyze
 * @returns {object} Version information
 */
export function detectInfluxDBVersion(content) {
  const contentLower = content.toLowerCase();

  // Version detection patterns
  const versionInfo = {
    version: null,
    tools: [],
    apis: [],
  };

  // Detect version
  if (
    contentLower.includes('influxdb 3') ||
    contentLower.includes('influxdb3')
  ) {
    versionInfo.version = '3.x';

    // v3-specific tools
    if (
      contentLower.includes('influxdb3 ') ||
      contentLower.includes('influxdb3-')
    ) {
      versionInfo.tools.push('influxdb3 CLI');
    }
    if (contentLower.includes('influxctl')) {
      versionInfo.tools.push('influxctl');
    }
    if (contentLower.includes('/api/v3')) {
      versionInfo.apis.push('/api/v3');
    }
  } else if (
    contentLower.includes('influxdb 2') ||
    contentLower.includes('influxdb v2')
  ) {
    versionInfo.version = '2.x';

    // v2-specific tools
    if (contentLower.includes('influx ')) {
      versionInfo.tools.push('influx CLI');
    }
    if (contentLower.includes('/api/v2')) {
      versionInfo.apis.push('/api/v2');
    }
  } else if (
    contentLower.includes('influxdb 1') ||
    contentLower.includes('influxdb v1')
  ) {
    versionInfo.version = '1.x';

    // v1-specific tools
    if (contentLower.includes('influx -')) {
      versionInfo.tools.push('influx CLI (v1)');
    }
    if (contentLower.includes('influxd')) {
      versionInfo.tools.push('influxd');
    }
  }

  // Common tools across versions
  if (contentLower.includes('telegraf')) {
    versionInfo.tools.push('Telegraf');
  }

  return versionInfo;
}

/**
 * Analyze content directory structure
 * @param {string|string[]} basePaths - Base path(s) to analyze (e.g., 'content/influxdb3' or ['content/influxdb3', 'content/influxdb'])
 * @returns {object} Structure analysis
 */
export function analyzeStructure(basePaths = 'content/influxdb3') {
  // Normalize to array
  const pathsArray = Array.isArray(basePaths) ? basePaths : [basePaths];

  const allSections = new Set();
  const allExistingPaths = [];
  const siblingWeights = {};

  // Analyze each base path
  for (const basePath of pathsArray) {
    const fullPath = join(REPO_ROOT, basePath);

    if (!existsSync(fullPath)) {
      continue;
    }

    // Recursively walk directory
    function walk(dir, relativePath = '') {
      try {
        const entries = readdirSync(dir);

        for (const entry of entries) {
          const fullEntryPath = join(dir, entry);
          const relativeEntryPath = join(relativePath, entry);

          try {
            const stat = statSync(fullEntryPath);

            if (stat.isDirectory()) {
              // Track product-level directories (first level under content/namespace/)
              const pathParts = relativeEntryPath.split('/');
              if (pathParts.length === 2) {
                // This is a product directory (e.g., 'core', 'enterprise')
                allSections.add(pathParts[1]);
              }

              // Track all directory paths
              allExistingPaths.push(join(basePath, relativeEntryPath));

              // Recurse
              walk(fullEntryPath, relativeEntryPath);
            }
          } catch (error) {
            // Skip files/dirs we can't access
            continue;
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    walk(fullPath);

    // Analyze weights in common sections for all product directories
    const commonSections = [
      'admin',
      'write-data',
      'query-data',
      'reference',
      'get-started',
      'plugins',
    ];

    // Find all product directories (e.g., core, enterprise, cloud-dedicated)
    try {
      const productDirs = readdirSync(fullPath).filter((entry) => {
        const fullEntryPath = join(fullPath, entry);
        return (
          existsSync(fullEntryPath) && statSync(fullEntryPath).isDirectory()
        );
      });

      for (const productDir of productDirs) {
        for (const section of commonSections) {
          const sectionPath = join(fullPath, productDir, section);
          if (existsSync(sectionPath)) {
            const weights = findSiblingWeights(sectionPath);
            if (weights.length > 0) {
              siblingWeights[`${basePath}/${productDir}/${section}/`] = weights;
            }
          }
        }
      }
    } catch (error) {
      // Skip if we can't read directory
    }
  }

  return {
    sections: [...allSections].sort(),
    existingPaths: allExistingPaths.sort(),
    siblingWeights,
  };
}

/**
 * Find weight values from sibling pages in a directory
 * @param {string} dirPath - Directory to analyze
 * @returns {number[]} Array of weight values
 */
export function findSiblingWeights(dirPath) {
  if (!existsSync(dirPath)) {
    return [];
  }

  const weights = [];
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    if (entry.endsWith('.md')) {
      const filePath = join(dirPath, entry);
      try {
        const content = readFileSync(filePath, 'utf8');
        const parsed = matter(content);

        if (parsed.data && typeof parsed.data.weight === 'number') {
          weights.push(parsed.data.weight);
        }
      } catch (error) {
        // Skip files that can't be parsed
        continue;
      }
    }
  }

  return weights.sort((a, b) => a - b);
}

/**
 * Prepare complete context for AI analysis
 * @param {string|object} draftPathOrObject - Path to draft file or draft object
 * @returns {object} Context object
 */
export function prepareContext(draftPathOrObject) {
  // Read draft - handle both file path and draft object
  let draft;
  if (typeof draftPathOrObject === 'string') {
    draft = readDraft(draftPathOrObject);
    draft.path = draftPathOrObject;
  } else {
    // Already a draft object from stdin
    draft = draftPathOrObject;
  }

  // Load products
  const products = loadProducts();

  // Extract product mentions from draft
  const mentionedProducts = extractProductMentions(draft.content, products);

  // Detect InfluxDB version and tools
  const versionInfo = detectInfluxDBVersion(draft.content);

  // Determine which content paths to analyze based on version
  let contentPaths = [];
  if (versionInfo.version === '3.x') {
    contentPaths = ['content/influxdb3'];
  } else if (versionInfo.version === '2.x') {
    contentPaths = ['content/influxdb'];
  } else if (versionInfo.version === '1.x') {
    contentPaths = ['content/influxdb/v1', 'content/enterprise_influxdb/v1'];
  } else {
    // Default: analyze all
    contentPaths = ['content/influxdb3', 'content/influxdb'];
  }

  // Analyze structure for relevant paths
  const structure = analyzeStructure(contentPaths);

  // Build context
  const context = {
    draft: {
      path: draft.path || draftPathOrObject,
      content: draft.content,
      existingFrontmatter: draft.frontmatter,
    },
    products,
    productHints: {
      mentioned: mentionedProducts,
      suggested:
        mentionedProducts.length > 0
          ? mentionedProducts
          : Object.keys(products).filter(
              (key) =>
                key.startsWith('influxdb3_') || key.startsWith('influxdb_v')
            ),
    },
    versionInfo,
    structure,
    conventions: {
      sharedContentDir: 'content/shared/',
      menuKeyPattern: '{namespace}_{product}',
      weightLevels: {
        description: 'Weight ranges by level',
        level1: '1-99 (top-level pages)',
        level2: '101-199 (section landing pages)',
        level3: '201-299 (detail pages)',
        level4: '301-399 (sub-detail pages)',
      },
      namingRules: {
        files: 'Use lowercase with hyphens (e.g., manage-databases.md)',
        directories: 'Use lowercase with hyphens',
        shared: 'Shared content in /content/shared/',
      },
      testing: {
        codeblocks: 'Use pytest-codeblocks annotations for testable examples',
        docker: 'Use compose.yaml services for testing code samples',
        commands: `Version-specific CLIs: ${versionInfo.tools.join(', ') || 'detected from content'}`,
      },
    },
  };

  return context;
}

/**
 * Execute a proposal and create files
 * @param {object} proposal - Proposal from Claude
 * @returns {{created: string[], errors: string[]}}
 */
export function executeProposal(proposal) {
  const created = [];
  const errors = [];

  if (!proposal || !proposal.files) {
    throw new Error('Invalid proposal: missing files array');
  }

  for (const file of proposal.files) {
    try {
      // Validate path
      const validation = validatePath(file.path);
      if (!validation.valid) {
        errors.push(
          `Invalid path ${file.path}: ${validation.errors.join(', ')}`
        );
        continue;
      }

      const fullPath = join(REPO_ROOT, file.path);

      // Check if file already exists
      if (existsSync(fullPath)) {
        errors.push(`File already exists: ${file.path}`);
        continue;
      }

      // Create file based on type
      if (file.type === 'shared-content') {
        // Shared content file with actual content
        writeMarkdownFile(fullPath, {}, file.content || '');
        created.push(file.path);
      } else if (file.type === 'frontmatter-only') {
        // Frontmatter-only file with source reference
        if (!file.frontmatter) {
          errors.push(`Missing frontmatter for ${file.path}`);
          continue;
        }

        const sourcePath = file.frontmatter.source || '';
        writeFrontmatterFile(fullPath, file.frontmatter, sourcePath);
        created.push(file.path);
      } else {
        errors.push(`Unknown file type: ${file.type} for ${file.path}`);
      }
    } catch (error) {
      errors.push(`Error creating ${file.path}: ${error.message}`);
    }
  }

  return { created, errors };
}

/**
 * Validate a proposal before execution
 * @param {object} proposal - Proposal to validate
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
export function validateProposal(proposal) {
  const errors = [];
  const warnings = [];

  if (!proposal) {
    return {
      valid: false,
      errors: ['Proposal is null or undefined'],
      warnings,
    };
  }

  if (!proposal.files || !Array.isArray(proposal.files)) {
    errors.push('Proposal must have a files array');
    return { valid: false, errors, warnings };
  }

  if (proposal.files.length === 0) {
    warnings.push('Proposal has no files to create');
  }

  // Validate each file
  for (const file of proposal.files) {
    if (!file.path) {
      errors.push('File missing path property');
      continue;
    }

    if (!file.type) {
      errors.push(`File ${file.path} missing type property`);
    }

    // Path validation
    const pathValidation = validatePath(file.path);
    if (!pathValidation.valid) {
      errors.push(
        `Invalid path ${file.path}: ${pathValidation.errors.join(', ')}`
      );
    }

    // Check for conflicts
    const fullPath = join(REPO_ROOT, file.path);
    if (existsSync(fullPath)) {
      warnings.push(`File already exists: ${file.path}`);
    }

    // Type-specific validation
    if (file.type === 'frontmatter-only') {
      if (!file.frontmatter) {
        errors.push(`Frontmatter-only file ${file.path} missing frontmatter`);
      } else {
        if (!file.frontmatter.title) {
          errors.push(`File ${file.path} missing title in frontmatter`);
        }
        if (!file.frontmatter.description) {
          warnings.push(`File ${file.path} missing description in frontmatter`);
        }
        if (!file.frontmatter.menu) {
          errors.push(`File ${file.path} missing menu in frontmatter`);
        }
        if (!file.frontmatter.weight) {
          errors.push(`File ${file.path} missing weight in frontmatter`);
        }
        if (!file.frontmatter.source) {
          warnings.push(`File ${file.path} missing source reference`);
        }
      }
    } else if (file.type === 'shared-content') {
      if (!file.content) {
        warnings.push(`Shared content file ${file.path} has no content`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Suggest next weight value for a section
 * @param {number[]} existingWeights - Existing weights in section
 * @param {number} level - Weight level (1-4)
 * @returns {number} Suggested next weight
 */
export function suggestNextWeight(existingWeights, level = 3) {
  const baseLevels = {
    1: 1,
    2: 101,
    3: 201,
    4: 301,
  };

  const base = baseLevels[level] || 201;
  const maxWeight = base + 98; // Each level has 99 slots

  if (existingWeights.length === 0) {
    return base;
  }

  // Find weights in this level
  const levelWeights = existingWeights.filter(
    (w) => w >= base && w <= maxWeight
  );

  if (levelWeights.length === 0) {
    return base;
  }

  // Return max + 1
  return Math.max(...levelWeights) + 1;
}

/**
 * Find file from parsed URL
 * @param {object} parsedURL - Parsed URL from url-parser.js
 * @returns {object|null} File information or null if not found
 */
export function findFileFromURL(parsedURL) {
  const potentialPaths = urlToFilePaths(parsedURL);

  for (const relativePath of potentialPaths) {
    const fullPath = join(REPO_ROOT, relativePath);
    if (existsSync(fullPath)) {
      return {
        path: relativePath,
        fullPath,
        exists: true,
      };
    }
  }

  // File doesn't exist, return first potential path for creation
  return {
    path: potentialPaths[0],
    fullPath: join(REPO_ROOT, potentialPaths[0]),
    exists: false,
  };
}

/**
 * Detect if a file uses shared content
 * @param {string} filePath - Path to file (relative to repo root)
 * @returns {string|null} Shared source path if found, null otherwise
 */
export function detectSharedContent(filePath) {
  const fullPath = join(REPO_ROOT, filePath);

  if (!existsSync(fullPath)) {
    return null;
  }

  try {
    const content = readFileSync(fullPath, 'utf8');
    const parsed = matter(content);

    if (parsed.data && parsed.data.source) {
      return parsed.data.source;
    }
  } catch (_error) {
    // Can't parse, assume not shared
    return null;
  }

  return null;
}

/**
 * Find all files that reference a shared source
 * @param {string} sourcePath - Path to shared content file (e.g., "/shared/influxdb3-admin/databases.md")
 * @returns {string[]} Array of file paths that use this shared source
 */
export function findSharedContentVariants(sourcePath) {
  const variants = [];

  // Search content directories
  const contentDirs = [
    'content/influxdb3',
    'content/influxdb',
    'content/telegraf',
  ];

  function searchDirectory(dir) {
    if (!existsSync(dir)) {
      return;
    }

    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          searchDirectory(fullPath);
        } else if (entry.endsWith('.md')) {
          try {
            const content = readFileSync(fullPath, 'utf8');
            const parsed = matter(content);

            if (parsed.data && parsed.data.source === sourcePath) {
              // Convert to relative path from repo root
              const relativePath = fullPath.replace(REPO_ROOT + '/', '');
              variants.push(relativePath);
            }
          } catch (_error) {
            // Skip files that can't be parsed
            continue;
          }
        }
      }
    } catch (_error) {
      // Skip directories we can't read
    }
  }

  for (const contentDir of contentDirs) {
    searchDirectory(join(REPO_ROOT, contentDir));
  }

  return variants;
}

/**
 * Analyze an existing page
 * @param {string} filePath - Path to file (relative to repo root)
 * @returns {object} Page analysis
 */
export function analyzeExistingPage(filePath) {
  const fullPath = join(REPO_ROOT, filePath);

  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = readFileSync(fullPath, 'utf8');
  const parsed = matter(content);

  const analysis = {
    path: filePath,
    fullPath,
    content: parsed.content,
    frontmatter: parsed.data,
    isShared: false,
    sharedSource: null,
    variants: [],
  };

  // Check if this file uses shared content
  if (parsed.data && parsed.data.source) {
    analysis.isShared = true;
    analysis.sharedSource = parsed.data.source;

    // Find all variants that use the same shared source
    analysis.variants = findSharedContentVariants(parsed.data.source);
  }

  return analysis;
}

/**
 * Analyze multiple URLs and find their files
 * @param {object[]} parsedURLs - Array of parsed URLs
 * @returns {object[]} Array of URL analysis results
 */
export function analyzeURLs(parsedURLs) {
  const results = [];

  for (const parsedURL of parsedURLs) {
    const fileInfo = findFileFromURL(parsedURL);

    const result = {
      url: parsedURL.url,
      parsed: parsedURL,
      exists: fileInfo.exists,
      files: {
        main: fileInfo.path,
        isShared: false,
        sharedSource: null,
        variants: [],
      },
    };

    if (fileInfo.exists) {
      // Analyze existing page
      try {
        const analysis = analyzeExistingPage(fileInfo.path);
        result.files.isShared = analysis.isShared;
        result.files.sharedSource = analysis.sharedSource;
        result.files.variants = analysis.variants;
      } catch (error) {
        console.error(`Error analyzing ${fileInfo.path}: ${error.message}`);
      }
    }

    results.push(result);
  }

  return results;
}

/**
 * Extract and categorize links from markdown content
 * @param {string} content - Markdown content
 * @returns {object} {localFiles: string[], external: string[]}
 */
export function extractLinks(content) {
  const localFiles = [];
  const external = [];

  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];

    // Skip anchor links and mailto
    if (url.startsWith('#') || url.startsWith('mailto:')) {
      continue;
    }

    // Local file paths (relative paths) - automatically followed
    if (url.startsWith('../') || url.startsWith('./')) {
      localFiles.push(url);
    }
    // All HTTP/HTTPS URLs (including docs.influxdata.com) - user selects
    else if (url.startsWith('http://') || url.startsWith('https://')) {
      external.push(url);
    }
    // Absolute paths starting with / are ignored (no base context to resolve)
  }

  return {
    localFiles: [...new Set(localFiles)],
    external: [...new Set(external)],
  };
}

/**
 * Follow local file links (relative paths)
 * @param {string[]} links - Array of relative file paths
 * @param {string} basePath - Base path to resolve relative links from
 * @returns {object[]} Array of {url, title, content, path, frontmatter}
 */
export function followLocalLinks(links, basePath = REPO_ROOT) {
  const results = [];

  for (const link of links) {
    try {
      // Resolve relative path from base path
      const filePath = resolve(basePath, link);

      // Check if file exists
      if (existsSync(filePath)) {
        const fileContent = readFileSync(filePath, 'utf8');
        const parsed = matter(fileContent);

        results.push({
          url: link,
          title: parsed.data?.title || 'Untitled',
          content: parsed.content,
          path: filePath.replace(REPO_ROOT + '/', ''),
          frontmatter: parsed.data,
          type: 'local',
        });
      } else {
        results.push({
          url: link,
          error: 'File not found',
          type: 'local',
        });
      }
    } catch (error) {
      results.push({
        url: link,
        error: error.message,
        type: 'local',
      });
    }
  }

  return results;
}

/**
 * Fetch external URLs
 * @param {string[]} urls - Array of external URLs
 * @returns {Promise<object[]>} Array of {url, title, content, type}
 */
export async function fetchExternalLinks(urls) {
  // Dynamic import axios
  const axios = (await import('axios')).default;
  const results = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: { 'User-Agent': 'InfluxData-Docs-Bot/1.0' },
      });

      // Extract title from HTML or use URL
      const titleMatch = response.data.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : url;

      results.push({
        url,
        title,
        content: response.data,
        type: 'external',
        contentType: response.headers['content-type'],
      });
    } catch (error) {
      results.push({
        url,
        error: error.message,
        type: 'external',
      });
    }
  }

  return results;
}
