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
