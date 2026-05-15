import { test } from 'node:test';
import assert from 'node:assert/strict';
import { injectAttr } from './migrate-code-placeholders.mjs';

test('injectAttr: bare language fence', () => {
  const r = injectAttr('```py', 'API_TOKEN');
  assert.equal(r.line, '```py { placeholders="API_TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: empty language fence', () => {
  const r = injectAttr('```', 'TOKEN');
  assert.equal(r.line, '``` { placeholders="TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: tilde fence preserves marker', () => {
  const r = injectAttr('~~~sh', 'X|Y');
  assert.equal(r.line, '~~~sh { placeholders="X|Y" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: preserves leading indentation', () => {
  const r = injectAttr('    ```js', 'TOK');
  assert.equal(r.line, '    ```js { placeholders="TOK" }');
});

test('injectAttr: merged path keeps space before brace when lang empty', () => {
  const r = injectAttr('``` { callout="--x" }', 'TOK');
  assert.equal(r.line, '``` { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: merged path unchanged for non-empty lang', () => {
  const r = injectAttr('```sh { callout="--x" }', 'TOK');
  assert.equal(r.line, '```sh { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});
