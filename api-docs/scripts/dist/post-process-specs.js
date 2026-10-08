#!/usr/bin/env node
"use strict";
/**
 * Post-Process Specs
 *
 * Applies content overlays and tag configuration to bundled OpenAPI specs.
 * Runs after `getswagger.sh` bundles specs and before
 * `generate-openapi-articles.ts` generates Hugo pages.
 *
 * Replaces Redocly decorators for:
 * - info.yml overlays (title, description, version, license, contact, x-* fields)
 * - servers.yml overlays (replaces spec.servers array)
 * - tags.yml config (rename, describe, add x-related links to tags)
 *
 * Usage:
 *   node api-docs/scripts/dist/post-process-specs.js              # All products
 *   node api-docs/scripts/dist/post-process-specs.js influxdb3/core  # One product
 *
 * @module post-process-specs
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const LOG_PREFIX = '[post-process]';
/** Build output directory for resolved specs. Source specs are never mutated. */
const BUILD_DIR = '_build';
/** Product directories that contain a .config.yml with `apis:` entries. */
const PRODUCT_DIRS = [
    'influxdb3/core',
    'influxdb3/enterprise',
    'influxdb3/cloud',
    'influxdb3/cloud-dedicated',
    'influxdb3/cloud-serverless',
    'influxdb3/clustered',
    'influxdb/cloud',
    'influxdb/v2',
    'influxdb/v1',
    'enterprise_influxdb/v1',
];
/**
 * Product directories whose committed source spec is a raw upstream mirror
 * (getswagger.sh applies no `docs-plugin.cjs` decorators for these — see
 * the `docs/mirror` redocly config). Presentation transforms that used to
 * run as bundle-time decorators are applied here instead, at build time,
 * so the committed spec stays a clean diff against `influxdata/openapi`.
 *
 * Maps product dir -> the docs-v2 URL path segment for that product, used
 * to rewrite `/influxdb/latest/...` doc links to the correct product path.
 */
const MIRROR_PRODUCT_PATHS = {
    'influxdb/v2': 'v2',
    'influxdb/cloud': 'cloud',
};
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Parse a YAML file and return the parsed object, or null if the file does
 * not exist.
 */
function loadYaml(filePath) {
    if (!fs.existsSync(filePath))
        return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return yaml.load(raw);
}
/**
 * Write an object to a YAML file.
 */
function writeYaml(filePath, data) {
    fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}
function log(msg) {
    process.stderr.write(`${LOG_PREFIX} ${msg}\n`);
}
// ---------------------------------------------------------------------------
// Content overlays
// ---------------------------------------------------------------------------
/**
 * Resolve a content file path using the same convention as the Redocly
 * docs-content.cjs helper: try API-specific directory first, fall back to
 * product-level directory.
 *
 * @param filename - e.g. 'info.yml' or 'servers.yml'
 * @param specDir - Absolute path to the directory containing the spec file.
 * @param productAbsDir - Absolute path to the product directory.
 * @returns Absolute path to the content file, or null if not found.
 */
function resolveContentFile(filename, specDir, productAbsDir) {
    // API-specific: {specDir}/content/{filename}
    const apiSpecific = path.join(specDir, 'content', filename);
    if (fs.existsSync(apiSpecific))
        return apiSpecific;
    // Product-level fallback: {productAbsDir}/content/{filename}
    const productLevel = path.join(productAbsDir, 'content', filename);
    if (fs.existsSync(productLevel))
        return productLevel;
    return null;
}
/**
 * Apply info.yml overlay to the spec. Merges each field present in the
 * overlay into spec.info, preserving fields not mentioned in the overlay.
 *
 * @returns true if any fields were applied.
 */
function applyInfoOverlay(spec, specDir, productAbsDir, label) {
    const infoPath = resolveContentFile('info.yml', specDir, productAbsDir);
    if (!infoPath)
        return false;
    const overlay = loadYaml(infoPath);
    if (!overlay)
        return false;
    if (!spec.info)
        spec.info = {};
    let applied = 0;
    for (const [key, value] of Object.entries(overlay)) {
        spec.info[key] = value;
        applied++;
    }
    if (applied > 0) {
        log(`${label}: applied ${applied} info field(s) from ${path.relative(productAbsDir, infoPath)}`);
    }
    return applied > 0;
}
/**
 * Apply servers.yml overlay to the spec. Replaces spec.servers entirely.
 *
 * @returns true if servers were applied.
 */
function applyServersOverlay(spec, specDir, productAbsDir, label) {
    const serversPath = resolveContentFile('servers.yml', specDir, productAbsDir);
    if (!serversPath)
        return false;
    const servers = loadYaml(serversPath);
    if (!servers || !Array.isArray(servers))
        return false;
    spec.servers = servers;
    log(`${label}: applied ${servers.length} server(s) from ${path.relative(productAbsDir, serversPath)}`);
    return true;
}
// ---------------------------------------------------------------------------
// Mirror-product presentation transforms
//
// Ported from the retired `docs-plugin.cjs` bundle-time decorators
// (delete-servers, remove-private-paths, strip-version-prefix,
// strip-trailing-slash, replace-docs-url-shortcode). Applied only to
// MIRROR_PRODUCT_PATHS entries, whose committed source is now a raw
// upstream mirror.
// ---------------------------------------------------------------------------
/** Remove operation-level servers entries with an empty url. */
function deleteEmptyServers(spec) {
    for (const pathItem of Object.values(spec.paths ?? {})) {
        for (const operation of Object.values(pathItem)) {
            if (operation &&
                typeof operation === 'object' &&
                Array.isArray(operation.servers)) {
                operation.servers = operation.servers.filter((server) => server.url);
            }
        }
    }
}
/** Drop any top-level path whose key contains a "private" segment. */
function removePrivatePaths(spec) {
    const privatePath = /\/.*private/;
    for (const apiPath of Object.keys(spec.paths ?? {})) {
        if (privatePath.test(apiPath)) {
            delete (spec.paths ?? {})[apiPath];
        }
    }
}
/**
 * Move a fixed set of unversioned operations (health, ping, debug, legacy
 * auth) out from under the `/api/v2` prefix.
 */
function stripVersionPrefix(spec) {
    const nonversioned = [
        '/debug',
        '/health',
        '/legacy/authorizations',
        '/legacy/authorizations/{authID}',
        '/legacy/authorizations/{authID}/password',
        '/ping',
        '/ready',
    ];
    const prefix = '/api/v2';
    const paths = spec.paths ?? {};
    for (const nv of nonversioned) {
        const pathItem = paths[prefix + nv];
        if (pathItem) {
            delete paths[prefix + nv];
            paths[nv] = pathItem;
        }
    }
}
/** Remove a single trailing slash from every path key. */
function stripTrailingSlash(spec) {
    const paths = spec.paths ?? {};
    for (const p of Object.keys(paths)) {
        if (p.length > 1 && p.endsWith('/')) {
            const pathItem = paths[p];
            delete paths[p];
            paths[p.slice(0, -1)] = pathItem;
        }
    }
}
/**
 * Walk every string value anywhere in a parsed spec (description text,
 * externalDocs.url, etc.) and replace it with the result of `visit`.
 */
function rewriteStrings(node, visit) {
    if (Array.isArray(node)) {
        for (const item of node)
            rewriteStrings(item, visit);
        return;
    }
    if (node && typeof node === 'object') {
        const obj = node;
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                obj[key] = visit(value);
            }
            else {
                rewriteStrings(value, visit);
            }
        }
    }
}
/**
 * Rewrite doc links embedded anywhere in the spec (descriptions,
 * externalDocs.url, ...) so they point at this product's docs-v2 path
 * instead of the generic `latest` upstream uses.
 */
function rewriteDocLinks(spec, productPath) {
    const productRoot = `/influxdb/${productPath}`;
    rewriteStrings(spec, (text) => text
        .replaceAll(/\{\{%\s*INFLUXDB_DOCS_URL\s*%\}\}/g, `${productRoot}`)
        .replaceAll('https://docs.influxdata.com/influxdb/latest/', `${productRoot}/`)
        .replaceAll('https://docs.influxdata.com/influxdb/', '/influxdb/')
        .replaceAll('/influxdb/latest/', `${productRoot}/`));
}
/** Apply every mirror-product presentation transform, in decorator order. */
function applyMirrorTransforms(spec, productPath) {
    deleteEmptyServers(spec);
    removePrivatePaths(spec);
    stripVersionPrefix(spec);
    stripTrailingSlash(spec);
    rewriteDocLinks(spec, productPath);
}
// ---------------------------------------------------------------------------
// Tag config
// ---------------------------------------------------------------------------
/**
 * Collect every tag name referenced across all operations in the spec.
 */
function collectOperationTags(spec) {
    const found = new Set();
    for (const pathItem of Object.values(spec.paths ?? {})) {
        for (const operation of Object.values(pathItem)) {
            if (operation &&
                typeof operation === 'object' &&
                Array.isArray(operation.tags)) {
                for (const t of operation.tags)
                    found.add(t);
            }
        }
    }
    return found;
}
/**
 * Rename a tag throughout the spec: in `tags[]` and in every operation.
 */
function renameTag(spec, oldName, newName) {
    for (const tag of spec.tags ?? []) {
        if (tag.name === oldName)
            tag.name = newName;
    }
    for (const pathItem of Object.values(spec.paths ?? {})) {
        for (const operation of Object.values(pathItem)) {
            if (operation &&
                typeof operation === 'object' &&
                Array.isArray(operation.tags)) {
                operation.tags = operation.tags.map((t) => t === oldName ? newName : t);
            }
        }
    }
}
/**
 * Reassign operations from one tag to others based on API path patterns.
 * For each reassignment rule, operations whose path starts with any of the
 * specified prefixes have the source tag replaced with the target tag.
 * Operations that don't match any rule keep the original tag.
 */
function reassignTag(spec, sourceTag, rules, label) {
    const newTagNames = new Set(rules.map((r) => r.tag));
    for (const [apiPath, pathItem] of Object.entries(spec.paths ?? {})) {
        for (const operation of Object.values(pathItem)) {
            if (!operation ||
                typeof operation !== 'object' ||
                !Array.isArray(operation.tags) ||
                !operation.tags.includes(sourceTag)) {
                continue;
            }
            const rule = rules.find((r) => r.paths.some((prefix) => apiPath.startsWith(prefix)));
            if (rule) {
                operation.tags = operation.tags.map((t) => t === sourceTag ? rule.tag : t);
            }
        }
    }
    // Update spec.tags[]: remove the source tag if no operations reference it,
    // and ensure new tags exist in the array.
    const remainingOps = collectOperationTags(spec);
    if (!remainingOps.has(sourceTag)) {
        spec.tags = (spec.tags ?? []).filter((t) => t.name !== sourceTag);
    }
    for (const name of newTagNames) {
        if (!(spec.tags ?? []).some((t) => t.name === name)) {
            spec.tags = spec.tags ?? [];
            spec.tags.push({ name });
        }
    }
    log(`${label}: reassigned '${sourceTag}' → ${[...newTagNames].map((n) => `'${n}'`).join(', ')}`);
}
/**
 * Drop a tag from the spec: remove it from `spec.tags[]`, strip it from every
 * operation's `tags[]` array, delete operations that have no remaining tags,
 * and delete path items that have no remaining HTTP method operations.
 */
function dropTag(spec, tagName, label) {
    // Remove from spec.tags[]
    spec.tags = (spec.tags ?? []).filter((t) => t.name !== tagName);
    const HTTP_METHODS = new Set([
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace',
    ]);
    let droppedOps = 0;
    for (const [apiPath, pathItem] of Object.entries(spec.paths ?? {})) {
        for (const method of Object.keys(pathItem)) {
            if (!HTTP_METHODS.has(method))
                continue;
            const operation = pathItem[method];
            if (!operation || typeof operation !== 'object' || !Array.isArray(operation.tags)) {
                continue;
            }
            if (!operation.tags.includes(tagName))
                continue;
            // Remove the dropped tag from this operation's tags array
            operation.tags = operation.tags.filter((t) => t !== tagName);
            // If no tags remain, delete the operation from the path item
            if (operation.tags.length === 0) {
                delete pathItem[method];
                droppedOps++;
            }
        }
        // Remove path item if it has no remaining HTTP method operations
        const remainingMethods = Object.keys(pathItem).filter((k) => HTTP_METHODS.has(k));
        if (remainingMethods.length === 0) {
            delete (spec.paths ?? {})[apiPath];
        }
    }
    log(`${label}: dropped tag '${tagName}' (${droppedOps} operations removed)`);
}
/**
 * Apply tag config from a `tags.yml` file to the spec.
 *
 * @returns true if any tags were patched.
 */
function applyTagConfig(spec, tagConfigPath, label) {
    const tagsCfg = loadYaml(tagConfigPath);
    if (!tagsCfg || !tagsCfg.tags) {
        log(`${label}: tags.yml has no 'tags' key — skipping`);
        return false;
    }
    if (!Array.isArray(spec.tags))
        spec.tags = [];
    const configKeys = Object.keys(tagsCfg.tags);
    const droppedTagNames = new Set(configKeys.filter((k) => tagsCfg.tags[k]?.drop === true));
    // Apply drops first (before renames/reassignments so source names match the spec)
    for (const tagKey of droppedTagNames) {
        dropTag(spec, tagKey, label);
    }
    // Re-collect operation tags after drops
    const operationTags = collectOperationTags(spec);
    // Warn: config references a tag not in the spec (skip trait tags, reassignment targets, and dropped tags)
    for (const cfgKey of configKeys) {
        if (droppedTagNames.has(cfgKey))
            continue;
        const cfg = tagsCfg.tags[cfgKey];
        const effectiveName = cfg?.rename ?? cfgKey;
        const isTraitTag = cfg?.['x-traitTag'] === true;
        const isReassignTarget = configKeys.some((k) => tagsCfg.tags[k]?.reassign?.some((r) => r.tag === cfgKey));
        if (!isTraitTag &&
            !isReassignTarget &&
            !operationTags.has(cfgKey) &&
            !operationTags.has(effectiveName)) {
            log(`WARN ${label}: config tag '${cfgKey}' not found in spec operations`);
        }
    }
    // Warn: spec has operation tags with no config entry
    Array.from(operationTags).forEach((opTag) => {
        const hasEntry = configKeys.some((k) => k === opTag || tagsCfg.tags[k]?.rename === opTag);
        if (!hasEntry) {
            log(`WARN ${label}: spec tag '${opTag}' has no config entry in tags.yml`);
        }
    });
    // Apply reassignments (before renames, so source tag names match the spec)
    for (const [tagKey, cfg] of Object.entries(tagsCfg.tags)) {
        if (droppedTagNames.has(tagKey))
            continue;
        if (cfg.reassign) {
            reassignTag(spec, tagKey, cfg.reassign, label);
        }
    }
    // Apply remaining transformations (skip dropped tags)
    for (const [tagKey, cfg] of Object.entries(tagsCfg.tags)) {
        if (droppedTagNames.has(tagKey))
            continue;
        if (cfg.rename) {
            log(`${label}: renaming tag '${tagKey}' → '${cfg.rename}'`);
            renameTag(spec, tagKey, cfg.rename);
        }
        const resolvedName = cfg.rename ?? tagKey;
        let tagObj = spec.tags.find((t) => t.name === resolvedName);
        if (!tagObj) {
            tagObj = { name: resolvedName };
            spec.tags.push(tagObj);
        }
        if (cfg.description !== undefined)
            tagObj.description = cfg.description.trim();
        if (cfg['x-traitTag'] !== undefined)
            tagObj['x-traitTag'] = cfg['x-traitTag'];
        if (cfg['x-related'] !== undefined)
            tagObj['x-related'] = cfg['x-related'];
    }
    const nonDroppedCount = configKeys.length - droppedTagNames.size;
    log(`${label}: patched ${nonDroppedCount} tag(s), dropped ${droppedTagNames.size} tag(s)`);
    return true;
}
// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------
/**
 * Process a single product directory: read `.config.yml`, find spec files,
 * apply content overlays and tag configs, write resolved specs to _build/.
 *
 * Source specs in api-docs/ are never mutated. Resolved output goes to
 * api-docs/_build/{productDir}/{specFile} for downstream consumers
 * (Redoc HTML, generate-openapi-articles.ts).
 */
function processProduct(apiDocsRoot, productDir) {
    const productAbsDir = path.join(apiDocsRoot, productDir);
    const configPath = path.join(productAbsDir, '.config.yml');
    const config = loadYaml(configPath);
    if (!config || !config.apis) {
        log(`${productDir}: no .config.yml or no 'apis' key — skipping`);
        return;
    }
    for (const [_apiKey, apiEntry] of Object.entries(config.apis)) {
        const specRelPath = apiEntry.root;
        const specAbsPath = path.join(productAbsDir, specRelPath);
        const specDir = path.join(productAbsDir, path.dirname(specRelPath));
        const label = path.join(productDir, specRelPath);
        if (!fs.existsSync(specAbsPath)) {
            log(`${label}: spec not found at ${specAbsPath} — skipping`);
            continue;
        }
        // Load spec once
        const spec = loadYaml(specAbsPath);
        if (!spec) {
            log(`${label}: failed to parse spec — skipping`);
            continue;
        }
        // Apply all transforms
        const mirrorProductPath = MIRROR_PRODUCT_PATHS[productDir];
        if (mirrorProductPath) {
            applyMirrorTransforms(spec, mirrorProductPath);
            log(`${label}: applied mirror presentation transforms`);
        }
        applyInfoOverlay(spec, specDir, productAbsDir, label);
        applyServersOverlay(spec, specDir, productAbsDir, label);
        const tagConfigPath = path.join(specDir, 'tags.yml');
        if (fs.existsSync(tagConfigPath)) {
            applyTagConfig(spec, tagConfigPath, label);
        }
        // Write resolved spec to _build/, mirroring the source path structure
        const outPath = path.join(apiDocsRoot, BUILD_DIR, productDir, specRelPath);
        const outDir = path.dirname(outPath);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        writeYaml(outPath, spec);
        log(`${label}: wrote ${path.relative(apiDocsRoot, outPath)}`);
    }
}
// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
function main() {
    const args = process.argv.slice(2);
    // Optional --root <path> flag for testing — overrides the default resolution.
    let apiDocsRoot = path.resolve(__dirname, '../..'); // api-docs/scripts/dist -> api-docs/
    let targetProduct;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--root' && args[i + 1]) {
            apiDocsRoot = path.resolve(args[i + 1]);
            i++;
        }
        else {
            targetProduct = args[i];
        }
    }
    const products = targetProduct ? [targetProduct] : PRODUCT_DIRS;
    let hasError = false;
    for (const productDir of products) {
        try {
            processProduct(apiDocsRoot, productDir);
        }
        catch (err) {
            log(`ERROR ${productDir}: ${err.message}`);
            hasError = true;
        }
    }
    process.exit(hasError ? 1 : 0);
}
main();
//# sourceMappingURL=post-process-specs.js.map