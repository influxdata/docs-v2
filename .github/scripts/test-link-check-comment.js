/**
 * Test Suite for link-check-comment.js
 * Run with: node .github/scripts/test-link-check-comment.js
 */

import {
  COMMENT_MARKER,
  mapPublicToContentPath,
  escapeTableCell,
  generateLinkCheckComment,
  generateReportUrl,
} from './link-check-comment.js';

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

function assertIncludes(haystack, needle, message = '') {
  if (!haystack.includes(needle)) {
    throw new Error(`${message}\n  Expected to include: ${needle}`);
  }
}

function assertNotIncludes(haystack, needle, message = '') {
  if (haystack.includes(needle)) {
    throw new Error(`${message}\n  Expected NOT to include: ${needle}`);
  }
}

function assertTrue(value, message = '') {
  if (!value) throw new Error(`${message}\n  Expected truthy value`);
}

console.log('\n=== Testing link-check-comment.js ===\n');

// mapPublicToContentPath

test('mapPublicToContentPath: section index page', () => {
  assertEquals(
    mapPublicToContentPath(
      '/home/runner/work/docs-v2/docs-v2/public/influxdb3/core/get-started/index.html'
    ),
    'content/influxdb3/core/get-started/_index.md',
    'Should map public index.html to content _index.md'
  );
});

test('mapPublicToContentPath: non-index HTML file keeps .html (sed parity)', () => {
  assertEquals(
    mapPublicToContentPath('/work/public/influxdb3/core/page.html'),
    'content/influxdb3/core/page.html',
    'Should only rewrite trailing /index.html'
  );
});

test('mapPublicToContentPath: path without /public/ passes through', () => {
  assertEquals(
    mapPublicToContentPath('content/influxdb3/core/get-started/_index.md'),
    'content/influxdb3/core/get-started/_index.md',
    'Should leave non-public paths unchanged'
  );
});

test('mapPublicToContentPath: empty input', () => {
  assertEquals(mapPublicToContentPath(''), 'unknown');
  assertEquals(mapPublicToContentPath(null), 'unknown');
});

// escapeTableCell

test('escapeTableCell: escapes pipes', () => {
  assertEquals(
    escapeTableCell('status | 404'),
    'status \\| 404',
    'Should escape pipe characters'
  );
});

test('escapeTableCell: collapses newlines', () => {
  assertEquals(
    escapeTableCell('line one\nline two'),
    'line one line two',
    'Should collapse newlines to spaces'
  );
});

test('escapeTableCell: truncates long text', () => {
  const long = 'x'.repeat(200);
  const result = escapeTableCell(long, 80);
  assertEquals(result.length, 81, 'Should truncate to maxLength plus ellipsis');
  assertIncludes(result, '…', 'Should append ellipsis');
});

test('escapeTableCell: empty input', () => {
  assertEquals(escapeTableCell(''), '');
  assertEquals(escapeTableCell(null), '');
});

// generateLinkCheckComment

const failedOptions = {
  status: 'failed',
  filesChecked: 3,
  totalLinks: 120,
  errorCount: 2,
  warningCount: 1,
  successRate: 98.3,
  errors: [
    {
      url: 'https://example.com/missing',
      error: '404 Not Found',
      file: '/work/public/influxdb3/core/get-started/index.html',
    },
    {
      url: '/influxdb3/core/nonexistent/',
      error: 'Cannot find file',
      file: '/work/public/influxdb3/enterprise/admin/index.html',
    },
  ],
  warnings: [
    {
      url: 'https://flaky.example.com/',
      error: 'Timeout',
      file: '/work/public/influxdb3/core/get-started/index.html',
    },
  ],
  runUrl: 'https://github.com/influxdata/docs-v2/actions/runs/123',
};

test('failed status: includes marker, headline, and metrics', () => {
  const body = generateLinkCheckComment(failedOptions);
  assertIncludes(body, COMMENT_MARKER, 'Should include sticky marker');
  assertIncludes(body, '2 broken link(s) found', 'Should include error count');
  assertIncludes(body, '| Files Checked | 3 |', 'Should include metrics table');
  assertIncludes(body, '| Success Rate | 98.3% |', 'Should include rate');
});

test('failed status: renders error rows with content paths', () => {
  const body = generateLinkCheckComment(failedOptions);
  assertIncludes(body, '### Broken Links');
  assertIncludes(
    body,
    '`content/influxdb3/core/get-started/_index.md`',
    'Should map public path to content path'
  );
  assertIncludes(body, 'https://example.com/missing');
  assertIncludes(body, '404 Not Found');
});

test('failed status: renders collapsed warnings', () => {
  const body = generateLinkCheckComment(failedOptions);
  assertIncludes(body, '<details>');
  assertIncludes(body, '1 warning(s) (do not fail CI)');
  assertIncludes(body, 'https://flaky.example.com/');
});

test('failed status: links to the workflow run', () => {
  const body = generateLinkCheckComment(failedOptions);
  assertIncludes(
    body,
    'https://github.com/influxdata/docs-v2/actions/runs/123'
  );
});

test('error truncation: >50 errors shows truncation notice', () => {
  const errors = Array.from({ length: 75 }, (_, i) => ({
    url: `https://example.com/${i}`,
    error: '404 Not Found',
    file: `/work/public/influxdb3/core/page-${i}/index.html`,
  }));
  const body = generateLinkCheckComment({
    ...failedOptions,
    errorCount: errors.length,
    errors,
  });
  assertIncludes(body, 'Showing first 50 of 75 errors');
  assertIncludes(body, 'https://example.com/49', 'Should include 50th error');
  assertNotIncludes(body, 'https://example.com/50 ', 'Should omit 51st error');
});

test('oversized comment: stays under GitHub limit with 500 errors', () => {
  const errors = Array.from({ length: 500 }, (_, i) => ({
    url: `https://example.com/some/long/path/segment/${i}?query=value`,
    error: 'x'.repeat(300),
    file: `/work/public/influxdb3/core/a-fairly-long-page-name-${i}/index.html`,
  }));
  const warnings = Array.from({ length: 100 }, (_, i) => ({
    url: `https://warn.example.com/${i}`,
    error: 'Timeout',
    file: `/work/public/influxdb3/core/page-${i}/index.html`,
  }));
  const body = generateLinkCheckComment({
    ...failedOptions,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings,
  });
  if (body.length > 65536) {
    throw new Error(`Body too long: ${body.length} chars`);
  }
});

test('passed status: success headline, no broken links table', () => {
  const body = generateLinkCheckComment({
    ...failedOptions,
    status: 'passed',
    errorCount: 0,
    errors: [],
  });
  assertIncludes(body, '✅ **All links are valid**');
  assertNotIncludes(body, '### Broken Links');
  assertIncludes(body, '<details>', 'Should still show warnings');
});

test('passed status without warnings: no details block', () => {
  const body = generateLinkCheckComment({
    ...failedOptions,
    status: 'passed',
    errorCount: 0,
    errors: [],
    warningCount: 0,
    warnings: [],
  });
  assertIncludes(body, '✅ **All links are valid**');
  assertNotIncludes(body, '<details>');
});

test('error status: could-not-complete body without metrics', () => {
  const body = generateLinkCheckComment({
    status: 'error',
    runUrl: 'https://github.com/influxdata/docs-v2/actions/runs/123',
  });
  assertIncludes(body, COMMENT_MARKER);
  assertIncludes(body, 'Link check could not complete');
  assertNotIncludes(body, '| Files Checked |');
});

test('skipped status: short refresh body', () => {
  const body = generateLinkCheckComment({ status: 'skipped' });
  assertIncludes(body, COMMENT_MARKER);
  assertIncludes(body, 'No public files were link-checked');
  assertNotIncludes(body, '| Files Checked |');
});

test('table safety: pipes in URLs and errors are escaped', () => {
  const body = generateLinkCheckComment({
    ...failedOptions,
    errors: [
      {
        url: 'https://example.com/a|b',
        error: 'weird | message',
        file: '/work/public/influxdb3/core/index.html',
      },
    ],
  });
  assertIncludes(body, 'https://example.com/a\\|b');
  assertIncludes(body, 'weird \\| message');
});

// generateReportUrl

test('generateReportUrl: includes template and encoded fields', () => {
  const url = generateReportUrl(
    {
      url: 'https://example.com/missing?x=1&y=2',
      error: '404 Not Found',
      file: '/work/public/influxdb3/core/get-started/index.html',
    },
    42
  );
  assertIncludes(url, 'template=broken-link.yml');
  assertIncludes(url, 'title=Broken+link%3A');
  assertIncludes(
    url,
    'broken-url=https%3A%2F%2Fexample.com%2Fmissing%3Fx%3D1%26y%3D2'
  );
  assertIncludes(url, 'error-status=404+Not+Found');
  assertIncludes(url, 'context=Found+by+link-checker+on+PR+%2342');
  assertIncludes(
    url,
    'source-pages=content%2Finfluxdb3%2Fcore%2Fget-started%2F_index.md'
  );
});

test('generateReportUrl: omits PR fragment when prNumber is undefined', () => {
  const url = generateReportUrl({
    url: 'https://example.com/x',
    error: '404',
    file: '/work/public/x/index.html',
  });
  assertIncludes(url, 'context=Found+by+link-checker');
  assertNotIncludes(url, 'PR');
});

test('generateReportUrl: stays under length cap for pathological input', () => {
  const url = generateReportUrl(
    {
      url: 'https://example.com/' + 'x'.repeat(1000),
      error: 'y'.repeat(1000),
      file: '/work/public/' + 'z'.repeat(1000) + '/index.html',
    },
    999999
  );
  if (url.length > 500) {
    throw new Error(`Report URL too long: ${url.length} chars`);
  }
});

// Known Issues section

const knownIssueOptions = {
  ...failedOptions,
  errorCount: 1,
  errors: [
    {
      url: 'https://example.com/unrelated',
      error: '404 Not Found',
      file: '/work/public/influxdb3/core/index.html',
    },
  ],
  warningCount: 2,
  knownIssueCount: 1,
  warnings: [
    {
      url: '/flux/v0/release-notes/#v0-104-0',
      error: 'Fragment not found',
      file: '/work/public/influxdb/v2/reference/release-notes/influxdb/index.html',
      knownIssue: {
        number: 101,
        title: 'Broken link: /flux/v0/release-notes/#v0-104-0',
        url: 'https://github.com/influxdata/docs-v2/issues/101',
      },
    },
    {
      url: 'https://flaky.example.com/',
      error: 'Timeout',
      file: '/work/public/influxdb3/core/get-started/index.html',
    },
  ],
};

test('Known Issues section: renders outside <details>, with #NNN link', () => {
  const body = generateLinkCheckComment(knownIssueOptions);
  assertIncludes(body, '### ⚠️ Known Issues (downgraded to warnings)');
  assertIncludes(
    body,
    '[#101](https://github.com/influxdata/docs-v2/issues/101)'
  );
  assertIncludes(body, '| Known Issues | 1 |');

  const knownIndex = body.indexOf('### ⚠️ Known Issues');
  const detailsIndex = body.indexOf('<details>');
  assertTrue(
    knownIndex < detailsIndex,
    'Known Issues section should render before the collapsed warnings details'
  );
});

test('Known Issues section: excluded from plain warnings details', () => {
  const body = generateLinkCheckComment(knownIssueOptions);
  const detailsSection = body.slice(body.indexOf('<details>'));
  assertNotIncludes(
    detailsSection,
    '/flux/v0/release-notes/#v0-104-0',
    'Known-issue warning should not duplicate into the plain warnings details'
  );
  assertIncludes(detailsSection, 'https://flaky.example.com/');
});

test('Known Issues section: still renders when status is passed', () => {
  const body = generateLinkCheckComment({
    ...knownIssueOptions,
    status: 'passed',
    errorCount: 0,
    errors: [],
  });
  assertIncludes(body, '✅ **All links are valid**');
  assertIncludes(body, '### ⚠️ Known Issues (downgraded to warnings)');
});

test('Known Issues section: errors table has Report column', () => {
  const body = generateLinkCheckComment(knownIssueOptions);
  assertIncludes(body, '| Source File | Broken URL | Error | Report |');
  assertIncludes(
    body,
    '[Report](https://github.com/influxdata/docs-v2/issues/new?'
  );
});

test('oversized comment with report links: stays under GitHub limit', () => {
  const errors = Array.from({ length: 500 }, (_, i) => ({
    url: `https://example.com/some/long/path/segment/${i}?query=value`,
    error: 'x'.repeat(300),
    file: `/work/public/influxdb3/core/a-fairly-long-page-name-${i}/index.html`,
  }));
  const body = generateLinkCheckComment({
    ...failedOptions,
    errorCount: errors.length,
    errors,
    prNumber: 42,
  });
  if (body.length > 65536) {
    throw new Error(`Body too long: ${body.length} chars`);
  }
});

// Print summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
}
