/// <reference types="cypress" />

/**
 * Code Controls E2E Test Suite
 *
 * Tests for the code block controls menu (code-controls.js):
 * - Initialization: wraps code blocks, appends control menus
 * - Toggle: opens/closes menu on click, closes on outside click
 * - Copy to clipboard: success/failure lifecycle
 * - Fullscreen: opens modal with cloned code, closes and restores
 * - Ask AI: delegates to global ask-ai-open handler
 *
 * TEST SCENARIOS CHECKLIST:
 *
 * Initialization:
 * ---------------
 * - [x] Code blocks are wrapped in .codeblock divs
 * - [x] Each codeblock has a .code-controls container
 * - [x] Controls contain toggle, copy, Ask AI, and fullscreen items
 * - [x] Menu is hidden by default (toggle visible)
 * - [x] Ask AI is in the middle (2nd) position
 * - [x] Controls use accessible markup (buttons, ARIA roles)
 *
 * Toggle Behavior:
 * ----------------
 * - [x] Clicking toggle opens menu (adds .open class)
 * - [x] Clicking outside closes menu
 * - [x] Copy button keeps menu open (stopPropagation)
 *
 * Copy to Clipboard:
 * ------------------
 * - [x] Copy button shows "Copied!" on success
 * - [x] Copy button shows success class temporarily
 * - [x] Success state reverts after timeout
 *
 * Fullscreen Mode:
 * ----------------
 * - [x] Fullscreen button opens modal
 * - [x] Modal contains cloned code content
 * - [x] Close button dismisses modal
 * - [x] Body scroll is disabled while fullscreen
 *
 * Ask AI Code:
 * ------------
 * - [x] Ask AI button synthesizes ask-ai-open element with query
 * - [x] Query includes "Explain this code" prefix and code content
 */

const TEST_PAGE = '/influxdb3/core/admin/identify-version/';

function beforeTest() {
  cy.viewport(1440, 900);
}

describe('Code Controls', function () {
  describe('Initialization', function () {
    beforeEach(() => {
      cy.visit(TEST_PAGE);
      beforeTest();
    });

    it('should wrap code blocks in .codeblock divs', function () {
      cy.get('.article--content .codeblock').should('have.length.at.least', 1);
      cy.get('.article--content .codeblock > pre').should(
        'have.length.at.least',
        1
      );
    });

    it('should append code-controls to each codeblock', function () {
      cy.get('.article--content .codeblock').each(($block) => {
        cy.wrap($block).find('.code-controls').should('exist');
        cy.wrap($block)
          .find('.code-controls .code-controls-toggle')
          .should('exist');
        cy.wrap($block)
          .find('.code-controls .code-control-options')
          .should('exist');
      });
    });

    it('should have copy, Ask AI, and fullscreen items in order', function () {
      cy.get('.article--content .codeblock')
        .first()
        .within(() => {
          cy.get('.code-control-options button[role="menuitem"]')
            .eq(0)
            .should('have.class', 'copy-code');
          cy.get('.code-control-options button[role="menuitem"]')
            .eq(1)
            .should('have.class', 'ask-ai-code');
          cy.get('.code-control-options button[role="menuitem"]')
            .eq(2)
            .should('have.class', 'fullscreen-toggle');
        });
    });

    it('should use accessible markup for controls', function () {
      cy.get('.article--content .codeblock')
        .first()
        .within(() => {
          // Toggle is a button with aria attributes
          cy.get('.code-controls-toggle')
            .should('have.attr', 'aria-label', 'Code block options')
            .and('have.attr', 'aria-expanded', 'false');

          // Menu has role="menu"
          cy.get('.code-control-options').should('have.attr', 'role', 'menu');

          // Menu items are buttons with role="menuitem"
          cy.get('.code-control-options button[role="menuitem"]').should(
            'have.length',
            3
          );
        });
    });

    it('should show toggle and hide menu by default', function () {
      cy.get('.article--content .code-controls')
        .first()
        .should('not.have.class', 'open');
      cy.get('.article--content .code-controls-toggle')
        .first()
        .should('be.visible');
    });
  });

  describe('Toggle Behavior', function () {
    beforeEach(() => {
      cy.visit(TEST_PAGE);
      beforeTest();
    });

    it('should open menu when toggle is clicked', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .code-controls')
        .first()
        .should('have.class', 'open');
      cy.get('.article--content .code-control-options')
        .first()
        .should('be.visible');
    });

    it('should close menu when clicking outside', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .code-controls')
        .first()
        .should('have.class', 'open');

      // Click a heading element (neutral area, not inside a code block)
      cy.get('.article--content h2').first().click({ force: true });
      cy.get('.article--content .code-controls')
        .first()
        .should('not.have.class', 'open');
    });

    it('should keep menu open when copy is clicked', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .code-controls')
        .first()
        .should('have.class', 'open');

      // Click copy — menu should stay open (stopPropagation)
      cy.get('.article--content .copy-code').first().click();
      cy.get('.article--content .code-controls')
        .first()
        .should('have.class', 'open');
    });
  });

  describe('Copy to Clipboard', function () {
    beforeEach(() => {
      cy.visit(TEST_PAGE);
      beforeTest();

      // Stub navigator.clipboard.writeText to avoid permission issues
      cy.window().then((win) => {
        cy.stub(win.navigator.clipboard, 'writeText').resolves();
      });
    });

    it('should show "Copied!" text on successful copy', function () {
      // Open the menu
      cy.get('.article--content .code-controls-toggle').first().click();

      // Click copy
      cy.get('.article--content .copy-code').first().click();

      // Verify success lifecycle
      cy.get('.article--content .copy-code')
        .first()
        .should('have.class', 'success');
      cy.get('.article--content .copy-code .message')
        .first()
        .should('contain', 'Copied!');
    });

    it('should revert to "Copy" after success timeout', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .copy-code').first().click();

      // Verify success state appears
      cy.get('.article--content .copy-code')
        .first()
        .should('have.class', 'success');

      // Wait for the 2500ms timeout to elapse, then verify revert
      cy.get('.article--content .copy-code', { timeout: 4000 })
        .first()
        .should('not.have.class', 'success');
      cy.get('.article--content .copy-code .message')
        .first()
        .should('contain', 'Copy');
    });
  });

  describe('Fullscreen Mode', function () {
    beforeEach(() => {
      cy.visit(TEST_PAGE);
      beforeTest();
    });

    it('should open fullscreen modal with code content', function () {
      // Get the code text from the first code block
      cy.get('.article--content .codeblock pre code')
        .first()
        .invoke('text')
        .then((codeText) => {
          // Open menu and click fullscreen
          cy.get('.article--content .code-controls-toggle').first().click();
          cy.get('.article--content .fullscreen-toggle').first().click();

          // Modal should be visible
          cy.get('.fullscreen-code').should('be.visible');

          // Modal should contain the code content
          cy.get('.fullscreen-code pre code').should(
            'contain',
            codeText.trim()
          );
        });
    });

    it('should disable body scroll when fullscreen is open', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .fullscreen-toggle').first().click();

      cy.get('.fullscreen-code').should('be.visible');
      cy.get('body').should('have.css', 'overflow', 'hidden');
    });

    it('should close fullscreen and restore scroll on close click', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .fullscreen-toggle').first().click();
      cy.get('.fullscreen-code').should('be.visible');

      // Click close button
      cy.get('.fullscreen-close').click();

      // Modal should fade out
      cy.get('.fullscreen-code').should('not.be.visible');
      cy.get('body').should('have.css', 'overflow', 'auto');
    });

    it('should replace code with placeholder after closing', function () {
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .fullscreen-toggle').first().click();
      cy.get('.fullscreen-code').should('be.visible');

      cy.get('.fullscreen-close').click();
      cy.get('.fullscreen-code').should('not.be.visible');

      // The placeholder should be restored
      cy.get('#fullscreen-code-placeholder').should('exist');
    });
  });

  describe('Ask AI Code Button', function () {
    it('should open Ask AI widget when clicked', function () {
      cy.visit(TEST_PAGE);
      beforeTest();

      // Open menu and click Ask AI
      cy.get('.article--content .code-controls-toggle').first().click();
      cy.get('.article--content .ask-ai-code').first().click();

      // The Kapa modal should become visible
      cy.get('#kapa-modal-content', {
        includeShadowDom: true,
        timeout: 5000,
      }).should('be.visible');
    });

    it('should synthesize ask-ai-open element with query from code block', function () {
      cy.visit(TEST_PAGE);
      beforeTest();

      // Capture the data-query from the synthesized ask-ai-open element
      // by observing DOM mutations before code-controls removes it
      cy.window().then((win) => {
        const capturedQueries = [];

        // MutationObserver catches the transient <a class="ask-ai-open">
        // that code-controls appends to body then removes
        const observer = new win.MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              if (
                node.nodeType === 1 &&
                node.classList?.contains('ask-ai-open')
              ) {
                capturedQueries.push(node.getAttribute('data-query'));
              }
            }
          }
        });
        observer.observe(win.document.body, { childList: true });

        // Get first code block text for comparison
        cy.get('.article--content .codeblock pre')
          .first()
          .invoke('text')
          .then((codeText) => {
            const firstLine = codeText.trim().split('\n')[0];

            // Open menu and click Ask AI
            cy.get('.article--content .code-controls-toggle').first().click();
            cy.get('.article--content .ask-ai-code').first().click();

            // Verify the query was constructed correctly
            cy.wrap(capturedQueries, { timeout: 3000 }).should(
              'have.length.at.least',
              1
            );
            cy.then(() => {
              observer.disconnect();
              const query = capturedQueries[0];
              expect(query).to.include('Explain this code');
              expect(query).to.include(firstLine);
            });
          });
      });
    });
  });
});
