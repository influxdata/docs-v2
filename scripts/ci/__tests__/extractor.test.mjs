import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { extractCodeBlocks } from '../../lib/codeblock-extractor.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name) => readFileSync(join(__dirname, 'fixtures/lint', name), 'utf8');

test('extracts fenced blocks with language and start line', () => {
  const blocks = extractCodeBlocks(fx('simple.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].lang, 'json');
  assert.equal(blocks[0].value, '{"a": 1}');
  assert.equal(blocks[0].startLine, 5);
  assert.equal(blocks[1].lang, 'bash');
  assert.equal(blocks[1].value, 'echo hi');
  assert.equal(blocks[1].startLine, 11);
});

test('normalizes language aliases to canonical keys', () => {
  const blocks = extractCodeBlocks(fx('aliases.md'));
  const langs = blocks.map((b) => b.lang);
  assert.deepEqual(langs, ['bash', 'python', 'yaml', null]);
});

test('flags unsupported langs as null (out of scope)', () => {
  const blocks = extractCodeBlocks(fx('aliases.md'));
  assert.equal(blocks[3].lang, null);
  assert.equal(blocks[3].rawLang, 'go');
});

test('parses placeholders attribute into array', () => {
  const blocks = extractCodeBlocks(fx('placeholders.md'));
  assert.deepEqual(blocks[0].placeholders, ['TOKEN_NAME', 'DURATION']);
  assert.deepEqual(blocks[1].placeholders, []);
});

test('strips HTML comments from block body', () => {
  const blocks = extractCodeBlocks(fx('html-comments.md'));
  assert.equal(blocks[0].value, 'echo hi');
});

test('joins continuation-marked fences into one logical unit', () => {
  const blocks = extractCodeBlocks(fx('continuation.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].value, 'x = 1\ny = x + 1');
  assert.equal(blocks[0].lang, 'python');
  assert.equal(blocks[0].startLine, 1);
  assert.deepEqual(blocks[0].partLines, [1, 7]);
  assert.equal(blocks[1].value, 'z = 3');
  assert.equal(blocks[1].startLine, 11);
});

test('skips fences that follow expected-output marker', () => {
  const blocks = extractCodeBlocks(fx('expected-output.md'));
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].value, 'print("hi")');
  assert.equal(blocks[1].value, '{"ok": true}');
});

test('finds fences inside blockquotes and lists (DFS walk)', () => {
  const blocks = extractCodeBlocks(fx('in-blockquote.md'));
  const langs = blocks.map((b) => b.lang);
  assert.ok(langs.includes('json'), `expected json among langs, got ${JSON.stringify(langs)}`);
  assert.ok(langs.includes('bash'), `expected bash among langs, got ${JSON.stringify(langs)}`);
  const json = blocks.find((b) => b.lang === 'json');
  assert.equal(json.value, '{"inside": "quote"}');
});
