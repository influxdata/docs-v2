import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import yaml from 'js-yaml';

const script = fileURLToPath(new URL('../port_to_docs.js', import.meta.url));

function fixture({ checkout, fetchFailure = false }) {
  const root = mkdtempSync(join(tmpdir(), 'plugin-full-sync-'));
  const docs = join(root, 'docs-v2');
  const cwd = join(docs, 'helper-scripts/influxdb3-plugins');
  mkdirSync(cwd, { recursive: true });
  mkdirSync(join(docs, 'data'));
  const data = join(docs, 'data/influxdb3_plugins.yml');
  writeFileSync(data, '[]\n');
  const pages = {};
  for (const name of ['retired', 'missing', 'mixed', 'gone']) {
    pages[name] = [
      `content/shared/influxdb3-plugins/plugins-library/official/${name}.md`,
      ...['core', 'enterprise'].map(
        (product) =>
          `content/influxdb3/${product}/plugins/library/official/${name}.md`
      ),
    ].map((path) => join(docs, path));
    for (const path of pages[name]) {
      mkdirSync(join(path, '..'), { recursive: true });
      writeFileSync(path, 'keep existing docs\n');
    }
  }
  const upstream = join(root, '.ext/influxdb3_plugins/influxdata');
  if (checkout !== 'absent') mkdirSync(upstream, { recursive: true });
  if (checkout === 'present') {
    mkdirSync(join(upstream, 'retired'));
    writeFileSync(
      join(upstream, 'retired/README.md'),
      '# Retired\n\nStill has a README.\n'
    );
  }
  writeFileSync(join(cwd, 'docs_mapping.yaml'), 'plugins: {}\n');
  const entry = (name, version, yanked) => ({
    name,
    version,
    yanked,
    published_at: `2026-09-0${version}T00:00:00Z`,
    description: 'Plugin',
    triggers: ['process_writes'],
    dependencies: { database_version: '>=3.0.0' },
    repository: 'https://example.test',
  });
  const index = {
    plugins: [
      entry('retired', '1', true),
      entry('retired', '2', true),
      entry('missing', '1', false),
      entry('mixed', '1', false),
      entry('mixed', '2', true),
    ],
  };
  const preload = join(root, 'fetch.mjs');
  writeFileSync(
    preload,
    fetchFailure
      ? "globalThis.fetch = async () => { throw new Error('offline'); };"
      : `globalThis.fetch = async () => new Response(${JSON.stringify(JSON.stringify(index))});`
  );
  const run = (...args) =>
    spawnSync(process.execPath, ['--import', preload, script, ...args], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, GITHUB_OUTPUT: '', GITHUB_STEP_SUMMARY: '' },
    });
  return { pages, data, run };
}

for (const checkout of ['present', 'absent', 'empty']) {
  test(`full sync retires only all-yanked plugins with ${checkout} checkout`, () => {
    const { pages, data, run } = fixture({ checkout });
    const preview = run('--dry-run');
    assert.equal(preview.status, 0, preview.stderr);
    assert.match(preview.stdout, /all registry versions yanked; would remove/);
    assert.equal(readFileSync(data, 'utf8'), '[]\n');
    assert.equal(Object.values(pages).flat().every(existsSync), true);

    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /all registry versions yanked; removed/);
    assert.match(
      result.stdout,
      /shared page has no plugin in the registry index/
    );
    assert.equal(pages.retired.some(existsSync), false);
    for (const name of ['missing', 'mixed', 'gone']) {
      for (const page of pages[name])
        assert.equal(readFileSync(page, 'utf8'), 'keep existing docs\n');
    }
    assert.deepEqual(
      yaml.load(readFileSync(data, 'utf8')).map((p) => p.name),
      ['missing', 'mixed']
    );
    const repeat = run();
    assert.equal(repeat.status, 0, repeat.stderr);
    assert.match(
      repeat.stdout,
      /all registry versions yanked; no published pages to remove/
    );
    assert.equal(
      pages.retired.some(existsSync),
      false,
      'must not recreate retired pages'
    );
  });
}

test('registry failure cannot prune pages or rewrite generated data', () => {
  const { pages, data, run } = fixture({
    checkout: 'absent',
    fetchFailure: true,
  });
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /could not read the registry index/);
  assert.equal(readFileSync(data, 'utf8'), '[]\n');
  assert.equal(Object.values(pages).flat().every(existsSync), true);
});
