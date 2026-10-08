/// <reference types="cypress" />

/**
 * Left nav (sidebar) active-state behavior.
 *
 * The inline script in layouts/partials/sidebar.html marks the nav item
 * matching the current URL as active, opens its ancestor lists, and opens
 * the active item's own children list when the current page is a section.
 */

describe('Sidebar nav active state', () => {
  it('marks the current page active and opens ancestors', () => {
    cy.visit('/telegraf/v1/configuration/agent/');

    cy.get('#nav-tree li[data-nav-url="/telegraf/v1/configuration/agent/"]')
      .should('have.class', 'active')
      .parents('ul.children')
      .should('have.class', 'open');
  });

  it('opens the children of the current section page', () => {
    cy.visit('/telegraf/v1/configuration/');

    cy.get('#nav-tree li[data-nav-url="/telegraf/v1/configuration/"]')
      .should('have.class', 'active')
      .within(() => {
        cy.get('> ul.children').should('have.class', 'open');
        cy.get('> a.children-toggle').should('have.class', 'open');
      });
  });
});
