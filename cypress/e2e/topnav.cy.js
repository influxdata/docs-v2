describe('global top navigation', function () {
  beforeEach(function () {
    // Visit the Docs home page
    cy.visit('/');
    // Dismiss any notification banners covering the nav. The count depends on
    // which entries in data/notifications.yaml target this page, so handle
    // none, one, or several without asserting a count.
    cy.get('body').then(($body) => {
      const $close = $body.find('.notification:visible .close-notification');
      if ($close.length) {
        cy.wrap($close).click({ force: true, multiple: true });
      }
    });
  });

  describe('theme switcher', function () {
    it('switches light to dark', function () {
      // Default is light theme. The switcher renders both buttons and shows
      // only the one for the theme you can switch to, so target it by class.
      cy.get('body.home').should(
        'have.css',
        'background-color',
        'rgb(243, 244, 251)'
      );
      cy.get('.theme-switch-dark').click();
      cy.get('body.home').should(
        'have.css',
        'background-color',
        'rgb(7, 7, 14)'
      );
      cy.get('.theme-switch-light').click();
      cy.get('body.home').should(
        'have.css',
        'background-color',
        'rgb(243, 244, 251)'
      );
    });
  });

  describe('product dropdown', function () {
    it('has links to all products', function () {
      cy.get('#product-dropdown .selected')
        .contains('Select product')
        .click({ force: true });
      cy.task('getData', 'products').then((productData) => {
        Object.values(productData).forEach((p) => {
          cy.get('#dropdown-items a').should('be.visible');
          let name = p.altname?.length > p.name.length ? p.altname : p.name;
          name = name.replace(/\((.*)\)/, '$1');
          cy.get('#dropdown-items a')
            .filter(`:contains(${name})`)
            .first()
            .click();
          const urlFrag = p.latest.replace(/(v\d+)\.\w+/, '$1');
          cy.url().should('include', urlFrag);
          // Test that the selected option is for the current product.
          // Reopen the dropdown.
          cy.get('#product-dropdown .selected')
            .contains(name)
            .click({ force: true });
        });
      });
    });
  });
});
