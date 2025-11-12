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

describe('Product Data Validation - AI Questions', function () {
  describe('InfluxDB 3 Products', function () {
    it('should have correct Explorer AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_explorer).to.exist;
        expect(products.influxdb3_explorer.name).to.equal(
          'InfluxDB 3 Explorer'
        );
        expect(products.influxdb3_explorer.ai_sample_questions).to.exist;
        expect(products.influxdb3_explorer.ai_sample_questions).to.be.an(
          'array'
        );

        const questionsText =
          products.influxdb3_explorer.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('query data');
        expect(questionsText).to.include('visualize data');
        expect(questionsText).to.not.include('plugin');
        expect(questionsText).to.not.include('read replica');
      });
    });

    it('should have correct Core AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_core).to.exist;
        expect(products.influxdb3_core.name).to.equal('InfluxDB 3 Core');
        expect(products.influxdb3_core.ai_sample_questions).to.exist;

        const questionsText =
          products.influxdb3_core.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('plugin');
        expect(questionsText).to.not.include('read replica');
      });
    });

    it('should have correct Enterprise AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_enterprise).to.exist;
        expect(products.influxdb3_enterprise.name).to.equal(
          'InfluxDB 3 Enterprise'
        );
        expect(products.influxdb3_enterprise.ai_sample_questions).to.exist;

        const questionsText =
          products.influxdb3_enterprise.ai_sample_questions.join(' ');
        expect(questionsText).to.include('install and run');
        expect(questionsText).to.include('read replica');
      });
    });

    it('should have correct Cloud Serverless AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_cloud_serverless).to.exist;
        expect(products.influxdb3_cloud_serverless.name).to.equal(
          'InfluxDB Cloud Serverless'
        );
        expect(products.influxdb3_cloud_serverless.ai_sample_questions).to
          .exist;

        const questionsText =
          products.influxdb3_cloud_serverless.ai_sample_questions.join(' ');
        expect(questionsText).to.include('migrate from Cloud');
        expect(questionsText).to.include('write data');
      });
    });

    it('should have correct Cloud Dedicated AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_cloud_dedicated).to.exist;
        expect(products.influxdb3_cloud_dedicated.name).to.equal(
          'InfluxDB Cloud Dedicated'
        );
        expect(products.influxdb3_cloud_dedicated.ai_sample_questions).to.exist;

        const questionsText =
          products.influxdb3_cloud_dedicated.ai_sample_questions.join(' ');
        expect(questionsText).to.include('migrate from v1');
        expect(questionsText).to.include('SQL');
      });
    });

    it('should have correct Clustered AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb3_clustered).to.exist;
        expect(products.influxdb3_clustered.name).to.equal(
          'InfluxDB Clustered'
        );
        expect(products.influxdb3_clustered.ai_sample_questions).to.exist;

        const questionsText =
          products.influxdb3_clustered.ai_sample_questions.join(' ');
        expect(questionsText).to.include('Helm chart');
        expect(questionsText).to.include('SQL');
      });
    });
  });

  describe('InfluxDB v2 and Cloud Products', function () {
    it('should have correct InfluxDB v2 AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb).to.exist;
        expect(products.influxdb.name).to.equal('InfluxDB');
        expect(products.influxdb.ai_sample_questions).to.exist;

        const questionsText = products.influxdb.ai_sample_questions.join(' ');
        expect(questionsText).to.include('write and query data');
        expect(questionsText).to.include('migrate to InfluxDB 3');
        expect(questionsText).to.include('auth tokens');
      });
    });

    it('should have correct Cloud (TSM) AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.influxdb_cloud).to.exist;
        expect(products.influxdb_cloud.name).to.equal('InfluxDB Cloud (TSM)');
        expect(products.influxdb_cloud.ai_sample_questions).to.exist;

        const questionsText =
          products.influxdb_cloud.ai_sample_questions.join(' ');
        expect(questionsText).to.include('write and query data');
        expect(questionsText).to.include('Cloud (TSM)');
      });
    });
  });

  describe('InfluxDB v1 Products', function () {
    it('should have correct Enterprise v1 AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.enterprise_influxdb).to.exist;
        expect(products.enterprise_influxdb.name).to.equal(
          'InfluxDB Enterprise v1'
        );
        expect(products.enterprise_influxdb.ai_sample_questions).to.exist;

        const questionsText =
          products.enterprise_influxdb.ai_sample_questions.join(' ');
        expect(questionsText).to.include('configure the server');
        expect(questionsText).to.include('replicate data');
        expect(questionsText).to.include('query data');
      });
    });
  });

  describe('Other Products', function () {
    it('should have correct Telegraf AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.telegraf).to.exist;
        expect(products.telegraf.name).to.equal('Telegraf');
        expect(products.telegraf.ai_sample_questions).to.exist;

        const questionsText = products.telegraf.ai_sample_questions.join(' ');
        expect(questionsText).to.include('configure Telegraf');
        expect(questionsText).to.include('custom');
        expect(questionsText).to.include('MQTT');
      });
    });

    it('should have correct Chronograf AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.chronograf).to.exist;
        expect(products.chronograf.name).to.equal('Chronograf');
        expect(products.chronograf.ai_sample_questions).to.exist;

        const questionsText = products.chronograf.ai_sample_questions.join(' ');
        expect(questionsText).to.include('configure Chronograf');
        expect(questionsText).to.include('dashboard');
      });
    });

    it('should have correct Kapacitor AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.kapacitor).to.exist;
        expect(products.kapacitor.name).to.equal('Kapacitor');
        expect(products.kapacitor.ai_sample_questions).to.exist;

        const questionsText = products.kapacitor.ai_sample_questions.join(' ');
        expect(questionsText).to.include('configure Kapacitor');
        expect(questionsText).to.include('custom task');
      });
    });

    it('should have correct Flux AI configuration', function () {
      cy.task('getData', 'products').then((products) => {
        expect(products.flux).to.exist;
        expect(products.flux.name).to.equal('Flux');
        expect(products.flux.ai_sample_questions).to.exist;

        const questionsText = products.flux.ai_sample_questions.join(' ');
        expect(questionsText).to.include('query with Flux');
        expect(questionsText).to.include('transform data');
        expect(questionsText).to.include('join data');
      });
    });
  });
});
