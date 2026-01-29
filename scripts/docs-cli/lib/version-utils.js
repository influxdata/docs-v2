/**
 * Version normalization and utilities
 *
 * Handles various version formats (v3.9, 3.9, v3.9.0, 3.9.0)
 * Provides consistent version handling across CLI commands
 */

/**
 * Normalize version string to try common variations
 * @param {string} version - Input version (e.g., "3.9", "v3.9.0")
 * @returns {Object} - Object with various version formats
 */
export function normalizeVersion(version) {
  if (!version) {
    throw new Error('Version is required');
  }

  // Strip leading 'v' if present
  const clean = version.replace(/^v/, '');

  return {
    withV: `v${clean}`,      // v3.9 or v3.9.0
    withoutV: clean,         // 3.9 or 3.9.0
    original: version,       // User's original input
  };
}

/**
 * Try to find a matching git tag/branch for a version
 * @param {string} version - Version to search for
 * @param {string} repoPath - Path to git repository
 * @returns {Promise<string|null>} - Matching ref or null
 */
export async function findVersionRef(version, repoPath) {
  const { execSync } = await import('child_process');
  const variations = normalizeVersion(version);

  // Try in order of likelihood
  const attempts = [
    variations.withV,           // v3.9.0
    variations.withoutV,        // 3.9.0
    `${variations.withV}.0`,    // v3.9.0 from v3.9
    variations.original,        // Whatever user typed
  ];

  for (const attempt of attempts) {
    try {
      // Check if ref exists
      execSync(`git rev-parse --verify ${attempt}`, {
        cwd: repoPath,
        stdio: 'ignore'
      });
      return attempt; // Found it!
    } catch {
      // Try next variation
      continue;
    }
  }

  return null; // Not found
}

/**
 * Get available tags matching a version pattern
 * @param {string} pattern - Pattern to match (e.g., "3.9")
 * @param {string} repoPath - Path to git repository
 * @returns {Promise<string[]>} - Matching tags
 */
export async function getMatchingTags(pattern, repoPath) {
  const { execSync } = await import('child_process');

  try {
    const tags = execSync('git tag -l', { cwd: repoPath, encoding: 'utf8' });
    return tags
      .split('\n')
      .filter(tag => tag.includes(pattern))
      .sort()
      .reverse(); // Most recent first
  } catch {
    return [];
  }
}

/**
 * Suggest version based on available tags
 * @param {string} version - Version user attempted
 * @param {string} repoPath - Path to git repository
 * @returns {Promise<Object>} - Suggestion with matches
 */
export async function suggestVersion(version, repoPath) {
  const variations = normalizeVersion(version);
  const matches = await getMatchingTags(variations.withoutV, repoPath);

  return {
    attempted: version,
    suggestions: matches.slice(0, 5), // Top 5 matches
    message: matches.length > 0
      ? `Version '${version}' not found. Did you mean one of these?\n${matches.slice(0, 5).map(t => `  • ${t}`).join('\n')}`
      : `Version '${version}' not found and no similar tags found.`
  };
}
