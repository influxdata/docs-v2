import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderStub, stubPath, scaffoldStub } from '../stub-template.js';

const BASIC_TRANSFORMATION = {
  name: 'basic_transformation',
  slug: 'basic-transformation',
  stubSlug: 'basic-transformation',
  description:
    'Provides common data transformation functions for modifying and enriching time series data.',
  repository:
    'https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation',
};

test('renders a core stub matching the hand-authored convention', () => {
  const content = renderStub(BASIC_TRANSFORMATION, 'core');

  assert.equal(
    content,
    `---
title: Basic transformation plugin
description: Provides common data transformation functions for modifying and enriching time series data.
menu:
  influxdb3_core:
    name: Basic transformation
    parent: Official plugins
weight: 100
influxdb3/core/tags: [plugins, processing engine, python, official]
related:
  - https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation, Basic transformation plugin on GitHub
source: /shared/influxdb3-plugins/plugins-library/official/basic-transformation.md
canonical: self
---

<!-- //SOURCE - content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md -->
`
  );
});

test('renders an enterprise stub with the enterprise menu key and tag prefix', () => {
  const content = renderStub(BASIC_TRANSFORMATION, 'enterprise');

  assert.equal(
    content,
    `---
title: Basic transformation plugin
description: Provides common data transformation functions for modifying and enriching time series data.
menu:
  influxdb3_enterprise:
    name: Basic transformation
    parent: Official plugins
weight: 100
influxdb3/enterprise/tags: [plugins, processing engine, python, official]
related:
  - https://github.com/influxdata/influxdb3_plugins/tree/main/influxdata/basic_transformation, Basic transformation plugin on GitHub
source: /shared/influxdb3-plugins/plugins-library/official/basic-transformation.md
canonical: self
---

<!-- //SOURCE - content/shared/influxdb3-plugins/plugins-library/official/basic-transformation.md -->
`
  );
});

test('preserves known initialisms in generated titles and menu labels', () => {
  const content = renderStub(
    {
      ...BASIC_TRANSFORMATION,
      name: 'nws_weather',
      slug: 'nws-weather',
      stubSlug: 'nws-weather',
    },
    'enterprise'
  );

  assert.match(content, /^title: NWS weather plugin$/m);
  assert.match(content, /^    name: NWS weather$/m);
  assert.match(content, /NWS weather plugin on GitHub/);
});

test('does not repeat plugin in titles that already include it', () => {
  const content = renderStub(
    { ...BASIC_TRANSFORMATION, name: 'stock_plugin' },
    'core'
  );

  assert.match(content, /^title: Stock plugin$/m);
  assert.match(content, /Stock plugin on GitHub/);
  assert.doesNotMatch(content, /plugin plugin/);
});

const MAD_CHECK = {
  name: 'mad_check',
  slug: 'mad-check',
  stubSlug: 'mad-anomaly-detection',
  description: 'desc',
  repository: 'https://example.test/repo',
};

test('stubPath keys the filename off stubSlug, since that is the real page URL', () => {
  assert.equal(
    stubPath(MAD_CHECK, 'core'),
    '../../content/influxdb3/core/plugins/library/official/mad-anomaly-detection.md'
  );
});

test('scaffoldStub renders new content for a plugin with no stub yet', () => {
  const result = scaffoldStub(BASIC_TRANSFORMATION, 'core', { exists: false });

  assert.equal(
    result.path,
    '../../content/influxdb3/core/plugins/library/official/basic-transformation.md'
  );
  assert.equal(result.skipped, undefined);
  assert.match(result.content, /^title: Basic transformation plugin$/m);
});

test('scaffoldStub skips a plugin that already has a stub, never rewriting it', () => {
  const result = scaffoldStub(BASIC_TRANSFORMATION, 'core', { exists: true });

  assert.equal(result.skipped, true);
  assert.equal(result.content, undefined);
});
