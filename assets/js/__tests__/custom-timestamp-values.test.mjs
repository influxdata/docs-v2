import assert from 'node:assert/strict';
import test from 'node:test';
import {
  shiftTimestampText,
  timestampDays,
} from '../custom-timestamp-values.js';

const dayShift = BigInt(
  (Date.parse('2025-02-12T00:00:00Z') - Date.parse('2024-02-26T00:00:00Z')) /
    86400000
);
const newSeconds = BigInt(Date.parse('2025-02-12T19:42:47Z') / 1000);

for (const [precision, original, expected] of [
  ['seconds', '1708976567', String(newSeconds)],
  ['milliseconds', '1708976567123', String(newSeconds * 1000n + 123n)],
  ['microseconds', '1708976567123456', String(newSeconds * 1000000n + 123456n)],
  [
    'nanoseconds',
    '1708976567123456789',
    String(newSeconds * 1000000000n + 123456789n),
  ],
]) {
  test(`shifts ${precision} without losing time or fractions`, () => {
    assert.equal(
      shiftTimestampText(`cpu usage=50.0 ${original}`, dayShift),
      `cpu usage=50.0 ${expected}`
    );
  });
}

test('preserves relative dates and ISO timestamp suffixes', () => {
  const text = '2024-02-26T19:42:47.123Z until 2024-02-27T20:00:00+00:00';
  assert.equal(
    shiftTimestampText(text, dayShift),
    '2025-02-12T19:42:47.123Z until 2025-02-13T20:00:00+00:00'
  );
  assert.equal(timestampDays(text)[1] - timestampDays(text)[0], 1n);
});

test('leaves field values, identifiers, and invalid dates unchanged', () => {
  const text =
    'cpu usage=50.0 host=server1 id=abc1708976567 2024-02-31 ' +
    '0.0905729924662868 50.0000000000003 23.0672594816';
  assert.deepEqual(timestampDays(text), []);
  assert.equal(shiftTimestampText(text, dayShift), text);
});

test('recognizes the same calendar day across timestamp precisions', () => {
  const text =
    '2024-02-26T00:00:00Z 1708976567 1708976567000 1708976567000000 1708976567000000000';
  const days = timestampDays(text);
  assert.equal(days.length, 5);
  assert.ok(days.every((day) => day === days[0]));
});
