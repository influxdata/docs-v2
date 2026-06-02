/**
 * Tests for scripts/lib/provenance.js.
 * Run with: node --test scripts/__tests__/provenance.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  loadOrgIdentity,
  readSitemapOrigin,
  injectPageProvenance,
} from '../lib/provenance.js';

test('loadOrgIdentity reads name, url, and sameAs from data file', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    const file = join(dir, 'influxdata.yml');
    writeFileSync(
      file,
      'organization:\n  name: InfluxData\n  url: https://www.influxdata.com\n  sameAs:\n    - https://github.com/influxdata\n    - https://hub.docker.com/u/influxdata\n'
    );
    const org = await loadOrgIdentity(file);
    assert.equal(org.name, 'InfluxData');
    assert.equal(org.url, 'https://www.influxdata.com');
    assert.equal(org.sameAs.length, 2);
    assert.ok(org.sameAs.includes('https://github.com/influxdata'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readSitemapOrigin extracts origin from sitemap-md.xml', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    writeFileSync(
      join(dir, 'sitemap-md.xml'),
      '<urlset><url><loc>https://test2.docs.influxdata.com/influxdb3/core/index.md</loc></url></urlset>'
    );
    assert.equal(
      await readSitemapOrigin(dir),
      'https://test2.docs.influxdata.com'
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readSitemapOrigin falls back to prod origin when sitemap missing', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'prov-'));
  try {
    assert.equal(await readSitemapOrigin(dir), 'https://docs.influxdata.com');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('injectPageProvenance adds publisher and canonical fields', () => {
  const twin = '---\ntitle: Admin\nurl: http://localhost:1313/influxdb3/core/admin/\n---\n\nBody text.\n';
  const out = injectPageProvenance(twin, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/influxdb3/core/admin/',
  });
  const fm = out.match(/^---\n([\s\S]+?)\n---/)[1];
  assert.match(fm, /publisher: InfluxData/);
  assert.match(fm, /canonical: https:\/\/docs\.influxdata\.com\/influxdb3\/core\/admin\//);
  assert.match(fm, /title: Admin/);
  assert.match(out, /Body text\./);
});

test('injectPageProvenance canonical does not use the localhost build url', () => {
  const twin = '---\ntitle: T\nurl: http://localhost:1313/x/\n---\n\nb\n';
  const out = injectPageProvenance(twin, {
    publisher: 'InfluxData',
    canonical: 'https://docs.influxdata.com/x/',
  });
  assert.match(out, /canonical: https:\/\/docs\.influxdata\.com\/x\//);
});

test('injectPageProvenance returns input unchanged when no frontmatter', () => {
  const input = 'no frontmatter here';
  assert.equal(injectPageProvenance(input, { publisher: 'X', canonical: 'Y' }), input);
});
