/// <reference types="cypress" />
/*
  Hub notifications E2E against the Subscriber UX Standard DOM. Hub REST is
  mocked; SSE is allowed to fail (catch-up renders). Reduced motion is forced
  so animationend-gated dismiss/leave resolves immediately.
*/

const TOPIC = 'https://influxdata.com/topics/product/influxdb-v3';

function postFixture(over = {}) {
  return {
    id: '01911edb-3d5a-72b0-935f-0e7a4c9b8d23',
    title: 'Test notification',
    summary: 'Short **bold** summary',
    body: 'Body _markdown_',
    topics: [TOPIC],
    category: 'announcement',
    severity: 'info',
    presentation: 'drawer',
    contexts: {},
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    publishedAt: '2026-01-01T00:00:00Z',
    expiresAt: null,
    ...over,
  };
}

function stubHub(post) {
  cy.intercept('GET', '**/api/topics', { product: [TOPIC] }).as('topics');
  cy.intercept('GET', '**/api/subscriber-token*', {
    token: 'test-token',
    expiresAt: '2099-01-01T00:00:00Z',
  });
  cy.intercept('GET', '**/api/posts*', {
    posts: post ? [post] : [],
    latestId: post ? post.id : null,
  }).as('posts');
  cy.intercept('GET', '**/.well-known/mercure*', { statusCode: 204 });
  cy.intercept('POST', '**/api/posts/**', { statusCode: 204 });
}

// Force prefers-reduced-motion: reduce for deterministic animation timing.
function visitReducedMotion(path) {
  cy.visit(path, {
    onBeforeLoad(win) {
      cy.stub(win, 'matchMedia')
        .callThrough()
        .withArgs('(prefers-reduced-motion: reduce)')
        .returns({
          matches: true,
          media: '(prefers-reduced-motion: reduce)',
          addEventListener() {},
          removeEventListener() {},
          addListener() {},
          removeListener() {},
        });
    },
  });
}

describe('hub notifications (Subscriber UX Standard)', () => {
  it('unscoped post shows in the drawer; summary renders markdown', () => {
    stubHub(postFixture());
    visitReducedMotion('/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-drawer', { timeout: 10000 }).should(
      'have.attr',
      'data-state',
      'closed'
    );
    cy.get('#notif-badge')
      .should('have.attr', 'data-count', '1')
      .and('have.text', '1');
    // { force: true }: the .search-btn container has width:0 but its 30px
    // child button overflows and visually covers the adjacent bell button at
    // the default Cypress viewport. The bell is fully functional; force
    // bypasses the actionability overlay check without weakening the assertion.
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('#notif-drawer').should('have.attr', 'data-state', 'open');
    cy.get('.notif-card-drawer__title').should(
      'contain.text',
      'Test notification'
    );
    // Markdown summary: ** renders <strong>, not literal asterisks.
    cy.get('.notif-card-drawer__summary--md strong').should(
      'contain.text',
      'bold'
    );
    cy.get('.notif-card-drawer__summary').should('not.contain.text', '**');
  });

  it('unread dot marks the item read', () => {
    stubHub(postFixture());
    visitReducedMotion('/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('.notif-card-drawer[data-unread="true"]').should('exist');
    cy.get('.notif-card-drawer__dot').click();
    cy.get('.notif-card-drawer[data-unread="false"]').should('exist');
    cy.get('#notif-badge').should('have.attr', 'data-count', '0');
  });

  it('honors docs scope (hidden off-scope)', () => {
    stubHub(postFixture({ contexts: { docs: { scope: ['telegraf'] } } }));
    visitReducedMotion('/influxdb3/core/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('.notif-card-drawer').should('not.exist');
  });

  it('honors docs scope (shown on-scope)', () => {
    stubHub(postFixture({ contexts: { docs: { scope: ['telegraf'] } } }));
    visitReducedMotion('/telegraf/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('.notif-card-drawer').should('exist');
  });

  it('display_override routes a drawer post to a banner', () => {
    stubHub(
      postFixture({
        presentation: 'drawer',
        contexts: { docs: { display_override: { banner: ['home'] } } },
      })
    );
    visitReducedMotion('/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-banner-stack .notif-card[data-surface="banner"]', {
      timeout: 10000,
    }).should('exist');
  });

  it('blocking modal requires Acknowledge', () => {
    cy.clearLocalStorage();
    stubHub(postFixture({ presentation: 'blocking' }));
    visitReducedMotion('/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-blocking-mount .notif-modal', {
      timeout: 10000,
    }).should('be.visible');
    cy.get('#notif-blocking-mount [role="alertdialog"]').should(
      'have.attr',
      'aria-modal',
      'true'
    );
    cy.get('body').type('{esc}');
    cy.get('#notif-blocking-mount .notif-modal').should('be.visible');
    cy.contains('.notif-modal__ack', 'Acknowledge').click();
    cy.get('#notif-blocking-mount .notif-modal').should('not.exist');
  });

  it('drawer dismiss persists across reload', () => {
    cy.clearLocalStorage();
    stubHub(postFixture());
    visitReducedMotion('/');
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('.notif-card-drawer__dismiss').click();
    cy.get('.notif-card-drawer', { timeout: 10000 }).should('not.exist');
    cy.reload();
    cy.wait('@topics');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click({ force: true });
    cy.get('.notif-card-drawer').should('not.exist');
  });
});
