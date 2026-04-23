#!/usr/bin/env node
import { readFileSync, appendFileSync } from 'node:fs';
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

function escapeCell(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function writeStepSummary({ canonicalCount, passed, passedWithNormalization, errorRows, warningRows, noticeRows }) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  const total = passed + passedWithNormalization + warningRows.length + errorRows.length;
  const lines = [];
  lines.push('## Code-block lint', '');
  lines.push(`**Checked:** ${total} blocks across ${canonicalCount} canonical sources`);
  lines.push(`**Passed:** ${passed + passedWithNormalization} (${passedWithNormalization} required normalization)`);
  lines.push(`**Warnings:** ${warningRows.length}`);
  lines.push(`**Errors:** ${errorRows.length}`);
  lines.push('');
  if (errorRows.length) {
    lines.push('### Errors', '', '| File | Line | Language | Message |', '| --- | --- | --- | --- |');
    for (const r of errorRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${escapeCell(r.message)} |`);
    lines.push('');
  }
  if (warningRows.length) {
    lines.push('### Warnings', '', '| File | Line | Language | Message |', '| --- | --- | --- | --- |');
    for (const r of warningRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${escapeCell(r.message)} |`);
    lines.push('');
  }
  if (noticeRows.length) {
    lines.push('### Normalization applied', '', '| File | Line | Language | Rules |', '| --- | --- | --- | --- |');
    for (const r of noticeRows) lines.push(`| ${r.file} | ${r.line} | ${r.lang} | ${escapeCell(r.rules)} |`);
    lines.push('');
  }
  appendFileSync(summaryPath, lines.join('\n') + '\n');
}

async function main(files) {
  const limit = pLimit(Math.max(1, cpus().length));

  // Dedupe: map each input to its canonical source; track consumer paths
  // passed on the CLI so we can attribute shared-source failures.
  const canonical = new Map();
  for (const input of files) {
    const c = resolveCanonicalSource(input);
    if (!canonical.has(c)) canonical.set(c, []);
    if (c !== input) canonical.get(c).push(input);
  }

  const errorRows = [];
  const warningRows = [];
  const noticeRows = [];
  let passed = 0;
  let passedWithNormalization = 0;

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
        if (res.notice) {
          passedWithNormalization++;
          noticeRows.push({ file, line: block.startLine, lang: block.lang, rules: res.notice });
          process.stdout.write(`  ✓ line ${block.startLine}  ${block.lang}  passed (${res.notice})\n`);
          gh('notice', file, block.startLine, res.notice);
        } else {
          passed++;
          process.stdout.write(`  ✓ line ${block.startLine}  ${block.lang}  passed\n`);
        }
      } else {
        const severity = BLOCKING_LANGS.has(block.lang) ? 'error' : 'warning';
        for (const e of res.errors) {
          const absLine = block.startLine + (e.line ?? 1) - 1;
          process.stdout.write(`  ✗ line ${absLine}  ${block.lang}  failed: ${e.message}\n`);
          const attribution = consumerAttribution(file, consumers);
          gh(severity, file, absLine, `${block.lang}: ${e.message}${attribution}`);
          const row = { file, line: absLine, lang: block.lang, message: e.message };
          if (severity === 'error') errorRows.push(row);
          else warningRows.push(row);
        }
      }
    }
    process.stdout.write(`::endgroup::\n`);
  }

  writeStepSummary({
    canonicalCount: canonical.size,
    passed,
    passedWithNormalization,
    errorRows,
    warningRows,
    noticeRows,
  });

  process.exit(errorRows.length > 0 ? 1 : 0);
}

main(process.argv.slice(2));
