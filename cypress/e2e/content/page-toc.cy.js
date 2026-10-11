/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures';
import { mockKapaWidget } from '../../support/kapa-widget';

describe('Article navigation', () => {
  it('opens a narrow-screen ToC and dismisses it after navigation', () => {
    cy.viewport(1024, 768);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', { body: '' });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail] nav').should('not.be.visible');
    cy.get('[data-page-rail] button')
      .should('have.attr', 'aria-expanded', 'false')
      .click();
    cy.get('[data-page-rail] nav').should('be.visible');
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('[data-page-rail] nav').should('not.be.visible');
    cy.focused().should('have.attr', 'id', 'construct-line-protocol');
  });
  it('navigates headings rendered from shared content at 1280px', () => {
    cy.viewport(1280, 1024);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', {
      headers: { 'content-type': 'application/javascript' },
      body: '',
    });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    cy.get('[data-page-rail]').should('be.visible');
    cy.get('[data-page-rail]').contains('a', 'Construct line protocol').click();
    cy.location('hash').should('eq', '#construct-line-protocol');
    cy.get('[data-page-rail] a[aria-current="location"]').should(
      'have.attr',
      'href',
      '#construct-line-protocol'
    );
    cy.get('[data-page-rail]').should('not.contain', 'Support and feedback');
  });
});

describe('API article navigation', () => {
  it('keeps operation links and method badges in a narrow drawer', () => {
    cy.viewport(1024, 768);
    cy.visit('/influxdb3/core/api/write-data/');
    dismissNotifications();
    cy.get('[data-page-rail] nav').should('not.be.visible');
    cy.get('[data-page-rail] button').click();
    cy.get('[data-page-rail] a[href^="#operation/"]')
      .first()
      .then(($link) => {
        const fragment = $link.attr('href');
        cy.wrap($link).find('.api-method').should('not.be.empty');
        cy.wrap($link).click();
        cy.location('hash').should('eq', fragment);
        cy.focused().should('have.attr', 'id', fragment.slice(1));
      });
    cy.get('[data-page-rail] nav').should('not.be.visible');
  });
  it('keeps API header controls inside the article beside both desktop rails', () => {
    cy.viewport(1280, 1024);
    mockKapaWidget();
    cy.visit('/influxdb3/core/api/write-data/');
    dismissNotifications();
    cy.get('[data-ask-ai-action="open"]').click();
    cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
    cy.window().then((win) => win.kapaHarness.finishRender());
    cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
    cy.get('.api-header-actions').should(($actions) => {
      const article = $actions[0]
        .closest('.article--content')
        .getBoundingClientRect();
      for (const control of $actions[0].children) {
        expect(control.getBoundingClientRect().right).to.be.at.most(
          article.right + 1
        );
      }
    });
  });
});
