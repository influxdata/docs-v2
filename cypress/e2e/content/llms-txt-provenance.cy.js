/**
 * Verifies /llms.txt carries the InfluxData publisher line (#7290).
 * Runtime check: the line is rendered by the Hugo template from
 * data/influxdata.yml, so it must be asserted against a built/served file.
 */
describe('llms.txt provenance', () => {
  it('includes the InfluxData publisher line', () => {
    cy.request('/llms.txt').then((response) => {
      expect(response.status).to.eq(200);
      // Exact rendered line — must match data/influxdata.yml
      // organization.name and organization.url.
      expect(response.body).to.include(
        'Publisher: InfluxData (https://www.influxdata.com)'
      );
    });
  });
});
