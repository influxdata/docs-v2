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

/**
 * Convert path parameters from {param} to -param- (RapiDoc format)
 */
function convertPathParams(path) {
  return path.replace(/\{([^}]+)\}/g, '-$1-');
}

/**
 * Build RapiDoc anchor from method and path
 * Format: {method}-{path} with {param} → -param-
 */
function buildAnchor(method, pathStr) {
  const convertedPath = convertPathParams(pathStr);
  return `${method.toLowerCase()}-${convertedPath}`;
}

/**
 * Parse OpenAPI spec and extract operationId → anchor mapping
 */
function parseSpec(specPath) {
  const mapping = {};

  try {
    const content = fs.readFileSync(specPath, 'utf8');
    const spec = yaml.load(content);

    if (!spec.paths) {
      console.warn(`  Warning: No paths in ${specPath}`);
      return mapping;
    }

    for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

      for (const method of methods) {
        const operation = pathItem[method];
        if (operation && operation.operationId) {
          const anchor = buildAnchor(method, pathStr);
          mapping[operation.operationId] = anchor;

          if (VERBOSE) {
            console.log(`    ${operation.operationId} → #${anchor}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`  Error parsing ${specPath}: ${error.message}`);
  }

  return mapping;
}

/**
 * Build complete lookup table from all specs
 * Returns: { urlPrefix: { operationId: anchor } }
 */
function buildLookupTable() {
  const lookup = {};

  console.log('Building operationId lookup table...\n');

  for (const { spec, urlPrefix } of SPEC_MAPPINGS) {
    const specPath = path.join(API_DOCS_DIR, spec);

    if (!fs.existsSync(specPath)) {
      console.warn(`  Skipping missing spec: ${spec}`);
      continue;
    }

    console.log(`  Processing: ${spec}`);
    const mapping = parseSpec(specPath);
    lookup[urlPrefix] = mapping;
    console.log(`    Found ${Object.keys(mapping).length} operations`);
  }

  console.log('');
  return lookup;
}

// Test: Build and display lookup table
console.log(`API Link Migration Script`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'EXECUTE'}\n`);

const lookupTable = buildLookupTable();
console.log('Lookup table built successfully.\n');
