import assert from 'node:assert/strict';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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
