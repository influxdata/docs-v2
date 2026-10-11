import assert from 'node:assert/strict';
import process from 'node:process';
import { launch } from 'puppeteer';

// Checks local HTML or the supplied URL.
const target = process.argv[2];
const url = target ? new URL(target) : null;
if (url) assert.ok(['http:', 'https:'].includes(url.protocol));
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const args = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
];
if (proxy) {
  const proxyUrl = new URL(proxy);
  assert.ok(
    !proxyUrl.username && !proxyUrl.password,
    'Use the inherited credential-free sidecar proxy'
  );
  args.push(
    `--proxy-server=${proxyUrl.origin}`,
    '--proxy-bypass-list=localhost;127.0.0.1'
  );
}
const browser = await launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
  args,
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) =>
    errors.push(
      `${new URL(request.url()).hostname}: ${request.failure()?.errorText}`
    )
  );
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(
        `${new URL(response.url()).hostname}: HTTP ${response.status()}`
      );
  });
  if (target) {
    const response = await page.goto(target, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    assert.ok(response?.ok(), `HTTP ${response?.status()}`);
  } else {
    await page.setContent(
      '<title>docs smoke</title><main>Local browser check</main>'
    );
    assert.equal(await page.title(), 'docs smoke');
  }
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(errors, [], 'Browser runtime or resource failures');
  console.log(`Browser smoke passed for ${url ? url.origin : 'local HTML'}`);
} finally {
  await browser.close();
}
