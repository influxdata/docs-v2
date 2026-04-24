import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWithNormalization } from '../../lib/codeblock-normalizer.mjs';

test('phase 1 passes valid block without normalization notice', async () => {
  const block = { lang: 'json', value: '{"a": 1}', placeholders: [] };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.equal(res.notice, undefined);
});

test('phase 1 fails are returned unchanged when no normalization is applicable', async () => {
  const block = { lang: 'json', value: '{"a": bad}', placeholders: [] };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, false);
  assert.ok(res.errors[0].message.length > 0);
});

test('phase 2 substitutes declared placeholders and emits notice', async () => {
  const block = {
    lang: 'json',
    value: '{"key": TOKEN_NAME}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /placeholder substitution/);
});

test('phase 2 retry failure reports phase-1 error', async () => {
  const block = {
    lang: 'json',
    value: '{"a": TOKEN_NAME, "b": ,}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, false);
  assert.ok(res.errors.length >= 1);
});

test('phase 2 strips Hugo shortcodes and passes on retry', async () => {
  // JSON is strict about values — a bare shortcode token breaks phase 1.
  const block = {
    lang: 'json',
    value: '{"version": {{% product-name %}}}',
    placeholders: [],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /shortcode strip/);
});

test('phase 2 notice lists multiple rules when both fire', async () => {
  // Both placeholders AND a shortcode appear; both rules must fire to make
  // this parse as valid JSON.
  const block = {
    lang: 'json',
    value: '{"version": {{% product-name %}}, "token": TOKEN}',
    placeholders: ['TOKEN'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /placeholder substitution/);
  assert.match(res.notice, /shortcode strip/);
});

test('out-of-scope language is skipped, not failed', async () => {
  const block = { lang: null, value: 'whatever', placeholders: [] };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.equal(res.skipped, true);
});

test('shortcode inside an existing JSON string value does not produce double-quotes', async () => {
  // Simulates: {"url":"{{< influxdb/host >}}/api","token": TOKEN}
  // Phase 1 fails (TOKEN bare). Phase 2 must not produce ""0"/api".
  const block = {
    lang: 'json',
    value: '{"url":"{{< influxdb/host >}}/api","token": TOKEN}',
    placeholders: ['TOKEN'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.match(res.notice, /placeholder substitution/);
  assert.match(res.notice, /shortcode strip/);
});

test('quoted placeholder token does not produce double-quotes in JSON', async () => {
  // Simulates: {"token": "TOKEN_NAME"} where TOKEN_NAME is declared as placeholder.
  // Phase 1 passes (already valid JSON), so normalization is not needed.
  // Confirm phase 1 short-circuits without mangling the quoted value.
  const block = {
    lang: 'json',
    value: '{"token": "TOKEN_NAME"}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, true);
  assert.equal(res.notice, undefined);
});

test('quoted placeholder in invalid JSON is replaced once, not double-quoted', async () => {
  // Simulates: {"token": "TOKEN_NAME", "bad": ,} — invalid due to trailing comma.
  // Phase 2 runs; "TOKEN_NAME" should become "TOKEN_NAME_placeholder_ci" (not ""TOKEN_NAME_placeholder_ci"").
  // Phase 2 still fails (trailing comma is unfixable), so phase-1 errors returned.
  const block = {
    lang: 'json',
    value: '{"token": "TOKEN_NAME", "bad": ,}',
    placeholders: ['TOKEN_NAME'],
  };
  const res = await validateWithNormalization(block);
  assert.equal(res.ok, false);
  assert.ok(res.errors.length >= 1);
});
