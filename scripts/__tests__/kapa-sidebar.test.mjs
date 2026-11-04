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
          document.querySelector('#kapa-widget-container'),
          () => {}
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

test('mobile close survives header replacement and releases injected DOM and listeners', async () => {
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
    await page.setViewport({ width: 390, height: 844 });
    await page.setContent('<div id="kapa-widget-container"></div>');
    await page.evaluate(
      async (url) => {
        const host = document.querySelector('#kapa-widget-container');
        const root = host.attachShadow({ mode: 'open' });
        root.innerHTML = `<section id="kapa-modal-content" role="dialog">
        <header class="mantine-Modal-header"><button class="mantine-Modal-close">Vendor close</button></header>
        <div class="scrollable-container" style="height:200px;overflow:auto"><p>Retained conversation</p><div style="height:3000px"></div></div></section>`;
        window.closeCount = 0;
        const { adaptKapaSidebar } = await import(url);
        window.disposeSidebar = adaptKapaSidebar(
          host,
          () => window.closeCount++
        );
      },
      `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
    );
    const closeSelector = '#kapa-widget-container >>> .docs-ask-ai-close';
    const beforeScroll = await page.$eval(closeSelector, (button) =>
      button.getBoundingClientRect().toJSON()
    );
    await page.evaluate(() => {
      const messages = document
        .querySelector('#kapa-widget-container')
        .shadowRoot.querySelector('.scrollable-container');
      messages.scrollTop = messages.scrollHeight;
    });
    assert.deepEqual(
      await page.$eval(closeSelector, (button) =>
        button.getBoundingClientRect().toJSON()
      ),
      beforeScroll
    );
    await page.click(closeSelector);
    assert.equal(await page.evaluate(() => window.closeCount), 1);
    // Replace vendor markup as a theme/configuration rerender would.
    await page.evaluate(() => {
      const root = document.querySelector('#kapa-widget-container').shadowRoot;
      root.querySelector('header').outerHTML =
        '<header class="mantine-Modal-header"><button class="mantine-Modal-close">Vendor close</button></header>';
    });
    await page.waitForSelector(closeSelector, { visible: true });
    assert.equal(
      await page.evaluate(
        () =>
          document
            .querySelector('#kapa-widget-container')
            .shadowRoot.querySelectorAll('.docs-ask-ai-close').length
      ),
      1
    );
    await page.click(closeSelector);
    assert.equal(await page.evaluate(() => window.closeCount), 2);
    await page.keyboard.press('Tab');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    assert.equal(
      await page.$eval(
        closeSelector,
        (button) => getComputedStyle(button).outlineStyle
      ),
      'solid'
    );
    await page.setViewport({ width: 601, height: 844 });
    await page.waitForSelector(closeSelector, { hidden: true });
    assert.equal(
      await page.evaluate(
        () =>
          getComputedStyle(
            document
              .querySelector('#kapa-widget-container')
              .shadowRoot.querySelector('.mantine-Modal-close')
          ).display === 'none'
      ),
      false
    );
    await page.evaluate(() => {
      const root = document.querySelector('#kapa-widget-container').shadowRoot;
      window.detachedClose = root.querySelector('.docs-ask-ai-close');
      window.disposeSidebar();
      window.detachedClose.click();
      root.querySelector('section').append(document.createElement('div'));
    });
    assert.deepEqual(
      await page.evaluate(() => {
        const root = document.querySelector(
          '#kapa-widget-container'
        ).shadowRoot;
        return {
          count: window.closeCount,
          buttons: root.querySelectorAll('.docs-ask-ai-close').length,
          styles: root.querySelectorAll('style').length,
          conversation: root.querySelector('p').textContent,
        };
      }),
      { count: 2, buttons: 0, styles: 0, conversation: 'Retained conversation' }
    );
  } finally {
    await browser.close();
  }
});
