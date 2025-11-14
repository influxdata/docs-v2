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

  describe('Format Selector - Leaf Nodes (Single Pages)', () => {
    beforeEach(() => {
      cy.visit(LEAF_PAGE_URL);
    });

    it('should display format selector button on page', () => {
      cy.get('[data-component="format-selector"]').should('exist').should('be.visible');
    });

    it('should show "Copy page" label for leaf nodes', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .should('contain', 'Copy page');
    });

    it('should open dropdown menu when clicked', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-component="format-selector"]')
        .find('[data-dropdown-menu]')
        .should('be.visible');
    });

    it('should display "Copy page" option in dropdown', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option="copy-page"]')
        .should('exist')
        .should('contain', 'Copy page')
        .should('contain', 'Copy page as Markdown for LLMs');
    });

    it('should display "Open in ChatGPT" option', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option="open-chatgpt"]')
        .should('exist')
        .should('contain', 'Open in ChatGPT')
        .should('contain', 'Ask questions about this page');
    });

    it('should display "Open in Claude" option', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option="open-claude"]')
        .should('exist')
        .should('contain', 'Open in Claude')
        .should('contain', 'Ask questions about this page');
    });

    it('should show external link indicator (↗) for AI integration options', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="open-chatgpt"]').should('contain', '↗');
      cy.get('[data-option="open-claude"]').should('contain', '↗');
    });

    it('should copy Markdown content to clipboard when "Copy page" is clicked', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="copy-page"]').click();

      // Verify clipboard contains Markdown content
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.include('---'); // YAML frontmatter delimiter
          expect(text).to.include('# '); // Markdown heading
          expect(text).to.match(/Product:/); // Product context
        });
      });
    });

    it('should navigate to .md URL when markdown link is available', () => {
      // Get current page URL and construct .md version
      cy.url().then((url) => {
        const markdownUrl = url.replace(/\/$/, '') + '.md';

        // Visit the markdown version directly
        cy.visit(markdownUrl);

        // Verify we get Markdown content
        cy.get('body').should('contain', '---'); // Frontmatter
        cy.get('body').invoke('text').should('match', /^---\n/); // Starts with frontmatter
      });
    });
  });

  describe('Format Selector - Branch Nodes (Small Sections)', () => {
    beforeEach(() => {
      cy.visit(SMALL_SECTION_URL);
    });

    it('should show "Copy section" label for branch nodes', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .should('contain', 'Copy section');
    });

    it('should display "Copy section" option with page count', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option="copy-section"]')
        .should('exist')
        .should('contain', 'Copy section')
        .should('contain', 'Copy all')
        .should('contain', 'pages'); // "Copy all X pages in this section as Markdown"
    });

    it('should copy aggregated section content with delimiters', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="copy-section"]').click();

      // Verify clipboard contains aggregated Markdown with delimiters
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.include('---'); // Page delimiters
          expect(text).to.match(/# .+\n\n---\n\n## .+:/); // Section header + child pages
          expect(text).to.match(/Product:/); // Product context
        });
      });
    });

    it('should NOT show "Download section" option for small sections', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option="download-section"]')
        .should('not.exist');
    });
  });

  describe('Format Selector - Branch Nodes (Large Sections)', () => {
    beforeEach(() => {
      // Skip if large section doesn't exist
      cy.visit(LARGE_SECTION_URL, { failOnStatusCode: false });
    });

    it('should show "Download section" option for large sections (>10 pages)', () => {
      // First check if this is actually a large section
      cy.get('[data-component="format-selector"]').then(($selector) => {
        const childCount = $selector.data('child-count');

        if (childCount && childCount > 10) {
          cy.get('[data-component="format-selector"]')
            .find('button')
            .click();

          cy.get('[data-dropdown-menu]')
            .find('[data-option="download-section"]')
            .should('exist')
            .should('contain', 'Download section')
            .should('contain', '.zip');
        } else {
          cy.log('Skipping: This section has ≤10 pages');
        }
      });
    });

    it('should trigger ZIP download when "Download section" is clicked', () => {
      cy.get('[data-component="format-selector"]').then(($selector) => {
        const childCount = $selector.data('child-count');

        if (childCount && childCount > 10) {
          cy.get('[data-component="format-selector"]')
            .find('button')
            .click();

          // Stub the download to verify it's triggered
          cy.window().then((win) => {
            cy.stub(win, 'open').as('downloadStub');
          });

          cy.get('[data-option="download-section"]').click();
          cy.get('@downloadStub').should('be.called');
        } else {
          cy.log('Skipping: This section has ≤10 pages');
        }
      });
    });
  });

  describe('Content Negotiation', () => {
    it('should return Markdown when Accept: text/markdown header is sent', () => {
      cy.request({
        url: LEAF_PAGE_URL,
        headers: {
          'Accept': 'text/markdown'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('text/markdown');
        expect(response.body).to.include('---'); // Frontmatter
        expect(response.body).to.match(/Product:/); // Product context
      });
    });

    it('should return HTML when Accept: text/html header is sent', () => {
      cy.request({
        url: LEAF_PAGE_URL,
        headers: {
          'Accept': 'text/html'
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('text/html');
        expect(response.body).to.include('<!DOCTYPE html>');
      });
    });
  });

  describe('Product Context in Markdown', () => {
    it('should include product name and version in Markdown output', () => {
      const markdownUrl = LEAF_PAGE_URL.replace(/\/$/, '') + '.md';

      cy.request(markdownUrl).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.match(/Product: InfluxDB/);
        expect(response.body).to.match(/\*\*Product:\*\*/); // Bold product label
        expect(response.body).to.include('Last Updated:');
        expect(response.body).to.include('URL:');
      });
    });

    it('should include product description in Markdown output', () => {
      const markdownUrl = LEAF_PAGE_URL.replace(/\/$/, '') + '.md';

      cy.request(markdownUrl).then((response) => {
        expect(response.body).to.match(/> .+/); // Blockquote with description
      });
    });
  });

  describe('AI Integration Links', () => {
    it('should generate ChatGPT share URL with page context', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="open-chatgpt"]')
        .should('have.attr', 'href')
        .and('include', 'chatgpt.com');
    });

    it('should generate Claude share URL with page context', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="open-claude"]')
        .should('have.attr', 'href')
        .and('include', 'claude.ai');
    });

    it('should open AI integration links in new tab', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="open-chatgpt"]')
        .should('have.attr', 'target', '_blank');

      cy.get('[data-option="open-claude"]')
        .should('have.attr', 'target', '_blank');
    });
  });

  describe('Visual Design', () => {
    it('should display dropdown with dark theme styling', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .should('have.css', 'background-color')
        .and('match', /rgb\(.*\)/); // Some dark color
    });

    it('should show icons for each option', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-dropdown-menu]')
        .find('[data-option]')
        .each(($option) => {
          cy.wrap($option).find('[data-icon]').should('exist');
        });
    });

    it('should highlight option on hover', () => {
      cy.get('[data-component="format-selector"]')
        .find('button')
        .click();

      cy.get('[data-option="copy-page"]')
        .trigger('mouseover')
        .should('have.css', 'background-color')
        .and('not.eq', 'rgba(0, 0, 0, 0)'); // Has some background
    });
  });
});
