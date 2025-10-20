/**
 * Content scaffolding utilities for InfluxData documentation
 * Analyzes repository structure and prepares context for Claude
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
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
 * Analyze content directory structure
 * @param {string} basePath - Base path to analyze (e.g., 'content/influxdb3')
 * @returns {object} Structure analysis
 */
export function analyzeStructure(basePath = 'content/influxdb3') {
  const fullPath = join(REPO_ROOT, basePath);

  if (!existsSync(fullPath)) {
    return { sections: [], existingPaths: [], siblingWeights: {} };
  }

  const sections = [];
  const existingPaths = [];
  const siblingWeights = {};

  // Recursively walk directory
  function walk(dir, relativePath = '') {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullEntryPath = join(dir, entry);
      const relativeEntryPath = join(relativePath, entry);
      const stat = statSync(fullEntryPath);

      if (stat.isDirectory()) {
        // Track sections (top-level directories)
        if (relativePath === '') {
          sections.push(entry);
        }

        // Track all directory paths
        existingPaths.push(join(basePath, relativeEntryPath));

        // Recurse
        walk(fullEntryPath, relativeEntryPath);
      }
    }
  }

  walk(fullPath);

  // Analyze weights in common sections
  const commonSections = [
    'admin',
    'write-data',
    'query-data',
    'reference',
    'get-started',
  ];
  for (const section of commonSections) {
    const sectionPath = join(fullPath, 'core', section);
    if (existsSync(sectionPath)) {
      const weights = findSiblingWeights(sectionPath);
      if (weights.length > 0) {
        siblingWeights[`${basePath}/core/${section}/`] = weights;
      }
    }
  }

  return {
    sections: [...new Set(sections)].sort(),
    existingPaths: existingPaths.sort(),
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
 * Prepare complete context for Claude analysis
 * @param {string} draftPath - Path to draft file
 * @returns {object} Context object
 */
export function prepareContext(draftPath) {
  // Read draft
  const draft = readDraft(draftPath);

  // Load products
  const products = loadProducts();

  // Analyze structure
  const structure = analyzeStructure();

  // Build context
  const context = {
    draft: {
      path: draftPath,
      content: draft.content,
      existingFrontmatter: draft.frontmatter,
    },
    products,
    structure,
    conventions: {
      sharedContentDir: 'content/shared/',
      menuKeyPattern: 'influxdb3_{product}',
      weightLevels: {
        description: 'Weight ranges by level',
        level1: '1-99',
        level2: '101-199',
        level3: '201-299',
        level4: '301-399',
      },
      namingRules: {
        files: 'Use lowercase with hyphens (e.g., manage-databases.md)',
        directories: 'Use lowercase with hyphens',
        shared: 'Shared content in /content/shared/',
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
