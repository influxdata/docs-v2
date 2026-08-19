#!/usr/bin/env node
/**
 * Corpus-wide parity scan: flags OBJECTIVE breakage in Rust-generated per-page
 * Markdown, and gross content loss vs the JS baseline. Not a byte-diff — it
 * surfaces a short outlier list to inspect by hand. Exit 1 if any page is
 * flagged so CI/the runner notices.
 *
 * Usage: node scripts/parity-scan.mjs [currentDir] [baselineDir]
 */
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

const curDir = process.argv[2] || 'public';
const baseDir = process.argv[3] || '.parity-baseline';

function splitFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : null;
}

const files = await glob(`${curDir}/**/index.md`, {
  ignore: ['**/node_modules/**'],
});
const flags = [];
for (const file of files) {
  const rel = path.relative(curDir, file);
  const md = await fs.readFile(file, 'utf-8');
  const parts = splitFrontmatter(md);
  if (!parts) {
    flags.push(`NO_FRONTMATTER  ${rel}`);
    continue;
  }
  const { fm, body } = parts;
  if (!/\btitle:/.test(fm) || !/\burl:/.test(fm)) {
    flags.push(`MISSING_FIELD   ${rel}`);
  }
  if (body.trim().length === 0) {
    flags.push(`EMPTY_BODY      ${rel}`);
  }
  // NOTE: unbalanced-fence and raw-HTML-at-line-start were tried and rejected
  // as noisy — docs legitimately contain literal ``` (grammar/spec pages) and
  // HTML examples in code blocks, producing false positives. CONTENT_LOSS below
  // is the high-signal, low-noise truncation/regression detector.
  // Gross content loss vs baseline body length.
  try {
    const base = await fs.readFile(path.join(baseDir, rel), 'utf-8');
    const baseParts = splitFrontmatter(base);
    if (baseParts) {
      const b = baseParts.body.trim().length;
      const c = body.trim().length;
      if (b > 200 && c < b * 0.5) {
        flags.push(`CONTENT_LOSS    ${rel} (rust ${c} vs js ${b} chars)`);
      }
    }
  } catch {
    /* page not in baseline (new) — skip ratio check */
  }
}

for (const f of flags) console.log(f);
console.log(`\n${flags.length} flag(s) across ${files.length} pages.`);
process.exit(flags.length === 0 ? 0 : 1);
