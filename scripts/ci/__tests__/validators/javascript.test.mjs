import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/javascript.mjs';

test('accepts valid js', async () => {
  const { ok } = await validate('const x = 1;\nfunction f(a, b) { return a + b; }\n');
  assert.equal(ok, true);
});

test('rejects js with unterminated string', async () => {
  const { ok, errors } = await validate('const s = "oops\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
});

test('rejects js with invalid token', async () => {
  const { ok, errors } = await validate('const = 1;\n');
  assert.equal(ok, false);
  assert.equal(typeof errors[0].line, 'number');
});
