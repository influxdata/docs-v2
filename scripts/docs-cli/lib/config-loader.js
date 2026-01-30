/**
 * Configuration loader with security best practices
 *
 * SECURITY: This file must NOT contain any references to private repository names or URLs
 *
 * Configuration is loaded from multiple sources (in order of priority):
 *   1. config/defaults.yml - Shipped defaults (public repos only)
 *   2. ~/.docs-cli.yml - User-level config
 *   3. .docs-cli.local.yml - Project-level config (gitignored)
 *   4. DOCS_CLI_CONFIG env var - Custom config file path
 *   5. --config flag - Command-line override
 */

import { existsSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { homedir, tmpdir } from 'os';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = join(__dirname, '..');
const REPO_ROOT = join(CLI_ROOT, '..');

// Cache for loaded config
let _configCache = null;

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
      message: 'GitHub CLI not authenticated. Run: gh auth login',
    };
  }
}

/**
 * Check if a directory is a docs-v2 repository
 */
function isDocsV2Repo(dir) {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return false;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    // Check for known package names (current and legacy)
    return (
      pkg.name === '@influxdata/docs-site' || pkg.name === 'docs.influxdata.com'
    );
  } catch {
    return false;
  }
}

/**
 * Find docs-v2 repository root
 * Priority: 1) Walk up from cwd, 2) DOCS_V2_PATH env, 3) Common locations
 */
export function findDocsV2Root() {
  // First, walk up from current directory - this ensures worktrees are found
  let dir = process.cwd();
  while (dir !== '/') {
    if (isDocsV2Repo(dir)) {
      return dir;
    }
    dir = dirname(dir);
  }

  // Then check explicit env var
  const envPath = getConfig('DOCS_V2_PATH');
  if (envPath && existsSync(envPath) && isDocsV2Repo(envPath)) {
    return envPath;
  }

  // Finally, try common locations
  return getRepoPath('docs-v2', 'DOCS_V2_PATH');
}

// ============================================================================
// YAML Configuration Loading
// ============================================================================

/**
 * Deep merge two objects (target is modified in place)
 * Arrays are replaced, not merged
 */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

/**
 * Load a YAML config file if it exists
 * @param {string} filePath - Path to YAML file
 * @returns {object|null} Parsed config or null if not found
 */
function loadYamlFile(filePath) {
  if (!existsSync(filePath)) return null;

  try {
    const content = readFileSync(filePath, 'utf8');
    return yaml.load(content) || {};
  } catch (error) {
    console.error(`Warning: Failed to parse ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Expand ~ to home directory in paths
 */
function expandPath(path) {
  if (!path || typeof path !== 'string') return path;
  if (path.startsWith('~/')) {
    return join(homedir(), path.slice(2));
  }
  return path;
}

/**
 * Process repository paths (expand ~ and resolve relative paths)
 */
function processRepoPaths(config, baseDir = null) {
  if (!config.repositories) return config;

  for (const [name, repo] of Object.entries(config.repositories)) {
    if (repo.path) {
      repo.path = expandPath(repo.path);
    }
  }

  return config;
}

/**
 * Load and merge all configuration sources
 *
 * @param {object} options - Options
 * @param {string} options.configFile - Explicit config file (from --config flag)
 * @param {boolean} options.reload - Force reload (ignore cache)
 * @returns {object} Merged configuration
 */
export async function loadConfig({ configFile = null, reload = false } = {}) {
  // Return cached config if available (unless reload requested or explicit file)
  if (_configCache && !reload && !configFile) {
    return _configCache;
  }

  // 1. Start with JS defaults
  const { DEFAULT_CONFIG } = await import('./defaults.js');
  let config = structuredClone(DEFAULT_CONFIG);

  // 2. Load user-level config (~/.influxdata-docs/docs-cli.yml)
  const userConfigPath = join(homedir(), '.influxdata-docs', 'docs-cli.yml');
  const userConfig = loadYamlFile(userConfigPath);
  if (userConfig) {
    config = deepMerge(config, processRepoPaths(userConfig));
  }

  // 3. Load project-level config (.docs-cli.local.yml in repo root)
  const docsV2Root = findDocsV2Root();
  if (docsV2Root) {
    const projectConfigPath = join(docsV2Root, '.docs-cli.local.yml');
    const projectConfig = loadYamlFile(projectConfigPath);
    if (projectConfig) {
      config = deepMerge(config, processRepoPaths(projectConfig, docsV2Root));
    }
  }

  // 4. Load from DOCS_CLI_CONFIG env var
  const envConfigPath = process.env.DOCS_CLI_CONFIG;
  if (envConfigPath) {
    const expandedPath = expandPath(envConfigPath);
    const envConfig = loadYamlFile(expandedPath);
    if (envConfig) {
      config = deepMerge(config, processRepoPaths(envConfig));
    }
  }

  // 5. Load from explicit --config file (highest priority)
  if (configFile) {
    const expandedPath = expandPath(configFile);
    const explicitConfig = loadYamlFile(expandedPath);
    if (explicitConfig) {
      config = deepMerge(config, processRepoPaths(explicitConfig));
    } else {
      console.error(`Warning: Config file not found: ${configFile}`);
    }
  }

  // Process any remaining paths
  config = processRepoPaths(config);

  // Cache the result (unless explicit file was provided)
  if (!configFile) {
    _configCache = config;
  }

  return config;
}

/**
 * Get a specific repository configuration
 *
 * @param {string} repoName - Repository name (e.g., 'influxdb', 'docs-v2')
 * @param {object} options - Options passed to loadConfig
 * @returns {Promise<object|null>} Repository config with url, path, description
 */
export async function getRepoConfig(repoName, options = {}) {
  const config = await loadConfig(options);
  return config.repositories?.[repoName] || null;
}

/**
 * Get the local path for a repository
 * Falls back to smart path detection if not in config
 *
 * @param {string} repoName - Repository name
 * @param {object} options - Options passed to loadConfig
 * @returns {Promise<string|null>} Local filesystem path or null
 */
export async function getRepoLocalPath(repoName, options = {}) {
  // First check config
  const repoConfig = await getRepoConfig(repoName, options);
  if (repoConfig?.path && existsSync(repoConfig.path)) {
    return repoConfig.path;
  }

  // Fall back to smart path detection (existing behavior)
  const envKeyMap = {
    'docs-v2': 'DOCS_V2_PATH',
    influxdb: 'INFLUXDB_CORE_PATH',
    telegraf: 'TELEGRAF_PATH',
    'influx-cli': 'INFLUX_CLI_PATH',
  };

  const envKey = envKeyMap[repoName];
  if (envKey) {
    return getRepoPath(repoName, envKey);
  }

  // Try common locations as last resort
  return getRepoPath(
    repoName,
    `${repoName.toUpperCase().replace(/-/g, '_')}_PATH`
  );
}

/**
 * Get release notes configuration
 *
 * @param {object} options - Options passed to loadConfig
 * @returns {Promise<object>} Release notes config
 */
export async function getReleaseNotesConfig(options = {}) {
  const config = await loadConfig(options);
  return config.releaseNotes || {};
}

/**
 * Get editor configuration
 *
 * @param {object} options - Options passed to loadConfig
 * @returns {Promise<object>} Editor config
 */
export async function getEditorConfig(options = {}) {
  const config = await loadConfig(options);
  return config.editor || {};
}

/**
 * Get scaffolding configuration
 *
 * @param {object} options - Options passed to loadConfig
 * @returns {Promise<object>} Scaffolding config
 */
export async function getScaffoldingConfig(options = {}) {
  const config = await loadConfig(options);
  return config.scaffolding || {};
}

/**
 * Clear the config cache (useful for testing)
 */
export function clearConfigCache() {
  _configCache = null;
}

// Cache for cloned repos (maps URL to local path)
const _cloneCache = new Map();

/**
 * Get the cache directory for cloned repos
 */
function getRepoCacheDir() {
  const cacheDir = join(homedir(), '.influxdata-docs', 'repo-cache');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }
  return cacheDir;
}

/**
 * Clone a repository from URL to cache directory
 * Returns cached path if already cloned
 *
 * @param {string} url - Git repository URL
 * @param {string} name - Repository name (for cache key)
 * @param {object} options - Clone options
 * @param {boolean} options.fetch - Fetch latest if already cloned
 * @param {boolean} options.quiet - Suppress output
 * @returns {Promise<string>} Path to cloned repository
 */
export async function cloneOrUpdateRepo(url, name, options = {}) {
  const { fetch = true, quiet = false } = options;

  // Check in-memory cache first
  const cacheKey = `${name}:${url}`;
  if (_cloneCache.has(cacheKey)) {
    const cachedPath = _cloneCache.get(cacheKey);
    if (existsSync(cachedPath)) {
      if (fetch && !quiet) {
        console.error(`📥 Fetching latest for ${name}...`);
        try {
          execSync('git fetch --tags', { cwd: cachedPath, stdio: 'pipe' });
        } catch {
          // Ignore fetch errors - might be offline
        }
      }
      return cachedPath;
    }
  }

  const cacheDir = getRepoCacheDir();
  const repoPath = join(cacheDir, name);

  // If already cloned on disk, use it
  if (existsSync(join(repoPath, '.git'))) {
    if (!quiet) {
      console.error(`📂 Using cached clone: ${repoPath}`);
    }
    if (fetch) {
      try {
        execSync('git fetch --tags', { cwd: repoPath, stdio: 'pipe' });
      } catch {
        // Ignore fetch errors
      }
    }
    _cloneCache.set(cacheKey, repoPath);
    return repoPath;
  }

  // Clone the repository
  if (!quiet) {
    console.error(`📥 Cloning ${name} from ${url}...`);
  }

  try {
    execSync(`git clone --quiet "${url}" "${repoPath}"`, {
      stdio: quiet ? 'pipe' : 'inherit',
    });
  } catch (error) {
    throw new Error(`Failed to clone ${url}: ${error.message}`);
  }

  _cloneCache.set(cacheKey, repoPath);
  return repoPath;
}

/**
 * Get repository path, cloning from URL if necessary
 *
 * @param {string} repoName - Repository name from config
 * @param {object} options - Options
 * @param {boolean} options.allowClone - Clone from URL if no local path (default: false)
 * @param {boolean} options.fetch - Fetch latest when using clone (default: true)
 * @returns {Promise<string|null>} Local path or null
 */
export async function getRepoPathOrClone(repoName, options = {}) {
  const { allowClone = false, fetch = true, configFile = null } = options;

  // First try to get local path
  const localPath = await getRepoLocalPath(repoName, { configFile });
  if (localPath) {
    return localPath;
  }

  // If no local path and cloning allowed, try URL
  if (allowClone) {
    const repoConfig = await getRepoConfig(repoName, { configFile });
    if (repoConfig?.url) {
      return cloneOrUpdateRepo(repoConfig.url, repoName, { fetch });
    }
  }

  return null;
}
