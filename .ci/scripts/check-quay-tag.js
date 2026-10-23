#!/usr/bin/env node
/**
 * check-quay-tag.js
 *
 * Compare two data/products.yml files and fail when a product's
 * `latest_patch` changes but its `latest_quay_tag` doesn't. Quay tags
 * InfluxDB 3 images by release commit SHA, and the install page renders the
 * version and the tag together, so a version bump with a stale tag pairs the
 * new version with the previous release's image.
 *
 * A product is checked when either file defines `latest_quay_tag` for it.
 * The new tag must also be a full 40-character commit SHA.
 *
 * Usage: node check-quay-tag.js <old-products.yml> <new-products.yml>
 * Exits 1 when any product fails, 0 otherwise.
 */
import { appendFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const SHA_RE = /^[0-9a-f]{40}$/;

/**
 * Return one error string per product whose Quay tag is missing, malformed,
 * or unchanged after a `latest_patch` change.
 */
export function findQuayTagErrors(oldProducts, newProducts) {
  const errors = [];
  const oldP =
    oldProducts && typeof oldProducts === 'object' ? oldProducts : {};
  const newP =
    newProducts && typeof newProducts === 'object' ? newProducts : {};

  for (const [key, next] of Object.entries(newP)) {
    if (!next || typeof next !== 'object') continue;
    const prev = oldP[key] && typeof oldP[key] === 'object' ? oldP[key] : {};
    if (prev.latest_quay_tag == null && next.latest_quay_tag == null) continue;

    const newTag =
      next.latest_quay_tag == null ? '' : String(next.latest_quay_tag);
    const oldTag =
      prev.latest_quay_tag == null ? '' : String(prev.latest_quay_tag);
    const newPatch = next.latest_patch == null ? '' : String(next.latest_patch);
    const oldPatch = prev.latest_patch == null ? '' : String(prev.latest_patch);

    if (!newTag) {
      errors.push(`${key}: latest_quay_tag is missing.`);
    } else if (!SHA_RE.test(newTag)) {
      errors.push(
        `${key}: latest_quay_tag "${newTag}" isn't a full 40-character commit SHA.`
      );
    } else if (oldPatch && newPatch !== oldPatch && newTag === oldTag) {
      errors.push(
        `${key}: latest_patch changed (${oldPatch} → ${newPatch}) but ` +
          `latest_quay_tag is still ${oldTag}. Set it to the ${newPatch} ` +
          'release commit SHA.'
      );
    }
  }
  return errors;
}

function load(path) {
  try {
    return yaml.load(readFileSync(path, 'utf8')) || {};
  } catch {
    return {};
  }
}

function main() {
  const [oldPath, newPath] = process.argv.slice(2);
  if (!oldPath || !newPath) {
    console.error(
      'Usage: check-quay-tag.js <old-products.yml> <new-products.yml>'
    );
    process.exit(2);
  }
  const errors = findQuayTagErrors(load(oldPath), load(newPath));

  const lines = ['## Quay tag check', ''];
  if (errors.length) {
    for (const e of errors) {
      lines.push(`- ${e}`);
      console.log(`::error file=data/products.yml::${e}`);
    }
    lines.push(
      '',
      'Quay tags InfluxDB 3 images by release commit SHA: Core in ' +
        '`influxdata/influxdb`, Enterprise in `influxdata/influxdb_pro`.'
    );
  } else {
    lines.push('`latest_quay_tag` is consistent with `latest_patch`.');
  }
  const report = lines.join('\n');
  console.log(report);

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
    } catch {
      /* best-effort; stdout already carries the report */
    }
  }

  process.exit(errors.length ? 1 : 0);
}

// Only run main() when invoked directly, so the test file can import the check.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  main();
