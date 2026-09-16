import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchRegistryIndex } from '../discovery.js';

test('throws a reported error on a non-200 response', async () => {
  const fetchImpl = async () =>
    new Response('not found', { status: 404, statusText: 'Not Found' });

  await assert.rejects(
    () => fetchRegistryIndex('https://example.test/index.json', { fetchImpl }),
    /404/
  );
});

test('propagates a network error as a reported error', async () => {
  const fetchImpl = async () => {
    throw new Error('getaddrinfo ENOTFOUND example.test');
  };

  await assert.rejects(
    () => fetchRegistryIndex('https://example.test/index.json', { fetchImpl }),
    /ENOTFOUND/
  );
});

test('reports malformed JSON as an error instead of returning garbage', async () => {
  const fetchImpl = async () =>
    new Response('not valid json {{{', { status: 200 });

  await assert.rejects(() =>
    fetchRegistryIndex('https://example.test/index.json', { fetchImpl })
  );
});
