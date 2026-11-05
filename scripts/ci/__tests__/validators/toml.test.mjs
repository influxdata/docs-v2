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

test('accepts TOML 1.0 mixed-type filter arrays', () => {
  assert.deepEqual(validate('filters = [["temp", ">=", 185]]'), {
    ok: true,
    errors: [],
  });
});

test('reports one-based locations for malformed TOML after a valid line', () => {
  const result = validate('valid = 1\nbroken = @\n');
  assert.equal(result.ok, false);
  assert.equal(result.errors[0].line, 2);
  assert.equal(result.errors[0].column, 10);
});

test('continues accepting signed 64-bit TOML integers', () => {
  assert.deepEqual(
    validate('values = [-9223372036854775808, 9223372036854775807]'),
    {
      ok: true,
      errors: [],
    }
  );
});
