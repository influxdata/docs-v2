/// <reference types="cypress" />

/**
 * Tests for the article feedback partial
 * (layouts/partials/article/feedback.html).
 *
 * Guards:
 *   1. #7089 — the "Submit docs issue" button must always point to the
 *      docs-v2 issue tracker, not the support site.
 *   2. OSS products render a second "Submit <product> issue" button whose
 *      href matches `product_issue_url` in data/products.yml. Labels use
 *      the version-specific name where one exists (`name__v1`, `name__v2`).
 *   3. Licensed products render ONLY the docs issue button — the product
 *      button is hidden because the left column of the feedback block
 *      already points customers at InfluxData Support.
 */

const DOCS_ISSUE_PREFIX = 'https://github.com/influxdata/docs-v2/issues/new';

const ossCases = [
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
];

const licensedUrls = [
  '/influxdb3/enterprise/get-started/',
  '/influxdb3/clustered/',
  '/influxdb3/cloud-dedicated/',
  '/influxdb3/cloud-serverless/',
  '/influxdb/cloud/get-started/',
  '/enterprise_influxdb/v1/introduction/',
];

describe('Article feedback buttons', () => {
  describe('OSS products render both docs and product issue buttons', () => {
    ossCases.forEach(({ url, productLabel, productHref }) => {
      it(`${url} shows "${productLabel}"`, () => {
        cy.visit(url);

        cy.get('.feedback.block .actions a.btn.issue').as('issueButtons');

        cy.get('@issueButtons')
          .contains('Submit docs issue')
          .should('have.attr', 'href')
          .and('match', new RegExp(`^${DOCS_ISSUE_PREFIX}`));

        cy.get('@issueButtons')
          .contains(productLabel)
          .should('have.attr', 'href', productHref);

        cy.get('@issueButtons').should('have.length', 2);
      });
    });
  });

  describe('Licensed products hide the product issue button', () => {
    licensedUrls.forEach((url) => {
      it(`${url} shows only the docs issue button`, () => {
        cy.visit(url);

        cy.get('.feedback.block .actions a.btn.issue').as('issueButtons');

        cy.get('@issueButtons')
          .contains('Submit docs issue')
          .should('have.attr', 'href')
          .and('match', new RegExp(`^${DOCS_ISSUE_PREFIX}`));

        cy.get('@issueButtons').should('have.length', 1);

        // No "Submit <anything> issue" button other than the docs one.
        cy.get('@issueButtons')
          .contains(/^Submit (?!docs issue$).* issue$/)
          .should('not.exist');
      });
    });
  });
});
