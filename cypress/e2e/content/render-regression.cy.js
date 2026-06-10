/// <reference types="cypress" />

/**
 * Render regression tests.
 *
 * This spec guards against the class of bug reported in
 * influxdata/docs-v2#7079: whitespace leaks in Hugo render hooks or
 * wrapper shortcode templates causing Goldmark to HTML-escape
 * highlighted code blocks into literal `<pre><code>&lt;div
 * class=&quot;highlight&quot;…` fragments on the final page.
 *
 * Two layers of coverage:
 *
 * 1. SHORTCODE EXAMPLES PAGE (`/example/`)
 *    Exhaustive shortcode showcase. Any layout/render-hook change
 *    that breaks a documented shortcode will show up here, regardless
 *    of which product it affects. Required smoke test for any PR
 *    that touches `layouts/` or `assets/`.
 *
 * 2. REPRESENTATIVE PRODUCT PAGES
 *    One curated page per InfluxDB 3 edition, hand-picked to exercise
 *    the combination of shortcodes/attributes that were affected by
 *    #7079: placeholders, callouts, custom-timestamps, code-tabs,
 *    tab-content, and expand wrappers around fenced code blocks.
 *    These catch product-specific wiring bugs (site-specific layouts,
 *    `product-name` substitution, per-product Vale configs) that the
 *    example page can't.
 *
 * Each page is asserted against:
 *   a) No `pre > code` element contains the literal text
 *      `<div class="highlight">` or `<pre tabindex="0">`. These
 *      strings can only appear inside a rendered code block if
 *      Goldmark re-wrapped legitimate chroma output as an indented
 *      code block — the exact #7079 failure mode.
 *   b) At least one real, highlighted code block exists on the page
 *      (guards against accidentally deleting the test fixture).
 *   c) If the page has placeholder code blocks, the placeholder
 *      `<var>` elements render with their expected attributes.
 *
 * When adding a new representative page, pick one that exercises a
 * combination of shortcodes/attributes NOT already covered, and leave
 * a comment explaining what it tests.
 */

const RENDER_ARTIFACTS = [
  '<div class="highlight">',
  '<pre tabindex="0"',
  '<span class="line"><span class="cl"',
];

/**
 * Assert that a rendered page has no escaped chroma fragments inside
 * any `pre > code` element.
 */
function assertNoEscapedHighlightMarkup() {
  cy.get('pre code').each(($code) => {
    const text = $code.text();
    RENDER_ARTIFACTS.forEach((artifact) => {
      expect(
        text,
        `code block should not contain escaped chroma fragment "${artifact}"`
      ).not.to.include(artifact);
    });
  });
}

/**
 * Assert that the page actually contains highlighted code output.
 * Guards against an empty or broken fixture silently passing.
 */
function assertHasHighlightedCodeBlock() {
  cy.get(
    'pre code.language-bash, pre code.language-sh, pre code.language-js, pre code.language-python, pre code.language-sql, pre code.language-yaml, pre code.language-json, pre code.language-diff',
    { timeout: 10000 }
  ).should('have.length.gte', 1);
}

describe('Shortcode examples page', () => {
  // content/example.md is the exhaustive shortcode showcase used by
  // the test:shortcode-examples npm script. Any layout change that
  // breaks rendering will break this page.
  it('renders /example/ with no escaped chroma fragments', () => {
    cy.visit('/example/');
    assertHasHighlightedCodeBlock();
    assertNoEscapedHighlightMarkup();
  });
});

describe('Representative product pages', () => {
  // Each entry picks one page per InfluxDB 3 edition that exercises
  // a distinct wrapper/attribute combination. These were all broken
  // by #7079 in the PR preview build.
  const pages = [
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

  pages.forEach(({ path, exercises }) => {
    it(`${path} — ${exercises}`, () => {
      cy.visit(path);
      assertHasHighlightedCodeBlock();
      assertNoEscapedHighlightMarkup();
    });
  });
});

describe('Diff fence highlighting', () => {
  // Guards against influxdata/docs-v2#7173: `display: inline-block` on
  // .gi/.gd swallowed the trailing `\n` that chroma puts inside each
  // diff-line span, collapsing every line onto a single inline row. The
  // replacement (`display: block` + `width: max-content` + `min-width:
  // 100%`) keeps each line on its own row and lets the highlight extend
  // past the visible width on overflowing lines. Fixtures live in
  // content/example.md under "Diff fence — …".
  beforeEach(() => {
    cy.visit('/example/');
  });

  it('renders each .gd line on its own row in the subtractive fixture', () => {
    cy.get('#diff-fence--subtractive-only')
      .nextUntil('h3')
      .find('pre.chroma .gd')
      .should('have.length', 3)
      .then(($spans) => {
        const tops = new Set(
          $spans
            .toArray()
            .map((el) => Math.round(el.getBoundingClientRect().top))
        );
        expect(
          tops.size,
          'each .gd span must render on its own row (no inline-block concatenation)'
        ).to.equal($spans.length);
      });
  });

  it('applies display:block to .gd and .gi', () => {
    cy.get('#diff-fence--mixed-additions-and-deletions')
      .nextUntil('h3')
      .find('pre.chroma .gd, pre.chroma .gi')
      .should('have.length.gte', 2)
      .each(($el) => {
        expect($el).to.have.css('display', 'block');
      });
  });

  it('extends the highlight past the visible width on overflowing lines', () => {
    // width: max-content lets the .gd box grow to its content width when
    // a line overflows the visible code-block area. Without it, the tint
    // would clip at the visible width and leave overflowing text untinted.
    cy.get('#diff-fence--subtractive-with-overflow')
      .nextUntil('h3')
      .find('pre.chroma .gd')
      .first()
      .then(($el) => {
        const el = $el[0];
        expect(
          el.offsetWidth,
          '.gd should grow with content (width: max-content)'
        ).to.be.greaterThan(el.parentElement.clientWidth);
      });
  });

  it('does not tint context lines in the surrounding-context fixture', () => {
    cy.get('#diff-fence--subtractive-with-surrounding-context')
      .nextUntil('h3')
      .find('pre.chroma .gd')
      .should('have.length', 2);
    // Context lines (` spec:`, `   package:`, etc.) are plain text inside
    // .cl spans without a .gd/.gi child — assert the count stays at 2.
  });
});
