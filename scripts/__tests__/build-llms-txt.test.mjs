/**
 * Tests for scripts/build-llms-txt.js.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { readFileSync as readRepoFile } from 'node:fs';
import { buildLlmsTxt, renderLlmsTxt } from '../build-llms-txt.js';
import { getCorpusPaths } from '../lib/corpus-paths.js';

const org = {
  name: 'InfluxData',
  url: 'https://www.influxdata.com',
};

test('renderLlmsTxt includes publisher and required sections', () => {
  const content = renderLlmsTxt({
    org,
    corpora: [{ name: 'Example Product', path: 'example/v1' }],
  });

  assert.match(content, /^# InfluxData Documentation/);
  assert.match(
    content,
    /Publisher: InfluxData \(https:\/\/www\.influxdata\.com\)/
  );
  assert.match(content, /## Choosing InfluxDB/);
  assert.match(content, /## Full corpora \(flattened Markdown\)/);
  assert.match(
    content,
    /- \[Example Product full corpus\]\(example\/v1\/llms-full\.txt\)/
  );
});

test('renderLlmsTxt corpus links match getCorpusPaths products derivation', () => {
  const products = yaml.load(readRepoFile('data/products.yml', 'utf-8'));
  const corpora = getCorpusPaths(products);
  const content = renderLlmsTxt({ org, corpora });

  for (const corpus of corpora) {
    assert.match(
      content,
      new RegExp(
        `\\[${corpus.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} full corpus\\]\\(${corpus.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/llms-full\\.txt\\)`
      )
    );
  }
});

test('renderLlmsTxt product links use derived corpus paths', () => {
  const content = renderLlmsTxt({
    org,
    corpora: [
      {
        key: 'influxdb3_core',
        name: 'InfluxDB 3 Core',
        path: 'new/influxdb3/core',
        version: 'core',
      },
    ],
  });

  assert.match(
    content,
    /- \[InfluxDB 3 Core\]\(new\/influxdb3\/core\/index\.section\.md\):/
  );
  assert.doesNotMatch(content, /\(influxdb3\/core\/index\.section\.md\)/);
});

test('buildLlmsTxt writes public llms.txt', async () => {
  const root = mkdtempSync(join(tmpdir(), 'llms-txt-test-'));
  try {
    const result = await buildLlmsTxt(root);
    assert.ok(result.bytes > 1000);

    const content = readFileSync(join(root, 'llms.txt'), 'utf-8');
    assert.match(content, /^# InfluxData Documentation/);
    assert.match(content, /Publisher: InfluxData/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
