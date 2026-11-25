#!/usr/bin/env node
import { appendFileSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRules, lintProse } from '../lib/prose-lint.mjs';
import { resolveCanonicalSource } from '../lib/content-utils.js';

const REPO_ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const ANNOTATION_LEVEL = { warning: 'warning', info: 'notice' };

function escapeAnnotation(text) {
  return String(text)
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}

function escapeCell(text) {
  return String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function repoPath(file) {
  return relative(REPO_ROOT, resolve(file));
}

function canonicalFiles(files) {
  return [
    ...new Set(files.map((file) => repoPath(resolveCanonicalSource(file)))),
  ];
}

function printText(file, finding) {
  process.stdout.write(
    `${file}:${finding.line}:${finding.column}  ${finding.level}  ${finding.rule}  ${finding.message}\n`
  );
}

function printAnnotation(file, finding) {
  const level = ANNOTATION_LEVEL[finding.level];
  const message = finding.link
    ? `${finding.message} ${finding.link}`
    : finding.message;
  process.stdout.write(
    `::${level} file=${file},line=${finding.line},col=${finding.column},title=${finding.rule}::${escapeAnnotation(message)}\n`
  );
}

function writeStepSummary(rows, fileCount) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  const lines = [
    '## Prose lint',
    '',
    `Checked ${fileCount} files. Found ${rows.length} suggestions. Prose lint doesn't block merges.`,
    '',
  ];
  if (rows.length) {
    lines.push(
      '| File | Line | Level | Rule | Message |',
      '| --- | --- | --- | --- | --- |'
    );
    for (const { file, finding } of rows) {
      lines.push(
        `| ${file} | ${finding.line} | ${finding.level} | ${finding.rule} | ${escapeCell(finding.message)} |`
      );
    }
  }
  appendFileSync(summaryPath, `${lines.join('\n')}\n`);
}

function parseArgs(args) {
  const format =
    args.find((arg) => arg.startsWith('--format='))?.split('=')[1] ?? 'text';
  const files = args.filter((arg) => !arg.startsWith('--'));
  return { format, files };
}

function main(args) {
  const { format, files } = parseArgs(args);
  const print = format === 'github' ? printAnnotation : printText;
  const rules = loadRules();
  const checked = canonicalFiles(files);
  const rows = [];
  for (const file of checked) {
    let markdown;
    try {
      markdown = readFileSync(resolve(REPO_ROOT, file), 'utf8');
    } catch (error) {
      process.stderr.write(`lint-prose: skipped ${file}: ${error.message}\n`);
      continue;
    }
    for (const finding of lintProse(markdown, { path: file, rules })) {
      print(file, finding);
      rows.push({ file, finding });
    }
  }
  if (format === 'github') writeStepSummary(rows, checked.length);
}

main(process.argv.slice(2));
