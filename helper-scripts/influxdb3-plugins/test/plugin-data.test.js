import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapEntry } from '../plugin-data.js';

test('maps registry trigger identifiers to documentation vocabulary', () => {
  const plugin = {
    name: 'basic_transformation',
    slug: 'basic-transformation',
    stubSlug: 'basic-transformation',
    version: '1.2.0',
    description: 'Transforms data.',
    triggers: ['process_scheduled_call', 'process_writes', 'process_request'],
    repository:
      'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation',
    documentation:
      'https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/basic_transformation/README.md',
    dependencies: { database_version: '>=3.8.0', python: [] },
  };

  const entry = mapEntry(plugin);

  assert.deepEqual(entry.tags, ['scheduled', 'data-write', 'HTTP request']);
});

test('maps identity, description, and version fields', () => {
  const plugin = {
    name: 'basic_transformation',
    slug: 'basic-transformation',
    stubSlug: 'basic-transformation',
    version: '1.2.0',
    description: 'Transforms data.',
    triggers: ['process_writes'],
    repository:
      'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation',
    documentation:
      'https://github.com/influxdata/influxdb3_plugins/blob/main/influxdata/basic_transformation/README.md',
    dependencies: { database_version: '>=3.8.0', python: [] },
  };

  const entry = mapEntry(plugin);

  assert.equal(entry.name, 'basic_transformation');
  assert.equal(entry.id, 'basic-transformation');
  assert.equal(entry.description, 'Transforms data.');
  assert.equal(entry.introduced, 'v1.2.0');
  assert.equal(entry.database_version, '>=3.8.0');
  assert.equal(
    entry.repository,
    'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation'
  );
});

test("uses the stub slug for id, since that is the plugin's actual page URL", () => {
  const plugin = {
    name: 'mad_check',
    slug: 'mad-check',
    stubSlug: 'mad-anomaly-detection',
    version: '1.0.0',
    description: 'desc',
    triggers: ['process_scheduled_call'],
    repository: 'https://example.test/repo',
    documentation: 'https://example.test/docs',
    dependencies: { database_version: '>=3.0.0', python: [] },
  };

  const entry = mapEntry(plugin);

  assert.equal(entry.id, 'mad-anomaly-detection');
});
