/// <reference types="cypress" />

/**
 * Tests for refactored shortcodes that use cascade product data.
 * Each test page inherits product and version from its section cascade.
 *
 * Shortcode compatibility:
 *   Universal:       product-name, product-key, current-version, influxdb/host
 *   InfluxDB3 only:  influxdb3/home-sample-link, influxdb3/limit
 *
 * Test pages live at /{content-path}/_test/shortcodes/.
 * This array maps product keys to their content paths and versions.
 * All other test expectations (name, altname, limits, distributed, host)
 * are derived at runtime from products.yml via cy.task('getData').
 */
const testPages = [
  // InfluxDB 3 products
  { key: 'influxdb3_core', version: 'core', path: '/influxdb3/core/' },
  {
    key: 'influxdb3_enterprise',
    version: 'enterprise',
    path: '/influxdb3/enterprise/',
  },
  {
    key: 'influxdb3_explorer',
    version: 'explorer',
    path: '/influxdb3/explorer/',
  },
  {
    key: 'influxdb3_cloud_serverless',
    version: 'cloud-serverless',
    path: '/influxdb3/cloud-serverless/',
  },
  {
    key: 'influxdb3_cloud_dedicated',
    version: 'cloud-dedicated',
    path: '/influxdb3/cloud-dedicated/',
  },
  {
    key: 'influxdb3_clustered',
    version: 'clustered',
    path: '/influxdb3/clustered/',
  },
  // InfluxDB v2, v1, Cloud (TSM)
  { key: 'influxdb', version: 'v2', path: '/influxdb/v2/' },
  { key: 'influxdb', version: 'v1', path: '/influxdb/v1/' },
  { key: 'influxdb_cloud', version: 'cloud', path: '/influxdb/cloud/' },
  // Other products
  { key: 'telegraf', version: 'v1', path: '/telegraf/v1/' },
  { key: 'chronograf', version: 'v1', path: '/chronograf/v1/' },
  { key: 'kapacitor', version: 'v1', path: '/kapacitor/v1/' },
  {
    key: 'enterprise_influxdb',
    version: 'v1',
    path: '/enterprise_influxdb/v1/',
  },
  { key: 'flux', version: 'v0', path: '/flux/v0/' },
];

/**
 * Mirrors the Hugo current-version shortcode logic:
 * 1. If version_label exists → use it
 * 2. Else if version starts with "v" and latest_patches[version] exists →
 *    strip trailing .N from the patch version
 * 3. Otherwise → empty string
 */
function expectedCurrentVersion(product, version) {
  if (product.version_label) return product.version_label;
  if (/^v/.test(version) && product.latest_patches?.[version]) {
    return product.latest_patches[version].replace(/\.\d+$/, '');
  }
  return '';
}

describe('Cascade product shortcodes', function () {
  let products;

  before(function () {
    cy.task('getData', 'products').then((data) => {
      products = data;
    });
  });

  testPages.forEach(({ key, version, path }) => {
    const label = key === 'influxdb' ? `${key} (${version})` : key;
    const testUrl = `${path}_test/shortcodes/`;
    const isInfluxdb3 = path.startsWith('/influxdb3/');

    describe(label, function () {
      let product;

      beforeEach(function () {
        product = products[key];
        cy.visit(testUrl);
      });

      it('renders product-name', function () {
        cy.get('[data-testid="product-name"]').should(
          'contain.text',
          product.name
        );
      });

      it('renders product-name "short"', function () {
        if (product.altname) {
          cy.get('[data-testid="product-name-short"]').should(
            'contain.text',
            product.altname
          );
        } else {
          cy.get('[data-testid="product-name-short"]')
            .invoke('text')
            .invoke('trim')
            .should('equal', '');
        }
      });

      it('renders product-key', function () {
        cy.get('[data-testid="product-key"]').should('contain.text', version);
      });

      it('renders current-version', function () {
        const expected = expectedCurrentVersion(product, version);
        if (expected) {
          cy.get('[data-testid="current-version"] .current-version').should(
            'have.text',
            expected
          );
        } else {
          cy.get('[data-testid="current-version"]')
            .invoke('text')
            .invoke('trim')
            .should('equal', '');
        }
      });

      it('renders influxdb/host', function () {
        const expected = product.placeholder_host || 'localhost:8086';
        cy.get('[data-testid="host"]').should('contain.text', expected);
      });

      if (isInfluxdb3) {
        it('renders influxdb3/home-sample-link', function () {
          const anchor = product.distributed_architecture
            ? '#get-started-home-sensor-data'
            : '#home-sensor-data';
          cy.get('[data-testid="home-sample-link"] a').should(
            'have.attr',
            'href',
            `/influxdb3/${version}/reference/sample-data/${anchor}`
          );
        });
      }

      if (isInfluxdb3) {
        it('renders influxdb3/limit "database"', function () {
          if (product.limits?.database != null) {
            cy.get('[data-testid="limit-database"]').should(
              'contain.text',
              String(product.limits.database)
            );
          }
        });
      }
    });
  });
});
