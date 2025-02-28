/// <reference types="cypress" />

describe('Docs home', function() {
  beforeEach(() => cy.visit('/'));

  it('has metadata', function() {
    cy.title().should('eq', 'InfluxData Documentation');
  });

  it('can search with mispellings', function() {
    cy.get('.sidebar--search').within(() => {
      cy.get('input#algolia-search-input').type('sql uery');
      cy.get('#algolia-autocomplete-listbox-0')
        .should('contain', 'Basic query examples')
      cy.get('input#algolia-search-input')
        .type('{esc}')
      cy.get('#algolia-autocomplete-listbox-0')
        .should('not.be.visible'); 
    });
  });

  it('main heading', function() {
    cy.get('h1').should('contain', 'InfluxData Documentation');
  });

  it('content has links to all products', function() {
    cy.task('getData', 'products').then((productData) => {
      Object.values(productData).forEach((p) => {
        let name = p.altname?.length > p.name.length ? p.altname : p.name;
        name = name.replace(/\((.*)\)/, '$1');
        cy.get('.home-content a').filter(`:contains(${name})`).first().click();
        const urlFrag = p.latest.replace(/(v\d+)\.\w+/, '$1');
        cy.url().should('include', urlFrag);
        cy.go('back');
      });
    });
  });
});

