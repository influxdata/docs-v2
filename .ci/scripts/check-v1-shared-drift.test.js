import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  divergence,
  normalize,
  stripFrontMatter,
} from './check-v1-shared-drift.js';

test('stripFrontMatter removes a leading YAML block', () => {
  assert.equal(stripFrontMatter('---\ntitle: A\n---\nbody\n'), 'body\n');
});

test('stripFrontMatter leaves bodies without front matter alone', () => {
  assert.equal(stripFrontMatter('body only\n'), 'body only\n');
});

test('normalize collapses both v1 product roots to one token', () => {
  assert.equal(
    normalize('see [x](/influxdb/v1/concepts/glossary/)'),
    normalize('see [x](/enterprise_influxdb/v1/concepts/glossary/)')
  );
});

test('identical bodies have zero divergence', () => {
  assert.equal(divergence('a\nb\nc\n', 'a\nb\nc\n'), 0);
});

test('pages differing only by product root have zero divergence', () => {
  assert.equal(
    divergence(
      '---\nmenu:\n  influxdb_v1:\n---\nlink /influxdb/v1/a/\n',
      '---\nmenu:\n  enterprise_influxdb_v1:\n---\nlink /enterprise_influxdb/v1/a/\n'
    ),
    0
  );
});

test('front matter differences alone do not count as divergence', () => {
  assert.equal(
    divergence(
      '---\ntitle: A\n---\nsame\n',
      '---\ntitle: B\nweight: 2\n---\nsame\n'
    ),
    0
  );
});

test('a changed line counts as one removal plus one addition', () => {
  assert.equal(divergence('a\nb\n', 'a\nZ\n'), 2);
});

test('an added line counts as one', () => {
  assert.equal(divergence('a\n', 'a\nb\n'), 1);
});

test('divergence is symmetric', () => {
  const a = 'one\ntwo\nthree\n';
  const b = 'one\nTWO\nthree\nfour\n';
  assert.equal(divergence(a, b), divergence(b, a));
});

test('manifest is valid and its pairs still exist as two copies', () => {
  const m = JSON.parse(
    readFileSync('.ci/v1-shared-drift-manifest.json', 'utf8')
  );
  assert.ok(Array.isArray(m.pairs) && m.pairs.length > 0);
  for (const rel of m.pairs) {
    assert.ok(existsSync(`${m.oss_root}/${rel}`), `missing OSS copy: ${rel}`);
    assert.ok(
      existsSync(`${m.enterprise_root}/${rel}`),
      `missing Enterprise copy: ${rel}`
    );
  }
});

test('migrated pages are not listed in the manifest', () => {
  const m = JSON.parse(
    readFileSync('.ci/v1-shared-drift-manifest.json', 'utf8')
  );
  for (const rel of m.pairs) {
    assert.ok(
      !existsSync(`content/shared/influxdb-v1/${rel}`),
      `${rel} is already shared; remove it from the manifest`
    );
  }
});
