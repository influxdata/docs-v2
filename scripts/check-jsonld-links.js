#!/usr/bin/env node
/**
 * Verify that JSON-LD @id references in built HTML resolve to JSON-LD nodes.
 *
 * References resolve against the node set of the whole site, not of the page
 * that makes them. That is deliberate, and matches how the templates emit
 * these graphs:
 *
 *   - layouts/partials/header/softwareapplication-jsonld.html emits a
 *     product's SoftwareApplication node once, on the product landing page.
 *   - layouts/partials/header/techarticle-jsonld.html points every article's
 *     `about` and `isPartOf` at that node with a bare @id. Inside its
 *     `with partial "product/landing.html"` block, `.Permalink` is the landing
 *     page, so the reference is cross-page by construction. Re-declaring the
 *     entity inline instead would parse as a second, incomplete
 *     SoftwareApplication and fail validation.
 *
 * Scoping resolution per page would therefore fail on every article in the
 * site. What this check does catch is the failure that matters here: a landing
 * page that stops emitting its node while articles still reference it turns
 * every one of those references dangling.
 *
 * Consumers that parse a single document (Google, most RAG extractors) will
 * not resolve an off-page node. That is a known trade the templates made for
 * validity, not something for this checker to relitigate.
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

export function parsePublicDir(args = process.argv.slice(2)) {
  const index = args.indexOf('--public-dir');
  return path.resolve(index === -1 ? 'public' : args[index + 1]);
}

export function jsonLdBlocks(html) {
  const blocks = [];
  const script =
    /<script\b[^>]*\btype\s*=\s*(?:["']application\/ld\+json["']|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = script.exec(html)) !== null) blocks.push(match[1]);
  return blocks;
}

function collectIds(value, definitions, references) {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, definitions, references);
    return;
  }
  if (!value || typeof value !== 'object') return;

  if (typeof value['@id'] === 'string') {
    if (Object.keys(value).length === 1) references.add(value['@id']);
    else definitions.add(value['@id']);
  }
  for (const item of Object.values(value))
    collectIds(item, definitions, references);
}

export async function checkJsonLdLinks(publicDir) {
  const htmlFiles = await glob(path.join(publicDir, '**', 'index.html'), {
    nodir: true,
  });
  const definitions = new Set();
  const references = new Set();
  const invalidJson = [];

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf8');
    for (const block of jsonLdBlocks(html)) {
      try {
        collectIds(JSON.parse(block), definitions, references);
      } catch (error) {
        invalidJson.push(
          `${path.relative(publicDir, htmlFile)}: ${error.message}`
        );
      }
    }
  }

  return {
    htmlFiles: htmlFiles.length,
    definitions,
    invalidJson,
    missing: [...references].filter((reference) => !definitions.has(reference)),
  };
}

export async function main() {
  const publicDir = parsePublicDir();
  const result = await checkJsonLdLinks(publicDir);
  if (result.invalidJson.length > 0) {
    console.error('Invalid JSON-LD blocks:');
    for (const invalid of result.invalidJson) console.error(`  ${invalid}`);
  }
  if (result.missing.length > 0) {
    console.error('Dangling JSON-LD @id references:');
    for (const missing of result.missing) console.error(`  ${missing}`);
  }
  if (result.invalidJson.length > 0 || result.missing.length > 0)
    process.exit(1);
  console.log(
    `✓ JSON-LD entity links OK: ${result.definitions.size} nodes across ${result.htmlFiles} HTML pages`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
