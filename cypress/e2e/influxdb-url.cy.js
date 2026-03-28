/// <reference types="cypress" />

/**
 * InfluxDB URL localStorage E2E Test Suite
 *
 * Tests that the InfluxDB URL replacement logic in influxdb-url.js handles
 * localStorage correctly, including stale data from returning visitors.
 *
 * Regression tests for https://github.com/influxdata/docs-v2/issues/6960
 * where stale localStorage missing the `core` key caused JavaScript to
 * replace rendered hostnames with "undefined" in code blocks.
 */

const STORAGE_KEY = 'influxdata_docs_urls';
const TEST_PAGE = '/influxdb3/core/plugins/';
const EXPECTED_PRODUCT_KEYS = [
  'oss',
  'cloud',
  'core',
  'enterprise',
  'serverless',
  'dedicated',
  'clustered',
];

describe('InfluxDB URL - localStorage', function () {
  it('should not render "undefined" in code blocks when localStorage is missing product keys', function () {
    // Simulate a returning visitor whose localStorage was created before
    // core/enterprise products were added — missing those keys entirely.
    const staleUrls = {
      oss: 'http://localhost:8086',
      cloud: 'https://us-west-2-1.aws.cloud2.influxdata.com',
      prev_oss: 'http://localhost:8086',
      prev_cloud: 'https://us-west-2-1.aws.cloud2.influxdata.com',
      custom: '',
    };

    cy.visit(TEST_PAGE, {
      onBeforeLoad(win) {
        win.localStorage.setItem(STORAGE_KEY, JSON.stringify(staleUrls));
      },
    });

    // The api-endpoint block should show the default Core host, not "undefined"
    cy.get('.article--content pre.api-endpoint')
      .first()
      .should('contain', 'localhost:8181')
      .and('not.contain', 'undefined');

    // No code block in the article should contain "undefined" as a bare host
    cy.get('.article--content pre:not(.preserve)').each(($el) => {
      cy.wrap($el).invoke('text').should('not.match', /undefined\/api\//);
    });
  });

  it('should backfill all expected product URL keys into localStorage', function () {
    cy.visit(TEST_PAGE, {
      onBeforeLoad(win) {
        // Start with no stored URLs — forces initialization
        win.localStorage.removeItem(STORAGE_KEY);
      },
    });

    // After the page loads and JS initializes, localStorage should contain
    // all expected product keys with non-empty URL values.
    cy.window().then((win) => {
      const stored = JSON.parse(win.localStorage.getItem(STORAGE_KEY));
      expect(stored).to.be.an('object');

      EXPECTED_PRODUCT_KEYS.forEach((key) => {
        expect(stored, `stored URLs should have key "${key}"`).to.have.property(
          key
        );
        expect(stored[key], `"${key}" should be a non-empty string`).to.be.a(
          'string'
        ).and.not.be.empty;
      });
    });
  });
});
