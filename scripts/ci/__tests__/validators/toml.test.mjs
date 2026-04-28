import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/toml.mjs';

test('accepts valid TOML', () => {
  const { ok, errors } = validate('[section]\nkey = "value"\nnum = 42\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects TOML with missing quote, returns line', () => {
  const { ok, errors } = validate('key = "unterminated\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.length > 0);
  assert.equal(typeof errors[0].line, 'number');
});
