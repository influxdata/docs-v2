/// <reference types="cypress" />

/**
 * E2E tests for the Telegraf Controller gated downloads module (tc-downloads.js).
 *
 * Tests the four key user-facing behaviors:
 *   1. Gated state  — no localStorage key → button visible, links hidden
 *   2. Ungated state — localStorage key present → links rendered, button hidden
 *   3. Query param  — ?ref=tc visit → key set, downloads shown
 *   4. Signature links — one per build, plus the signed digests file
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

    it('renders a signature link for each build', () => {
      cy.get('.tc-build-row').each(($row) => {
        cy.wrap($row).find('.tc-signature-link').should('have.length', 1);
      });
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

  describe('Signature and digests links', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.visit(PAGE_URL, {
        onBeforeLoad(win) {
          win.localStorage.setItem(STORAGE_KEY, 'true');
        },
      });
    });

    it('each build signature link points at the executable\'s .asc file', () => {
      cy.get('.tc-build-row').each(($row) => {
        const binary = $row.find('.tc-download-link').attr('href');
        const signature = $row.find('.tc-signature-link').attr('href');
        expect(signature).to.equal(`${binary}.asc`);
      });
    });

    it('renders the digests file and its signature', () => {
      cy.get('.tc-digests .tc-download-link')
        .should('have.attr', 'href')
        .and('match', /telegraf_controller-[0-9.]+\.digests$/);
      cy.get('.tc-digests .tc-signature-link')
        .should('have.attr', 'href')
        .and('match', /\.digests\.asc$/);
    });
  });
});
