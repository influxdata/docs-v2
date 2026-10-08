import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  transformChangelog,
  DEFAULT_EXCLUDE_HEADINGS,
} from '../transform-changelog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(__dirname, 'fixtures');

function readFixture(name) {
  return readFileSync(join(FIXTURES, name), 'utf8');
}

test('rewrites bracketed version heading to Hugo date-attribute form', () => {
  const input = `# Changelog\n\n## [0.19.0] - 2026-04-23\n### Added\n- New feature.\n`;
  const result = transformChangelog(input);
  assert.match(result.body, /## v0\.19\.0 \{date="2026-04-23"\}/);
});

test('rewrites date-in-brackets version heading', () => {
  const input = `# Change Log\n\n## 0.19.0 [2026-04-23]\n### Features\n- Thing.\n`;
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

test('strips leading `# Change Log` H1', () => {
  const input = `# Change Log\n\nSome preamble.\n\n## 0.19.0 [2026-04-23]\n`;
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /^# Change Log/m);
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

test('strips `## <version> [unreleased]` section through to next version heading', () => {
  const input = [
    '# Change Log',
    '',
    '## 0.20.0 [unreleased]',
    '',
    '### Features',
    '- Speculative feature.',
    '',
    '## 0.19.0 [2026-04-23]',
    '',
    '### Features',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /0\.20\.0 \[unreleased\]/i);
  assert.doesNotMatch(result.body, /Speculative feature/);
  assert.match(result.body, /## v0\.19\.0 \{date="2026-04-23"\}/);
  assert.match(result.body, /Real feature/);
});

test('collapses `### CI` heading and its items to a single bullet by default', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### Features',
    '- Real feature.',
    '',
    '### CI',
    '- Pipeline tweak.',
    '- Another CI item.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /### CI/);
  assert.doesNotMatch(result.body, /Pipeline tweak/);
  assert.doesNotMatch(result.body, /Another CI item/);
  assert.match(result.body, /### Features/);
  assert.match(result.body, /Real feature/);
  assert.match(result.body, /^- CI updates$/m);
});

test('collapsed bullet keeps blank-line separation from the next heading', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### CI',
    '- Pipeline tweak.',
    '',
    '### Docs',
    '- Real docs change.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.match(result.body, /- CI updates\n\n### Docs/);
  assert.match(result.body, /Real docs change/);
});

test('collapsed bullet stops at the next version heading', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### CI',
    '- Pipeline tweak.',
    '',
    '## [0.18.0] - 2026-03-10',
    '',
    '### Features',
    '- Older feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /Pipeline tweak/);
  assert.match(
    result.body,
    /- CI updates\n\n## v0\.18\.0 \{date="2026-03-10"\}/
  );
  assert.match(result.body, /Older feature/);
});

test('a release with only a CI section still shows a bullet, not an empty release', () => {
  const input = [
    '## [1.4.0] - 2025-09-15',
    '',
    '### CI',
    '- Pipeline tweak.',
    '',
    '## [1.3.0] - 2025-08-12',
    '',
    '### Features',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.match(
    result.body,
    /## v1\.4\.0 \{date="2025-09-15"\}\n\n- CI updates\n\n## v1\.3\.0/
  );
});

test('drops deeper subheadings nested under a collapsed heading', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### CI',
    '#### Pipelines',
    '- Nested CI item.',
    '',
    '### Features',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input);
  assert.doesNotMatch(result.body, /#### Pipelines/);
  assert.doesNotMatch(result.body, /Nested CI item/);
  assert.match(result.body, /Real feature/);
});

test('exclude matching is case-insensitive and tolerates `#` markers', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### ci',
    '- Lowercase heading.',
    '',
    '### Features',
    '- Real feature.',
    '',
  ].join('\n');
  const result = transformChangelog(input, undefined, {
    excludeHeadings: ['### CI'],
  });
  assert.doesNotMatch(result.body, /Lowercase heading/);
  assert.match(result.body, /- CI updates/);
  assert.match(result.body, /Real feature/);
});

test('exclude entries support a custom replacement bullet', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### Deps',
    '- Bump lodash.',
    '',
  ].join('\n');
  const result = transformChangelog(input, undefined, {
    excludeHeadings: [{ heading: 'Deps', replacement: 'Dependency bumps' }],
  });
  assert.doesNotMatch(result.body, /Bump lodash/);
  assert.match(result.body, /^- Dependency bumps$/m);
});

test('empty exclude list keeps all sections', () => {
  const input = [
    '## [0.19.0] - 2026-04-23',
    '',
    '### CI',
    '- Pipeline tweak.',
    '',
  ].join('\n');
  const result = transformChangelog(input, undefined, { excludeHeadings: [] });
  assert.match(result.body, /### CI/);
  assert.match(result.body, /Pipeline tweak/);
});

test('exports `CI` as a default excluded heading', () => {
  assert.ok(DEFAULT_EXCLUDE_HEADINGS.includes('CI'));
});

test('exclude fixture produces expected full-page output', () => {
  const input = readFixture('exclude-CHANGELOG.txt');
  const expected = readFixture('exclude-expected.txt');
  const { page } = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.equal(page.trim(), expected.trim());
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

test('renders body-only page (no frontmatter) when metadata is provided', () => {
  const input = `## [0.19.0] - 2026-04-23\n### Added\n- Thing.\n`;
  const result = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.doesNotMatch(result.page, /^---$/m);
  assert.match(
    result.page,
    /^<!-- Generated from CHANGELOG\.md\. Edit upstream and re-sync; do not edit here\. -->/
  );
  assert.match(result.page, /## v0\.19\.0 \{date="2026-04-23"\}/);
});

test('python fixture produces expected full-page output', () => {
  const input = readFixture('python-CHANGELOG.txt');
  const expected = readFixture('python-expected.txt');
  const { page } = transformChangelog(input, {
    displayName: 'influxdb3-python',
    language: 'Python',
    repo: 'InfluxCommunity/influxdb3-python',
  });
  assert.equal(page.trim(), expected.trim());
});

test('go fixture produces expected full-page output', () => {
  const input = readFixture('go-CHANGELOG.txt');
  const expected = readFixture('go-expected.txt');
  const { page } = transformChangelog(input, {
    displayName: 'influxdb3-go',
    language: 'Go',
    repo: 'InfluxCommunity/influxdb3-go',
  });
  assert.equal(page.trim(), expected.trim());
});
