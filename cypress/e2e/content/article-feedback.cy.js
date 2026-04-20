/// <reference types="cypress" />

/**
 * Tests for the article feedback partial
 * (layouts/partials/article/feedback.html).
 *
 * Guards three regressions:
 *   1. #7089 — the "Submit docs issue" button must always point to the
 *      docs-v2 issue tracker, not the support site.
 *   2. The "Submit <product> issue" button href comes from the product's
 *      `product_issue_url` in data/products.yml. Licensed products point
 *      to support.influxdata.com; OSS products point to the relevant
 *      influxdata/<repo> issue tracker.
 *   3. The button label uses the version-specific product name where one
 *      exists in products.yml (`name__v1`, `name__v2`). Cloud (TSM) pages
 *      resolve to the `influxdb_cloud` product entry, not the OSS
 *      `influxdb` entry.
 *
 * The static Node check in .ci/scripts/check-feedback-links.js enforces
 * schema and URL correctness at the config/template level; this spec
 * validates the rendered HTML that users actually see.
 */

const DOCS_ISSUE_PREFIX = 'https://github.com/influxdata/docs-v2/issues/new';
const SUPPORT_URL = 'https://support.influxdata.com/s/';

const cases = [
  // OSS products — button points to the public GitHub tracker.
  {
    url: '/influxdb/v2/get-started/',
    productLabel: 'Submit InfluxDB OSS v2 issue',
    productHref: 'https://github.com/influxdata/influxdb/issues/new/choose/',
  },
  {
    url: '/influxdb/v1/introduction/',
    productLabel: 'Submit InfluxDB OSS v1 issue',
    productHref: 'https://github.com/influxdata/influxdb/issues/new/choose/',
  },
  {
    url: '/influxdb3/core/get-started/',
    productLabel: 'Submit InfluxDB 3 Core issue',
    productHref: 'https://github.com/influxdata/influxdb/issues/new/choose/',
  },
  {
    url: '/influxdb3/explorer/',
    productLabel: 'Submit InfluxDB 3 Explorer issue',
    productHref: 'https://github.com/influxdata/influxdb/issues/new/choose/',
  },
  {
    url: '/telegraf/v1/',
    productLabel: 'Submit Telegraf issue',
    productHref: 'https://github.com/influxdata/telegraf/issues/new/choose/',
  },
  {
    url: '/chronograf/v1/',
    productLabel: 'Submit Chronograf issue',
    productHref: 'https://github.com/influxdata/chronograf/issues/new/choose/',
  },
  {
    url: '/kapacitor/v1/',
    productLabel: 'Submit Kapacitor issue',
    productHref: 'https://github.com/influxdata/kapacitor/issues/new/choose/',
  },

  // Licensed products — button points to the support site.
  {
    url: '/influxdb3/enterprise/get-started/',
    productLabel: 'Submit InfluxDB 3 Enterprise issue',
    productHref: SUPPORT_URL,
  },
  {
    url: '/influxdb3/clustered/',
    productLabel: 'Submit InfluxDB Clustered issue',
    productHref: SUPPORT_URL,
  },
  {
    url: '/influxdb3/cloud-dedicated/',
    productLabel: 'Submit InfluxDB Cloud Dedicated issue',
    productHref: SUPPORT_URL,
  },
  {
    url: '/influxdb3/cloud-serverless/',
    productLabel: 'Submit InfluxDB Cloud Serverless issue',
    productHref: SUPPORT_URL,
  },
  {
    url: '/influxdb/cloud/get-started/',
    productLabel: 'Submit InfluxDB Cloud (TSM) issue',
    productHref: SUPPORT_URL,
  },
  {
    url: '/enterprise_influxdb/v1/introduction/',
    productLabel: 'Submit InfluxDB Enterprise v1 issue',
    productHref: SUPPORT_URL,
  },
];

describe('Article feedback buttons', () => {
  cases.forEach(({ url, productLabel, productHref }) => {
    it(`${url} renders docs issue + "${productLabel}"`, () => {
      cy.visit(url);

      cy.get('.feedback.block .actions a.btn.issue').as('issueButtons');

      // "Submit docs issue" always goes to docs-v2 (the #7089 guard).
      cy.get('@issueButtons')
        .contains('Submit docs issue')
        .should('have.attr', 'href')
        .and('match', new RegExp(`^${DOCS_ISSUE_PREFIX}`));

      // Per-product issue button label and href.
      cy.get('@issueButtons')
        .contains(productLabel)
        .should('have.attr', 'href', productHref);
    });
  });
});
