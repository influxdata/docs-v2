#!/usr/bin/env node
/**
 * Coherence guard: every HTML page that emits <link rel="alternate"
 * type="text/markdown"> must have a corresponding .md file on disk.
 *
 * The head-link partial (layouts/partials/header/markdown-alternate.html)
 * and scripts/build-llm-markdown.js apply eligibility rules independently.
 * If they drift, the head emits an alternate link to a .md that doesn't
 * exist — a silent 404 from the agent's perspective.
 *
 * Run after `npx hugo --quiet && yarn build:md`. Exits 0 if every
 * advertised .md exists, 1 otherwise.
 *
 * See PLAN.md § 6.2 / § 7.1 for rationale.
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

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

async function main() {
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

  if (missing.length === 0) {
    console.log(`✓ Coherence OK: ${checked} HTML pages, all .md targets exist`);
    return;
  }

  console.error(
    `✗ Coherence FAILED: ${missing.length} of ${checked} pages reference a missing .md\n`
  );
  for (const m of missing.slice(0, 20)) {
    console.error(`  ${path.relative(PUBLIC_ROOT, m.htmlFile)}`);
    console.error(`    href:   ${m.href}`);
    console.error(`    reason: ${m.reason}\n`);
  }
  if (missing.length > 20) {
    console.error(`  ... and ${missing.length - 20} more`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
