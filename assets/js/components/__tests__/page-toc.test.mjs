import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { after, before, test } from 'node:test';
import { launch } from 'puppeteer';
import ts from 'typescript';

const source = await readFile(
  new URL('../page-toc.ts', import.meta.url),
  'utf8'
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ES2020,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;

let browser;
before(async () => {
  browser = await launch({
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
});
after(() => browser?.close());

async function mount(html, viewport) {
  const page = await browser.newPage();
  if (viewport) await page.setViewport(viewport);
  await page.setContent(html);
  await page.evaluate(async (url) => {
    const { default: PageToc } = await import(url);
    PageToc({ component: document.querySelector('[data-page-rail]') });
  }, moduleUrl);
  return page;
}

const ACTIVE = '[data-page-rail] a[aria-current="location"]';

const TOGGLE = `
  <button class="page-toc-toggle" type="button" hidden aria-expanded="false" aria-controls="page-toc-navigation">
    <span class="page-toc-toggle-icon"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/></svg></span>
    <span class="page-toc-toggle-label">On this page</span>
  </button>`;

const scrollFixture = ({ css = '', nav = '' } = {}) => `
  <style>
    .topnav { position: fixed; top: 0; height: 50px; }
    h2 { height: 300px; }
    aside { position: fixed; right: 0; top: 100px; }
    ${css}
  </style>
  <header class="topnav">Docs</header>
  <div class="content-wrapper">
    <article class="article--content">
      ${Array.from({ length: 8 }, (_, index) => `<h2 id="heading-${index}">Heading ${index}</h2>`).join('')}
      <div style="height: 1000px">Last section content</div>
    </article>
    <aside class="api-toc" data-page-rail>${TOGGLE}<nav class="api-toc-nav" id="page-toc-navigation">${nav}</nav></aside>
  </div>`;

async function select(page, index) {
  await page.waitForSelector(`${ACTIVE}[href="#heading-0"]`);
  const link = await page.$(`[data-page-rail] a[href="#heading-${index}"]`);
  const destination = await page.evaluate(
    (id) =>
      document.getElementById(id).getBoundingClientRect().top +
      window.scrollY -
      50,
    `heading-${index}`
  );
  await link.click();
  return { destination, link };
}

function activeAfterFrames(page, frames) {
  return page.evaluate(
    (selector, count) =>
      new Promise((resolve) => {
        const tick = (left) =>
          left
            ? requestAnimationFrame(() => tick(left - 1))
            : resolve(document.querySelector(selector)?.hash ?? null);
        tick(count);
      }),
    ACTIVE,
    frames
  );
}

function publishedScrollAt(page, offset) {
  return page.evaluate(
    (top) =>
      new Promise((resolve) => {
        window.scrollTo(0, top);
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            resolve(
              document
                .querySelector('[data-page-rail]')
                .style.getPropertyValue('--page-rail-scroll')
            )
          )
        );
      }),
    offset
  );
}

test('article navigation uses visible headings, literal labels, and real fragments', async () => {
  const page = await mount(`
    <div class="content-wrapper">
      <article class="article--content">
        <h1 id="title">Page title</h1>
        <h2 id="syntax/measurement">Line protocol &lt;measurement&gt;</h2>
        <h2 id="construct">Construct line protocol</h2>
        <div hidden><h2 id="hidden">Hidden tab</h2></div>
        <div class="feedback"><h2 id="feedback">Support and feedback</h2></div>
      </article>
      <aside class="api-toc" data-page-rail>${TOGGLE}<nav class="api-toc-nav" id="page-toc-navigation"></nav></aside>
    </div>`);
  try {
    assert.deepEqual(
      await page.$$eval('[data-page-rail] a', (links) =>
        links.map((link) => link.textContent)
      ),
      ['Line protocol <measurement>', 'Construct line protocol']
    );
    assert.equal(
      await page.$eval(
        '[data-page-rail] a',
        (link) =>
          document.getElementById(decodeURIComponent(link.hash.slice(1))).id
      ),
      'syntax/measurement'
    );
    assert.equal(
      await page.$$eval(
        '[data-page-rail] measurement',
        (elements) => elements.length
      ),
      0
    );
    await page.evaluate(() => {
      document.querySelector('[hidden]').hidden = false;
    });
    await page.waitForFunction(
      () => document.querySelectorAll('[data-page-rail] a').length === 3
    );
    assert.deepEqual(
      await page.$$eval('[data-page-rail] a', (links) =>
        links.map((link) => link.textContent)
      ),
      ['Line protocol <measurement>', 'Construct line protocol', 'Hidden tab']
    );
  } finally {
    await page.close();
  }
});

test('scrolling the article reveals its active link within the independently scrolling ToC', async () => {
  const page = await mount(
    scrollFixture({
      css: 'aside { height: 100px; overflow: auto; } li { height: 30px; }',
    }),
    { width: 1280, height: 800 }
  );
  try {
    await page.evaluate(() =>
      window.scrollTo(0, document.querySelector('#heading-7').offsetTop - 50)
    );
    await page.waitForSelector(`${ACTIVE}[href="#heading-7"]`);
    const bounds = await page.evaluate(
      (selector) => ({
        panel: document
          .querySelector('[data-page-rail]')
          .getBoundingClientRect()
          .toJSON(),
        link: document.querySelector(selector).getBoundingClientRect().toJSON(),
      }),
      ACTIVE
    );
    assert.ok(
      bounds.link.top >= bounds.panel.top &&
        bounds.link.bottom <= bounds.panel.bottom,
      JSON.stringify(bounds)
    );
  } finally {
    await page.close();
  }
});

test('a selected link survives a resize while the page scrolls to it', async () => {
  const page = await mount(scrollFixture(), { width: 1280, height: 800 });
  try {
    const { destination, link } = await select(page, 6);
    await page.evaluate(() => window.dispatchEvent(new Event('resize')));
    const samples = await page.evaluate(
      (selector, target, selected) =>
        new Promise((resolve) => {
          const seen = [];
          const started = performance.now();
          const tick = () => {
            seen.push({
              y: Math.round(window.scrollY),
              hash: document.querySelector(selector)?.hash ?? null,
              rebuilt: !document.contains(selected),
            });
            if (
              Math.abs(window.scrollY - target) <= 1 ||
              performance.now() - started > 3000
            )
              resolve(seen);
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }),
      ACTIVE,
      destination,
      link
    );
    const detail = JSON.stringify(samples);
    assert.ok(
      samples.some((sample) => sample.y > 0 && sample.y < destination - 1),
      `expected mid-way frames: ${detail}`
    );
    assert.ok(
      Math.abs(samples.at(-1).y - destination) <= 1,
      `scroll did not arrive: ${detail}`
    );
    assert.ok(
      samples.some((sample) => sample.rebuilt && sample.y < destination - 1),
      `links were not rebuilt mid-scroll: ${detail}`
    );
    assert.deepEqual(
      [...new Set(samples.map((sample) => sample.hash))],
      ['#heading-6'],
      `active link changed during the scroll: ${detail}`
    );
  } finally {
    await page.close();
  }
});

test('a scroll away from the target releases the selection at once', async () => {
  const page = await mount(scrollFixture(), { width: 1280, height: 800 });
  try {
    await select(page, 6);
    await page.waitForFunction(() => window.scrollY > 200);
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.equal(await activeAfterFrames(page, 3), '#heading-0');
  } finally {
    await page.close();
  }
});

test('a scroll that stops short of the target releases the selection once it settles', async () => {
  const page = await mount(scrollFixture(), { width: 1280, height: 800 });
  try {
    const { destination } = await select(page, 6);
    await page.waitForFunction(() => window.scrollY > 200);
    await page.evaluate((top) => window.scrollTo(0, top), destination - 300);
    assert.equal(
      await activeAfterFrames(page, 3),
      '#heading-6',
      'selection released while still closing in'
    );
    await page.waitForSelector(`${ACTIVE}[href="#heading-5"]`, {
      timeout: 2000,
    });
  } finally {
    await page.close();
  }
});

test('the component adopts the template toggle instead of adding its own', async () => {
  const page = await mount(scrollFixture(), { width: 500, height: 800 });
  try {
    await page.waitForSelector(
      '[data-page-rail] .page-toc-toggle:not([hidden])'
    );
    assert.deepEqual(
      await page.$$eval('[data-page-rail] .page-toc-toggle', (toggles) =>
        toggles.map((toggle) => toggle.getAttribute('aria-expanded'))
      ),
      ['false']
    );
  } finally {
    await page.close();
  }
});

test('the rail publishes the page offset for the stylesheet to clamp', async () => {
  const page = await mount(scrollFixture(), { width: 500, height: 800 });
  try {
    assert.equal(await publishedScrollAt(page, 50), '50px');
    assert.equal(await publishedScrollAt(page, 500), '500px');
    assert.equal(await publishedScrollAt(page, 0), '0px');
  } finally {
    await page.close();
  }
});

test('the rail publishes nothing at desktop widths', async () => {
  const page = await mount(scrollFixture(), { width: 1280, height: 800 });
  try {
    assert.equal(await publishedScrollAt(page, 500), '');
  } finally {
    await page.close();
  }
});

test('the first highlight does not animate, while later changes do', async () => {
  const page = await mount(
    scrollFixture({
      css: '.api-toc.is-ready .api-toc-link { transition: padding-left 1s; } .api-toc-link.is-active { padding-left: 8px; }',
      nav: Array.from(
        { length: 8 },
        (_, index) =>
          `<a class="api-toc-link" href="#heading-${index}">Heading ${index}</a>`
      ).join(''),
    }),
    { width: 1280, height: 800 }
  );
  try {
    const transitions = (selector) =>
      page.evaluate(
        (target) =>
          new Promise((resolve) =>
            requestAnimationFrame(() =>
              resolve(
                document
                  .querySelector(target)
                  .getAnimations()
                  .map((animation) => animation.transitionProperty)
              )
            )
          ),
        selector
      );
    assert.ok(
      await page.$eval('[data-page-rail]', (rail) =>
        rail.classList.contains('is-ready')
      ),
      'rail never became ready'
    );
    assert.deepEqual(
      await transitions(`${ACTIVE}[href="#heading-0"]`),
      [],
      'the first highlight animated'
    );
    await new Promise((resolve) => setTimeout(resolve, 200));
    await page.evaluate(() =>
      window.scrollTo(0, document.getElementById('heading-3').offsetTop - 50)
    );
    await page.waitForSelector(`${ACTIVE}[href="#heading-3"]`);
    assert.deepEqual(
      await transitions(`${ACTIVE}[href="#heading-3"]`),
      ['padding-left'],
      'a later change should animate'
    );
  } finally {
    await page.close();
  }
});
