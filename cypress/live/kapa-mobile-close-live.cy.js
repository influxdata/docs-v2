/// <reference types="cypress" />
import { dismissNotifications } from '../support/page-fixtures.js';

const page = '/influxdb3/core/get-started/write/';
const question =
  'How do I write data to InfluxDB 3 Core? Give a detailed step-by-step tutorial with line protocol, CLI, Python examples, timestamps, and common troubleshooting steps.';

const mobileClose = '#kapa-modal-content .docs-ask-ai-close';

function luminance(color) {
  const channels = color
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number);
  const linear = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function expectCloseControl(width) {
  const widget = () => cy.get('#kapa-widget-container').shadow();
  widget()
    .find('.mantine-Modal-header h4')
    .should('have.text', 'Ask AI');
  widget().find(mobileClose).should('have.length', 1);
  if (width > 600) {
    widget().find(mobileClose).should('not.be.visible');
    widget().find('.mantine-Modal-close').should('be.visible');
    return;
  }
  widget()
    .find(mobileClose)
    .should('be.visible')
    .and('have.attr', 'aria-label', 'Close Ask AI')
    .should(($button) => {
      const button = $button[0];
      const bounds = button.getBoundingClientRect();
      expect(bounds.width).to.eq(44);
      expect(bounds.height).to.eq(44);
      expect(bounds.left).to.be.at.least(0);
      expect(bounds.top).to.be.at.least(0);
      expect(bounds.right).to.be.at.most(width);
      expect(bounds.bottom).to.be.at.most(
        button.ownerDocument.defaultView.innerHeight
      );
      const style = getComputedStyle(button);
      const foreground = luminance(style.color);
      const background = luminance(style.backgroundColor);
      expect(
        (Math.max(foreground, background) + 0.05) /
          (Math.min(foreground, background) + 0.05)
      ).to.be.at.least(4.5);
      const header = button.closest('header');
      for (const action of header.querySelectorAll('button, [role="button"]')) {
        if (action === button || !action.getClientRects().length) continue;
        expect(action.getBoundingClientRect().right).to.be.at.most(bounds.left);
      }
    });
  widget().find('.mantine-Modal-close').should('not.be.visible');
}

describe('Live mobile Ask AI close', () => {
  it('provides one clickable close control in both themes while resizing', () => {
    cy.viewport(1280, 1024);
    cy.visit(page);
    dismissNotifications();
    cy.get('.ask-ai-button').click();
    cy.get('body', { timeout: 60000 }).should(
      'have.attr',
      'data-ask-ai-state',
      'open'
    );
    for (const theme of ['dark', 'light']) {
      cy.viewport(1280, 1024);
      cy.get(`.theme-switch-${theme}`).click();
      cy.get('body').should('have.attr', 'data-theme', theme);
      for (const width of [390, 600, 601, 390]) {
        cy.viewport(width, 700);
        expectCloseControl(width);
        cy.screenshot(`ask-ai-header-${theme}-${width}`, {
          capture: 'viewport',
        });
        if (width > 600) continue;
        cy.get('#kapa-widget-container').shadow().find(mobileClose).click();
        cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
        cy.get('.article--content').should('be.visible');
        cy.get('.ask-ai-button').should('be.focused').click();
        cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
      }
    }
  });

  it('closes accessibly and retains a long conversation across themes and resizing', () => {
    cy.viewport(390, 700);
    cy.visit(page);
    dismissNotifications();
    cy.get('.ask-ai-button').click();
    cy.get('body', { timeout: 60000 }).should(
      'have.attr',
      'data-ask-ai-state',
      'open'
    );
    expectCloseControl(390);
    cy.get('#kapa-widget-container').shadow().find(mobileClose).click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
    cy.get('.ask-ai-button').should('be.focused').click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
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
    cy.intercept('POST', '**/proxy/query/v2/chat/stream').as('liveKapaAnswer');
    cy.get('#kapa-widget-container')
      .shadow()
      .find('#kapa-modal-content textarea')
      .should('be.visible')
      .type(`${question}{enter}`);
    cy.window()
      .its('liveQueryAcknowledged', { timeout: 30000 })
      .should('eq', true);
    let answerStatus;
    cy.wait('@liveKapaAnswer', { responseTimeout: 90000 }).then(
      ({ response }) => {
        answerStatus = response?.statusCode;
      }
    );
    cy.get('#kapa-widget-container').shadow().find(mobileClose).click();
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
    cy.get('.ask-ai-button').should('be.focused').click();
    cy.get('#kapa-widget-container')
      .shadow()
      .find('#kapa-modal-content')
      .should('contain', question);
    cy.then(() => expect(answerStatus, 'Kapa answer HTTP status').to.eq(200));
    cy.window()
      .its('liveAnswerCompleted', { timeout: 90000 })
      .should('eq', true);
    let conversation;
    cy.get('#kapa-widget-container')
      .shadow()
      .find('.scrollable-container')
      .then(($messages) => {
        conversation = $messages.text();
      });
    for (const theme of ['dark', 'light']) {
      cy.viewport(1280, 1024);
      cy.get(`.theme-switch-${theme}`).click();
      cy.get('body').should('have.attr', 'data-theme', theme);
      for (const width of [390, 600, 601, 390]) {
        cy.viewport(width, 700);
        expectCloseControl(width);
        cy.get('#kapa-widget-container')
          .shadow()
          .find('.scrollable-container')
          .should(($messages) => expect($messages.text()).to.eq(conversation));
        if (width > 600) continue;
        cy.get('#kapa-widget-container')
          .shadow()
          .find('.scrollable-container')
          .should(($messages) => {
            expect($messages[0].scrollHeight).to.be.greaterThan(
              $messages[0].clientHeight
            );
          })
          .scrollTo('bottom');
        expectCloseControl(width);
        cy.screenshot(`ask-ai-close-${theme}-${width}`, {
          capture: 'viewport',
        });
        cy.get('#kapa-widget-container').shadow().find(mobileClose).click();
        cy.get('body').should('have.attr', 'data-ask-ai-state', 'ready');
        cy.get('.article--content').should('be.visible');
        cy.get('.ask-ai-button').should('be.focused').click();
        cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
        cy.get('#kapa-widget-container')
          .shadow()
          .find('.scrollable-container')
          .should(($messages) => expect($messages.text()).to.eq(conversation));
      }
    }
    cy.get('script[src="https://widget.kapa.ai/kapa-widget.bundle.js"]').should(
      'have.length',
      1
    );
  });
});
