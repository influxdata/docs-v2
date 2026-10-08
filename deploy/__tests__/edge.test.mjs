/**
 * Tests for deploy/edge.js, the Lambda@Edge origin-request rewriter.
 *
 * edge.js is deployed by pasting its contents directly into the AWS Lambda
 * console (see deploy/docs-website.yml), so it intentionally uses CommonJS
 * (require/exports) even though this repo's package.json sets
 * "type": "module". createRequire forces CommonJS interpretation of the
 * target file regardless of that setting.
 *
 * Run with: node --test deploy/__tests__/edge.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const edge = require('../edge.js');

function makeEvent(uri, hostValue) {
  const headers = {};
  if (hostValue) {
    headers.host = [{ key: 'Host', value: hostValue }];
  }
  return { Records: [{ cf: { request: { uri, headers } } }] };
}

function run(uri, hostValue) {
  return new Promise((resolve) => {
    edge.handler(makeEvent(uri, hostValue), {}, (err, result) => {
      resolve(result);
    });
  });
}

test('preview path without trailing slash redirects relatively (no host)', async () => {
  const result = await run(
    '/pr-preview/pr-123/influxdb3/core',
    'test2.docs.influxdata.com'
  );
  assert.equal(result.status, '301');
  assert.equal(
    result.headers.location[0].value,
    '/pr-preview/pr-123/influxdb3/core/'
  );
});

test('preview v1.x path is NOT hijacked by the archive redirect', async () => {
  const result = await run(
    '/pr-preview/pr-123/influxdb/v1.8/',
    'test2.docs.influxdata.com'
  );
  assert.equal(result.status, undefined, 'should not be a redirect');
  assert.equal(result.uri, '/pr-preview/pr-123/influxdb/v1.8/index.html');
});

test('preview asset with a valid extension passes through unchanged', async () => {
  const result = await run(
    '/pr-preview/pr-123/style.css',
    'test2.docs.influxdata.com'
  );
  assert.equal(result.status, undefined);
  assert.equal(result.uri, '/pr-preview/pr-123/style.css');
});

test('non-preview v1.x path still redirects toward the archive/version flow', async () => {
  const result = await run('/influxdb/v1.0/', 'docs.influxdata.com');
  assert.equal(result.status, '301');
  // The version-restructure rule normalizes v1.0 -> v1 before the
  // archive-domain check; this asserts against regressions in that chain,
  // not this change (unrelated to the preview bypass).
  assert.equal(result.headers.location[0].value, '/influxdb/v1/');
});

test('non-preview redirect uses the requesting docs host, not a hardcoded one', async () => {
  const result = await run('/influxdb3/core', 'test2.docs.influxdata.com');
  assert.equal(result.status, '301');
  assert.equal(
    result.headers.location[0].value,
    'https://test2.docs.influxdata.com/influxdb3/core/'
  );
});

test('non-preview redirect falls back to a relative Location for a non-docs host', async () => {
  const result = await run('/influxdb3/core', 'mybucket.s3.amazonaws.com');
  assert.equal(result.status, '301');
  assert.equal(result.headers.location[0].value, '/influxdb3/core/');
});
