import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transformChangelog } from '../transform-changelog.js';

test('rewrites bracketed version heading to Hugo date-attribute form', () => {
  const input = `# Changelog\n\n## [0.19.0] - 2026-04-23\n### Added\n- New feature.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v0\.19\.0 \{date="2026-04-23"\}/);
});

test('rewrites unbracketed version heading', () => {
  const input = `## 2.14.0 - 2026-04-23\n### Fixed\n- Bug.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v2\.14\.0 \{date="2026-04-23"\}/);
});

test('rewrites version heading with parens around date', () => {
  const input = `## [1.8.0] (2026-04-23)\n### Added\n- Feature.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v1\.8\.0 \{date="2026-04-23"\}/);
});

test('passes through non-matching lines unchanged', () => {
  const input = `## Some other heading\n\nArbitrary text.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## Some other heading/);
  assert.match(result.body, /Arbitrary text\./);
});

test('strips leading `# Changelog` H1', () => {
  const input = `# Changelog\n\nSome preamble.\n\n## [0.19.0] - 2026-04-23\n`;
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /^# Changelog/m);
  assert.match(result.body, /Some preamble\./);
});

test('strips `## [Unreleased]` section through to next version heading', () => {
  const input = [
    '## [Unreleased]',
    '### Added',
    '- Speculative feature.',
    '',
    '## [0.19.0] - 2026-04-23',
    '### Added',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /Unreleased/);
  assert.doesNotMatch(result.body, /Speculative feature/);
  assert.match(result.body, /Real feature/);
});

test('strips `## [Unreleased]` section through EOF when no later version', () => {
  const input = `## [Unreleased]\n### Added\n- Only speculative content.\n`;
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /Unreleased/);
  assert.doesNotMatch(result.body, /Only speculative/);
});

test('extracts latest version and date to return value', () => {
  const input = `## [0.19.0] - 2026-04-23\n\n## [0.18.0] - 2026-03-10\n`;
  const result = transformChangelog(input);
  assert.equal(result.latestVersion, '0.19.0');
  assert.equal(result.latestReleaseDate, '2026-04-23');
});

test('returns null latestVersion when no version heading present', () => {
  const input = `Some text with no versioned heading.\n`;
  const result = transformChangelog(input);
  assert.equal(result.latestVersion, null);
  assert.equal(result.latestReleaseDate, null);
});

test('renders full page with frontmatter when client metadata is provided', () => {
  const input = `## [0.19.0] - 2026-04-23\n### Added\n- Thing.\n`;
  const result = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.match(result.page, /^---\n/);
  assert.match(result.page, /title: influxdb3-python release notes/);
  assert.match(result.page, /latest_version: 0\.19\.0/);
  assert.match(result.page, /latest_release_date: 2026-04-23/);
  assert.match(
    result.page,
    /source_repo: https:\/\/github\.com\/InfluxCommunity\/influxdb3-python/
  );
  assert.match(result.page, /generated: true/);
  assert.match(
    result.page,
    /<!-- Generated from CHANGELOG\.md\. Edit upstream and re-sync; do not edit here\. -->/
  );
  assert.match(result.page, /## v0\.19\.0 \{date="2026-04-23"\}/);
});
