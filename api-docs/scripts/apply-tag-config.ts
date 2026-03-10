#!/usr/bin/env node
/**
 * Apply Tag Config Script
 *
 * Reads colocated `tags.yml` config files and patches OpenAPI spec files in
 * place. Runs after `getswagger.sh` bundles specs and before
 * `generate-openapi-articles.ts` generates Hugo pages.
 *
 * Usage:
 *   node api-docs/scripts/dist/apply-tag-config.js           # All products
 *   node api-docs/scripts/dist/apply-tag-config.js influxdb3/core  # One product
 *
 * tags.yml format (colocated with the spec file):
 *   tags:
 *     Write data:
 *       description: Write line protocol data to InfluxDB.
 *       x-related:
 *         - title: Write data guide
 *           href: /influxdb3/core/write-data/
 *     Cache data:
 *       rename: Cache distinct values
 *       description: Query cached distinct values.
 *
 * @module apply-tag-config
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RelatedLink {
  title: string;
  href: string;
}

interface TagConfig {
  rename?: string;
  description?: string;
  'x-related'?: RelatedLink[];
}

interface TagsYml {
  tags: Record<string, TagConfig>;
}

interface ProductConfigApi {
  root: string;
  [key: string]: unknown;
}

interface ProductConfigYml {
  apis?: Record<string, ProductConfigApi>;
  [key: string]: unknown;
}

/** An OpenAPI tag object. */
interface OpenApiTag {
  name: string;
  description?: string;
  'x-related'?: RelatedLink[];
  [key: string]: unknown;
}

/** Minimal shape of an OpenAPI spec needed for tag patching. */
interface OpenApiSpec {
  tags?: OpenApiTag[];
  paths?: Record<string, Record<string, { tags?: string[]; [k: string]: unknown }>>;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Product directories that contain a .config.yml with `apis:` entries. */
const PRODUCT_DIRS = [
  'influxdb3/core',
  'influxdb3/enterprise',
  'influxdb3/cloud-dedicated',
  'influxdb3/cloud-serverless',
  'influxdb3/clustered',
  'influxdb/cloud',
  'influxdb/v2',
  'influxdb/v1',
  'enterprise_influxdb/v1',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a YAML file and return the parsed object, or null if the file does
 * not exist.
 *
 * @param filePath - Absolute path to a YAML file.
 * @returns Parsed object or null.
 * @throws If the file exists but contains invalid YAML.
 */
function loadYaml<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw) as T;
}

/**
 * Write an object to a YAML file, preserving no special ordering.
 *
 * @param filePath - Absolute path to write.
 * @param data - Object to serialise.
 */
function writeYaml(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
}

/**
 * Collect every tag name referenced across all operations in the spec.
 *
 * @param spec - Parsed OpenAPI spec.
 * @returns Set of tag name strings.
 */
function collectOperationTags(spec: OpenApiSpec): Set<string> {
  const found = new Set<string>();
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const operation of Object.values(pathItem)) {
      if (operation && typeof operation === 'object' && Array.isArray(operation.tags)) {
        for (const t of operation.tags) found.add(t as string);
      }
    }
  }
  return found;
}

/**
 * Rename a tag throughout the spec: in `tags[]` and in every operation.
 *
 * @param spec - Parsed OpenAPI spec (mutated in place).
 * @param oldName - Current tag name.
 * @param newName - Replacement tag name.
 */
function renameTag(spec: OpenApiSpec, oldName: string, newName: string): void {
  for (const tag of spec.tags ?? []) {
    if (tag.name === oldName) tag.name = newName;
  }
  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const operation of Object.values(pathItem)) {
      if (operation && typeof operation === 'object' && Array.isArray(operation.tags)) {
        operation.tags = operation.tags.map((t: string) => (t === oldName ? newName : t));
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/**
 * Apply one `tags.yml` config to the matching OpenAPI spec file.
 *
 * @param specPath - Absolute path to the OpenAPI spec (YAML).
 * @param tagConfigPath - Absolute path to `tags.yml`.
 * @param productLabel - Human-readable label for log messages.
 */
function applyTagConfig(specPath: string, tagConfigPath: string, productLabel: string): void {
  const tagsCfg = loadYaml<TagsYml>(tagConfigPath);
  if (!tagsCfg || !tagsCfg.tags) {
    process.stderr.write(`[apply-tag-config] ${productLabel}: tags.yml has no 'tags' key — skipping\n`);
    return;
  }

  const spec = loadYaml<OpenApiSpec>(specPath);
  if (!spec) {
    process.stderr.write(`[apply-tag-config] ${productLabel}: spec not found at ${specPath} — skipping\n`);
    return;
  }

  if (!Array.isArray(spec.tags)) spec.tags = [];

  const operationTags = collectOperationTags(spec);
  const configKeys = Object.keys(tagsCfg.tags);

  // Warn: config references a tag not in the spec
  for (const cfgKey of configKeys) {
    const effectiveName = tagsCfg.tags[cfgKey]?.rename ?? cfgKey;
    if (!operationTags.has(cfgKey) && !operationTags.has(effectiveName)) {
      process.stderr.write(
        `[apply-tag-config] WARN ${productLabel}: config tag '${cfgKey}' not found in spec operations\n`
      );
    }
  }

  // Warn: spec has operation tags with no config entry
  Array.from(operationTags).forEach((opTag) => {
    const hasEntry = configKeys.some(
      (k) => k === opTag || tagsCfg.tags[k]?.rename === opTag
    );
    if (!hasEntry) {
      process.stderr.write(
        `[apply-tag-config] WARN ${productLabel}: spec tag '${opTag}' has no config entry in tags.yml\n`
      );
    }
  });

  // Apply transformations
  for (const [tagKey, cfg] of Object.entries(tagsCfg.tags)) {
    const resolvedName = cfg.rename ?? tagKey;

    // Rename before patching so we update the correct tag object
    if (cfg.rename) {
      process.stderr.write(
        `[apply-tag-config] ${productLabel}: renaming tag '${tagKey}' → '${cfg.rename}'\n`
      );
      renameTag(spec, tagKey, cfg.rename);
    }

    // Find or create the tag object in spec.tags[]
    let tagObj = spec.tags!.find((t) => t.name === resolvedName);
    if (!tagObj) {
      tagObj = { name: resolvedName };
      spec.tags!.push(tagObj);
    }

    if (cfg.description !== undefined) tagObj.description = cfg.description.trim();
    if (cfg['x-related'] !== undefined) tagObj['x-related'] = cfg['x-related'];
  }

  writeYaml(specPath, spec);
  process.stderr.write(
    `[apply-tag-config] ${productLabel}: patched ${configKeys.length} tag(s) in ${path.basename(specPath)}\n`
  );
}

/**
 * Process a single product directory: read `.config.yml`, find spec files,
 * look for a colocated `tags.yml`, and apply transformations.
 *
 * @param apiDocsRoot - Absolute path to the `api-docs/` directory.
 * @param productDir - Product directory relative to `api-docs/` (e.g. `influxdb3/core`).
 */
function processProduct(apiDocsRoot: string, productDir: string): void {
  const productAbsDir = path.join(apiDocsRoot, productDir);
  const configPath = path.join(productAbsDir, '.config.yml');

  const config = loadYaml<ProductConfigYml>(configPath);
  if (!config || !config.apis) {
    process.stderr.write(
      `[apply-tag-config] ${productDir}: no .config.yml or no 'apis' key — skipping\n`
    );
    return;
  }

  for (const [apiKey, apiEntry] of Object.entries(config.apis)) {
    const specRelPath = apiEntry.root;
    const specDir = path.join(productAbsDir, path.dirname(specRelPath));
    const specAbsPath = path.join(productAbsDir, specRelPath);
    const tagConfigPath = path.join(specDir, 'tags.yml');

    if (!fs.existsSync(tagConfigPath)) continue; // silent skip — not yet configured

    const label = `${productDir}/${apiKey}`;
    applyTagConfig(specAbsPath, tagConfigPath, label);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);

  // Optional --root <path> flag for testing — overrides the default resolution.
  let apiDocsRoot = path.resolve(__dirname, '../..'); // api-docs/scripts/dist -> api-docs/
  let targetProduct: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root' && args[i + 1]) {
      apiDocsRoot = path.resolve(args[i + 1]!);
      i++;
    } else {
      targetProduct = args[i];
    }
  }

  const products = targetProduct ? [targetProduct] : PRODUCT_DIRS;

  let hasError = false;
  for (const productDir of products) {
    try {
      processProduct(apiDocsRoot, productDir);
    } catch (err) {
      process.stderr.write(
        `[apply-tag-config] ERROR ${productDir}: ${(err as Error).message}\n`
      );
      hasError = true;
    }
  }

  process.exit(hasError ? 1 : 0);
}

main();
