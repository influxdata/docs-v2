#!/usr/bin/env node
import { readFileSync, appendFileSync } from 'node:fs';
import { cpus } from 'node:os';
import pLimit from 'p-limit';
import { extractCodeBlocks, mapCodeLineToFileLine } from '../lib/codeblock-extractor.mjs';
import { validateWithNormalization } from '../lib/codeblock-normalizer.mjs';
import {
  resolveCanonicalSource,
  findPagesReferencingSharedContent,
} from '../lib/content-utils.js';

const BLOCKING_LANGS = new Set(['json', 'jsonl', 'yaml', 'toml']);

function escapeGitHubCommandMessage(message) {
  return String(message)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}

function gh(severity, file, line, message) {
  process.stdout.write(`::${severity} file=${file},line=${line}::${escapeGitHubCommandMessage(message)}\n`);
}

function buildAttribution(file, knownConsumers) {
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

function writeStepSummary({
  canonicalCount,
  lintedBlockCount,
  passed,
  passedWithNormalization,
  errorRows,
  warningRows,
  noticeRows,
}) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  const total =
    lintedBlockCount ?? (passed + passedWithNormalization + warningRows.length + errorRows.length);
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
  // Consumer pages with `source:` frontmatter are stubs with no body fences,
  // so linting only the shared canonical is sufficient. If that invariant
  // drifts, see resolveCanonicalSource() in scripts/lib/content-utils.js.
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
  let lintedBlockCount = 0;

  for (const [file, consumers] of canonical) {
    process.stdout.write(`::group::${file}\n`);
    let md;
    try {
      md = readFileSync(file, 'utf8');
    } catch (err) {
      process.stdout.write(`  - canonical source not readable: ${err.message}\n`);
      gh('warning', file, 1, `canonical source not readable: ${err.message}`);
      process.stdout.write(`::endgroup::\n`);
      continue;
    }
    // Compute once per file — shared-file grep can be expensive.
    const attribution = buildAttribution(file, consumers);
    const blocks = extractCodeBlocks(md);
    // Run validators concurrently under p-limit, then report results in
    // document order. Awaiting each call inside the loop serialized the
    // subprocess validators (bash/python/js), which this fixes.
    const results = await Promise.all(
      blocks.map((block) => limit(() => validateWithNormalization(block))),
    );
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const res = results[i];
      lintedBlockCount++;
      if (res.skipped) {
        lintedBlockCount--; // skipped blocks aren't "linted"
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
          const absLine = mapCodeLineToFileLine(block, e.line ?? 1);
          process.stdout.write(`  ✗ line ${absLine}  ${block.lang}  failed: ${e.message}\n`);
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
    lintedBlockCount,
    passed,
    passedWithNormalization,
    errorRows,
    warningRows,
    noticeRows,
  });

  process.exit(errorRows.length > 0 ? 1 : 0);
}

main(process.argv.slice(2)).catch((err) => { console.error(err); process.exit(1); });
