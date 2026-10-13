// Test the production controller against the live Website Widget.
// PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium node scripts/puppeteer/kapa-sidebar-smoke.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { launch } from 'puppeteer';
import { takeScreenshot } from './utils/puppeteer-helpers.js';

const output = process.argv[2] || '/tmp/docs-kapa-sidebar-smoke';
const baseUrl = process.env.DOCS_BASE_URL || 'http://localhost:1315';
const evidence = { failures: [], panels: [], console: [] };
const question =
  '  How do I write data to InfluxDB 3?\nKeep the explanation brief.  ';
await mkdir(output, { recursive: true });
const browser = await launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
  const page = await browser.newPage();
  page.on('console', (message) => {
    if (['error', 'warn'].includes(message.type()))
      evidence.console.push(message.text());
  });
  page.on('pageerror', (error) => evidence.console.push(error.message));
  page.on('requestfailed', (request) => {
    evidence.failures.push({
      url: request.url().split('?')[0],
      error: request.failure()?.errorText,
    });
  });
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto(`${baseUrl}/influxdb3/core/get-started/write/`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('.ask-ai-button');
  await page.evaluate(() => {
    document
      .querySelectorAll('.notification .close-notification')
      .forEach((button) => button.click());
  });
  await page.click('[data-ask-ai-action="open"]');
  try {
    await page.waitForFunction(
      () => document.body.dataset.askAiState === 'open',
      { timeout: 45000 }
    );
  } catch (error) {
    evidence.state = await page.evaluate(() => ({
      state: document.body.dataset.askAiState,
      status: document.querySelector('#ask-ai-status').textContent,
      host: !!document.querySelector('#kapa-widget-container'),
      api: typeof window.Kapa,
      scripts: Array.from(document.querySelectorAll('script[src*=kapa]')).map(
        (s) => s.outerHTML
      ),
    }));
    throw error;
  }
  for (const width of [1280, 1281, 1440, 1441, 1920]) {
    await page.setViewport({ width, height: 1024 });
    await page.waitForFunction(
      (expected) => {
        const dialog = document
          .querySelector('#kapa-widget-container')
          ?.shadowRoot?.querySelector('#kapa-modal-content');
        return (
          dialog &&
          Math.abs(dialog.getBoundingClientRect().width - expected) < 1 &&
          Math.abs(dialog.getBoundingClientRect().right - innerWidth) < 1
        );
      },
      {},
      width > 1440 ? 386 : 360
    );
    const bounds = await page.evaluate(() => {
      const root = document.querySelector('#kapa-widget-container').shadowRoot;
      const dialog = root.querySelector('#kapa-modal-content');
      const article = document.querySelector('.article--content');
      const style = getComputedStyle(article);
      return {
        viewport: innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        dialog: dialog.getBoundingClientRect().toJSON(),
        ariaModal: dialog.getAttribute('aria-modal'),
        article: article.getBoundingClientRect().toJSON(),
        articleTextWidth:
          article.clientWidth -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight),
        toc: document
          .querySelector('[data-page-rail]')
          .getBoundingClientRect()
          .toJSON(),
      };
    });
    evidence.panels.push(bounds);
    assert.equal(bounds.ariaModal, 'false');
    assert.ok(bounds.pageWidth <= bounds.viewport, JSON.stringify(bounds));
    assert.ok(bounds.articleTextWidth >= 400, JSON.stringify(bounds));
    assert.ok(
      bounds.toc.right <= bounds.dialog.left + 1,
      JSON.stringify(bounds)
    );
    await takeScreenshot(page, path.join(output, `desktop-${width}.png`));
  }
  await page.setViewport({ width: 1280, height: 1024 });
  await page.click(
    '.sidebar-toggle[data-state="closed"] [data-action="toggle"]'
  );
  await page.waitForFunction(
    () => document.body.dataset.sidebarState === 'closed'
  );
  await takeScreenshot(page, path.join(output, 'sidebar-closed-1280.png'));
  assert.ok(
    await page.evaluate(
      () =>
        document.querySelector('.article--content').getBoundingClientRect()
          .width >= 400
    )
  );
  await page.click('.sidebar-toggle[data-state="open"] [data-action="toggle"]');
  await page.waitForFunction(
    () => document.body.dataset.sidebarState === 'open'
  );
  evidence.sidebarPreferencePreserved = true;
  const themeColors = {};
  for (const theme of ['dark', 'light']) {
    await page.click(`.theme-switch-${theme}`);
    await page.waitForFunction(
      (value) => document.body.dataset.theme === value,
      {},
      theme
    );
    await page.waitForFunction(
      (previous) => {
        const dialog = document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('#kapa-modal-content');
        return getComputedStyle(dialog).backgroundColor !== previous;
      },
      {},
      themeColors.dark || ''
    );
    themeColors[theme] = await page.evaluate(
      () =>
        getComputedStyle(
          document
            .querySelector('#kapa-widget-container')
            .shadowRoot.querySelector('#kapa-modal-content')
        ).backgroundColor
    );
    for (const width of [1280, 1920]) {
      await page.setViewport({ width, height: 1024 });
      await page.waitForFunction(() => {
        const bounds = document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('#kapa-modal-content')
          .getBoundingClientRect();
        return (
          Math.abs(bounds.right - innerWidth) < 1 &&
          Math.abs(bounds.width - (innerWidth > 1440 ? 386 : 360)) < 1
        );
      });
      await takeScreenshot(page, path.join(output, `${theme}-${width}.png`));
    }
  }
  assert.notEqual(themeColors.dark, themeColors.light);
  evidence.themeColors = themeColors;
  await page.click('[data-page-rail] a[href="#construct-line-protocol"]');
  assert.equal(new URL(page.url()).hash, '#construct-line-protocol');
  await page.evaluate(() =>
    document
      .querySelector('#kapa-widget-container')
      .shadowRoot.querySelector('textarea')
      .focus()
  );
  let exited = false;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    exited = await page.evaluate(
      () => document.activeElement?.id !== 'kapa-widget-container'
    );
    if (exited) break;
  }
  assert.ok(exited, 'Native Tab must leave the nonmodal desktop widget');
  evidence.keyboardExit = true;
  for (const width of [1279, 1024, 801, 800, 601, 600, 390]) {
    await page.setViewport({ width, height: 844 });
    await page.waitForFunction(
      () =>
        document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('#kapa-modal-content')
          .getAttribute('aria-modal') === 'true'
    );
    await page.waitForFunction(
      (expected) => {
        const bounds = document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('#kapa-modal-content')
          .getBoundingClientRect();
        return (
          Math.abs(bounds.width - expected) < 1 &&
          Math.abs(bounds.right - innerWidth) < 1
        );
      },
      {},
      width <= 600 ? width : 360
    );
    const bounds = await page.evaluate(() => ({
      viewport: innerWidth,
      dialog: document
        .querySelector('#kapa-widget-container')
        .shadowRoot.querySelector('#kapa-modal-content')
        .getBoundingClientRect()
        .toJSON(),
      tocHidden: !document.querySelector('[data-page-rail]').getClientRects()
        .length,
    }));
    evidence.panels.push(bounds);
    assert.ok(bounds.tocHidden);
    assert.ok(
      Math.abs(bounds.dialog.width - (width <= 600 ? width : 360)) < 1,
      JSON.stringify(bounds)
    );
    await takeScreenshot(page, path.join(output, `narrow-${width}.png`));
  }
  await page.evaluate(() => window.Kapa.close());
  await page.waitForFunction(
    () => document.body.dataset.askAiState === 'ready'
  );
  assert.equal(
    await page.evaluate(() => document.activeElement?.dataset.askAiAction),
    'open'
  );
  await takeScreenshot(page, path.join(output, 'launcher-390.png'));
  const launcherBounds = await page.evaluate(() => ({
    header: document
      .querySelector('.ask-ai-button')
      .getBoundingClientRect()
      .toJSON(),
    viewport: innerWidth,
    pageWidth: document.documentElement.scrollWidth,
    hasComposer: !!document.querySelector(
      '.ask-ai-composer, #chat-assistant-textarea'
    ),
  }));
  evidence.launcher = launcherBounds;
  assert.equal(launcherBounds.hasComposer, false);
  assert.ok(launcherBounds.header.left >= 0);
  assert.ok(launcherBounds.header.right <= launcherBounds.viewport);
  assert.ok(launcherBounds.pageWidth <= launcherBounds.viewport);
  await page.goto(`${baseUrl}/influxdb3/core/api/write-data/`, {
    waitUntil: 'domcontentloaded',
  });
  await page.setViewport({ width: 1280, height: 1024 });
  await page.waitForSelector('.ask-ai-button');
  await page.evaluate(() =>
    document
      .querySelectorAll('.notification .close-notification')
      .forEach((button) => button.click())
  );
  await page.click('[data-ask-ai-action="open"]');
  await page.waitForFunction(() => document.body.dataset.askAiState === 'open');
  await page.waitForFunction(
    () =>
      Math.abs(
        document
          .querySelector('#kapa-widget-container')
          .shadowRoot.querySelector('#kapa-modal-content')
          .getBoundingClientRect().right - innerWidth
      ) < 1
  );
  const apiBounds = await page.evaluate(() => {
    const article = document.querySelector('.article--content');
    const style = getComputedStyle(article);
    const links = Array.from(document.querySelectorAll('[data-page-rail] a'));
    return {
      textWidth:
        article.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight),
      links: links.map((link) => ({
        href: link.getAttribute('href'),
        exists: !!document.getElementById(link.getAttribute('href').slice(1)),
        badge: link.querySelector('.api-method')?.textContent,
      })),
    };
  });
  evidence.api = apiBounds;
  assert.ok(apiBounds.textWidth >= 400);
  assert.ok(
    apiBounds.links.length > 0 &&
      apiBounds.links.every((link) => link.exists && link.badge)
  );
  await takeScreenshot(page, path.join(output, 'api-1280.png'));
  await page.click('[data-page-rail] a');
  assert.match(new URL(page.url()).hash, /^#operation\//);
  await page.evaluate(() => window.Kapa.close());
  await page.waitForFunction(
    () => document.body.dataset.askAiState === 'ready'
  );
  await page.setViewport({ width: 1280, height: 1024 });
  await page.click('.ask-ai-button');
  await page.waitForFunction(() => document.body.dataset.askAiState === 'open');
  await page.evaluate((query) => {
    window.liveAnswerCompleted = false;
    window.liveQueryAcknowledged = false;
    window.Kapa('onAskAIAnswerCompleted', () => {
      window.liveAnswerCompleted = true;
    });
    window.Kapa('onAskAIQuerySubmit', (data) => {
      if (data?.question === query) window.liveQueryAcknowledged = true;
    });
    window.Kapa.open({ mode: 'ai', query, submit: true });
  }, question);
  await page.waitForFunction(() => window.liveQueryAcknowledged, {
    timeout: 15000,
  });
  evidence.queryAcknowledged = true;
  await page.waitForFunction(() => window.liveAnswerCompleted, {
    timeout: 45000,
  });
  evidence.answerCompleted = true;
  await page.evaluate(() => window.Kapa.close());
  await page.waitForFunction(
    () => document.body.dataset.askAiState === 'ready'
  );
  await page.click('[data-ask-ai-action="open"]');
  await page.waitForFunction(() => document.body.dataset.askAiState === 'open');
  await page.waitForFunction(() =>
    document
      .querySelector('#kapa-widget-container')
      .shadowRoot.querySelector('#kapa-modal-content')
      .innerText.includes('How do I write data to InfluxDB 3?')
  );
  evidence.historyRetained = true;
  assert.equal(
    await page.evaluate(
      () =>
        document.querySelectorAll(
          'script[src="https://widget.kapa.ai/kapa-widget.bundle.js"]'
        ).length
    ),
    1
  );
} finally {
  await writeFile(
    path.join(output, 'results.json'),
    JSON.stringify(evidence, null, 2)
  );
  await browser.close();
}
