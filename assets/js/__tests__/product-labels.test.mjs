import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import yaml from 'js-yaml';

import {
  buildProductIndex,
  formatProductLabel,
} from '../utils/product-labels.js';

// Run against the real data/products.yml so these cases also guard the data
// the browser bundle receives.
const products = yaml.load(readFileSync('data/products.yml', 'utf8'));
const index = buildProductIndex(products);

const label = (path) => formatProductLabel(path, index);

describe('formatProductLabel', () => {
  it('distinguishes v2 Cloud from InfluxDB 3 Cloud', () => {
    assert.equal(label('/influxdb/cloud/write-data/'), 'InfluxDB Cloud (TSM)');
    assert.equal(label('/influxdb3/cloud/admin/tokens/'), 'InfluxDB 3 Cloud');
  });

  it('names the distributed products without a version number', () => {
    assert.equal(
      label('/influxdb3/cloud-dedicated/admin/'),
      'InfluxDB Cloud Dedicated'
    );
    assert.equal(
      label('/influxdb3/cloud-serverless/admin/'),
      'InfluxDB Cloud Serverless'
    );
    assert.equal(label('/influxdb3/clustered/admin/'), 'InfluxDB Clustered');
  });

  it('names the monolith products with the version number', () => {
    assert.equal(label('/influxdb3/core/get-started/'), 'InfluxDB 3 Core');
    assert.equal(
      label('/influxdb3/enterprise/get-started/'),
      'InfluxDB 3 Enterprise'
    );
    assert.equal(label('/influxdb3/explorer/'), 'InfluxDB 3 Explorer');
  });

  it('matches whole segments, not string prefixes', () => {
    // 'influxdb3/cloud' is a string prefix of 'influxdb3/cloud-dedicated'.
    assert.notEqual(
      label('/influxdb3/cloud-dedicated/admin/'),
      'InfluxDB 3 Cloud'
    );
  });

  it('prefers the longest matching content path', () => {
    assert.equal(label('/telegraf/v1/plugins/'), 'Telegraf');
    assert.equal(
      label('/telegraf/controller/get-started/'),
      'Telegraf Controller'
    );
    assert.equal(label('/telegraf/enterprise/'), 'Telegraf Enterprise');
  });

  it('appends the version for products with one path per version', () => {
    assert.equal(label('/influxdb/v2/write-data/'), 'InfluxDB v2');
    assert.equal(label('/influxdb/v1/query_language/'), 'InfluxDB v1');
  });

  it('uses the products.yml name for single-version products', () => {
    assert.equal(label('/chronograf/v1/'), 'Chronograf');
    assert.equal(label('/kapacitor/v1/'), 'Kapacitor');
    assert.equal(label('/flux/v0/stdlib/'), 'Flux');
    assert.equal(label('/enterprise_influxdb/v1/'), 'InfluxDB Enterprise v1');
  });

  it('labels path segments that have no products.yml entry', () => {
    assert.equal(label('/resources/videos/'), 'Additional Resources');
    assert.equal(label('/platform/'), 'InfluxData Platform');
  });

  it('falls back to the first path segment when unmatched', () => {
    assert.equal(label('/not-a-product/page/'), 'not-a-product');
  });

  it('returns an empty string for a root path', () => {
    assert.equal(label('/'), '');
    assert.equal(label(''), '');
  });
});

describe('buildProductIndex', () => {
  it('skips products with no content_path or no name', () => {
    const built = buildProductIndex({
      no_path: { name: 'No Path', versions: ['v1'] },
      no_name: { content_path: 'no-name' },
    });
    assert.deepEqual(built, []);
  });

  it('orders entries longest content path first', () => {
    const lengths = index.map((entry) => entry.segments.length);
    assert.deepEqual(
      lengths,
      [...lengths].sort((a, b) => b - a)
    );
  });

  it('tolerates missing or empty product data', () => {
    assert.deepEqual(buildProductIndex(undefined), []);
    assert.deepEqual(buildProductIndex({}), []);
    assert.equal(formatProductLabel('/influxdb3/core/', []), 'influxdb3');
  });
});
