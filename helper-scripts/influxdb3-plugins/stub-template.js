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
const INITIALISMS = new Map([['nws', 'NWS']]);

function sentenceCase(name) {
  return name
    .split('_')
    .map(
      (word, index) =>
        INITIALISMS.get(word.toLowerCase()) ??
        (index === 0 ? word[0].toUpperCase() + word.slice(1) : word)
    )
    .join(' ');
}

export function stubPath(plugin, product) {
  return `../../content/influxdb3/${product}/plugins/library/official/${plugin.stubSlug}.md`;
}

export function renderStub(plugin, product) {
  const { menuKey, tagPrefix } = PRODUCTS[product];
  const label = sentenceCase(plugin.name);
  const title = label.endsWith(' plugin') ? label : `${label} plugin`;

  return `---
title: ${title}
description: ${plugin.description}
menu:
  ${menuKey}:
    name: ${label}
    parent: Official plugins
weight: 100
${tagPrefix}/tags: [${BASE_TAGS.join(', ')}]
related:
  - ${plugin.repository}, ${title} on GitHub
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
