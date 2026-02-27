/// <reference types="cypress" />

describe('Docs home', function () {
  beforeEach(() => cy.visit('/'));

  it('has metadata', function () {
    cy.title().should('eq', 'InfluxData Documentation');
  });

  it('can search with mispellings', function () {
    cy.get('.sidebar--search').within(() => {
      cy.get('input#algolia-search-input').type('sql uery');
      cy.get('#algolia-autocomplete-listbox-0').should(
        'contain',
        'Basic query examples'
      );
      cy.get('input#algolia-search-input').type('{esc}');
      cy.get('#algolia-autocomplete-listbox-0').should('not.be.visible');
    });
  });

  it('main heading', function () {
    cy.get('h1').should('contain', 'InfluxData Documentation');
  });

  it('content has links to all products', function () {
    // Collect hrefs first to avoid stale DOM references after navigation.
    cy.get('.home-content h3 > a')
      .should('have.length.gte', 13)
      .then(($links) => {
        const hrefs = [...$links].map((a) => a.getAttribute('href'));
        hrefs.forEach((href, i) => {
          cy.get('.home-content h3 > a').eq(i).click();
          cy.url().should('include', href);
          cy.go('back');
        });
      });
  });
});
