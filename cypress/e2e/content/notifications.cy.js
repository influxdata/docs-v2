/*
  Mocks the hub REST endpoints (SSE is allowed to fail — catch-up posts still
  render, which is enough to assert scope/exclude/display_override + UI).
*/

const TOPIC = 'https://influxdata.com/topics/product/influxdb-v3';

function postFixture(over = {}) {
  return {
    id: '01911edb-3d5a-72b0-935f-0e7a4c9b8d23',
    title: 'Test notification',
    summary: 'Short summary',
    body: 'Body **markdown**',
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

describe('hub notifications', () => {
  it('shows an unscoped post in the drawer', () => {
    stubHub(postFixture());
    cy.visit('/');
    cy.wait('@posts');
    cy.get('#notif-badge', { timeout: 10000 }).should(
      'not.have.attr',
      'hidden'
    );
    cy.get('#notif-drawer').should('not.be.visible');
    cy.get('#notif-bell-btn').click();
    cy.get('#notif-drawer').should('be.visible');
    cy.contains('.notif-card .notif-title', 'Test notification');
  });

  it('honors docs scope (hidden off-scope)', () => {
    stubHub(postFixture({ contexts: { docs: { scope: ['telegraf'] } } }));
    cy.visit('/influxdb3/core/');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click();
    cy.get('.notif-card').should('not.exist');
  });

  it('honors docs scope (shown on-scope)', () => {
    stubHub(postFixture({ contexts: { docs: { scope: ['telegraf'] } } }));
    cy.visit('/telegraf/');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click();
    cy.get('.notif-card').should('exist');
  });

  it('applies display_override to render a banner', () => {
    stubHub(
      postFixture({
        presentation: 'drawer',
        contexts: { docs: { display_override: { banner: ['home'] } } },
      })
    );
    cy.visit('/');
    cy.wait('@posts');
    cy.get('#notif-banners .notif-banner', { timeout: 10000 }).should('exist');
  });

  it('dismiss persists across reload', () => {
    stubHub(postFixture());
    cy.visit('/');
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click();
    cy.get('.notif-dismiss').click();
    cy.get('.notif-card').should('not.exist');
    cy.reload();
    cy.wait('@posts');
    cy.get('#notif-bell-btn').click();
    cy.get('.notif-card').should('not.exist');
  });
});
