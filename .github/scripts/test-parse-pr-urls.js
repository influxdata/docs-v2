/**
 * Test Suite for parse-pr-urls.js
 * Tests security fixes and functionality improvements
 */

import { extractDocsUrls } from './parse-pr-urls.js';

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

console.log('\n=== Testing parse-pr-urls.js ===\n');

// Original test case from the plan
test('Original test case: Multiple URL formats', () => {
  const text = `
Please preview:
- https://docs.influxdata.com/influxdb3/core/get-started/
- http://localhost:1313/telegraf/v1/plugins/
- /influxdb/cloud/admin/tokens/
`;
  const result = extractDocsUrls(text);
  assertEquals(
    result.sort(),
    [
      '/influxdb/cloud/admin/tokens/',
      '/influxdb3/core/get-started/',
      '/telegraf/v1/plugins/'
    ].sort(),
    'Should extract all three URL formats'
  );
});

// Test markdown links (Issue #2)
test('Markdown link: [text](/influxdb3/core/)', () => {
  const text = 'See [the docs](/influxdb3/core/) for details';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should extract path from markdown link');
});

test('Markdown link: multiple links in a line', () => {
  const text = 'Check [Core](/influxdb3/core/) and [Cloud](/influxdb/cloud/)';
  const result = extractDocsUrls(text);
  assertEquals(
    result.sort(),
    ['/influxdb/cloud/', '/influxdb3/core/'].sort(),
    'Should extract multiple markdown links'
  );
});

test('Markdown link: reference style', () => {
  const text = `
[link1]: /influxdb3/core/
[link2]: /telegraf/v1/
See [Core][link1] and [Telegraf][link2]
`;
  const result = extractDocsUrls(text);
  assertEquals(
    result.sort(),
    ['/influxdb3/core/', '/telegraf/v1/'].sort(),
    'Should extract reference-style markdown links'
  );
});

// Test path traversal attacks (Issue #1)
test('Path traversal: /influxdb3/../../etc/passwd/', () => {
  const text = 'Check /influxdb3/../../etc/passwd/';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject path traversal with ..');
});

test('Path traversal: /influxdb/../../../etc/passwd/', () => {
  const text = '/influxdb/../../../etc/passwd/';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject multiple .. segments');
});

test('Path traversal: in production URL', () => {
  const text = 'https://docs.influxdata.com/influxdb3/core/../../etc/passwd';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject .. in production URL');
});

test('Path traversal: URL encoded', () => {
  const text = '/influxdb3/%2E%2E/etc/passwd/';
  const result = extractDocsUrls(text);
  // This should be rejected by character validation
  assertEquals(result, [], 'Should reject URL-encoded path traversal');
});

// Test HTML/script injection (Issue #3)
test('HTML injection: <script> tag', () => {
  const text = '<script>alert(1)</script>';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject script tags');
});

test('HTML injection: <img> tag with path', () => {
  const text = '<img src="/influxdb3/core/" />';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject paths with angle brackets');
});

test('HTML injection: inline event handler', () => {
  const text = '<div onclick="/influxdb3/core/">click</div>';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject paths in HTML attributes');
});

test('Special characters: pipes and brackets', () => {
  const text = '/influxdb3/core/{malicious}/';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject paths with curly braces');
});

test('Special characters: backticks', () => {
  const text = '/influxdb3/`whoami`/';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject paths with backticks');
});

// Test valid product prefixes
test('Valid prefix: /influxdb3/', () => {
  const text = '/influxdb3/core/';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should accept influxdb3');
});

test('Valid prefix: /influxdb/', () => {
  const text = '/influxdb/cloud/';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb/cloud/'], 'Should accept influxdb');
});

test('Valid prefix: /telegraf/', () => {
  const text = '/telegraf/v1/';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/telegraf/v1/'], 'Should accept telegraf');
});

test('Valid prefix: /enterprise_influxdb/', () => {
  const text = '/enterprise_influxdb/v1/';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/enterprise_influxdb/v1/'], 'Should accept enterprise_influxdb');
});

test('Invalid prefix: /random/', () => {
  const text = '/random/path/';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should reject unknown product prefix');
});

// Test edge cases
test('Empty string', () => {
  const text = '';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should return empty array for empty string');
});

test('Null input', () => {
  const result = extractDocsUrls(null);
  assertEquals(result, [], 'Should return empty array for null');
});

test('Undefined input', () => {
  const result = extractDocsUrls(undefined);
  assertEquals(result, [], 'Should return empty array for undefined');
});

test('No URLs in text', () => {
  const text = 'This is just plain text with no URLs';
  const result = extractDocsUrls(text);
  assertEquals(result, [], 'Should return empty array when no URLs found');
});

// Test URL normalization
test('Normalization: adds trailing slash', () => {
  const text = '/influxdb3/core';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should add trailing slash');
});

test('Normalization: removes anchor', () => {
  const text = 'https://docs.influxdata.com/influxdb3/core/#section';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should remove anchor fragment');
});

test('Normalization: removes query string', () => {
  const text = 'https://docs.influxdata.com/influxdb3/core/?param=value';
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should remove query string');
});

// Test deduplication
test('Deduplication: same URL multiple times', () => {
  const text = `
/influxdb3/core/
/influxdb3/core/
/influxdb3/core/
`;
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should deduplicate identical URLs');
});

test('Deduplication: different formats, same path', () => {
  const text = `
https://docs.influxdata.com/influxdb3/core/
http://localhost:1313/influxdb3/core/
/influxdb3/core/
`;
  const result = extractDocsUrls(text);
  assertEquals(result, ['/influxdb3/core/'], 'Should deduplicate different URL formats');
});

// Print summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
}
