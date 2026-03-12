/// <reference types="cypress" />

/**
 * InfluxDB Version Detector E2E Test Suite
 *
 * HIGH-LEVEL TEST COVERAGE:
 * - Modal visibility and component initialization
 * - URL detection (representative scenarios)
 * - Questionnaire flow (one complete path)
 * - Link behavior (documentation, Ask AI, Grafana context)
 * - Source group ID mapping
 */

const modalTriggerSelector = 'a.btn.influxdb-detector-trigger';

describe('InfluxDB Version Detector Component', function () {
  describe('Component Initialization', function () {
    it('should open modal and display without console errors', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for modal to be visible
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      // Verify first question is displayed
      cy.get('#q-url-known').should('be.visible');
      cy.get('#q-url-known .option-button').should(
        'have.length.greaterThan',
        0
      );

      // Check for JavaScript errors
      cy.window().then((win) => {
        const logs = [];
        const originalError = win.console.error;

        win.console.error = (...args) => {
          logs.push(args.join(' '));
          originalError.apply(win.console, args);
        };

        cy.wait(2000);

        cy.then(() => {
          const relevantErrors = logs.filter(
            (log) =>
              log.includes('influxdb-version-detector') ||
              log.includes('detectContext is not a function') ||
              log.includes('Failed to parse')
          );
          expect(relevantErrors).to.have.length(0);
        });
      });
    });
  });

  describe('URL Detection', function () {
    beforeEach(function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');
    });

    it('should detect products from port 8086 URLs', function () {
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('http://localhost:8086');
      cy.get('#q-url-input .submit-button').click();

      // Should show suggestions with commands to check version
      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const hasSuggestionContent =
            text.includes('Port 8086 detected') &&
            text.includes('influxd version');
          expect(hasSuggestionContent).to.be.true;
        });
    });

    it('should detect InfluxDB 3 products from port 8181', function () {
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('http://localhost:8181');
      cy.get('#q-url-input .submit-button').click();

      // Should show result (either suggestions or candidates)
      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');

      // Verify some InfluxDB 3 product is mentioned
      cy.get('.result').should('contain', 'InfluxDB 3');
    });

    it('should handle cloud context keywords', function () {
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('cloud 2');
      cy.get('#q-url-input .submit-button').click();

      // Should proceed to result or questionnaire (scroll to see it)
      cy.wait(1000);
      cy.get('body', { timeout: 15000 }).then(($body) => {
        if ($body.find('.result').length > 0) {
          cy.get('.result').should('be.visible');
        } else {
          cy.get('.question.active').should('be.visible');
        }
      });
    });
  });

  describe('Questionnaire Flow', function () {
    it('should complete full questionnaire and show results', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      // Start questionnaire without URL
      cy.get('#q-url-known .option-button')
        .contains("No, I don't know")
        .should('be.visible')
        .click();

      // Answer questionnaire to identify a product
      cy.get('#q-paid', { timeout: 10000 }).within(() => {
        cy.contains('.option-button', 'Free/Open Source').click();
      });

      cy.get('#q-hosted', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Self-hosted').click();
      });

      cy.get('#q-age', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Recently installed').click();
      });

      cy.get('#q-language', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'SQL').click();
      });

      // Verify results are displayed - could be ranked results or specific product
      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');

      // Should have product rankings shown
      cy.get('.product-ranking', { timeout: 10000 }).should('exist');
    });
  });

  describe('Link Behavior - Non-Grafana Context', function () {
    beforeEach(function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      // Use questionnaire flow to get reliable ranked results
      cy.get('#q-url-known .option-button')
        .contains("No, I don't know")
        .should('be.visible')
        .click();

      // Answer questionnaire: Free -> Self-hosted -> Less than 2 years -> SQL
      cy.get('#q-paid', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Free/Open Source').click();
      });

      cy.get('#q-hosted', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Self-hosted').click();
      });

      cy.get('#q-age', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Recently installed').click();
      });

      cy.get('#q-language', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'SQL').click();
      });

      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');

      // Ensure product rankings are also scrolled into view
      cy.get('.product-ranking', { timeout: 5000 }).first().scrollIntoView();
    });

    it('should display documentation and Ask AI links', function () {
      // Verify at least one product ranking exists with links
      cy.get('.product-ranking', { timeout: 5000 })
        .should('exist')
        .first()
        .within(() => {
          // Verify documentation link
          cy.get('.doc-link')
            .should('be.visible')
            .should('contain', 'View')
            .should('contain', 'documentation')
            .should('have.attr', 'href')
            .and('match', /^\/influxdb(3)?\/[^/]+\/?$/);

          // Verify Ask AI link
          cy.get('.ask-ai-open')
            .should('be.visible')
            .should('contain', 'Ask AI about')
            .should('have.attr', 'href', '#');
        });
    });

    it('should NOT display Grafana links on non-Grafana pages', function () {
      cy.get('.result', { timeout: 5000 })
        .should('be.visible')
        .should('not.contain', 'Configure Grafana');
    });

    it('should include source group IDs in Ask AI links', function () {
      // Wait for product rankings to fully render
      cy.get('.product-ranking', { timeout: 10000 }).should('exist');

      // Check that at least one Ask AI link has source group IDs
      cy.get('.product-ranking .ask-ai-open', { timeout: 5000 })
        .first()
        .should('be.visible')
        .should('have.attr', 'data-source-group-ids')
        .and('not.be.empty');
    });

    it('should include data-query attribute in Ask AI links', function () {
      cy.get('.product-ranking', { timeout: 5000 })
        .should('exist')
        .first()
        .within(() => {
          cy.get('.ask-ai-open')
            .should('be.visible')
            .should('have.attr', 'data-query')
            .and('include', 'Help me with');
        });
    });

    it('should open documentation links in new tab', function () {
      cy.get('.product-ranking', { timeout: 5000 })
        .should('exist')
        .first()
        .within(() => {
          cy.get('.doc-link')
            .should('be.visible')
            .should('have.attr', 'target', '_blank');
        });
    });
  });

  describe('Source Group ID Mappings', function () {
    it('should map InfluxDB 3 products to v3 source group', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      // Use questionnaire: Free -> Self-hosted -> Less than 2 years -> SQL
      cy.get('#q-url-known').within(() => {
        cy.contains('.option-button', "No, I don't know").click();
      });

      cy.get('#q-paid', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Free/Open Source').click();
      });

      cy.get('#q-hosted', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Self-hosted').click();
      });

      cy.get('#q-age', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Recently installed').click();
      });

      cy.get('#q-language', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'SQL').click();
      });

      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');
      cy.get('.product-ranking', { timeout: 10000 }).should('exist');

      // InfluxDB 3 products should have the v3 source group
      // Check that at least one product ranking has the v3 source group ID
      cy.get(
        '.product-ranking .ask-ai-open[data-source-group-ids*="b650cf0b-4b52-42e8-bde7-a02738f27262"]',
        { timeout: 5000 }
      )
        .should('exist')
        .and('be.visible');
    });

    it('should map InfluxDB OSS v2 to v2 source group', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      cy.get('#q-url-known').within(() => {
        cy.contains('.option-button', "No, I don't know").click();
      });

      cy.get('#q-paid', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Free/Open Source').click();
      });

      cy.get('#q-hosted', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Self-hosted').click();
      });

      cy.get('#q-age', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Recently installed').click();
      });

      cy.get('#q-language', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Flux').click();
      });

      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');
      cy.get('.product-ranking', { timeout: 10000 }).should('exist');

      // OSS v2 should have the v2 source group
      // Check that at least one OSS v2 product has the correct source group ID
      cy.get(
        '.product-ranking .ask-ai-open[data-source-group-ids*="3e905caa-dd6f-464b-abf9-c3880e09f128"]',
        { timeout: 5000 }
      )
        .should('exist')
        .and('be.visible');
    });

    it('should map InfluxDB OSS v1 to v1 source group', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

      cy.get('#q-url-known').within(() => {
        cy.contains('.option-button', "No, I don't know").click();
      });

      cy.get('#q-paid', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Free/Open Source').click();
      });

      cy.get('#q-hosted', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'Self-hosted').click();
      });

      cy.get('#q-age', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'More than 5 years').click();
      });

      cy.get('#q-language', { timeout: 5000 }).within(() => {
        cy.contains('.option-button', 'InfluxQL').click();
      });

      cy.get('.result', { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible');
      cy.get('.product-ranking', { timeout: 10000 }).should('exist');

      // Scroll the first product ranking into view and wait
      cy.get('.product-ranking').first().scrollIntoView();
      cy.wait(500);

      // OSS v1 should have the v1 source group
      // Log what we actually find for debugging
      cy.get('.product-ranking .ask-ai-open').then(($links) => {
        let foundV1Id = false;
        $links.each((i, link) => {
          const ids = link.getAttribute('data-source-group-ids');
          if (ids && ids.includes('d809f67b-867d-4f17-95f0-c33dbadbf15f')) {
            foundV1Id = true;
          }
        });
        expect(
          foundV1Id,
          'Should find at least one link with v1 source group ID'
        ).to.be.true;
      });
    });
  });
});

/**
 * MANUAL TESTING REQUIRED:
 *
 * Grafana Context Behavior:
 * -------------------------
 * The test-version-detector page doesn't have context="grafana" set.
 * To manually test Grafana-specific link behavior:
 *
 * 1. Visit a Grafana documentation page (e.g., /influxdb3/core/visualize-data/grafana/)
 * 2. Open the version detector modal
 * 3. Detect a product (e.g., enter http://localhost:8181)
 * 4. Verify results show:
 *    - "Configure Grafana for {product} →" link
 *    - Link points to /{product}/visualize-data/grafana/
 *    - NO "Ask AI" links (Grafana context suppresses these)
 *    - NO "View documentation" links (Grafana context suppresses these)
 *
 * Expected Grafana Link Patterns:
 * - InfluxDB 3 Core → /influxdb3/core/visualize-data/grafana/
 * - InfluxDB 3 Enterprise → /influxdb3/enterprise/visualize-data/grafana/
 * - Cloud Dedicated → /influxdb3/cloud-dedicated/visualize-data/grafana/
 * - Cloud Serverless → /influxdb3/cloud-serverless/visualize-data/grafana/
 * - InfluxDB OSS v1 → /influxdb/v1/visualize-data/grafana/
 * - InfluxDB OSS v2 → /influxdb/v2/visualize-data/grafana/
 */
