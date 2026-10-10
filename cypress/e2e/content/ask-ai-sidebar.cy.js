/// <reference types="cypress" />
import { mockKapaWidget } from '../../support/kapa-widget';

describe('Ask AI handoff', () => {
  it('keeps navigation usable while submitting one unchanged question and reopening history', () => {
    cy.viewport(1280, 1024);
    mockKapaWidget();
    cy.visit('/influxdb3/core/get-started/write/');
    cy.get('body').then(($body) => {
      const dismiss = $body.find('.notification:visible .close-notification');
      if (dismiss.length) cy.wrap(dismiss).click({ multiple: true });
    });
    const question = '  How do I write data?\nKeep this line.  ';
    cy.get('#chat-assistant-textarea')
      .should('be.visible')
      .invoke('val', question)
      .trigger('input');
    cy.get('[data-ask-ai-action="submit"]').click();
    cy.get('[data-ask-ai-action="submit"]').should('be.disabled');
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
});
