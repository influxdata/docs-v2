import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatProduct, formatVersion } from '../components/doc-search.js';

describe('formatVersion', () => {
  it('distinguishes v2 Cloud from InfluxDB 3 Cloud', () => {
    assert.equal(formatVersion('cloud', 'influxdb'), 'Cloud (TSM)');
    assert.equal(formatVersion('cloud', 'influxdb3'), 'Cloud');
  });

  it('maps InfluxDB 3 version segments to display names', () => {
    assert.equal(formatVersion('core', 'influxdb3'), 'Core');
    assert.equal(formatVersion('enterprise', 'influxdb3'), 'Enterprise');
    assert.equal(
      formatVersion('cloud-serverless', 'influxdb3'),
      'Cloud Serverless'
    );
    assert.equal(
      formatVersion('cloud-dedicated', 'influxdb3'),
      'Cloud Dedicated'
    );
    assert.equal(formatVersion('clustered', 'influxdb3'), 'Clustered');
    assert.equal(formatVersion('explorer', 'influxdb3'), 'Explorer');
    assert.equal(formatVersion('controller', 'telegraf'), 'Controller');
  });

  it('passes through numbered versions for multi-version products', () => {
    assert.equal(formatVersion('v2', 'influxdb'), 'v2');
    assert.equal(formatVersion('v1', 'influxdb'), 'v1');
  });

  it('returns an empty string for single-version products', () => {
    assert.equal(formatVersion('v1', 'telegraf'), '');
    assert.equal(formatVersion('v1', 'enterprise_influxdb'), '');
  });

  it('returns an empty string when the version segment is absent', () => {
    assert.equal(formatVersion(undefined, 'influxdb3'), '');
    assert.equal(formatVersion(null, 'influxdb3'), '');
  });
});

describe('formatProduct', () => {
  it('maps product path segments to display names', () => {
    assert.equal(formatProduct('influxdb3'), 'InfluxDB 3');
    assert.equal(formatProduct('influxdb'), 'InfluxDB');
    assert.equal(formatProduct('enterprise_influxdb'), 'InfluxDB Enterprise');
  });

  it('falls back to the raw path segment when unmapped', () => {
    assert.equal(formatProduct('not-a-product'), 'not-a-product');
  });
});
