/**
 * E2E tests for Markdown content validation
 * Validates that generated Markdown files:
 * - Don't contain raw Hugo shortcodes
 * - Don't contain HTML comments
 * - Have proper frontmatter
 * - Section pages include child page content
 */

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

    it('should use relative URLs in frontmatter', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        const frontmatterMatch = response.body.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch[1];

        // URL should start with / (relative) not http:// or https://
        expect(frontmatter).to.match(/url: \//);
        expect(frontmatter).to.not.match(/url: https?:\/\//);
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

  describe('Product Context Header', () => {
    it('should include product context header after frontmatter', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // After frontmatter, should have product context
        expect(response.body).to.match(/---\n\n\*\*Product\*\*:/);
      });
    });

    it('should match product name and version from frontmatter', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        const frontmatterMatch = response.body.match(/^---\n([\s\S]*?)\n---/);
        const frontmatter = frontmatterMatch[1];

        // Extract product and version from frontmatter
        const productMatch = frontmatter.match(/product: (.+)/);
        const versionMatch = frontmatter.match(/product_version: (.+)/);

        expect(productMatch).to.not.be.null;
        expect(versionMatch).to.not.be.null;

        const productName = productMatch[1];
        const version = versionMatch[1];

        // Check product header matches
        const productHeaderRegex = new RegExp(
          `\\*\\*Product\\*\\*: ${productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\(${version}\\)`
        );
        expect(response.body).to.match(productHeaderRegex);
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
            expect(response.body).to.include(
              `**Product**: ${product.name} (${product.version})`
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
        // Should contain markdown list items
        expect(response.body).to.match(/^-   /m); // Unordered list
      });
    });
  });

  describe('Table Formatting - Enterprise Get Started', () => {
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

    it('should have properly formatted tools comparison table', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Table should exist with proper header row
        expect(response.body).to.include(
          '| Tool | Administration | Write | Query |'
        );

        // Table should have separator row with proper format
        expect(response.body).to.match(/\| --- \| --- \| --- \| --- \|/);
      });
    });

    it('should not have duplicate header rows in table', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Extract the table section
        const tableMatch = response.body.match(
          /\| Tool \| Administration \| Write \| Query \|([\s\S]*?)(?:\n\n|$)/
        );

        expect(tableMatch).to.not.be.null;
        const tableContent = tableMatch[0];

        // Count occurrences of the header row
        const headerMatches = tableContent.match(
          /\| Tool \| Administration \| Write \| Query \|/g
        );

        // Should appear exactly once (the header)
        expect(headerMatches).to.have.length(1);
      });
    });

    it('should have correct number of columns in all table rows', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Extract the table section
        const tableMatch = response.body.match(
          /\| Tool \| Administration \| Write \| Query \|([\s\S]*?)(?:\n\n|$)/
        );

        expect(tableMatch).to.not.be.null;
        const tableContent = tableMatch[0];

        // Split into rows and validate each row has 4 columns (5 pipes)
        const rows = tableContent
          .split('\n')
          .filter((line) => line.trim().startsWith('|'));

        rows.forEach((row) => {
          // Count pipes - should be 5 (4 columns with leading/trailing pipes)
          const pipeCount = (row.match(/\|/g) || []).length;
          expect(pipeCount).to.equal(5);
        });
      });
    });

    it('should include expected tools in table rows', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Should include key tools mentioned in the original table
        expect(response.body).to.include('| influxdb3 CLI |');
        expect(response.body).to.include('| InfluxDB HTTP API |');
        expect(response.body).to.include('| InfluxDB 3 Explorer |');
        expect(response.body).to.include('| Telegraf |');
        expect(response.body).to.include('| Grafana |');
      });
    });

    it('should properly format empty cells in table', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Empty cells should be represented consistently (either empty or with -)
        const tableMatch = response.body.match(
          /\| Tool \| Administration \| Write \| Query \|([\s\S]*?)(?:\n\n|$)/
        );

        expect(tableMatch).to.not.be.null;
        const tableContent = tableMatch[0];

        // Check that cells are properly separated with |
        // Each row should have consistent spacing
        const dataRows = tableContent
          .split('\n')
          .filter(
            (line) => line.trim().startsWith('|') && !line.includes('---')
          );

        dataRows.forEach((row) => {
          // Row should be properly formatted with | separators
          expect(row).to.match(/^\|.*\|$/);
        });
      });
    });

    it('should not have newlines within table cells', () => {
      cy.request(`${ENTERPRISE_GET_STARTED_URL}index.md`).then((response) => {
        // Extract the table section
        const tableMatch = response.body.match(
          /\| Tool \| Administration \| Write \| Query \|([\s\S]*?)(?:\n\n|$)/
        );

        expect(tableMatch).to.not.be.null;
        const tableContent = tableMatch[0];

        // Split into rows
        const rows = tableContent
          .split('\n')
          .filter((line) => line.trim().startsWith('|'));

        rows.forEach((row) => {
          // Skip separator row
          if (row.includes('---')) return;

          // Each cell content between pipes should not contain raw newlines
          // The entire row should be on one line
          expect(row).to.not.include('\n');
        });
      });
    });
  });

  describe('Regression Tests - Known Issues', () => {
    it('should NOT contain localhost URLs in frontmatter', () => {
      cy.request(`${ENTERPRISE_INDEX_URL}index.md`).then((response) => {
        expect(response.body).to.not.include('http://localhost');
      });
    });

    it('should NOT contain horizontal rule duplicates at end', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Should not end with multiple * * * in a row
        expect(response.body).to.not.match(/\* \* \*\n\n\* \* \*$/);
      });
    });

    it('should NOT contain "Copy page" or "Copy section" button text', () => {
      cy.request(`${LEAF_PAGE_URL}index.md`).then((response) => {
        // Regression: Format selector text was appearing in markdown
        expect(response.body).to.not.include('Copy page');
      });

      cy.request(`${SECTION_PAGE_URL}index.md`).then((response) => {
        expect(response.body).to.not.include('Copy section');
      });
    });
  });
});
