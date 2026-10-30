import assert from 'node:assert/strict';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import {
  existsSync,
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
      'source "$1"; source "$1"; node -e \'console.log(JSON.stringify({root:process.env.DOCS_WORKTREE,cache:process.env.CYPRESS_CACHE_FOLDER,artifacts:process.env.DOCS_ENVIRONMENT_ARTIFACTS,proxy:process.env.HTTPS_PROXY,browser:process.env.PUPPETEER_EXECUTABLE_PATH,config:process.env.XDG_CONFIG_HOME}))\'',
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
  assert.equal(result.config, '/tmp/docs-test-cache/config');
});

test('sourcing setup preserves explicitly configured browser and cache paths', () => {
  const result = JSON.parse(
    configure({
      CYPRESS_CACHE_FOLDER: '/tmp/custom-cypress',
      XDG_CONFIG_HOME: '/tmp/custom-config',
      PUPPETEER_EXECUTABLE_PATH: '/opt/browser',
    })
  );
  assert.equal(result.cache, '/tmp/custom-cypress');
  assert.equal(result.browser, '/opt/browser');
  assert.equal(result.config, '/tmp/custom-config');
});

test('sourcing setup does not create configuration directories', (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'docs-source-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const config = path.join(directory, 'config');
  configure({ XDG_CONFIG_HOME: config });
  assert.equal(existsSync(config), false);
});

test('the network reference contains the required widget and CAPTCHA origins', () => {
  const reference = JSON.parse(
    readFileSync(new URL('./allowlist-reference.json', import.meta.url), 'utf8')
  );
  const hosts = reference.network.allowed_domains;
  assert.equal(new Set(hosts).size, hosts.length);
  for (const required of [
    'widget.kapa.ai',
    'proxy.kapa.ai',
    'www.google.com',
    'www.gstatic.com',
  ]) {
    assert.ok(hosts.includes(required), `Missing ${required}`);
  }
});

test('maintenance checks local rendering and rejects failed HTTPS readiness', (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'docs-maintenance-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bin = path.join(directory, 'bin');
  const log = path.join(directory, 'checks.log');
  mkdirSync(bin);
  for (const command of [
    'node',
    'yarn',
    'hugo',
    'chromium',
    'cypress',
    'Xvfb',
  ]) {
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

test('the cloud live runner owns its display and forwards browser and spec arguments', (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'docs-kapa-runner-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const scripts = path.join(directory, 'tools/cloud-environment/openai');
  const bin = path.join(directory, 'bin');
  const log = path.join(directory, 'runner.log');
  mkdirSync(scripts, { recursive: true });
  mkdirSync(bin);
  writeFileSync(
    path.join(scripts, 'setup.sh'),
    'export DOCS_WORKTREE="$DOCS_TEST_CHECKOUT"\n'
  );
  writeFileSync(
    path.join(scripts, 'maintenance.sh'),
    'printf "maintenance\\n" >> "$DOCS_CHECK_LOG"\n'
  );
  writeFileSync(
    path.join(scripts, 'kapa-live.sh'),
    readFileSync(new URL('./kapa-live.sh', import.meta.url))
  );
  for (const command of ['Xvfb', 'xauth']) {
    writeFileSync(path.join(bin, command), '#!/bin/sh\nexit 0\n', {
      mode: 0o755,
    });
  }
  writeFileSync(
    path.join(bin, 'xvfb-run'),
    '#!/bin/sh\nprintf "display:%s\\n" "$*" >> "$DOCS_CHECK_LOG"\nshift 3\nexec "$@"\n',
    { mode: 0o755 }
  );
  writeFileSync(
    path.join(bin, 'yarn'),
    '#!/bin/sh\nprintf "yarn:%s\\n" "$*" >> "$DOCS_CHECK_LOG"\n',
    { mode: 0o755 }
  );
  execFileSync(
    'bash',
    [
      path.join(scripts, 'kapa-live.sh'),
      '--spec',
      'cypress/live/kapa-mobile-close-live.cy.js',
    ],
    {
      cwd: '/tmp',
      env: {
        PATH: `${bin}:${process.env.PATH}`,
        DOCS_TEST_CHECKOUT: directory,
        DOCS_CHECK_LOG: log,
        PUPPETEER_EXECUTABLE_PATH: '/opt/chromium',
      },
    }
  );
  const lines = readFileSync(log, 'utf8').trim().split('\n');
  assert.equal(lines[0], 'maintenance');
  assert.ok(lines[1].startsWith('display:-a -s -screen 0 1280x1024x24 yarn '));
  assert.equal(
    lines[2],
    'yarn:test:e2e:kapa-live --headed --browser /opt/chromium --spec cypress/live/kapa-mobile-close-live.cy.js'
  );
});

test('installation stops with an actionable message before installing packages when Xvfb is missing', (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'docs-install-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.throws(
    () =>
      execFileSync(
        'bash',
        [
          '-c',
          'command() { if [[ "$*" == "-v Xvfb" ]]; then return 1; fi; builtin command "$@"; }; export -f command; exec bash "$1"',
          'test',
          path.join(root, 'tools/cloud-environment/openai/install.sh'),
        ],
        {
          env: {
            PATH: process.env.PATH,
            HOME: process.env.HOME,
            DOCS_CACHE_ROOT: directory,
            DOCS_ENVIRONMENT_ARTIFACTS: directory,
          },
          stdio: 'pipe',
        }
      ),
    (error) =>
      error.status === 1 &&
      /Install xvfb and xauth.*Edit Environment/.test(error.stderr.toString())
  );
});
