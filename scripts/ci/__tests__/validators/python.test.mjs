import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/python.mjs';

test('accepts valid python', async () => {
  const { ok } = await validate('x = 1\ndef f(a, b):\n    return a + b\n');
  assert.equal(ok, true);
});

test('rejects python with indentation error', async () => {
  const { ok, errors } = await validate('def f():\nreturn 1\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
  assert.equal(typeof errors[0].line, 'number');
});

test('rejects python with unmatched paren', async () => {
  const { ok } = await validate('print(1\n');
  assert.equal(ok, false);
});
