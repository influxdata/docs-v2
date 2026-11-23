import { expect, test, type Page } from '@playwright/test';
import type {
  ContextualAskAiLink,
  DocsDatePickerElement,
} from '../support/widget-harness';
import { installKapaWidget } from '../../cypress/support/kapa-widget.js';

test.beforeEach(async ({ page }) => {
  await page.route('**/livereload.js*', (route) => route.abort());
  await page.addInitScript(() =>
    localStorage.setItem(
      'influxdata_docs_preferences',
      JSON.stringify({
        v3_wayfinding_show: false,
        theme: 'light',
        sidebar_state: 'open',
      })
    )
  );
});

const article = '/influxdb3/cloud-serverless/get-started/write/';
function elementBounds(
  element: Element
): Pick<DOMRectReadOnly, 'x' | 'y' | 'width' | 'height'> {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x, y, width, height };
}

async function mockWidget(
  page: Page,
  settings: { openFailures?: number } = {}
) {
  await page.route('https://widget.kapa.ai/kapa-widget.bundle.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `(${installKapaWidget.toString()})(${JSON.stringify(settings)})`,
    })
  );
}
async function completeWidgetRender(page: Page): Promise<void> {
  await page.waitForFunction(() => window.kapaHarness?.finishRender);
  await page.evaluate(() => {
    const render = window.kapaHarness.finishRender;
    if (!render) throw new Error('Widget has not received a render request');
    render();
  });
}
async function finishRender(page: Page): Promise<void> {
  await completeWidgetRender(page);
  await expect(page.locator('body')).toHaveAttribute(
    'data-ask-ai-state',
    'open'
  );
}
async function closeChat(page: Page) {
  await page.locator('#kapa-modal-content button:visible').first().click();
  await expect(page.locator('.ask-ai-button')).toBeVisible();
}

for (const width of [320, 390, 600, 601, 1280, 1440, 1920]) {
  test(`viewport placement and drawer restoration at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 800 });
    await mockWidget(page);
    await page.goto(article);
    const launcher = page.getByRole('button', { name: 'Ask AI', exact: true });
    await expect(launcher).toHaveCount(1);
    await expect(page.locator('.topnav .ask-ai-button')).toHaveCount(0);
    const inset = width <= 600 ? 20 : 24;
    expect(
      await launcher.evaluate((button) => getComputedStyle(button).padding)
    ).toBe(width <= 600 ? '8px 12px' : '12px 16px');
    expect(
      await launcher.evaluate((button) => getComputedStyle(button).fontSize)
    ).toBe('16px');
    for (const fraction of [0, 0.5, 1]) {
      await page.evaluate(
        (f) =>
          scrollTo(
            0,
            (document.documentElement.scrollHeight - innerHeight) * f
          ),
        fraction
      );
      const box = await launcher.evaluate(elementBounds);
      expect(Math.abs(width - box.x - box.width - inset)).toBeLessThan(1);
      expect(Math.abs(800 - box.y - box.height - inset)).toBeLessThan(1);
      expect(box.width).toBeGreaterThanOrEqual(width <= 600 ? 112 : 128);
      expect(box.height).toBeGreaterThanOrEqual(width <= 600 ? 44 : 48);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: testInfo.outputPath(`launcher-${width}-scroll-${fraction}.png`),
        });
    }
    const timestamp = await page
      .locator('.custom-time-trigger')
      .evaluate(elementBounds);
    const box = await launcher.evaluate(elementBounds);
    expect(Math.abs(box.y - timestamp.y - timestamp.height - 12)).toBeLessThan(
      1
    );
    const scroll = await page.evaluate(() => scrollY);
    await launcher.click();
    await expect(launcher).toBeVisible();
    await expect(launcher).toHaveAttribute('aria-busy', 'true');
    await launcher.press('Enter');
    await finishRender(page);
    await expect(page.locator('.footer-widgets')).toBeHidden();
    await expect(page.locator('#kapa-modal-content textarea')).toBeFocused();
    expect(await page.evaluate(() => window.kapaHarness.requests)).toHaveLength(
      1
    );
    expect(
      await page.evaluate(() => window.kapaHarness.requests[0])
    ).toMatchObject({ query: '', submit: false });
    await page
      .locator('#kapa-modal-content textarea')
      .fill('Keep this conversation');
    await page.locator('#kapa-modal-content textarea').press('Enter');
    await closeChat(page);
    await expect(launcher).toBeFocused();
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - scroll)
    ).toBeLessThan(2);
    await launcher.click();
    await page.setViewportSize({
      width: width < 1280 ? 1440 : 390,
      height: 800,
    });
    await expect(page.locator('.footer-widgets')).toBeHidden();
    await page.setViewportSize({ width, height: 800 });
    await expect(page.locator('#kapa-modal-content')).toContainText(
      'Keep this conversation'
    );
    await closeChat(page);
    await page.screenshot({
      path: testInfo.outputPath(`launcher-${width}-end.png`),
    });
  });
}

for (const key of ['Enter', 'Space', 'Control+k', 'Meta+k']) {
  test(`keyboard activation ${key}`, async ({ page }) => {
    await mockWidget(page);
    await page.goto('/');
    await page.locator('.ask-ai-button').focus();
    await page.keyboard.press(key);
    await finishRender(page);
    await closeChat(page);
    await expect(page.locator('.ask-ai-button')).toBeFocused();
    await expect(page.locator('.custom-time-trigger')).toHaveCount(0);
  });
}

test('script and open failures allow retry with one widget', async ({
  page,
}) => {
  await mockWidget(page, { openFailures: 1 });
  await page.route(
    'https://widget.kapa.ai/kapa-widget.bundle.js',
    async (route) => {
      await route.fulfill({ status: 503, body: 'Unavailable' });
    },
    { times: 1 }
  );
  await page.goto(article);
  const launcher = page.locator('.ask-ai-button');
  await launcher.click();
  await expect(page.locator('#ask-ai-status')).toContainText('Try again');
  await expect(launcher).toBeFocused();
  await launcher.click();
  await completeWidgetRender(page);
  await expect(page.locator('body')).toHaveAttribute(
    'data-ask-ai-state',
    'error'
  );
  await launcher.click();
  await expect(page.locator('body')).toHaveAttribute(
    'data-ask-ai-state',
    'open'
  );
  await expect(page.locator('#kapa-widget-container')).toHaveCount(1);
});

test('contextual prefill and focus restoration', async ({ page }) => {
  await mockWidget(page);
  await page.goto('/influxdb3/core/admin/identify-version/');
  const origin = page.locator('.article--content .ask-ai-open').first();
  const query = await origin.evaluate(
    (link: ContextualAskAiLink) => link.dataset.query
  );
  await origin.click();
  await finishRender(page);
  await expect(page.locator('#kapa-modal-content textarea')).toHaveValue(query);
  expect(
    await page.evaluate(() => window.kapaHarness.requests[0].groups.length)
  ).toBeGreaterThan(0);
  await closeChat(page);
  await expect(origin).toBeFocused();
});

test('scaled text, short landscape, themes, print, and 404', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 601, height: 320 });
  await page.goto(article);
  for (const close of await page
    .locator('.notification:visible .close-notification')
    .all())
    await close.click();
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
  for (const theme of ['light', 'dark']) {
    await page.locator('body').evaluate((body, value) => {
      body.dataset.theme = value;
      document
        .querySelectorAll<HTMLLinkElement>('link[title$="-theme"]')
        .forEach((link) => {
          link.disabled = link.title !== `${value}-theme`;
        });
    }, theme);
    await page.locator('.ask-ai-button').focus();
    await expect(page.locator('.ask-ai-button')).toBeInViewport();
    expect(
      await page.locator('.ask-ai-button').evaluate((button) => {
        const rect = button.getBoundingClientRect();
        return button.contains(
          document.elementFromPoint(
            rect.x + rect.width / 2,
            rect.y + rect.height / 2
          )
        );
      })
    ).toBe(true);
    expect(
      await page
        .locator('.ask-ai-button')
        .evaluate((button) => getComputedStyle(button).backgroundImage)
    ).toContain('linear-gradient(-45deg');
    const clearance = await page.evaluate(() =>
      parseFloat(
        document.body.style.getPropertyValue('--footer-controls-clearance')
      )
    );
    const stack = await page.locator('.footer-widgets').evaluate(elementBounds);
    expect(clearance).toBeGreaterThanOrEqual(stack.height + 24 + 8);
    await page.screenshot({
      path: testInfo.outputPath(`launcher-scaled-${theme}.png`),
    });
  }
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.footer-widgets')).toBeHidden();
  await page.emulateMedia({ media: 'screen' });
  await page.goto('/404.html');
  await expect(page.locator('.ask-ai-button')).toHaveCount(0);
});

test('final feedback actions scroll clear of the stack', async ({
  page,
}, testInfo) => {
  await page.goto(article);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const stack = await page.locator('.footer-widgets').evaluate(elementBounds);
  const feedback = page.locator('.feedback').last();
  await expect(feedback).toBeVisible();
  const box = await feedback.evaluate(elementBounds);
  expect(box.y + box.height).toBeLessThanOrEqual(stack.y - 8);
  await page.screenshot({
    path: testInfo.outputPath('launcher-final-actions.png'),
  });
});

test('API reference launcher and content clearance', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 800 });
  const response = await page.goto('/influxdb3/core/api/write-data/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('.ask-ai-button')).toBeVisible();
  await expect(page.locator('h1')).toContainText('Write');
  await page.evaluate(() =>
    scrollTo(0, document.documentElement.scrollHeight / 2)
  );
  await page.screenshot({
    path: testInfo.outputPath('launcher-api-middle.png'),
  });
});

test('timestamp modal excludes launcher from keyboard access', async ({
  page,
}) => {
  await page.goto(article);
  await page.locator('.custom-time-trigger a').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty('inert', true);
  await page.locator('#modal-close').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty(
    'inert',
    false
  );
});

test('touch activation opens the existing composer', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await mockWidget(page);
  await page.goto('/influxdb3/core/get-started/write/');
  await page.locator('.ask-ai-button').tap();
  await finishRender(page);
  await expect(page.locator('#kapa-modal-content textarea')).toBeFocused();
  await context.close();
});

test('loading chat yields to a modal opened before readiness', async ({
  page,
}) => {
  await mockWidget(page);
  await page.goto(article);
  await page.locator('.ask-ai-button').click();
  await page.locator('.custom-time-trigger a').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty('inert', true);
  await completeWidgetRender(page);
  await expect(page.locator('body')).toHaveAttribute(
    'data-ask-ai-state',
    'ready'
  );
  await expect(page.locator('#kapa-modal-content')).toBeHidden();
  await page.locator('#modal-close').click();
  await page.locator('.ask-ai-button').click();
  await expect(page.locator('#kapa-modal-content')).toBeVisible();
});

test('persisted pagehide preserves modal and clearance subscriptions', async ({
  page,
}) => {
  await page.goto(article);
  await page.locator('.custom-time-trigger a').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty('inert', true);
  await page.evaluate(() => {
    dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.locator('#modal-close').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty(
    'inert',
    false
  );
  const before = await page.evaluate(() =>
    parseFloat(
      document.body.style.getPropertyValue('--footer-controls-clearance')
    )
  );
  await page
    .locator('.ask-ai-button')
    .evaluate((button) => (button.style.minHeight = '100px'));
  await expect
    .poll(() =>
      page.evaluate(() =>
        parseFloat(
          document.body.style.getPropertyValue('--footer-controls-clearance')
        )
      )
    )
    .toBeGreaterThan(before);
  await page.locator('.custom-time-trigger a').click();
  await expect(page.locator('.footer-widgets')).toHaveJSProperty('inert', true);
});

for (const theme of ['light', 'dark']) {
  test(`footer controls and dates across chat resize in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (theme) =>
        localStorage.setItem(
          'influxdata_docs_preferences',
          JSON.stringify({
            theme,
            sidebar_state: 'open',
            v3_wayfinding_show: false,
            sample_get_started_date: '2025-02-10',
          })
        ),
      theme
    );
    await page.setViewportSize({ width: 375, height: 812 });
    await mockWidget(page);
    await page.goto(article);
    const timestamp = page.locator('.custom-time-trigger a');
    await expect(page.locator('.ask-ai-button')).toBeVisible();
    await expect(page.locator('.footer-widgets')).toBeInViewport({ ratio: 1 });
    await expect(
      page.locator('.ask-ai-composer, #chat-assistant-textarea')
    ).toHaveCount(0);
    await timestamp.click();
    await page
      .locator('#custom-date-selector')
      .evaluate((picker: DocsDatePickerElement) =>
        picker.datepicker.setDate('2025-02-12')
      );
    await page.locator('#submit-custom-date').click();
    await expect(page.locator('span.custom-timestamps').first()).toContainText(
      '2025-02-12T08:00:00Z'
    );
    await page.locator('.ask-ai-button').click();
    await expect(timestamp).toBeVisible();
    await finishRender(page);
    await expect(page.locator('.footer-widgets')).toBeHidden();
    await page.setViewportSize({ width: 1280, height: 1024 });
    await expect(page.locator('.footer-widgets')).toBeHidden();
    await closeChat(page);
    await timestamp.click();
    await expect(page.locator('#influxdb-gs-date-select')).toBeVisible();
    await expect(
      page.locator('#custom-date-selector .datepicker-cell.selected')
    ).toHaveText('12');
    await page.locator('#modal-close').click();
    for (const width of [601, 600, 375]) {
      await page.setViewportSize({ width, height: 812 });
      await expect(timestamp).toBeVisible();
      await expect(page.locator('.ask-ai-button')).toBeVisible();
    }
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight)
    );
    await timestamp.click();
    await expect(page.locator('#influxdb-gs-date-select')).toBeVisible();
  });
}
