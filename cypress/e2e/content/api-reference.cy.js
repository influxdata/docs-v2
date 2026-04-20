/// <reference types="cypress" />

/**
 * API Reference E2E Tests
 *
 * Validates Hugo-native API reference rendering:
 * - Sidebar navigation
 * - Format selector ("Copy page/section for AI")
 * - OpenAPI spec download buttons
 * - In-page TOC with operation links
 * - Operations, code samples, and related links
 *
 * Coverage: 1 tag page + 1 conceptual page per product.
 *
 * Run:
 *   node cypress/support/run-e2e-specs.js \
 *     --spec "cypress/e2e/content/api-reference.cy.js" \
 *     content/influxdb3/core/reference/api/_index.md
 */

const SENTINEL = 'content/influxdb3/core/api/write-data/_index.md';
const FORMAT_BTN =
  '.api-header-actions [data-component="format-selector"] .format-selector__button';

before(() => {
  cy.task('readFile', SENTINEL).then((content) => {
    if (content) return;

    cy.log('Generating API content from OpenAPI specs...');
    cy.exec('node api-docs/scripts/dist/post-process-specs.js', {
      timeout: 30000,
    });
    cy.exec(
      'node api-docs/scripts/dist/generate-openapi-articles.js --skip-fetch',
      { timeout: 120000 }
    );
    cy.request({
      url: '/influxdb3/core/api/write-data/',
      retryOnStatusCodeFailure: true,
      timeout: 60000,
    });
  });
});

// Single-spec products: flat tag list in sidebar
const products = [
  {
    name: 'Core',
    base: '/influxdb3/core/api',
    dataPath: 'data/article_data/influxdb3/core/api/articles.yml',
  },
  {
    name: 'Enterprise',
    base: '/influxdb3/enterprise/api',
    dataPath: 'data/article_data/influxdb3/enterprise/api/articles.yml',
  },
  {
    name: 'Cloud Serverless',
    base: '/influxdb3/cloud-serverless/api',
    dataPath: 'data/article_data/influxdb3/cloud-serverless/api/articles.yml',
  },
  {
    name: 'Cloud',
    base: '/influxdb/cloud/api',
    dataPath: 'data/article_data/influxdb/cloud/api/articles.yml',
  },
  {
    name: 'v2',
    base: '/influxdb/v2/api',
    dataPath: 'data/article_data/influxdb/v2/api/articles.yml',
  },
];

// Multi-spec products: nested Data API / Management API sub-sections
const multiSpecProducts = [
  {
    name: 'Cloud Dedicated',
    base: '/influxdb3/cloud-dedicated/api',
    specs: [
      {
        slug: 'data-api',
        label: 'Data API',
        dataPath:
          'data/article_data/influxdb3/cloud-dedicated/data-api/articles.yml',
      },
      {
        slug: 'management-api',
        label: 'Management API',
        dataPath:
          'data/article_data/influxdb3/cloud-dedicated/management-api/articles.yml',
      },
    ],
  },
  {
    name: 'Clustered',
    base: '/influxdb3/clustered/api',
    specs: [
      {
        slug: 'data-api',
        label: 'Data API',
        dataPath:
          'data/article_data/influxdb3/clustered/data-api/articles.yml',
      },
      {
        slug: 'management-api',
        label: 'Management API',
        dataPath:
          'data/article_data/influxdb3/clustered/management-api/articles.yml',
      },
    ],
  },
];

// ── Sidebar nav ──────────────────────────────────────────────────────

describe('API sidebar navigation', () => {
  products.forEach(({ name, base, dataPath }) => {
    it(`${name}: sidebar contains every tag from articles.yml and All endpoints`, () => {
      cy.task('readArticleData', dataPath).then((tags) => {
        expect(tags, `article data loaded from ${dataPath}`).to.be.an('array').and.have.length.at.least(1);

        cy.visit(`${base}/`);

        // Locate the children list nested under the API section link
        cy.get('#nav-tree a')
          .filter(`[href="${base}/"]`)
          .parents('li')
          .first()
          .find('ul.children')
          .as('apiNav');

        // Every tag in the data file must appear as a nav link
        tags.forEach((tag) => {
          cy.get('@apiNav')
            .find('li.nav-item a')
            .then(($links) => {
              const texts = [...$links].map((el) => el.textContent.trim());
              expect(texts, `sidebar is missing tag "${tag}"`).to.include(tag);
            });
        });

        // "All endpoints" must be the last nav item
        cy.get('@apiNav')
          .find('li.nav-item a')
          .last()
          .should('contain', 'All endpoints')
          .and('have.attr', 'href', `${base}/all-endpoints/`);
      });
    });
  });
});

// ── Multi-spec sidebar nav ────────────────────────────────────────────

describe('API sidebar navigation (multi-spec)', () => {
  multiSpecProducts.forEach(({ name, base, specs }) => {
    it(`${name}: sidebar shows nested sub-sections for each spec`, () => {
      cy.visit(`${base}/`);

      // Locate the children list nested under the API section link
      cy.get('#nav-tree a')
        .filter(`[href="${base}/"]`)
        .parents('li')
        .first()
        .find('ul.children')
        .as('apiNav');

      specs.forEach(({ slug, label, dataPath }) => {
        cy.task('readArticleData', dataPath).then((tags) => {
          expect(
            tags,
            `article data loaded from ${dataPath}`
          )
            .to.be.an('array')
            .and.have.length.at.least(1);

          // Sub-section item for this spec must exist
          cy.get('@apiNav')
            .find(`li.nav-item`)
            .filter(`:contains("${label}")`)
            .as('specSection');

          cy.get('@specSection').should('exist');

          // Sub-section must have a children list with every tag
          cy.get('@specSection')
            .find('ul.children li.nav-item a')
            .then(($links) => {
              const texts = [...$links].map((el) => el.textContent.trim());
              tags.forEach((tag) => {
                expect(
                  texts,
                  `spec section "${label}" is missing tag "${tag}"`
                ).to.include(tag);
              });
            });

          // Each spec sub-section must have its own "All endpoints" link
          cy.get('@specSection')
            .find('ul.children li.nav-item a')
            .last()
            .should('contain', 'All endpoints')
            .and(
              'have.attr',
              'href',
              `${base}/${slug}/all-endpoints/`
            );
        });
      });
    });
  });
});

// ── Tag pages ────────────────────────────────────────────────────────

describe('API tag pages', () => {
  products.forEach(({ name, base }) => {
    it(`${name}: sidebar, format selector, download, TOC, operations`, () => {
      cy.visit(`${base}/write-data/`);

      // Sidebar link to product home
      cy.get('#nav-tree a')
        .first()
        .should('have.attr', 'href')
        .and('match', /^\/[^/]+\/[^/]+\/$/);

      // Format selector
      cy.get(FORMAT_BTN).should('contain', 'Copy page for AI');

      // Download button
      cy.get('.api-header-actions .api-spec-download')
        .should('have.attr', 'href')
        .and('match', /^\/openapi\/.+\.yml$/);
      cy.get('.api-header-actions .api-spec-download').should(
        'have.attr',
        'download'
      );

      // In-page TOC
      cy.get('.api-toc').should('exist');
      cy.get('.api-toc-link').should('have.length.at.least', 1);
      cy.get('.api-toc-link .api-method').should('have.length.at.least', 1);

      // Operations
      cy.get('.api-operation').should('have.length.at.least', 1);
      cy.get('.api-operation')
        .first()
        .within(() => {
          cy.get('.api-method').should('exist');
          cy.get('.api-path').should('exist');
        });

      // Code sample
      cy.get('.api-code-sample').should('have.length.at.least', 1);
      cy.get('.api-code-block code')
        .first()
        .invoke('text')
        .should('match', /curl/);

      // Related links
      cy.get('.related ul li a').should('have.length.at.least', 1);
    });
  });
});

// ── Conceptual pages (x-traitTag) ────────────────────────────────────

describe('API conceptual pages', () => {
  products.forEach(({ name, base, dataPath }) => {
    it(`${name}: all conceptual pages have content`, () => {
      cy.task('readConceptualTags', dataPath).then((conceptualPages) => {
        expect(
          conceptualPages,
          `conceptual pages loaded from ${dataPath}`
        )
          .to.be.an('array')
          .and.have.length.at.least(1);

        conceptualPages.forEach(({ tag, slug }) => {
          cy.visit(`${base}/${slug}/`);

          cy.get(FORMAT_BTN).should('contain', 'Copy page for AI');

          cy.get('.api-conceptual-content')
            .should('exist')
            .invoke('text')
            .then((text) => {
              expect(
                text.trim().length,
                `"${tag}" conceptual page must have at least 50 characters of content`
              ).to.be.at.least(50);
            });
        });
      });
    });
  });

  multiSpecProducts.forEach(({ name, base, specs }) => {
    it(`${name}: all conceptual pages have content`, () => {
      specs.forEach(({ slug: specSlug, label, dataPath }) => {
        cy.task('readConceptualTags', dataPath).then((conceptualPages) => {
          expect(
            conceptualPages,
            `conceptual pages loaded from ${dataPath}`
          )
            .to.be.an('array')
            .and.have.length.at.least(1);

          conceptualPages.forEach(({ tag, slug }) => {
            cy.visit(`${base}/${specSlug}/${slug}/`);

            cy.get(FORMAT_BTN).should('contain', 'Copy page for AI');

            cy.get('.api-conceptual-content')
              .should('exist')
              .invoke('text')
              .then((text) => {
                expect(
                  text.trim().length,
                  `"${tag}" (${label}) conceptual page must have at least 50 characters of content`
                ).to.be.at.least(50);
              });
          });
        });
      });
    });
  });
});

// ── Section index pages: format selector, download, children ─────────

describe('API section pages', () => {
  products.forEach(({ name, base }) => {
    it(`${name}: format selector, download, and children`, () => {
      cy.visit(`${base}/`);

      // Format selector with section label
      cy.get(FORMAT_BTN).should('contain', 'Copy section for AI');

      // Download button (from specDownloadPath frontmatter)
      cy.get('.api-header-actions .api-spec-download')
        .should('have.attr', 'href')
        .and('match', /^\/openapi\/.+\.yml$/);

      // Tag pages listed as children
      cy.get('.children-links h3 a').should('have.length.at.least', 3);
    });
  });
});

// ── Operation ordering (native first, body matches TOC) ─────────────

/**
 * Assert that the body-rendered operations and the on-this-page TOC
 * list the same operationIds in the same sequence.
 */
function assertBodyAndTocOrderMatch() {
  cy.get('.api-operation[data-operation-id]').then(($ops) => {
    const bodyOrder = [...$ops].map((el) =>
      el.getAttribute('data-operation-id')
    );
    expect(bodyOrder.length, 'body has operations').to.be.greaterThan(0);

    cy.get('.api-toc .api-toc-link--operation').then(($tocLinks) => {
      const tocOrder = [...$tocLinks].map((el) =>
        (el.getAttribute('href') || '').replace('#operation/', '')
      );
      expect(tocOrder, 'TOC operationIds match body order').to.deep.equal(
        bodyOrder
      );
    });
  });
}

describe('API operation ordering', () => {
  it('Enterprise v1 Write: native /write before /api/v2/write', () => {
    cy.visit('/enterprise_influxdb/v1/api/write/');
    // Native unversioned path is first, v2-compat follows.
    cy.get('.api-operation[data-operation-id]')
      .then(($ops) => [...$ops].map((el) => el.getAttribute('data-operation-id')))
      .should('deep.equal', ['PostWrite', 'PostApiV2Write']);
    assertBodyAndTocOrderMatch();
  });

  it('Core Write: v3 native before v2-compat before v1-compat', () => {
    cy.visit('/influxdb3/core/api/write-data/');
    // /api/v3/write_lp (native), /api/v2/write (v2-compat), /write (v1-compat).
    cy.get('.api-operation[data-operation-id]')
      .then(($ops) => [...$ops].map((el) => el.getAttribute('data-operation-id')))
      .should('deep.equal', ['PostWriteLP', 'PostV2Write', 'PostV1Write']);
    assertBodyAndTocOrderMatch();
  });
});

// ── All endpoints page ───────────────────────────────────────────────

describe('All endpoints page', () => {
  it('Core: format selector, download, and operation cards', () => {
    cy.visit('/influxdb3/core/api/all-endpoints/');

    // Format selector
    cy.get('.api-header-actions [data-component="format-selector"]').should(
      'exist'
    );

    // Download button (inherited from parent section)
    cy.get('.api-header-actions .api-spec-download')
      .should('have.attr', 'href')
      .and('match', /^\/openapi\/.+\.yml$/);

    // Operation cards
    cy.get('.api-operation-card').should('have.length.at.least', 3);
    cy.get('.api-operation-card')
      .first()
      .should('have.attr', 'href')
      .and('match', /\/api\/.*\/#operation\//);
  });
});

// ── Legacy URL redirects ─────────────────────────────────────────────
// Covers URLs that 404'd on production before Hugo aliases were added
// via api-docs/<product>/content/page.yml. See
// docs/superpowers/specs/2026-04-20-broken-api-link-redirects-design.md.

describe('Legacy API URL redirects', () => {
  const redirects = [
    // /reference/api/ stubs (5 products)
    ['/influxdb3/cloud-dedicated/reference/api/',  '/influxdb3/cloud-dedicated/api/'],
    ['/influxdb3/cloud-serverless/reference/api/', '/influxdb3/cloud-serverless/api/'],
    ['/influxdb3/clustered/reference/api/',        '/influxdb3/clustered/api/'],
    ['/influxdb/v2/reference/api/',                '/influxdb/v2/api/'],
    ['/influxdb/cloud/reference/api/',             '/influxdb/cloud/api/'],
    // Redoc-era /api/vN/ URLs (8 URLs across 7 products)
    ['/influxdb3/core/api/v3/',                    '/influxdb3/core/api/'],
    ['/influxdb3/enterprise/api/v3/',              '/influxdb3/enterprise/api/'],
    ['/influxdb3/cloud-dedicated/api/v2/',         '/influxdb3/cloud-dedicated/api/'],
    ['/influxdb3/cloud-serverless/api/v2/',        '/influxdb3/cloud-serverless/api/'],
    ['/influxdb3/clustered/api/v2/',               '/influxdb3/clustered/api/'],
    ['/influxdb/v2/api/v2/',                       '/influxdb/v2/api/'],
    ['/influxdb/v2/api/v1/',                       '/influxdb/v2/api/'],
    ['/influxdb/cloud/api/v2/',                    '/influxdb/cloud/api/'],
  ];

  redirects.forEach(([from, to]) => {
    it(`${from} → ${to}`, () => {
      cy.visit(from);
      // Hugo aliases return HTML with <meta http-equiv="refresh" content="0; url=..."/>.
      // Cypress's cy.visit waits for page-load events including the refresh,
      // so cy.location after the visit reflects the final URL. Use .should (retry)
      // to give the meta-refresh time to fire.
      cy.location('pathname', { timeout: 10000 }).should('eq', to);
    });
  });
});
