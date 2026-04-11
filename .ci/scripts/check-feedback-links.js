#!/usr/bin/env node
/**
 * check-feedback-links.js
 *
 * Verify that the "Submit docs issue" and "Submit <product> issue"
 * buttons in the article feedback partial resolve to the correct URLs
 * for every product. Guards against the class of bug reported in
 * influxdata/docs-v2#7089, where a conditional override in the feedback
 * template sent the wrong button to the support site.
 *
 * Two layers:
 *
 *   1. Config / template sanity (no Hugo build required):
 *      a. data/products.yml — every product with a content_path has a
 *         product_issue_url field.
 *      b. layouts/partials/article/feedback.html — contains no hardcoded
 *         product issue URLs. The button href must be wired to
 *         $productData.product_issue_url, not a template conditional.
 *
 *   2. Rendered HTML grep (requires public/ from `npx hugo`):
 *      For each product, pick one rendered page under its content_path,
 *      extract the hrefs of the "Submit docs issue" and
 *      "Submit <product> issue" buttons, and verify they match the
 *      expected values. If public/ doesn't exist, this layer is skipped
 *      with a note.
 *
 * Usage:
 *   node .ci/scripts/check-feedback-links.js [public_dir]
 *
 * Arguments:
 *   public_dir   Hugo output directory to scan for Layer 2. Defaults to
 *                `public` relative to the repo root.
 *
 * Exit codes:
 *   0  All checks pass.
 *   1  At least one check failed. Every failure is printed as a GitHub
 *      Actions error annotation (::error::...).
 *
 * Run this after `npx hugo --quiet` in CI. Layer 1 runs regardless so
 * static regressions are caught even when the build step is skipped.
 */

import {
  readFileSync,
  readdirSync,
  existsSync,
  statSync,
} from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

const PRODUCTS_YAML = join(REPO_ROOT, 'data', 'products.yml');
const FEEDBACK_TEMPLATE = join(
  REPO_ROOT,
  'layouts',
  'partials',
  'article',
  'feedback.html'
);
const PUBLIC_DIR = process.argv[2]
  ? join(process.cwd(), process.argv[2])
  : join(REPO_ROOT, 'public');

const DOCS_ISSUE_URL_PREFIX =
  'https://github.com/influxdata/docs-v2/issues/new';

let failed = false;

function error(msg, file, line) {
  failed = true;
  const loc = file
    ? `file=${relative(REPO_ROOT, file)}${line ? `,line=${line}` : ''}`
    : '';
  console.error(`::error ${loc}::${msg}`);
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Layer 1a: products.yml schema check ---
console.log('::group::Layer 1a — products.yml schema');

const products = yaml.load(readFileSync(PRODUCTS_YAML, 'utf8'));
const productsToCheck = {};

for (const [key, p] of Object.entries(products)) {
  if (!p || typeof p !== 'object') continue;
  if (!p.content_path) continue;
  if (!p.product_issue_url) {
    error(
      `product '${key}' is missing 'product_issue_url' (required for all products with content_path)`,
      PRODUCTS_YAML
    );
    continue;
  }
  if (typeof p.product_issue_url !== 'string') {
    error(
      `product '${key}' has a non-string product_issue_url`,
      PRODUCTS_YAML
    );
    continue;
  }
  productsToCheck[key] = p;
}

const productCount = Object.keys(productsToCheck).length;
if (!failed) {
  console.log(
    `✅ ${productCount} product(s) with content_path declare product_issue_url`
  );
}
console.log('::endgroup::');

// --- Layer 1b: feedback.html must not contain hardcoded product URLs ---
console.log('::group::Layer 1b — feedback.html template purity');

const templateLines = readFileSync(FEEDBACK_TEMPLATE, 'utf8').split('\n');

// Forbidden literal substrings. Every pattern below is a fingerprint of
// the class of bug fixed in #7089: conditional or string-munged URL
// construction that bypasses data/products.yml.
const FORBIDDEN_LITERALS = [
  {
    pattern: '/issues/new/choose',
    reason:
      "fingerprint of the old $productNamespace URL builder. Product issue URLs must come from data/products.yml (product_issue_url field), not string concatenation in the template.",
  },
  {
    pattern: 'support.influxdata.com/s/',
    reason:
      "fingerprint of the #7089 Enterprise override. Use products.yml (product_issue_url) to point a product's issue button at the support site.",
  },
];

for (let i = 0; i < templateLines.length; i++) {
  const line = templateLines[i];
  for (const { pattern, reason } of FORBIDDEN_LITERALS) {
    if (line.includes(pattern)) {
      error(
        `feedback.html contains forbidden literal '${pattern}' — ${reason}`,
        FEEDBACK_TEMPLATE,
        i + 1
      );
    }
  }
}

if (!failed) {
  console.log('✅ feedback.html contains no hardcoded product issue URLs');
}
console.log('::endgroup::');

// --- Layer 2: rendered HTML check (optional) ---
if (!existsSync(PUBLIC_DIR)) {
  console.log(
    `\nℹ️  ${relative(REPO_ROOT, PUBLIC_DIR)} not found — skipping Layer 2 (rendered HTML grep).`
  );
  console.log('   Run `npx hugo --quiet` first to enable this layer.\n');
  process.exit(failed ? 1 : 0);
}

console.log('::group::Layer 2 — rendered HTML grep');

/**
 * Walk a directory and return the path of the first index.html file
 * whose body contains a feedback-section button. Used to pick a
 * representative rendered page for each product.
 */
function findFirstFeedbackPage(dir) {
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    // Check index.html in this directory first.
    const indexPath = join(d, 'index.html');
    if (existsSync(indexPath)) {
      try {
        const html = readFileSync(indexPath, 'utf8');
        if (html.includes('class="btn issue"')) return indexPath;
      } catch {
        /* ignore */
      }
    }
    // Push subdirectories for breadth-ish traversal.
    for (const entry of entries) {
      if (entry.isDirectory()) stack.push(join(d, entry.name));
    }
  }
  return null;
}

/**
 * Extract the href of a feedback button by its visible label.
 * Matches both `href="..." class="btn issue"` and
 * `class="btn issue" ... href="..."` attribute orders.
 */
function extractButtonHref(html, labelRegex) {
  const anchorRe = /<a\b([^>]*)>([^<]*)<\/a>/g;
  let m;
  while ((m = anchorRe.exec(html)) !== null) {
    const attrs = m[1];
    const text = m[2].trim();
    if (!labelRegex.test(text)) continue;
    if (!/class="btn issue"/.test(attrs)) continue;
    const hrefMatch = attrs.match(/href="([^"]+)"/);
    if (hrefMatch) return hrefMatch[1];
  }
  return null;
}

let checkedCount = 0;
let skippedCount = 0;

for (const [key, p] of Object.entries(productsToCheck)) {
  const contentPaths =
    typeof p.content_path === 'string'
      ? [p.content_path]
      : Object.values(p.content_path);

  let sample = null;
  for (const cp of contentPaths) {
    const productPublic = join(PUBLIC_DIR, cp);
    if (!existsSync(productPublic)) continue;
    sample = findFirstFeedbackPage(productPublic);
    if (sample) break;
  }

  if (!sample) {
    console.log(
      `⚠️  ${key}: no rendered page with feedback section found under content_path — skipped`
    );
    skippedCount++;
    continue;
  }

  const html = readFileSync(sample, 'utf8');
  const rel = relative(REPO_ROOT, sample);

  const docsHref = extractButtonHref(html, /^Submit docs issue$/);
  const productLabelRe = new RegExp(
    `^Submit ${escapeRegex(p.name)} issue$`
  );
  const productHref = extractButtonHref(html, productLabelRe);

  if (!docsHref) {
    error(`'Submit docs issue' button not found on sample page for '${key}'`, sample);
  } else if (!docsHref.startsWith(DOCS_ISSUE_URL_PREFIX)) {
    error(
      `'Submit docs issue' button points to '${docsHref}', expected prefix '${DOCS_ISSUE_URL_PREFIX}' (product: ${key})`,
      sample
    );
  }

  if (!productHref) {
    error(
      `'Submit ${p.name} issue' button not found on sample page for '${key}'`,
      sample
    );
  } else if (productHref !== p.product_issue_url) {
    error(
      `'Submit ${p.name} issue' button points to '${productHref}', expected '${p.product_issue_url}' from data/products.yml`,
      sample
    );
  }

  if (docsHref && productHref && productHref === p.product_issue_url) {
    console.log(`✅ ${key.padEnd(28)} ${rel}`);
    console.log(`     docs    → ${docsHref.slice(0, 80)}${docsHref.length > 80 ? '...' : ''}`);
    console.log(`     product → ${productHref}`);
  }
  checkedCount++;
}

console.log('::endgroup::');
console.log(
  `\nLayer 2 summary: ${checkedCount} product(s) checked, ${skippedCount} skipped.`
);

if (failed) {
  console.error(
    '\n❌ check-feedback-links: one or more checks failed. See annotations above.\n'
  );
  process.exit(1);
}

console.log('\n✅ check-feedback-links: all checks passed.\n');
process.exit(0);
