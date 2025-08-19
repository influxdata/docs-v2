import { defineConfig } from 'cypress';
import { cwd as _cwd } from 'process';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1315',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    responseTimeout: 30000,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5,
    projectId: 'influxdata-docs',
    setupNodeEvents(on, config) {
      // Browser setup
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-extensions');
          return launchOptions;
        }
      });

      on('task', {
        // Fetch the product list configured in /data/products.yml
        getData(filename) {
          return new Promise((resolve, reject) => {
            const cwd = _cwd();
            try {
              resolve(
                yaml.load(
                  fs.readFileSync(`${cwd}/data/${filename}.yml`, 'utf8')
                )
              );
            } catch (e) {
              reject(e);
            }
          });
        },

        // Log task for reporting
        log(message) {
          if (typeof message === 'object') {
            if (message.type === 'error') {
              console.error(`\x1b[31m${message.message}\x1b[0m`); // Red
            } else if (message.type === 'warning') {
              console.warn(`\x1b[33m${message.message}\x1b[0m`); // Yellow
            } else if (message.type === 'success') {
              console.log(`\x1b[32m${message.message}\x1b[0m`); // Green
            } else if (message.type === 'divider') {
              console.log(`\x1b[90m${message.message}\x1b[0m`); // Gray
            } else {
              console.log(message.message || message);
            }
          } else {
            console.log(message);
          }
          return null;
        },

        // File tasks
        writeFile({ path, content }) {
          try {
            fs.writeFileSync(path, content);
            return true;
          } catch (error) {
            console.error(`Error writing to file ${path}: ${error.message}`);
            return { error: error.message };
          }
        },

        readFile(path) {
          try {
            return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : null;
          } catch (error) {
            console.error(`Error reading file ${path}: ${error.message}`);
            return { error: error.message };
          }
        },

        // Cache and incremental validation tasks
        saveCacheStatistics(stats) {
          try {
            saveCacheStats(stats);
            return true;
          } catch (error) {
            console.error(`Error saving cache stats: ${error.message}`);
            return false;
          }
        },

        saveValidationStrategy(strategy) {
          try {
            saveValidationStrategy(strategy);
            return true;
          } catch (error) {
            console.error(`Error saving validation strategy: ${error.message}`);
            return false;
          }
        },

        runIncrementalValidation(filePaths) {
          return new Promise(async (resolve, reject) => {
            try {
              console.log('Loading incremental validator module...');

              // Use CommonJS require for better compatibility
              const {
                IncrementalValidator,
              } = require('./.github/scripts/incremental-validator.cjs');
              console.log('✅ Incremental validator loaded successfully');

              const validator = new IncrementalValidator();
              const results = await validator.validateFiles(filePaths);
              resolve(results);
            } catch (error) {
              console.error(`Incremental validation error: ${error.message}`);
              console.error(`Stack: ${error.stack}`);

              // Don't fail the entire test run due to cache issues
              // Fall back to validating all files
              console.warn('Falling back to validate all files without cache');
              resolve({
                validationStrategy: {
                  unchanged: [],
                  changed: filePaths.map((filePath) => ({
                    filePath,
                    fileHash: 'unknown',
                    links: [],
                  })),
                  newLinks: [],
                  total: filePaths.length,
                },
                filesToValidate: filePaths.map((filePath) => ({
                  filePath,
                  fileHash: 'unknown',
                })),
                cacheStats: {
                  totalFiles: filePaths.length,
                  cacheHits: 0,
                  cacheMisses: filePaths.length,
                  hitRate: 0,
                },
              });
            }
          });
        },

        cacheValidationResults(filePath, fileHash, results) {
          return new Promise(async (resolve, reject) => {
            try {
              const {
                IncrementalValidator,
              } = require('./.github/scripts/incremental-validator.cjs');
              const validator = new IncrementalValidator();
              const success = await validator.cacheResults(
                filePath,
                fileHash,
                results
              );
              resolve(success);
            } catch (error) {
              console.error(`Cache validation results error: ${error.message}`);
              // Don't fail if caching fails - just continue without cache
              resolve(false);
            }
          });
        },

        filePathToUrl(filePath) {
          return new Promise(async (resolve, reject) => {
            try {
              const { filePathToUrl } = await import(
                './.github/scripts/utils/url-transformer.js'
              );
              resolve(filePathToUrl(filePath));
            } catch (error) {
              console.error(`URL transformation error: ${error.message}`);
              // Fallback: return the file path as-is if transformation fails
              console.warn(
                `Using fallback URL transformation for: ${filePath}`
              );
              resolve(filePath);
            }
          });
        },
      });

      // Load plugins file using dynamic import for ESM compatibility
      return import('./cypress/plugins/index.js').then((module) => {
        return module.default(on, config);
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  env: {
    test_subjects: '',
  },
});
