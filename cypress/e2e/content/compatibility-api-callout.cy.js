/// <reference types="cypress" />

const V3_ENDPOINT = '/api/v3/write_lp';

const PAGES = [
  {
    path: '/influxdb3/core/write-data/http-api/compatibility-apis/',
    includesV3: true,
  },
  {
    path: '/influxdb3/enterprise/write-data/http-api/compatibility-apis/',
    includesV3: true,
  },
  {
    path: '/influxdb3/cloud-dedicated/write-data/http-api/compatibility-apis/',
    includesV3: false,
  },
  {
    path: '/influxdb3/clustered/write-data/http-api/compatibility-apis/',
    includesV3: false,
  },
];

describe('Compatibility API write endpoint callout', () => {
  PAGES.forEach(({ path, includesV3 }) => {
    it(`renders one intact product-specific callout on ${path}`, () => {
      cy.visit(path);

      cy.get('.block.tip #choose-the-write-endpoint-for-your-workload')
        .should('have.length', 1)
        .closest('.block.tip')
        .and('contain.text', 'When bringing existing v1 write workloads')
        .and('contain.text', 'When bringing existing v2 write workloads')
        .and('contain.text', 'For Telegraf')
        .and('contain.text', 'See how to use Telegraf to write data')
        .then(($callout) => {
          const text = $callout.text();

          if (includesV3) {
            expect(text).to.include(V3_ENDPOINT);
          } else {
            expect(text).not.to.include(V3_ENDPOINT);
          }

          expect($callout[0].nextElementSibling).to.have.class('block');
          expect($callout[0].nextElementSibling).to.have.class('note');
        });
    });
  });
});
