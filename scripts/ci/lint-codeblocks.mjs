#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { cpus } from 'node:os';
import pLimit from 'p-limit';
import { extractCodeBlocks } from '../lib/codeblock-extractor.mjs';
import { validateWithNormalization } from '../lib/codeblock-normalizer.mjs';

const BLOCKING_LANGS = new Set(['json', 'jsonl', 'yaml', 'toml']);

function gh(severity, file, line, message) {
  process.stdout.write(`::${severity} file=${file},line=${line}::${message}\n`);
}

async function main(files) {
  const limit = pLimit(Math.max(1, cpus().length));
  let errorCount = 0;
  for (const file of files) {
    const md = readFileSync(file, 'utf8');
    const blocks = extractCodeBlocks(md);
    process.stdout.write(`::group::${file}\n`);
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
          gh(severity, file, absLine, `${block.lang}: ${e.message}`);
          if (severity === 'error') errorCount++;
        }
      }
    }
    process.stdout.write(`::endgroup::\n`);
  }
  process.exit(errorCount > 0 ? 1 : 0);
}

main(process.argv.slice(2));
