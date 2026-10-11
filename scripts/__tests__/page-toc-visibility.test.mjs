import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { test } from 'node:test';
import { launch } from 'puppeteer';
import ts from 'typescript';

test('scrolling the article reveals its active link within the independently scrolling ToC', async () => {
  const source = await readFile(
    new URL('../../assets/js/components/page-toc.ts', import.meta.url),
    'utf8'
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2020,
    },
  }).outputText;
  const browser = await launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setContent(
      `<style>.topnav {position:fixed;top:0;height:50px} h2 {height:300px} aside {position:fixed;right:0;top:60px;height:100px;overflow:auto} li {height:30px}</style><header class="topnav">Docs</header><div class="content-wrapper"><article class="article--content">${Array.from({ length: 8 }, (_, index) => `<h2 id="heading-${index}">Heading ${index}</h2>`).join('')}<div style="height:1000px">Last section content</div></article><aside data-page-rail><nav class="api-toc-nav"></nav></aside></div>`
    );
    await page.evaluate(
      async (url) => {
        const { default: PageToc } = await import(url);
        PageToc({ component: document.querySelector('[data-page-rail]') });
        window.scrollTo(0, document.querySelector('#heading-7').offsetTop - 50);
      },
      `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
    );
    await page.waitForSelector('a[href="#heading-7"][aria-current="location"]');
    const bounds = await page.evaluate(() => ({
      panel: document
        .querySelector('[data-page-rail]')
        .getBoundingClientRect()
        .toJSON(),
      link: document
        .querySelector('a[aria-current]')
        .getBoundingClientRect()
        .toJSON(),
    }));
    assert.ok(
      bounds.link.top >= bounds.panel.top &&
        bounds.link.bottom <= bounds.panel.bottom,
      JSON.stringify(bounds)
    );
  } finally {
    await browser.close();
  }
});
