/// <reference types="cypress" />

/**
 * Tests for shortcodes that require real page context—
 * URL paths, child pages, or site-wide data—
 * and cannot be tested on flat _test/shortcodes.md pages.
 *
 * Shortcodes tested:
 *   cli/mapped           — parses CLI command name from URL path
 *   children             — lists child pages (.Page.Pages)
 *   flux/list-all-functions — iterates all flux function pages
 *   telegraf/plugins     — reads site.data.telegraf_plugins
 *   html-diagram/sso-auth-flow — inserts product name into diagram
 *   cli/influxd-flags    — reads site.data.influxd_flags
 */

describe('Shortcodes on real content pages', function () {
  let products;

  before(function () {
    cy.task('getData', 'products').then((data) => {
      products = data;
    });
  });

  describe('cli/mapped', function () {
    it('renders "Maps to" link on CLI command page', function () {
      cy.visit('/influxdb/v2/reference/cli/influx/bucket/');
      cy.get('a.q-link[href*="#view-mapped-environment-variables"]').should(
        'exist'
      );
    });
  });

  describe('children', function () {
    it('renders child page links on section page', function () {
      cy.visit('/telegraf/v1/data_formats/');
      cy.get('.children-links').should('exist');
      cy.get('.children-links a').should('have.length.at.least', 1);
    });
  });

  describe('flux/list-all-functions', function () {
    it('renders function list with links', function () {
      cy.visit('/flux/v0/stdlib/all-functions/');
      cy.get('ul.function-list').should('exist');
      cy.get('ul.function-list li a').should('have.length.at.least', 10);
    });
  });

  describe('telegraf/plugins', function () {
    it('renders plugin cards with version info', function () {
      cy.visit('/telegraf/v1/plugins/');
      cy.get('.plugin-card').should('have.length.at.least', 10);
      cy.get('.plugin-card .info h3').first().should('exist');
      cy.get('.plugin-card .info .meta code')
        .first()
        .invoke('text')
        .should('match', /^(input|output|processor|aggregator)s\./);
    });
  });

  describe('html-diagram/sso-auth-flow', function () {
    it('renders SSO diagram with product name', function () {
      cy.visit('/influxdb3/cloud-dedicated/admin/sso/');
      const expectedName = products.influxdb3_cloud_dedicated.name;
      cy.get('#sso-auth-flow').should('exist');
      cy.get('#sso-auth-flow .auth-item#influxdb').should(
        'contain.text',
        expectedName
      );
    });
  });

  describe('cli/influxd-flags', function () {
    it('renders flag list with config-options links', function () {
      cy.visit('/influxdb/v2/reference/cli/influxd/');
      cy.get('a[href*="/reference/config-options/#"]').should(
        'have.length.at.least',
        3
      );
      cy.get('a[href*="/reference/config-options/#"]')
        .first()
        .invoke('text')
        .should('match', /^--/);
    });
  });
});
