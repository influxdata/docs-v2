import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const base = 'https://preview.example/pr-preview/pr-7791/';
const checker = new URL('../check-preview-links.mjs', import.meta.url);

function check(t, html, mode) {
  const folder = mkdtempSync(join(tmpdir(), 'preview-links-'));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  mkdirSync(join(folder, 'influxdb3', 'enterprise'), { recursive: true });
  writeFileSync(join(folder, 'influxdb3', 'enterprise', 'index.html'), html);
  const args = [checker.pathname, folder, base, ...(mode ? [mode] : [])];
  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
  });
  return { ...result, folder, args };
}

test('accepts prefixed and relative links, fragments, queries, and external destinations', (t) => {
  const result = check(
    t,
    `
    <a href="${base}influxdb3/enterprise/?view=all&amp;sort=name#heading">Absolute</a>
    <a href='/pr-preview/pr-7791/influxdb3/core/'>Root</a>
    <a href=./get-started/>Relative</a>
    <a href="../core/">Sibling</a>
    <a href="#heading">Fragment</a>
    <a href="?view=all">Query</a>
    <a href="https://external.example/">External</a>
    <a href="//external.example/">Protocol relative</a>
    <a href="mailto:docs@example.com">Email</a>
    <!-- <a href="/comment/">Comment</a> -->
    <script>const link = '<a href="/dynamic/">';</script>
    <a data-href="/data-only/">No destination</a>
  `
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Verified 6 internal links/);
});

for (const href of [
  '/influxdb3/enterprise/edr/',
  'https://preview.example/influxdb3/core/',
  '//preview.example/influxdb3/core/',
  '/pr-preview/pr-7792/influxdb3/core/',
  '/pr-preview/pr-7791-other/',
  '../../../influxdb3/core/',
]) {
  test(`rejects a link escaping the preview: ${href}`, (t) => {
    const result = check(t, `<a href="${href}">Escapes</a>`);
    assert.equal(result.status, 1);
    assert.ok(result.stderr.includes(href), result.stderr);
  });
}

test('rejects artifacts without internal links', (t) => {
  const result = check(t, '<a href="https://external.example/">External</a>');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No HTML pages or internal links found/);
});

test('rewrites rendered root-relative anchors once and preserves other markup', (t) => {
  const html = `
    <a href="/influxdb3/enterprise/?a=1&amp;b=2#heading">Content</a>
    <a HREF='/influxdb3/core/'>Navigation</a>
    <a href=/flux/v0/>Unquoted</a>
    <a href="/pr-preview/pr-7791/influxdb3/core/">Already prefixed</a>
    <a href="get-started/">Relative</a>
    <a href="#heading">Fragment</a>
    <a href="https://external.example/">External</a>
    <a href="//external.example/">Protocol relative</a>
    <link href="/canonical/" rel="canonical">
    <!-- <a href="/comment/">Comment</a> -->
    <script>const link = '<a href="/dynamic/">';</script>
  `;
  const result = check(t, html, '--rewrite');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Rewrote 3 links/);
  const file = join(result.folder, 'influxdb3', 'enterprise', 'index.html');
  const expected = html
    .replace(
      'href="/influxdb3/enterprise/',
      'href="/pr-preview/pr-7791/influxdb3/enterprise/'
    )
    .replace(
      "HREF='/influxdb3/core/",
      "HREF='/pr-preview/pr-7791/influxdb3/core/"
    )
    .replace('href=/flux/v0/', 'href=/pr-preview/pr-7791/flux/v0/');
  assert.equal(readFileSync(file, 'utf8'), expected);
  const again = spawnSync(process.execPath, result.args, { encoding: 'utf8' });
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /Rewrote 0 links/);
  assert.equal(readFileSync(file, 'utf8'), expected);
});
