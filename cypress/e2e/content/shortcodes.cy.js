/// <reference types="cypress" />

/**
 * Tests for refactored shortcodes that use cascade product data.
 * Each test page inherits product and version from its section cascade.
 *
 * Shortcode compatibility:
 *   Universal:       product-name, product-key, current-version, influxdb/host,
 *                    latest-patch, icon, api-endpoint, show-in, hide-in
 *   InfluxDB3 only:  influxdb3/home-sample-link, influxdb3/limit,
 *                    token-link (core/enterprise)
 *   InfluxDB v2/cloud: latest-patch(cli), cli/influx-creds-note,
 *                    release-toc, influxdb/points-series-flux
 *   InfluxDB3 SQL:   sql/sql-schema-intro, influxql/v1-v3-data-model-note
 *   CTA products:    cta-link (cloud-dedicated, clustered)
 *   Telegraf:        telegraf/verify
 *
 * Test pages live at /{content-path}/__tests__/shortcodes/.
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

/**
 * Mirrors the Hugo latest-patch shortcode logic (non-CLI):
 * 1. If latest_patch exists → use it
 * 2. Else if latest_patches[version] exists → use it
 * 3. Otherwise → empty string
 */
function expectedLatestPatch(product, version) {
  if (product.latest_patch) return String(product.latest_patch);
  if (product.latest_patches?.[version]) {
    return String(product.latest_patches[version]);
  }
  return '';
}

/**
 * Mirrors the Hugo latest-patch cli=true logic:
 * Always uses products.influxdb.latest_cli map.
 * For cloud/cloud-serverless → use influxdb.latest stripped to major ("v2.8" → "v2").
 * For other versions → use the version key directly.
 */
function expectedLatestPatchCli(products, version) {
  const cliVersions = products.influxdb.latest_cli;
  if (!cliVersions) return '';
  if (version === 'cloud' || version === 'cloud-serverless') {
    const influxdbLatest = String(products.influxdb.latest).replace(
      /\..*$/,
      ''
    );
    return String(cliVersions[influxdbLatest] || '');
  }
  return String(cliVersions[version] || '');
}

/**
 * Resolves the clockface icon version for a product.
 * Mirrors the Hugo icon shortcode's clockface lookup:
 * 1. Look up clockface[namespace]
 * 2. If namespace entry has the version key → use it
 * 3. Otherwise use the "default" key
 * 4. If no clockface entry for namespace → empty string
 */
function resolveClockfaceVersion(clockface, namespace, version) {
  const entry = clockface[namespace];
  if (!entry) return '';
  if (entry[version] !== undefined) return entry[version];
  return entry.default || '';
}

describe('Cascade product shortcodes', function () {
  let products;
  let clockface;

  before(function () {
    cy.task('getData', 'products').then((data) => {
      products = data;
    });
    cy.task('getData', 'clockface').then((data) => {
      clockface = data;
    });
  });

  testPages.forEach(({ key, version, path }) => {
    const label = key === 'influxdb' ? `${key} (${version})` : key;
    const testUrl = `${path}__tests__/shortcodes/`;
    const isInfluxdb3 = path.startsWith('/influxdb3/');

    describe(label, function () {
      let product;

      beforeEach(function () {
        product = products[key];
        cy.visit(testUrl);
      });

      // ────────────────────────────────────────────
      // Existing tests: product-name, product-key,
      //   current-version, influxdb/host,
      //   influxdb3/home-sample-link, influxdb3/limit
      // ────────────────────────────────────────────

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

      // ────────────────────────────────────────────
      // Category A: Version lookups
      // ────────────────────────────────────────────

      it('renders latest-patch', function () {
        const expected = expectedLatestPatch(product, version);
        if (expected) {
          cy.get('[data-testid="latest-patch"]').should(
            'contain.text',
            expected
          );
        } else {
          cy.get('[data-testid="latest-patch"]')
            .invoke('text')
            .invoke('trim')
            .should('equal', '');
        }
      });

      if (version === 'v2' || version === 'cloud') {
        it('renders latest-patch cli=true', function () {
          const expected = expectedLatestPatchCli(products, version);
          cy.get('[data-testid="latest-patch-cli"]').should(
            'contain.text',
            expected
          );
        });
      }

      if (key === 'telegraf') {
        it('renders telegraf/verify with correct version', function () {
          const expected = product.latest_patches?.[version];
          cy.get('body').should('contain.text', `telegraf-${expected}`);
        });
      }

      // ────────────────────────────────────────────
      // Category B: Namespace in URLs / Icon
      // ────────────────────────────────────────────

      it('renders icon "check"', function () {
        const cfVersion = resolveClockfaceVersion(
          clockface,
          product.namespace,
          version
        );
        if (cfVersion === 'v2') {
          cy.get('[data-testid="icon-check"] span').should(
            'have.class',
            'icon-checkmark'
          );
        } else {
          cy.get('[data-testid="icon-check"] span').should(
            'have.class',
            'cf-icon'
          );
        }
      });

      if (version === 'v2' || version === 'cloud') {
        it('renders cli/influx-creds-note', function () {
          cy.get('[data-testid="influx-creds-note"]').should(
            'contain.text',
            'Authentication credentials'
          );
          cy.get(
            '[data-testid="influx-creds-note"] a[href*="/reference/cli/influx/"]'
          ).should('exist');
        });
      }

      if (key === 'influxdb3_core' || key === 'influxdb3_enterprise') {
        it('renders token-link', function () {
          cy.get('[data-testid="token-link"]')
            .invoke('text')
            .should('contain', 'token')
            .and('contain', `/admin/tokens/`);
        });

        it('renders token-link "database" with blacklist', function () {
          cy.get('[data-testid="token-link-database"]')
            .invoke('text')
            .then((text) => {
              if (version === 'core') {
                // "database" is blacklisted on core
                expect(text).to.not.contain('database token');
              } else {
                // "database" is NOT blacklisted on enterprise
                expect(text).to.contain('database token');
              }
              expect(text).to.contain('token');
            });
        });
      }

      // ────────────────────────────────────────────
      // Category C: Product name in text
      // ────────────────────────────────────────────

      if (key === 'influxdb3_core' || key === 'influxdb3_cloud_dedicated') {
        it('renders sql/sql-schema-intro with product name', function () {
          cy.get('[data-testid="sql-schema-intro"]').should(
            'contain.text',
            product.name
          );
          if (version === 'cloud-dedicated') {
            cy.get('[data-testid="sql-schema-intro"]').should(
              'not.contain.text',
              'bucket'
            );
          } else {
            cy.get('[data-testid="sql-schema-intro"]').should(
              'contain.text',
              'bucket'
            );
          }
        });

        it('renders influxql/v1-v3-data-model-note with product name', function () {
          cy.get('[data-testid="v1-v3-data-model-note"]').should(
            'contain.text',
            product.name
          );
        });
      }

      // ────────────────────────────────────────────
      // Category D: placeholder_host in api-endpoint
      // ────────────────────────────────────────────

      it('renders api-endpoint with placeholder host', function () {
        const expected = product.placeholder_host || 'localhost:8086';
        cy.get('[data-testid="api-endpoint"] pre.api-endpoint').should(
          'contain.text',
          expected
        );
      });

      // ────────────────────────────────────────────
      // Category E: Version visibility
      // ────────────────────────────────────────────

      it('renders show-in/hide-in based on version', function () {
        if (version === 'core') {
          cy.get('[data-testid="show-in-core"]').should(
            'contain.text',
            'VISIBLE_IN_CORE'
          );
          cy.get('[data-testid="hide-in-core"]').should(
            'not.contain.text',
            'HIDDEN_IN_CORE'
          );
        } else {
          cy.get('[data-testid="show-in-core"]').should(
            'not.contain.text',
            'VISIBLE_IN_CORE'
          );
          cy.get('[data-testid="hide-in-core"]').should(
            'contain.text',
            'HIDDEN_IN_CORE'
          );
        }
      });

      // ────────────────────────────────────────────
      // Category F: Link field (cta-link)
      // ────────────────────────────────────────────

      if (
        key === 'influxdb3_cloud_dedicated' ||
        key === 'influxdb3_clustered'
      ) {
        it('renders cta-link', function () {
          cy.get('[data-testid="cta-link"]').should(
            'contain.text',
            product.link
          );
        });
      }

      // ────────────────────────────────────────────
      // Category G: Site-level data
      // ────────────────────────────────────────────

      if (version === 'v2' || version === 'cloud') {
        it('renders release-toc', function () {
          cy.get('[data-testid="release-toc"] #release-toc')
            .should('have.class', version)
            .and('have.attr', 'data-component', 'release-toc');
        });

        it('renders influxdb/points-series-flux', function () {
          const expectedCount = version === 'cloud' ? 4 : 2;
          cy.get('[data-testid="points-series-flux"] .series-diagram').should(
            'have.length',
            expectedCount
          );
        });
      }
    });
  });
});
