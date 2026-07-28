/// <reference types="cypress" />

/**
 * Tests for the influxdb/host-url shortcode.
 *
 * Verifies that host-url renders the product-correct URL scheme in front of
 * the host placeholder: self-managed products with a localhost host render
 * `http://`, and managed products render `https://`. Regression coverage for
 * https://github.com/influxdata/docs-v2/issues/7502, where shared InfluxDB 3
 * content hardcoded `http://` in front of `{{< influxdb/host >}}`, producing
 * insecure URLs on managed-product pages.
 *
 * Assertions are data-driven from data/products.yml so they track the
 * `scheme` and `placeholder_host` values rather than hardcoded strings.
 */

const STORAGE_KEY = 'influxdata_docs_urls';

// Product key -> a real page that renders the host-url shortcode.
const PAGES = {
  influxdb3_core: '/influxdb3/core/write-data/http-api/v3-write-lp/',
  influxdb3_enterprise:
    '/influxdb3/enterprise/write-data/http-api/v3-write-lp/',
  influxdb3_cloud_serverless:
    '/influxdb3/cloud-serverless/reference/sample-data/',
  influxdb3_cloud_dedicated:
    '/influxdb3/cloud-dedicated/reference/sample-data/',
  influxdb3_clustered: '/influxdb3/clustered/reference/sample-data/',
};
const EXAMPLE_PAGE = '/example/';

// Visit with cleared URL storage so the customizer renders default placeholders.
function visitClean(path) {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.removeItem(STORAGE_KEY);
    },
  });
}

describe('influxdb/host-url shortcode', function () {
  it('renders http:// for self-managed products (Core, Enterprise)', function () {
    cy.task('getData', 'products').then((products) => {
      ['influxdb3_core', 'influxdb3_enterprise'].forEach((key) => {
        const { scheme, placeholder_host } = products[key];
        expect(scheme, `${key} scheme`).to.equal('http');
        const expectedUrl = `${scheme}://${placeholder_host}`;

        visitClean(PAGES[key]);
        cy.get('.article--content')
          .should('contain', expectedUrl)
          // never an insecure managed URL and never https on localhost
          .and('not.contain', `https://${placeholder_host}`);
      });
    });
  });

  it('renders https:// for managed products (Cloud Serverless, Dedicated, Clustered)', function () {
    cy.task('getData', 'products').then((products) => {
      [
        'influxdb3_cloud_serverless',
        'influxdb3_cloud_dedicated',
        'influxdb3_clustered',
      ].forEach((key) => {
        const { scheme, placeholder_host } = products[key];
        expect(scheme, `${key} scheme`).to.equal('https');
        const expectedUrl = `${scheme}://${placeholder_host}`;

        visitClean(PAGES[key]);
        cy.get('.article--content')
          .should('contain', expectedUrl)
          // the bug this guards against: plain http in front of a managed host
          .and('not.contain', `http://${placeholder_host}`);
      });
    });
  });

  it('renders host-url when nested in api-endpoint', function () {
    visitClean(EXAMPLE_PAGE);
    cy.get('pre.api-endpoint')
      .should('contain.text', 'https://localhost:8086/query')
      .and('not.contain.text', '{{< influxdb/host-url >}}');
  });
});
