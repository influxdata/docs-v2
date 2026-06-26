/**
 * Tests for scripts/build-llm-markdown.js (provenance stamping).
 * Run with: node --test scripts/__tests__/build-llm-markdown.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combineMarkdown } from '../build-llm-markdown.js';

const PARENT = '---\ntitle: Get started\ndescription: Intro\nurl: http://localhost:1313/influxdb3/core/get-started/\nproduct: InfluxDB 3 Core\nestimated_tokens: 10\n---\n\nParent body.\n';
const CHILD = '---\ntitle: Setup\nurl: http://localhost:1313/influxdb3/core/get-started/setup/\nestimated_tokens: 5\n---\n\n# Setup\n\nChild body.\n';

test('combineMarkdown stamps publisher and canonical on section frontmatter', () => {
  const out = combineMarkdown(
    PARENT,
    [{ markdown: CHILD, url: '/influxdb3/core/get-started/setup/', title: 'Setup' }],
    '/influxdb3/core/get-started/',
    { publisher: 'InfluxData', origin: 'https://docs.influxdata.com' }
  );
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.match(fm, /publisher: InfluxData/);
  assert.match(fm, /canonical: https:\/\/docs\.influxdata\.com\/influxdb3\/core\/get-started\//);
  assert.match(fm, /type: section/);
});

test('combineMarkdown omits provenance when none supplied', () => {
  const out = combineMarkdown(
    PARENT,
    [{ markdown: CHILD, url: '/x/setup/', title: 'Setup' }],
    '/x/'
  );
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.doesNotMatch(fm, /publisher:/);
  assert.doesNotMatch(fm, /canonical:/);
});
