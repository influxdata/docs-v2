import { test, expect, type Page } from '@playwright/test';

const FAQ_QUESTIONS = [
  {
    text: "What's the difference between InfluxDB 1, InfluxDB 2, and InfluxDB 3?",
    anchor: 'whats-the-difference-between-influxdb-1-influxdb-2-and-influxdb-3',
  },
  {
    text: 'Should I start a new project on InfluxDB 1 or InfluxDB 2?',
    anchor: 'should-i-start-a-new-project-on-influxdb-1-or-influxdb-2',
  },
  {
    text: 'I run InfluxDB 2 today',
    anchor: 'i-run-influxdb-2-today--should-i-migrate-to-influxdb-3',
  },
  {
    text: 'I run InfluxDB 1 today',
    anchor: 'i-run-influxdb-1-today--should-i-migrate-to-influxdb-3',
  },
  {
    text: 'Is InfluxDB 3 Cloud Serverless the same as InfluxDB 3 Enterprise?',
    anchor: 'is-influxdb-3-cloud-serverless-the-same-as-influxdb-3-enterprise',
  },
  {
    text: 'Which query languages does InfluxDB 3 support?',
    anchor: 'which-query-languages-does-influxdb-3-support',
  },
  {
    text: 'Where does InfluxDB 3 Explorer fit?',
    anchor: 'where-does-influxdb-3-explorer-fit',
  },
];

async function readFaqJsonLd(page: Page) {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((nodes) => nodes.map((n) => n.textContent ?? ''));
  return blocks.map((b) => JSON.parse(b)).find((j) => j['@type'] === 'FAQPage');
}

test.describe('Which InfluxDB 3 decision page (canonical)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/influxdb3/which-influxdb-3/');
  });

  test('uses the InfluxDB 3 documentation title', async ({ page }) => {
    await expect(page).toHaveTitle(
      'Which InfluxDB 3 should I use? | InfluxDB 3 Documentation'
    );
  });

  test('renders the H1', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(
      'Which InfluxDB 3 should I use'
    );
  });

  test('nests the FAQ questions as H3s under one H2 with stable anchors', async ({
    page,
  }) => {
    await expect(page.locator('h2#frequently-asked-questions')).toHaveCount(1);
    for (const { text, anchor } of FAQ_QUESTIONS) {
      await expect(page.locator(`h3#${anchor}`)).toContainText(text);
      await expect(page.locator(`h2#${anchor}`)).toHaveCount(0);
    }
  });

  test('wraps each FAQ answer in a faq-answer div that follows its H3', async ({
    page,
  }) => {
    const answers = page.locator('div.faq-answer');
    await expect(answers).toHaveCount(FAQ_QUESTIONS.length);
    await expect(page.locator('h3 + div.faq-answer')).toHaveCount(
      FAQ_QUESTIONS.length
    );
    for (const answer of await answers.all()) {
      await expect(answer.locator('p').first()).toBeVisible();
    }
  });

  test('scrolls to a question from its fragment', async ({ page }) => {
    await page.goto(
      '/influxdb3/which-influxdb-3/#where-does-influxdb-3-explorer-fit'
    );
    await expect(
      page.locator('h3#where-does-influxdb-3-explorer-fit')
    ).toBeInViewport();
  });

  test('lists the FAQ questions in "On this page"', async ({ page }) => {
    const toc = page.locator('[data-component="page-toc"]');
    await expect(toc).toHaveAttribute('data-toc-depth', '3');
    for (const { anchor } of FAQ_QUESTIONS) {
      await expect(toc.locator(`a[href="#${anchor}"]`)).toHaveCount(1);
    }
  });

  test('lists the FAQ questions in the mobile "On this page" menu', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/influxdb3/which-influxdb-3/');
    const toc = page.locator('[data-component="page-toc"]');
    await toc.locator('.page-toc-toggle').click();
    await expect(
      toc.locator(`a[href="#${FAQ_QUESTIONS[0].anchor}"]`)
    ).toBeVisible();
  });

  test('does not leak raw markdown into the rendered HTML', async ({
    page,
  }) => {
    const html = await page
      .locator('article.article--content')
      .evaluate((el) => el.innerHTML);
    expect(html).not.toMatch(/(^|\n)## /);
    expect(html).not.toMatch(/(^|\n)- \[/);
  });

  test('self-canonicals to its own URL', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/influxdb3\/which-influxdb-3\/?$/
    );
  });

  test('renders the decision table rows', async ({ page }) => {
    await expect(
      page.locator('th', { hasText: 'Your situation' })
    ).toBeVisible();
    for (const row of [
      'New production deployment',
      'Free, open source, single-node',
      'Multi-tenant, self-service cloud for smaller workloads',
      'Managed single-tenant cloud',
      'Kubernetes',
      'Running InfluxDB 1 or InfluxDB 2 today',
    ]) {
      await expect(page.locator('td', { hasText: row }).first()).toBeVisible();
    }
  });

  test('links to verified migration guide URLs', async ({ page }) => {
    for (const product of ['enterprise', 'core']) {
      await expect(
        page.locator(
          `a[href="/influxdb3/${product}/get-started/migrate-from-influxdb-v1-v2/"]`
        )
      ).not.toHaveCount(0);
    }
  });

  test('emits FAQPage JSON-LD that matches the visible questions and answers', async ({
    page,
  }) => {
    const faq = await readFaqJsonLd(page);
    expect(faq, 'FAQPage JSON-LD present').toBeDefined();
    expect(faq['@context']).toBe('https://schema.org');
    expect(faq.mainEntity).toHaveLength(FAQ_QUESTIONS.length);

    const visibleQuestions = await page
      .locator('h3:has(+ div.faq-answer)')
      .allTextContents();
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      visibleQuestions.map((q) => q.trim())
    );

    for (const q of faq.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.acceptedAnswer['@type']).toBe('Answer');
      expect(q.acceptedAnswer.text).toBeTruthy();
      expect(q.acceptedAnswer.text).not.toMatch(/<[a-z][^>]*>/i);
    }
  });
});

test.describe('FAQ heading level on other pages', () => {
  test('/platform/faq/ keeps its questions as H2s', async ({ page }) => {
    await page.goto('/platform/faq/');
    await expect(page.locator('h2#what-is-time-series-data')).toBeVisible();
    await expect(page.locator('div.faq-answer h3')).toHaveCount(0);
    await expect(page.locator('h3 + div.faq-answer')).toHaveCount(0);
  });
});

test.describe('Cloud 1 note', () => {
  for (const url of ['/enterprise_influxdb/v1/', '/influxdb/v1/']) {
    test(`${url} links to an existing platform heading`, async ({ page }) => {
      await page.goto(url);
      const link = page.locator('.note a[href^="/platform/#"]').first();
      const href = await link.getAttribute('href');
      expect(href).toBe('/platform/#migrate-to-influxdb-3');
      await page.goto('/platform/');
      await expect(page.locator('h2#migrate-to-influxdb-3')).toHaveCount(1);
    });
  }
});
