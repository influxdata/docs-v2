describe('Search focus and blur', () => {
  it('works on the home page without an article content wrapper', () => {
    cy.visit('/');
    cy.get('.content-wrapper').should('not.exist');
    cy.get('input#algolia-search-input').focus().should('have.focus').blur();
    cy.get('h1').should('be.visible');
  });

  it('fades and restores article content', () => {
    cy.visit('/influxdb3/core/install/');
    cy.get('input#algolia-search-input').focus();
    cy.get('.content-wrapper').should('have.css', 'opacity', '0.35');
    cy.get('input#algolia-search-input').blur();
    cy.get('.content-wrapper').should('have.css', 'opacity', '1');
  });
});
