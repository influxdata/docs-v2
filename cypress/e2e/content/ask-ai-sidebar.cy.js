/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures.js';
import { mockKapaWidget } from '../../support/kapa-widget.js';

const launcher = '.ask-ai-button';
const page = '/influxdb3/core/get-started/write/';

function finishRender() {
  cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
  cy.window().then((win) => win.kapaHarness.finishRender());
}

describe('Ask AI button lifecycle', () => {
  for (const width of [390, 600, 601]) {
    it(`closes and reopens the conversation at ${width}px`, () => {
      cy.viewport(width, 844);
      mockKapaWidget();
      cy.visit(page);
      dismissNotifications();
      cy.get(launcher).click();
      finishRender();
      cy.get('#kapa-modal-content textarea').type(
        'Keep this conversation{enter}'
      );
      cy.get('.docs-ask-ai-close').should('have.length', 1);
      if (width <= 600) {
        cy.get('.mantine-Modal-close').should('not.be.visible');
        cy.get('.docs-ask-ai-close').should('be.visible').click();
      } else {
        cy.get('.docs-ask-ai-close').should('not.be.visible');
        cy.get('.mantine-Modal-close').should('be.visible').click();
      }
      cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
      cy.get('.article--content').should('be.visible');
      cy.get(launcher).should('be.focused').click();
      cy.get('#kapa-modal-content').should('contain', 'Keep this conversation');
    });
  }

  it('opens once, keeps navigation usable, and reopens vendor conversation history', () => {
    cy.viewport(1280, 1024);
    mockKapaWidget();
    cy.visit(page);
    dismissNotifications();
    cy.get(launcher).click().should('have.attr', 'aria-disabled', 'true');
    cy.get(launcher).trigger('keydown', { key: 'k', ctrlKey: true });
    cy.get('[data-page-rail] nav').should('be.visible');
    finishRender();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('.ask-ai-composer, #chat-assistant-textarea').should('not.exist');
    const question = 'How do I write data?';
    cy.get('#kapa-modal-content textarea').type(`${question}{enter}`);
    cy.get('#kapa-modal-content').should('contain', question);
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.contains('button', 'Close chat').click();
    cy.get(launcher).should('be.enabled').and('be.focused').click();
    cy.get('#kapa-modal-content').should('contain', question);
    cy.window().then((win) => {
      expect(win.kapaHarness.requests).to.have.length(2);
      expect(
        win.kapaHarness.requests.every((request) => !request.submit)
      ).to.eq(true);
      expect(win.kapaHarness.queries).to.deep.eq([question]);
    });
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
  });

  it('reuses a late widget after readiness timeout without submitting', () => {
    mockKapaWidget();
    cy.visit(page);
    dismissNotifications();
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
    cy.get(launcher).click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.tick(30001);
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get(launcher).should('be.enabled').and('be.focused').click();
    finishRender();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
    cy.window().then((win) => {
      expect(win.kapaHarness.requests).to.have.length(1);
      expect(win.kapaHarness.requests[0].submit).to.eq(false);
    });
  });

  it('retries render failure without loading a second widget', () => {
    mockKapaWidget({ renderFailures: 1 });
    cy.visit(page);
    dismissNotifications();
    cy.get(launcher).click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('#ask-ai-status').should('contain', 'Try again');
    cy.get(launcher).should('be.enabled').click();
    finishRender();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
  });

  it('restores the launcher and navigation after an open timeout', () => {
    mockKapaWidget({ openAcknowledgment: false });
    cy.visit(page);
    dismissNotifications();
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
    cy.get(launcher).click();
    finishRender();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'opening');
    cy.tick(10001);
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get(launcher).should('be.enabled').and('be.focused');
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.window().then((win) => {
      win.kapaHarness.openAcknowledgment = true;
    });
    cy.get(launcher).click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
  });

  it('retries the rendered widget after an open exception', () => {
    mockKapaWidget({ openFailures: 1 });
    cy.visit(page);
    dismissNotifications();
    cy.get(launcher).click();
    finishRender();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get(launcher).should('be.enabled').and('be.focused').click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
  });
});
