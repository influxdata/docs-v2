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
