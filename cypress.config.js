const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Automatically prefix cy.visit() and cy.request() commands with a baseUrl.
    baseUrl: 'http://localhost:1313',
    projectId: 'influxdata-docs',
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
    },
  },
});
