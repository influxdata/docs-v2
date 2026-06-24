#!/usr/bin/env node
/**
 * Coherence guards for the autodiscovery surfaces.
 *
 * Two independent checks; both run on the post-build public/ directory.
 *
 * 1. Head-link → .md coherence:
 *    Every HTML page that emits <link rel="alternate" type="text/markdown">
 *    must have a corresponding .md file. The head-link partial and
 *    scripts/build-llm-markdown.js apply eligibility rules independently;
 *    drift means the head advertises a .md that doesn't exist.
 *
 * 2. /llms.txt "Full corpora" ↔ getCorpusPaths() coherence:
 *    The Hugo-rendered list in /llms.txt and the JS-derived PRODUCT_PATHS
 *    in scripts/build-llms-full-txt.js both derive from data/products.yml.
 *    Their outputs must match exactly. Drift means either the Hugo
 *    template logic or scripts/lib/corpus-paths.js has a bug.
 *    Also verifies each linked llms-full.txt file actually exists.
 *
 * Run after `npx hugo --quiet && yarn build:md && yarn build:llms-full`.
 * Exits 0 if every check passes, 1 otherwise.
 *
 * See PLAN.md § 6.2 / § 7.1 for rationale.
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getCorpusPaths } from './lib/corpus-paths.js';

/**
 * Resolve --public-dir <path> from argv, defaulting to ./public.
 * Matches the CLI convention used by scripts/build-llm-markdown.js.
 */
function parsePublicDir() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--public-dir' && args[i + 1]) {
      return path.resolve(process.cwd(), args[i + 1]);
    }
  }
  return path.resolve(process.cwd(), 'public');
}

const PUBLIC_ROOT = parsePublicDir();
const ALTERNATE_RE =
  /<link[^>]*rel=["']?alternate["']?[^>]*type=["']?text\/markdown["']?[^>]*href=["']?([^"'>\s]+)/i;

async function checkHeadLinkCoherence() {
  const htmlFiles = await glob(path.join(PUBLIC_ROOT, '**', 'index.html'), {
    nodir: true,
  });

  const missing = [];
  let checked = 0;

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf-8');
    const match = html.match(ALTERNATE_RE);
    if (!match) continue;

    checked++;
    const href = match[1];
    let mdPath;
    try {
      const url = new URL(href);
      mdPath = path.join(PUBLIC_ROOT, url.pathname);
    } catch {
      missing.push({ htmlFile, href, reason: 'unparseable href' });
      continue;
    }

    try {
      await fs.access(mdPath);
    } catch {
      missing.push({ htmlFile, href, reason: 'target .md missing' });
    }
  }

  return { checked, missing };
}

function checkCorporaCoherence() {
  const llmsTxt = path.join(PUBLIC_ROOT, 'llms.txt');
  if (!existsSync(llmsTxt)) {
    return null;
  }

  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const productsPath = path.resolve(scriptDir, '..', 'data', 'products.yml');
  const products = yaml.load(readFileSync(productsPath, 'utf-8'));
  const jsSet = new Set(getCorpusPaths(products).map((c) => c.path));

  const llmsTxtContent = readFileSync(llmsTxt, 'utf-8');
  const corporaSection = llmsTxtContent.split(/^## Full corpora/m)[1];
  if (!corporaSection) {
    return { jsSet, hugoSet: new Set(), missingFiles: [], error: 'No "## Full corpora" section in /llms.txt' };
  }

  const hugoSet = new Set();
  const missingFiles = [];
  const linkRe = /\(([^)]+\/llms-full\.txt)\)/g;
  let match;
  while ((match = linkRe.exec(corporaSection)) !== null) {
    const linkPath = match[1];
    const corpusPath = linkPath.replace(/\/llms-full\.txt$/, '');
    hugoSet.add(corpusPath);
    if (!existsSync(path.join(PUBLIC_ROOT, linkPath))) {
      missingFiles.push(linkPath);
    }
  }

  return { jsSet, hugoSet, missingFiles };
}

function reportHeadLink(result) {
  if (result.missing.length === 0) {
    console.log(`✓ Head-link coherence OK: ${result.checked} HTML pages, all .md targets exist`);
    return 0;
  }
  console.error(
    `✗ Head-link coherence FAILED: ${result.missing.length} of ${result.checked} pages reference a missing .md\n`
  );
  for (const m of result.missing.slice(0, 20)) {
    console.error(`  ${path.relative(PUBLIC_ROOT, m.htmlFile)}`);
    console.error(`    href:   ${m.href}`);
    console.error(`    reason: ${m.reason}\n`);
  }
  if (result.missing.length > 20) {
    console.error(`  ... and ${result.missing.length - 20} more`);
  }
  return 1;
}

function reportCorpora(result) {
  if (result === null) {
    console.log('ℹ /llms.txt not built; skipping corpora coherence check');
    return 0;
  }
  if (result.error) {
    console.error(`✗ Corpora coherence FAILED: ${result.error}`);
    return 1;
  }
  const onlyInJs = [...result.jsSet].filter((p) => !result.hugoSet.has(p));
  const onlyInHugo = [...result.hugoSet].filter((p) => !result.jsSet.has(p));
  if (onlyInJs.length === 0 && onlyInHugo.length === 0 && result.missingFiles.length === 0) {
    console.log(
      `✓ Corpora coherence OK: ${result.jsSet.size} corpora, all listed in /llms.txt and present on disk`
    );
    return 0;
  }
  if (onlyInJs.length > 0) {
    console.error(`✗ Corpora in getCorpusPaths() but missing from /llms.txt:`);
    for (const p of onlyInJs) console.error(`    ${p}`);
  }
  if (onlyInHugo.length > 0) {
    console.error(`✗ Corpora in /llms.txt but missing from getCorpusPaths():`);
    for (const p of onlyInHugo) console.error(`    ${p}`);
  }
  if (result.missingFiles.length > 0) {
    console.error(`✗ /llms.txt links to llms-full.txt files that don't exist:`);
    for (const p of result.missingFiles) console.error(`    ${p}`);
  }
  return 1;
}

async function main() {
  const headLink = await checkHeadLinkCoherence();
  const exit1 = reportHeadLink(headLink);
  const corpora = checkCorporaCoherence();
  const exit2 = reportCorpora(corpora);
  const exitCode = exit1 || exit2;
  if (exitCode !== 0) process.exit(exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
