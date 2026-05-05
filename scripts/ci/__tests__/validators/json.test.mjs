import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/json.mjs';

test('accepts valid JSON', () => {
  const { ok, errors } = validate('{"a": 1}');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects JSON with trailing comma', () => {
  const { ok, errors } = validate('{\n  "a": 1,\n}');
  assert.equal(ok, false);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].message.length > 0);
  assert.equal(typeof errors[0].line, 'number');
});

test('jsonl mode validates each line', () => {
  const { ok, errors } = validate('{"a":1}\n{"b": bad}\n{"c":3}', { jsonl: true });
  assert.equal(ok, false);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].line, 2);
});
