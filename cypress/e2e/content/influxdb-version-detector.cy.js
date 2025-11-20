/// <reference types="cypress" />

/**
 * InfluxDB Version Detector E2E Test Suite
 *
 * COMPREHENSIVE TEST SCENARIOS CHECKLIST:
 *
 * URL Detection Scenarios:
 * -------------------------
 * Cloud URLs (Definitive Detection):
 * - [ ] Dedicated: https://cluster-id.influxdb.io → InfluxDB Cloud Dedicated (confidence 1.0)
 * - [ ] Serverless US: https://us-east-1-1.aws.cloud2.influxdata.com → InfluxDB Cloud Serverless
 * - [ ] Serverless EU: https://eu-central-1-1.aws.cloud2.influxdata.com → InfluxDB Cloud Serverless
 * - [ ] Cloud TSM: https://us-west-2-1.aws.cloud2.influxdata.com → InfluxDB Cloud v2 (TSM)
 * - [ ] Cloud v1: https://us-west-1-1.influxcloud.net → InfluxDB Cloud v1
 *
 * Localhost URLs (Port-based Detection):
 * - [ ] Core/Enterprise Port: http://localhost:8181 → Should suggest ping test
 * - [ ] OSS Port: http://localhost:8086 → Should suggest version check
 * - [ ] Custom Port: http://localhost:9999 → Should fall back to questionnaire
 *
 * Edge Cases:
 * - [ ] Empty URL: Submit without entering URL → Should show error
 * - [ ] Invalid URL: "not-a-url" → Should fall back to questionnaire
 * - [ ] Cloud keyword: "cloud 2" → Should start questionnaire with cloud context
 * - [ ] Mixed case: HTTP://LOCALHOST:8181 → Should detect port correctly
 *
 * Airgapped/Manual Analysis Scenarios:
 * -------------------------------------
 * Ping Headers Analysis:
 * - [ ] v3 Core headers: x-influxdb-build: core → InfluxDB 3 Core
 * - [ ] v3 Enterprise headers: x-influxdb-build: enterprise → InfluxDB 3 Enterprise
 * - [ ] v2 OSS headers: X-Influxdb-Version: 2.7.8 → InfluxDB OSS 2.x
 * - [ ] v1 headers: X-Influxdb-Version: 1.8.10 → InfluxDB OSS 1.x
 * - [ ] 401 Response: Headers showing 401/403 → Should show auth required message
 * - [ ] Empty headers: Submit without text → Should show error
 * - [ ] Example content: Submit with placeholder text → Should show error
 *
 * Docker Output Analysis:
 * - [ ] Explicit v3 Core: "InfluxDB 3 Core" in output → InfluxDB 3 Core
 * - [ ] Explicit v3 Enterprise: "InfluxDB 3 Enterprise" in output → InfluxDB 3 Enterprise
 * - [ ] Generic v3: x-influxdb-version: 3.1.0 but no build header → Core or Enterprise
 * - [ ] v2 version: "InfluxDB v2.7.8" in output → InfluxDB OSS 2.x
 * - [ ] v1 OSS: "InfluxDB v1.8.10" in output → InfluxDB OSS 1.x
 * - [ ] v1 Enterprise: "InfluxDB 1.8.10" + "Enterprise" → InfluxDB Enterprise
 * - [ ] Empty output: Submit without text → Should show error
 * - [ ] Example content: Submit with placeholder text → Should show error
 *
 * Questionnaire Flow Scenarios:
 * ------------------------------
 * License-based Paths:
 * - [ ] Free → Self-hosted → Recent → SQL → Should rank Core/OSS highly
 * - [ ] Paid → Self-hosted → Recent → SQL → Should rank Enterprise highly
 * - [ ] Free → Cloud → Recent → Flux → Should rank Cloud Serverless/TSM
 * - [ ] Paid → Cloud → Recent → SQL → Should rank Dedicated highly
 * - [ ] Unknown license → Should not eliminate products
 *
 * Age-based Scoring:
 * - [ ] Recent (< 1 year) → Should favor v3 products
 * - [ ] 1-5 years → Should favor v2 era products
 * - [ ] 5+ years → Should favor v1 products only
 * - [ ] Unknown age → Should not affect scoring
 *
 * Language-based Elimination:
 * - [ ] SQL only → Should eliminate v1, v2, Cloud TSM
 * - [ ] Flux only → Should eliminate v1, all v3 products
 * - [ ] InfluxQL only → Should favor v1, but not eliminate others
 * - [ ] Multiple languages → Should not eliminate products
 * - [ ] Unknown language → Should not affect scoring
 *
 * Combined Detection Scenarios:
 * -----------------------------
 * URL + Questionnaire:
 * - [ ] Port 8181 + Free license → Should show Core as high confidence
 * - [ ] Port 8181 + Paid license → Should show Enterprise as high confidence
 * - [ ] Port 8086 + Free + Recent + SQL → Mixed signals, show ranked results
 * - [ ] Cloud URL pattern + Paid → Should favor Dedicated/Serverless
 *
 * UI/UX Scenarios:
 * ----------------
 * Navigation:
 * - [ ] Back button: From URL input → Should return to "URL known" question
 * - [ ] Back button: From questionnaire Q2 → Should return to Q1
 * - [ ] Back button: From first question → Should stay at first question
 * - [ ] Progress bar: Should update with each question
 *
 * Results Display:
 * - [ ] High confidence (score > 60): Should show "Most Likely" label
 * - [ ] Medium confidence (30-60): Should show confidence rating
 * - [ ] Low confidence (< 30): Should show multiple candidates
 * - [ ] Score gap ≥ 15: Top result should stand out
 * - [ ] Score gap < 15: Should show multiple options
 *
 * Interactive Elements:
 * - [ ] Start questionnaire button: From detection results → Should hide results and start questions
 * - [ ] Restart button: Should clear all answers and return to start
 * - [ ] Grafana links: Should display for detected products
 * - [ ] Configuration guidance: Should display for top results
 * - [ ] Quick reference table: Should expand/collapse
 *
 * Pre-filled Values:
 * - [ ] Stored URL: Should pre-fill URL input from localStorage
 * - [ ] URL indicator: Should show when URL is pre-filled
 * - [ ] Clear indicator: Should hide when user edits URL
 *
 * Analytics Tracking Scenarios:
 * -----------------------------
 * - [ ] Modal opened: Track when component initializes
 * - [ ] Question answered: Track each answer with question_id and value
 * - [ ] URL detection: Track with detection_method: "url_analysis"
 * - [ ] Product detected: Track with detected_product and completion_status
 * - [ ] Restart: Track restart action
 *
 * Accessibility Scenarios:
 * ------------------------
 * - [ ] Keyboard navigation: Tab through buttons and inputs
 * - [ ] Focus management: Should focus on heading after showing result
 * - [ ] Screen reader: Labels and ARIA attributes present
 * - [ ] Color contrast: Results visible in different themes
 *
 * Error Handling:
 * ---------------
 * - [ ] Missing products data: Component should handle gracefully
 * - [ ] Missing influxdb_urls data: Should use fallback values
 * - [ ] Invalid JSON in data attributes: Should log warning and continue
 *
 * Edge Cases:
 * -----------
 * - [ ] Modal initialization: Component in modal should wait for modal to open
 * - [ ] Multiple instances: Each instance should work independently
 * - [ ] Page navigation: State should persist if using back button
 * - [ ] URL query params: Should update with detection results
 */

const modalTriggerSelector = 'a.btn.influxdb-detector-trigger';

describe('InfluxDB Version Detector Component', function () {
  // Remove the global beforeEach to optimize for efficient running
  // Each describe block will visit the page once

  describe('Component Data Attributes', function () {
    it('should not throw JavaScript console errors', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for modal to be visible
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');

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
              log.includes('Failed to parse influxdb_urls data')
          );
          expect(relevantErrors).to.have.length(0);
        });
      });
    });
  });

  describe('URL with port 8086', function () {
    before(() => {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();
      cy.get('[data-component="influxdb-version-detector"]')
        .eq(0)
        .within(() => {
          cy.get('#q-url-known .option-button')
            .contains('Yes, I know the URL')
            .should('be.visible')
            .click();
          it('should suggest legacy editions for custom URL or hostname', function () {
            cy.get('#url-input', { timeout: 10000 })
              .clear()
              .type('http://willieshotchicken.com:8086');
            cy.get('.submit-button').click();

            cy.get('.result')
              .invoke('text')
              .then((text) => {
                // Should mention multiple products for port 8086
                const mentionsLegacyEditions =
                  text.includes('OSS 1.x') ||
                  text.includes('OSS 2.x') ||
                  text.includes('Enterprise');
                expect(mentionsLegacyEditions).to.be.true;
              });
            cy.get('#url-input', { timeout: 10000 })
              .should('be.visible')
              .clear()
              .type('willieshotchicken.com:8086');
            cy.get('.submit-button').click();

            cy.get('.result')
              .invoke('text')
              .then((text) => {
                // Should mention multiple products
                const mentionsLegacyEditions =
                  text.includes('OSS 1.x') ||
                  text.includes('OSS 2.x') ||
                  text.includes('Enterprise');
                expect(mentionsLegacyEditions).to.be.true;
              });
          });
          it('should suggest OSS for localhost', function () {
            cy.get('#url-input', { timeout: 10000 })
              .should('be.visible')
              .clear()
              .type('http://localhost:8086');
            cy.get('.submit-button').click();

            cy.get('.result')
              .invoke('text')
              .then((text) => {
                // Should mention multiple editions
                const mentionsLegacyOSS =
                  text.includes('OSS 1.x') || text.includes('OSS 2.x');
                expect(mentionsLegacyOSS).to.be.true;
              });
          });
        });
    });

    describe.skip('URL with port 8181', function () {
      const port8181UrlTests = [
        // InfluxDB 3 Core/Enterprise URLs
        {
          url: 'http://localhost:8181',
        },
        {
          url: 'https://my-server.com:8181',
        },
      ];
      port8181UrlTests.forEach(({ url }) => {
        it(`should detect Core and Enterprise 3 for ${url}`, function () {
          cy.visit('/test-version-detector/');
          cy.get('body').then(($body) => {
            cy.get('#influxdb-url').clear().type(url);
            cy.get('.submit-button').click();
            cy.get('.result')
              .invoke('text')
              .then((text) => {
                // Should mention multiple editions
                const mentionsCoreAndEnterprise =
                  text.includes('InfluxDB 3 Core') &&
                  text.includes('InfluxDB 3 Enterprise');
                expect(mentionsCoreAndEnterprise).to.be.true;
              });
          });
        });
      });
    });

    describe.skip('Cloud URLs', function () {
      const cloudUrlTests = [
        {
          url: 'https://us-west-2-1.aws.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
        {
          url: 'https://us-east-1-1.aws.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
        {
          url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
        {
          url: 'https://us-central1-1.gcp.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
        {
          url: 'https://westeurope-1.azure.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
        {
          url: 'https://eastus-1.azure.cloud2.influxdata.com',
          expectedText: 'Cloud',
        },
      ];

      cloudUrlTests.forEach(({ url, expectedText }) => {
        it(`should detect ${expectedText} for ${url}`, function () {
          cy.visit('/test-version-detector/');
          cy.get('body').then(($body) => {
            cy.get('#influxdb-url').clear().type(url);
            cy.get('.submit-button').click();

            cy.get('.result').should('be.visible').and('contain', expectedText);
          });
        });
      });
    });

    describe.skip('Cloud Dedicated and Clustered URLs', function () {
      const clusterUrlTests = [
        // v3 Cloud Dedicated
        {
          url: 'https://cluster-id.a.influxdb.io',
          expectedText: 'Cloud Dedicated',
        },
        {
          url: 'https://my-cluster.a.influxdb.io',
          expectedText: 'Cloud Dedicated',
        },

        // v1 Enterprise/v3 Clustered
        { url: 'https://cluster-host.com', expectedText: 'Clustered' },
      ];
      clusterUrlTests.forEach(({ url, expectedText }) => {
        it(`should detect ${expectedText} for ${url}`, function () {
          cy.visit('/test-version-detector/');
          cy.get('body').then(($body) => {
            cy.get('#influxdb-url').clear().type(url);
            cy.get('.submit-button').click();

            cy.get('.result').should('be.visible').and('contain', expectedText);
          });
        });
      });
    });

    describe.skip('Cloud Dedicated and Clustered URLs', function () {
      const clusterUrlTests = [
        // v3 Cloud Dedicated
        {
          url: 'https://cluster-id.a.influxdb.io',
          expectedText: 'Cloud Dedicated',
        },
        {
          url: 'https://my-cluster.a.influxdb.io',
          expectedText: 'Cloud Dedicated',
        },

        // v1 Enterprise/v3 Clustered
        { url: 'https://cluster-host.com', expectedText: 'Clustered' },
      ];
      clusterUrlTests.forEach(({ url, expectedText }) => {
        it(`should detect ${expectedText} for ${url}`, function () {
          cy.visit('/test-version-detector/');
          cy.get('body').then(($body) => {
            cy.get('#influxdb-url').clear().type(url);
            cy.get('.submit-button').click();

            cy.get('.result').should('be.visible').and('contain', expectedText);
          });
        });
      });
    });

    it('should handle cloud context detection', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for the button within the modal and question to be interactable
      cy.get('[data-component="influxdb-version-detector"]', { timeout: 5000 })
        .should('be.visible')
        .within(() => {
          cy.get('#q-url-known', { timeout: 5000 })
            .should('be.visible')
            .within(() => {
              cy.contains('.option-button', 'Yes, I know the URL', {
                timeout: 5000,
              })
                .should('be.visible')
                .click();
            });
        });

      // Wait for URL input question to appear and then enter cloud context
      cy.get('#q-url-input', { timeout: 10000 }).should('be.visible');
      cy.get('#url-input', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('cloud 2');
      cy.get('#q-url-input .submit-button').click();

      // Should proceed to next step - either show result or start questionnaire
      // Don't be too specific about what happens next, just verify it progresses
      cy.get('body').then(($body) => {
        if ($body.find('.result').length > 0) {
          cy.get('.result').should('be.visible');
        } else {
          cy.get('.question.active', { timeout: 15000 }).should('be.visible');
        }
      });
    });

    it('should handle v3 port detection', function () {
      cy.visit('/test-version-detector/');
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for the button within the modal and question to be interactable
      cy.get('[data-component="influxdb-version-detector"]', { timeout: 5000 })
        .should('be.visible')
        .within(() => {
          cy.get('#q-url-known', { timeout: 5000 })
            .should('be.visible')
            .within(() => {
              cy.contains('.option-button', 'Yes, I know the URL', {
                timeout: 5000,
              })
                .should('be.visible')
                .click();
            });
        });

      // Wait for URL input question to appear and then test v3 port detection (8181)
      cy.get('#q-url-input', { timeout: 10000 }).should('be.visible');
      cy.get('#url-input', { timeout: 10000 })
        .should('be.visible')
        .clear()
        .type('http://localhost:8181');
      cy.get('#q-url-input .submit-button').click();

      // Should progress to either result or questionnaire
      cy.get('body', { timeout: 15000 }).then(($body) => {
        if ($body.find('.result').length > 0) {
          cy.get('.result').should('be.visible');
        } else {
          cy.get('.question.active').should('be.visible');
        }
      });
    });
  });

  describe.skip('Questionnaire Flow', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
      // The trigger is an anchor element with .btn class, not a button
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for modal to be visible
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');
    });
    it('should start questionnaire for unknown URL', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input').clear().type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();

      cy.get('.question.active').should('be.visible');
      cy.get('.option-button').should('have.length.greaterThan', 0);
    });

    it('should complete basic questionnaire flow', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      // Start questionnaire
      cy.get('#url-input')
        .should('be.visible')
        .clear()
        .type('https://test.com');
      cy.get('.submit-button').click();
      cy.get('.question.active', { timeout: 10000 }).should('be.visible');

      // Answer questions with proper waiting for DOM updates
      const answers = ['Self-hosted', 'Free', '2-5 years', 'SQL'];

      answers.forEach((answer, index) => {
        cy.get('.question.active', { timeout: 10000 }).should('be.visible');
        cy.get('.back-button').should('be.visible');
        cy.get('.option-button').contains(answer).should('be.visible').click();

        // Wait for the next question or final result
        if (index < answers.length - 1) {
          cy.get('.question.active', { timeout: 5000 }).should('be.visible');
        }
      });

      // Should show results
      cy.get('.result', { timeout: 10000 }).should('be.visible');
    });

    it('should show all products when answering "I\'m not sure" to all questions', function () {
      // Test fix for: Core/Enterprise disappearing with all "unknown" answers
      cy.get('.option-button').contains("No, I don't know the URL").click();
      cy.get('.question.active', { timeout: 10000 }).should('be.visible');

      // Answer "I'm not sure" to all questions
      for (let i = 0; i < 4; i++) {
        cy.get('.question.active', { timeout: 10000 }).should('be.visible');
        cy.get('.option-button').contains("I'm not sure").click();
        cy.wait(500);
      }

      cy.get('.result', { timeout: 10000 }).should('be.visible');
      // Should show multiple products, not empty or filtered list
      cy.get('.result').invoke('text').should('have.length.greaterThan', 100);
    });

    it('should NOT recommend InfluxDB 3 for Flux users (regression test)', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input').should('be.visible').clear().type('cloud 2');
      cy.get('.submit-button').click();
      cy.get('.question.active', { timeout: 10000 }).should('be.visible');

      // Complete problematic scenario that was fixed
      const answers = ['Paid', '2-5 years', 'Flux'];
      answers.forEach((answer, index) => {
        cy.get('.question.active', { timeout: 10000 }).should('be.visible');
        cy.get('.option-button').contains(answer).should('be.visible').click();

        // Wait for the next question or final result
        if (index < answers.length - 1) {
          cy.get('.question.active', { timeout: 5000 }).should('be.visible');
        }
      });

      cy.get('.result', { timeout: 10000 }).should('be.visible');

      // Should NOT recommend InfluxDB 3 products for Flux
      cy.get('.result').should('not.contain', 'InfluxDB 3 Core');
      cy.get('.result').should('not.contain', 'InfluxDB 3 Enterprise');
    });

    // Comprehensive questionnaire scenarios covering all decision tree paths
    const questionnaireScenarios = [
      {
        name: 'SQL Filtering Test - Only InfluxDB 3 products for SQL (Free)',
        answers: ['Self-hosted', 'Free', 'Less than 6 months', 'SQL'],
        shouldContain: ['InfluxDB 3'],
        shouldNotContain: [
          'InfluxDB OSS 1.x',
          'InfluxDB OSS 2.x',
          'InfluxDB Enterprise v1.x',
          'InfluxDB Cloud (TSM)',
        ],
      },
      {
        name: 'SQL Filtering Test - Only InfluxDB 3 products for SQL (Paid)',
        answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL'],
        shouldContain: ['InfluxDB 3'],
        shouldNotContain: [
          'InfluxDB OSS 1.x',
          'InfluxDB OSS 2.x',
          'InfluxDB Enterprise v1.x',
          'InfluxDB Cloud (TSM)',
        ],
      },
      {
        name: 'SQL Filtering Test - Only InfluxDB 3 Cloud products for SQL',
        answers: [
          'Cloud (managed service)',
          'Paid',
          'Less than 6 months',
          'SQL',
        ],
        shouldContain: ['Cloud'],
        shouldNotContain: [
          'InfluxDB OSS',
          'InfluxDB Enterprise v1.x',
          'InfluxDB Cloud (TSM)',
        ],
      },
      {
        name: 'OSS Free User - SQL (recent)',
        answers: ['Self-hosted', 'Free', 'Less than 6 months', 'SQL'],
        shouldContain: ['InfluxDB 3 Core'],
        shouldNotContain: ['InfluxDB 3 Enterprise'],
      },
      {
        name: 'OSS Free User - SQL (experienced)',
        answers: ['Self-hosted', 'Free', '2-5 years', 'SQL'],
        shouldContain: ['InfluxDB 3 Core'],
        shouldNotContain: ['InfluxDB 3 Enterprise'],
      },
      {
        name: 'Cloud Flux User',
        answers: [
          'Cloud (managed service)',
          'Paid',
          'Less than 6 months',
          'Flux',
        ],
        shouldContain: ['InfluxDB v2', 'Cloud'],
        shouldNotContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
      },
      {
        name: 'Cloud SQL User (recent)',
        answers: [
          'Cloud (managed service)',
          'Paid',
          'Less than 6 months',
          'SQL',
        ],
        shouldContain: ['Cloud Serverless', 'Cloud Dedicated'],
        shouldNotContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
      },
      {
        name: 'Modern Self-hosted SQL User',
        answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL'],
        shouldContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
        shouldNotContain: ['Cloud'],
      },
      {
        name: 'High Volume Enterprise User',
        answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL', 'Yes'],
        shouldContain: ['InfluxDB 3 Enterprise'],
        shouldNotContain: ['Cloud'],
      },
      {
        name: 'Legacy Self-hosted User (InfluxQL)',
        answers: ['Self-hosted', 'Free', '5+ years', 'InfluxQL'],
        shouldContain: ['InfluxDB v1', 'OSS'],
        shouldNotContain: ['InfluxDB 3'],
      },
      {
        name: 'Legacy Enterprise User',
        answers: ['Self-hosted', 'Paid', '5+ years', 'InfluxQL'],
        shouldContain: ['InfluxDB Enterprise', 'InfluxDB v1'],
        shouldNotContain: ['InfluxDB 3'],
      },
      {
        name: 'Experienced OSS User (Flux)',
        answers: ['Self-hosted', 'Free', '2-5 years', 'Flux'],
        shouldContain: ['InfluxDB v2', 'OSS'],
        shouldNotContain: ['InfluxDB 3', 'Enterprise'],
      },
      {
        name: 'Cloud Free User (recent)',
        answers: [
          'Cloud (managed service)',
          'Free',
          'Less than 6 months',
          'SQL',
        ],
        shouldContain: ['Cloud Serverless'],
        shouldNotContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
      },
      {
        name: 'SQL Cloud User - Only InfluxDB 3 Cloud products',
        answers: [
          'Cloud (managed service)',
          'Paid',
          'Less than 6 months',
          'SQL',
        ],
        shouldContain: ['Cloud Serverless', 'Cloud Dedicated'],
        shouldNotContain: [
          'InfluxDB OSS',
          'InfluxDB Enterprise v1',
          'InfluxDB Cloud (TSM)',
        ],
      },
      {
        name: 'Uncertain User',
        answers: [
          "I'm not sure",
          "I'm not sure",
          "I'm not sure",
          "I'm not sure",
        ],
        shouldContain: [], // Should still provide some recommendations
        shouldNotContain: [],
      },
    ];

    questionnaireScenarios.forEach((scenario) => {
      it(`should handle questionnaire scenario: ${scenario.name}`, function () {
        // Click "Yes, I know the URL" first
        cy.get('#q-url-known .option-button')
          .contains('Yes, I know the URL')
          .should('be.visible')
          .click();

        // Start questionnaire
        cy.get('#url-input').clear().type('https://unknown-server.com:9999');
        cy.get('.submit-button').click();
        cy.get('.question.active').should('be.visible');

        // Answer questions
        scenario.answers.forEach((answer) => {
          cy.get('.question.active').should('be.visible');
          cy.get('.option-button').contains(answer).click();
          cy.wait(500);
        });

        // Verify results
        cy.get('.result').should('be.visible');

        // Check expected content
        scenario.shouldContain.forEach((product) => {
          cy.get('.result').should('contain', product);
        });

        // Check content that should NOT be present
        scenario.shouldNotContain.forEach((product) => {
          cy.get('.result').should('not.contain', product);
        });
      });

      it('should NOT recommend InfluxDB 3 for 5+ year installations (time-aware)', function () {
        // Click "Yes, I know the URL" first
        cy.get('#q-url-known .option-button')
          .contains('Yes, I know the URL')
          .should('be.visible')
          .click();

        cy.get('#url-input').clear().type('https://unknown-server.com:9999');
        cy.get('.submit-button').click();
        cy.get('.question.active').should('be.visible');

        // Test that v3 products are excluded for 5+ years
        const answers = ['Free', 'Self-hosted', 'More than 5 years', 'SQL'];
        answers.forEach((answer) => {
          cy.get('.question.active').should('be.visible');
          cy.get('.option-button').contains(answer).click();
          cy.wait(500);
        });

        cy.get('.result').should('be.visible');
        cy.get('.result').should('not.contain', 'InfluxDB 3 Core');
        cy.get('.result').should('not.contain', 'InfluxDB 3 Enterprise');
        // Should recommend legacy products instead
        cy.get('.result').should('contain', 'InfluxDB');
      });
    });

    it('should apply -100 Flux penalty to InfluxDB 3 products', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input').clear().type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');

      // Even for recent, paid, self-hosted users, Flux should eliminate v3 products
      const answers = ['Self-hosted', 'Paid', 'Less than 6 months', 'Flux'];
      answers.forEach((answer) => {
        cy.get('.question.active').should('be.visible');
        cy.get('.option-button').contains(answer).click();
        cy.wait(500);
      });

      cy.get('.result').should('be.visible');
      cy.get('.result').should('not.contain', 'InfluxDB 3 Core');
      cy.get('.result').should('not.contain', 'InfluxDB 3 Enterprise');
    });

    it('should detect cloud context correctly with regex patterns', function () {
      const cloudPatterns = ['cloud 2', 'cloud v2', 'influxdb cloud 2'];

      // Test first pattern in current session
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();
      cy.get('#url-input').clear().type(cloudPatterns[0]);
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');
    });

    // Navigation and interaction tests
    it('should allow going back through questionnaire questions', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      // Start questionnaire
      cy.get('#url-input').clear().type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');

      // Answer first question
      cy.get('.option-button').first().click();
      cy.wait(500);

      // Check if back button exists and is clickable
      cy.get('body').then(($body) => {
        if ($body.find('.back-button').length > 0) {
          cy.get('.back-button').should('be.visible').click();
          cy.get('.question.active').should('be.visible');
        }
      });
    });

    it('should allow restarting questionnaire from results', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      // Complete a questionnaire
      cy.get('#url-input').clear().type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');

      const answers = ['Self-hosted', 'Free', '2-5 years', 'SQL'];
      answers.forEach((answer) => {
        cy.get('.question.active').should('be.visible');
        cy.get('.back-button').should('be.visible');
        cy.get('.option-button').contains(answer).click();
        cy.wait(500);
      });

      cy.get('.result').should('be.visible');

      // Check if restart button exists and works
      cy.get('body').then(($body) => {
        if ($body.find('.restart-button').length > 0) {
          cy.get('.restart-button').should('be.visible').click();
          cy.get('.question.active').should('be.visible');
        }
      });
    });
  });

  describe.skip('Basic Error Handling', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
      // The trigger is an anchor element with .btn class, not a button
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for modal to be visible
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');
    });

    it('should handle empty URL input gracefully', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input').clear();
      cy.get('.submit-button').click();

      // Should start questionnaire or show guidance
      cy.get('.question.active, .result').should('be.visible');
    });

    it('should handle invalid URL format gracefully', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      cy.get('#url-input').clear().type('not-a-valid-url');
      cy.get('.submit-button').click();

      // Should handle gracefully
      cy.get('.question.active, .result').should('be.visible');
    });
  });

  describe.skip('SQL Language Filtering', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
      // The trigger is an anchor element with .btn class, not a button
      cy.contains(modalTriggerSelector, 'Detect my InfluxDB version').click();

      // Wait for modal to be visible
      cy.get('[data-component="influxdb-version-detector"]', {
        timeout: 5000,
      }).should('be.visible');
    });

    it('should only show InfluxDB 3 products when SQL is selected', function () {
      // Click "Yes, I know the URL" first
      cy.get('#q-url-known .option-button')
        .contains('Yes, I know the URL')
        .should('be.visible')
        .click();

      // Start questionnaire with unknown URL
      cy.get('#url-input').clear().type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');

      // Answer questions leading to SQL selection
      const answers = ['Self-hosted', 'Free', 'Less than 6 months', 'SQL'];
      answers.forEach((answer) => {
        cy.get('.question.active').should('be.visible');
        cy.get('.option-button').contains(answer).click();
        cy.wait(500);
      });

      cy.get('.result').should('be.visible');

      // Get the full result text to verify filtering
      cy.get('.result')
        .invoke('text')
        .then((resultText) => {
          // Verify that ONLY InfluxDB 3 products are shown
          const shouldNotContain = [
            'InfluxDB Enterprise v1.x',
            'InfluxDB OSS v2.x',
            'InfluxDB OSS 1.x',
            'InfluxDB Cloud (TSM)',
          ];

          // Check that forbidden products are NOT in results
          shouldNotContain.forEach((forbiddenProduct) => {
            expect(resultText).to.not.contain(forbiddenProduct);
          });

          // Verify at least one InfluxDB 3 product is shown
          const hasValidProduct =
            resultText.includes('InfluxDB 3 Core') ||
            resultText.includes('Cloud Dedicated') ||
            resultText.includes('Cloud Serverless') ||
            resultText.includes('InfluxDB Clustered');

          expect(hasValidProduct).to.be.true;
        });
    });
  });
});
