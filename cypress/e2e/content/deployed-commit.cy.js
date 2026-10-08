// Supply the same SHA through HUGO_PARAMS_DEPLOYEDCOMMIT and
// CYPRESS_DEPLOYED_COMMIT to test a deployment build. Without either variable,
// local builds must omit the tag rather than report a page's last-edit commit.
describe('Deployed commit metadata', () => {
  const expectedCommit = Cypress.env('DEPLOYED_COMMIT');
  const pages = [
    '/',
    '/influxdb3/core/',
    '/influxdb3/core/install/',
    '/telegraf/v1/configuration/',
    '/influxdb/v2/api/',
    '/404.html',
  ];

  for (const url of pages) {
    it(`${expectedCommit ? 'exposes the build commit' : 'omits an unknown commit'} on ${url}`, () => {
      if (url === '/404.html') {
        // The existing 404 inline script references a missing jQuery global.
        // Inspect its served HTML without executing that unrelated script.
        cy.request(url).then(({ body }) => {
          const doc = new DOMParser().parseFromString(body, 'text/html');
          const tags = doc.head.querySelectorAll(
            'meta[name="deployed-commit"]'
          );
          expect(tags).to.have.length(expectedCommit ? 1 : 0);
          if (expectedCommit) {
            expect(tags[0].getAttribute('content')).to.equal(expectedCommit);
          }
        });
      } else {
        cy.visit(url);
        const meta = cy.get('head').find('meta[name="deployed-commit"]');
        if (expectedCommit) {
          meta
            .should('have.length', 1)
            .and('have.attr', 'content', expectedCommit);
        } else {
          meta.should('not.exist');
        }
      }
    });
  }
});
