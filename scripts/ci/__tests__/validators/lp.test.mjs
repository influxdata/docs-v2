import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../../../lib/codeblock-validators/lp.mjs';

test('accepts standard and qualified line protocol fields', () => {
  const code = [
    '# a comment',
    'cpu,host=west usage=42.5,active=true 1700000000000000000',
    'weather temp=72i,humidity=45u,status="sunny",whole=1',
    'cpu cpu::user=12.5,cpu::system=2.5,mem::used=1.2,plain=3.4',
    'table a::b::c="value",escaped\\ key=1.0',
    '東京,tag=値 field="quoted, value"',
  ].join('\n');
  const result = validate(code);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('accepts signed integer and timestamp boundaries', () => {
  const result = validate([
    'm signed=-9223372036854775808i,unsigned=18446744073709551615u -9223372036854775808',
    'm signed=9223372036854775807i 9223372036854775807',
  ].join('\n'));
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('returns one diagnostic for each invalid source line', () => {
  const result = validate([
    'm ::field=1.0',
    'm family::=1.0',
    'm field=',
    'm field=NaN',
    'm field=9223372036854775808i',
    'm field=18446744073709551616u',
    'm field=1.0 9223372036854775808',
    'm,tag= field=1.0',
    'm field="unterminated',
    'm field=1.0 extra timestamp',
  ].join('\n'));
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 10);
  assert.deepEqual(result.errors.map((error) => error.line), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});
