#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const [htmlPath] = process.argv.slice(2);

if (!htmlPath) {
  console.error(
    'Usage: node .ci/scripts/check-product-selector-links.mjs <index.html>'
  );
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');
const selectorLinks = new Map();
const homeLinks = new Map();

function attributes(source) {
  return Object.fromEntries(
    [
      ...source.matchAll(
        /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
      ),
    ].map(([, name, doubleQuoted, singleQuoted, unquoted]) => [
      name.toLowerCase(),
      doubleQuoted ?? singleQuoted ?? unquoted ?? '',
    ])
  );
}

for (const match of html.matchAll(/<a\b([^>]*)>/gi)) {
  const [, attributeSource] = match;
  const attrs = attributes(attributeSource);
  if (
    attrs.href &&
    attrs['data-product-path'] &&
    attrs['data-product-link-scope']
  ) {
    const scope = attrs['data-product-link-scope'];
    if (scope !== 'selector' && scope !== 'homepage') {
      console.error(
        `Unsupported data-product-link-scope ${JSON.stringify(scope)}.`
      );
      process.exit(1);
    }
    const links = scope === 'selector' ? selectorLinks : homeLinks;
    const productPath = attrs['data-product-path'];
    if (links.has(productPath)) {
      console.error(`Duplicate product link for ${productPath}.`);
      process.exit(1);
    }
    links.set(productPath, attrs.href);
  }
}

const errors = [];
if (homeLinks.size === 0 || selectorLinks.size === 0) {
  errors.push('Could not find the homepage or product-selector product links.');
}
for (const [productPath, homeLink] of homeLinks) {
  const selectorLink = selectorLinks.get(productPath);
  if (!selectorLink) {
    errors.push(
      `Homepage product ${productPath} is missing from the product selector.`
    );
  } else if (homeLink !== selectorLink) {
    errors.push(
      `${productPath}: homepage uses ${homeLink}, product selector uses ${selectorLink}.`
    );
  }
}

if (errors.length) {
  console.error(
    `Homepage/product-selector link mismatch:\n${errors.join('\n')}`
  );
  process.exit(1);
}

console.log(
  `Verified ${homeLinks.size} homepage product links match product-selector links.`
);
