/// <reference types="cypress" />

describe('Article navigation', () => {
  it('opens a narrow-screen ToC and dismisses it after navigation', () => {
    cy.viewport(1024, 768);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', { body: '' });
    cy.visit('/influxdb3/core/get-started/write/');
    cy.get('body').then(($body) => {
      const dismiss = $body.find('.notification:visible .close-notification');
      if (dismiss.length) cy.wrap(dismiss).click({ multiple: true });
    });
    cy.get('[data-page-rail] nav').should('not.be.visible');
    cy.get('[data-page-rail] button')
      .should('have.attr', 'aria-expanded', 'false')
      .click();
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('[data-page-rail] nav').should('not.be.visible');
    cy.focused().should('have.attr', 'id', 'construct-line-protocol');
  });
  it('navigates headings rendered from shared content at 1280px', () => {
    cy.viewport(1280, 1024);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', {
      headers: { 'content-type': 'application/javascript' },
      body: '',
    });
    cy.visit('/influxdb3/core/get-started/write/');
    cy.get('body').then(($body) => {
      const dismiss = $body.find('.notification:visible .close-notification');
      if (dismiss.length) cy.wrap(dismiss).click({ multiple: true });
    });
    cy.get('[data-page-rail]').should('be.visible');
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('[data-page-rail] a[aria-current="location"]').should(
      'have.attr',
      'href',
      '#construct-line-protocol'
    );
    cy.get('[data-page-rail]').should('not.contain', 'Support and feedback');
  });
});
