const { defineConfig } = require('cypress');
const process = require('process');

module.exports = defineConfig({
  e2e: {
    // Automatically prefix cy.visit() and cy.request() commands with a baseUrl.
    baseUrl: 'http://localhost:1313',
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
            const yq = require('js-yaml');
            const fs = require('fs');
            const cwd = process.cwd();
            try {
              resolve(
                yq.load(fs.readFileSync(`${cwd}/data/${filename}.yml`, 'utf8'))
              );
            } catch (e) {
              reject(e);
            }
          });
        },
      });
      return config;
    },
  },
});
