import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import puppeteer from 'puppeteer';
import ts from 'typescript';

test('article navigation uses visible headings, literal labels, and real fragments', async () => {
  const source = await readFile(new URL('../page-toc.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 },
  }).outputText;
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(`
      <div class="content-wrapper">
        <article class="article--content">
          <h1 id="title">Page title</h1>
          <h2 id="syntax/measurement">Line protocol &lt;measurement&gt;</h2>
          <h2 id="construct">Construct line protocol</h2>
          <div hidden><h2 id="hidden">Hidden tab</h2></div>
          <div class="feedback"><h2 id="feedback">Support and feedback</h2></div>
        </article>
        <aside data-page-rail><nav class="api-toc-nav"></nav></aside>
      </div>`);
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
    await page.evaluate(async (url) => {
      const { default: PageToc } = await import(url);
      PageToc({ component: document.querySelector('[data-page-rail]') });
    }, moduleUrl);
    assert.deepEqual(await page.$$eval('[data-page-rail] a', links => links.map(link => link.textContent)), [
      'Line protocol <measurement>', 'Construct line protocol',
    ]);
    assert.equal(await page.$eval('[data-page-rail] a', link => document.getElementById(decodeURIComponent(link.hash.slice(1))).id), 'syntax/measurement');
    assert.equal(await page.$$eval('[data-page-rail] measurement', elements => elements.length), 0);
    await page.evaluate(() => {
      document.querySelector('[hidden]').hidden = false;
    });
    await page.waitForFunction(() => document.querySelectorAll('[data-page-rail] a').length === 3);
    assert.deepEqual(await page.$$eval('[data-page-rail] a', links => links.map(link => link.textContent)), [
      'Line protocol <measurement>', 'Construct line protocol', 'Hidden tab',
    ]);
  } finally { await browser.close(); }
});
