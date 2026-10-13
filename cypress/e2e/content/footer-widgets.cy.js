/// <reference types="cypress" />
import { dismissNotifications } from '../../support/page-fixtures.js';
import { mockKapaWidget } from '../../support/kapa-widget.js';

const writePage = '/influxdb3/core/get-started/write/';
const trigger = '.custom-time-trigger__button';

function visitWithDate(path = writePage, theme = 'light') {
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        'influxdata_docs_preferences',
        JSON.stringify({ sample_get_started_date: '2025-02-10', theme })
      );
    },
  });
  dismissNotifications();
}

function expectSeparateControls() {
  cy.get(trigger).should('be.visible');
  cy.get('.ask-ai-composer').should('be.visible');
  cy.get('.footer-widgets').should(($widgets) => {
    const widget = $widgets[0].getBoundingClientRect();
    const composer = $widgets[0].ownerDocument
      .querySelector('.ask-ai-composer')
      .getBoundingClientRect();
    expect(
      widget.right <= composer.left ||
        widget.left >= composer.right ||
        widget.bottom <= composer.top ||
        widget.top >= composer.bottom,
      'date widget and composer do not overlap'
    ).to.eq(true);
  });
}

function selectDay(day) {
  cy.get(trigger).click();
  cy.get('#influxdb-gs-date-select').should('be.visible');
  cy.get('#custom-date-selector .datepicker-cell.day')
    .not('.prev, .next')
    .contains(new RegExp(`^${day}$`))
    .click();
  cy.get('#submit-custom-date').click();
  cy.get('.modal').should('not.be.visible');
}

describe('Bottom-of-page widgets', () => {
  it('updates sample timestamps and restores the selected date after reload', () => {
    cy.viewport(1280, 1024);
    visitWithDate();
    cy.get('span.custom-timestamps').should('contain', '2025-02-10T08:00:00Z');
    cy.get('.custom-timestamps pre').should(
      'contain',
      String(Date.parse('2025-02-10T08:00:00Z') / 1000)
    );
    selectDay(12);
    selectDay(14);
    cy.get('span.custom-timestamps').should('contain', '2025-02-14T08:00:00Z');
    cy.get('.custom-timestamps pre').should(
      'contain',
      String(Date.parse('2025-02-14T08:00:00Z') / 1000)
    );
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves().as('copyCode');
    });
    cy.get('.custom-timestamps .code-controls-toggle').first().click();
    cy.get('.custom-timestamps .copy-code').first().click();
    cy.get('@copyCode').should('have.been.calledOnce');
    cy.get('@copyCode')
      .its('firstCall.args.0')
      .should('contain', String(Date.parse('2025-02-14T08:00:00Z') / 1000));
    cy.reload();
    cy.get('span.custom-timestamps').should('contain', '2025-02-14T08:00:00Z');
    cy.get(trigger).click();
    cy.get('#custom-date-selector .datepicker-cell.selected').should(
      'contain',
      '14'
    );
    cy.get('#modal-close').click();
    cy.get('.modal').should('not.be.visible');
  });

  it('updates direct-content code without removing placeholder controls', () => {
    cy.viewport(1280, 1024);
    visitWithDate('/example/');
    selectDay(12);
    cy.get('.custom-timestamps pre')
      .first()
      .should('contain', String(Date.parse('2025-02-12T08:00:00Z') / 1000));
    cy.get('.custom-timestamps .code-placeholder').first().should('exist');
    cy.get('.custom-timestamps .code-controls').first().should('exist');
  });

  it('shows only the requested panel when switching from the date picker', () => {
    cy.viewport(1280, 1024);
    visitWithDate();
    selectDay(12);
    cy.get('.url-trigger').click();
    cy.get('#influxdb-url-list').should('be.visible');
    cy.get('#influxdb-gs-date-select').should('not.be.visible');
    cy.get('#modal-close').click();
    cy.get('.modal').should('not.be.visible');
    cy.get(trigger).click();
    cy.get('#influxdb-gs-date-select').should('be.visible');
    cy.get('#influxdb-url-list').should('not.be.visible');
  });

  for (const theme of ['light', 'dark']) {
    it(`keeps widgets clear of chat through resize in ${theme} theme`, () => {
      cy.viewport(375, 812);
      mockKapaWidget();
      visitWithDate(writePage, theme);
      expectSeparateControls();
      cy.get('#chat-assistant-textarea').invoke('css', 'height', '150px');
      expectSeparateControls();
      selectDay(12);
      cy.get('[data-ask-ai-action="open"]').click();
      expectSeparateControls();
      cy.window().its('kapaHarness.finishRender').should('be.a', 'function');
      cy.window().then((win) => win.kapaHarness.finishRender());
      cy.get('body').should('have.attr', 'data-ask-ai-state', 'open');
      cy.get(trigger).should('not.be.visible');
      cy.viewport(1280, 1024);
      cy.get(trigger).should('be.visible').click();
      cy.get('#influxdb-gs-date-select').should('be.visible');
      cy.get('#modal-close').click();
      cy.contains('button', 'Close chat').click();
      for (const width of [601, 600, 375]) {
        cy.viewport(width, 812);
        expectSeparateControls();
      }
      cy.scrollTo('bottom');
      cy.get(trigger).click();
      cy.get('#influxdb-gs-date-select').should('be.visible');
    });
  }

  it('omits the date widget on pages without custom timestamps', () => {
    cy.visit('/');
    cy.get('.custom-time-trigger').should('not.exist');
    cy.get('#custom-date-selector').should('not.exist');
  });
});
