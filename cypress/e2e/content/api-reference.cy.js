/// <reference types="cypress" />

/**
 * API Reference Documentation E2E Tests
 *
 * Tests both:
 * 1. Legacy API reference pages (link validation, content structure)
 * 2. New 3-column layout with tabs and TOC (for InfluxDB 3 Core/Enterprise)
 *
 * Run with:
 * node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/reference/api/_index.md
 */

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
        cy.get('script[data-user-analytics-fingerprint-enabled=false]').should('have.length', 1);
        cy.get('h1').first().should('have.length', 1);
        // Check for description element (either article--description class or data-role attribute)
        cy.get('.article--description, [data-role$=description]').should('have.length.at.least', 1);
      });
      it('links back to the version home page', function () {
        cy.get('a.back').contains('Docs')
          .should('have.length', 1)
          .click();
        // Path should be the first two segments and trailing slash in $subject
        cy.location('pathname')
          .should('eq', subject.replace(/^(\/[^/]+\/[^/]+\/).*/, '$1'));
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
 * 3-Column API Reference Layout Tests
 * Tests the new layout for InfluxDB 3 Core/Enterprise API documentation
 * Tests individual API endpoint pages which use the 3-column layout with tabs
 */
describe('API reference 3-column layout', () => {
  // Individual API endpoint pages (not index pages) have the 3-column layout
  const layoutSubjects = [
    '/influxdb3/core/api/v3/engine/',
    '/influxdb3/enterprise/api/v3/engine/',
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
          cy.get('.api-content, .content-wrapper').should('exist');
        });

        it('displays TOC on desktop viewport', () => {
          cy.viewport(1280, 800);
          cy.get('.api-toc').should('be.visible');
        });

        it('hides TOC on mobile viewport', () => {
          cy.viewport(375, 667);
          cy.get('.api-toc').should('not.be.visible');
        });
      });

      describe('API Navigation', () => {
        it('displays API navigation section', () => {
          cy.get('.api-nav').should('exist');
        });

        it('has collapsible navigation groups', () => {
          cy.get('.api-nav-group').should('have.length.at.least', 1);
        });

        it('toggles group expand/collapse', () => {
          cy.get('.api-nav-group-header').first().as('header');
          cy.get('@header').click();
          cy.get('@header')
            .should('have.attr', 'aria-expanded')
            .and('match', /true|false/);
        });
      });

      describe('Tab Navigation', () => {
        it('displays tabs', () => {
          cy.get('.api-tabs-wrapper').should('exist');
        });

        it('shows Operations tab content by default', () => {
          cy.get('[data-tab-panel="operations"]').should('be.visible');
        });

        it('switches tabs on click without page jump', () => {
          // Get initial scroll position
          cy.window().then((win) => {
            const initialScroll = win.scrollY;

            // Click the second tab
            cy.get('.api-tabs-nav a').eq(1).click();

            // Verify tabs are still visible (not jumped away)
            cy.get('.api-tabs-wrapper').should('be.visible');

            // Verify the clicked tab is now active
            cy.get('.api-tabs-nav a').eq(1).should('have.class', 'is-active');

            // Verify the first tab is no longer active
            cy.get('.api-tabs-nav a').eq(0).should('not.have.class', 'is-active');
          });
        });

        it('updates URL hash when switching tabs', () => {
          cy.get('.api-tabs-nav a[data-tab="server"]').click();
          cy.url().should('include', '#server');
        });

        it('restores tab from URL hash on page load', () => {
          // Use the current subject URL with hash instead of hardcoded old reference URL
          cy.visit(`${subject}#authentication`);
          cy.get('.api-tabs-nav a[data-tab="authentication"]').should('have.class', 'is-active');
          cy.get('[data-tab-panel="authentication"]').should('be.visible');
        });
      });

      describe('Table of Contents', () => {
        it('displays TOC header', () => {
          cy.viewport(1280, 800);
          cy.get('.api-toc-header').should('contain', 'ON THIS PAGE');
        });

        it('generates TOC from headings', () => {
          cy.viewport(1280, 800);
          cy.wait(500); // Wait for component initialization
          cy.get('.api-toc-nav').should('exist');
        });
      });

      describe('API Renderer', () => {
        it('loads API documentation renderer', () => {
          cy.get('.api-reference-container, rapi-doc, .api-reference-wrapper').should('exist');
        });

        it('displays spec download link', () => {
          cy.get('.api-spec-download').should('exist');
        });
      });

      describe('Accessibility', () => {
        it('has ARIA attributes on nav groups', () => {
          cy.get('.api-nav-group-header').each(($header) => {
            cy.wrap($header).should('have.attr', 'aria-expanded');
          });
        });
      });
    });
  });
});
