#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const [directory, baseUrl, mode] = process.argv.slice(2);
if (!directory || !baseUrl || (mode && mode !== '--rewrite')) {
  console.error(
    'Usage: node .ci/scripts/check-preview-links.mjs <public-directory> <preview-base-url> [--rewrite]'
  );
  process.exit(1);
}

const base = new URL(baseUrl);
if (base.pathname === '/' || !base.pathname.endsWith('/')) {
  console.error(
    'The preview base URL must include a subpath and trailing slash.'
  );
  process.exit(1);
}

let pages = 0;
let links = 0;
let rewritten = 0;
const errors = [];

function scan(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) {
      scan(file);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const pagePath = relative(directory, file).split(sep).join('/');
    const pageUrl = new URL(pagePath.replace(/index\.html$/, ''), base);
    let source = readFileSync(file, 'utf8');
    if (mode === '--rewrite') {
      // Skip comments and scripts so code examples and client-side strings
      // remain unchanged. Rewrite only root-relative anchor destinations;
      // Hugo-generated permalinks already include the preview path.
      const original = source;
      source = source.replace(
        /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<a\b[^>]*>/gi,
        (tag) => {
          if (!/^<a\b/i.test(tag)) return tag;
          return tag.replace(
            /((?:^|\s)href\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
            (attribute, prefix, doubleQuoted, singleQuoted, unquoted) => {
              const value = doubleQuoted ?? singleQuoted ?? unquoted;
              if (!value.startsWith('/') || value.startsWith('//'))
                return attribute;
              if (new URL(value, base).pathname.startsWith(base.pathname))
                return attribute;
              const quote =
                doubleQuoted !== undefined
                  ? '"'
                  : singleQuoted !== undefined
                    ? "'"
                    : '';
              rewritten++;
              return `${prefix}${quote}${base.pathname.slice(0, -1)}${value}${quote}`;
            }
          );
        }
      );
      if (source !== original) writeFileSync(file, source);
    }
    const html = source
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
    for (const [, tag] of html.matchAll(/<a\b([^>]*)>/gi)) {
      const href = tag.match(
        /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
      );
      if (!href) continue;
      const value = href[1] ?? href[2] ?? href[3];
      const url = new URL(value.replaceAll('&amp;', '&'), pageUrl);
      if (url.origin !== base.origin) continue;
      links++;
      if (!url.pathname.startsWith(base.pathname)) {
        errors.push(`${pagePath}: ${value}`);
      }
    }
  }
}

scan(directory);
if (errors.length || !pages || !links) {
  console.error(
    `Preview link check failed: ${errors.length} links escape ${base.pathname}.\n` +
      errors.slice(0, 20).join('\n')
  );
  if (!pages || !links) console.error('No HTML pages or internal links found.');
  process.exit(1);
}

console.log(
  `Rewrote ${rewritten} links. Verified ${links} internal links across ${pages} HTML pages stay within ${base.pathname}.`
);
