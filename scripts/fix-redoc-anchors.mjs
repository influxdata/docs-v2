#!/usr/bin/env node
/**
 * Rewrite legacy Redoc-style API anchor links in content/ to the
 * Hugo-native `#operation/<operationId>` form.
 *
 * Old format examples:
 *   /influxdb3/core/api/v3/#post-/api/v3/configure/database
 *   /influxdb3/version/api/v3/#get-/api/v3/query_sql
 *   /influxdb/v2/api/v2/#post-/write
 *   /influxdb3/cloud-dedicated/api/management/#post-/accounts/.../tokens
 *
 * New format:
 *   /influxdb3/core/api/database/#operation/PostConfigureDatabase
 *   /influxdb3/version/api/query-data/#operation/PostExecuteQuerySQL
 *   /influxdb/v2/api/write/#operation/PostWrite
 *   /influxdb3/cloud-dedicated/api/management-api/database-tokens/#operation/CreateDatabaseToken
 *
 * Build mapping from data/article_data/<product>/(api|data-api|management-api)/articles.yml.
 *
 * Usage:
 *   node scripts/fix-redoc-anchors.mjs            # dry run, prints what would change
 *   node scripts/fix-redoc-anchors.mjs --apply    # writes changes
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// -----------------------------------------------------------------------------
// Build operation mapping per product.
// -----------------------------------------------------------------------------

/**
 * Product entry maps:
 *   productPath: URL-path prefix where the pages render, e.g. `/influxdb3/core`
 *   subSections: { sub_name: data_dir } OR `api` for single-spec products
 */
const PRODUCTS = [
  { productPath: '/influxdb3/core',            dataBase: 'data/article_data/influxdb3/core',            subSections: { '': 'api' } },
  { productPath: '/influxdb3/enterprise',      dataBase: 'data/article_data/influxdb3/enterprise',      subSections: { '': 'api' } },
  { productPath: '/influxdb3/cloud-dedicated', dataBase: 'data/article_data/influxdb3/cloud-dedicated', subSections: { 'data-api': 'data-api', 'management-api': 'management-api' } },
  { productPath: '/influxdb3/cloud-serverless',dataBase: 'data/article_data/influxdb3/cloud-serverless',subSections: { '': 'api' } },
  { productPath: '/influxdb3/clustered',       dataBase: 'data/article_data/influxdb3/clustered',       subSections: { 'data-api': 'data-api', 'management-api': 'management-api' } },
  { productPath: '/influxdb/cloud',            dataBase: 'data/article_data/influxdb/cloud',            subSections: { '': 'api' } },
  { productPath: '/influxdb/v2',               dataBase: 'data/article_data/influxdb/v2',               subSections: { '': 'api' } },
  { productPath: '/influxdb/v1',               dataBase: 'data/article_data/influxdb/v1',               subSections: { '': 'api' } },
  { productPath: '/enterprise_influxdb/v1',    dataBase: 'data/article_data/enterprise_influxdb/v1',    subSections: { '': 'api' } },
];

/** Normalize old-style path fragment to match article_data paths. */
function normalizePath(p) {
  // Redoc-style anchors used path-with-leading-slash encoded verbatim,
  // e.g. "/api/v3/configure/database" or "/api/v3/configure/database/-db-"
  // where `{var}` became `-var-`. Undo the -var- encoding.
  return p.replace(/\/-([^/-]+)-/g, '/{$1}');
}

/** productKey -> { subSection -> Map<"METHOD path", { tagSlug, operationId }> } */
const productMaps = {};

for (const product of PRODUCTS) {
  productMaps[product.productPath] = {};
  for (const [subName, dataDir] of Object.entries(product.subSections)) {
    const file = path.join(REPO, product.dataBase, dataDir, 'articles.yml');
    if (!fs.existsSync(file)) continue;
    const parsed = yaml.load(fs.readFileSync(file, 'utf8'));
    const map = new Map();
    for (const article of parsed.articles || []) {
      const tagSlug = (article.path || '').replace(/^api\//, '');
      const ops = article.fields?.operations || [];
      for (const op of ops) {
        const key = `${op.method.toUpperCase()} ${op.path}`;
        map.set(key, { tagSlug, operationId: op.operationId });
      }
    }
    productMaps[product.productPath][subName] = map;
  }
}

// -----------------------------------------------------------------------------
// Helpers to look up an operation given a URL + method + path.
// -----------------------------------------------------------------------------

/**
 * Resolve a product from a URL prefix. `/version/` is treated as a wildcard
 * that matches any product in the same family.
 */
function productsFor(urlPrefix) {
  const famMatch = urlPrefix.match(/^\/(influxdb3|influxdb|enterprise_influxdb)\/([^/]+)/);
  if (!famMatch) return [];
  const [, family, version] = famMatch;
  if (version === 'version') {
    // Match all products in that family
    return PRODUCTS.filter((p) => p.productPath.startsWith(`/${family}/`));
  }
  return PRODUCTS.filter((p) => p.productPath === `/${family}/${version}`);
}

/**
 * Look up operation in a product's mapping. `apiSurface` scopes to a
 * specific sub-section for multi-spec products (e.g., 'management').
 */
function lookup(product, method, endpointPath, apiSurface) {
  const key = `${method.toUpperCase()} ${endpointPath}`;
  const subs = productMaps[product.productPath] || {};
  if (apiSurface === 'management') {
    return subs['management-api']?.get(key);
  }
  // Try every sub-section; prefer `data-api` over the empty/default.
  for (const subKey of ['', 'data-api']) {
    const hit = subs[subKey]?.get(key);
    if (hit) return { ...hit, subKey };
  }
  return null;
}

function buildNewUrl(product, hit) {
  const prefix = product.productPath + '/api' + (hit.subKey ? `/${hit.subKey}` : '');
  return `${prefix}/${hit.tagSlug}/#operation/${hit.operationId}`;
}

// -----------------------------------------------------------------------------
// Walk content/, rewrite broken anchors.
// -----------------------------------------------------------------------------

const BROKEN_RE =
  /(\/(?:influxdb3?|influxdb|enterprise_influxdb)\/[^/\s)"',]+)\/api(?:\/(v\d|management))?\/#(post|get|put|delete|head|patch)-(\/[^)"',<>\s]+)/gi;

const changes = [];
const unresolved = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md')) processFile(full);
  }
}

function processFile(file) {
  const orig = fs.readFileSync(file, 'utf8');
  let out = orig;
  let localChanges = 0;

  out = out.replace(BROKEN_RE, (match, prefix, apiSurface, method, rawPath) => {
    const version = prefix.split('/').slice(-1)[0];
    const products = productsFor(prefix);
    if (!products.length) {
      unresolved.push({ file, match, reason: 'unknown product prefix' });
      return match;
    }
    const endpointPath = normalizePath(rawPath);

    // For `/version/` placeholder, try each candidate until one matches AND
    // produces the same operationId across all candidates (so the rendered
    // link works for every product that consumes the shared file).
    const hits = [];
    for (const product of products) {
      const hit = lookup(product, method, endpointPath, apiSurface);
      if (hit) hits.push({ product, hit });
    }

    if (hits.length === 0) {
      unresolved.push({
        file,
        match,
        reason: `no operation for ${method.toUpperCase()} ${endpointPath} in ${products.map((p) => p.productPath).join(',')}`,
      });
      return match;
    }

    if (version === 'version') {
      const first = hits[0].hit;
      const famMatch = prefix.match(/^\/(influxdb3|influxdb|enterprise_influxdb)\//);
      const fam = famMatch[1];

      const consistent = hits.every(
        (h) =>
          h.hit.operationId === first.operationId &&
          h.hit.tagSlug === first.tagSlug &&
          h.hit.subKey === first.subKey
      );
      if (consistent) {
        const surface = first.subKey ? `/api/${first.subKey}` : '/api';
        localChanges++;
        return `/${fam}/version${surface}/${first.tagSlug}/#operation/${first.operationId}`;
      }

      // OperationId or subKey differs across consumers. Fall back to the tag
      // page without an operation anchor if tagSlugs agree — lands readers on
      // the right page for each product even though the specific op differs.
      const tagSlugs = [...new Set(hits.map((h) => h.hit.tagSlug))];
      if (tagSlugs.length === 1) {
        localChanges++;
        return `/${fam}/version/api/${tagSlugs[0]}/`;
      }

      unresolved.push({
        file,
        match,
        reason: `inconsistent across /version/ consumers — operationIds: ${hits
          .map((h) => `${h.product.productPath}→${h.hit.operationId}`)
          .join(', ')} / tagSlugs: ${tagSlugs.join(', ')}`,
      });
      return match;
    }

    // Single-product match.
    const { product, hit } = hits[0];
    localChanges++;
    return buildNewUrl(product, hit);
  });

  if (localChanges > 0) {
    changes.push({ file, count: localChanges });
    if (APPLY) fs.writeFileSync(file, out);
  }
}

walk(path.join(REPO, 'content'));

// -----------------------------------------------------------------------------
// Report.
// -----------------------------------------------------------------------------

console.log(`\n${APPLY ? 'Applied' : 'Would apply'} changes to ${changes.length} file(s):`);
for (const c of changes) {
  console.log(`  ${path.relative(REPO, c.file)}  (${c.count} anchor${c.count === 1 ? '' : 's'})`);
}

if (unresolved.length > 0) {
  console.log(`\nUnresolved (${unresolved.length}) — left as-is:`);
  for (const u of unresolved.slice(0, 30)) {
    console.log(`  ${path.relative(REPO, u.file)}`);
    console.log(`    match: ${u.match}`);
    console.log(`    reason: ${u.reason}`);
  }
  if (unresolved.length > 30) {
    console.log(`  …and ${unresolved.length - 30} more`);
  }
}

if (!APPLY) {
  console.log('\n(dry run — pass --apply to write changes)');
}
