/// <reference types="cypress" />

/**
 * E2E tests for the Telegraf Controller gated downloads module (tc-downloads.js).
 *
 * Tests the four key user-facing behaviors:
 *   1. Gated state  — no localStorage key → button visible, links hidden
 *   2. Ungated state — localStorage key present → links rendered, button hidden
 *   3. Query param  — ?ref=tc visit → key set, downloads shown
 *   4. SHA copy button — present when downloads are rendered
 *
 * Marketo form submission is NOT tested (external dependency).
 */

const PAGE_URL = '/telegraf/controller/install/';
const STORAGE_KEY = 'influxdata_docs_tc_dl';

describe('Telegraf Controller gated downloads', () => {
  describe('Gated state (no localStorage key)', () => {
    beforeEach(() => {
      // Clear any existing key so the page starts in the gated state.
      cy.clearLocalStorage();
      cy.visit(PAGE_URL);
    });

    it('shows the download button', () => {
      cy.get('#tc-download-btn').should('be.visible');
    });

    it('keeps the download links container hidden', () => {
      cy.get('#tc-downloads-links').should('not.be.visible');
    });

    it('does not render download link anchors', () => {
      cy.get('.tc-download-link').should('not.exist');
    });
  });

  describe('Ungated state (localStorage key present)', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit(PAGE_URL, {
        onBeforeLoad(win) {
          win.localStorage.setItem(STORAGE_KEY, 'true');
        },
      });
    });

    it('hides the download button', () => {
      cy.get('#tc-download-btn').should('not.be.visible');
    });

    it('shows the downloads container', () => {
      cy.get('#tc-downloads-links').should('be.visible');
    });

    it('renders at least one download link', () => {
      cy.get('.tc-download-link').should('have.length.at.least', 1);
    });

    it('renders SHA copy buttons for each build', () => {
      cy.get('.tc-copy-sha').should('have.length.at.least', 1);
    });
  });

  describe('Query param flow (?ref=tc)', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit(`${PAGE_URL}?ref=tc`);
    });

    it('sets the localStorage key', () => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem(STORAGE_KEY)).to.equal('true');
      });
    });

    it('shows download links after the param is processed', () => {
      cy.get('.tc-download-link').should('have.length.at.least', 1);
    });

    it('strips the ?ref=tc param from the URL', () => {
      cy.url().should('not.include', 'ref=tc');
    });
  });

  describe('SHA copy button', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit(PAGE_URL, {
        onBeforeLoad(win) {
          win.localStorage.setItem(STORAGE_KEY, 'true');
        },
      });
    });

    it('each copy button carries a data-sha attribute', () => {
      cy.get('.tc-copy-sha').each(($btn) => {
        expect($btn.attr('data-sha')).to.be.a('string').and.not.be.empty;
      });
    });
  });
});
