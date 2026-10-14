import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadRules, lintProse } from '../../lib/prose-lint.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = join(__dirname, '../lint-prose.mjs');
const rules = loadRules();

const pathFor = (rule) =>
  `${rule.paths?.[0] ?? 'content/influxdb3/core/'}page.md`;
const ruleIds = (markdown, path = 'content/influxdb3/core/page.md') =>
  lintProse(markdown, { path, rules }).map((finding) => finding.rule);

for (const rule of rules) {
  for (const example of rule.examples.flag) {
    test(`${rule.id} flags: ${example}`, () => {
      assert.ok(ruleIds(example, pathFor(rule)).includes(rule.id));
    });
  }
  for (const example of rule.examples.pass) {
    test(`${rule.id} passes: ${example}`, () => {
      assert.ok(!ruleIds(example, pathFor(rule)).includes(rule.id));
    });
  }
}

test('every rule has an example of each kind', () => {
  for (const rule of rules) {
    assert.ok(rule.examples.flag.length > 0, `${rule.id} needs a flag example`);
    assert.ok(rule.examples.pass.length > 0, `${rule.id} needs a pass example`);
  }
});

test('checks prose only', () => {
  const markdown = [
    '---',
    'title: Use dedupe',
    '---',
    '',
    '```sh',
    'dedupe --file-path data.lp',
    '```',
    '',
    'Run `dedupe` and see [the docs](https://example.com/dedupe/e.g.).',
    '',
    '{{< api-endpoint method="post" endpoint="/api/v2/dedupe" >}}',
    '',
    '<div class="note">dedupe</div>',
    '',
    'Clone https://github.com/influxdata/dedupe or open content/shared/dedupe/file.md.',
  ].join('\n');
  assert.deepEqual(ruleIds(markdown), []);
});

test('reads product-name shortcodes as InfluxDB', () => {
  assert.deepEqual(ruleIds('Start an {{% product-name %}} server.'), []);
  assert.deepEqual(
    ruleIds('Start a {{< product-name omit="Clustered" >}} server.'),
    ['ProductNameArticle']
  );
});

test('skips product rules in shared content', () => {
  const markdown = 'Write to a bucket in Cloud Serverless.';
  assert.deepEqual(
    ruleIds(markdown, 'content/shared/influxdb3-write/page.md'),
    []
  );
  assert.deepEqual(ruleIds(markdown, 'content/influxdb3/clustered/page.md'), [
    'V3Terms',
    'ClusteredBranding',
  ]);
});

test('reports the source line and column of each match', () => {
  const markdown = [
    '# Title',
    '',
    '- First item',
    '  continues with the the data.',
  ].join('\n');
  const [finding] = lintProse(markdown, { path: 'content/example.md', rules });
  assert.equal(finding.rule, 'RepeatedWords');
  assert.equal(finding.line, 4);
  assert.equal(finding.column, 18);
  assert.equal(finding.match, 'the the');
});

test('CLI reports findings as annotations without failing', () => {
  const result = spawnSync(
    'node',
    [
      cli,
      '--format=github',
      join(__dirname, 'fixtures/prose-lint/findings.md'),
    ],
    { encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: '' } }
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(
    result.stdout,
    /::warning file=.*findings\.md,line=3,col=7,title=Branding::/
  );
  assert.match(
    result.stdout,
    /::notice file=.*findings\.md,line=5,col=9,title=Cliches::/
  );
});
