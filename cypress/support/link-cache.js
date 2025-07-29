/**
 * Link Cache Manager for Cypress Tests
 * Manages caching of link validation results at the URL level
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CACHE_VERSION = 'v2';
const CACHE_KEY_PREFIX = 'link-validation';
const LOCAL_CACHE_DIR = path.join(process.cwd(), '.cache', 'link-validation');

/**
 * Cache manager for individual link validation results
 */
export class LinkCacheManager {
  constructor(options = {}) {
    this.localCacheDir = options.localCacheDir || LOCAL_CACHE_DIR;
    
    // Configurable cache TTL - default 30 days
    this.cacheTTLDays = 
      options.cacheTTLDays || parseInt(process.env.LINK_CACHE_TTL_DAYS) || 30;
    this.maxAge = this.cacheTTLDays * 24 * 60 * 60 * 1000;
    
    this.ensureLocalCacheDir();
    
    // Track cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      stores: 0,
      cleanups: 0
    };
  }

  ensureLocalCacheDir() {
    if (!fs.existsSync(this.localCacheDir)) {
      fs.mkdirSync(this.localCacheDir, { recursive: true });
    }
  }

  /**
   * Generate cache key for a URL
   * @param {string} url - The URL to cache
   * @returns {string} Cache key
   */
  generateCacheKey(url) {
    const urlHash = crypto
      .createHash('sha256')
      .update(url)
      .digest('hex')
      .substring(0, 16);
    return `${CACHE_KEY_PREFIX}-${CACHE_VERSION}-${urlHash}`;
  }

  /**
   * Get cache file path for a URL
   * @param {string} url - The URL
   * @returns {string} File path
   */
  getCacheFilePath(url) {
    const cacheKey = this.generateCacheKey(url);
    return path.join(this.localCacheDir, `${cacheKey}.json`);
  }

  /**
   * Check if a URL's validation result is cached
   * @param {string} url - The URL to check
   * @returns {Object|null} Cached result or null
   */
  get(url) {
    const cacheFile = this.getCacheFilePath(url);

    if (!fs.existsSync(cacheFile)) {
      this.stats.misses++;
      return null;
    }

    try {
      const content = fs.readFileSync(cacheFile, 'utf8');
      const cached = JSON.parse(content);

      // TTL check
      const age = Date.now() - new Date(cached.cachedAt).getTime();

      if (age > this.maxAge) {
        fs.unlinkSync(cacheFile);
        this.stats.misses++;
        this.stats.cleanups++;
        return null;
      }

      this.stats.hits++;
      return cached;
    } catch (error) {
      // Clean up corrupted cache
      try {
        fs.unlinkSync(cacheFile);
        this.stats.cleanups++;
      } catch {
        // Ignore cleanup errors
      }
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Store validation result for a URL
   * @param {string} url - The URL
   * @param {Object} result - Validation result
   * @returns {boolean} True if successfully cached, false otherwise
   */
  set(url, result) {
    const cacheFile = this.getCacheFilePath(url);

    const cacheData = {
      url,
      result,
      cachedAt: new Date().toISOString(),
      ttl: new Date(Date.now() + this.maxAge).toISOString()
    };

    try {
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2));
      this.stats.stores++;
      return true;
    } catch (error) {
      console.warn(`Failed to cache validation result for ${url}: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if a URL is cached and valid
   * @param {string} url - The URL to check
   * @returns {boolean} True if cached and valid
   */
  isCached(url) {
    return this.get(url) !== null;
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(1) : 0;
    
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`
    };
  }

  /**
   * Clean up expired cache entries
   * @returns {number} Number of entries cleaned up
   */
  cleanup() {
    let cleaned = 0;
    
    try {
      const files = fs.readdirSync(this.localCacheDir);
      const cacheFiles = files.filter(file => 
        file.startsWith(CACHE_KEY_PREFIX) && file.endsWith('.json')
      );

      for (const file of cacheFiles) {
        const filePath = path.join(this.localCacheDir, file);
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const cached = JSON.parse(content);
          
          const age = Date.now() - new Date(cached.cachedAt).getTime();
          
          if (age > this.maxAge) {
            fs.unlinkSync(filePath);
            cleaned++;
          }
        } catch (error) {
          console.warn(`Failed to process cache file "${filePath}": ${error.message}`);
          // Remove corrupted files
          fs.unlinkSync(filePath);
          cleaned++;
        }
      }
    } catch (error) {
      console.warn(`Cache cleanup failed: ${error.message}`);
    }

    this.stats.cleanups += cleaned;
    return cleaned;
  }
}

/**
 * Cypress task helper to integrate cache with Cypress tasks
 */
export const createCypressCacheTasks = (options = {}) => {
  const cache = new LinkCacheManager(options);

  return {
    getLinkCache: (url) => cache.get(url),
    setLinkCache: ({ url, result }) => cache.set(url, result),
    isLinkCached: (url) => cache.isCached(url),
    getCacheStats: () => cache.getStats(),
    cleanupCache: () => cache.cleanup()
  };
};