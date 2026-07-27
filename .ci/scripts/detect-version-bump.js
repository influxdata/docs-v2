#!/usr/bin/env node
/**
 * detect-version-bump.js
 *
 * Compare the parsed `latest_patch` / `latest_patches.<version>` values in two
 * data/products.yml files and report which ones changed. Used by the
 * release-readiness reminder to fire ONLY on a real version bump — not on
 * unrelated `v1:`/`v2:` keys that also appear under `oss_repo.branch`,
 * `content_path`, `label_group`, or `latest_cli`.
 *
 * Usage: node detect-version-bump.js <old-products.yml> <new-products.yml>
 * Output:
 *   BUMPED=true|false
 *   - <product> <field>: <old> → <new>     (one line per changed value)
 *
 * Always exits 0 — this feeds a non-blocking reminder.
 */
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';

function load(path) {
  try {
    return yaml.load(readFileSync(path, 'utf8')) || {};
  } catch {
    return {};
  }
}

/** Flatten to { 'product latest_patch': value, 'product latest_patches.v1': value }. */
function patchValues(products) {
  const out = {};
  if (!products || typeof products !== 'object') return out;
  for (const [key, p] of Object.entries(products)) {
    if (!p || typeof p !== 'object') continue;
    if (p.latest_patch != null)
      out[`${key} latest_patch`] = String(p.latest_patch);
    if (p.latest_patches && typeof p.latest_patches === 'object') {
      for (const [v, val] of Object.entries(p.latest_patches)) {
        if (val != null) out[`${key} latest_patches.${v}`] = String(val);
      }
    }
  }
  return out;
}

const [oldPath, newPath] = process.argv.slice(2);
const oldVals = patchValues(load(oldPath));
const newVals = patchValues(load(newPath));

const changes = [];
for (const [k, v] of Object.entries(newVals)) {
  if (oldVals[k] !== v) {
    changes.push(`- ${k}: ${oldVals[k] ?? '(none)'} → ${v}`);
  }
}

console.log(`BUMPED=${changes.length ? 'true' : 'false'}`);
for (const line of changes) console.log(line);
