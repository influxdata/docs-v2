import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { timestampDays } from '../custom-timestamp-values.js';

const shortcode = (slash) =>
  `\\{\\{[%<]\\s*${slash}influxdb/custom-timestamps(?:-span)?\\s*[%>]\\}\\}`;
const blockPattern = new RegExp(
  `${shortcode('')}([\\s\\S]*?)${shortcode('/')}`,
  'g'
);
const logLinePattern = /^\s*\d{4}-\d{2}-\d{2}T\S+Z [DIWE]! /;
const homeSamplePattern = /home,room=\S+ \S+ (\d{10})\b/g;

const contentFiles = globSync('content/**/*.md');

function customTimestampBlocks() {
  return contentFiles.flatMap((file) =>
    Array.from(readFileSync(file, 'utf8').matchAll(blockPattern), (match) => ({
      file,
      text: match[1],
    }))
  );
}

function dayCounts(days) {
  const counts = new Map();
  days.forEach((day) => counts.set(day, (counts.get(day) || 0) + 1));
  return Array.from(counts).sort(([, countA], [, countB]) => countB - countA);
}

function sampleText(text) {
  return text
    .split('\n')
    .filter((line) => !logLinePattern.test(line))
    .join('\n');
}

test('each block has one most common day to anchor on', () => {
  const tied = customTimestampBlocks()
    .map(({ file, text }) => ({ file, counts: dayCounts(timestampDays(text)) }))
    .filter(({ counts }) => counts.length > 1 && counts[0][1] === counts[1][1])
    .map(({ file }) => file);
  assert.deepEqual(tied, []);
});

test('sample dates stay within a day of the block anchor', () => {
  const strays = customTimestampBlocks().flatMap(({ file, text }) => {
    const days = timestampDays(sampleText(text));
    if (!days.length) return [];
    const anchor = dayCounts(days)[0][0];
    return days
      .filter((day) => day < anchor - 1n || day > anchor + 1n)
      .map(
        (day) => `${file}: ${new Date(Number(day) * 86400000).toISOString()}`
      );
  });
  assert.deepEqual(strays, []);
});

test('get-started write examples use the home sample timestamps', () => {
  const mismatches = globSync('content/**/get-started/write.md').flatMap(
    (file) => {
      const blocks = Array.from(
        readFileSync(file, 'utf8').matchAll(blockPattern),
        (match) =>
          Array.from(match[1].matchAll(homeSamplePattern), ([, seconds]) =>
            Number(seconds)
          )
      ).filter((seconds) => seconds.length);
      if (!blocks.length) return [];
      const [reference] = blocks[0];
      return blocks
        .filter(([first]) => first !== reference)
        .map(([first]) => `${file}: starts at ${first}`);
    }
  );
  assert.deepEqual(mismatches, []);
});

test('InfluxQL queries of home sample data start on a sample hour', () => {
  const homeEpochQueryStart = /FROM home\s+WHERE time >= (\d{10})s/g;
  const offHour = contentFiles.flatMap((file) =>
    Array.from(readFileSync(file, 'utf8').matchAll(homeEpochQueryStart))
      .filter(([, seconds]) => Number(seconds) % 3600 !== 0)
      .map(([, seconds]) => `${file}: ${seconds}`)
  );
  assert.deepEqual(offHour, []);
});
