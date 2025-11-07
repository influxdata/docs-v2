/**
 * E2E tests for LLM-friendly format selector component
 * These tests validate the format selector dropdown for both leaf nodes (single pages)
 * and branch nodes (sections with children).
 */

describe('LLM Format Selector', () => {
  // Test configuration
  const LEAF_PAGE_URL = '/influxdb3/core/get-started/setup/';
  const SMALL_SECTION_URL = '/influxdb3/core/get-started/'; // Section with ≤10 pages
  const LARGE_SECTION_URL = '/influxdb3/core/query-data/'; // Section with >10 pages (if exists)

  /**
   * Setup: Generate markdown files for test paths
   * This runs once before all tests in this suite
   */
  before(() => {
    cy.log('Generating markdown files for test paths...');

    // Generate markdown for get-started section (small section + leaf page)
    cy.exec(
      'node scripts/html-to-markdown.js --path influxdb3/core/get-started',
      {
        failOnNonZeroExit: false,
        timeout: 60000,
      }
    ).then((result) => {
      if (result.code !== 0) {
        cy.log(
          'Warning: get-started markdown generation had issues:',
          result.stderr
        );
      }
    });

    // Generate markdown for query-data section (large section)
    cy.exec(
      'node scripts/html-to-markdown.js --path influxdb3/core/query-data --limit 15',
      {
        failOnNonZeroExit: false,
        timeout: 60000,
      }
    ).then((result) => {
      if (result.code !== 0) {
        cy.log(
          'Warning: query-data markdown generation had issues:',
          result.stderr
        );
      }
      cy.log('Markdown files generated successfully');
    });
  });

  describe('Format Selector - Leaf Nodes (Single Pages)', () => {
    beforeEach(() => {
      cy.visit(LEAF_PAGE_URL);

      // Wait for component initialization
      cy.window().should((win) => {
        expect(win.influxdatadocs).to.exist;
        expect(win.influxdatadocs.instances).to.exist;
        expect(win.influxdatadocs.instances['format-selector']).to.exist;
      });
    });

    it('should display format selector button with correct label', () => {
      cy.get('[data-component="format-selector"]')
        .should('exist')
        .should('be.visible');

      cy.get(
        '[data-component="format-selector"] .format-selector__button'
      ).should('contain', 'Copy page');
    });

    describe('Dropdown functionality', () => {
      beforeEach(() => {
        // Open dropdown once for all tests in this block
        cy.get(
          '[data-component="format-selector"] .format-selector__button'
        ).trigger('click');

        // Wait for dropdown animation (0.2s transition + small buffer)
        cy.wait(300);

        // Verify dropdown is open
        cy.get('[data-dropdown-menu].is-open')
          .should('exist')
          .should('be.visible');
      });

      it('should display dropdown menu with all options', () => {
        // Check that dropdown has options
        cy.get('[data-dropdown-menu].is-open [data-option]').should(
          'have.length.at.least',
          3
        ); // copy-page, open-chatgpt, open-claude
      });

      it('should display "Copy page" option', () => {
        cy.get('[data-dropdown-menu].is-open [data-option="copy-page"]')
          .should('be.visible')
          .should('contain', 'Copy page')
          .should('contain', 'Copy page as Markdown for LLMs');
      });

      it('should display "Download page" option', () => {
        cy.get('[data-dropdown-menu].is-open [data-option="download-page"]')
          .should('be.visible')
          .should('contain', 'Download page')
          .should('contain', 'Download page as Markdown file');
      });

      it('should display "Open in ChatGPT" option with external link indicator', () => {
        cy.get('[data-dropdown-menu].is-open [data-option="open-chatgpt"]')
          .should('be.visible')
          .should('contain', 'Open in ChatGPT')
          .should('contain', 'Ask questions about this page')
          .should('contain', '↗')
          .should('have.attr', 'href')
          .and('include', 'chatgpt.com');
      });

      it('should display "Open in Claude" option with external link indicator', () => {
        cy.get('[data-dropdown-menu].is-open [data-option="open-claude"]')
          .should('be.visible')
          .should('contain', 'Open in Claude')
          .should('contain', 'Ask questions about this page')
          .should('contain', '↗')
          .should('have.attr', 'href')
          .and('include', 'claude.ai');
      });

      it('should display icons for each option', () => {
        cy.get('[data-dropdown-menu].is-open [data-option]').each(($option) => {
          cy.wrap($option).find('.format-selector__icon').should('exist');
        });
      });

      it('should open AI integration links in new tab', () => {
        cy.get(
          '[data-dropdown-menu].is-open [data-option="open-chatgpt"]'
        ).should('have.attr', 'target', '_blank');

        cy.get(
          '[data-dropdown-menu].is-open [data-option="open-claude"]'
        ).should('have.attr', 'target', '_blank');
      });
    });
  });

  describe('Format Selector - Branch Nodes (Small Sections)', () => {
    beforeEach(() => {
      cy.visit(SMALL_SECTION_URL);

      // Wait for component initialization
      cy.window().should((win) => {
        expect(win.influxdatadocs).to.exist;
        expect(win.influxdatadocs.instances).to.exist;
        expect(win.influxdatadocs.instances['format-selector']).to.exist;
      });
    });

    it('should show "Copy section" label for branch nodes', () => {
      cy.get(
        '[data-component="format-selector"] .format-selector__button'
      ).should('contain', 'Copy section');
    });

    describe('Dropdown functionality', () => {
      beforeEach(() => {
        // Open dropdown once for all tests in this block
        cy.get(
          '[data-component="format-selector"] .format-selector__button'
        ).trigger('click');

        // Wait for dropdown animation
        cy.wait(300);

        // Verify dropdown is open
        cy.get('[data-dropdown-menu].is-open')
          .should('exist')
          .should('be.visible');
      });

      it('should display "Copy section" option with page count', () => {
        cy.get('[data-dropdown-menu].is-open [data-option="copy-section"]')
          .should('be.visible')
          .should('contain', 'Copy section')
          .should('contain', 'Copy all')
          .should('contain', 'pages'); // "Copy all X pages in this section as Markdown"
      });

      it('should NOT show "Download section" option for small sections', () => {
        cy.get(
          '[data-dropdown-menu].is-open [data-option="download-section"]'
        ).should('not.exist');
      });

      it('should display ChatGPT and Claude options', () => {
        cy.get(
          '[data-dropdown-menu].is-open [data-option="open-chatgpt"]'
        ).should('be.visible');

        cy.get(
          '[data-dropdown-menu].is-open [data-option="open-claude"]'
        ).should('be.visible');
      });
    });
  });

  describe('Format Selector - Branch Nodes (Large Sections)', () => {
    beforeEach(() => {
      // Skip if large section doesn't exist
      cy.visit(LARGE_SECTION_URL, { failOnStatusCode: false });

      // Wait for component initialization if it exists
      cy.window().then((win) => {
        if (win.influxdatadocs && win.influxdatadocs.instances) {
          expect(win.influxdatadocs.instances['format-selector']).to.exist;
        }
      });
    });

    it('should show "Download section" option for large sections (>10 pages)', () => {
      // First check if this is actually a large section
      cy.get('[data-component="format-selector"]').then(($selector) => {
        const childCount = $selector.data('child-count');

        if (childCount && childCount > 10) {
          cy.get('[data-component="format-selector"] button').trigger('click');

          cy.wait(300);

          cy.get(
            '[data-dropdown-menu].is-open [data-option="download-section"]'
          )
            .should('be.visible')
            .should('contain', 'Download section')
            .should('contain', '.zip');
        } else {
          cy.log('Skipping: This section has ≤10 pages');
        }
      });
    });
  });

  describe('Markdown Content Quality', () => {
    it('should contain actual page content from HTML version', () => {
      // First, get the HTML version and extract some text
      cy.visit(LEAF_PAGE_URL);

      // Get the page title from h1
      cy.get('h1')
        .first()
        .invoke('text')
        .then((pageTitle) => {
          // Get some body content from the article
          cy.get('article')
            .first()
            .invoke('text')
            .then((articleText) => {
              // Extract a meaningful snippet (first 50 chars of article text, trimmed)
              const contentSnippet = articleText.trim().substring(0, 50).trim();

              // Now fetch the markdown version
              cy.request(LEAF_PAGE_URL + 'index.md').then((response) => {
                expect(response.status).to.eq(200);

                const markdown = response.body;

                // Basic structure checks
                expect(markdown).to.include('---'); // Frontmatter delimiter
                expect(markdown).to.match(/^#+ /m); // Has headings

                // Content from HTML should appear in markdown
                expect(markdown).to.include(pageTitle.trim());
                expect(markdown).to.include(contentSnippet);

                // Clean markdown (no raw HTML or Hugo syntax)
                expect(markdown).to.not.include('<!DOCTYPE html>');
                expect(markdown).to.not.include('<div');
                expect(markdown).to.not.match(/\{\{[<%]/); // No shortcodes
                expect(markdown).to.not.include('<!--'); // No HTML comments
                expect(markdown).to.not.match(/\{\{-?\s*end\s*-?\}\}/); // No {{end}}

                // Not empty
                expect(markdown.length).to.be.greaterThan(100);
              });
            });
        });
    });
  });
});
