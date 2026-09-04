/**
 * Scaffold a per-product stub for an official plugin that has none yet.
 */

const PRODUCTS = {
  core: { menuKey: 'influxdb3_core', tagPrefix: 'influxdb3/core' },
  enterprise: {
    menuKey: 'influxdb3_enterprise',
    tagPrefix: 'influxdb3/enterprise',
  },
};

const BASE_TAGS = ['plugins', 'processing engine', 'python', 'official'];

function sentenceCase(name) {
  const words = name.split('_').join(' ');
  return words[0].toUpperCase() + words.slice(1);
}

export function stubPath(plugin, product) {
  return `../../content/influxdb3/${product}/plugins/library/official/${plugin.stubSlug}.md`;
}

export function renderStub(plugin, product) {
  const { menuKey, tagPrefix } = PRODUCTS[product];
  const label = sentenceCase(plugin.name);

  return `---
title: ${label} plugin
description: ${plugin.description}
menu:
  ${menuKey}:
    name: ${label}
    parent: Official plugins
weight: 100
${tagPrefix}/tags: [${BASE_TAGS.join(', ')}]
related:
  - ${plugin.repository}, ${label} plugin on GitHub
source: /shared/influxdb3-plugins/plugins-library/official/${plugin.slug}.md
canonical: self
---

<!-- //SOURCE - content/shared/influxdb3-plugins/plugins-library/official/${plugin.slug}.md -->
`;
}

/**
 * Scaffold a stub, never rewriting one that already exists.
 */
export function scaffoldStub(plugin, product, { exists }) {
  const path = stubPath(plugin, product);
  if (exists) {
    return { path, skipped: true };
  }
  return { path, content: renderStub(plugin, product) };
}
