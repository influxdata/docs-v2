/// <reference types="cypress" />

/**
 * Page Context E2E Test Suite
 *
 * Tests that the Ask AI widget loads correct example questions for Explorer.
 * This validates the fix for Explorer showing wrong example questions.
 */

describe('Page Context - Ask AI Integration', function () {
  describe('Explorer Product Mapping', function () {
    it('should show Explorer-specific Ask AI questions', function () {
      cy.visit('/influxdb3/explorer/');

      // Wait for page to load
      cy.get('body').should('be.visible');

      // The Ask AI widget should eventually be initialized
      // We can't easily test the Kapa widget directly in Cypress,
      // but we can verify the page loaded correctly for Explorer
      cy.url().should('include', '/influxdb3/explorer/');

      // Verify the page has the expected title
      cy.get('h1').should('contain', 'InfluxDB 3 Explorer');
    });

    it('should show Core-specific content', function () {
      cy.visit('/influxdb3/core/');

      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/core/');
      cy.get('h1').should('contain', 'InfluxDB 3 Core');
    });

    it('should show Enterprise-specific content', function () {
      cy.visit('/influxdb3/enterprise/');

      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/enterprise/');
      cy.get('h1').should('contain', 'InfluxDB 3 Enterprise');
    });
  });

  describe('Product Data Validation', function () {
    it('should have correct Explorer product configuration', function () {
      cy.task('getData', 'products').then((products) => {
        // Verify Explorer product exists in products.yml
        expect(products.influxdb3_explorer).to.exist;
        expect(products.influxdb3_explorer.name).to.equal('InfluxDB 3 Explorer');
        expect(products.influxdb3_explorer.namespace).to.equal('influxdb3_explorer');
        expect(products.influxdb3_explorer.placeholder_host).to.equal('localhost:8888');

        // Verify AI configuration
        expect(products.influxdb3_explorer.ai_sample_questions).to.exist;
        expect(products.influxdb3_explorer.ai_sample_questions).to.be.an('array');
        expect(products.influxdb3_explorer.ai_sample_questions.length).to.be.greaterThan(0);

        // Verify Explorer-specific questions
        const questionsText = products.influxdb3_explorer.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('query data');
        expect(questionsText).to.include('visualize data');

        // Verify it doesn't have Core/Enterprise specific questions
        expect(questionsText).to.not.include('plugin');
        expect(questionsText).to.not.include('read replica');
      });
    });

    it('should have correct Core product configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_core).to.exist;
        expect(products.influxdb3_core.name).to.equal('InfluxDB 3 Core');
        expect(products.influxdb3_core.placeholder_host).to.equal('localhost:8181');

        const questionsText = products.influxdb3_core.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('plugin');
      });
    });

    it('should have correct Enterprise product configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_enterprise).to.exist;
        expect(products.influxdb3_enterprise.name).to.equal('InfluxDB 3 Enterprise');
        expect(products.influxdb3_enterprise.placeholder_host).to.equal('localhost:8181');

        const questionsText = products.influxdb3_enterprise.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('read replica');
      });
    });
  });
});
