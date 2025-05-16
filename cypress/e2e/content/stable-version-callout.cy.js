/// <reference types="cypress" />

describe('Stable version', function () {
  before(function () {
    // Track JavaScript errors
    cy.on('uncaught:exception', (err, runnable) => {
      // Log the error to the Cypress command log
      cy.log(`JavaScript error: ${err.message}`);

      // Add the error to the test failure message
      Cypress.failures = Cypress.failures || [];
      Cypress.failures.push(err.message);

      // Return false to prevent Cypress from failing the test
      return false;
    });
  });

  beforeEach(function () {
    // Clear any stored failures before each test
    Cypress.failures = [];
  });

  it('should show InfluxDB 3 Core as successor product in InfluxDB v2 page', function () {
    // Visit the v2 documentation page
    cy.visit('/influxdb/v1/introduction/install/');

    // Check for the warning block that appears for older versions
    cy.get('.warn.block.old-version').should('exist');

    // Verify that the warning message references original product name
    cy.get('.warn.block.old-version p').should(
      'contain',
      'This page documents an earlier version of InfluxDB OSS'
    );

    // Check for the link to the successor product
    cy.get('.warn.block.old-version a')
      .first()
      .should('contain', 'InfluxDB 3 Core')
      .and('have.attr', 'href', '/influxdb3/core/');

    // Verify no JavaScript errors were recorded
    cy.wrap(Cypress.failures).should(
      'be.empty',
      'The following JavaScript errors were detected:\n' +
        (Cypress.failures || []).join('\n')
    );
  });

  it('should show InfluxDB 3 Core as successor product in InfluxDB v1 page', function () {
    // Visit the v1 documentation page
    cy.visit('/influxdb/v1/');

    // Check for the warning block that appears for older versions
    cy.get('.warn.block.old-version').should('exist');

    // Verify that the warning message references original product name
    cy.get('.warn.block.old-version p').should(
      'contain',
      'This page documents an earlier version of InfluxDB OSS'
    );

    // Check for the link to the latest stable version (successor product)
    cy.get('.warn.block.old-version a')
      .first()
      .should('contain', 'InfluxDB 3 Core')
      .and('have.attr', 'href', '/influxdb3/core/');

    // Verify no JavaScript errors were recorded
    cy.wrap(Cypress.failures).should(
      'be.empty',
      'The following JavaScript errors were detected:\n' +
        (Cypress.failures || []).join('\n')
    );
  });

  it('should verify the product succeeded_by relationship is configured correctly', function () {
    // Get the product data to verify succeeded_by field
    cy.task('getData', 'products').then((productData) => {
      // Check succeeded_by relationship in products.yml
      expect(productData.influxdb).to.have.property(
        'succeeded_by',
        'influxdb3_core'
      );

      // Verify successor product exists
      expect(productData).to.have.property('influxdb3_core');
      expect(productData.influxdb3_core).to.have.property(
        'name',
        'InfluxDB 3 Core'
      );
    });
  });

  it('should verify behavior if the stable-version.html template changes', function () {
    // Visit a page that shouldn't have a successor redirect
    cy.visit('/telegraf/v1/');
    cy.get('.warn.block.old-version').should('not.exist');

    cy.wrap(Cypress.failures).should(
      'be.empty',
      'The following JavaScript errors were detected:\n' +
        (Cypress.failures || []).join('\n')
    );
  });
});
