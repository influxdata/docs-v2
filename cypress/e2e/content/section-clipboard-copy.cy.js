/**
 * Regression guard for influxdata/docs-v2#6792
 * ("Section markdown truncated in clipboard").
 *
 * The format selector's "Copy section for AI" option fetches the section's
 * `index.section.md` and writes it to the clipboard. This test asserts the
 * clipboard receives the COMPLETE file — same length and content — on the real
 * reported page, so a truncation regression in the fetch/clipboard runtime path
 * is caught.
 *
 * Diagnosis (see PLAN / #6792): generation is complete — the build-time
 * completeness test (`markdown-completeness.test.mjs`) proves `index.section.md`
 * equals the sum of its parts. So if this test fails, the bug is in the runtime
 * path (`assets/js/components/format-selector.ts` → fetch → clipboard), which is
 * a separate follow-up tracked by #6792, not the converter migration.
 */
describe('Section markdown clipboard copy (#6792)', () => {
  // The page named in the issue: a section with child pages.
  const SECTION_URL = '/influxdb3/enterprise/admin/last-value-cache/';

  before(() => {
    // Generate the per-page and section markdown for this path.
    cy.exec(
      'node scripts/build-llm-markdown.js --public-dir public --path influxdb3/enterprise/admin/last-value-cache',
      { failOnNonZeroExit: false, timeout: 60000 }
    );
  });

  it('copies the full index.section.md to the clipboard (not truncated)', () => {
    cy.visit(SECTION_URL, {
      onBeforeLoad(win) {
        // Capture what gets written to the clipboard.
        cy.stub(win.navigator.clipboard, 'writeText')
          .resolves()
          .as('writeText');
      },
    });

    // Open the format selector and copy the section.
    cy.get(
      '[data-component="format-selector"] .format-selector__button'
    ).click();
    cy.get('[data-dropdown-menu].is-open [data-option="copy-section"]').click();

    cy.get('@writeText').should('have.been.calledOnce');

    // The clipboard text must equal the served section file, byte for byte.
    cy.request(`${SECTION_URL}index.section.md`).then((resp) => {
      const expected = resp.body;
      cy.get('@writeText').then((stub) => {
        const clipboardText = stub.firstCall.args[0];
        expect(
          clipboardText.length,
          'clipboard length should equal the section file length'
        ).to.eq(expected.length);
        expect(clipboardText).to.eq(expected);
      });
    });
  });
});
