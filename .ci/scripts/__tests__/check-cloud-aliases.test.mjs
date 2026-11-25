import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkCloudAliases } from '../check-cloud-aliases.mjs';
import { test } from 'node:test';

const alias = '/influxdb3/cloud/reference/sample-data/';

function check(t, html, aliases = [alias]) {
  const folder = mkdtempSync(join(tmpdir(), 'cloud-aliases-'));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  const source = join(folder, 'request-information.md');
  writeFileSync(
    source,
    '---\ntitle: Request more information\n' +
      `aliases: ${JSON.stringify(aliases)}\n---\n`
  );
  if (html !== undefined) {
    const output = join(folder, alias, 'index.html');
    mkdirSync(join(folder, alias), { recursive: true });
    writeFileSync(output, html);
  }
  const { aliasCount, errors } = checkCloudAliases(folder, source);
  return {
    status: errors.length ? 1 : 0,
    stderr: errors.join('\n'),
    aliasCount,
  };
}

for (const destination of [
  '/influxdb3/cloud/request-information/',
  'https://docs.influxdata.com/influxdb3/cloud/request-information/',
  'https://preview.example/pr-preview/pr-7965/influxdb3/cloud/request-information/',
]) {
  test(`accepts a stopgap redirect to ${destination}`, (t) => {
    const result = check(
      t,
      `<meta http-equiv=refresh content="0; url=${destination}">`
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.aliasCount, 1);
  });
}

test('rejects an alias colliding with a real page', (t) => {
  const result = check(
    t,
    '<article><h1>Sample data</h1><h2>Home sensor data</h2></article>'
  );
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes(alias), result.stderr);
  assert.match(result.stderr, /Remove the stopgap alias/);
});

test('rejects a redirect to a different page', (t) => {
  const result = check(
    t,
    '<meta http-equiv="refresh" content="0; url=/influxdb3/cloud/reference/">'
  );
  assert.equal(result.status, 1);
});

test('rejects a missing build artifact', (t) => {
  const result = check(t);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Run a full Hugo build/);
});

test('accepts a fully drained stopgap', (t) => {
  const result = check(t, undefined, []);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.aliasCount, 0);
});
