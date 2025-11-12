/// <reference types="cypress" />

/**
 * Page Context E2E Test Suite
 * Tests that all products in products.yml are correctly mapped in page-context.js
 */

describe('Page Context - Product Mapping', function () {
  describe('InfluxDB 3 Products', function () {
    it('should map Explorer pages correctly', function () {
      cy.visit('/influxdb3/explorer/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/explorer/');
      cy.get('h1').should('contain', 'InfluxDB 3 Explorer');
    });

    it('should map Core pages correctly', function () {
      cy.visit('/influxdb3/core/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/core/');
      cy.get('h1').should('contain', 'InfluxDB 3 Core');
    });

    it('should map Enterprise pages correctly', function () {
      cy.visit('/influxdb3/enterprise/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/enterprise/');
      cy.get('h1').should('contain', 'InfluxDB 3 Enterprise');
    });

    it('should map Cloud Serverless pages correctly', function () {
      cy.visit('/influxdb3/cloud-serverless/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/cloud-serverless/');
      cy.get('h1').should('contain', 'InfluxDB Cloud Serverless');
    });

    it('should map Cloud Dedicated pages correctly', function () {
      cy.visit('/influxdb3/cloud-dedicated/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/cloud-dedicated/');
      cy.get('h1').should('contain', 'InfluxDB Cloud Dedicated');
    });

    it('should map Clustered pages correctly', function () {
      cy.visit('/influxdb3/clustered/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb3/clustered/');
      cy.get('h1').should('contain', 'InfluxDB Clustered');
    });
  });

  describe('InfluxDB v2 and Cloud Products', function () {
    it('should map InfluxDB v2 pages correctly', function () {
      cy.visit('/influxdb/v2/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb/v2/');
      cy.get('h1').should('contain', 'InfluxDB v2');
    });

    it('should map InfluxDB Cloud (TSM) pages correctly', function () {
      cy.visit('/influxdb/cloud/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb/cloud/');
      cy.get('h1').should('contain', 'InfluxDB Cloud');
    });
  });

  describe('InfluxDB v1 Products', function () {
    it('should map InfluxDB v1 pages correctly', function () {
      cy.visit('/influxdb/v1/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/influxdb/v1/');
      cy.get('h1').should('contain', 'InfluxDB OSS');
    });

    it('should map Enterprise v1 pages correctly', function () {
      cy.visit('/enterprise_influxdb/v1/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/enterprise_influxdb/v1/');
      cy.get('h1').should('contain', 'InfluxDB Enterprise');
    });
  });

  describe('Other Products', function () {
    it('should map Telegraf pages correctly', function () {
      cy.visit('/telegraf/v1/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/telegraf/v1/');
      cy.get('h1').should('contain', 'Telegraf');
    });

    it('should map Chronograf pages correctly', function () {
      cy.visit('/chronograf/v1/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/chronograf/v1/');
      cy.get('h1').should('contain', 'Chronograf');
    });

    it('should map Kapacitor pages correctly', function () {
      cy.visit('/kapacitor/v1/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/kapacitor/v1/');
      cy.get('h1').should('contain', 'Kapacitor');
    });

    it('should map Flux pages correctly', function () {
      cy.visit('/flux/v0/');
      cy.get('body').should('be.visible');
      cy.url().should('include', '/flux/v0/');
      cy.get('h1').should('contain', 'Flux');
    });
  });
});
