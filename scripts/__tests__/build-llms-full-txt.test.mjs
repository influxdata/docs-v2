/**
 * Tests for scripts/build-llms-full-txt.js.
 *
 * Run with: node --test scripts/__tests__/build-llms-full-txt.test.mjs
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  parseFrontmatter,
  loadEligibleUrls,
  buildProduct,
} from '../build-llms-full-txt.js';

function setupFixture() {
  const root = mkdtempSync(join(tmpdir(), 'llms-full-test-'));
  const productPath = 'foo/v1';
  const productRoot = join(root, productPath);

  // Three pages: alpha, beta, gamma. Their .md files exist on disk;
  // sitemap-md.xml lists only alpha and gamma (beta should be excluded).
  mkdirSync(join(productRoot, 'alpha'), { recursive: true });
  mkdirSync(join(productRoot, 'beta'), { recursive: true });
  mkdirSync(join(productRoot, 'gamma'), { recursive: true });
  mkdirSync(join(productRoot), { recursive: true });

  writeFileSync(
    join(productRoot, 'alpha/index.md'),
    `---\ntitle: Alpha Page\n---\n\nAlpha body.\n`
  );
  writeFileSync(
    join(productRoot, 'beta/index.md'),
    `---\ntitle: Beta Page (should be excluded)\n---\n\nBeta body.\n`
  );
  writeFileSync(
    join(productRoot, 'gamma/index.md'),
    `---\ntitle: Gamma Page\n---\n\nGamma body.\n`
  );

  // Sitemap lists alpha and gamma only — beta omitted (simulates noindex
  // or feature-board exclusion).
  writeFileSync(
    join(root, 'sitemap-md.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://docs.influxdata.com/foo/v1/alpha/index.md</loc></url>
  <url><loc>https://docs.influxdata.com/foo/v1/gamma/index.md</loc></url>
</urlset>`
  );

  return { root, productPath };
}

test('parseFrontmatter returns null on file without frontmatter', () => {
  assert.equal(parseFrontmatter('no frontmatter here'), null);
});

test('parseFrontmatter parses YAML and returns body', () => {
  const result = parseFrontmatter(`---\ntitle: Test\nfoo: bar\n---\n\nBody text.\n`);
  assert.equal(result.frontmatter.title, 'Test');
  assert.equal(result.frontmatter.foo, 'bar');
  assert.equal(result.body.trim(), 'Body text.');
});

test('loadEligibleUrls returns urls Set and origin from sitemap-md.xml', async () => {
  const { root } = setupFixture();
  try {
    const result = await loadEligibleUrls(root);
    assert.ok(result.urls.has('/foo/v1/alpha/index.md'));
    assert.ok(result.urls.has('/foo/v1/gamma/index.md'));
    assert.ok(!result.urls.has('/foo/v1/beta/index.md'));
    assert.equal(result.urls.size, 2);
    assert.equal(result.origin, 'https://docs.influxdata.com');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('loadEligibleUrls picks up staging origin when sitemap uses staging URLs', async () => {
  const { root } = setupFixture();
  try {
    // Overwrite the sitemap with staging-style URLs
    writeFileSync(
      join(root, 'sitemap-md.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://test2.docs.influxdata.com/foo/v1/alpha/index.md</loc></url>
  <url><loc>https://test2.docs.influxdata.com/foo/v1/gamma/index.md</loc></url>
</urlset>`
    );
    const result = await loadEligibleUrls(root);
    assert.equal(result.origin, 'https://test2.docs.influxdata.com');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildProduct excludes pages not in sitemap-md.xml', async () => {
  const { root, productPath } = setupFixture();
  try {
    const eligible = await loadEligibleUrls(root);
    const result = await buildProduct(
      { path: productPath, name: 'Foo v1' },
      eligible,
      root
    );

    assert.equal(result.pageCount, 2, 'beta page should be excluded');
    assert.equal(result.product, 'Foo v1');
    assert.ok(result.bytes > 0);

    const corpus = readFileSync(join(root, productPath, 'llms-full.txt'), 'utf-8');
    assert.match(corpus, /^# Foo v1 — full Markdown corpus/);
    assert.match(corpus, /> Generated \d{4}-\d{2}-\d{2}T/);
    assert.match(corpus, /> See https:\/\/docs\.influxdata\.com\/llms\.txt/);
    assert.match(corpus, /# Alpha Page/);
    assert.match(corpus, /# Gamma Page/);
    assert.doesNotMatch(corpus, /Beta Page/);
    assert.match(corpus, /Source: https:\/\/docs\.influxdata\.com\/foo\/v1\/alpha\//);
    assert.match(corpus, /^---$/m); // separator
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildProduct uses staging origin from sitemap when present', async () => {
  const { root, productPath } = setupFixture();
  try {
    // Overwrite the sitemap with staging-style URLs
    writeFileSync(
      join(root, 'sitemap-md.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://test2.docs.influxdata.com/foo/v1/alpha/index.md</loc></url>
  <url><loc>https://test2.docs.influxdata.com/foo/v1/gamma/index.md</loc></url>
</urlset>`
    );
    const eligible = await loadEligibleUrls(root);
    await buildProduct({ path: productPath, name: 'Foo v1' }, eligible, root);

    const corpus = readFileSync(join(root, productPath, 'llms-full.txt'), 'utf-8');
    assert.match(corpus, /> Generated \d{4}-\d{2}-\d{2}T[^\n]*test2\.docs\.influxdata\.com/);
    assert.match(corpus, /Source: https:\/\/test2\.docs\.influxdata\.com\/foo\/v1\/alpha\//);
    assert.doesNotMatch(corpus, /https:\/\/docs\.influxdata\.com/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildProduct sorts pages by URL path', async () => {
  const { root, productPath } = setupFixture();
  try {
    const eligible = await loadEligibleUrls(root);
    await buildProduct(
      { path: productPath, name: 'Foo v1' },
      eligible,
      root
    );

    const corpus = readFileSync(join(root, productPath, 'llms-full.txt'), 'utf-8');
    const alphaIdx = corpus.indexOf('Alpha Page');
    const gammaIdx = corpus.indexOf('Gamma Page');
    assert.ok(alphaIdx > 0);
    assert.ok(gammaIdx > 0);
    assert.ok(alphaIdx < gammaIdx, 'alpha (a) should appear before gamma (g)');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
