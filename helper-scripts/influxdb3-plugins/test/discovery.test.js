import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRegistryIndex, partitionDiscoveredPlugins } from '../discovery.js';

test('dedupes repeated plugin names, keeping the latest published_at', () => {
  const indexJson = {
    index_schema_version: '2.1',
    artifacts_url: 'https://example.test/artifacts',
    plugins: [
      {
        name: 'amqp_subscriber',
        version: '0.1.0',
        published_at: '2026-06-03T20:14:58Z',
        description: 'old description',
        triggers: ['process_scheduled_call'],
        repository:
          'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/amqp_subscriber',
        documentation:
          'https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/amqp_subscriber/README.md',
        dependencies: { database_version: '>=3.8.0', python: ['pika'] },
      },
      {
        name: 'amqp_subscriber',
        version: '0.2.0',
        published_at: '2026-06-11T15:50:40Z',
        description: 'new description',
        triggers: ['process_scheduled_call'],
        repository:
          'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/amqp_subscriber',
        documentation:
          'https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/amqp_subscriber/README.md',
        dependencies: {
          database_version: '>=3.8.2',
          python: ['pika', 'jsonpath-ng'],
        },
      },
    ],
  };

  const { plugins } = parseRegistryIndex(indexJson, { overrides: {}, exclude: [] });

  assert.equal(plugins.length, 1);
  assert.equal(plugins[0].version, '0.2.0');
  assert.equal(plugins[0].description, 'new description');
});

test('derives a slug from the plugin name by replacing underscores with hyphens', () => {
  const indexJson = {
    index_schema_version: '2.1',
    artifacts_url: 'https://example.test/artifacts',
    plugins: [
      {
        name: 'basic_transformation',
        version: '1.0.0',
        published_at: '2026-01-01T00:00:00Z',
        description: 'desc',
        triggers: ['process_writes'],
        repository: 'https://example.test/repo',
        documentation: 'https://example.test/docs',
        dependencies: { database_version: '>=3.0.0', python: [] },
      },
    ],
  };

  const { plugins } = parseRegistryIndex(indexJson, { overrides: {}, exclude: [] });

  assert.equal(plugins[0].slug, 'basic-transformation');
  assert.equal(plugins[0].stubSlug, 'basic-transformation');
});

test('applies a stub_slug override without changing the shared-page slug', () => {
  const indexJson = {
    index_schema_version: '2.1',
    artifacts_url: 'https://example.test/artifacts',
    plugins: [
      {
        name: 'mad_check',
        version: '1.0.0',
        published_at: '2026-01-01T00:00:00Z',
        description: 'desc',
        triggers: ['process_scheduled_call'],
        repository: 'https://example.test/repo',
        documentation: 'https://example.test/docs',
        dependencies: { database_version: '>=3.0.0', python: [] },
      },
    ],
  };
  const mappingConfig = {
    overrides: { mad_check: { stub_slug: 'mad-anomaly-detection' } },
    exclude: [],
  };

  const { plugins } = parseRegistryIndex(indexJson, mappingConfig);

  assert.equal(plugins[0].slug, 'mad-check');
  assert.equal(plugins[0].stubSlug, 'mad-anomaly-detection');
});

test('drops an excluded plugin from the result and reports it as excluded', () => {
  const indexJson = {
    index_schema_version: '2.1',
    artifacts_url: 'https://example.test/artifacts',
    plugins: [
      {
        name: 'basic_transformation',
        version: '1.0.0',
        published_at: '2026-01-01T00:00:00Z',
        description: 'desc',
        triggers: ['process_writes'],
        repository: 'https://example.test/repo',
        documentation: 'https://example.test/docs',
        dependencies: { database_version: '>=3.0.0', python: [] },
      },
      {
        name: 'stock_plugin',
        version: '1.0.0',
        published_at: '2026-01-01T00:00:00Z',
        description: 'desc',
        triggers: ['process_scheduled_call'],
        repository: 'https://example.test/repo',
        documentation: 'https://example.test/docs',
        dependencies: { database_version: '>=3.0.0', python: [] },
      },
    ],
  };
  const mappingConfig = { overrides: {}, exclude: ['stock_plugin'] };

  const { plugins, excluded } = parseRegistryIndex(indexJson, mappingConfig);

  assert.deepEqual(
    plugins.map((p) => p.name),
    ['basic_transformation']
  );
  assert.deepEqual(excluded, ['stock_plugin']);
});

test('partitions discovered plugins by whether docs_mapping.yaml already maps them', () => {
  const discovered = [{ name: 'basic_transformation' }, { name: 'stock_plugin' }];

  const { mapped, unmapped } = partitionDiscoveredPlugins(discovered, [
    'basic_transformation',
  ]);

  assert.deepEqual(mapped.map((p) => p.name), ['basic_transformation']);
  assert.deepEqual(unmapped.map((p) => p.name), ['stock_plugin']);
});
