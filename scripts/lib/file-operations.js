/**
 * File operations utilities for documentation scaffolding
 * Handles reading, writing, and validating documentation files
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join, basename } from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

/**
 * Read a markdown file and parse frontmatter
 * @param {string} filePath - Path to the markdown file
 * @returns {{content: string, frontmatter: object, raw: string}}
 */
export function readDraft(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = readFileSync(filePath, 'utf8');
  const parsed = matter(raw);

  return {
    content: parsed.content,
    frontmatter: parsed.data || {},
    raw,
  };
}

/**
 * Write a markdown file with frontmatter
 * @param {string} filePath - Path to write to
 * @param {object} frontmatter - Frontmatter object
 * @param {string} content - Markdown content
 */
export function writeMarkdownFile(filePath, frontmatter, content) {
  ensureDirectory(dirname(filePath));

  const frontmatterYaml = yaml.dump(frontmatter, {
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
  });

  const fileContent = `---\n${frontmatterYaml}---\n\n${content}`;
  writeFileSync(filePath, fileContent, 'utf8');
}

/**
 * Write a frontmatter-only file with source reference
 * @param {string} filePath - Path to write to
 * @param {object} frontmatter - Frontmatter object
 * @param {string} sourcePath - Path to shared content file
 */
export function writeFrontmatterFile(filePath, frontmatter, sourcePath) {
  ensureDirectory(dirname(filePath));

  const frontmatterYaml = yaml.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
  });

  const comment = `<!-- \nThe content of this page is at\n// SOURCE ${sourcePath}\n-->`;
  const fileContent = `---\n${frontmatterYaml}---\n\n${comment}\n`;

  writeFileSync(filePath, fileContent, 'utf8');
}

/**
 * Ensure a directory exists, creating it recursively if needed
 * @param {string} dirPath - Directory path to ensure
 */
export function ensureDirectory(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Validate a file path follows conventions
 * @param {string} filePath - Path to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePath(filePath) {
  const errors = [];

  // Check for invalid characters
  if (filePath.includes(' ')) {
    errors.push('Path contains spaces (use hyphens instead)');
  }

  if (filePath.match(/[A-Z]/)) {
    errors.push('Path contains uppercase letters (use lowercase)');
  }

  // Check naming conventions
  const fileName = basename(filePath, '.md');
  if (fileName.includes('_') && !filePath.includes('/shared/')) {
    errors.push('Use hyphens instead of underscores in file names');
  }

  // Check structure
  if (!filePath.startsWith('content/')) {
    errors.push('Path should start with content/');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format frontmatter object to YAML string
 * @param {object} frontmatter - Frontmatter object
 * @returns {string} YAML string
 */
export function formatFrontmatter(frontmatter) {
  return yaml.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
  });
}

/**
 * Read a JSON file
 * @param {string} filePath - Path to JSON file
 * @returns {object} Parsed JSON
 */
export function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

/**
 * Write a JSON file with pretty formatting
 * @param {string} filePath - Path to write to
 * @param {object} data - Data to write
 */
export function writeJson(filePath, data) {
  ensureDirectory(dirname(filePath));
  const content = JSON.stringify(data, null, 2);
  writeFileSync(filePath, content, 'utf8');
}

/**
 * Check if a file exists
 * @param {string} filePath - Path to check
 * @returns {boolean}
 */
export function fileExists(filePath) {
  return existsSync(filePath);
}
