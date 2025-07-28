#!/usr/bin/env node

/**
 * Simple Cache Manager for Link Validation Results
 * Uses GitHub Actions cache API or local file storage
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import process from 'process';

const CACHE_VERSION = 'v1';
const CACHE_KEY_PREFIX = 'link-validation';
const LOCAL_CACHE_DIR = path.join(process.cwd(), '.cache', 'link-validation');

/**
 * Simple cache interface
 */
class CacheManager {
  constructor(options = {}) {
    this.useGitHubCache =
      options.useGitHubCache !== false && process.env.GITHUB_ACTIONS;
    this.localCacheDir = options.localCacheDir || LOCAL_CACHE_DIR;

    // Configurable cache TTL - default 30 days, support environment variable
    this.cacheTTLDays =
      options.cacheTTLDays || parseInt(process.env.LINK_CACHE_TTL_DAYS) || 30;
    this.maxAge = this.cacheTTLDays * 24 * 60 * 60 * 1000;

    if (!this.useGitHubCache) {
      this.ensureLocalCacheDir();
    }
  }

  ensureLocalCacheDir() {
    if (!fs.existsSync(this.localCacheDir)) {
      fs.mkdirSync(this.localCacheDir, { recursive: true });
    }
  }

  generateCacheKey(filePath, fileHash) {
    const pathHash = crypto
      .createHash('sha256')
      .update(filePath)
      .digest('hex')
      .substring(0, 8);
    return `${CACHE_KEY_PREFIX}-${CACHE_VERSION}-${pathHash}-${fileHash}`;
  }

  async get(filePath, fileHash) {
    if (this.useGitHubCache) {
      return await this.getFromGitHubCache(filePath, fileHash);
    } else {
      return await this.getFromLocalCache(filePath, fileHash);
    }
  }

  async set(filePath, fileHash, results) {
    if (this.useGitHubCache) {
      return await this.setToGitHubCache(filePath, fileHash, results);
    } else {
      return await this.setToLocalCache(filePath, fileHash, results);
    }
  }

  async getFromGitHubCache(filePath, fileHash) {
    // TODO: This method is a placeholder for GitHub Actions cache integration
    // GitHub Actions cache is handled directly in the workflow via actions/cache
    // This method should either be implemented or removed in future versions
    console.warn(
      '[PLACEHOLDER] getFromGitHubCache: Using placeholder implementation - always returns null'
    );
    return null;
  }

  async setToGitHubCache(filePath, fileHash, results) {
    // TODO: This method is a placeholder for GitHub Actions cache integration
    // GitHub Actions cache is handled directly in the workflow via actions/cache
    // This method should either be implemented or removed in future versions
    console.warn(
      '[PLACEHOLDER] setToGitHubCache: Using placeholder implementation - always returns true'
    );
    return true;
  }

  async getFromLocalCache(filePath, fileHash) {
    const cacheKey = this.generateCacheKey(filePath, fileHash);
    const cacheFile = path.join(this.localCacheDir, `${cacheKey}.json`);

    if (!fs.existsSync(cacheFile)) {
      return null;
    }

    try {
      const content = fs.readFileSync(cacheFile, 'utf8');
      const cached = JSON.parse(content);

      // TTL check using configured cache duration
      const age = Date.now() - new Date(cached.cachedAt).getTime();

      if (age > this.maxAge) {
        fs.unlinkSync(cacheFile);
        return null;
      }

      return cached.results;
    } catch (error) {
      // Clean up corrupted cache
      try {
        fs.unlinkSync(cacheFile);
      } catch {
        // Ignore cleanup errors
      }
      return null;
    }
  }

  async setToLocalCache(filePath, fileHash, results) {
    const cacheKey = this.generateCacheKey(filePath, fileHash);
    const cacheFile = path.join(this.localCacheDir, `${cacheKey}.json`);

    const cacheData = {
      filePath,
      fileHash,
      results,
      cachedAt: new Date().toISOString(),
    };

    try {
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
      return true;
    } catch (error) {
      console.warn(`Cache save failed: ${error.message}`);
      return false;
    }
  }

  async cleanup() {
    if (this.useGitHubCache) {
      return { removed: 0, note: 'GitHub Actions cache auto-managed' };
    }

    let removed = 0;
    if (!fs.existsSync(this.localCacheDir)) {
      return { removed };
    }

    const files = fs.readdirSync(this.localCacheDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(this.localCacheDir, file);
      try {
        const stat = fs.statSync(filePath);
        if (Date.now() - stat.mtime.getTime() > this.maxAge) {
          fs.unlinkSync(filePath);
          removed++;
        }
      } catch {
        // Remove corrupted files
        try {
          fs.unlinkSync(filePath);
          removed++;
        } catch {
          // Ignore errors
        }
      }
    }

    return { removed };
  }
}

export default CacheManager;
export { CacheManager };
