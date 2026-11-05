/// <reference types="cypress" />

// Run against both a root baseUrl and a /pr-preview/pr-N/ baseUrl.
describe('Page titles', () => {
  const pages = [
    ['/', 'InfluxData Documentation'],
    ['/example/', 'InfluxData Documentation'],
    ['/create/', 'InfluxData Documentation'],
    ['/influxdb3/cloud/', 'InfluxDB 3 Cloud Documentation'],
    ['/influxdb3/core/', 'InfluxDB 3 Core Documentation'],
    [
      '/influxdb3/core/get-started/setup/',
      'Set up InfluxDB | Get started with InfluxDB 3 Core | InfluxDB 3 Core Documentation',
    ],
    ['/telegraf/v1/', 'Telegraf Documentation'],
  ];

  pages.forEach(([path, title]) => {
    it(`renders the title for ${path}`, () => {
      cy.visit(path);
      cy.title().should('eq', title);
    });
  });
});
