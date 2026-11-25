import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { load } from 'js-yaml';
import { timestampDays } from '../custom-timestamp-values.js';

const sampleData = load(readFileSync('data/sample_data.yml', 'utf8'));
const contentFiles = globSync('content/**/*.md');

const homeRowExamplesOutsideSampleData = new Set([
  'content/shared/influxdb3-write-guides/best-practices/optimize-writes.md',
  'content/influxdb3/cloud-dedicated/write-data/best-practices/optimize-writes.md',
  'content/influxdb3/cloud-serverless/write-data/best-practices/optimize-writes.md',
  'content/influxdb3/clustered/write-data/best-practices/optimize-writes.md',
]);
const capturedQueryOutput = new Set([
  'content/shared/sql-reference/explain.md',
]);

const shortcode = (slash) =>
  `\\{\\{[%<]\\s*${slash}influxdb/custom-timestamps(?:-span)?\\s*[%>]\\}\\}`;
const blockPattern = new RegExp(
  `${shortcode('')}([\\s\\S]*?)${shortcode('/')}`,
  'g'
);
const logLinePattern = /^\s*\d{4}-\d{2}-\d{2}T\S+Z [DIWE]! /;
const homeRowFields = String.raw`temp=([\d.]+),hum=([\d.]+),co=(\d+)i`;
const homeRoom = String.raw`(Living\\+ Room|Kitchen)`;
const epochDigits = String.raw`(\d{10}(?:\d{3}){0,3})\b`;
const homeRowPattern = new RegExp(
  `home,room=${homeRoom} ${homeRowFields} ${epochDigits}`,
  'g'
);
const quotedIsoTime = String.raw`(['"])(\d{4}-\d{2}-\d{2}(?:[T ][\d:.]+)?Z?)\2`;
const epochTime = String.raw`(\d{10}|\d{13}|\d{19})(?:s|ms|ns)?\b`;
const timeBoundPattern = new RegExp(
  String.raw`time\s*(>=|>|<=|<)\s*(?:${quotedIsoTime}|${epochTime})`,
  'g'
);

const intentionallyInvalidFence =
  /^([ \t]*)(`{3,})[^\n]*lint="false"[^\n]*\n[\s\S]*?^\1\2[ \t]*$/gm;

function checkedContent(file) {
  return readFileSync(file, 'utf8').replace(
    intentionallyInvalidFence,
    (block) => block.replace(/[^\n]/g, '')
  );
}

function epochSeconds(digits) {
  return Number(BigInt(digits) / 10n ** BigInt(digits.length - 10));
}

function isoSeconds(text) {
  const iso = text.replace(' ', 'T');
  const withTime = iso.includes('T') ? iso : `${iso}T00:00:00`;
  return Date.parse(withTime.endsWith('Z') ? withTime : `${withTime}Z`) / 1000;
}

function homeRow(room, seconds, temp, hum, co) {
  return [room.replace(/\\/g, ''), seconds, temp, hum, co]
    .map((value, index) => (index < 2 ? value : Number(value)))
    .join('|');
}

function lineProtocolSeconds(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => epochSeconds(line.slice(line.lastIndexOf(' ') + 1)));
}

function csvRecords(text) {
  const [header, ...rows] = text
    .split('\n')
    .filter((line) => line && !line.startsWith('#'));
  const columns = header.split(',');
  return rows.map((row) =>
    Object.fromEntries(row.split(',').map((value, i) => [columns[i], value]))
  );
}

function downloadSeconds(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.lp')) return lineProtocolSeconds(text);
  const records = file.endsWith('.csv') ? csvRecords(text) : JSON.parse(text);
  return records.map(({ time }) => epochSeconds(String(time)));
}

function homeDownloadRows(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.lp')) {
    return Array.from(text.matchAll(homeRowPattern), (match) =>
      homeRow(match[1], epochSeconds(match[5]), match[2], match[3], match[4])
    );
  }
  const records = file.endsWith('.csv') ? csvRecords(text) : JSON.parse(text);
  return records.map(({ room, time, temp, hum, co }) =>
    homeRow(room, epochSeconds(String(time)), temp, hum, co)
  );
}

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

function withoutLogLines(text) {
  return text
    .split('\n')
    .filter((line) => !logLinePattern.test(line))
    .join('\n');
}

function queryWindows(text, table) {
  const fromTable = new RegExp(`FROM\\s+"?${table}"?(?![\\w])`, 'gi');
  return Array.from(text.matchAll(fromTable), (match) => {
    const following = text.slice(match.index + match[0].length).slice(0, 500);
    const end = following.search(/```|\n\s*\n|;|FROM\s/i);
    const predicate = end === -1 ? following : following.slice(0, end);
    const window = { line: text.slice(0, match.index).split('\n').length };
    for (const bound of predicate.matchAll(timeBoundPattern)) {
      const seconds = bound[3] ? isoSeconds(bound[3]) : epochSeconds(bound[4]);
      const side = bound[1].startsWith('>') ? 'lower' : 'upper';
      window[side] ??= seconds;
    }
    return window;
  });
}

const datasets = Object.entries(sampleData).map(([name, dataset]) => ({
  name,
  ...dataset,
  startSeconds: isoSeconds(dataset.start),
  endSeconds: isoSeconds(dataset.end),
}));
const home = datasets.find(({ name }) => name === 'home');

test('download files span their configured time range', () => {
  const mismatches = datasets.flatMap(({ files = [], start, end, ...range }) =>
    files
      .map((file) => ({ file, seconds: downloadSeconds(file) }))
      .filter(
        ({ seconds }) =>
          Math.min(...seconds) !== range.startSeconds ||
          Math.max(...seconds) !== range.endSeconds
      )
      .map(({ file }) => `${file}: expected ${start} to ${end}`)
  );
  assert.deepEqual(mismatches, []);
});

test('home download files hold the same rows', () => {
  const [reference, ...others] = home.files.map((file) => ({
    file,
    rows: homeDownloadRows(file).sort(),
  }));
  others.forEach(({ file, rows }) =>
    assert.deepEqual(
      rows,
      reference.rows,
      `${file} differs from ${reference.file}`
    )
  );
});

test('home rows in content match the home sample data', () => {
  const sampleRows = new Set(homeDownloadRows(home.files[0]));
  const mismatches = contentFiles
    .filter((file) => !homeRowExamplesOutsideSampleData.has(file))
    .flatMap((file) =>
      Array.from(checkedContent(file).matchAll(homeRowPattern))
        .filter(
          ([, room, temp, hum, co, digits]) =>
            !sampleRows.has(homeRow(room, epochSeconds(digits), temp, hum, co))
        )
        .map(([row]) => `${file}: ${row}`)
    );
  assert.deepEqual(mismatches, []);
});

test('queries of sample tables overlap the sample time range', () => {
  const misses = datasets.flatMap(({ table, start, end, ...range }) =>
    contentFiles
      .filter((file) => !capturedQueryOutput.has(file))
      .flatMap((file) =>
        queryWindows(checkedContent(file), table)
          .filter(
            ({ lower, upper }) =>
              lower > range.endSeconds || upper < range.startSeconds
          )
          .map(({ line }) => `${file}:${line}: ${table} is ${start} to ${end}`)
      )
  );
  assert.deepEqual(misses, []);
});

test('home queries start on a sample interval', () => {
  const offInterval = contentFiles.flatMap((file) =>
    queryWindows(checkedContent(file), home.table)
      .filter(
        ({ lower }) =>
          lower !== undefined &&
          (lower - home.startSeconds) % home.interval_seconds !== 0
      )
      .map(({ line }) => `${file}:${line}`)
  );
  assert.deepEqual(offInterval, []);
});

test('each block has one most common day to anchor on', () => {
  const tied = customTimestampBlocks()
    .map(({ file, text }) => ({ file, counts: dayCounts(timestampDays(text)) }))
    .filter(({ counts }) => counts.length > 1 && counts[0][1] === counts[1][1])
    .map(({ file }) => file);
  assert.deepEqual(tied, []);
});

test('sample dates stay within a day of the block anchor', () => {
  const strays = customTimestampBlocks().flatMap(({ file, text }) => {
    const days = timestampDays(withoutLogLines(text));
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
