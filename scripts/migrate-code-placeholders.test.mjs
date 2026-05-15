import { test } from 'node:test';
import assert from 'node:assert/strict';
import { injectAttr } from './migrate-code-placeholders.mjs';

test('injectAttr: bare language fence', () => {
  const r = injectAttr('```py', 'API_TOKEN');
  assert.equal(r.line, '```py { placeholders="API_TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: empty language fence', () => {
  const r = injectAttr('```', 'TOKEN');
  assert.equal(r.line, '``` { placeholders="TOKEN" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: tilde fence preserves marker', () => {
  const r = injectAttr('~~~sh', 'X|Y');
  assert.equal(r.line, '~~~sh { placeholders="X|Y" }');
  assert.equal(r.status, 'injected');
});

test('injectAttr: preserves leading indentation', () => {
  const r = injectAttr('    ```js', 'TOK');
  assert.equal(r.line, '    ```js { placeholders="TOK" }');
});

test('injectAttr: merged path keeps space before brace when lang empty', () => {
  const r = injectAttr('``` { callout="--x" }', 'TOK');
  assert.equal(r.line, '``` { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: merged path unchanged for non-empty lang', () => {
  const r = injectAttr('```sh { callout="--x" }', 'TOK');
  assert.equal(r.line, '```sh { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: merges into brace with no spaces', () => {
  const r = injectAttr('```bash {callout="--x"}', 'TOK');
  assert.equal(r.line, '```bash { callout="--x" placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: empty brace block', () => {
  const r = injectAttr('```sh {  }', 'TOK');
  assert.equal(r.line, '```sh { placeholders="TOK" }');
  assert.equal(r.status, 'merged');
});

test('injectAttr: already has placeholders -> present, unchanged', () => {
  const original = '```sh { placeholders="OLD" }';
  const r = injectAttr(original, 'NEW');
  assert.equal(r.line, original);
  assert.equal(r.status, 'present');
});

import {
  parseOpenTag,
  isCloseTag,
  isOpenTagAny,
} from './migrate-code-placeholders.mjs';

test('parseOpenTag: percent delimiter, no indent', () => {
  const r = parseOpenTag('{{% code-placeholders "API_TOKEN" %}}');
  assert.deepEqual(r, { indent: '', regex: 'API_TOKEN' });
});

test('parseOpenTag: angle delimiter, indented', () => {
  const r = parseOpenTag('    {{< code-placeholders "DB|AUTH" >}}');
  assert.deepEqual(r, { indent: '    ', regex: 'DB|AUTH' });
});

test('parseOpenTag: complex regex with nested groups', () => {
  const r = parseOpenTag(
    '{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}'
  );
  assert.equal(r.regex, '(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)');
});

test('parseOpenTag: non-open returns null', () => {
  assert.equal(parseOpenTag('```py'), null);
  assert.equal(parseOpenTag('{{% code-placeholder-key %}}'), null);
});

test('isCloseTag: both delimiters, indented, spaced slash', () => {
  assert.equal(isCloseTag('{{% /code-placeholders %}}'), true);
  assert.equal(isCloseTag('   {{< /code-placeholders >}}'), true);
  assert.equal(isCloseTag('{{% / code-placeholders %}}'), true);
  assert.equal(isCloseTag('{{% code-placeholders "X" %}}'), false);
});

test('isOpenTagAny: detects any open regardless of regex', () => {
  assert.equal(isOpenTagAny('{{% code-placeholders "X" %}}'), true);
  assert.equal(isOpenTagAny('{{< code-placeholders "Y" >}}'), true);
  assert.equal(isOpenTagAny('{{% /code-placeholders %}}'), false);
  assert.equal(isOpenTagAny('plain text'), false);
});

import {
  regionContainsTabs,
  reindentRegion,
} from './migrate-code-placeholders.mjs';

test('regionContainsTabs: detects code-tabs-wrapper family', () => {
  assert.equal(regionContainsTabs(['```sh', 'x', '```']), false);
  assert.equal(
    regionContainsTabs(['{{< code-tabs-wrapper >}}', '```sh', '```']),
    true
  );
  assert.equal(regionContainsTabs(['{{% code-tab-content %}}']), true);
  assert.equal(regionContainsTabs(['{{% code-tabs %}}']), true);
});

test('reindentRegion: rebases min-indent to target width', () => {
  const out = reindentRegion(['```py', 'a = 1', '    nested', '```'], 4);
  assert.deepEqual(out, [
    '    ```py',
    '    a = 1',
    '        nested',
    '    ```',
  ]);
});

test('reindentRegion: blank lines stay empty', () => {
  const out = reindentRegion(['```py', '', 'x', '```'], 2);
  assert.deepEqual(out, ['  ```py', '', '  x', '  ```']);
});

test('reindentRegion: preserves relative indent when base > 0', () => {
  const out = reindentRegion(['  ```py', '  x', '    y', '  ```'], 4);
  assert.deepEqual(out, ['    ```py', '    x', '      y', '    ```']);
});

import { migrate } from './migrate-code-placeholders.mjs';

const NL = '\n';

test('migrate: simple single-fence percent wrapper', () => {
  const src = [
    '{{% code-placeholders "API_TOKEN" %}}',
    '',
    '```sh',
    'echo API_TOKEN',
    '```',
    '',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'a.md' });
  assert.equal(
    content,
    ['```sh { placeholders="API_TOKEN" }', 'echo API_TOKEN', '```'].join(NL)
  );
  assert.equal(report.transformed, 1);
  assert.equal(report.skipped.length, 0);
});

test('migrate: multi-fence span with prose between', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    '```sh',
    'one',
    '```',
    '',
    'prose here',
    '',
    '```sh',
    'two',
    '```',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'b.md' });
  assert.equal(
    content,
    [
      '```sh { placeholders="RE" }',
      'one',
      '```',
      '',
      'prose here',
      '',
      '```sh { placeholders="RE" }',
      'two',
      '```',
    ].join(NL)
  );
  assert.equal(report.transformed, 2);
});

test('migrate: list-nested indented wrapper re-indents block', () => {
  const src = [
    '1.  Do this',
    '2.  Update the following code:',
    '',
    '    {{% code-placeholders "TOK" %}}',
    '```py',
    'x = TOK',
    '```',
    '    {{% /code-placeholders %}}',
    '',
    '3.  Now do this!',
  ].join(NL);
  const { content } = migrate(src, { file: 'c.md' });
  assert.equal(
    content,
    [
      '1.  Do this',
      '2.  Update the following code:',
      '',
      '    ```py { placeholders="TOK" }',
      '    x = TOK',
      '    ```',
      '',
      '3.  Now do this!',
    ].join(NL)
  );
});

test('migrate: angle-bracket delimiter variant', () => {
  const src = [
    '{{< code-placeholders "DB|AUTH" >}}',
    '```sh',
    'q',
    '```',
    '{{< /code-placeholders >}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'd.md' });
  assert.equal(
    content,
    ['```sh { placeholders="DB|AUTH" }', 'q', '```'].join(NL)
  );
  assert.equal(report.transformed, 1);
});

test('migrate: code-tabs-wrapper region is skipped + reported', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    '{{< code-tabs-wrapper >}}',
    '```bash',
    'x',
    '```',
    '{{< /code-tabs-wrapper >}}',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'e.md' });
  assert.equal(content, src); // unchanged
  assert.equal(report.transformed, 0);
  assert.equal(report.skipped.length, 1);
  assert.equal(report.skipped[0].reason, 'code-tabs-wrapper');
  assert.equal(report.skipped[0].file, 'e.md');
});

test('migrate: wrapper with no fence is skipped + reported', () => {
  const src = [
    '{{% code-placeholders "RE" %}}',
    'just prose, no code',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'f.md' });
  assert.equal(content, src);
  assert.equal(report.skipped[0].reason, 'no-fence');
});

test('migrate: fence already has placeholders -> counted, left intact', () => {
  const src = [
    '{{% code-placeholders "NEW" %}}',
    '```sh { placeholders="OLD" }',
    'x',
    '```',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'g.md' });
  assert.equal(
    content,
    ['```sh { placeholders="OLD" }', 'x', '```'].join(NL)
  );
  assert.equal(report.alreadyPresent, 1);
  assert.equal(report.transformed, 0);
});

test('migrate: nested open before close -> skipped unchanged', () => {
  const src = [
    '{{% code-placeholders "A" %}}',
    '{{% code-placeholders "B" %}}',
    '```sh',
    'x',
    '```',
    '{{% /code-placeholders %}}',
    '{{% /code-placeholders %}}',
  ].join(NL);
  const { content, report } = migrate(src, { file: 'h.md' });
  assert.equal(content, src);
  assert.equal(report.skipped.some((s) => s.reason === 'nested'), true);
});

test('migrate: preserves interleaved pytest comment, re-indented', () => {
  const src = [
    '1.  Step',
    '',
    '    {{< code-placeholders "DB" >}}',
    '',
    '    <!--pytest-codeblocks:cont-->',
    '```sh',
    'q DB',
    '```',
    '    {{< /code-placeholders >}}',
  ].join(NL);
  const { content } = migrate(src, { file: 'i.md' });
  assert.equal(
    content,
    [
      '1.  Step',
      '',
      '    <!--pytest-codeblocks:cont-->',
      '    ```sh { placeholders="DB" }',
      '    q DB',
      '    ```',
    ].join(NL)
  );
});

test('migrate: file with no wrapper is returned unchanged', () => {
  const src = '# Title\n\n```sh\necho hi\n```\n';
  const { content, report } = migrate(src, { file: 'j.md' });
  assert.equal(content, src);
  assert.equal(report.transformed, 0);
});
