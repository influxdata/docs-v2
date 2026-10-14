/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures.js';
import { mockKapaWidget } from '../../support/kapa-widget.js';

function finishRender() {
  cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
  cy.window().then((win) => win.kapaHarness.finishRender());
  cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
}

describe('Ask AI entry points', () => {
  beforeEach(() => mockKapaWidget());

  it('prefills the existing version-help link without submitting and preserves its analytics', () => {
    cy.visit('/influxdb3/core/admin/identify-version/');
    cy.window().then((win) => {
      win.gtag = cy.stub().as('analytics');
    });
    dismissNotifications();
    cy.get('.article--content .ask-ai-open')
      .first()
      .then(($link) => {
        const query = $link.attr('data-query');
        cy.wrap($link).click();
        finishRender();
        cy.window().then((win) => {
          expect(win.kapaHarness.requests).to.have.length(1);
          expect(win.kapaHarness.requests[0]).to.include({
            query,
            submit: false,
          });
          expect(win.kapaHarness.requests[0].groups).not.to.be.empty;
        });
      });
    cy.get('@analytics').should('have.been.calledWith', 'event');
    cy.get('script[src*="kapa-widget"]')
      .should('have.attr', 'data-modal-disclaimer')
      .and('include', 'Privacy Policy');
    cy.get('script[src*="kapa-widget"]').should(
      'have.attr',
      'data-user-analytics-fingerprint-enabled',
      'true'
    );
  });

  it('keeps only the header button and opens without submitting', () => {
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('.ask-ai-composer, #chat-assistant-textarea').should('not.exist');
    cy.get('.ask-ai-button').should('be.visible').click();
    cy.get('.ask-ai-button').should('have.attr', 'aria-disabled', 'true');
    finishRender();
    cy.window().then((win) => {
      expect(win.kapaHarness.requests).to.have.length(1);
      expect(win.kapaHarness.requests[0]).to.include({
        query: '',
        submit: false,
      });
    });
  });

  it('restores the expanded ToC after narrow chat closes', () => {
    cy.viewport(1024, 768);
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail] button').click();
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('[data-ask-ai-action="open"]').click();
    cy.get('[data-page-rail]').should('not.be.visible');
    finishRender();
    cy.get('#kapa-modal-content').should('have.attr', 'aria-modal', 'true');
    cy.contains('button', 'Close chat').click();
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('[data-ask-ai-action="open"]').should('be.focused');
  });

  it('restores keyboard focus after opening from the narrow ToC', () => {
    cy.viewport(1024, 768);
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail] button').click();
    cy.get('[data-page-rail] nav a').first().as('origin').focus();
    cy.get('@origin').trigger('keydown', { key: 'k', ctrlKey: true });
    cy.get('.ask-ai-button').should('be.focused');
    cy.get('.ask-ai-button').should('have.attr', 'aria-busy', 'true');
    finishRender();
    cy.contains('button', 'Close chat').click();
    cy.get('@origin').should('be.focused');
  });

  it('restores navigation after script failure and allows button retry', () => {
    cy.intercept(
      { url: 'https://widget.kapa.ai/kapa-widget.bundle.js', times: 1 },
      { statusCode: 503, body: 'Unavailable' }
    );
    cy.viewport(1024, 768);
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail] button').click();
    cy.get('.ask-ai-button').click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('#ask-ai-status').should('contain', 'Try again');
    cy.get('.ask-ai-button').should('be.enabled').and('be.focused');
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('.ask-ai-button').click();
    finishRender();
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
  });

  it('provides homepage chat and excludes the launcher on 404', () => {
    cy.visit('/');
    cy.get('.ask-ai-button').should('be.visible');
    cy.get('[data-page-rail]').should('not.exist');
    cy.get('[data-ask-ai-action="open"]').click();
    finishRender();
    cy.request('/404.html')
      .its('body')
      .then((html) => {
        const page = new DOMParser().parseFromString(html, 'text/html');
        expect(
          page.querySelector(
            '#chat-assistant-textarea, [data-ask-ai-action="open"]'
          )
        ).to.eq(null);
      });
  });
  it('prefills the code-block entry point without submitting', () => {
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('.codeblock:visible')
      .first()
      .within(() => {
        cy.get('.code-controls-toggle').click();
        cy.get('.ask-ai-code').click();
      });
    finishRender();
    cy.window().then((win) => {
      expect(win.kapaHarness.requests).to.have.length(1);
      expect(win.kapaHarness.requests[0].submit).to.eq(false);
      expect(win.kapaHarness.requests[0].query).not.to.be.empty;
    });
    cy.contains('button', 'Close chat').click();
    cy.get('.ask-ai-button').should('be.focused');
  });
});
