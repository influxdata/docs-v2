import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  processPlugin,
  selectPlugins,
  shouldRunDiscovery,
  mappingForDiscoveredPlugin,
  partitionPluginsByReadme,
  prunePlugin,
} from '../port_to_docs.js';

const CONFIG_PLUGINS = {
  notifier: { source: 'a', target: 'b' },
  downsampler: { source: 'c', target: 'd' },
  state_change: { source: 'e', target: 'f' },
};

test('selects every plugin when the run is for all of them', () => {
  for (const arg of [null, undefined, 'all', '  all  ']) {
    const { selected, unknown } = selectPlugins(CONFIG_PLUGINS, arg);

    assert.deepEqual(
      selected.map(([name]) => name),
      ['notifier', 'downsampler', 'state_change']
    );
    assert.deepEqual(unknown, []);
  }
});

test('selects a comma-separated list in one run, so one report covers it', () => {
  const { selected, unknown } = selectPlugins(
    CONFIG_PLUGINS,
    'notifier, state_change'
  );

  assert.deepEqual(
    selected.map(([name]) => name),
    ['notifier', 'state_change']
  );
  assert.deepEqual(unknown, []);
});

test('reports unknown plugin names rather than silently syncing nothing', () => {
  const { selected, unknown } = selectPlugins(
    CONFIG_PLUGINS,
    'notifier,nope,also_nope'
  );

  assert.deepEqual(
    selected.map(([name]) => name),
    ['notifier']
  );
  assert.deepEqual(unknown, ['nope', 'also_nope']);
});

test('runs discovery for a full sync, however the run asks for one', () => {
  // The workflow always passes --plugin, defaulting to "all". If "all" did not
  // run discovery, a scheduled sync would publish no data file and no stubs.
  for (const arg of [null, undefined, '', 'all']) {
    assert.equal(shouldRunDiscovery(arg), true);
  }
});

test('skips discovery when the run names specific plugins', () => {
  assert.equal(shouldRunDiscovery('notifier'), false);
  assert.equal(shouldRunDiscovery('notifier,state_change'), false);
});

test('derives conventional README and shared-page paths for a new plugin', () => {
  const mapping = mappingForDiscoveredPlugin(
    { name: 'nws_weather', slug: 'nws-weather' },
    CONFIG_PLUGINS
  );

  assert.deepEqual(mapping, {
    source: '../../../.ext/influxdb3_plugins/influxdata/nws_weather/README.md',
    target:
      '../../content/shared/influxdb3-plugins/plugins-library/official/nws-weather.md',
  });
});

test('uses an explicit mapping when a plugin needs nonstandard paths', () => {
  const customMapping = { source: 'custom-readme', target: 'custom-page' };
  const mapping = mappingForDiscoveredPlugin(
    { name: 'notifier', slug: 'notifier' },
    { notifier: customMapping }
  );

  assert.equal(mapping, customMapping);
});

test('separates missing plugin READMEs when the upstream checkout exists', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'plugin-sources-'));
  const present = join(dir, 'present.md');
  writeFileSync(present, README, 'utf8');
  const plugins = [{ name: 'present' }, { name: 'missing' }];
  const mappings = {
    present: { source: present },
    missing: { source: join(dir, 'missing.md') },
  };

  assert.deepEqual(await partitionPluginsByReadme(plugins, mappings, dir), {
    available: [plugins[0]],
    missing: [plugins[1]],
  });
  assert.equal(
    await partitionPluginsByReadme(plugins, mappings, join(dir, 'absent')),
    null,
    'an absent checkout must not classify every plugin as missing'
  );
  const emptyCheckout = join(dir, 'empty-checkout');
  mkdirSync(emptyCheckout);
  assert.equal(
    await partitionPluginsByReadme([plugins[1]], mappings, emptyCheckout),
    null,
    'an incomplete checkout must not trigger mass pruning'
  );
});

test("prunes only a missing plugin's known pages and previews a dry run", async () => {
  const dir = mkdtempSync(join(tmpdir(), 'plugin-prune-'));
  const paths = ['shared.md', 'core.md', 'enterprise.md'].map((name) =>
    join(dir, name)
  );
  for (const file of paths) writeFileSync(file, 'old docs', 'utf8');
  const unrelated = join(dir, 'another-plugin.md');
  writeFileSync(unrelated, 'keep', 'utf8');

  const preview = await prunePlugin('nori_regression', paths, true);
  assert.equal(preview.status, 'pruned');
  assert.match(preview.detail, /would remove/);
  assert.equal(paths.every(existsSync), true);

  const result = await prunePlugin('nori_regression', paths);
  assert.equal(result.status, 'pruned');
  assert.equal(paths.some(existsSync), false);
  assert.equal(readFileSync(unrelated, 'utf8'), 'keep');
});

test('ignores empty entries from a trailing or doubled comma', () => {
  const { selected, unknown } = selectPlugins(CONFIG_PLUGINS, 'notifier,,');

  assert.deepEqual(
    selected.map(([name]) => name),
    ['notifier']
  );
  assert.deepEqual(unknown, []);
});

/**
 * A source README and a target path inside a throwaway directory. The sync is
 * a file-merging tool, so its results are only meaningful against real files.
 */
function fixture(readme) {
  const dir = mkdtempSync(join(tmpdir(), 'plugin-sync-'));
  const source = join(dir, 'README.md');
  if (readme !== null) writeFileSync(source, readme, 'utf8');
  return { source, target: join(dir, 'out', 'notifier.md') };
}

const README = `# Notifier

Sends notifications when a check fires.

## Questions/Comments

Open an issue.
`;

test('a missing source README is skipped, not an error', async () => {
  const { source, target } = fixture(null);

  const result = await processPlugin('notifier', { source, target });

  assert.equal(result.status, 'skipped');
  assert.equal(result.plugin, 'notifier');
  assert.match(result.detail, /source/i);
  assert.equal(existsSync(target), false, 'must not create a target');
});

test('a first write reports the page as updated', async () => {
  const { source, target } = fixture(README);

  const result = await processPlugin('notifier', { source, target });

  assert.equal(result.status, 'updated');
  assert.match(readFileSync(target, 'utf8'), /BEGIN GENERATED PLUGIN CONTENT/);
});

test('re-running against an unchanged README reports unchanged', async () => {
  const { source, target } = fixture(README);

  await processPlugin('notifier', { source, target });
  const result = await processPlugin('notifier', { source, target });

  assert.equal(result.status, 'unchanged');
});

test('an edited README reports the page as updated again', async () => {
  const { source, target } = fixture(README);
  await processPlugin('notifier', { source, target });
  writeFileSync(source, README.replace('Sends', 'Dispatches'), 'utf8');

  const result = await processPlugin('notifier', { source, target });

  assert.equal(result.status, 'updated');
  assert.match(readFileSync(target, 'utf8'), /Dispatches/);
});

test('a malformed generated region is an error and leaves the page alone', async () => {
  const { source, target } = fixture(README);
  await processPlugin('notifier', { source, target });
  const mangled = readFileSync(target, 'utf8').replace(
    '<!-- END GENERATED PLUGIN CONTENT -->',
    ''
  );
  writeFileSync(target, mangled, 'utf8');

  const result = await processPlugin('notifier', { source, target });

  assert.equal(result.status, 'error');
  assert.match(result.detail, /marker/i);
  assert.equal(readFileSync(target, 'utf8'), mangled, 'must not overwrite');
});

test('a dry run reports the outcome without writing', async () => {
  const { source, target } = fixture(README);

  const result = await processPlugin('notifier', { source, target }, true);

  assert.equal(result.status, 'updated');
  assert.equal(existsSync(target), false, 'dry run must not write');
});
