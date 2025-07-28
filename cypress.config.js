import { defineConfig } from 'cypress';
import { cwd as _cwd } from 'process';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import {
  BROKEN_LINKS_FILE,
  FIRST_BROKEN_LINK_FILE,
  initializeReport,
  readBrokenLinksReport,
  saveCacheStats,
  saveValidationStrategy,
} from './cypress/support/link-reporter.js';

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

        // Broken links reporting tasks
        initializeBrokenLinksReport() {
          return initializeReport();
        },

        // Special case domains are now handled directly in the test without additional reporting
        // This task is kept for backward compatibility but doesn't do anything special
        reportSpecialCaseLink(linkData) {
          console.log(
            `✅ Expected status code: ${linkData.url} (status: ${linkData.status}) is valid for this domain`
          );
          return true;
        },

        reportBrokenLink(linkData) {
          try {
            // Validate link data
            if (!linkData || !linkData.url || !linkData.page) {
              console.error('Invalid link data provided');
              return false;
            }

            // Read current report
            const report = readBrokenLinksReport();

            // Find or create entry for this page
            let pageReport = report.find((r) => r.page === linkData.page);
            if (!pageReport) {
              pageReport = { page: linkData.page, links: [] };
              report.push(pageReport);
            }

            // Check if link is already in the report to avoid duplicates
            const isDuplicate = pageReport.links.some(
              (link) => link.url === linkData.url && link.type === linkData.type
            );

            if (!isDuplicate) {
              // Add the broken link to the page's report
              pageReport.links.push({
                url: linkData.url,
                status: linkData.status,
                type: linkData.type,
                linkText: linkData.linkText,
              });

              // Write updated report back to file
              fs.writeFileSync(
                BROKEN_LINKS_FILE,
                JSON.stringify(report, null, 2)
              );

              // Store first broken link if not already recorded
              const firstBrokenLinkExists =
                fs.existsSync(FIRST_BROKEN_LINK_FILE) &&
                fs.readFileSync(FIRST_BROKEN_LINK_FILE, 'utf8').trim() !== '';

              if (!firstBrokenLinkExists) {
                // Store first broken link with complete information
                const firstBrokenLink = {
                  url: linkData.url,
                  status: linkData.status,
                  type: linkData.type,
                  linkText: linkData.linkText,
                  page: linkData.page,
                  time: new Date().toISOString(),
                };

                fs.writeFileSync(
                  FIRST_BROKEN_LINK_FILE,
                  JSON.stringify(firstBrokenLink, null, 2)
                );

                console.error(
                  `🔴 FIRST BROKEN LINK: ${linkData.url} (${linkData.status}) - ${linkData.type} on page ${linkData.page}`
                );
              }

              // Log the broken link immediately to console
              console.error(
                `❌ BROKEN LINK: ${linkData.url} (${linkData.status}) - ${linkData.type} on page ${linkData.page}`
              );
            }

            return true;
          } catch (error) {
            console.error(`Error reporting broken link: ${error.message}`);
            // Even if there's an error, we want to ensure the test knows there was a broken link
            return true;
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
              const { IncrementalValidator } = await import(
                './.github/scripts/incremental-validator.js'
              );
              const validator = new IncrementalValidator();
              const results = await validator.validateFiles(filePaths);
              resolve(results);
            } catch (error) {
              console.error(`Incremental validation error: ${error.message}`);
              reject(error);
            }
          });
        },

        cacheValidationResults(filePath, fileHash, results) {
          return new Promise(async (resolve, reject) => {
            try {
              const { IncrementalValidator } = await import(
                './.github/scripts/incremental-validator.js'
              );
              const validator = new IncrementalValidator();
              const success = await validator.cacheResults(
                filePath,
                fileHash,
                results
              );
              resolve(success);
            } catch (error) {
              console.error(`Cache validation results error: ${error.message}`);
              reject(error);
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
              reject(error);
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
