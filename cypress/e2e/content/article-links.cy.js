/// <reference types="cypress" />
describe('Article links', () => {
  const subjects = Cypress.env('test_subjects').split(',');

  subjects.forEach((subject) => {
    it('contains valid internal links', function () {
      cy.visit(`${subject}`);
      cy.get('article a[href^="/"]') //.filter('[href^="/"]')
        .each(($a) => {
          cy.log(`** Testing internal link ${$a.attr('href')} **`);
          // cy.request doesn't show in your browser's Developer Tools
          // because the request comes from Node, not from the browser.
          cy.request($a.attr('href')).its('status').should('eq', 200);
        });
      });
    it('contains valid external links', function () {
      cy.visit(`${subject}`);
      cy.get('article a[href^="http"]')
        .each(($a) => {
          // cy.request doesn't show in your browser's Developer Tools
          cy.log(`** Testing external link ${$a.attr('href')} **`);
          // because the request comes from Node, not from the browser.
          cy.request($a.attr('href')).its('status').should('eq', 200);
        });
    });
  });
});
