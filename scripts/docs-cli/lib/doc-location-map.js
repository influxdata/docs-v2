/**
 * Doc Location Map
 *
 * Builds an inverted map from OpenAPI spec operations to documentation content
 * pages. Reads the content tree and extracts API references, then matches them
 * against the committed OpenAPI specs in api-docs/influxdb3/{core,enterprise}/v3/.
 *
 * Produces three typed artifact sets:
 *   confirmedMap  - operationId → [doc page paths]  (operations with prose coverage)
 *   orphaned      - doc pages referencing operationIds no longer in the spec
 *   uncovered     - spec operationIds with no doc coverage
 *
 * SECURITY: This module reads only files already in this repository (content
 * tree and committed OpenAPI specs). No external network access is required.
 *
 * @module doc-location-map
 */

import { promises as fs } from 'fs';
import { join, relative, resolve } from 'path';
import yaml from 'js-yaml';

// ─── Spec paths ──────────────────────────────────────────────────────────────

const SPEC_PATHS = {
  core: 'api-docs/influxdb3/core/v3/influxdb3-core-openapi.yaml',
  enterprise:
    'api-docs/influxdb3/enterprise/v3/influxdb3-enterprise-openapi.yaml',
};

const CONTENT_ROOTS = {
  core: 'content/influxdb3/core',
  enterprise: 'content/influxdb3/enterprise',
};

const SHARED_CONTENT_ROOT = 'content/shared';

// ─── Signal extraction regexes ────────────────────────────────────────────────

// Signal type 1: related: frontmatter with #operation/OperationId fragment
// Example: - /influxdb3/core/api/v3/#operation/PostConfigureDatabase, ...
const RE_OPERATION_LINK = /#operation\/([A-Za-z][A-Za-z0-9_]*)/g;

// Signal type 2: {{% api-endpoint method="POST" endpoint="...path..." %}}
const RE_API_ENDPOINT_SHORTCODE =
  /api-endpoint[^}]*?method="([A-Z]+)"[^}]*?endpoint="([^"]+)"/g;

// Signal type 3: curl --request METHOD "...path..." or curl -X METHOD "...path..."
const RE_CURL_COMMAND =
  /curl\s+(?:--request|-X)\s+([A-Z]+)\s+["']?(?:https?:\/\/[^/"'\s]*)?(\/?api\/v[0-9]+[^"'\s?#]*)/g;

// Signal type 4: bare path references ``/api/v3/...``
const RE_BARE_PATH = /`(\/api\/v[0-9]+\/[a-zA-Z0-9_/{}.-]+)`/g;

// Normalise endpoint strings coming from shortcodes or curl commands
// Strips Hugo template prefixes like {{< influxdb/host >}}
function normaliseEndpoint(raw) {
  return raw
    .replace(/\{\{[^}]+\}\}/g, '') // strip Hugo shortcodes
    .replace(/\{[^}]+\}/g, '{param}') // normalise path params
    .replace(/\?.*$/, '') // strip query string
    .replace(/\/+$/, ''); // strip trailing slash
}

// ─── Spec inventory ───────────────────────────────────────────────────────────

/**
 * Load an OpenAPI spec and build operationId ↔ path/method indices.
 *
 * @param {string} specAbsPath
 * @returns {{ operationIdToPath: Map, pathToOperationId: Map, specVersion: string }}
 */
async function loadSpecInventory(specAbsPath) {
  const operationIdToPath = new Map(); // operationId → { method, path, summary, tags }
  const pathToOperationId = new Map(); // "METHOD /path" → operationId
  let specVersion = 'unknown';

  let spec;
  try {
    const content = await fs.readFile(specAbsPath, 'utf-8');
    spec = yaml.load(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`  ⚠️  OpenAPI spec not found: ${specAbsPath}`);
    } else {
      console.warn(`  ⚠️  Error parsing spec ${specAbsPath}: ${err.message}`);
    }
    return { operationIdToPath, pathToOperationId, specVersion };
  }

  specVersion = spec?.info?.version || 'unknown';

  for (const [apiPath, pathItem] of Object.entries(spec.paths || {})) {
    for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
      const op = pathItem[method];
      if (!op || !op.operationId) continue;

      const id = op.operationId;
      const normPath = normaliseEndpoint(apiPath);
      const key = `${method.toUpperCase()} ${normPath}`;

      operationIdToPath.set(id, {
        method: method.toUpperCase(),
        path: apiPath,
        normPath,
        summary: op.summary || '',
        tags: op.tags || [],
      });
      pathToOperationId.set(key, id);

      // Also index without param normalisation for exact matches
      const exactKey = `${method.toUpperCase()} ${apiPath}`;
      if (!pathToOperationId.has(exactKey)) {
        pathToOperationId.set(exactKey, id);
      }
    }
  }

  return { operationIdToPath, pathToOperationId, specVersion };
}

// ─── Content tree walker ──────────────────────────────────────────────────────

/**
 * Recursively list all .md files under a directory.
 */
async function walkMarkdown(dir) {
  const files = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(full)));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

// ─── Signal extraction per file ───────────────────────────────────────────────

/**
 * Read frontmatter + body from a markdown file.
 * Returns { frontmatter: object, body: string }.
 */
async function parseFrontmatter(absPath) {
  let content;
  try {
    content = await fs.readFile(absPath, 'utf-8');
  } catch {
    return { frontmatter: {}, body: '' };
  }

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let frontmatter = {};
  if (fmMatch) {
    try {
      frontmatter = yaml.load(fmMatch[1]) || {};
    } catch {
      frontmatter = {};
    }
  }
  return { frontmatter, body: content };
}

/**
 * Extract all API signals from file content.
 * Returns an array of { operationId?, method?, path?, signalType, confidence, raw }.
 * operationId is set for type-1 signals; method+path for types 2-4.
 */
function extractSignals(body) {
  const signals = [];

  // Type 1: #operation/ links (highest confidence – explicit operationId reference)
  for (const m of body.matchAll(RE_OPERATION_LINK)) {
    signals.push({
      operationId: m[1],
      signalType: 'operation-link',
      confidence: 'high',
      raw: m[0],
    });
  }

  // Type 2: {{% api-endpoint %}} shortcode
  for (const m of body.matchAll(RE_API_ENDPOINT_SHORTCODE)) {
    signals.push({
      method: m[1],
      path: normaliseEndpoint(m[2]),
      signalType: 'api-endpoint-shortcode',
      confidence: 'high',
      raw: m[0],
    });
  }

  // Type 3: curl commands
  for (const m of body.matchAll(RE_CURL_COMMAND)) {
    signals.push({
      method: m[1],
      path: normaliseEndpoint(m[2]),
      signalType: 'curl-command',
      confidence: 'medium',
      raw: m[0],
    });
  }

  // Type 4: bare path references
  for (const m of body.matchAll(RE_BARE_PATH)) {
    signals.push({
      path: normaliseEndpoint(m[1]),
      signalType: 'bare-path',
      confidence: 'low',
      raw: m[0],
    });
  }

  return signals;
}

/**
 * Resolve method+path signals to an operationId using the spec indices.
 */
function resolveSignal(signal, pathToOperationId) {
  if (signal.operationId) return signal.operationId;

  if (signal.method && signal.path) {
    const key = `${signal.method} ${signal.path}`;
    if (pathToOperationId.has(key)) return pathToOperationId.get(key);
  }

  // Try path-only match across all keys (last resort for bare-path signals)
  if (signal.path) {
    for (const [k, id] of pathToOperationId) {
      if (k.endsWith(signal.path)) return id;
    }
  }

  return null;
}

/**
 * Detect edition-scope from a block of text.
 * Returns 'core', 'enterprise', or 'both'.
 * Signals inside {{% show-in "enterprise" %}} blocks are enterprise-only;
 * signals inside {{% show-in "core" %}} are core-only; outside = both.
 */
function detectEditionScope(body, signalRaw) {
  // Find position of the signal in the body
  const pos = body.indexOf(signalRaw);
  if (pos === -1) return 'both';

  // Scan backwards for the most recent show-in open tag before pos
  const before = body.slice(0, pos);
  const openCore = before.lastIndexOf('{{% show-in "core" %}}');
  const openEnterprise = before.lastIndexOf('{{% show-in "enterprise" %}}');

  const lastOpen = Math.max(openCore, openEnterprise);
  if (lastOpen === -1) return 'both';

  // Make sure this show-in block hasn't been closed before pos
  const closeTag = '{{% /show-in %}}';
  const closePos = before.lastIndexOf(closeTag);
  if (closePos > lastOpen) return 'both'; // the block was closed before our signal

  return openEnterprise > openCore ? 'enterprise' : 'core';
}

// ─── Resolve shared source ────────────────────────────────────────────────────

/**
 * If a content file has a `source:` frontmatter pointer, return the absolute
 * path of the shared file. Returns null if no source pointer.
 */
function resolveSourcePath(frontmatter, repoRoot) {
  const source = frontmatter?.source;
  if (!source) return null;

  // source is a repo-root-relative path like /shared/influxdb3-admin/databases/create.md
  const rel = source.startsWith('/') ? source.slice(1) : source;
  return join(repoRoot, 'content', rel);
}

// ─── Main scan ────────────────────────────────────────────────────────────────

/**
 * Scan a set of content files and return signals grouped by operationId.
 *
 * @param {string[]} files           - Absolute paths to .md files
 * @param {Map}      pathToOpId      - From spec inventory
 * @param {string}   repoRoot        - docs-v2 repo root
 * @param {string}   productEdition  - 'core' | 'enterprise' for attribution
 * @param {Set|null} filterOpIds     - If set, only collect signals for these operationIds
 * @returns {Map<string, {docPath, signalType, confidence, editionScope}[]>}
 */
async function scanContentFiles(
  files,
  pathToOpId,
  repoRoot,
  productEdition,
  filterOpIds
) {
  const results = new Map(); // operationId → [signal entries]

  for (const absFile of files) {
    const { frontmatter, body: stubBody } = await parseFrontmatter(absFile);

    // Canonical doc path (relative to content/, for readability)
    const docPath = relative(join(repoRoot, 'content'), absFile);

    // Follow source: pointer if present
    const sharedPath = resolveSourcePath(frontmatter, repoRoot);
    const bodyToScan = sharedPath ? await readSharedBody(sharedPath) : stubBody;

    const signals = extractSignals(bodyToScan);

    for (const sig of signals) {
      const opId = resolveSignal(sig, pathToOpId);
      if (!opId) continue;

      // Track orphaned references (operationId not in spec)
      if (!pathToOpId.size) continue;

      const editionScope = detectEditionScope(bodyToScan, sig.raw);

      const entry = {
        docPath,
        signalType: sig.signalType,
        confidence: sig.confidence,
        editionScope: normaliseEditionScope(editionScope, productEdition),
      };

      if (filterOpIds && !filterOpIds.has(opId)) continue;

      if (!results.has(opId)) results.set(opId, []);
      // Avoid duplicate entries for same docPath + signalType
      const existing = results.get(opId);
      if (
        !existing.some(
          (e) =>
            e.docPath === entry.docPath && e.signalType === entry.signalType
        )
      ) {
        existing.push(entry);
      }
    }
  }

  return { coverageMap: results };
}

async function readSharedBody(absPath) {
  try {
    return await fs.readFile(absPath, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Constrain detected edition scope to what the scanning context allows.
 * If we're scanning the core content tree and detect 'both', it's still 'both'.
 * If we detect 'enterprise' while scanning core tree, that's still enterprise-only.
 */
function normaliseEditionScope(detected, productEdition) {
  if (detected === 'both') return 'both';
  return detected; // trust the show-in markers
}

// ─── Three-way reconciliation ─────────────────────────────────────────────────

/**
 * Reconcile coverage map against full spec inventory to produce:
 *   confirmedMap  - Map<operationId, entries[]>
 *   orphaned      - operationIds referenced in docs but absent from spec
 *   uncovered     - operationIds in spec with no coverage
 */
function reconcile(coverageMap, operationIdToPath, pathToOpId) {
  const confirmedMap = new Map();
  const orphaned = [];
  const uncovered = [];

  // Check each coverage entry against the spec
  for (const [opId, entries] of coverageMap) {
    if (operationIdToPath.has(opId)) {
      confirmedMap.set(opId, entries);
    } else {
      // operationId referenced in docs but not in spec → orphaned
      for (const entry of entries) {
        orphaned.push({ operationId: opId, ...entry });
      }
    }
  }

  // Find spec operations with no coverage
  for (const opId of operationIdToPath.keys()) {
    if (!confirmedMap.has(opId)) {
      uncovered.push(opId);
    }
  }

  return { confirmedMap, orphaned, uncovered };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the doc location map for a given product.
 *
 * @param {'core'|'enterprise'|'both'} product
 * @param {object} options
 * @param {string}  [options.repoRoot]        - Absolute path to docs-v2 root
 * @param {Set}     [options.filterOperationIds] - Only include these operationIds
 * @returns {Promise<{
 *   product: string,
 *   editions: {
 *     core?: { confirmedMap, orphaned, uncovered, specVersion, stats },
 *     enterprise?: { confirmedMap, orphaned, uncovered, specVersion, stats }
 *   }
 * }>}
 */
export async function runDocLocationMap(product, options = {}) {
  const repoRoot =
    options.repoRoot || resolve(new URL('../../..', import.meta.url).pathname);
  const filterOpIds = options.filterOperationIds || null;

  const editions = product === 'both' ? ['core', 'enterprise'] : [product];
  const result = { product, editions: {} };

  for (const edition of editions) {
    const specPath = join(repoRoot, SPEC_PATHS[edition]);
    const contentRoot = join(repoRoot, CONTENT_ROOTS[edition]);

    console.log(
      `\n📍 Doc Location Map — InfluxDB 3 ${edition.charAt(0).toUpperCase() + edition.slice(1)}`
    );
    console.log(`   Spec:    ${SPEC_PATHS[edition]}`);
    console.log(`   Content: ${CONTENT_ROOTS[edition]}`);

    const { operationIdToPath, pathToOperationId, specVersion } =
      await loadSpecInventory(specPath);

    console.log(`   Spec version: ${specVersion}`);
    console.log(`   Operations in spec: ${operationIdToPath.size}`);

    const mdFiles = await walkMarkdown(contentRoot);
    console.log(`   Content files scanned: ${mdFiles.length}`);

    const { coverageMap } = await scanContentFiles(
      mdFiles,
      pathToOperationId,
      repoRoot,
      edition,
      filterOpIds
    );

    const { confirmedMap, orphaned, uncovered } = reconcile(
      coverageMap,
      operationIdToPath,
      pathToOperationId
    );

    const stats = {
      totalOperations: operationIdToPath.size,
      coveredCount: confirmedMap.size,
      orphanedCount: orphaned.length,
      uncoveredCount: uncovered.length,
      coveragePercent:
        operationIdToPath.size > 0
          ? Math.round((confirmedMap.size / operationIdToPath.size) * 100)
          : 0,
    };

    console.log(
      `   Covered: ${stats.coveredCount}/${stats.totalOperations} (${stats.coveragePercent}%)`
    );
    if (orphaned.length > 0) {
      console.log(`   Orphaned references: ${orphaned.length}`);
    }

    result.editions[edition] = {
      confirmedMap,
      orphaned,
      uncovered,
      specVersion,
      operationIdToPath,
      stats,
    };
  }

  return result;
}

/**
 * Write a human-readable markdown report for a doc-location-map result.
 *
 * @param {object} mapResult  - Return value of runDocLocationMap()
 * @param {string} outputDir  - Directory to write reports into
 */
export async function writeDocLocationMapReport(mapResult, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });

  for (const [edition, data] of Object.entries(mapResult.editions)) {
    const {
      confirmedMap,
      orphaned,
      uncovered,
      specVersion,
      operationIdToPath,
      stats,
    } = data;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `doc-location-map-${edition}-${specVersion}.md`;
    const outputPath = join(outputDir, filename);

    const lines = [];
    lines.push(
      `# Doc Location Map — InfluxDB 3 ${edition.charAt(0).toUpperCase() + edition.slice(1)}`
    );
    lines.push('');
    lines.push(`**Spec version:** ${specVersion}`);
    lines.push(`**Generated:** ${timestamp}`);
    lines.push('');

    lines.push('## Coverage Summary');
    lines.push('');
    lines.push(`| Metric | Count |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Total operations in spec | ${stats.totalOperations} |`);
    lines.push(
      `| Operations with doc coverage | ${stats.coveredCount} (${stats.coveragePercent}%) |`
    );
    lines.push(`| Operations with no coverage | ${stats.uncoveredCount} |`);
    lines.push(`| Orphaned doc references | ${stats.orphanedCount} |`);
    lines.push('');

    // Confirmed map
    lines.push('## Confirmed Coverage');
    lines.push('');
    if (confirmedMap.size === 0) {
      lines.push('No confirmed coverage found.');
    } else {
      lines.push('| Operation ID | Method | Path | Doc Pages | Signal |');
      lines.push('|---|---|---|---|---|');
      for (const [opId, entries] of confirmedMap) {
        const opInfo = operationIdToPath.get(opId);
        const pages = entries.map((e) => `\`${e.docPath}\``).join(', ');
        const signal = entries[0]?.signalType || '';
        lines.push(
          `| ${opId} | ${opInfo?.method || ''} | \`${opInfo?.path || ''}\` | ${pages} | ${signal} |`
        );
      }
    }
    lines.push('');

    // Uncovered operations
    if (uncovered.length > 0) {
      lines.push('## Uncovered Operations (No Doc Coverage)');
      lines.push('');
      lines.push(
        'These spec operations have no corresponding documentation page.'
      );
      lines.push('');
      lines.push('| Operation ID | Method | Path | Tags |');
      lines.push('|---|---|---|---|');
      for (const opId of uncovered) {
        const op = operationIdToPath.get(opId);
        const tags = op?.tags?.join(', ') || '';
        lines.push(
          `| ${opId} | ${op?.method || ''} | \`${op?.path || ''}\` | ${tags} |`
        );
      }
      lines.push('');
    }

    // Orphaned references
    if (orphaned.length > 0) {
      lines.push('## Orphaned References (Stale Doc Links)');
      lines.push('');
      lines.push(
        'These doc pages reference operationIds that are no longer in the spec.'
      );
      lines.push('');
      lines.push('| Operation ID (missing from spec) | Doc Page |');
      lines.push('|---|---|');
      for (const ref of orphaned) {
        lines.push(`| ${ref.operationId} | \`${ref.docPath}\` |`);
      }
      lines.push('');
    }

    await fs.writeFile(outputPath, lines.join('\n'), 'utf-8');
    console.log(`\n📄 Doc location map report written: ${outputPath}`);
  }
}
