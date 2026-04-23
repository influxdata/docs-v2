#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { cpus } from 'node:os';
import pLimit from 'p-limit';
import { extractCodeBlocks } from '../lib/codeblock-extractor.mjs';
import { validateWithNormalization } from '../lib/codeblock-normalizer.mjs';
import {
  resolveCanonicalSource,
  findPagesReferencingSharedContent,
} from '../lib/content-utils.js';

const BLOCKING_LANGS = new Set(['json', 'jsonl', 'yaml', 'toml']);

function gh(severity, file, line, message) {
  process.stdout.write(`::${severity} file=${file},line=${line}::${message}\n`);
}

function consumerAttribution(file, knownConsumers) {
  if (!file.startsWith('content/shared/')) return '';
  const refs = knownConsumers.length ? knownConsumers : findPagesReferencingSharedContent(file);
  if (!refs.length) return '';
  const shown = refs.slice(0, 3).map((p) => p.replace(/^content\//, ''));
  const suffix = refs.length > 3 ? `, and ${refs.length - 3} more` : '';
  return ` (referenced by ${refs.length} pages: ${shown.join(', ')}${suffix})`;
}

async function main(files) {
  const limit = pLimit(Math.max(1, cpus().length));
  let errorCount = 0;

  // Dedupe: map each input to its canonical source; track consumer paths
  // passed on the CLI so we can attribute shared-source failures.
  const canonical = new Map();
  for (const input of files) {
    const c = resolveCanonicalSource(input);
    if (!canonical.has(c)) canonical.set(c, []);
    if (c !== input) canonical.get(c).push(input);
  }

  for (const [file, consumers] of canonical) {
    process.stdout.write(`::group::${file}\n`);
    let md;
    try {
      md = readFileSync(file, 'utf8');
    } catch (err) {
      process.stdout.write(`  - canonical source not readable: ${err.message}\n`);
      process.stdout.write(`::endgroup::\n`);
      continue;
    }
    const blocks = extractCodeBlocks(md);
    for (const block of blocks) {
      const res = await limit(() => validateWithNormalization(block));
      if (res.skipped) {
        process.stdout.write(
          `  - line ${block.startLine}  ${block.rawLang ?? '(no lang)'}  skipped (out of scope)\n`,
        );
        continue;
      }
      if (res.ok) {
        const suffix = res.notice ? ` (${res.notice})` : '';
        process.stdout.write(`  ✓ line ${block.startLine}  ${block.lang}  passed${suffix}\n`);
        if (res.notice) gh('notice', file, block.startLine, res.notice);
      } else {
        const severity = BLOCKING_LANGS.has(block.lang) ? 'error' : 'warning';
        for (const e of res.errors) {
          const absLine = block.startLine + (e.line ?? 1) - 1;
          process.stdout.write(`  ✗ line ${absLine}  ${block.lang}  failed: ${e.message}\n`);
          const attribution = consumerAttribution(file, consumers);
          gh(severity, file, absLine, `${block.lang}: ${e.message}${attribution}`);
          if (severity === 'error') errorCount++;
        }
      }
    }
    process.stdout.write(`::endgroup::\n`);
  }
  process.exit(errorCount > 0 ? 1 : 0);
}

main(process.argv.slice(2));
