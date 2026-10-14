import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { launch } from 'puppeteer';
import process from 'node:process';
import { Buffer } from 'node:buffer';
import ts from 'typescript';

test('desktop chat permits native Tab traversal and restores narrow modal semantics', async () => {
  const source = await readFile(
    new URL('../../assets/js/components/kapa-sidebar.ts', import.meta.url),
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
      '<button id="before">Article</button><div id="kapa-widget-container"></div><button id="after">Navigation</button>'
    );
    await page.evaluate(() => {
      const root = document
        .querySelector('#kapa-widget-container')
        .attachShadow({ mode: 'open' });
      root.innerHTML =
        '<section id="kapa-modal-content" role="dialog" aria-modal="true"><textarea></textarea><button>Send</button></section>';
      root.querySelector('section').addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        event.preventDefault();
        root.querySelector('textarea').focus();
      });
      root.querySelector('textarea').focus();
    });
    await page.keyboard.press('Tab');
    assert.equal(
      await page.evaluate(
        () =>
          document.querySelector('#kapa-widget-container').shadowRoot
            .activeElement.tagName
      ),
      'TEXTAREA'
    );
    await page.evaluate(
      async (url) => {
        const { adaptKapaSidebar } = await import(url);
        window.disposeSidebar = adaptKapaSidebar(
          document.querySelector('#kapa-widget-container')
        );
      },
      `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
    );
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'after');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    assert.equal(
      await page.evaluate(() => document.activeElement.id),
      'before'
    );
    await page.setViewport({ width: 1279, height: 800 });
    await page.waitForFunction(
      () =>
        document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('section')
          .getAttribute('aria-modal') === 'true'
    );
    await page.evaluate(() =>
      document
        .querySelector('#kapa-widget-container')
        .shadowRoot.querySelector('textarea')
        .focus()
    );
    await page.keyboard.press('Tab');
    assert.equal(
      await page.evaluate(
        () =>
          document.querySelector('#kapa-widget-container').shadowRoot
            .activeElement.tagName
      ),
      'TEXTAREA'
    );
    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForFunction(
      () =>
        document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('section')
          .getAttribute('aria-modal') === 'false'
    );
    await page.evaluate(() => {
      const section = document
        .querySelector('#kapa-widget-container')
        .shadowRoot.querySelector('section');
      section.setAttribute('aria-modal', 'true');
    });
    await page.waitForFunction(
      () =>
        document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('section')
          .getAttribute('aria-modal') === 'false'
    );
    await page.evaluate(() => window.disposeSidebar());
  } finally {
    await browser.close();
  }
});
