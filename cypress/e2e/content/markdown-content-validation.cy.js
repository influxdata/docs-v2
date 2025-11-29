/**
 * E2E tests for Markdown content validation
 * Validates that generated Markdown files:
 * - Don't contain raw Hugo shortcodes
 * - Don't contain HTML comments
 * - Have proper frontmatter
 * - Have valid Markdown structure
 * - Contain expected content
 */

import {
  validateMarkdown,
  validateFrontmatter,
  validateTable,
  containsText,
  doesNotContainText,
} from '../../support/markdown-validator.js';

describe('Markdown Content Validation', () => {
  // Test URLs for different page types
  const LEAF_PAGE_URL = '/influxdb3/core/get-started/setup/';
  const SECTION_PAGE_URL = '/influxdb3/core/get-started/';
  const ENTERPRISE_INDEX_URL = '/influxdb3/enterprise/';

  /**
   * Setup: Generate markdown files for test paths
   * This runs once before all tests in this suite
   */
  before(() => {
    cy.log('Generating markdown files for test paths...');

    // Generate markdown for get-started section
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

    // Generate markdown for enterprise index page
    cy.exec(
      'node scripts/html-to-markdown.js --path influxdb3/enterprise --limit 1',
      {
        failOnNonZeroExit: false,
        timeout: 60000,
      }
    ).then((result) => {
      if (result.code !== 0) {
        cy.log(
          'Warning: enterprise markdown generation had issues:',
          result.stderr
        );
      }
      cy.log('Markdown files generated successfully');
    });
  });

  describe('Markdown Format - Basic Validation', () => {
    it('should return 200 status for markdown file requests', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should have correct content-type for markdown files', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Note: Hugo may serve as text/plain or text/markdown depending on config
        expect(response.headers['content-type']).to.match(
          /text\/(plain|markdown)/
        );
      });
    });

    it('should be accessible at URL/index.md', () => {
      // Hugo generates markdown as index.md in directory matching URL path
      // Note: llmstxt.org spec recommends /path/index.html.md, but we use
      // /path/index.md for cleaner URLs and Hugo compatibility
      cy.visit(`${LEAF_PAGE_URL}`);
      cy.url().then((htmlUrl) => {
        const markdownUrl = htmlUrl + 'index.md';
        cy.request(markdownUrl).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  describe('Frontmatter Validation', () => {
    it('should start with YAML frontmatter delimiters', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        expect(response.body).to.match(/^---\n/);
      });
    });

    it('should include required frontmatter fields', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        const frontmatterMatch = response.body.match(/^---\n([\s\S]*?)\n---/);
        expect(frontmatterMatch).to.not.be.null;

        const frontmatter = frontmatterMatch[1];
        expect(frontmatter).to.include('title:');
        expect(frontmatter).to.include('description:');
        expect(frontmatter).to.include('url:');
      });
    });

    it('should include product context in frontmatter', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        const frontmatterMatch = response.body.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch[1];

        expect(frontmatter).to.include('product:');
        expect(frontmatter).to.include('product_version:');
      });
    });

    it('should include date and lastmod fields', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        const frontmatterMatch = response.body.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch[1];

        expect(frontmatter).to.include('date:');
        expect(frontmatter).to.include('lastmod:');
      });
    });
  });

  describe('Shortcode Evaluation', () => {
    it('should NOT contain raw Hugo shortcodes with {{< >}}', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Check for common shortcode patterns
        expect(response.body).to.not.include('{{<');
        expect(response.body).to.not.include('>}}');
      });
    });

    it('should NOT contain raw Hugo shortcodes with {{% %}}', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        expect(response.body).to.not.include('{{%');
        expect(response.body).to.not.include('%}}');
      });
    });

    it('should have evaluated product-name shortcode', () => {
      cy.request(`${ENTERPRISE_INDEX_URL}index.md`).then((response) => {
        // Should contain "InfluxDB 3 Enterprise" not "{{< product-name >}}"
        expect(response.body).to.include('InfluxDB 3 Enterprise');
        expect(response.body).to.not.include('{{< product-name >}}');
      });
    });

    it('should have evaluated req shortcode for required markers', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should NOT contain raw {{< req >}} shortcode
        expect(response.body).to.not.include('{{< req >}}');
        expect(response.body).to.not.include('{{< req ');
      });
    });

    it('should have evaluated code-placeholder shortcode', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should NOT contain code-placeholder shortcodes
        expect(response.body).to.not.include('{{< code-placeholder');
        expect(response.body).to.not.include('{{% code-placeholder');
      });
    });
  });

  describe('Comment Removal', () => {
    it('should NOT contain HTML comments', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Check for HTML comment patterns
        expect(response.body).to.not.include('<!--');
        expect(response.body).to.not.include('-->');
      });
    });

    it('should NOT contain source file comments', () => {
      cy.request(`${ENTERPRISE_INDEX_URL}index.md`).then((response) => {
        // Check for the "SOURCE - content/shared/..." comments
        expect(response.body).to.not.include('SOURCE -');
        expect(response.body).to.not.include('//SOURCE');
        expect(response.body).to.not.include('content/shared/');
      });
    });

    it('should NOT contain editorial comments', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Common editorial comment patterns
        expect(response.body).to.not.match(/<!-- TODO:/i);
        expect(response.body).to.not.match(/<!-- NOTE:/i);
        expect(response.body).to.not.match(/<!-- FIXME:/i);
      });
    });
  });

  describe('UI Element Removal', () => {
    it('should NOT contain format selector button text', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should not contain UI button text from format selector
        expect(response.body).to.not.include('Copy page');
        expect(response.body).to.not.include('Copy section');
      });
    });

    it('should NOT contain page feedback form text', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        expect(response.body).to.not.include('Was this page helpful?');
        expect(response.body).to.not.include('Thank you for your feedback');
      });
    });

    it('should NOT contain navigation breadcrumbs', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should not contain navigation UI text
        expect(response.body).to.not.match(/Home\s*>\s*InfluxDB/);
      });
    });
  });

  describe('Content Quality', () => {
    it('should not have excessive consecutive newlines', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should not have more than 2 consecutive newlines (3+ \n in a row)
        expect(response.body).to.not.match(/\n\n\n+/);
      });
    });

    it('should have proper markdown headings', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should contain markdown headings (# or ##)
        expect(response.body).to.match(/^# /m);
      });
    });

    it('should have properly formatted code blocks', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Code blocks should use ``` fences
        const codeBlockMatches = response.body.match(/```/g);
        if (codeBlockMatches) {
          // Code blocks should come in pairs (opening and closing)
          expect(codeBlockMatches.length % 2).to.eq(0);
        }
      });
    });

    it('should preserve language identifiers in code blocks', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Look for common language identifiers after ```
        if (response.body.includes('```')) {
          expect(response.body).to.match(
            /```(?:bash|sh|python|js|go|sql|json|yaml)/
          );
        }
      });
    });

    it('should have properly formatted links', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Links should be in markdown format [text](url)
        const linkMatches = response.body.match(/\[.+?\]\(.+?\)/g);

        if (linkMatches) {
          // Each link should have both text and URL
          linkMatches.forEach((link) => {
            expect(link).to.match(/\[.+\]\(.+\)/);
          });
        }
      });
    });

    it('should NOT have broken link conversions (text without URLs)', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Links should NOT be plain text where there should be a link
        // This was a previous bug where links were stripped

        // If we see content that looks like it should be linked, verify it is
        if (response.body.includes('Telegraf')) {
          // Should have links to Telegraf, not just plain "Telegraf" everywhere
          expect(response.body).to.match(/\[.*Telegraf.*\]\(.*\/telegraf\//i);
        }
      });
    });
  });

  describe('Tab Delimiters', () => {
    const TAB_PAGE_URL = '/influxdb3/enterprise/write-data/client-libraries/';
    const CODE_TAB_PAGE_URL = '/influxdb3/core/query-data/execute-queries/influxdb3-cli/';

    before(() => {
      // Generate markdown for pages with tabs
      cy.exec(
        'node scripts/html-to-markdown.js --path influxdb3/enterprise/write-data/client-libraries --limit 1',
        {
          failOnNonZeroExit: false,
          timeout: 60000,
        }
      );

      cy.exec(
        'node scripts/html-to-markdown.js --path influxdb3/core/query-data/execute-queries/influxdb3-cli --limit 1',
        {
          failOnNonZeroExit: false,
          timeout: 60000,
        }
      );
    });

    it('should convert tabs-wrapper to heading delimiters', () => {
      cy.request(`${TAB_PAGE_URL}index.md`).then((response) => {
        // Should contain tab delimiter headings (e.g., #### Go ####)
        expect(response.body).to.match(/^#### \w+ ####$/m);

        // Should NOT contain raw tab link patterns
        expect(response.body).to.not.match(/\[Go\]\(#\)\[Node\.js\]\(#\)/);
        expect(response.body).to.not.match(/\[Python\]\(#\)\[Java\]\(#\)/);
      });
    });

    it('should convert code-tabs-wrapper to heading delimiters', () => {
      cy.request(`${CODE_TAB_PAGE_URL}index.md`).then((response) => {
        // Should contain tab delimiter headings for code tabs
        expect(response.body).to.match(/^#### \w+ ####$/m);

        // Should NOT contain raw code-tab link patterns
        expect(response.body).to.not.match(/\[string\]\(#\)\[file\]\(#\)/);
        expect(response.body).to.not.match(/\[SQL\]\(#\)\[InfluxQL\]\(#\)/);
      });
    });

    it('should preserve first tab name in delimiter heading', () => {
      cy.request(`${TAB_PAGE_URL}index.md`).then((response) => {
        // For tabs like [Go](#)[Node.js](#)[Python](#), should have #### Go ####
        if (response.body.includes('Go')) {
          expect(response.body).to.match(/^#### Go ####$/m);
        }
      });
    });

    it('should have delimiter headings followed by content', () => {
      cy.request(`${TAB_PAGE_URL}index.md`).then((response) => {
        // Tab delimiter headings should be followed by actual content
        const delimiterMatches = response.body.match(/^#### \w+ ####$/gm);

        if (delimiterMatches && delimiterMatches.length > 0) {
          // Each delimiter should be followed by content (not another delimiter immediately)
          delimiterMatches.forEach((delimiter) => {
            const delimiterIndex = response.body.indexOf(delimiter);
            const afterDelimiter = response.body.substring(delimiterIndex + delimiter.length, delimiterIndex + delimiter.length + 200);

            // Should have content after delimiter (not just another delimiter)
            expect(afterDelimiter.trim()).to.not.match(/^#### \w+ ####/);
          });
        }
      });
    });
  });

  describe('Section Pages - Child Content', () => {
    beforeEach(() => {
      // Note: Current implementation may not aggregate child pages
      // These tests document the expected behavior for future implementation
    });

    it('should be accessible at section URL with index.md', () => {
      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should have section page frontmatter', () => {
      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        expect(response.body).to.match(/^---\n/);
        expect(response.body).to.include('title:');
        expect(response.body).to.include('url:');
      });
    });

    it('should reference child pages in content', () => {
      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        // Section page should at least link to child pages
        expect(response.body).to.match(/\[.*Set up.*\]\(.*setup.*\)/i);
        expect(response.body).to.match(/\[.*Write.*\]\(.*write.*\)/i);
        expect(response.body).to.match(/\[.*Query.*\]\(.*query.*\)/i);
      });
    });

    // Future enhancement: section pages should include full child content
    it.skip('should include full content of child pages with delimiters', () => {
      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        // Should contain section header
        expect(response.body).to.include('# Get started with InfluxDB 3 Core');

        // Should contain child page delimiters
        expect(response.body).to.match(/---\n\n## .*:/);

        // Should contain content from child pages
        expect(response.body).to.include('Set up InfluxDB 3 Core');
        expect(response.body).to.include('Write data');
        expect(response.body).to.include('Query data');
      });
    });
  });

  describe('Multiple Product Validation', () => {
    const PRODUCTS = [
      { url: '/influxdb3/core/', name: 'InfluxDB 3 Core', version: 'core' },
      {
        url: '/influxdb3/enterprise/',
        name: 'InfluxDB 3 Enterprise',
        version: 'enterprise',
      },
    ];

    PRODUCTS.forEach((product) => {
      describe(`${product.name} (${product.version})`, () => {
        it('should have correct product metadata', () => {
          cy.request(`${product.url}index.md`).then((response) => {
            expect(response.body).to.include(`product: ${product.name}`);
            expect(response.body).to.include(
              `product_version: ${product.version}`
            );
          });
        });

        it('should not contain shortcodes', () => {
          cy.request(`${product.url}index.md`).then((response) => {
            expect(response.body).to.not.include('{{<');
            expect(response.body).to.not.include('{{%');
          });
        });

        it('should not contain HTML comments', () => {
          cy.request(`${product.url}index.md`).then((response) => {
            expect(response.body).to.not.include('<!--');
          });
        });
      });
    });
  });

  describe('Markdown Rendering Quality', () => {
    it('should render GitHub-style callouts', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should contain GitHub-style callout syntax if callouts are present
        if (response.body.match(/Note|Warning|Important|Tip|Caution/i)) {
          expect(response.body).to.match(
            /> \[!(Note|Warning|Important|Tip|Caution)\]/
          );
        }
      });
    });

    it('should render tables in markdown format', () => {
      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        // If tables are present, they should use markdown table syntax
        if (
          response.body.includes('Tool') &&
          response.body.includes('Administration')
        ) {
          expect(response.body).to.match(/\|.*\|.*\|/); // Table rows
        }
      });
    });

    it('should render lists in markdown format', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Validate using Markdown parser instead of regex
        const validation = validateMarkdown(response.body);
        expect(validation.info.hasLists).to.be.true;
      });
    });
  });

  describe('Table Content - Enterprise Get Started', () => {
    const ENTERPRISE_GET_STARTED_URL = '/influxdb3/enterprise/get-started/';

    before(() => {
      // Ensure markdown is generated for this specific page
      cy.exec(
        'node scripts/html-to-markdown.js --path influxdb3/enterprise/get-started',
        {
          failOnNonZeroExit: false,
          timeout: 60000,
        }
      );
    });

    it('should have valid table structure with expected headers', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        const validation = validateMarkdown(response.body);

        // Should have at least one table
        expect(validation.info.hasTables).to.be.true;
        expect(validation.info.tableCount).to.be.greaterThan(0);

        // Find the tools comparison table (should have Tool, Administration, Write, Query headers)
        const toolsTable = validation.info.tables.find(
          (table) =>
            table.headers.some((h) => h.toLowerCase().includes('tool')) &&
            table.headers.some((h) =>
              h.toLowerCase().includes('administration')
            ) &&
            table.headers.some((h) => h.toLowerCase().includes('write')) &&
            table.headers.some((h) => h.toLowerCase().includes('query'))
        );

        expect(toolsTable).to.exist;

        // Validate table structure using semantic validator
        const tableValidation = validateTable(
          toolsTable,
          ['Tool', 'Administration', 'Write', 'Query'],
          2 // At least 2 rows (header + data)
        );

        expect(tableValidation.valid).to.be.true;
        if (!tableValidation.valid) {
          cy.log('Table validation errors:', tableValidation.errors);
        }
      });
    });

    it('should include expected tools in table content', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        const validation = validateMarkdown(response.body);
        const toolsTable = validation.info.tables[0]; // First table should be tools table

        // Convert table cells to flat array for easier searching
        const allCells = toolsTable.cells.flat().map((c) => c.toLowerCase());

        // Check for key tools (case-insensitive content check)
        expect(allCells.some((c) => c.includes('influxdb3'))).to.be.true;
        expect(allCells.some((c) => c.includes('http api'))).to.be.true;
        expect(allCells.some((c) => c.includes('explorer'))).to.be.true;
        expect(allCells.some((c) => c.includes('telegraf'))).to.be.true;
        expect(allCells.some((c) => c.includes('grafana'))).to.be.true;
      });
    });

    it('should have consistent column count in all table rows', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        const validation = validateMarkdown(response.body);
        const toolsTable = validation.info.tables[0];

        // All rows should have the same number of columns
        const columnCounts = toolsTable.cells.map((row) => row.length);
        const uniqueCounts = [...new Set(columnCounts)];

        expect(uniqueCounts.length).to.equal(
          1,
          `Table has inconsistent column counts: ${uniqueCounts.join(', ')}`
        );
      });
    });
  });

  describe('Regression Tests - Known Issues', () => {
    it('should NOT contain localhost URLs in frontmatter', () => {
      cy.request(`${ENTERPRISE_INDEX_URL}index.md`).then((response) => {
        expect(doesNotContainText(response.body, 'http://localhost')).to.be
          .true;
      });
    });

    it('should NOT contain horizontal rule duplicates at end', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should not end with multiple * * * in a row
        expect(response.body).to.not.match(/\* \* \*\n\n\* \* \*$/);
      });
    });

    it('should NOT contain UI element text (Copy page, Was this helpful, etc)', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Regression: UI elements were appearing in markdown
        expect(doesNotContainText(response.body, 'Copy page')).to.be.true;
        expect(doesNotContainText(response.body, 'Was this page helpful')).to
          .be.true;
        expect(doesNotContainText(response.body, 'Submit feedback')).to.be.true;
      });

      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        expect(doesNotContainText(response.body, 'Copy section')).to.be.true;
      });
    });

    it('should NOT contain Support section content', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Support sections should be removed during conversion
        expect(doesNotContainText(response.body, 'InfluxDB Discord')).to.be
          .true;
        expect(doesNotContainText(response.body, 'Customer portal')).to.be.true;
      });
    });
  });
});
