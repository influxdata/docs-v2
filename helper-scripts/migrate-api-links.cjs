#!/usr/bin/env node
/**
 * migrate-api-links.js
 *
 * One-time migration script to convert Redoc API links to RapiDoc format.
 *
 * Usage:
 *   node helper-scripts/migrate-api-links.js --dry-run  # Preview changes
 *   node helper-scripts/migrate-api-links.js            # Execute migration
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

// CLI arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const API_DOCS_DIR = path.join(ROOT_DIR, 'api-docs');

// Spec file → product URL mapping
const SPEC_MAPPINGS = [
  { spec: 'influxdb/cloud/v2/ref.yml', urlPrefix: '/influxdb/cloud/api/' },
  { spec: 'influxdb/v2/v2/ref.yml', urlPrefix: '/influxdb/v2/api/' },
  { spec: 'influxdb/v1/v1/ref.yml', urlPrefix: '/influxdb/v1/api/' },
  { spec: 'enterprise_influxdb/v1/v1/ref.yml', urlPrefix: '/enterprise_influxdb/v1/api/' },
  { spec: 'influxdb3/core/v3/ref.yml', urlPrefix: '/influxdb3/core/api/' },
  { spec: 'influxdb3/enterprise/v3/ref.yml', urlPrefix: '/influxdb3/enterprise/api/' },
  { spec: 'influxdb3/cloud-dedicated/v2/ref.yml', urlPrefix: '/influxdb3/cloud-dedicated/api/' },
  { spec: 'influxdb3/cloud-dedicated/management/openapi.yml', urlPrefix: '/influxdb3/cloud-dedicated/api/management/' },
  { spec: 'influxdb3/cloud-serverless/v2/ref.yml', urlPrefix: '/influxdb3/cloud-serverless/api/' },
  { spec: 'influxdb3/clustered/v2/ref.yml', urlPrefix: '/influxdb3/clustered/api/' },
  { spec: 'influxdb3/clustered/management/openapi.yml', urlPrefix: '/influxdb3/clustered/api/management/' },
];

console.log(`API Link Migration Script`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'EXECUTE'}\n`);
