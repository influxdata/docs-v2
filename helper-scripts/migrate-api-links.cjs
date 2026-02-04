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

/**
 * Find all #operation/ links in a file
 * Returns array of { match, operationId, urlPath, fullUrl }
 */
function findOperationLinks(content) {
  const links = [];
  // Match patterns like: /influxdb/cloud/api/#operation/PostTasks
  // or /influxdb3/cloud-dedicated/api/management/#operation/CreateDatabaseToken
  const regex = /(\/[a-z0-9_/-]+\/api(?:\/management)?(?:\/[a-z0-9-]*)?\/)#operation\/(\w+)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({
      match: match[0],
      urlPath: match[1],
      operationId: match[2],
    });
  }

  return links;
}

/**
 * Find the best matching URL prefix for a given URL path
 */
function findUrlPrefix(urlPath, lookup) {
  // Sort by length descending to match most specific first
  const prefixes = Object.keys(lookup).sort((a, b) => b.length - a.length);

  for (const prefix of prefixes) {
    if (urlPath.startsWith(prefix) || urlPath === prefix.slice(0, -1)) {
      return prefix;
    }
  }

  return null;
}

/**
 * Scan content directory for files with #operation/ links
 */
async function scanContentFiles(lookup) {
  console.log('Scanning content files for #operation/ links...\n');

  const files = await glob('**/*.md', { cwd: CONTENT_DIR });
  const results = {
    filesWithLinks: [],
    totalLinks: 0,
    unmapped: [],
  };

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const links = findOperationLinks(content);

    if (links.length > 0) {
      const fileResult = {
        file,
        links: [],
      };

      for (const link of links) {
        const urlPrefix = findUrlPrefix(link.urlPath, lookup);

        if (!urlPrefix) {
          results.unmapped.push({ file, ...link, reason: 'No matching URL prefix' });
          continue;
        }

        const productLookup = lookup[urlPrefix];
        const anchor = productLookup[link.operationId];

        if (!anchor) {
          results.unmapped.push({ file, ...link, reason: 'OperationId not found in spec' });
          continue;
        }

        fileResult.links.push({
          ...link,
          urlPrefix,
          newAnchor: anchor,
          oldLink: `${link.urlPath}#operation/${link.operationId}`,
          newLink: `${link.urlPath}#${anchor}`,
        });
      }

      if (fileResult.links.length > 0) {
        results.filesWithLinks.push(fileResult);
        results.totalLinks += fileResult.links.length;
      }
    }
  }

  return results;
}

async function main() {
  console.log(`API Link Migration Script`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'EXECUTE'}\n`);

  // Build lookup table
  const lookupTable = buildLookupTable();

  // Scan content files
  const results = await scanContentFiles(lookupTable);

  // Report findings
  console.log('=== SCAN RESULTS ===\n');
  console.log(`Files with links: ${results.filesWithLinks.length}`);
  console.log(`Total links to migrate: ${results.totalLinks}`);
  console.log(`Unmapped links: ${results.unmapped.length}\n`);

  if (VERBOSE && results.filesWithLinks.length > 0) {
    console.log('Links to migrate:');
    for (const { file, links } of results.filesWithLinks) {
      console.log(`\n  ${file}:`);
      for (const link of links) {
        console.log(`    ${link.oldLink}`);
        console.log(`    → ${link.newLink}`);
      }
    }
  }

  if (results.unmapped.length > 0) {
    console.log('\n=== UNMAPPED LINKS (require manual review) ===\n');
    for (const item of results.unmapped) {
      console.log(`  ${item.file}:`);
      console.log(`    ${item.match}`);
      console.log(`    Reason: ${item.reason}\n`);
    }
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] No files modified. Run without --dry-run to apply changes.');
  }
}

main().catch(console.error);
