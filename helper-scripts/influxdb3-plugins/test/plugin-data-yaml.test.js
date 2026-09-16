import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPluginDataYaml } from '../plugin-data.js';

test('sorts entries by name regardless of input order', () => {
  const entries = [
    { name: 'stock_plugin', id: 'stock-plugin', description: 'b', tags: [] },
    {
      name: 'amqp_subscriber',
      id: 'amqp-subscriber',
      description: 'a',
      tags: [],
    },
  ];

  const yaml = renderPluginDataYaml(entries);

  assert.ok(yaml.indexOf('amqp_subscriber') < yaml.indexOf('stock_plugin'));
});

test('produces byte-identical output across repeated runs over the same input', () => {
  const entries = [
    { name: 'stock_plugin', id: 'stock-plugin', description: 'b', tags: [] },
    {
      name: 'amqp_subscriber',
      id: 'amqp-subscriber',
      description: 'a',
      tags: [],
    },
  ];

  const first = renderPluginDataYaml(entries);
  const second = renderPluginDataYaml([...entries].reverse());

  assert.equal(first, second);
});
