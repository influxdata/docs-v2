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

test('strips HTML comments from block body, preserving line count', () => {
  const blocks = extractCodeBlocks(fx('html-comments.md'));
  // Comment is on its own line; replaced with '' (0 newlines in comment).
  // The newline after the comment is preserved, so value starts with '\n'.
  assert.equal(blocks[0].value, '\necho hi');
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

test('does not pick up fenced blocks inside YAML frontmatter', () => {
  // A description: | scalar with a ```json fence inside must not be linted.
  // Only the real code block in the page body should be extracted.
  const blocks = extractCodeBlocks(fx('frontmatter-code.md'));
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].lang, 'json');
  assert.equal(blocks[0].value, '{"ok": true}');
});

test('preserves inline HTML comments (only whole-line comments are stripped)', () => {
  // Whole-line `<!--pytest.mark.skip-->` should be stripped; inline
  // `<!-- ... -->` embedded in source must be preserved verbatim so that
  // HTML/Markdown examples render the comment as literal content.
  const md = '```html\n<div><!-- inline note --></div>\n```\n';
  const [block] = extractCodeBlocks(md);
  assert.equal(block.value, '<div><!-- inline note --></div>');
});

test('HTML comment strip is line-preserving: code after a comment maps to the right MD line', () => {
  // Block content: line 1 = comment, line 2 = real code.
  // Without line-preserving strip, line 2 would map to MD line = openFence+1
  // instead of openFence+2, producing a wrong annotation.
  const md = '```bash\n<!--pytest.mark.skip-->\necho hi\n```\n';
  const [block] = extractCodeBlocks(md);
  // After line-preserving strip the comment becomes '\n', so block.value
  // is '\necho hi'. Code line 2 (echo hi) must map to MD line 3.
  assert.equal(block.startLine, 1);       // opening fence
  assert.equal(mapCodeLineToFileLine(block, 2), 3); // echo hi is on MD line 3
});

test('expected-output skip does not fire when fence is too far from the marker', () => {
  // Marker is separated from the unlabeled fence by many prose lines.
  // The fence must NOT be skipped — it is not the expected output block.
  const blocks = extractCodeBlocks(fx('expected-output-distant.md'));
  assert.equal(blocks.length, 1);
  assert.equal(blocks[0].rawLang, null); // unlabeled fence was kept
});

test('expected-output skip does not swallow a subsequent labeled fence', () => {
  // After an expected-output marker, only the immediately following unlabeled
  // fence should be skipped. A labeled fence later must still be included.
  const md = fx('expected-output-then-labeled.md');
  const blocks = extractCodeBlocks(md);
  assert.equal(blocks.length, 2);
  assert.equal(blocks[0].lang, 'python');
  assert.equal(blocks[1].lang, 'json');  // must not be skipped
  assert.equal(blocks[1].value, '{"ok": true}');
});

import { mapCodeLineToFileLine } from '../../lib/codeblock-extractor.mjs';

test('mapCodeLineToFileLine: code line 1 maps to startLine + 1 (not startLine)', () => {
  const md = '# x\n\n```python\nx = 1\ny = 2\n```\n';
  const [block] = extractCodeBlocks(md);
  // Opening fence is at MD line 3 per remark; first content line is MD line 4.
  assert.equal(block.startLine, 3);
  assert.equal(mapCodeLineToFileLine(block, 1), 4);
  assert.equal(mapCodeLineToFileLine(block, 2), 5);
});

test('mapCodeLineToFileLine: handles continuation-joined parts at non-contiguous lines', () => {
  // Part 1 opens at MD 1, 2 content lines.
  // Part 2 opens at MD 7 (after the cont marker and blank lines), 2 content lines.
  const md = [
    '```python',   // MD 1  (opens part 1)
    'a = 1',       // MD 2
    'b = 2',       // MD 3
    '```',         // MD 4
    '',            // MD 5
    '<!--pytest-codeblocks:cont-->', // MD 6
    '',            // MD 7
    '```python',   // MD 8  (opens part 2)
    'c = 3',       // MD 9
    'd = 4',       // MD 10
    '```',         // MD 11
    '',
  ].join('\n');
  const [block] = extractCodeBlocks(md);
  assert.equal(block.partLines.length, 2);
  // Joined value is "a = 1\nb = 2\nc = 3\nd = 4" — 4 content lines.
  assert.equal(block.value, 'a = 1\nb = 2\nc = 3\nd = 4');
  // Code lines 1-2 belong to part 1 (MD 2-3).
  assert.equal(mapCodeLineToFileLine(block, 1), block.partLines[0] + 1);
  assert.equal(mapCodeLineToFileLine(block, 2), block.partLines[0] + 2);
  // Code lines 3-4 belong to part 2 — NOT partLines[0] + 3/4 (which would
  // land on the closing fence / cont marker, not the content).
  assert.equal(mapCodeLineToFileLine(block, 3), block.partLines[1] + 1);
  assert.equal(mapCodeLineToFileLine(block, 4), block.partLines[1] + 2);
});
