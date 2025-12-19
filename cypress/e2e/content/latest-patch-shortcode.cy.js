/// <reference types="cypress" />

/**
 * Tests for the latest-patch shortcode with cli=true parameter.
 * Verifies CLI version output across InfluxDB products.
 */
describe('latest-patch shortcode CLI version', function () {
  it('outputs CLI version in InfluxDB v2 page', function () {
    cy.task('getData', 'products').then((products) => {
      const expectedCliVersion = products.influxdb.latest_cli.v2;
      cy.visit('/influxdb/v2/tools/influx-cli/');
      cy.get('.article--content').should(
        'contain',
        `influx CLI v${expectedCliVersion}`
      );
    });
  });

  it('outputs CLI version in InfluxDB Cloud page', function () {
    cy.task('getData', 'products').then((products) => {
      const expectedCliVersion = products.influxdb.latest_cli.v2;
      cy.visit('/influxdb/cloud/tools/influx-cli/');
      cy.get('.article--content').should(
        'contain',
        `influx CLI v${expectedCliVersion}`
      );
    });
  });

  it('outputs CLI version in InfluxDB Cloud Serverless page', function () {
    cy.task('getData', 'products').then((products) => {
      const expectedCliVersion = products.influxdb.latest_cli.v2;
      cy.visit('/influxdb3/cloud-serverless/reference/cli/influx/');
      cy.get('.article--content').should(
        'contain',
        `influx CLI v${expectedCliVersion}`
      );
    });
  });
});
