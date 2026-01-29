/**
 * Configuration loader with security best practices
 *
 * SECURITY: This file must NOT contain any references to private repository names or URLs
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = join(__dirname, '..');
const REPO_ROOT = join(CLI_ROOT, '..');

// Simple .env parser (avoiding external dependency)
function loadEnvFile(path) {
  if (!existsSync(path)) return;

  const content = readFileSync(path, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key]) {
        process.env[key] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}

// Load .env from repository root
const envPath = join(REPO_ROOT, '.env');
loadEnvFile(envPath);

/**
 * Get configuration value from environment
 */
export function getConfig(key, { defaultValue = null, required = false } = {}) {
  const value = process.env[key] || defaultValue;

  if (required && !value) {
    throw new Error(
      `Missing required configuration: ${key}\n` +
      `Please add ${key} to your .env file in the repository root.\n` +
      `See config/.env.example for a template.`
    );
  }

  return value;
}

/**
 * Get repository path with smart defaults
 */
export function getRepoPath(repoName, envKey) {
  const envPath = getConfig(envKey);
  if (envPath && existsSync(envPath)) {
    return envPath;
  }

  // Try parent directories (up to 3 levels)
  let current = process.cwd();
  for (let i = 0; i < 3; i++) {
    const siblingPath = join(current, '..', repoName);
    if (existsSync(siblingPath)) {
      return siblingPath;
    }
    current = join(current, '..');
  }

  // Try common locations (only for PUBLIC repos)
  const commonPaths = [
    join(process.env.HOME, 'github', 'influxdata', repoName),
    join(process.env.HOME, 'Documents', 'github', 'influxdata', repoName),
    join(process.env.HOME, 'code', 'influxdata', repoName),
    join(process.env.HOME, 'src', 'influxdata', repoName),
  ];

  for (const path of commonPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  return null;
}

/**
 * Check if user has Enterprise product access
 * Uses generic flag, not specific repo names
 */
export function hasEnterpriseAccess() {
  const access = getConfig('DOCS_ENTERPRISE_ACCESS', { defaultValue: 'false' });
  return access.toLowerCase() === 'true';
}

/**
 * Check GitHub CLI authentication status
 */
export function checkGitHubAuth() {
  try {
    execSync('gh auth status', { stdio: 'ignore' });
    return { authenticated: true, message: 'GitHub CLI authenticated' };
  } catch {
    return {
      authenticated: false,
      message: 'GitHub CLI not authenticated. Run: gh auth login'
    };
  }
}

/**
 * Get safe configuration summary (for logging/debugging)
 * Never includes sensitive values
 */
export function getConfigSummary() {
  const githubAuth = checkGitHubAuth();

  return {
    hasEnterpriseAccess: hasEnterpriseAccess(),
    githubAuthenticated: githubAuth.authenticated,
    worktreePath: getConfig('WORKTREE_BASE_PATH', { defaultValue: './.worktrees' }),
    hasDocsV2Path: !!getRepoPath('docs-v2', 'DOCS_V2_PATH'),
    hasInfluxDBPath: !!getRepoPath('influxdb', 'INFLUXDB_CORE_PATH'),
  };
}

/**
 * Find docs-v2 repository root
 */
export function findDocsV2Root() {
  const envPath = getConfig('DOCS_V2_PATH');
  if (envPath && existsSync(envPath)) {
    const pkgPath = join(envPath, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg.name === 'docs.influxdata.com') {
        return envPath;
      }
    }
  }

  let dir = process.cwd();
  while (dir !== '/') {
    const pkgPath = join(dir, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      if (pkg.name === 'docs.influxdata.com') {
        return dir;
      }
    }
    dir = dirname(dir);
  }

  return getRepoPath('docs-v2', 'DOCS_V2_PATH');
}
