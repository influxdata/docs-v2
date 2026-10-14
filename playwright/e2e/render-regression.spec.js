import { expect, test } from '@playwright/test';

const escapedChromaFragments = [
  '<div class="highlight">',
  '<pre tabindex="0"',
  '<span class="line"><span class="cl"',
];
const highlightedCodeBlock = [
  'bash',
  'sh',
  'js',
  'python',
  'sql',
  'yaml',
  'json',
  'diff',
]
  .map((language) => `pre code.language-${language}`)
  .join(', ');

const representativePages = [
  {
    path: '/influxdb3/core/reference/sample-data/',
    exercises:
      'placeholders inside code-tab-content + custom-timestamps wrapper',
  },
  {
    path: '/influxdb3/enterprise/admin/backup-restore/',
    exercises:
      'placeholders inside tab-content wrapper (the page that regressed the most in #7079)',
  },
  {
    path: '/influxdb3/cloud-dedicated/reference/sample-data/',
    exercises:
      'placeholders with DATABASE_(TOKEN|NAME) regex grouping inside custom-timestamps wrapper',
  },
  {
    path: '/influxdb3/clustered/admin/users/add/',
    exercises: 'placeholders + callouts in nested expand wrappers',
  },
  {
    path: '/influxdb3/cloud-serverless/reference/sample-data/',
    exercises:
      'post-migration placeholders fence attribute with mixed legacy/new syntax',
  },
];

async function expectHighlightedCodeBlock(page) {
  await expect(page.locator(highlightedCodeBlock).first()).toBeAttached();
}

async function expectNoEscapedChromaFragments(page) {
  const codeTexts = await page.locator('pre code').allTextContents();
  for (const fragment of escapedChromaFragments) {
    expect(
      codeTexts.filter((text) => text.includes(fragment)),
      `code blocks containing escaped chroma fragment "${fragment}"`
    ).toEqual([]);
  }
}

function sectionUnderHeading(page, headingId) {
  return page.locator(
    `xpath=//*[@id="${headingId}"]/following-sibling::*` +
      `[not(self::h3)][preceding-sibling::h3[1][@id="${headingId}"]]`
  );
}

function diffLines(page, headingId, lineClasses) {
  return sectionUnderHeading(page, headingId).locator(
    lineClasses.map((lineClass) => `pre.chroma .${lineClass}`).join(', ')
  );
}

test.describe('Shortcode examples page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/example/');
  });

  test('renders /example/ with no escaped chroma fragments (#7079)', async ({
    page,
  }) => {
    await expectHighlightedCodeBlock(page);
    await expectNoEscapedChromaFragments(page);
  });

  test('highlights line protocol field families without changing source text', async ({
    page,
  }) => {
    const lineProtocol = page
      .locator(
        'xpath=//h3[contains(., "Line protocol fence")]/following-sibling::*'
      )
      .locator('code.language-lp')
      .first();

    await expect(lineProtocol).toContainText('a::b::c="quoted-value"');
    await expect(
      lineProtocol.locator('.nx', { hasText: 'cpu' }).first()
    ).toBeAttached();
    await expect(lineProtocol.locator('.lp-family-delimiter')).toHaveText([
      '::',
      '::',
      '::',
      '::',
    ]);
    await expect(
      lineProtocol.locator('.na', { hasText: 'b::c' }).first()
    ).toBeAttached();
    await expect(
      lineProtocol.locator('.s', { hasText: 'Unicode-value' }).first()
    ).toBeAttached();
  });

  test('uses escaped plain text for malformed line protocol', async ({
    page,
  }) => {
    const malformedFence = page
      .locator('p', { hasText: 'The malformed fence falls back' })
      .locator(
        'xpath=following-sibling::*[1][contains(concat(" ", normalize-space(@class), " "), " highlight ")]'
      )
      .locator('code.language-lp');

    await expect(malformedFence).toContainText('cpu field="unterminated');
  });
});

test.describe('Representative product pages (#7079)', () => {
  for (const { path, exercises } of representativePages) {
    test(`${path} — ${exercises}`, async ({ page }) => {
      await page.goto(path);
      await expectHighlightedCodeBlock(page);
      await expectNoEscapedChromaFragments(page);
    });
  }
});

test.describe('Diff fence highlighting (#7173)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/example/');
  });

  test('renders each .gd line on its own row in the subtractive fixture', async ({
    page,
  }) => {
    const deletedLines = diffLines(page, 'diff-fence--subtractive-only', [
      'gd',
    ]);
    await expect(deletedLines).toHaveCount(3);
    const rowTops = await deletedLines.evaluateAll((lines) =>
      lines.map((line) => Math.round(line.getBoundingClientRect().top))
    );
    expect(new Set(rowTops).size).toBe(rowTops.length);
  });

  test('applies display:block to .gd and .gi', async ({ page }) => {
    const changedLines = diffLines(
      page,
      'diff-fence--mixed-additions-and-deletions',
      ['gd', 'gi']
    );
    const displays = await changedLines.evaluateAll((lines) =>
      lines.map((line) => getComputedStyle(line).display)
    );
    expect(displays.length).toBeGreaterThanOrEqual(2);
    expect(new Set(displays)).toEqual(new Set(['block']));
  });

  test('extends the highlight past the visible width on overflowing lines', async ({
    page,
  }) => {
    const firstDeletedLine = diffLines(
      page,
      'diff-fence--subtractive-with-overflow',
      ['gd']
    ).first();
    const { lineWidth, visibleWidth } = await firstDeletedLine.evaluate(
      (line) => ({
        lineWidth: line.offsetWidth,
        visibleWidth: line.parentElement.clientWidth,
      })
    );
    expect(lineWidth).toBeGreaterThan(visibleWidth);
  });

  test('does not tint context lines in the surrounding-context fixture', async ({
    page,
  }) => {
    await expect(
      diffLines(page, 'diff-fence--subtractive-with-surrounding-context', [
        'gd',
      ])
    ).toHaveCount(2);
  });
});
