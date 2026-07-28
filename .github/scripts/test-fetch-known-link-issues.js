/**
 * Test Suite for fetch-known-link-issues.js
 * Run with: node .github/scripts/test-fetch-known-link-issues.js
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  fetchKnownLinkIssues,
  writeKnownLinkIssues,
} from './fetch-known-link-issues.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  return Promise.resolve()
    .then(fn)
    .then(() => {
      passedTests++;
      console.log(`✓ ${name}`);
    })
    .catch((error) => {
      failedTests++;
      console.error(`✗ ${name}`);
      console.error(`  ${error.message}`);
    });
}

function assertEquals(actual, expected, message = '') {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      `${message}\n  Expected: ${expectedStr}\n  Actual: ${actualStr}`
    );
  }
}

const context = { repo: { owner: 'influxdata', repo: 'docs-v2' } };

function fakeGithub(issues) {
  return {
    rest: { issues: { listForRepo: () => {} } },
    paginate: async (_fn, params) => {
      assertEquals(
        params.labels,
        'area:links',
        'Should query area:links label'
      );
      assertEquals(params.state, 'open', 'Should query only open issues');
      return issues;
    },
  };
}

async function run() {
  console.log('\n=== Testing fetch-known-link-issues.js ===\n');

  await test('fetchKnownLinkIssues: maps issue fields', async () => {
    const github = fakeGithub([
      {
        number: 42,
        title: 'Broken link: /influxdb3/core/missing/',
        body: 'Found on PR #1',
        html_url: 'https://github.com/influxdata/docs-v2/issues/42',
      },
    ]);
    const result = await fetchKnownLinkIssues(github, context);
    assertEquals(result, [
      {
        number: 42,
        title: 'Broken link: /influxdb3/core/missing/',
        text: 'Broken link: /influxdb3/core/missing/\nFound on PR #1',
        url: 'https://github.com/influxdata/docs-v2/issues/42',
      },
    ]);
  });

  await test('fetchKnownLinkIssues: filters out pull requests', async () => {
    const github = fakeGithub([
      { number: 1, title: 'A PR', body: '', html_url: 'x', pull_request: {} },
      { number: 2, title: 'An issue', body: '', html_url: 'y' },
    ]);
    const result = await fetchKnownLinkIssues(github, context);
    assertEquals(result.length, 1);
    assertEquals(result[0].number, 2);
  });

  await test('fetchKnownLinkIssues: handles missing body', async () => {
    const github = fakeGithub([
      { number: 3, title: 'No body', body: null, html_url: 'z' },
    ]);
    const result = await fetchKnownLinkIssues(github, context);
    assertEquals(result[0].text, 'No body\n');
  });

  await test('writeKnownLinkIssues: writes results to disk', async () => {
    const github = fakeGithub([
      { number: 5, title: 'Issue', body: 'body', html_url: 'u' },
    ]);
    const outputPath = path.join(
      os.tmpdir(),
      `known-issues-${Date.now()}.json`
    );
    const count = await writeKnownLinkIssues(github, context, outputPath);
    assertEquals(count, 1);
    const written = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    assertEquals(written.length, 1);
    fs.unlinkSync(outputPath);
  });

  await test('writeKnownLinkIssues: writes empty list on API failure', async () => {
    const github = {
      paginate: async () => {
        throw new Error('API rate limited');
      },
    };
    const outputPath = path.join(
      os.tmpdir(),
      `known-issues-fail-${Date.now()}.json`
    );
    const count = await writeKnownLinkIssues(github, context, outputPath);
    assertEquals(count, 0);
    const written = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    assertEquals(written, []);
    fs.unlinkSync(outputPath);
  });

  console.log('\n=== Test Summary ===');
  console.log(`Total: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

run();
