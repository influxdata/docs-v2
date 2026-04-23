#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { extractCodeBlocks } from '../lib/codeblock-extractor.mjs';
import * as jsonValidator from '../lib/codeblock-validators/json.mjs';
import * as yamlValidator from '../lib/codeblock-validators/yaml.mjs';

const BLOCKING_LANGS = new Set(['json', 'jsonl', 'yaml', 'toml']);
const VALIDATORS = {
  json: (b) => jsonValidator.validate(b.value),
  jsonl: (b) => jsonValidator.validate(b.value, { jsonl: true }),
  yaml: (b) => yamlValidator.validate(b.value),
};

function gh(severity, file, line, message) {
  process.stdout.write(`::${severity} file=${file},line=${line}::${message}\n`);
}

async function main(files) {
  let errorCount = 0;
  for (const file of files) {
    const md = readFileSync(file, 'utf8');
    const blocks = extractCodeBlocks(md);
    process.stdout.write(`::group::${file}\n`);
    for (const block of blocks) {
      const lang = block.lang;
      const validator = lang ? VALIDATORS[lang] : null;
      if (!validator) {
        process.stdout.write(
          `  - line ${block.startLine}  ${block.rawLang ?? '(no lang)'}  skipped (out of scope)\n`,
        );
        continue;
      }
      const { ok, errors } = await validator(block);
      if (ok) {
        process.stdout.write(`  ✓ line ${block.startLine}  ${lang}  passed\n`);
      } else {
        const severity = BLOCKING_LANGS.has(lang) ? 'error' : 'warning';
        for (const e of errors) {
          const absLine = block.startLine + (e.line ?? 1) - 1;
          process.stdout.write(`  ✗ line ${absLine}  ${lang}  failed: ${e.message}\n`);
          gh(severity, file, absLine, `${lang}: ${e.message}`);
          if (severity === 'error') errorCount++;
        }
      }
    }
    process.stdout.write(`::endgroup::\n`);
  }
  process.exit(errorCount > 0 ? 1 : 0);
}

main(process.argv.slice(2));
