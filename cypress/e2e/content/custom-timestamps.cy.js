/// <reference types="cypress" />

/**
 * Custom Timestamps E2E Test Suite
 *
 * Tests for the sample-data date picker (custom-timestamps.js), which
 * rewrites the 2022-01-01 placeholder timestamps in
 * {{% influxdb/custom-timestamps %}} blocks to a date the reader chooses.
 *
 * The browser time zone is emulated so the local calendar date and the UTC
 * date can differ, which is where date formatting bugs show up.
 *
 * TEST SCENARIOS CHECKLIST:
 *
 * Selected date:
 * --------------
 * - [x] East of UTC: the selected day is used, not the day before
 * - [x] West of UTC: the selected day is used
 * - [x] The selected day is the one stored as the reader's preference
 *
 * Default date (no stored preference):
 * ------------------------------------
 * - [x] Defaults to the reader's local yesterday when local and UTC dates
 *       differ
 *
 * Sample data:
 * ------------
 * - [x] Every line protocol sample in a custom-timestamps block is rewritten
 */

const TEST_PAGE = '/influxdb3/cloud-serverless/get-started/write/';
const PREF_KEY = 'influxdata_docs_preferences';

// Unix seconds for 08:00:00 UTC on the given yyyy-mm-dd date
function firstSampleUnix(date) {
  return String(Date.parse(`${date}T08:00:00Z`) / 1000);
}

function setTimezone(timezoneId) {
  return cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setTimezoneOverride',
      params: { timezoneId },
    })
  );
}

// Select a date in the picker and submit it, as the Update button does
function selectDate(date) {
  cy.get('.custom-time-trigger a[data-action="open"]').click({ force: true });
  cy.get('#custom-date-selector').then(($el) => {
    $el[0].datepicker.setDate(date);
  });
  cy.get('#submit-custom-date').click({ force: true });
}

function storedStartDate(win) {
  const prefs = JSON.parse(win.localStorage.getItem(PREF_KEY) || '{}');
  return prefs.sample_get_started_date;
}

function assertSampleDate(date) {
  cy.get('span.custom-timestamps')
    .first()
    .should('contain.text', `${date}T08:00:00Z`)
    .and('contain.text', `${date}T20:00:00Z`);

  cy.window().then((win) => {
    expect(storedStartDate(win)).to.equal(date);
  });
}

describe('Custom timestamps date picker', () => {
  afterEach(() => {
    setTimezone('');
  });

  it('uses the selected date for readers east of UTC', () => {
    setTimezone('Asia/Tokyo');
    cy.visit(TEST_PAGE);

    selectDate('2025-03-15');
    assertSampleDate('2025-03-15');
  });

  it('uses the selected date for readers west of UTC', () => {
    setTimezone('America/Los_Angeles');
    cy.visit(TEST_PAGE);

    selectDate('2025-03-15');
    assertSampleDate('2025-03-15');
  });

  it("defaults to the reader's local yesterday", () => {
    setTimezone('Asia/Tokyo');
    // 2025-03-15 06:00 in Tokyo is still 2025-03-14 in UTC
    cy.clock(Date.parse('2025-03-14T21:00:00Z'), ['Date']);
    cy.visit(TEST_PAGE);

    assertSampleDate('2025-03-14');
  });

  it('rewrites every line protocol sample to the selected date', () => {
    setTimezone('UTC');
    cy.visit(TEST_PAGE);

    selectDate('2025-03-15');

    cy.get('.custom-timestamps pre')
      .filter(':contains("home,room=")')
      .should('have.length.greaterThan', 0)
      .each(($pre) => {
        const text = $pre.text();
        expect(text).to.contain(firstSampleUnix('2025-03-15'));
        expect(text).not.to.contain(firstSampleUnix('2022-01-01'));
      });
  });
});
