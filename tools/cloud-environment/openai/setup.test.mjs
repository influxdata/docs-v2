import assert from 'node:assert/strict';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const setup = fileURLToPath(new URL('./setup.sh', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url)).replace(
  /\/$/,
  ''
);

function configure(overrides = {}) {
  return execFileSync(
    'bash',
    [
      '-c',
      'source "$1"; source "$1"; node -e \'console.log(JSON.stringify({root:process.env.DOCS_WORKTREE,cache:process.env.CYPRESS_CACHE_FOLDER,artifacts:process.env.DOCS_ENVIRONMENT_ARTIFACTS,proxy:process.env.HTTPS_PROXY,browser:process.env.PUPPETEER_EXECUTABLE_PATH}))\'',
      'test',
      setup,
    ],
    {
      cwd: '/tmp',
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        DOCS_CACHE_ROOT: '/tmp/docs-test-cache',
        DOCS_ENVIRONMENT_ARTIFACTS: '/tmp/docs-test-artifacts',
        HTTPS_PROXY: 'http://proxy:8080',
        ...overrides,
      },
      encoding: 'utf8',
    }
  );
}

test('sourcing setup resolves the checkout outside cwd and preserves proxy settings', () => {
  const result = JSON.parse(configure());
  assert.equal(result.root, root);
  assert.equal(result.cache, '/tmp/docs-test-cache/cypress');
  assert.equal(result.artifacts, '/tmp/docs-test-artifacts');
  assert.equal(result.proxy, 'http://proxy:8080');
});

test('sourcing setup preserves explicitly configured browser and cache paths', () => {
  const result = JSON.parse(
    configure({
      CYPRESS_CACHE_FOLDER: '/tmp/custom-cypress',
      PUPPETEER_EXECUTABLE_PATH: '/opt/browser',
    })
  );
  assert.equal(result.cache, '/tmp/custom-cypress');
  assert.equal(result.browser, '/opt/browser');
});

test('the JSON reference matches the custom host list', () => {
  const reference = JSON.parse(
    readFileSync(new URL('./allowlist-reference.json', import.meta.url), 'utf8')
  );
  const hosts = readFileSync(
    new URL('./allowed-hosts.txt', import.meta.url),
    'utf8'
  )
    .trim()
    .split('\n');
  assert.deepEqual(
    reference.network.allowed_domains.toSorted(),
    hosts.toSorted()
  );
});

test('maintenance checks local rendering and rejects failed HTTPS readiness', (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'docs-maintenance-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bin = path.join(directory, 'bin');
  const log = path.join(directory, 'checks.log');
  mkdirSync(bin);
  for (const command of ['node', 'yarn', 'hugo', 'chromium', 'cypress']) {
    writeFileSync(
      path.join(bin, command),
      '#!/usr/bin/env bash\nprintf "%s\\n" "$*" >> "$DOCS_CHECK_LOG"\nif [[ "${2:-}" == https://* ]]; then exit 42; fi\n',
      { mode: 0o755 }
    );
  }
  assert.throws(
    () =>
      execFileSync(
        'bash',
        [path.join(root, 'tools/cloud-environment/openai/maintenance.sh')],
        {
          env: {
            PATH: process.env.PATH,
            HOME: process.env.HOME,
            DOCS_CACHE_ROOT: directory,
            DOCS_ENVIRONMENT_ARTIFACTS: directory,
            DOCS_BROWSER_NSS_DB: path.join(directory, 'nssdb'),
            PUPPETEER_EXECUTABLE_PATH: path.join(bin, 'chromium'),
            DOCS_CHECK_LOG: log,
            DOCS_BROWSER_HTTPS_URL:
              'https://widget.kapa.ai/kapa-widget.bundle.js',
          },
        }
      ),
    (error) => error.status === 42
  );
  const checks = readFileSync(log, 'utf8').split('\n');
  assert.ok(
    checks.includes('tools/cloud-environment/openai/browser-smoke.mjs')
  );
  assert.ok(
    checks.includes(
      'tools/cloud-environment/openai/browser-smoke.mjs https://widget.kapa.ai/kapa-widget.bundle.js'
    )
  );
});
