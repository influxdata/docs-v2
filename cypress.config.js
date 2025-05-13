import { defineConfig } from 'cypress';
import { cwd as _cwd } from 'process';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export default defineConfig({
  e2e: {
    // Automatically prefix cy.visit() and cy.request() commands with a baseUrl.
    baseUrl: 'http://localhost:1315',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    responseTimeout: 30000,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5,
    projectId: 'influxdata-docs',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          // Force Chrome to use a less memory-intensive approach
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
                yaml.load(fs.readFileSync(`${cwd}/data/${filename}.yml`, 'utf8'))
              );
            } catch (e) {
              reject(e);
            }
          });
        },
        
        // Log task for broken links reporting
        log(message) {
          if (typeof message === 'object') {
            if (message.type === 'error') {
              console.error(`\x1b[31m${message.message}\x1b[0m`); // Red
            } else if (message.type === 'warning') {
              console.warn(`\x1b[33m${message.message}\x1b[0m`);  // Yellow
            } else if (message.type === 'success') {
              console.log(`\x1b[32m${message.message}\x1b[0m`);   // Green
            } else if (message.type === 'divider') {
              console.log(`\x1b[90m${message.message}\x1b[0m`);   // Gray
            } else {
              console.log(message.message || message);
            }
          } else {
            console.log(message);
          }
          return null;
        },
        
        // Add a task for writing to files
        writeFile({ path, content }) {
          try {
            fs.writeFileSync(path, content);
            return true;
          } catch (error) {
            console.error(`Error writing to file ${path}: ${error.message}`);
            return { error: error.message };
          }
        },
        
        // Add a task for reading files
        readFile(path) {
          try {
            return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : null;
          } catch (error) {
            console.error(`Error reading file ${path}: ${error.message}`);
            return { error: error.message };
          }
        }
      });
      
      // Load plugins file using dynamic import for ESM compatibility
      return import('./cypress/plugins/index.js').then(module => {
        return module.default(on, config);
      });
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720
  },
  env: {
    test_subjects: ''
  }
});
