// Custom Cypress commands for InfluxDB Version Detector testing

/**
 * Navigate to a page with the version detector component
 * @param {string} [path='/influxdb3/core/visualize-data/grafana/'] - Path to a page with the component
 */
Cypress.Commands.add(
  'visitVersionDetector',
  (path = '/influxdb3/core/visualize-data/grafana/') => {
    cy.visit(path);
    cy.get('[data-component="influxdb-version-detector"]', {
      timeout: 10000,
    }).should('be.visible');
  }
);

/**
 * Test URL detection for a specific URL
 * @param {string} url - The URL to test
 * @param {string} expectedProduct - Expected product name in the result
 */
Cypress.Commands.add('testUrlDetection', (url, expectedProduct) => {
  cy.get('#influxdb-url').clear().type(url);
  cy.get('.submit-button').click();

  cy.get('.result.show', { timeout: 5000 }).should('be.visible');
  cy.get('.detected-version').should('contain', expectedProduct);
});

/**
 * Complete a questionnaire with given answers
 * @param {string[]} answers - Array of answers to select in order
 */
Cypress.Commands.add('completeQuestionnaire', (answers) => {
  answers.forEach((answer, index) => {
    cy.get('.question.active', { timeout: 3000 }).should('be.visible');
    cy.get('.option-button').contains(answer).should('be.visible').click();

    // Wait for transition between questions
    if (index < answers.length - 1) {
      cy.wait(500);
    }
  });

  // Wait for final results
  cy.get('.result.show', { timeout: 5000 }).should('be.visible');
});

/**
 * Start questionnaire with unknown URL
 * @param {string} [url='https://unknown-server.com:9999'] - URL to trigger questionnaire
 */
Cypress.Commands.add(
  'startQuestionnaire',
  (url = 'https://unknown-server.com:9999') => {
    cy.get('#influxdb-url').clear().type(url);
    cy.get('.submit-button').click();
    cy.get('.question.active', { timeout: 5000 }).should('be.visible');
  }
);

/**
 * Verify questionnaire results contain/don't contain specific products
 * @param {Object} options - Configuration object
 * @param {string[]} [options.shouldContain] - Products that should be in results
 * @param {string[]} [options.shouldNotContain] - Products that should NOT be in results
 */
Cypress.Commands.add(
  'verifyQuestionnaireResults',
  ({ shouldContain = [], shouldNotContain = [] }) => {
    cy.get('.result.show', { timeout: 5000 }).should('be.visible');

    shouldContain.forEach((product) => {
      cy.get('.result').should('contain', product);
    });

    shouldNotContain.forEach((product) => {
      cy.get('.result').should('not.contain', product);
    });
  }
);

/**
 * Test navigation through questionnaire (back/restart functionality)
 */
Cypress.Commands.add('testQuestionnaireNavigation', () => {
  // Answer first question
  cy.get('.option-button').first().click();
  cy.wait(500);

  // Test back button
  cy.get('.back-button').should('be.visible').click();
  cy.get('.question.active').should('be.visible');
  cy.get('.progress .progress-bar').should('have.css', 'width', '0px');

  // Complete questionnaire to test restart
  const quickAnswers = ['Self-hosted', 'Free', '2-5 years', 'SQL'];
  cy.completeQuestionnaire(quickAnswers);

  // Test restart button
  cy.get('.restart-button', { timeout: 3000 }).should('be.visible').click();
  cy.get('.question.active').should('be.visible');
  cy.get('.progress .progress-bar').should('have.css', 'width', '0px');
});

/**
 * Check for JavaScript console errors related to the component
 */
Cypress.Commands.add('checkForConsoleErrors', () => {
  cy.window().then((win) => {
    const logs = [];
    const originalConsoleError = win.console.error;

    win.console.error = (...args) => {
      logs.push(args.join(' '));
      originalConsoleError.apply(win.console, args);
    };

    // Wait for any potential errors to surface
    cy.wait(1000);

    cy.then(() => {
      const relevantErrors = logs.filter(
        (log) =>
          log.includes('influxdb-version-detector') ||
          log.includes('Failed to parse influxdb_urls data') ||
          log.includes('SyntaxError') ||
          log.includes('#ZgotmplZ') ||
          log.includes('detectContext is not a function')
      );

      if (relevantErrors.length > 0) {
        throw new Error(
          `Console errors detected: ${relevantErrors.join('; ')}`
        );
      }
    });
  });
});

/**
 * Test URL scenarios from the influxdb_urls.yml data
 */
Cypress.Commands.add('testAllKnownUrls', () => {
  const urlTestCases = [
    // OSS URLs
    { url: 'http://localhost:8086', product: 'InfluxDB OSS' },
    { url: 'https://my-server.com:8086', product: 'InfluxDB OSS' },

    // InfluxDB 3 URLs
    { url: 'http://localhost:8181', product: 'InfluxDB 3' },
    { url: 'https://my-server.com:8181', product: 'InfluxDB 3' },

    // Cloud URLs
    {
      url: 'https://us-west-2-1.aws.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },
    {
      url: 'https://us-east-1-1.aws.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },
    {
      url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },
    {
      url: 'https://us-central1-1.gcp.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },
    {
      url: 'https://westeurope-1.azure.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },
    {
      url: 'https://eastus-1.azure.cloud2.influxdata.com',
      product: 'InfluxDB Cloud',
    },

    // Cloud Dedicated
    {
      url: 'https://cluster-id.a.influxdb.io',
      product: 'InfluxDB Cloud Dedicated',
    },
    {
      url: 'https://my-cluster.a.influxdb.io',
      product: 'InfluxDB Cloud Dedicated',
    },

    // Clustered
    { url: 'https://cluster-host.com', product: 'InfluxDB Clustered' },
  ];

  urlTestCases.forEach(({ url, product }) => {
    cy.visitVersionDetector();
    cy.testUrlDetection(url, product);
  });
});

/**
 * Test comprehensive questionnaire scenarios
 */
Cypress.Commands.add('testQuestionnaireScenarios', () => {
  const scenarios = [
    {
      name: 'OSS Free User',
      answers: ['Self-hosted', 'Free', '2-5 years', 'SQL'],
      shouldContain: ['InfluxDB OSS', 'InfluxDB v2'],
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
      shouldContain: ['InfluxDB v2'],
      shouldNotContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
    },
    {
      name: 'Modern Self-hosted SQL User',
      answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL'],
      shouldContain: ['InfluxDB 3 Core', 'InfluxDB 3 Enterprise'],
      shouldNotContain: [],
    },
    {
      name: 'High Volume Enterprise User',
      answers: ['Self-hosted', 'Paid', 'Less than 6 months', 'SQL', 'Yes'],
      shouldContain: ['InfluxDB 3 Enterprise'],
      shouldNotContain: [],
    },
    {
      name: 'Uncertain User',
      answers: ["I'm not sure", "I'm not sure", "I'm not sure", "I'm not sure"],
      shouldContain: [], // Should still provide some recommendations
      shouldNotContain: [],
    },
  ];

  scenarios.forEach((scenario) => {
    cy.visitVersionDetector();
    cy.startQuestionnaire();
    cy.completeQuestionnaire(scenario.answers);
    cy.verifyQuestionnaireResults({
      shouldContain: scenario.shouldContain,
      shouldNotContain: scenario.shouldNotContain,
    });
  });
});

/**
 * Test accessibility features
 */
Cypress.Commands.add('testAccessibility', () => {
  // Test keyboard navigation
  cy.get('body').tab();
  cy.focused().should('have.id', 'influxdb-url');

  cy.focused().type('https://test.com');
  cy.focused().tab();
  cy.focused().should('have.class', 'submit-button');

  cy.focused().type('{enter}');
  cy.get('.question.active', { timeout: 3000 }).should('be.visible');

  // Test that buttons are focusable
  cy.get('.option-button')
    .first()
    .should('be.visible')
    .focus()
    .should('be.focused');
});

/**
 * Test theme integration
 */
Cypress.Commands.add('testThemeIntegration', () => {
  // Test light theme (default)
  cy.get('[data-component="influxdb-version-detector"]')
    .should('have.css', 'background-color')
    .and('not.equal', 'transparent');

  cy.get('.detector-title')
    .should('have.css', 'color')
    .and('not.equal', 'rgb(0, 0, 0)');

  // Test dark theme if theme switcher exists
  cy.get('body').then(($body) => {
    if ($body.find('[data-theme-toggle]').length > 0) {
      cy.get('[data-theme-toggle]').click();

      cy.get('[data-component="influxdb-version-detector"]')
        .should('have.css', 'background-color')
        .and('not.equal', 'rgb(255, 255, 255)');
    }
  });
});
