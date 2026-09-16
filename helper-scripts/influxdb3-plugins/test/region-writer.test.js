import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeGeneratedRegion, transformContent } from '../port_to_docs.js';

test('wraps content in markers when the target has none yet', () => {
  const result = mergeGeneratedRegion(null, 'Generated body text.');

  assert.equal(
    result.content,
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
      'Generated body text.\n' +
      '<!-- END GENERATED PLUGIN CONTENT -->\n'
  );
  assert.equal(result.error, undefined);
});

test('reports an error for an unterminated begin marker instead of writing', () => {
  const existing =
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
    'Old generated body, missing its end marker.\n' +
    '\n' +
    '## Schema requirements\n' +
    '\n' +
    'Hand-written text.\n';

  const result = mergeGeneratedRegion(existing, 'New generated body.');

  assert.equal(result.content, undefined);
  assert.match(result.error, /marker/i);
});

test('preserves hand-owned content after the generated region', () => {
  const existing =
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
    'Old generated body.\n' +
    '<!-- END GENERATED PLUGIN CONTENT -->\n' +
    '\n' +
    '## Schema requirements\n' +
    '\n' +
    'Hand-written text that must survive regeneration.\n';

  const result = mergeGeneratedRegion(existing, 'New generated body.');

  assert.equal(
    result.content,
    '<!-- BEGIN GENERATED PLUGIN CONTENT -->\n' +
      'New generated body.\n' +
      '<!-- END GENERATED PLUGIN CONTENT -->\n' +
      '\n' +
      '## Schema requirements\n' +
      '\n' +
      'Hand-written text that must survive regeneration.\n'
  );
  assert.equal(result.error, undefined);
});

test('exempts abbreviated JSON examples from code-block parsing', () => {
  const transformed = transformContent(
    '# Example\n\n```json\n{"items": [{"value": 1}, ...]}\n```',
    'example'
  );

  assert.match(transformed, /```json \{lint="false"\}/);
});

test('normalizes tabs used to indent Markdown list items', () => {
  const transformed = transformContent('# Example\n\n \t- Item', 'example');

  assert.match(transformed, /^- Item$/m);
  assert.doesNotMatch(transformed, /^\s*\t/m);
});

test('exempts generated upstream prose from Vale', () => {
  const transformed = transformContent('# Example', 'example');

  assert.match(transformed, /^<!-- vale off -->$/m);
  assert.match(transformed, /<!-- vale on -->$/);
});
