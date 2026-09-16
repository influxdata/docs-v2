#!/usr/bin/env node
/**
 * check-products-schema.js
 *
 * Validate data/products.yml against scripts/schemas/products.schema.json,
 * then apply the cross-field rules JSON Schema cannot express.
 *
 * Why this exists:
 *   products.yml is read by Hugo templates, the docs CLI, the llms.txt
 *   builders, the triage agent, and docs-tooling. None of them validate it.
 *   A field-name typo, an unquoted `latest: 1.10` that YAML turns into the
 *   number 1.1, or a `latest_patch: tbd` all pass every other check and show
 *   up as an empty download URL or a wrong version badge on the live site.
 *
 * Checks beyond the schema:
 *   - Keys of per-version maps (latest_patches, content_path, latest_cli,
 *     oss_repo.branch, label_group) are listed in `versions`.
 *   - When `latest` is a MAJOR.MINOR label (v1.13, 2.9), the patch version
 *     for that major starts with MAJOR.MINOR. Catches a patch bump that
 *     forgot `latest`, or the reverse.
 *   - Every gate in .ci/release-gates.yml points at a product and field that
 *     exist and hold a version. A gate on a missing field would never fire.
 *
 * Output: one line per problem, plus a GitHub Actions ::error annotation for
 * each when running in CI. Exit 1 on any problem, 2 if a file cannot be read.
 *
 * Usage: node .ci/scripts/check-products-schema.js [products.yml]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import { readJson, readYaml } from '../../scripts/lib/file-operations.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');
const DEFAULT_PRODUCTS = join(REPO_ROOT, 'data', 'products.yml');
const DEFAULT_SCHEMA = join(
  REPO_ROOT,
  'scripts',
  'schemas',
  'products.schema.json'
);
const DEFAULT_GATES = join(REPO_ROOT, '.ci', 'release-gates.yml');

const PER_VERSION_FIELDS = [
  'latest_patches',
  'content_path',
  'latest_cli',
  'label_group',
];

/** Read a dotted path such as `latest_patches.v1` from an object. */
function getPath(obj, dotted) {
  return dotted.split('.').reduce((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return acc[key];
  }, obj);
}

function isPlainObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

/** Turn an ajv error into `products.<key>.<path>: message`. */
function formatAjvError(err) {
  const path = err.instancePath
    .split('/')
    .filter(Boolean)
    .map((p) => p.replace(/~1/g, '/').replace(/~0/g, '~'));
  const where = path.length ? `products.${path.join('.')}` : 'products';
  let msg = err.message;
  if (err.keyword === 'additionalProperties') {
    msg = `unknown field "${err.params.additionalProperty}" (typo, or add it to scripts/schemas/products.schema.json)`;
  } else if (err.keyword === 'enum') {
    msg = `${err.message}: ${err.params.allowedValues.join(', ')}`;
  } else if (err.keyword === 'type' && err.params.type === 'string') {
    msg =
      'must be a string (quote numeric values in YAML so 1.10 is not read as 1.1)';
  } else if (err.keyword === 'pattern') {
    msg = `must match ${err.params.pattern}`;
  } else if (err.keyword === 'not') {
    msg = 'must not have both latest_patch and latest_patches';
  }
  return `${where}: ${msg}`;
}

/** Schema validation. Returns an array of message strings. */
export function schemaErrors(products, schema) {
  // strictRequired is off: the `not: { required: [...] }` rule that forbids
  // latest_patch alongside latest_patches is exactly the pattern it rejects.
  const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
  const validate = ajv.compile(schema);
  if (validate(products)) return [];
  // Drop the noisy oneOf/anyOf wrapper errors when a branch error explains it.
  const errors = validate.errors.filter(
    (e) => !['oneOf', 'anyOf', 'if'].includes(e.keyword)
  );
  return [...new Set(errors.map(formatAjvError))];
}

/**
 * Cross-field rules. Returns an array of message strings.
 * Assumes the schema passed, so field types are as declared.
 */
export function semanticErrors(products, gates = {}) {
  const errors = [];

  for (const [key, p] of Object.entries(products)) {
    if (!isPlainObject(p)) continue;
    const versions = Array.isArray(p.versions) ? p.versions : null;

    // Per-version maps must be keyed by declared versions.
    const maps = PER_VERSION_FIELDS.map((f) => [f, p[f]]);
    if (isPlainObject(p.oss_repo) && isPlainObject(p.oss_repo.branch)) {
      maps.push(['oss_repo.branch', p.oss_repo.branch]);
    }
    for (const [field, value] of maps) {
      if (!isPlainObject(value)) continue;
      if (!versions) {
        errors.push(
          `products.${key}.${field}: is a per-version map but "versions" is not set`
        );
        continue;
      }
      for (const v of Object.keys(value)) {
        if (!versions.includes(v)) {
          errors.push(
            `products.${key}.${field}.${v}: "${v}" is not in versions [${versions.join(', ')}]`
          );
        }
      }
    }

    // `latest` as a MAJOR.MINOR label must agree with the patch version.
    const m = /^v?(\d+)\.(\d+)$/.exec(String(p.latest));
    if (m) {
      const [, major, minor] = m;
      const prefix = `${major}.${minor}.`;
      let patch;
      let where;
      if (p.latest_patch != null) {
        patch = String(p.latest_patch);
        where = 'latest_patch';
      } else if (isPlainObject(p.latest_patches)) {
        const vkey = `v${major}`;
        if (p.latest_patches[vkey] != null) {
          patch = String(p.latest_patches[vkey]);
          where = `latest_patches.${vkey}`;
        }
      }
      if (patch != null && !patch.startsWith(prefix)) {
        errors.push(
          `products.${key}.latest: "${p.latest}" disagrees with ${where} "${patch}" (expected ${prefix}x)`
        );
      }
    }
  }

  // Release gates must point at something real.
  for (const [product, gate] of Object.entries(gates || {})) {
    if (!isPlainObject(gate) || !gate.field) continue;
    if (!isPlainObject(products[product])) {
      errors.push(
        `.ci/release-gates.yml: gated product "${product}" is not in products.yml`
      );
      continue;
    }
    const value = getPath(products[product], gate.field);
    if (
      value == null ||
      typeof value === 'object' ||
      String(value).trim() === ''
    ) {
      errors.push(
        `.ci/release-gates.yml: "${product}.${gate.field}" is not set in products.yml; the gate would never fire`
      );
    }
  }

  return errors;
}

/** Full check on parsed inputs. Returns all messages, schema first. */
export function check(products, schema, gates) {
  const errors = schemaErrors(products, schema);
  // Semantic rules assume declared types; skip them when the shape is wrong.
  if (errors.length) return errors;
  return semanticErrors(products, gates);
}

function main() {
  const productsPath = process.argv[2] || DEFAULT_PRODUCTS;
  let products;
  let schema;
  let gates;
  try {
    products = readYaml(productsPath);
    schema = readJson(DEFAULT_SCHEMA);
    gates = readYaml(DEFAULT_GATES) || {};
  } catch (e) {
    console.error(`::error::${e.message}`);
    process.exit(2);
  }
  if (!isPlainObject(products)) {
    console.error(`::error::${productsPath} is empty or not a YAML mapping`);
    process.exit(2);
  }

  const errors = check(products, schema, gates);
  const rel = productsPath.startsWith(REPO_ROOT)
    ? productsPath.slice(REPO_ROOT.length + 1)
    : productsPath;
  if (!errors.length) {
    console.log(`${rel}: ok (${Object.keys(products).length} products)`);
    return;
  }
  console.error(`${rel}: ${errors.length} problem(s)`);
  for (const e of errors) {
    console.error(`  - ${e}`);
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::error file=${rel}::${e}`);
    }
  }
  process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
