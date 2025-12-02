/**
 * Content Utilities Library
 *
 * Shared utilities for working with content files, including:
 * - Detecting changed files via git
 * - Resolving shared content dependencies
 * - Mapping content paths to public/URL paths
 * - Extracting source frontmatter
 *
 * Used by:
 * - scripts/build-llm-markdown.js (incremental builds)
 * - scripts/docs-edit.js (opening shared source files)
 * - cypress/support/map-files-to-urls.js (test file mapping)
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * Find pages that reference a shared content file via source: frontmatter
 * @param {string} sharedFilePath - Path to shared file (e.g., 'content/shared/sql-reference/_index.md')
 * @returns {string[]} Array of content file paths that reference this shared file
 */
export function findPagesReferencingSharedContent(sharedFilePath) {
  try {
    // Remove leading "content/" to match frontmatter format (source: /shared/...)
    const relativePath = sharedFilePath.replace(/^content\//, '');

    // Use grep to find files with source: <path> in frontmatter
    // Include both .md and .html files for compatibility
    const grepCmd = `grep -l "source: .*${relativePath}" --include="*.md" --include="*.html" -r content/`;

    const result = execSync(grepCmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    return result ? result.split('\n').filter(Boolean) : [];
  } catch (err) {
    // grep returns exit code 1 when no matches found
    if (err.status === 1) {
      return [];
    }
    console.warn(
      `  ⚠️  Error finding references to ${sharedFilePath}: ${err.message}`
    );
    return [];
  }
}

/**
 * Expand a list of changed files to include pages that reference changed shared content
 * @param {string[]} changedFiles - Array of changed file paths
 * @param {Object} options - Options
 * @param {boolean} options.verbose - Log details about shared content resolution
 * @returns {string[]} Expanded array including pages referencing changed shared content
 */
export function expandSharedContentChanges(changedFiles, options = {}) {
  const { verbose = false } = options;

  // Separate shared and regular content files
  const sharedFiles = changedFiles.filter((f) =>
    f.startsWith('content/shared/')
  );
  const regularFiles = changedFiles.filter(
    (f) => !f.startsWith('content/shared/')
  );

  // Start with regular files
  const allAffectedFiles = new Set(regularFiles);

  // For each changed shared file, find all pages that reference it
  if (sharedFiles.length > 0) {
    if (verbose) {
      console.log(
        `  📎 Found ${sharedFiles.length} shared content changes, finding referencing pages...`
      );
    }

    for (const sharedFile of sharedFiles) {
      const referencingPages = findPagesReferencingSharedContent(sharedFile);
      if (referencingPages.length > 0) {
        if (verbose) {
          console.log(`     ${sharedFile} → ${referencingPages.length} pages`);
        }
        referencingPages.forEach((page) => allAffectedFiles.add(page));
      }
    }
  }

  return Array.from(allAffectedFiles);
}

/**
 * Get list of content files that changed compared to base branch
 * Includes both committed changes and uncommitted working tree changes
 * Expands shared content changes to include all pages that reference them
 * @param {string} baseBranch - Branch to compare against (e.g., 'origin/master')
 * @param {Object} options - Options
 * @param {boolean} options.verbose - Log details about change detection
 * @returns {string[]} Array of changed content file paths
 */
export function getChangedContentFiles(baseBranch, options = {}) {
  const { verbose = true } = options;

  try {
    const allChangedFiles = new Set();

    // Get committed changes between base branch and HEAD
    try {
      const committedOutput = execSync(
        `git diff --name-only ${baseBranch}...HEAD -- content/`,
        {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
      committedOutput
        .trim()
        .split('\n')
        .filter(Boolean)
        .forEach((f) => allChangedFiles.add(f));
    } catch {
      // May fail if baseBranch doesn't exist locally
    }

    // Get uncommitted changes (staged + unstaged) in working tree
    try {
      const uncommittedOutput = execSync(
        `git diff --name-only HEAD -- content/`,
        {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
      uncommittedOutput
        .trim()
        .split('\n')
        .filter(Boolean)
        .forEach((f) => allChangedFiles.add(f));
    } catch {
      // May fail in detached HEAD state
    }

    // Get staged changes
    try {
      const stagedOutput = execSync(
        `git diff --name-only --cached -- content/`,
        {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );
      stagedOutput
        .trim()
        .split('\n')
        .filter(Boolean)
        .forEach((f) => allChangedFiles.add(f));
    } catch {
      // Ignore errors
    }

    const changedFiles = Array.from(allChangedFiles);

    // Expand to include pages referencing changed shared content
    return expandSharedContentChanges(changedFiles, { verbose });
  } catch (err) {
    console.warn(`  ⚠️  Could not detect changed files: ${err.message}`);
    return []; // Fall back to full build
  }
}

/**
 * Map content file paths to their corresponding public HTML paths
 * @param {string[]} contentFiles - Array of content file paths (e.g., 'content/influxdb3/core/page.md')
 * @param {string} publicDir - Public directory (e.g., 'public' or 'workspace/public')
 * @returns {Set<string>} Set of public HTML file paths
 */
export function mapContentToPublic(contentFiles, publicDir) {
  const htmlPaths = new Set();

  for (const file of contentFiles) {
    // Only process markdown files
    if (!file.endsWith('.md')) continue;

    // Remove content/ prefix and .md extension
    let urlPath = file.replace(/^content\//, '').replace(/\.md$/, '');

    // Handle _index.md (section pages) - remove the _index suffix
    urlPath = urlPath.replace(/\/_index$/, '');

    // Build public HTML path
    const htmlPath = `${publicDir}/${urlPath}/index.html`.replace(/\/+/g, '/');
    htmlPaths.add(htmlPath);
  }

  return htmlPaths;
}

/**
 * Separate content files into shared and regular categories
 * @param {string[]} files - Array of file paths
 * @returns {{shared: string[], regular: string[]}} Categorized files
 */
export function categorizeContentFiles(files) {
  const shared = files.filter(
    (file) =>
      file.startsWith('content/shared/') &&
      (file.endsWith('.md') || file.endsWith('.html'))
  );

  const regular = files.filter(
    (file) =>
      file.startsWith('content/') &&
      !file.startsWith('content/shared/') &&
      (file.endsWith('.md') || file.endsWith('.html'))
  );

  return { shared, regular };
}

/**
 * Extract the source path from a file's frontmatter
 * Used to find the shared content file that a page includes
 * @param {string} filePath - Path to the content file
 * @returns {string|null} The source path (e.g., 'content/shared/sql-reference/_index.md') or null
 */
export function getSourceFromFrontmatter(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');

    // Quick regex check for source: in frontmatter (avoids full YAML parsing)
    const sourceMatch = content.match(/^source:\s*(.+)$/m);
    if (sourceMatch) {
      const sourcePath = sourceMatch[1].trim();
      // Normalize to content/ prefix format
      if (sourcePath.startsWith('/')) {
        return `content${sourcePath}`;
      }
      return sourcePath;
    }

    return null;
  } catch {
    return null;
  }
}
