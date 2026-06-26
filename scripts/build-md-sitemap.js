#!/usr/bin/env node
/**
 * Build sitemap-md.xml from rendered HTML Markdown alternate links.
 *
 * Hugo already decides which pages are eligible for Markdown twins when it
 * emits <link rel="alternate" type="text/markdown"> in each page head. This
 * script uses that rendered HTML as the source of truth so CI does not depend
 * on Hugo rendering a custom home output for sitemap-md.xml.
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import { FALLBACK_ORIGIN } from './lib/provenance.js';

const LINK_TAG_RE = /<link\b[^>]*>/gi;
const ATTR_RE =
  /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

export function parsePublicDir(args = process.argv.slice(2)) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--public-dir' && args[i + 1]) {
      return path.resolve(process.cwd(), args[i + 1]);
    }
  }
  return path.resolve(process.cwd(), 'public');
}

function parseAttributes(tag) {
  const attrs = {};
  for (const match of tag.matchAll(ATTR_RE)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attrs;
}

export function extractMarkdownAlternateHref(html) {
  for (const tag of html.matchAll(LINK_TAG_RE)) {
    const attrs = parseAttributes(tag[0]);
    const rels = (attrs.rel || '').toLowerCase().split(/\s+/);
    if (
      rels.includes('alternate') &&
      (attrs.type || '').toLowerCase() === 'text/markdown'
    ) {
      return attrs.href || null;
    }
  }
  return null;
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function markdownPathToHtmlPath(pathname) {
  return pathname.replace(/\/index\.md$/, '/');
}

export async function loadHtmlSitemapLastmods(publicRoot) {
  const sitemapPath = path.join(publicRoot, 'sitemap.xml');
  const lastmods = new Map();
  let xml;
  try {
    xml = await fs.readFile(sitemapPath, 'utf-8');
  } catch {
    return lastmods;
  }

  const urlRe = /<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g;
  for (const match of xml.matchAll(urlRe)) {
    let pathname;
    try {
      pathname = new URL(match[1]).pathname;
    } catch {
      continue;
    }
    const lastmod = match[2].match(/<lastmod>([^<]+)<\/lastmod>/);
    if (lastmod) lastmods.set(pathname, lastmod[1]);
  }
  return lastmods;
}

async function detectOrigin(publicRoot, hrefs) {
  for (const href of hrefs) {
    try {
      const url = new URL(href);
      return url.origin;
    } catch {
      /* try the HTML sitemap next */
    }
  }

  try {
    const xml = await fs.readFile(path.join(publicRoot, 'sitemap.xml'), 'utf-8');
    const match = xml.match(/<loc>([^<]+)<\/loc>/);
    if (match) return new URL(match[1]).origin;
  } catch {
    /* fall through */
  }

  return FALLBACK_ORIGIN;
}

export async function collectMarkdownAlternates(publicRoot) {
  const htmlFiles = await glob(path.join(publicRoot, '**', 'index.html'), {
    nodir: true,
  });
  const hrefs = [];

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf-8');
    const href = extractMarkdownAlternateHref(html);
    if (href) hrefs.push(href);
  }

  return hrefs;
}

export async function buildMarkdownSitemap(publicRoot = parsePublicDir()) {
  const hrefs = await collectMarkdownAlternates(publicRoot);
  if (hrefs.length === 0) {
    throw new Error(
      `No Markdown alternate links found under ${publicRoot}; refusing to write sitemap-md.xml`
    );
  }

  const origin = await detectOrigin(publicRoot, hrefs);
  const lastmods = await loadHtmlSitemapLastmods(publicRoot);
  const urls = new Map();

  for (const href of hrefs) {
    let url;
    try {
      url = new URL(href, origin);
    } catch {
      continue;
    }
    const loc = url.href;
    const htmlPath = markdownPathToHtmlPath(url.pathname);
    urls.set(loc, lastmods.get(htmlPath) || null);
  }

  const entries = [...urls.entries()].sort(([a], [b]) => a.localeCompare(b));
  const body = entries
    .map(([loc, lastmod]) => {
      const lines = ['  <url>', `    <loc>${escapeXml(loc)}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
      lines.push('  </url>');
      return lines.join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n');

  const outPath = path.join(publicRoot, 'sitemap-md.xml');
  await fs.writeFile(outPath, xml, 'utf-8');
  return { count: entries.length, outPath };
}

async function main() {
  const publicRoot = parsePublicDir();
  const result = await buildMarkdownSitemap(publicRoot);
  console.log(`Built sitemap-md.xml with ${result.count} Markdown URLs`);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
