import assert from 'node:assert/strict';
import test from 'node:test';
import {
  earliestMostCommonDay,
  sampleAnchorDay,
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

const telegrafLogLine =
  '2023-05-31T20:09:08Z D! [agent] Starting service inputs';
const telegrafSampleData = [
  'home,room=Living\\ Room temp=21.1 1719924000',
  'home,room=Kitchen temp=21.0 1719924000',
  'home,room=Kitchen temp=22.7 1719967200',
];
const telegrafBlock = [telegrafLogLine, ...telegrafSampleData].join('\n');

function shiftTo(text, isoDate) {
  const selectedDay = BigInt(Date.parse(`${isoDate}T00:00:00Z`)) / 86400000n;
  return shiftTimestampText(
    text,
    selectedDay - earliestMostCommonDay(timestampDays(text))
  );
}

test('anchors on the sample data, not an earlier unrelated date', () => {
  const seconds = (iso) => String(Date.parse(iso) / 1000);
  const [shiftedLogLine, ...shiftedSampleData] = shiftTo(
    telegrafBlock,
    '2025-02-12'
  ).split('\n');
  assert.deepEqual(shiftedSampleData, [
    `home,room=Living\\ Room temp=21.1 ${seconds('2025-02-12T12:40:00Z')}`,
    `home,room=Kitchen temp=21.0 ${seconds('2025-02-12T12:40:00Z')}`,
    `home,room=Kitchen temp=22.7 ${seconds('2025-02-13T00:40:00Z')}`,
  ]);
  assert.equal(
    shiftedLogLine,
    '2024-01-11T20:09:08Z D! [agent] Starting service inputs'
  );
});

test('repeated selections land on the same dates as one selection', () => {
  assert.equal(
    shiftTo(shiftTo(telegrafBlock, '2025-02-12'), '2025-03-01'),
    shiftTo(telegrafBlock, '2025-03-01')
  );
});

test('shifts InfluxQL epoch literals with a unit suffix', () => {
  const shiftedSeconds = (iso) => Date.parse(iso) / 1000;
  assert.equal(
    shiftTimestampText(
      'WHERE time >= 1708976567s AND time <= 1708976567000ms + 8h',
      dayShift
    ),
    `WHERE time >= ${shiftedSeconds('2025-02-12T19:42:47Z')}s AND time <= ` +
      `${shiftedSeconds('2025-02-12T19:42:47Z') * 1000}ms + 8h`
  );
});

test('leaves unsigned fields and suffixed durations unchanged', () => {
  const text = 'tx_count=1721306050081621681u retention 1209600000000000ns';
  assert.deepEqual(timestampDays(text), []);
  assert.equal(shiftTimestampText(text, dayShift), text);
});

test('anchors on a configured sample day when the block contains it', () => {
  const configuredDay = timestampDays('2022-01-01')[0];
  const tiedDays = timestampDays('2021-12-31 2022-01-01');
  assert.equal(sampleAnchorDay(tiedDays, [configuredDay]), configuredDay);
});

test('falls back to the most common day without a configured day', () => {
  const configuredDay = timestampDays('2022-01-01')[0];
  const days = timestampDays('2024-02-26 2024-02-26 2024-02-27');
  assert.equal(
    sampleAnchorDay(days, [configuredDay]),
    earliestMostCommonDay(days)
  );
});
