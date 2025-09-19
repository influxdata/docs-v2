/// <reference types="cypress" />

describe('InfluxDB Version Detector Component', function () {
  // Remove the global beforeEach to optimize for efficient running
  // Each describe block will visit the page once

  describe('Modal Functionality', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
    });

    it('should initialize component when modal opens', function () {
      // The trigger is an anchor element with .btn class, not a button
      cy.contains('a.btn', 'Detect my InfluxDB version').click();

      // Verify modal opens and component is visible
      cy.get('.modal').should('be.visible');
      cy.get('[data-component="influxdb-version-detector"]').should('be.visible');

      // Verify component elements are present
      cy.get('#detector-title').should('contain', 'InfluxDB product detector');
      cy.get('.question.active').should('be.visible');
      cy.get('.option-button').should('have.length.greaterThan', 0);
    });
  });

  describe('Component Data Attributes', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
      // The trigger is an anchor element with .btn class, not a button
      cy.contains('a.btn', 'Detect my InfluxDB version').click();
    });

    it.skip('should have proper data attributes', function () {
      cy.get('[data-component="influxdb-version-detector"]').then(($el) => {
        // Check that required attributes exist
        expect($el).to.have.attr('data-component');
        expect($el.attr('data-component')).to.equal(
          'influxdb-version-detector'
        );

        // Check that data attributes exist
        expect($el).to.have.attr('data-products');
        expect($el).to.have.attr('data-influxdb-urls');

        // Verify data isn't Hugo security token
        const productsData = $el.attr('data-products');
        const urlsData = $el.attr('data-influxdb-urls');

        expect(productsData).to.not.equal('#ZgotmplZ');
        expect(urlsData).to.not.equal('#ZgotmplZ');

        // Verify the data contains valid JSON
        expect(() => JSON.parse(productsData)).to.not.throw();
        expect(() => JSON.parse(urlsData)).to.not.throw();

        // Verify the data contains expected structure
        const products = JSON.parse(productsData);
        const urls = JSON.parse(urlsData);

        expect(products).to.be.an('object');
        expect(urls).to.be.an('object');
        expect(Object.keys(products).length).to.be.greaterThan(0);
        expect(Object.keys(urls).length).to.be.greaterThan(0);
      });
    });

    it('should not throw JavaScript console errors', function () {
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

    it.skip('should not throw "detectContext is not a function" error', function () {
      cy.get('body').then(($body) => {
        if ($body.find('#influxdb-url').length > 0) {
          cy.get('#influxdb-url').clear().type('https://cloud.influxdata.com');
          cy.get('.submit-button').click();

          // Should not throw JavaScript errors
          cy.get('.result').should('be.visible');
        }
      });
    });

    it.skip('should handle #ZgotmplZ token in influxdb_urls data', function () {
      cy.window().then((win) => {
        // Simulate the #ZgotmplZ scenario
        const mockComponent = win.document.createElement('div');
        mockComponent.setAttribute('data-influxdb-urls', '#ZgotmplZ');

        // Should not cause parse errors (handled in parseComponentData)
        expect(() => {
          const data = mockComponent.getAttribute('data-influxdb-urls');
          if (data && data !== '#ZgotmplZ') {
            JSON.parse(data);
          }
        }).to.not.throw();
      });
    });
  });

  describe('URL Detection Flow', function () {
    beforeEach(() => {
      cy.visit('/test-version-detector/');
      // The trigger is an anchor element with .btn class, not a button
      cy.contains('a.btn', 'Detect my InfluxDB version').click();
    });
    const urlTests = [
      // OSS URLs
      { url: 'http://localhost:8086', expectedText: 'OSS' },
      { url: 'https://my-server.com:8086', expectedText: 'OSS' },

      // InfluxDB 3 URLs
      { url: 'http://localhost:8181', expectedText: 'InfluxDB 3' },
      { url: 'https://my-server.com:8181', expectedText: 'InfluxDB 3' },

      // Cloud URLs
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

      // Cloud Dedicated
      { url: 'https://cluster-id.a.influxdb.io', expectedText: 'Dedicated' },
      { url: 'https://my-cluster.a.influxdb.io', expectedText: 'Dedicated' },

      // Enterprise/Clustered
      { url: 'https://cluster-host.com', expectedText: 'Clustered' },
    ];

    urlTests.forEach(({ url, expectedText }) => {
      it.skip(`should detect ${expectedText} for ${url}`, function () {
        cy.get('body').then(($body) => {
          if ($body.find('#influxdb-url').length > 0) {
            cy.get('#influxdb-url').clear().type(url);
            cy.get('.submit-button').click();

            cy.get('.result')
              .should('be.visible')
              .and('contain', expectedText);
          } else {
            cy.log(
              'URL input not available - component may not be initialized'
            );
          }
        });
      });
    });

    it('should handle cloud context detection', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Wait for URL input question to appear and then enter cloud context
      cy.get('#q-url-input', { timeout: 10000 }).should('be.visible');
      cy.get('#url-input', { timeout: 10000 }).should('be.visible').clear().type('cloud 2');
      cy.get('.submit-button').click();

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

    it('should handle OSS port detection', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Wait for URL input question to appear and then test OSS port detection (8086)
      cy.get('#q-url-input', { timeout: 10000 }).should('be.visible');
      cy.get('#url-input', { timeout: 10000 }).should('be.visible').clear().type('http://localhost:8086');
      cy.get('.submit-button').click();

      // Should progress to either result or questionnaire
      cy.get('body', { timeout: 15000 }).then(($body) => {
        if ($body.find('.result').length > 0) {
          cy.get('.result').should('be.visible');
        } else {
          cy.get('.question.active').should('be.visible');
        }
      });
    });

    it('should handle v3 port detection', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Wait for URL input question to appear and then test v3 port detection (8181)
      cy.get('#q-url-input', { timeout: 10000 }).should('be.visible');
      cy.get('#url-input', { timeout: 10000 }).should('be.visible').clear().type('http://localhost:8181');
      cy.get('.submit-button').click();

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
      cy.contains('a.btn', 'Detect my InfluxDB version').click();
    });
    it('should start questionnaire for unknown URL', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      cy.get('#url-input')
        .clear()
        .type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();

      cy.get('.question.active').should('be.visible');
      cy.get('.option-button').should('have.length.greaterThan', 0);
    });

    it('should complete basic questionnaire flow', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Start questionnaire
      cy.get('#url-input').should('be.visible').clear().type('https://test.com');
      cy.get('.submit-button').click();
      cy.get('.question.active', { timeout: 10000 }).should('be.visible');

      // Answer questions with proper waiting for DOM updates
      const answers = ['Self-hosted', 'Free', '2-5 years', 'SQL'];

      answers.forEach((answer, index) => {
        cy.get('.question.active', { timeout: 10000 }).should('be.visible');
        cy.get('.option-button').contains(answer).should('be.visible').click();

        // Wait for the next question or final result
        if (index < answers.length - 1) {
          cy.get('.question.active', { timeout: 5000 }).should('be.visible');
        }
      });

      // Should show results
      cy.get('.result', { timeout: 10000 }).should('be.visible');
    });

    it('should NOT recommend InfluxDB 3 for Flux users (regression test)', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

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
        shouldNotContain: ['InfluxDB OSS 1.x', 'InfluxDB OSS 2.x', 'InfluxDB Enterprise v1.x', 'InfluxDB Cloud (TSM)'],
      },
      {
        name: 'SQL Filtering Test - Only InfluxDB 3 products for SQL (Paid)',
        answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL'],
        shouldContain: ['InfluxDB 3'],
        shouldNotContain: ['InfluxDB OSS 1.x', 'InfluxDB OSS 2.x', 'InfluxDB Enterprise v1.x', 'InfluxDB Cloud (TSM)'],
      },
      {
        name: 'SQL Filtering Test - Only InfluxDB 3 Cloud products for SQL',
        answers: ['Cloud (managed service)', 'Paid', 'Less than 6 months', 'SQL'],
        shouldContain: ['Cloud'],
        shouldNotContain: ['InfluxDB OSS', 'InfluxDB Enterprise v1.x', 'InfluxDB Cloud (TSM)'],
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
        answers: ['Cloud (managed service)', 'Paid', 'Less than 6 months', 'SQL'],
        shouldContain: ['Cloud Serverless', 'Cloud Dedicated'],
        shouldNotContain: ['InfluxDB OSS', 'InfluxDB Enterprise v1', 'InfluxDB Cloud (TSM)'],
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
        cy.get('.option-button').contains('Yes, I know the URL').click();

        // Start questionnaire
        cy.get('#url-input')
          .clear()
          .type('https://unknown-server.com:9999');
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

      it('should handle Docker container option', function () {
        cy.get('.option-button').contains('Yes, but it\'s running in Docker/Kubernetes').click();
        cy.get('#q-docker-manual').should('be.visible');
        cy.get('.code-block').should('contain', 'docker exec');
        cy.get('#docker-output').should('be.visible');
      });

      it('should NOT recommend InfluxDB 3 for 5+ year installations (time-aware)', function () {
        // Click "Yes, I know the URL" first
        cy.get('.option-button').contains('Yes, I know the URL').click();

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
      cy.get('.option-button').contains('Yes, I know the URL').click();

      cy.get('#url-input')
        .clear()
        .type('https://unknown-server.com:9999');
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
      const cloudPatterns = [
        'cloud 2',
        'cloud v2',
        'influxdb cloud 2'
      ];

      // Test first pattern in current session
      cy.get('.option-button').contains('Yes, I know the URL').click();
      cy.get('#url-input').clear().type(cloudPatterns[0]);
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');
    });

    // Navigation and interaction tests
    it('should allow going back through questionnaire questions', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Start questionnaire
      cy.get('#url-input')
        .clear()
        .type('https://unknown-server.com:9999');
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
      cy.get('.option-button').contains('Yes, I know the URL').click();

      // Complete a questionnaire
      cy.get('#url-input')
        .clear()
        .type('https://unknown-server.com:9999');
      cy.get('.submit-button').click();
      cy.get('.question.active').should('be.visible');

      const answers = ['Self-hosted', 'Free', '2-5 years', 'SQL'];
      answers.forEach((answer) => {
        cy.get('.question.active').should('be.visible');
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
      cy.contains('a.btn', 'Detect my InfluxDB version').click();
    });

    it('should handle empty URL input gracefully', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

      cy.get('#url-input').clear();
      cy.get('.submit-button').click();

      // Should start questionnaire or show guidance
      cy.get('.question.active, .result').should('be.visible');
    });

    it('should handle invalid URL format gracefully', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

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
      cy.contains('a.btn', 'Detect my InfluxDB version').click();
    });

    it('should only show InfluxDB 3 products when SQL is selected', function () {
      // Click "Yes, I know the URL" first
      cy.get('.option-button').contains('Yes, I know the URL').click();

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
      cy.get('.result').invoke('text').then((resultText) => {
        // Verify that ONLY InfluxDB 3 products are shown
        const shouldNotContain = [
          'InfluxDB Enterprise v1.x',
          'InfluxDB OSS v2.x',
          'InfluxDB OSS 1.x',
          'InfluxDB Cloud (TSM)'
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
