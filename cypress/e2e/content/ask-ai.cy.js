/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures';
import { mockKapaWidget } from '../../support/kapa-widget';

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

  it('keeps whitespace, Shift+Enter, and IME Enter in the composer', () => {
    cy.visit('/influxdb3/core/get-started/write/');
    cy.get('#chat-assistant-textarea').invoke('val', '   ').trigger('input');
    cy.get('[data-ask-ai-action="submit"]').should('be.disabled');
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Draft')
      .trigger('input')
      .trigger('keydown', { key: 'Enter', shiftKey: true })
      .trigger('keydown', { key: 'Enter', isComposing: true });
    cy.get('script[src*="kapa-widget"]').should('not.exist');
    cy.get('#chat-assistant-textarea').should('have.value', 'Draft');
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

  it('restores the draft and ToC after script failure and allows retry', () => {
    cy.intercept(
      { url: 'https://widget.kapa.ai/kapa-widget.bundle.js', times: 1 },
      { statusCode: 503, body: 'Unavailable' }
    );
    cy.viewport(1024, 768);
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail] button').click();
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Saved question')
      .trigger('input')
      .trigger('keydown', { key: 'Enter' });
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('[role="status"]').should('contain', 'Your draft is saved');
    cy.get('#chat-assistant-textarea')
      .should('have.value', 'Saved question')
      .and('be.focused');
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('[data-ask-ai-action="submit"]').click();
    finishRender();
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
  });

  it('provides homepage chat and excludes the composer and header trigger on 404', () => {
    cy.visit('/');
    cy.get('#chat-assistant-textarea').should('be.visible');
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
    cy.get('#chat-assistant-textarea').should('be.focused');
  });
});
