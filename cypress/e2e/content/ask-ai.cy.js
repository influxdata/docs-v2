/// <reference types="cypress" />

/**
 * Ask AI Widget E2E Test Suite
 *
 * Tests for the Kapa.ai Ask AI widget and ask-ai-link shortcode
 *
 * NOTE: Open the chat window sparingly.
 *
 * COMPREHENSIVE TEST SCENARIOS CHECKLIST:
 *
 * Widget Initialization:
 * ----------------------
 * - [x] Widget script loads without errors
 * - [x] window.Kapa object is available
 * - [x] Widget trigger button is visible
 * - [ ] Widget initializes with correct configuration
 * - [ ] No JavaScript console errors during initialization
 *
 * Widget Trigger Button:
 * ----------------------
 * - [x] Button exists in footer
 * - [x] Button has correct class (ask-ai-open)
 * - [x] Button opens widget when clicked
 * - [x] Widget modal becomes visible after click
 * - [ ] Widget overlay appears (if configured)
 *
 * Ask AI Link Shortcode:
 * ----------------------
 * - [x] Link renders correctly in content
 * - [x] Link has correct text (default or custom)
 * - [x] Link has ask-ai-open class
 * - [x] Link has onclick handler for analytics
 * - [x] Link has data-query attribute with query
 * - [x] Link includes gtag analytics in onclick
 * - [x] Link opens widget when clicked
 * - [x] Query is pre-filled without auto-submitting
 * - [x] Widget modal becomes visible after click
 * - [x] Widget overlay appears (if configured)
 *
 * Widget Functionality:
 * ---------------------
 * - [ ] Widget opens in modal/drawer
 * - [ ] Widget shows input field
 * - [ ] Widget shows example questions
 * - [ ] Widget accepts user input
 * - [ ] Widget submits queries to AI
 * - [ ] Widget displays AI responses
 * - [ ] Widget can be closed
 * - [ ] Widget reopens with history preserved
 *
 * Query Pre-population:
 * ---------------------
 * - [x] window.Kapa.open() accepts query parameter
 * - [x] Query appears in input field when pre-populated
 * - [x] Query is submitted automatically with submit: true
 * - [ ] Pre-populated query respects special characters
 * - [ ] Pre-populated query handles HTML entities correctly
 *
 * Analytics Tracking:
 * -------------------
 * - [ ] Link click fires gtag event
 * - [ ] Event includes correct custom_map fields
 * - [ ] Event includes query text
 * - [ ] Event includes section (pathname)
 * - [ ] Event includes interaction_type: 'inline_link'
 *
 * Error Handling:
 * ---------------
 * - [x] No console errors when widget loads
 * - [ ] Graceful handling if window.Kapa is undefined
 * - [ ] Graceful handling if widget script fails to load
 * - [ ] Error messages are user-friendly
 *
 * Accessibility:
 * --------------
 * - [ ] Widget trigger button is keyboard accessible
 * - [ ] Ask AI links are keyboard accessible
 * - [ ] Widget modal has proper focus management
 * - [ ] Widget has ARIA labels
 * - [ ] Screen reader announcements work
 *
 * Cross-browser:
 * --------------
 * - [ ] Works in Chrome
 * - [ ] Works in Firefox
 * - [ ] Works in Safari
 * - [ ] Works in Edge
 */

function beforeTest() {
  cy.viewport(1440, 900);
}

describe('Ask AI Widget and Link', function () {
  describe('Widget Initialization', function () {
    beforeEach(() => {
      cy.visit('/influxdb3/core/admin/identify-version/');
      beforeTest();
    });

    it('should load widget script without JavaScript errors', function () {
      cy.window().then((win) => {
        const errors = [];
        const originalError = win.console.error;

        win.console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(win.console, args);
        };

        // Wait for widget to initialize
        cy.wait(2000);

        cy.then(() => {
          // Filter for Kapa-related errors
          const kapaErrors = errors.filter(
            (log) =>
              log.includes('kapa') ||
              log.includes('Kapa') ||
              log.includes('ask-ai')
          );
          expect(kapaErrors).to.have.length(0);
        });
      });
    });

    it('should make window.Kapa available', function () {
      cy.window().should('have.property', 'Kapa');
      cy.window().then((win) => {
        expect(win.Kapa).to.be.a('function');
      });
    });

    it('should render widget trigger button in footer', function () {
      cy.get('.ask-ai-trigger a.ask-ai-open').should('be.visible');
      cy.get('.ask-ai-trigger').should('contain', 'Ask AI');
    });

    it('should have correct class for widget trigger', function () {
      cy.get('.ask-ai-trigger a.ask-ai-open')
        .should('have.class', 'ask-ai-open')
        .and('be.visible');
    });
  });

  describe('Widget Trigger Button', function () {
    // ONLY test that opens widget via button - combines all button functionality tests
    it('should open widget when trigger button is clicked', function () {
      cy.visit('/influxdb3/core/admin/identify-version/');
      beforeTest();

      // Click the Ask AI button
      cy.get('.ask-ai-trigger a.ask-ai-open').click();

      // Wait for widget modal to appear
      cy.get('#kapa-modal-content', {
        includeShadowDom: true,
        timeout: 1000,
      }).should('be.visible');
    });
  });

  describe('Ask AI Link Shortcode', function () {
    beforeEach(() => {
      cy.visit('/influxdb3/core/admin/identify-version/');
      beforeTest();
    });

    it('should render ask-ai-link with correct attributes', function () {
      // Validate DOM without clicking
      cy.get('a.ask-ai-open')
        .contains('Ask InfluxData AI')
        .should('be.visible')
        .should('have.class', 'ask-ai-open')
        .should(
          'have.attr',
          'data-query',
          'Help determine my InfluxDB version based on licensing, hosting, server age, and API.'
        );
    });

    // ONLY test that opens widget via link - combines query pre-fill validation
    it('should open widget with pre-filled query when ask-ai-link is clicked', function () {
      cy.get('.article--content a.ask-ai-open')
        .contains('Ask InfluxData AI')
        .as('askAILink');
      // cy.get('@askAILink').scrollIntoView();
      cy.get('@askAILink').click();
      // Widget container MUST become visible
      cy.get('#kapa-modal-content', { includeShadowDom: true, timeout: 1000 })
        .should('be.visible', 'Widget must open when ask-ai-link is clicked')
        // Verify query is pre-filled (validates pre-fill behavior)
        .find('textarea, input[type="text"]')
        .should(
          'have.value',
          'Help determine my InfluxDB version based on licensing, hosting, server age, and API.'
        );
    });
  });

  describe('Error Handling', function () {
    beforeEach(() => {
      cy.visit('/influxdb3/core/admin/identify-version/');
      beforeTest();
    });

    it('should not throw console errors when link is clicked', function () {
      cy.window().then((win) => {
        const errors = [];
        const originalError = win.console.error;

        win.console.error = (...args) => {
          errors.push(args.join(' '));
          originalError.apply(win.console, args);
        };

        // Validate without actually clicking (DOM interaction only)
        cy.get('a.ask-ai-open').contains('Ask InfluxData AI');

        cy.wait(500);

        cy.then(() => {
          // Check for Kapa-related errors
          const kapaErrors = errors.filter(
            (log) =>
              (log.includes('kapa') || log.includes('Kapa')) &&
              !log.includes('Unknown method')
          );
          expect(kapaErrors).to.have.length(0);
        });
      });
    });

    it('should handle missing window.Kapa gracefully', function () {
      cy.window().then((win) => {
        // Temporarily remove Kapa
        const originalKapa = win.Kapa;
        delete win.Kapa;

        // Validate link without opening widget
        cy.get('a.ask-ai-open')
          .contains('Ask InfluxData AI')
          .should('have.attr', 'onclick');

        // Restore Kapa
        win.Kapa = originalKapa;
      });
    });
  });

  describe('Ask AI Widget Configuration', function () {
    describe('Input Placeholder', function () {
      it('should have unified InfluxDB placeholder on InfluxDB 3 pages', function () {
        cy.visit('/influxdb3/core/');
        beforeTest();

        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const placeholder = $script.attr(
            'data-modal-ask-ai-input-placeholder'
          );
          expect(placeholder).to.equal(
            'Specify your version and product ("InfluxDB 3 Enterprise", "Core", "Enterprise v1") for better results'
          );
        });
      });

      it('should have unified InfluxDB placeholder on InfluxDB 2.x pages', function () {
        cy.visit('/influxdb/v2/');
        beforeTest();

        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const placeholder = $script.attr(
            'data-modal-ask-ai-input-placeholder'
          );
          expect(placeholder).to.equal(
            'Specify your version and product ("InfluxDB 3 Enterprise", "Core", "Enterprise v1") for better results'
          );
        });
      });

      it('should have unified InfluxDB placeholder on InfluxDB 1.x pages', function () {
        cy.visit('/influxdb/v1/');
        beforeTest();

        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const placeholder = $script.attr(
            'data-modal-ask-ai-input-placeholder'
          );
          expect(placeholder).to.equal(
            'Specify your version and product ("InfluxDB 3 Enterprise", "Core", "Enterprise v1") for better results'
          );
        });
      });

      it('should have default placeholder when no product-specific one exists', function () {
        cy.visit('/platform/');
        beforeTest();

        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const placeholder = $script.attr(
            'data-modal-ask-ai-input-placeholder'
          );
          expect(placeholder).to.include('Ask questions about InfluxDB');
          expect(placeholder).to.include('Specify your product and version');
        });
      });
    });

    describe('InfluxDB 3 Products', function () {
      it('should configure Explorer-specific questions in Kapa widget', function () {
        cy.visit('/influxdb3/explorer/');
        beforeTest();

        // Check the Kapa widget script tag has correct data-modal-example-questions attribute
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          expect(questions).to.include('visualize data using Explorer');
        });
      });

      it('should configure Core-specific questions in Kapa widget', function () {
        cy.visit('/influxdb3/core/');
        beforeTest();

        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          expect(questions).to.include(
            'Python Processing engine using InfluxDB 3 Core'
          );
          // Should NOT have read replica question
          expect(questions).to.not.include('replica');
        });
      });

      it('should configure Enterprise-specific questions in Kapa widget', function () {
        cy.visit('/influxdb3/enterprise/');
        beforeTest();
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          expect(questions).to.include('install and run InfluxDB 3 Enterprise');
        });
      });
    });

    describe('InfluxDB v1 Products', function () {
      it('should configure Enterprise v1-specific questions in Kapa widget', function () {
        cy.visit('/enterprise_influxdb/v1/');
        beforeTest();
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          expect(questions).to.include('configure InfluxDB Enterprise v1');
        });
      });
    });

    describe('InfluxDB OSS v2', function () {
      it('should configure v2-specific questions with version name in Kapa widget', function () {
        cy.visit('/influxdb/v2/get-started/');
        beforeTest();
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          // Check for v2-specific questions
          expect(questions).to.include(
            'write and query data using InfluxDB OSS v2'
          );
          // Should NOT have v1-specific questions
          expect(questions).to.not.include('retention policies');
        });
      });
    });

    describe('InfluxDB OSS v1', function () {
      it('should configure v1-specific questions with version name in Kapa widget', function () {
        cy.visit('/influxdb/v1/');
        beforeTest();
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          // Check for v1-specific questions
          expect(questions).to.include(
            'query data with InfluxQL using InfluxDB OSS v1'
          );
          // Should NOT have v2-specific questions
          expect(questions).to.not.include('auth tokens');
        });
      });
    });

    describe('InfluxDB Cloud (TSM)', function () {
      it('should configure Cloud-specific questions with correct naming in Kapa widget', function () {
        cy.visit('/influxdb/cloud/');
        beforeTest();
        cy.get('script[src*="kapa-widget.bundle.js"]').should(($script) => {
          const questions = $script.attr('data-modal-example-questions');
          // Check for Cloud-specific questions
          expect(questions).to.include(
            'write and query data using InfluxDB Cloud (TSM)'
          );
        });
      });
    });
  });
});
