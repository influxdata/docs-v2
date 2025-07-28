#!/usr/bin/env node

/**
 * Incremental Link Validator
 * Combines link extraction and caching to validate only changed links
 */

import { extractLinksFromFile } from './link-extractor.js';
import { CacheManager } from './cache-manager.js';
import process from 'process';
import { fileURLToPath } from 'url';

/**
 * Incremental validator that only validates changed content
 */
class IncrementalValidator {
  constructor(options = {}) {
    this.cacheManager = new CacheManager(options);
    this.validateExternal = options.validateExternal !== false;
    this.validateInternal = options.validateInternal !== false;
  }

  /**
   * Get validation strategy for a list of files
   * @param {Array} filePaths - Array of file paths
   * @returns {Object} Validation strategy with files categorized
   */
  async getValidationStrategy(filePaths) {
    const strategy = {
      unchanged: [], // Files that haven't changed (skip validation)
      changed: [], // Files that changed (need full validation)
      newLinks: [], // New links across all files (need validation)
      total: filePaths.length,
    };

    const allNewLinks = new Set();

    for (const filePath of filePaths) {
      try {
        const extractionResult = extractLinksFromFile(filePath);
        if (!extractionResult) {
          console.warn(`Could not extract links from ${filePath}`);
          continue;
        }

        const { fileHash, links } = extractionResult;

        // Check if we have cached results for this file version
        const cachedResults = await this.cacheManager.get(filePath, fileHash);

        if (cachedResults) {
          // File unchanged, skip validation
          strategy.unchanged.push({
            filePath,
            fileHash,
            linkCount: links.length,
            cachedResults,
          });
        } else {
          // File changed or new, needs validation
          strategy.changed.push({
            filePath,
            fileHash,
            links: links.filter((link) => link.needsValidation),
            extractionResult,
          });

          // Collect all new links for batch validation
          links
            .filter((link) => link.needsValidation)
            .forEach((link) => allNewLinks.add(link.url));
        }
      } catch (error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        // Treat as changed file to ensure validation
        strategy.changed.push({
          filePath,
          error: error.message,
        });
      }
    }

    strategy.newLinks = Array.from(allNewLinks);

    return strategy;
  }

  /**
   * Validate files using incremental strategy
   * @param {Array} filePaths - Files to validate
   * @returns {Object} Validation results
   */
  async validateFiles(filePaths) {
    console.log(
      `📊 Analyzing ${filePaths.length} files for incremental validation...`
    );

    const strategy = await this.getValidationStrategy(filePaths);

    console.log(`✅ ${strategy.unchanged.length} files unchanged (cached)`);
    console.log(`🔄 ${strategy.changed.length} files need validation`);
    console.log(`🔗 ${strategy.newLinks.length} unique links to validate`);

    const results = {
      validationStrategy: strategy,
      filesToValidate: strategy.changed.map((item) => ({
        filePath: item.filePath,
        linkCount: item.links ? item.links.length : 0,
      })),
      cacheStats: {
        cacheHits: strategy.unchanged.length,
        cacheMisses: strategy.changed.length,
        hitRate:
          strategy.total > 0
            ? Math.round((strategy.unchanged.length / strategy.total) * 100)
            : 0,
      },
    };

    return results;
  }

  /**
   * Store validation results in cache
   * @param {string} filePath - File path
   * @param {string} fileHash - File hash
   * @param {Object} validationResults - Results to cache
   * @returns {Promise<boolean>} Success status
   */
  async cacheResults(filePath, fileHash, validationResults) {
    return await this.cacheManager.set(filePath, fileHash, validationResults);
  }

  /**
   * Clean up expired cache entries
   * @returns {Promise<Object>} Cleanup statistics
   */
  async cleanupCache() {
    return await this.cacheManager.cleanup();
  }
}

/**
 * CLI usage
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Incremental Link Validator

Usage:
  node incremental-validator.js [files...]     Analyze files for validation
  node incremental-validator.js --cleanup      Clean up expired cache
  node incremental-validator.js --help         Show this help

Options:
  --no-external      Don't validate external links
  --no-internal      Don't validate internal links
  --local            Use local cache instead of GitHub Actions cache
  --cache-ttl=DAYS   Set cache TTL in days (default: 30)

Examples:
  node incremental-validator.js content/**/*.md
  node incremental-validator.js --cache-ttl=7 content/**/*.md
  node incremental-validator.js --cleanup
`);
    process.exit(0);
  }

  if (args[0] === '--cleanup') {
    const validator = new IncrementalValidator();
    const stats = await validator.cleanupCache();
    console.log(`🧹 Cleaned up ${stats.removed} expired cache entries`);
    if (stats.note) console.log(`ℹ️  ${stats.note}`);
    return;
  }

  const options = {
    validateExternal: !args.includes('--no-external'),
    validateInternal: !args.includes('--no-internal'),
    useGitHubCache: !args.includes('--local'),
  };

  // Extract cache TTL option if provided
  const cacheTTLArg = args.find((arg) => arg.startsWith('--cache-ttl='));
  if (cacheTTLArg) {
    options.cacheTTLDays = parseInt(cacheTTLArg.split('=')[1]);
  }

  const filePaths = args.filter((arg) => !arg.startsWith('--'));

  if (filePaths.length === 0) {
    console.error('No files specified for validation');
    process.exit(1);
  }

  const validator = new IncrementalValidator(options);
  const results = await validator.validateFiles(filePaths);

  console.log('\n📈 Validation Analysis Results:');
  console.log('================================');
  console.log(`Cache hit rate: ${results.cacheStats.hitRate}%`);
  console.log(`Files to validate: ${results.filesToValidate.length}`);

  if (results.filesToValidate.length > 0) {
    console.log('\nFiles needing validation:');
    results.filesToValidate.forEach((file) => {
      console.log(`  ${file.filePath} (${file.linkCount} links)`);
    });

    // Output files for Cypress to process
    console.log('\n# Files for Cypress validation (one per line):');
    results.filesToValidate.forEach((file) => {
      console.log(file.filePath);
    });
  } else {
    console.log('\n✨ All files are cached - no validation needed!');
  }
}

export default IncrementalValidator;
export { IncrementalValidator };

// Run CLI if called directly
if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(console.error);
}
