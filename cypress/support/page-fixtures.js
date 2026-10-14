// Dismiss unrelated announcements before testing navigation and panel bounds.
export function dismissNotifications() {
  cy.get('body').then(($body) => {
    $body
      .find('.notification:visible .close-notification')
      .each((_, button) => button.click());
  });
  cy.get('.notification').should('not.be.visible');
}
