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

import { execSync, execFileSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * Find pages that reference a shared content file via source: frontmatter
 * @param {string} sharedFilePath - Path to shared file (e.g., 'content/shared/sql-reference/_index.md')
 * @returns {string[]} Array of content file paths that reference this shared file
 */
export function findPagesReferencingSharedContent(sharedFilePath, { searchRoot = 'content/' } = {}) {
  try {
    // Remove leading "content/" to match frontmatter format (source: /shared/...)
    const relativePath = sharedFilePath.replace(/^content\//, '');

    // Use execFileSync with an explicit args array to avoid shell-quoting
    // issues with unusual filenames. Fixed-string matching (-F) avoids
    // treating path characters (dots, slashes) as regex metacharacters.
    // Patterns cover all known source: variants — unquoted and quoted
    // forms in both single and double quotes — across the three known
    // path shapes:
    //   /shared/...          (canonical, common)
    //   shared/...           (unslashed)
    //   /content/shared/...  (repo-relative with leading /content)
    // The post-filter (getSourceFromFrontmatter ===) is the source of
    // truth; grep is just a coarse prefilter to avoid scanning every
    // file's frontmatter. Missing a quoted form here would silently
    // drop true consumers, so cover all combinations.
    const grepArgs = ['-rFl'];
    for (const path of [
      `/${relativePath}`,
      relativePath,
      `/content/${relativePath}`,
    ]) {
      grepArgs.push('-e', `source: ${path}`);
      grepArgs.push('-e', `source: "${path}"`);
      grepArgs.push('-e', `source: '${path}'`);
    }
    grepArgs.push('--include=*.md', '--include=*.html', searchRoot);

    const result = execFileSync('grep', grepArgs, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const candidates = result ? result.split('\n').filter(Boolean) : [];

    // Post-filter: grep matches anywhere in the file; verify the match is
    // actually in the frontmatter source: field, not prose or a code example.
    return candidates.filter(
      (f) => getSourceFromFrontmatter(f) === sharedFilePath
    );
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
 * Used to find the shared content file that a page includes.
 * Matches only within the top-of-file frontmatter block (between `---`
 * delimiters) to avoid false positives from `source:` lines inside fenced
 * YAML or prose examples. Normalizes all known source: forms to
 * `content/shared/...`: `/shared/...`, `shared/...`, `content/shared/...`,
 * and `/content/shared/...`.
 * @param {string} filePath - Path to the content file
 * @returns {string|null} The source path (e.g., 'content/shared/sql-reference/_index.md') or null
 */
export function getSourceFromFrontmatter(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf8');

    // Extract the frontmatter block (--- to ---) from the top of the file.
    // Only match within that block to avoid catching `source:` lines inside
    // fenced YAML, code examples, or prose.
    //
    // Both delimiters allow trailing whitespace before the line break, to
    // stay consistent with .ci/scripts/check-source-paths.sh which uses
    // `/^---[[:space:]]*$/`. Otherwise a `---  ` (with stray trailing
    // spaces) would pass the bash hook but fail JS extraction, leading to
    // canonical-source drift.
    //
    // Require the closing --- to be on its own line (followed by \n or EOF)
    // so a literal --- inside a YAML value doesn't terminate the block early.
    const frontmatterMatch = content.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!frontmatterMatch) return null;

    const frontmatter = frontmatterMatch[1];
    // Match one of three shapes, with optional trailing inline YAML comment:
    //   source: "value"  [# note]   → group 1 (literal #, spaces allowed inside)
    //   source: 'value'  [# note]   → group 2 (literal #, spaces allowed inside)
    //   source: value    [# note]   → group 3 (plain scalar)
    //
    // For plain scalars, YAML treats `#` as a comment delimiter ONLY when
    // preceded by whitespace. So `foo#bar` is a valid plain scalar value;
    // `foo #bar` has trailing comment `#bar`. The unquoted alternative
    // therefore allows # mid-value but disallows # as the first character
    // (which would itself be a comment). The optional trailing
    // `\s+#.*$` consumes whitespace-preceded comments.
    //
    // Quotes must match on both ends — malformed quoting falls through to
    // null rather than being silently "repaired", matching the stricter
    // behavior of .ci/scripts/check-source-paths.sh.
    const sourceMatch = frontmatter.match(
      /^source:\s*(?:"([^"]+)"|'([^']+)'|([^\s"'#][^\s]*))\s*(?:#.*)?$/m
    );
    if (!sourceMatch) return null;

    const sourcePath = (sourceMatch[1] ?? sourceMatch[2] ?? sourceMatch[3]).trim();
    // Normalize to content/ prefix format. Known variants in this repo:
    // - `/shared/foo.md`         → `content/shared/foo.md`
    // - `/content/shared/foo.md` → `content/shared/foo.md`  (strip leading /)
    // - `shared/foo.md`          → `content/shared/foo.md`
    // - `content/shared/foo.md`  → unchanged
    if (sourcePath.startsWith('/')) {
      // Strip the leading slash; the remainder is already repo-relative.
      const stripped = sourcePath.slice(1);
      return stripped.startsWith('content/') ? stripped : `content/${stripped}`;
    }
    if (sourcePath.startsWith('shared/')) {
      return `content/${sourcePath}`;
    }
    if (sourcePath.startsWith('content/')) {
      return sourcePath;
    }
    // Unexpected shape (e.g., absolute filesystem path, URL). Ignore rather
    // than returning a misleading canonical path.
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolve a content file path to its canonical source for deduplication.
 * - If the file has `source: /shared/...` frontmatter, canonical is `content/shared/...`.
 * - Otherwise, canonical is the file itself.
 * Use this to avoid reporting the same diagnostic against multiple consumer pages.
 *
 * ASSUMPTION: consumer pages that declare `source:` are pure stubs — they
 * contain no body fences of their own, only the frontmatter pointer. Linting
 * only the shared canonical source is therefore sufficient; no consumer-page
 * fences are silently skipped. If this invariant ever breaks (a consumer gains
 * its own code blocks), those fences will not be linted and a drift warning
 * should be added here.
 *
 * @param {string} filePath - Path to a content file
 * @returns {string} Canonical source path
 */
export function resolveCanonicalSource(filePath) {
  const source = getSourceFromFrontmatter(filePath);
  return source ?? filePath;
}
