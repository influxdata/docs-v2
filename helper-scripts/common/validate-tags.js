#!/usr/bin/env node

/**
 * Git tag validation utility
 * Validates that provided version strings are actual git tags in the repository
 */

import { spawn } from 'child_process';

/**
 * Execute a command and return the output
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {string} cwd - Working directory
 * @returns {Promise<string>} Command output
 */
function execCommand(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'pipe' });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`)
        );
      }
    });
  });
}

/**
 * Get all git tags from the repository
 * @param {string} repoPath - Path to the git repository
 * @returns {Promise<string[]>} Array of tag names
 */
async function getGitTags(repoPath = process.cwd()) {
  try {
    const output = await execCommand(
      'git',
      ['tag', '--list', '--sort=-version:refname'],
      repoPath
    );
    return output ? output.split('\n').filter((tag) => tag.trim()) : [];
  } catch (error) {
    throw new Error(`Failed to get git tags: ${error.message}`);
  }
}

/**
 * Validate that a version string is an existing git tag
 * @param {string} version - Version string to validate
 * @param {string} repoPath - Path to the git repository
 * @returns {Promise<boolean>} True if version is a valid tag
 */
async function isValidTag(version, repoPath = process.cwd()) {
  if (!version || version === 'local') {
    return true; // 'local' is a special case for development
  }

  const tags = await getGitTags(repoPath);
  return tags.includes(version);
}

/**
 * Validate multiple version tags
 * @param {string[]} versions - Array of version strings to validate
 * @param {string} repoPath - Path to the git repository
 * @returns {Promise<{
 *   valid: boolean,
 *   errors: string[],
 *   availableTags: string[]
 * }>} Validation result
 */
async function validateTags(versions, repoPath = process.cwd()) {
  const errors = [];
  const availableTags = await getGitTags(repoPath);

  for (const version of versions) {
    if (version && version !== 'local' && !availableTags.includes(version)) {
      errors.push(`Version '${version}' is not a valid git tag`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    availableTags: availableTags.slice(0, 10), // Return top 10 most recent tags
  };
}

/**
 * Validate version inputs and exit with error if invalid
 * @param {string} version - Current version
 * @param {string} previousVersion - Previous version (optional)
 * @param {string} repoPath - Path to the git repository
 */
async function validateVersionInputs(
  version,
  previousVersion = null,
  repoPath = process.cwd()
) {
  const versionsToCheck = [version];
  if (previousVersion) {
    versionsToCheck.push(previousVersion);
  }

  const validation = await validateTags(versionsToCheck, repoPath);

  if (!validation.valid) {
    console.error('\n❌ Version validation failed:');
    validation.errors.forEach((error) => console.error(`  - ${error}`));

    if (validation.availableTags.length > 0) {
      console.error('\n📋 Available tags (most recent first):');
      validation.availableTags.forEach((tag) => console.error(`  - ${tag}`));
    } else {
      console.error('\n📋 No git tags found in repository');
    }

    console.error(
      '\n💡 Tip: Use "local" for development/testing with local containers'
    );
    process.exit(1);
  }

  console.log('✅ Version tags validated successfully');
}

/**
 * Get the repository root path (where .git directory is located)
 * @param {string} startPath - Starting path to search from
 * @returns {Promise<string>} Path to repository root
 */
async function getRepositoryRoot(startPath = process.cwd()) {
  try {
    const output = await execCommand(
      'git',
      ['rev-parse', '--show-toplevel'],
      startPath
    );
    return output;
  } catch (error) {
    throw new Error(
      `Not a git repository or git not available: ${error.message}`
    );
  }
}

export {
  getGitTags,
  isValidTag,
  validateTags,
  validateVersionInputs,
  getRepositoryRoot,
};

// CLI usage when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node validate-tags.js <version> [previous-version]');
    console.log('Examples:');
    console.log('  node validate-tags.js v3.0.0');
    console.log('  node validate-tags.js v3.0.0 v2.9.0');
    console.log(
      '  node validate-tags.js local  # Special case for development'
    );
    process.exit(1);
  }

  const [version, previousVersion] = args;

  try {
    const repoRoot = await getRepositoryRoot();
    await validateVersionInputs(version, previousVersion, repoRoot);
    console.log('All versions are valid git tags');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
