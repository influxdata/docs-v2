import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/yaml.mjs';

test('accepts valid YAML', () => {
  const { ok, errors } = validate('a: 1\nb: two\n');
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test('rejects YAML with bad indentation, returns line', () => {
  const { ok, errors } = validate('a:\n  - x\n b: bad\n');
  assert.equal(ok, false);
  assert.ok(errors.length >= 1);
  assert.ok(typeof errors[0].line === 'number');
});

test('rejects duplicate keys (strict mode)', () => {
  const { ok, errors } = validate('a: 1\na: 2\n');
  assert.equal(ok, false);
  assert.ok(errors[0].message.toLowerCase().includes('duplicat'));
});
