import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/bash.mjs';

test('accepts valid bash', async () => {
  const { ok, errors } = await validate('echo hello\nfor i in 1 2 3; do echo $i; done\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects unterminated for loop', async () => {
  const { ok, errors } = await validate('for i in 1 2 3; do echo $i\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
});

test('reports a line number within the snippet', async () => {
  const code = 'echo ok\nif true; then\n  echo missing_fi\n';
  const { ok, errors } = await validate(code);
  assert.equal(ok, false);
  assert.equal(typeof errors[0].line, 'number');
});
