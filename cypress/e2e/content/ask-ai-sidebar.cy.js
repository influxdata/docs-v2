/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures';
import { mockKapaWidget } from '../../support/kapa-widget';

describe('Ask AI handoff', () => {
  it('keeps navigation usable while submitting one unchanged question and reopening history', () => {
    cy.viewport(1280, 1024);
    mockKapaWidget();
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    const question = '  How do I write data?\nKeep this line.  ';
    cy.get('#chat-assistant-textarea')
      .should('be.visible')
      .invoke('val', question)
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.get('[data-ask-ai-action="submit"]').should('be.disabled');
    cy.get('#chat-assistant-textarea').trigger('keydown', { key: 'Enter' });
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('#chat-assistant-textarea')
      .should('not.be.visible')
      .should('have.value', '');
    cy.get('#kapa-modal-content').should('contain', question);
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('.article--content').then(($article) =>
      expect($article[0].getBoundingClientRect().width).to.be.at.least(400)
    );
    cy.contains('button', 'Close chat').click();
    cy.get('#chat-assistant-textarea').should('be.visible').and('be.focused');
    cy.get('[data-ask-ai-action="open"]').click();
    cy.get('#kapa-modal-content').should('contain', question);
    cy.window().then((win) => {
      expect(win.kapaHarness.requests).to.have.length(2);
      expect(win.kapaHarness.requests[0]).to.include({
        query: question,
        submit: true,
      });
      expect(win.kapaHarness.requests[1].submit).to.eq(false);
    });
  });
  it('retains a timed-out draft and reuses a late widget without submitting it automatically', () => {
    mockKapaWidget();
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Retain this draft')
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.tick(30001);
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('#chat-assistant-textarea')
      .should('have.value', 'Retain this draft')
      .and('be.focused');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.get('script[src="https://widget.kapa.ai/kapa-widget.bundle.js"]').should(
      'have.length',
      1
    );
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
  });
  it('retries a render failure without loading or registering a second widget', () => {
    mockKapaWidget({ renderFailures: 1 });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Draft after render error')
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
  });
  it('retains the draft until acknowledgment and restores it after an open timeout', () => {
    mockKapaWidget({ acknowledge: false });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.clock(Date.now(), ['setTimeout', 'clearTimeout']);
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Unacknowledged draft')
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('#chat-assistant-textarea').should(
      'have.value',
      'Unacknowledged draft'
    );
    cy.tick(10001);
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('#chat-assistant-textarea')
      .should('be.visible')
      .and('be.focused')
      .and('have.value', 'Unacknowledged draft');
    cy.get('[data-page-rail] nav').should('be.visible');
  });
  it('restores the draft after an open exception and retries the rendered widget', () => {
    mockKapaWidget({ openFailures: 1 });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('#chat-assistant-textarea')
      .invoke('val', 'Retry opening')
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'error');
    cy.get('#chat-assistant-textarea')
      .should('have.value', 'Retry opening')
      .and('be.focused');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.window().then((win) =>
      expect(win.kapaHarness.requests).to.have.length(1)
    );
    cy.get('script[src*="kapa-widget"]').should('have.length', 1);
  });
});
