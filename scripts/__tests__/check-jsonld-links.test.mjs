import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { checkJsonLdLinks, jsonLdBlocks } from '../check-jsonld-links.js';

let publicDir;

before(async () => {
  publicDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jsonld-links-'));
  await fs.mkdir(path.join(publicDir, 'product'), { recursive: true });
  await fs.writeFile(
    path.join(publicDir, 'index.html'),
    '<script type="application/ld+json">{"@id":"https://example.com/#organization","@type":"Organization"}</script>'
  );
  await fs.writeFile(
    path.join(publicDir, 'product', 'index.html'),
    '<script type=application/ld+json>{"@id":"https://example.com/product/#software","@type":"SoftwareApplication"}</script><script type="application/ld+json">{"@type":"TechArticle","isPartOf":{"@id":"https://example.com/product/#software"}}</script>'
  );
});

after(async () => fs.rm(publicDir, { recursive: true, force: true }));

test('extracts quoted and unquoted JSON-LD script types', () => {
  assert.equal(
    jsonLdBlocks('<script type=application/ld+json>{}</script>').length,
    1
  );
  assert.equal(
    jsonLdBlocks('<script type="application/ld+json">{}</script>').length,
    1
  );
});

test('accepts references to nodes defined on another HTML page', async () => {
  const result = await checkJsonLdLinks(publicDir);
  assert.deepEqual(result.invalidJson, []);
  assert.deepEqual(result.missing, []);
});

test('reports dangling JSON-LD node references', async () => {
  await fs.mkdir(path.join(publicDir, 'dangling'));
  await fs.writeFile(
    path.join(publicDir, 'dangling', 'index.html'),
    '<script type="application/ld+json">{"about":{"@id":"https://example.com/missing"}}</script>'
  );
  const result = await checkJsonLdLinks(publicDir);
  assert.deepEqual(result.missing, ['https://example.com/missing']);
  await fs.rm(path.join(publicDir, 'dangling'), { recursive: true });
});
