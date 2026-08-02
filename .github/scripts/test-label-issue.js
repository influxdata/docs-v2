/**
 * Test Suite for label-issue.js
 * Verifies product labels are derived only from docs URLs an issue names.
 */

import { getIssueProductLabels } from './label-issue.js';
import { getProductLabelMap } from './workflow-utils.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`✓ ${name}`);
  } catch (error) {
    failedTests++;
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
  }
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

const pathToLabel = await getProductLabelMap();

console.log('\n=== Testing label-issue.js ===\n');

test('Bug report template: labels from Relevant URLs section', () => {
  const issue = {
    title: 'Token permissions are wrong',
    body: [
      '_Describe the issue here._',
      '',
      '##### Relevant URLs',
      '- https://docs.influxdata.com/influxdb3/core/admin/tokens/',
    ].join('\n'),
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), [
    'product:v3-monolith',
  ]);
});

test('Broken link template: labels from a relative Broken URL', () => {
  const issue = {
    title: 'Broken link: /influxdb3/enterprise/get-started/',
    body: '### Broken URL\n\n/influxdb3/enterprise/get-started/\n',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), [
    'product:v3-monolith',
  ]);
});

test('Multiple products produce multiple labels', () => {
  const issue = {
    title: 'Line protocol docs disagree',
    body: [
      'https://docs.influxdata.com/influxdb3/core/reference/line-protocol/',
      'https://docs.influxdata.com/telegraf/v1/configuration/',
    ].join('\n'),
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), [
    'product:telegraf',
    'product:v3-monolith',
  ]);
});

test('Filesystem content paths resolve like their URL form', () => {
  const issue = {
    title: 'Fix retention docs',
    body: 'See /content/influxdb3/enterprise/admin/databases/_index.md',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), [
    'product:v3-monolith',
  ]);
});

test('No docs URL produces no labels', () => {
  const issue = {
    title: 'curl example missing a line-continuation backslash',
    body: 'This breaks copy/paste in a shell.',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), []);
});

test('URLs inside code blocks are ignored', () => {
  const issue = {
    title: 'Document the broken link format',
    body: [
      'The checker reports paths like this:',
      '',
      '```',
      'https://docs.influxdata.com/influxdb3/core/admin/',
      '```',
    ].join('\n'),
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), []);
});

test('Docs home page alone produces no labels', () => {
  const issue = {
    title: 'Home page typo',
    body: 'https://docs.influxdata.com/',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), []);
});

test('Non-docs URLs produce no labels', () => {
  const issue = {
    title: 'Follow-up from review',
    body: 'Originally posted in https://github.com/influxdata/docs-v2/pull/7503',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), []);
});

test('Title-only URL is enough', () => {
  const issue = {
    title: 'Broken link: /chronograf/v1/administration/',
    body: '',
  };
  assertEquals(getIssueProductLabels(issue, pathToLabel), [
    'product:chronograf',
  ]);
});

test('Missing title and body are handled', () => {
  assertEquals(getIssueProductLabels({}, pathToLabel), []);
  assertEquals(getIssueProductLabels(null, pathToLabel), []);
});

console.log(
  `\n=== ${passedTests}/${totalTests} passed, ${failedTests} failed ===\n`
);

if (failedTests > 0) process.exit(1);
