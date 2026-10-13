/// <reference types="cypress" />

const page = '/influxdb3/core/get-started/write/';
const question = 'How do I write data to InfluxDB 3?';

function expectWidgetWidth(width) {
  cy.viewport(width, 1024);
  const expected = width <= 600 ? width : width > 1440 ? 386 : 360;
  cy.get('#kapa-widget-container')
    .shadow()
    .find('#kapa-modal-content')
    .should(($dialog) => {
      const bounds = $dialog[0].getBoundingClientRect();
      expect(bounds.width).to.be.closeTo(expected, 1);
      expect(bounds.right).to.be.closeTo(width, 1);
      expect($dialog.attr('aria-modal')).to.eq(width < 1280 ? 'true' : 'false');
    });
  if (width < 1280) {
    cy.get('[data-page-rail]').should('not.be.visible');
  } else {
    cy.get('.article--content').should(($article) => {
      const article = $article[0];
      const style = getComputedStyle(article);
      const textWidth =
        article.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      expect(textWidth).to.be.at.least(400);
    });
  }
}

describe('Live Kapa conversation', () => {
  it('submits a question, completes an answer, and retains history after reopening', () => {
    cy.viewport(1280, 1024);
    cy.visit(page);
    cy.get('.ask-ai-button').should('be.visible').click();
    cy.get('body', { timeout: 60000 }).should(
      'have.attr',
      'data-ask-ai-state',
      'open'
    );
    cy.get('.ask-ai-composer, #chat-assistant-textarea').should('not.exist');

    for (const width of [
      1280, 1281, 1440, 1441, 1920, 1279, 1024, 801, 800, 601, 600, 390,
    ]) {
      expectWidgetWidth(width);
    }
    cy.viewport(1280, 1024);
    cy.get('[data-page-rail] a[href="#construct-line-protocol"]').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('.sidebar-toggle[data-state="open"] [data-action="toggle"]').click();
    cy.get('body').should('have.attr', 'data-sidebar-state', 'closed');
    cy.get(
      '.sidebar-toggle[data-state="closed"] [data-action="toggle"]'
    ).click();
    cy.get('body').should('have.attr', 'data-sidebar-state', 'open');

    const themeColors = {};
    for (const theme of ['dark', 'light']) {
      cy.get(`.theme-switch-${theme}`).click();
      cy.get('body').should('have.attr', 'data-theme', theme);
      cy.get('#kapa-widget-container')
        .shadow()
        .find('#kapa-modal-content')
        .then(($dialog) => {
          themeColors[theme] = getComputedStyle($dialog[0]).backgroundColor;
        });
    }
    cy.then(() => expect(themeColors.dark).not.to.eq(themeColors.light));

    cy.window().then((win) => {
      win.liveAnswerCompleted = false;
      win.liveQueryAcknowledged = false;
      win.Kapa('onAskAIQuerySubmit', (data) => {
        if (data?.question === question) win.liveQueryAcknowledged = true;
      });
      win.Kapa('onAskAIAnswerCompleted', () => {
        win.liveAnswerCompleted = true;
      });
    });

    cy.get('#kapa-widget-container')
      .shadow()
      .find('#kapa-modal-content textarea')
      .should('be.visible')
      .type(`${question}{enter}`);
    cy.window({ timeout: 30000 })
      .its('liveQueryAcknowledged')
      .should('eq', true);
    cy.window({ timeout: 90000 }).its('liveAnswerCompleted').should('eq', true);
    cy.get('#kapa-widget-container')
      .shadow()
      .find('#kapa-modal-content')
      .should('contain', question);

    cy.window().then((win) => win.Kapa.close());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
    cy.get('.ask-ai-button').click();
    cy.get('body', { timeout: 60000 }).should(
      'have.attr',
      'data-ask-ai-state',
      'open'
    );
    cy.get('#kapa-widget-container')
      .shadow()
      .find('#kapa-modal-content')
      .should('contain', question);
    cy.get('script[src="https://widget.kapa.ai/kapa-widget.bundle.js"]').should(
      'have.length',
      1
    );
  });
});
