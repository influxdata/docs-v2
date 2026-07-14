/**
 * Tests for scripts/build-md-sitemap.js.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildMarkdownSitemap,
  extractMarkdownAlternateHref,
  loadHtmlSitemapLastmods,
} from '../build-md-sitemap.js';

function setupPublicFixture() {
  const root = mkdtempSync(join(tmpdir(), 'md-sitemap-test-'));
  mkdirSync(join(root, 'foo'), { recursive: true });
  mkdirSync(join(root, 'bar'), { recursive: true });
  mkdirSync(join(root, 'noalt'), { recursive: true });

  writeFileSync(
    join(root, 'foo/index.html'),
    `<html><head><link href="https://docs.influxdata.com/foo/index.md" type="text/markdown" rel="alternate"></head><body></body></html>`
  );
  writeFileSync(
    join(root, 'bar/index.html'),
    `<html><head><link rel="alternate" type="text/markdown" href="https://docs.influxdata.com/bar/index.md"></head><body></body></html>`
  );
  writeFileSync(
    join(root, 'noalt/index.html'),
    `<html><head><link rel="canonical" href="https://docs.influxdata.com/noalt/"></head><body></body></html>`
  );
  writeFileSync(
    join(root, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://docs.influxdata.com/foo/</loc><lastmod>2026-06-01T10:00:00-05:00</lastmod></url>
  <url><loc>https://docs.influxdata.com/bar/</loc><lastmod>2026-06-02T10:00:00-05:00</lastmod></url>
</urlset>`
  );

  return root;
}

test('extractMarkdownAlternateHref handles attribute order', () => {
  const html =
    '<link href="https://docs.influxdata.com/foo/index.md" type="text/markdown" rel="alternate">';
  assert.equal(
    extractMarkdownAlternateHref(html),
    'https://docs.influxdata.com/foo/index.md'
  );
});

test('loadHtmlSitemapLastmods maps HTML paths to lastmod values', async () => {
  const root = setupPublicFixture();
  try {
    const lastmods = await loadHtmlSitemapLastmods(root);
    assert.equal(lastmods.get('/foo/'), '2026-06-01T10:00:00-05:00');
    assert.equal(lastmods.get('/bar/'), '2026-06-02T10:00:00-05:00');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildMarkdownSitemap writes Markdown alternate URLs with lastmod', async () => {
  const root = setupPublicFixture();
  try {
    const result = await buildMarkdownSitemap(root);
    assert.equal(result.count, 2);

    const sitemap = readFileSync(join(root, 'sitemap-md.xml'), 'utf-8');
    assert.match(sitemap, /<urlset/);
    assert.match(
      sitemap,
      /<loc>https:\/\/docs\.influxdata\.com\/foo\/index\.md<\/loc>/
    );
    assert.match(
      sitemap,
      /<lastmod>2026-06-01T10:00:00-05:00<\/lastmod>/
    );
    assert.doesNotMatch(sitemap, /noalt/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildMarkdownSitemap fails when no alternate links exist', async () => {
  const root = mkdtempSync(join(tmpdir(), 'md-sitemap-empty-test-'));
  try {
    mkdirSync(join(root, 'empty'), { recursive: true });
    writeFileSync(join(root, 'empty/index.html'), '<html><head></head></html>');
    await assert.rejects(
      () => buildMarkdownSitemap(root),
      /No Markdown alternate links found/
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
