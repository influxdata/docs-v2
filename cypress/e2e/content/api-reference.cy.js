/// <reference types="cypress" />
const fakeGoogleTagManager = {
  trackingOptIn: () => {},
  trackingOptOut: () => {}
}

describe('API reference content', () => {
  const subjects = [
    '/influxdb/cloud/api/',
    '/influxdb/cloud/api/v1/',
    '/influxdb/cloud/api/v1-compatibility/',
    '/influxdb/cloud/api/v2/',

    '/influxdb/v2/api/',
    '/influxdb/v2/api/v1/',
    '/influxdb/v2/api/v1-compatibility/',
    '/influxdb/v2/api/v2/',

    '/influxdb3/cloud-dedicated/api/',
    '/influxdb3/cloud-dedicated/api/management/',
    '/influxdb3/cloud-dedicated/api/v1/',
    '/influxdb3/cloud-dedicated/api/v1-compatibility/',
    '/influxdb3/cloud-dedicated/api/v2/',

    '/influxdb3/cloud-serverless/api/',
    '/influxdb3/cloud-serverless/api/v1/',
    '/influxdb3/cloud-serverless/api/v1-compatibility/',
    '/influxdb3/cloud-serverless/api/v2/',

    '/influxdb3/clustered/api/',
    // TODO '/influxdb3/clustered/api/management/',
    '/influxdb3/clustered/api/v1/',
    '/influxdb3/clustered/api/v1-compatibility/',
    '/influxdb3/clustered/api/v2/',
    '/influxdb3/core/api/',

    '/influxdb3/enterprise/api/',
  ];

  subjects.forEach((subject) => {
    describe(subject, () => {
      it(`has API info`, function () {
        cy.visit(subject);
        window.fcdsc = fakeGoogleTagManager;
        cy.stub(window.fcdsc, 'trackingOptIn').as('trackingOptIn');
        cy.stub(window.fcdsc, 'trackingOptOut').as('trackingOptOut');
        cy.get('h1').first().should('have.length', 1);
        cy.get('[data-role$=description]').should('have.length', 1);
      });
      it('links back to the version home page', function () {
        cy.visit(`${subject}`);
        window.fcdsc = fakeGoogleTagManager;
        cy.stub(window.fcdsc, 'trackingOptIn').as('trackingOptIn');
        cy.stub(window.fcdsc, 'trackingOptOut').as('trackingOptOut');
        cy.get('a.back').contains('Docs')
          .should('have.length', 1)
          .click();
        // Path should be the first two segments and trailing slash in $subject
        cy.location('pathname')
          .should('eq', subject.replace(/^(\/[^/]+\/[^/]+\/).*/, '$1'));
        cy.get('h1').should('have.length', 1);
      });
      it('contains valid internal links', function () {
        cy.visit(subject);
        window.fcdsc = fakeGoogleTagManager;
        cy.stub(window.fcdsc, 'trackingOptIn').as('trackingOptIn');
        cy.stub(window.fcdsc, 'trackingOptOut').as('trackingOptOut');
        // The following conditional test isn't the cypress way, but the doc might not have internal links.
        cy.get('body').then(($body) => {
          if ($body.find('p a[href^="/"]').length === 0) {
            cy.log('No internal links found');
            return;
          }
          cy.get('p a[href^="/"]').as('internal-links');
          cy.get('@internal-links').each(($a) => {
            cy.log(`** Testing link ${$a.attr('href')} **`);
            // cy.request doesn't show in your browser's Developer Tools
            // because the request comes from Node, not from the browser.
            cy.request($a.attr('href')).its('status').should('eq', 200);
        });

        });
      });
      it('contains valid external links', function () {
        cy.visit(subject);
        window.fcdsc = fakeGoogleTagManager;
        cy.stub(window.fcdsc, 'trackingOptIn').as('trackingOptIn');
        cy.stub(window.fcdsc, 'trackingOptOut').as('trackingOptOut');
        // The following conditional test isn't the cypress way, but the doc might not have external links.
        cy.get('body').then(($body) => {
          if ($body.find('p a[href^="http"]').length === 0) {
            cy.log('No external links found');
            return;
          }
          cy.get('p a[href^="http"]').as('external-links');
          cy.get('@external-links').each(($a) => {
            cy.log(`** Testing link ${$a.attr('href')} **`);
            cy.request($a.attr('href')).its('status').should('eq', 200);
          });
        });
      });
    });
  });
});
