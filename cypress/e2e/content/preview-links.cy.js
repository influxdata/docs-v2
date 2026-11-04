// Run against a built preview served under its deployment path:
// cypress run --spec cypress/e2e/content/preview-links.cy.js \
//   --config baseUrl=http://localhost:1331 \
//   --env preview_path=/pr-preview/pr-7791/
describe('PR preview links', () => {
  const prefix = Cypress.env('preview_path');

  before(() => {
    expect(prefix, 'preview_path must be the deployed preview subpath')
      .to.be.a('string')
      .and.match(/^\/pr-preview\/pr-[^/]+\/$/);
  });

  beforeEach(() => {
    cy.visit(`${prefix}influxdb3/enterprise/`);
    cy.get('[data-option="connect-mcp-docs"]').should('exist');
  });

  it('keeps rendered and dynamically created internal links in the preview', () => {
    cy.location('origin').then((origin) => {
      cy.get('a[href]').each(($anchor) => {
        const anchor = $anchor[0];
        if (anchor.origin === origin) {
          expect(anchor.pathname, anchor.href).to.match(
            new RegExp(`^${prefix}`)
          );
        }
      });
    });
    cy.get('[data-option="connect-mcp-docs"]')
      .should('have.attr', 'href')
      .and('include', `${prefix}influxdb3/`);
  });

  it('stays in the preview when following a content link', () => {
    cy.get('.article--content a[href*="get-started/"]').first().click();
    cy.location('pathname').should(
      'eq',
      `${prefix}influxdb3/enterprise/get-started/`
    );
  });
});
