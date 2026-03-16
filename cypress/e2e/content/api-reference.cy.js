/// <reference types="cypress" />

/**
 * API Reference Documentation E2E Tests
 *
 * Tests:
 * 1. API reference pages (link validation, content structure)
 * 2. 3-column layout with TOC (for InfluxDB 3 Core/Enterprise)
 * 3. Hugo-native tag page rendering
 * 4. Related links from OpenAPI x-related → frontmatter → rendered HTML
 *
 * Prerequisites:
 * - Hugo server running (started automatically by the test runner)
 * - API docs generated (auto-generated if missing)
 *
 * Run with:
 * node cypress/support/run-e2e-specs.js --spec "cypress/e2e/content/api-reference.cy.js" content/influxdb3/core/reference/api/_index.md
 */

// Sentinel file: if this exists, API docs have been generated.
const SENTINEL = 'content/influxdb3/core/api/write-data/_index.md';

before(() => {
  cy.task('readFile', SENTINEL).then((content) => {
    if (content) return; // Already generated

    cy.log('**API content not found — generating from OpenAPI specs…**');

    // Step 1: post-process specs (apply tag configs + overlays → _build/)
    cy.exec('node api-docs/scripts/dist/post-process-specs.js', {
      timeout: 30000,
    });

    // Step 2: generate Hugo content pages + article data
    cy.exec(
      'node api-docs/scripts/dist/generate-openapi-articles.js --skip-fetch',
      { timeout: 120000 }
    );

    // Wait for Hugo to rebuild after new files appear
    cy.request({ url: '/influxdb3/core/api/write-data/', retryOnStatusCodeFailure: true, timeout: 60000 });
  });
});

describe('API reference content', () => {
  // API section index pages (generated from article data)
  const subjects = [
    '/influxdb3/core/api/',
    '/influxdb3/enterprise/api/',
    '/influxdb3/cloud-dedicated/api/',
    '/influxdb3/cloud-serverless/api/',
    '/influxdb3/clustered/api/',
    '/influxdb/cloud/api/',
    '/influxdb/v2/api/',
  ];

  subjects.forEach((subject) => {
    describe(subject, () => {
      beforeEach(() => {
        cy.visit(subject, { timeout: 30000 });
      });
      it(`has API info`, function () {
        cy.get('h1').first().should('have.length', 1);
        // Check for description element (either article--description class or data-role attribute)
        cy.get('.article--description, [data-role$=description]').should(
          'have.length.at.least',
          1
        );
      });
      it('has a sidebar link to the product home', function () {
        // The nav tree contains a link to the product root page
        cy.get('#nav-tree a')
          .first()
          .should('have.attr', 'href')
          .and('match', /^\/[^/]+\/[^/]+\/$/);
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

      it('operation cards link to tag pages with operation anchors', () => {
        cy.get('.api-operation-card')
          .first()
          .should('have.attr', 'href')
          .and('match', /\/api\/.*\/#operation\//);
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

/**
 * API Download Button Tests
 * Tests that each tag page has a download button linking to the correct spec
 */
describe('API spec download buttons', () => {
  const downloadTests = [
    {
      page: '/influxdb3/core/api/write-data/',
      specPath: '/openapi/influxdb3-core.yml',
    },
    {
      page: '/influxdb3/enterprise/api/write-data/',
      specPath: '/openapi/influxdb3-enterprise.yml',
    },
  ];

  downloadTests.forEach(({ page, specPath }) => {
    describe(`Download button on ${page}`, () => {
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

      it('has a download button', () => {
        cy.get('.api-spec-download').should('exist');
      });

      it(`download button links to ${specPath}`, () => {
        cy.get('.api-spec-download')
          .should('have.attr', 'href', specPath)
          .and('have.attr', 'download');
      });
    });
  });
});

/**
 * API Code Sample Tests
 * Tests that inline curl examples render correctly on tag pages
 */
describe('API code samples', () => {
  const tagPages = [
    '/influxdb3/core/api/write-data/',
    '/influxdb3/enterprise/api/write-data/',
  ];

  tagPages.forEach((page) => {
    describe(`Code samples on ${page}`, () => {
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

      it('each operation has a code sample', () => {
        cy.get('.api-operation').each(($op) => {
          cy.wrap($op).find('.api-code-sample').should('have.length', 1);
        });
      });

      it('code samples have header and code block', () => {
        cy.get('.api-code-sample')
          .first()
          .within(() => {
            cy.get('.api-code-sample-header').should(
              'contain',
              'Example request'
            );
            cy.get('.api-code-block code').should('exist');
          });
      });

      it('code block contains a curl command', () => {
        cy.get('.api-code-block code')
          .first()
          .invoke('text')
          .should('match', /curl --request (GET|POST|PUT|PATCH|DELETE)/);
      });

      it('curl command includes Authorization header', () => {
        cy.get('.api-code-block code')
          .first()
          .invoke('text')
          .should('include', 'Authorization: Bearer INFLUX_TOKEN');
      });

      it('POST operations include request body in curl', () => {
        cy.get('.api-operation[data-method="post"]')
          .first()
          .find('.api-code-block code')
          .invoke('text')
          .should('include', '--data-raw');
      });

      it('code samples have Ask AI links', () => {
        cy.get('.api-code-sample .api-code-ask-ai')
          .first()
          .should('have.attr', 'data-query')
          .and('not.be.empty');
      });
    });
  });
});

/**
 * API Client Library Related Link Tests
 * Tests that InfluxDB 3 tag pages include client library related links
 */
describe('API client library related links', () => {
  const influxdb3Pages = [
    '/influxdb3/core/api/write-data/',
    '/influxdb3/enterprise/api/write-data/',
  ];

  influxdb3Pages.forEach((page) => {
    describe(`Client library link on ${page}`, () => {
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

      it('includes InfluxDB 3 API client libraries in related links', () => {
        cy.get('.related ul li a')
          .filter(':contains("InfluxDB 3 API client libraries")')
          .should('have.length', 1)
          .and('have.attr', 'href')
          .and('match', /\/influxdb3\/\w+\/reference\/client-libraries\/v3\//);
      });
    });
  });
});

/**
 * API Related Links Tests
 * Tests that x-related from OpenAPI specs renders as related links on tag pages
 */
describe('API related links', () => {
  const pagesWithRelated = ['/influxdb3/core/api/write-data/'];

  pagesWithRelated.forEach((page) => {
    describe(`Related links on ${page}`, () => {
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

      it('displays a related section', () => {
        cy.get('.related').should('exist');
        cy.get('.related h4#related').should('contain', 'Related');
      });

      it('renders related links from x-related as anchor elements', () => {
        cy.get('.related ul li a').should('have.length.at.least', 2);
      });

      it('related links have title text and valid href', () => {
        cy.get('.related ul li a').each(($a) => {
          // Each link has non-empty text
          cy.wrap($a).invoke('text').should('not.be.empty');
          // Each link has an href starting with /
          cy.wrap($a).should('have.attr', 'href').and('match', /^\//);
        });
      });

      it('related links resolve to valid pages', () => {
        cy.get('.related ul li a').each(($a) => {
          const href = $a.attr('href');
          cy.request(href).its('status').should('eq', 200);
        });
      });
    });
  });
});
