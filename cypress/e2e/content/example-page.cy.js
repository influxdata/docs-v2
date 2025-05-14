/// <reference types="cypress" />

describe('Example page shortcodes and JavaScript', function() {
  before(function() {
    // Track JavaScript errors
    cy.on('uncaught:exception', (err, runnable) => {
      // Log the error to the Cypress command log
      cy.log(`JavaScript error: ${err.message}`);
      
      // Add the error to the test failure message
      Cypress.failures = Cypress.failures || [];
      Cypress.failures.push(err.message);
      
      // Return false to prevent Cypress from failing the test
      // We want to continue the test and record all errors
      return false;
    });
  });
  
  beforeEach(function() {
    // Clear any stored failures before each test
    Cypress.failures = [];
    
    // Visit the example page
    cy.visit('/example/');
  });
  
  it('loads without JavaScript errors', function() {
    // Check if page loaded successfully
    cy.title().should('not.be.empty');
    
    // Verify no JavaScript errors were recorded
    cy.wrap(Cypress.failures).should('be.empty', 
      'The following JavaScript errors were detected:\n' + 
      (Cypress.failures || []).join('\n'));
  });
  
  it('has expected content structure', function() {
    // Basic page structure checks
    cy.get('h1').should('exist');
    cy.get('main').should('exist');
  });
  
  // Add more specific tests for the example page content as needed
});