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
  it('does not animate the active entry indentation when the ToC initializes', () => {
    cy.viewport(1280, 1024);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', { body: '' });
    cy.visit('/influxdb3/core/get-started/write/', {
      onBeforeLoad(win) {
        // Record every transition that starts on a ToC entry during load.
        win.tocTransitions = [];
        win.addEventListener(
          'transitionrun',
          (event) => {
            if (event.target.matches('[data-page-rail] a')) {
              win.tocTransitions.push(event.propertyName);
            }
          },
          true
        );
      },
    });
    dismissNotifications();
    cy.get('[data-page-rail]').should('have.class', 'is-ready');
    cy.get('[data-page-rail] a[aria-current="location"]').should('exist');
    cy.window().its('tocTransitions').should('deep.equal', []);
  });
  it('collapses to a hamburger on phones and follows the scroll up to 2rem', () => {
    cy.viewport(500, 800);
    cy.intercept('https://widget.kapa.ai/kapa-widget.bundle.js', { body: '' });
    cy.visit('/influxdb3/core/get-started/write/');
    dismissNotifications();
    const width = ($el) => $el[0].getBoundingClientRect().width;
    const top = ($el) => Math.round($el[0].getBoundingClientRect().top);
    cy.get('[data-page-rail] button .page-toc-toggle-icon').should(($icon) => {
      expect(width($icon), 'icon shown').to.be.greaterThan(0);
    });
    cy.get('[data-page-rail] button .page-toc-toggle-label').should(
      ($label) => {
        expect(width($label), 'label hidden').to.be.at.most(1);
      }
    );
    cy.get('[data-page-rail]').should(($rail) => {
      expect(top($rail), 'starts below the header').to.be.greaterThan(32);
    });
    cy.scrollTo(0, 1000);
    cy.get('[data-page-rail]').should(($rail) => {
      expect(top($rail), 'stops 2rem from the top').to.equal(32);
    });
    cy.get('[data-page-rail] button').click();
    cy.get('[data-page-rail] button .page-toc-toggle-label').should(
      ($label) => {
        expect(width($label), 'label shown when expanded').to.be.greaterThan(1);
      }
    );
    cy.get('[data-page-rail] button .page-toc-toggle-icon').should(
      'not.be.visible'
    );
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
