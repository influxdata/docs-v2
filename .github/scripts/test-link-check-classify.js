/**
 * Test Suite for link-check-classify.js
 * Run with: node .github/scripts/test-link-check-classify.js
 */

import {
  normalizeUrl,
  urlMatchesIssueText,
  matchKnownIssue,
  reclassifyFileNotFound,
  applyKnownIssueDowngrade,
  classify,
} from './link-check-classify.js';

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

function assertTrue(value, message = '') {
  if (!value) throw new Error(`${message}\n  Expected truthy value`);
}

function assertFalse(value, message = '') {
  if (value) throw new Error(`${message}\n  Expected falsy value`);
}

console.log('\n=== Testing link-check-classify.js ===\n');

// normalizeUrl

test('normalizeUrl: strips trailing slash', () => {
  assertEquals(
    normalizeUrl('https://example.com/page/'),
    'https://example.com/page'
  );
});

test('normalizeUrl: strips multiple trailing slashes', () => {
  assertEquals(
    normalizeUrl('https://example.com/page///'),
    'https://example.com/page'
  );
});

test('normalizeUrl: trims whitespace', () => {
  assertEquals(normalizeUrl('  /influxdb3/core/  '), '/influxdb3/core');
});

test('normalizeUrl: empty/null input', () => {
  assertEquals(normalizeUrl(''), '');
  assertEquals(normalizeUrl(null), '');
  assertEquals(normalizeUrl(undefined), '');
});

// urlMatchesIssueText

test('urlMatchesIssueText: exact match in title', () => {
  assertTrue(
    urlMatchesIssueText(
      'https://example.com/missing',
      'Broken link: https://example.com/missing'
    )
  );
});

test('urlMatchesIssueText: match in body text', () => {
  assertTrue(
    urlMatchesIssueText(
      '/influxdb3/core/missing-page/',
      'Title line\nSee /influxdb3/core/missing-page/ for the 404.'
    )
  );
});

test('urlMatchesIssueText: trailing-slash asymmetry (URL has slash, text does not)', () => {
  assertTrue(
    urlMatchesIssueText(
      '/influxdb3/core/missing/',
      'Broken URL: /influxdb3/core/missing'
    )
  );
});

test('urlMatchesIssueText: trailing-slash asymmetry (text has slash, URL does not)', () => {
  assertTrue(
    urlMatchesIssueText(
      '/influxdb3/core/missing',
      'Broken URL: /influxdb3/core/missing/'
    )
  );
});

test('urlMatchesIssueText: rejects prefix collision', () => {
  assertFalse(
    urlMatchesIssueText(
      'https://example.com/b',
      'See https://example.com/bc for details'
    )
  );
});

test('urlMatchesIssueText: accepts when followed by slash', () => {
  assertTrue(
    urlMatchesIssueText(
      'https://example.com/b',
      'See https://example.com/b/extra for details'
    )
  );
});

test('urlMatchesIssueText: accepts when followed by closing paren', () => {
  assertTrue(
    urlMatchesIssueText(
      'https://example.com/b',
      '[link](https://example.com/b)'
    )
  );
});

test('urlMatchesIssueText: accepts when followed by newline or end of text', () => {
  assertTrue(
    urlMatchesIssueText(
      'https://example.com/b',
      'https://example.com/b\nmore text'
    )
  );
  assertTrue(
    urlMatchesIssueText('https://example.com/b', 'https://example.com/b')
  );
});

test('urlMatchesIssueText: markdown-wrapped URL in backticks', () => {
  assertTrue(
    urlMatchesIssueText('/influxdb3/core/', 'Path: `/influxdb3/core/`')
  );
});

test('urlMatchesIssueText: no match when URL absent', () => {
  assertFalse(
    urlMatchesIssueText('https://example.com/x', 'Nothing relevant here')
  );
});

test('urlMatchesIssueText: empty inputs', () => {
  assertFalse(urlMatchesIssueText('', 'some text'));
  assertFalse(urlMatchesIssueText('https://example.com/x', ''));
});

// matchKnownIssue

const knownIssues = [
  {
    number: 101,
    title: 'Broken link: /flux/v0/release-notes/#v0-104-0',
    text: 'Broken link: /flux/v0/release-notes/#v0-104-0\nFragment not found.',
    url: 'https://github.com/influxdata/docs-v2/issues/101',
  },
  {
    number: 102,
    title: 'Broken link: https://example.com/gone',
    text: 'Broken link: https://example.com/gone\nSource: content/influxdb3/core/foo.md',
    url: 'https://github.com/influxdata/docs-v2/issues/102',
  },
];

test('matchKnownIssue: finds matching issue', () => {
  const result = matchKnownIssue(
    '/flux/v0/release-notes/#v0-104-0',
    knownIssues
  );
  assertEquals(result, {
    number: 101,
    title: 'Broken link: /flux/v0/release-notes/#v0-104-0',
    url: 'https://github.com/influxdata/docs-v2/issues/101',
  });
});

test('matchKnownIssue: returns null when no match', () => {
  assertEquals(
    matchKnownIssue('https://example.com/unrelated', knownIssues),
    null
  );
});

test('matchKnownIssue: returns null for empty/invalid known issues', () => {
  assertEquals(matchKnownIssue('https://example.com/gone', []), null);
  assertEquals(matchKnownIssue('https://example.com/gone', null), null);
  assertEquals(matchKnownIssue('', knownIssues), null);
});

// reclassifyFileNotFound

test('reclassifyFileNotFound: moves file-not-found warnings to errors', () => {
  const results = {
    errors: [{ url: 'https://example.com/404', error: '404 Not Found' }],
    warnings: [
      {
        url: '/missing/page/',
        error: 'Cannot find file: missing/page/index.html',
      },
      { url: 'https://flaky.example.com/', error: 'Timeout' },
    ],
    summary: { error_count: 1, warning_count: 2 },
  };
  const result = reclassifyFileNotFound(results);
  assertEquals(result.errors.length, 2);
  assertEquals(result.warnings.length, 1);
  assertEquals(result.warnings[0].url, 'https://flaky.example.com/');
  assertEquals(
    result.errors.find((e) => e.url === '/missing/page/').severity,
    'error'
  );
  assertEquals(result.summary.error_count, 2);
  assertEquals(result.summary.warning_count, 1);
});

test('reclassifyFileNotFound: no-op when no file-not-found warnings', () => {
  const results = {
    errors: [{ url: 'https://example.com/404', error: '404 Not Found' }],
    warnings: [{ url: 'https://flaky.example.com/', error: 'Timeout' }],
    summary: { error_count: 1, warning_count: 1 },
  };
  const result = reclassifyFileNotFound(results);
  assertEquals(result.errors.length, 1);
  assertEquals(result.warnings.length, 1);
});

test('reclassifyFileNotFound: does not mutate input', () => {
  const results = {
    errors: [],
    warnings: [{ url: '/missing/', error: 'Cannot find file' }],
    summary: {},
  };
  reclassifyFileNotFound(results);
  assertEquals(
    results.errors.length,
    0,
    'Original errors array should be untouched'
  );
});

// applyKnownIssueDowngrade

test('applyKnownIssueDowngrade: downgrades matching error to warning', () => {
  const results = {
    errors: [
      { url: '/flux/v0/release-notes/#v0-104-0', error: 'Fragment not found' },
      { url: 'https://example.com/unrelated', error: '404 Not Found' },
    ],
    warnings: [],
    summary: { error_count: 2, warning_count: 0 },
  };
  const result = applyKnownIssueDowngrade(results, knownIssues);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].url, 'https://example.com/unrelated');
  assertEquals(result.warnings.length, 1);
  assertEquals(result.warnings[0].severity, 'warning');
  assertEquals(result.warnings[0].knownIssue.number, 101);
  assertEquals(result.summary.error_count, 1);
  assertEquals(result.summary.warning_count, 1);
  assertEquals(result.summary.known_issue_count, 1);
});

test('applyKnownIssueDowngrade: no-op with empty known issues', () => {
  const results = {
    errors: [{ url: 'https://example.com/x', error: '404' }],
    warnings: [{ url: 'https://y.com', error: 'Timeout' }],
    summary: { error_count: 1, warning_count: 1 },
  };
  const result = applyKnownIssueDowngrade(results, []);
  assertEquals(result.errors.length, 1);
  assertEquals(result.warnings.length, 1);
});

test('applyKnownIssueDowngrade: preserves unmatched errors untouched', () => {
  const results = {
    errors: [{ url: 'https://example.com/unrelated', error: '404 Not Found' }],
    warnings: [],
    summary: { error_count: 1, warning_count: 0 },
  };
  const result = applyKnownIssueDowngrade(results, knownIssues);
  assertEquals(result.errors.length, 1);
  assertEquals(result.warnings.length, 0);
  assertEquals(result.summary.known_issue_count, 0);
});

// classify (ordering)

test('classify: file-not-found error becomes downgradable when known', () => {
  const results = {
    errors: [],
    warnings: [
      {
        url: 'https://example.com/gone',
        error: 'Cannot find file: public/gone/index.html',
      },
    ],
    summary: { error_count: 0, warning_count: 1 },
  };
  const result = classify(results, knownIssues);
  assertEquals(result.errors.length, 0);
  assertEquals(result.warnings.length, 1);
  assertEquals(result.warnings[0].knownIssue.number, 102);
  assertEquals(result.warnings[0].severity, 'warning');
  assertEquals(result.summary.known_issue_count, 1);
});

test('classify: unrelated file-not-found stays an error', () => {
  const results = {
    errors: [],
    warnings: [
      {
        url: '/unrelated/missing/',
        error: 'Cannot find file: missing/index.html',
      },
    ],
    summary: { error_count: 0, warning_count: 1 },
  };
  const result = classify(results, knownIssues);
  assertEquals(result.errors.length, 1);
  assertEquals(result.warnings.length, 0);
});

// Print summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  process.exit(1);
}
