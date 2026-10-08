import assert from 'assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import test from 'node:test';
import { classify, parseArgs, plan, runCommand } from '../verify-changed.mjs';

test('validates explicit paths and staged selection', () => {
  assert.deepEqual(parseArgs(['--run', 'content/a.md']), {
    paths: ['content/a.md'],
    run: true,
    staged: false,
  });
  assert.deepEqual(parseArgs(['--staged']), {
    paths: [],
    run: false,
    staged: true,
  });
  assert.throws(() => parseArgs([]), /Provide one/);
  assert.throws(() => parseArgs(['--staged', 'content/a.md']), /not both/);
});
test('classifies supported and deferred paths', () => {
  const result = classify(['content/a.md', 'AGENTS.md', 'assets/js/app.ts']);
  assert.deepEqual(result.content, ['content/a.md']);
  assert.deepEqual(result.agent, ['AGENTS.md']);
  assert.deepEqual(result.unsupported, ['assets/js/app.ts']);
});
test('discovers shared consumers and plans checks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-changed-'));
  fs.mkdirSync(path.join(root, 'content', 'shared'), { recursive: true });
  fs.mkdirSync(path.join(root, 'content', 'influxdb3', 'core'), {
    recursive: true,
  });
  fs.writeFileSync(path.join(root, 'content/shared/page.md'), 'Body\n');
  fs.writeFileSync(
    path.join(root, 'content/influxdb3/core/page.md'),
    '---\nsource: /shared/page.md\n---\n'
  );
  const result = plan(['content/shared/page.md'], root);
  assert.deepEqual(result.consumers, ['content/influxdb3/core/page.md']);
  assert.deepEqual(result.commands[1], [
    'sh',
    [
      '-c',
      'link-checker map "$@" | xargs link-checker check',
      'verify:changed',
      'content/shared/page.md',
      'content/influxdb3/core/page.md',
    ],
  ]);
});
test('keeps a failure log and deletes successful logs', () => {
  const output = { error: () => {}, log: () => {} };
  const failed = runCommand('node', ['-e', ''], {
    output,
    spawn: () => ({ status: 1, stdout: '', stderr: 'failure\n' }),
  });
  assert.equal(failed.ok, false);
  assert.equal(fs.existsSync(failed.log), true);
  fs.unlinkSync(failed.log);
  assert.deepEqual(
    runCommand('node', ['-e', ''], {
      output,
      spawn: () => ({ status: 0, stdout: 'ok', stderr: '' }),
    }),
    { ok: true }
  );
});
