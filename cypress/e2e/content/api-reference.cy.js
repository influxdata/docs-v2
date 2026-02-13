/// <reference types="cypress" />

/**
 * API Reference Documentation E2E Tests
 *
 * Tests:
 * 1. API reference pages (link validation, content structure)
 * 2. 3-column layout with TOC (for InfluxDB 3 Core/Enterprise)
 * 3. Hugo-native tag page rendering
 *
 * Run with:
 * node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/reference/api/_index.md
 */

const fakeGoogleTagManager = {
  trackingOptIn: () => {},
  trackingOptOut: () => {},
};

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
      beforeEach(() => {
        // Intercept and modify the page HTML before it loads
        cy.intercept('GET', '**', (req) => {
          req.continue((res) => {
            if (res.headers['content-type']?.includes('text/html')) {
              // Modify the Kapa widget script attributes
              // Avoid socket errors from fpjs in tests by disabling fingerprinting
              res.body = res.body.replace(
                /data-user-analytics-fingerprint-enabled="true"/,
                'data-user-analytics-fingerprint-enabled="false"'
              );
            }
          });
        });
        cy.visit(subject);

        window.fcdsc = fakeGoogleTagManager;
        cy.stub(window.fcdsc, 'trackingOptIn').as('trackingOptIn');
        cy.stub(window.fcdsc, 'trackingOptOut').as('trackingOptOut');
      });
      it(`has API info`, function () {
        cy.get('script[data-user-analytics-fingerprint-enabled=false]').should(
          'have.length',
          1
        );
        cy.get('h1').first().should('have.length', 1);
        // Check for description element (either article--description class or data-role attribute)
        cy.get('.article--description, [data-role$=description]').should(
          'have.length.at.least',
          1
        );
      });
      it('links back to the version home page', function () {
        cy.get('a.back').contains('Docs').should('have.length', 1).click();
        // Path should be the first two segments and trailing slash in $subject
        cy.location('pathname').should(
          'eq',
          subject.replace(/^(\/[^/]+\/[^/]+\/).*/, '$1')
        );
        cy.get('h1').should('have.length', 1);
      });
      it('contains valid internal links', function () {
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

/**
 * API Reference Layout Tests
 * Tests layout for InfluxDB 3 Core/Enterprise API documentation
 */
describe('API reference layout', () => {
  const layoutSubjects = [
    '/influxdb3/core/api/write-data/',
    '/influxdb3/enterprise/api/write-data/',
  ];

  layoutSubjects.forEach((subject) => {
    describe(`${subject} layout`, () => {
      beforeEach(() => {
        cy.intercept('GET', '**', (req) => {
          req.continue((res) => {
            if (res.headers['content-type']?.includes('text/html')) {
              res.body = res.body.replace(
                /data-user-analytics-fingerprint-enabled="true"/,
                'data-user-analytics-fingerprint-enabled="false"'
              );
            }
          });
        });
        cy.visit(subject);
      });

      describe('Layout Structure', () => {
        it('displays sidebar', () => {
          cy.get('.sidebar').should('be.visible');
        });

        it('displays API content area', () => {
          cy.get('.api-content, .content-wrapper, .article--content').should(
            'exist'
          );
        });

        it('displays TOC on page', () => {
          cy.get('.api-toc').should('exist');
        });
      });

      describe('Hugo-native renderer', () => {
        it('renders API operations container', () => {
          cy.get('.api-hugo-native, .api-operations-section').should('exist');
        });

        it('renders operation elements', () => {
          cy.get('.api-operation').should('have.length.at.least', 1);
        });

        it('operation has method badge and path', () => {
          cy.get('.api-operation')
            .first()
            .within(() => {
              cy.get('.api-method').should('exist');
              cy.get('.api-path').should('exist');
            });
        });
      });
    });
  });
});

/**
 * API Tag Page Tests
 * Tests Hugo-native tag pages render operations correctly
 */
describe('API tag pages', () => {
  const tagPages = [
    '/influxdb3/core/api/write-data/',
    '/influxdb3/core/api/query-data/',
    '/influxdb3/enterprise/api/write-data/',
  ];

  tagPages.forEach((page) => {
    describe(`Tag page ${page}`, () => {
      beforeEach(() => {
        cy.intercept('GET', '**', (req) => {
          req.continue((res) => {
            if (res.headers['content-type']?.includes('text/html')) {
              res.body = res.body.replace(
                /data-user-analytics-fingerprint-enabled="true"/,
                'data-user-analytics-fingerprint-enabled="false"'
              );
            }
          });
        });
        cy.visit(page);
      });

      it('displays page title', () => {
        cy.get('h1').should('exist');
      });

      it('renders operations section', () => {
        cy.get('.api-operations, .api-operations-section').should('exist');
      });

      it('operations have proper structure', () => {
        cy.get('.api-operation')
          .first()
          .within(() => {
            // Check for operation header with method and path
            cy.get('.api-operation-header, .api-operation-endpoint').should(
              'exist'
            );
            cy.get('.api-method').should('exist');
            cy.get('.api-path').should('exist');
          });
      });

      it('TOC contains operation links', () => {
        cy.get('.api-toc-nav').should('exist');
        cy.get('.api-toc-link').should('have.length.at.least', 1);
      });

      it('TOC links have method badges', () => {
        cy.get('.api-toc-link .api-method').should('have.length.at.least', 1);
      });
    });
  });
});

/**
 * API Section Page Structure Tests
 * Tests that API section pages show only tags (immediate children)
 */
describe('API section page structure', () => {
  const sectionPages = ['/influxdb3/core/api/', '/influxdb3/enterprise/api/'];

  sectionPages.forEach((page) => {
    describe(`Section page ${page}`, () => {
      beforeEach(() => {
        cy.intercept('GET', '**', (req) => {
          req.continue((res) => {
            if (res.headers['content-type']?.includes('text/html')) {
              res.body = res.body.replace(
                /data-user-analytics-fingerprint-enabled="true"/,
                'data-user-analytics-fingerprint-enabled="false"'
              );
            }
          });
        });
        cy.visit(page);
      });

      it('displays page title', () => {
        cy.get('h1').should('contain', 'InfluxDB HTTP API');
      });

      it('shows tag pages as children', () => {
        cy.get('.children-links h3 a').should('have.length.at.least', 5);
      });

      it('does not show individual operations in content area', () => {
        // Operations cards should not appear in the main content
        cy.get('.article--content .api-operation-card').should('not.exist');
      });

      it('has All endpoints link in navigation', () => {
        cy.get('.sidebar a').contains('All endpoints').should('exist');
      });
    });
  });
});

/**
 * All Endpoints Page Tests
 * Tests the "All endpoints" page shows all operations
 */
describe('All endpoints page', () => {
  const allEndpointsPages = [
    '/influxdb3/core/api/all-endpoints/',
    '/influxdb3/enterprise/api/all-endpoints/',
  ];

  allEndpointsPages.forEach((page) => {
    describe(`All endpoints ${page}`, () => {
      beforeEach(() => {
        cy.intercept('GET', '**', (req) => {
          req.continue((res) => {
            if (res.headers['content-type']?.includes('text/html')) {
              res.body = res.body.replace(
                /data-user-analytics-fingerprint-enabled="true"/,
                'data-user-analytics-fingerprint-enabled="false"'
              );
            }
          });
        });
        cy.visit(page);
      });

      it('displays page title "All endpoints"', () => {
        cy.get('h1').should('contain', 'All endpoints');
      });

      it('shows v3 API section', () => {
        cy.get('#v3-api').should('exist');
      });

      it('displays operation cards', () => {
        cy.get('.api-operation-card').should('have.length.at.least', 10);
      });

      it('operation cards have method badges', () => {
        cy.get('.api-operation-card .api-method').should(
          'have.length.at.least',
          10
        );
      });

      it('operation cards have path codes', () => {
        cy.get('.api-operation-card .api-path').should(
          'have.length.at.least',
          10
        );
      });

      it('operation cards link to tag pages with method anchors', () => {
        cy.get('.api-operation-card')
          .first()
          .should('have.attr', 'href')
          .and('match', /\/api\/.*\/#(get|post|put|patch|delete)-/i);
      });

      it('is accessible from navigation', () => {
        // Navigate back to section page
        cy.get('.sidebar a').contains('InfluxDB HTTP API').click();
        // Then navigate to All endpoints
        cy.get('.sidebar a').contains('All endpoints').click();
        cy.url().should('include', '/all-endpoints/');
      });
    });
  });
});
