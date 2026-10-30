import { expect, test } from '@playwright/test';

const serverlessWritePage = '/influxdb3/cloud-serverless/get-started/write/';
const preferencesKey = 'influxdata_docs_preferences';

function firstSampleSeconds(date) {
  return String(Date.parse(`${date}T08:00:00Z`) / 1000);
}

async function selectSampleDate(page, date) {
  await page.locator('.custom-time-trigger a[data-action="open"]').click();
  await page
    .locator('#custom-date-selector')
    .evaluate((picker, selected) => picker.datepicker.setDate(selected), date);
  await page.locator('#submit-custom-date').click();
}

async function savedSampleDate(page) {
  return page.evaluate(
    (key) =>
      JSON.parse(localStorage.getItem(key) || '{}').sample_get_started_date,
    preferencesKey
  );
}

async function expectSampleDate(page, date) {
  const timeRange = page.locator('span.custom-timestamps').first();
  await expect(timeRange).toContainText(`${date}T08:00:00Z`);
  await expect(timeRange).toContainText(`${date}T20:00:00Z`);
  expect(await savedSampleDate(page)).toBe(date);
}

test.describe('Custom timestamps date picker', () => {
  test.describe('east of UTC', () => {
    test.use({ timezoneId: 'Asia/Tokyo' });

    test('uses the selected date (#6424)', async ({ page }) => {
      await page.goto(serverlessWritePage);
      await selectSampleDate(page, '2025-03-15');
      await expectSampleDate(page, '2025-03-15');
    });

    test("defaults to the reader's local yesterday", async ({ page }) => {
      await page.clock.setFixedTime(new Date('2025-03-14T21:00:00Z'));
      await page.goto(serverlessWritePage);
      await expectSampleDate(page, '2025-03-14');
    });
  });

  test.describe('west of UTC', () => {
    test.use({ timezoneId: 'America/Los_Angeles' });

    test('uses the selected date', async ({ page }) => {
      await page.goto(serverlessWritePage);
      await selectSampleDate(page, '2025-03-15');
      await expectSampleDate(page, '2025-03-15');
    });
  });

  test.describe('UTC', () => {
    test.use({ timezoneId: 'UTC' });

    test('rewrites every line protocol sample to the selected date (#6424)', async ({
      page,
    }) => {
      await page.goto(serverlessWritePage);
      await selectSampleDate(page, '2025-03-15');

      const sampleBlocks = page
        .locator('.custom-timestamps pre')
        .filter({ hasText: 'home,room=' });
      await expect(sampleBlocks.first()).toContainText(
        firstSampleSeconds('2025-03-15')
      );
      const sampleTexts = await sampleBlocks.allTextContents();
      expect(sampleTexts.length).toBeGreaterThan(0);
      expect(
        sampleTexts.filter(
          (text) =>
            !text.includes(firstSampleSeconds('2025-03-15')) ||
            text.includes(firstSampleSeconds('2022-01-01'))
        )
      ).toEqual([]);
    });
  });
});
