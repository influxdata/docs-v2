# Tab content sections get real fragment ids

**Status:** Planning — no PR yet
**Closes:** [#7703](https://github.com/influxdata/docs-v2/issues/7703)

## Goal

Make `[Label](#slug)`-style tab links in `code-tabs`/`tabs` shortcodes resolve
to a real `id` in the rendered HTML, so `.ci/link-checker` stops reporting
"Fragment not found" on tab labels, and direct/shared links to a specific tab
work without the `?t=` query param.

## Why now

PR #7701 failed CI on `[Linux](#linux)` / `[macOS](#macos)` / `[Homebrew](#homebrew)`
tab links it never wrote — it only moved an existing page into shared content.
The fragments were already broken; lychee just never checked them before. Any
of the 483 files using these shortcodes (`code-tabs-wrapper`: 170,
`tabs-wrapper`: 313) can now trip an unrelated CI failure on unrelated tab
labels, so this needs to land before the next page-move-shaped PR hits it
again.

## Investigation findings (this session)

- Every `code-tabs`/`tabs` usage in `content/` is wrapped by its
  `code-tabs-wrapper`/`tabs-wrapper` counterpart — confirmed by scanning all
  content files for a bare shortcode without a matching wrapper (0 found).
  The wrapper is a reliable place to do cross-shortcode work.
- Most tab links use `(#)` (1,776 occurrences) — an empty fragment, which
  lychee/browsers treat as "top of page" and don't flag. Only links with a
  real slug are affected. A scan of `code-tabs`/`tabs` blocks specifically
  (not just any `(#slug)` in a file) found 71 such links across \~15 files,
  mostly in shared content (`content/shared/...`), so the actual footprint of
  currently-broken fragments is much smaller than the 483-file blast radius —
  but any future PR touching those 483 files is one careless label away from
  adding a new one.
- Authors already hand-derive slugs the way `anchorize`/goldmark would:
  `[SQL & InfluxQL](#sql--influxql)`, `[influxctl](#influxctl)`. This confirms
  slugifying the tab label text is the right source for the id, not a novel
  convention.
- **Nesting is real, not hypothetical.** 24 files nest a `code-tabs-wrapper`
  block inside a `tabs-wrapper` block (e.g.
  `content/telegraf/v1/install.md:152-518` wraps two separate
  `code-tabs-wrapper` blocks inside one outer `tabs-wrapper`). Any
  implementation that pairs tab links to content sections by scanning a
  wrapper's rendered `.Inner` must not descend into a nested wrapper's own
  tabs when doing that pairing, or it will mis-assign ids across the boundary.

## Decisions

- **Pairing happens in the wrapper shortcode (`code-tabs-wrapper.html` /
  `tabs-wrapper.html`), not in `code-tabs.html` or `code-tab-content.html`
  individually.** Those two shortcodes render independently with no shared
  context — `code-tab-content` never sees the label text from `code-tabs`.
  The wrapper is the only place that receives both already-rendered as
  `.Inner`, so it's the only place that can associate the nth tab link with
  the nth content section. Rejected: adding an explicit `id`/`label`
  parameter to every `code-tab-content`/`tab-content` call — correct in
  principle but requires editing all 483 content files, which is exactly the
  blast radius this fix needs to avoid.
- **Derive the id by slugifying the tab link's visible label text**, not its
  href. The href is frequently `#` (no real fragment authored), so the label
  is the only reliable signal, and it matches how authors already hand-pick
  slugs for the minority of links that do carry one.
- **Nested wrappers must be excluded from a wrapper's own pairing pass.** The
  implementation needs a way to process only the current wrapper's direct
  `code-tabs`/`code-tab-content` (or `tabs`/`tab-content`) children and skip
  past any nested wrapper's contents wholesale, rather than a flat regex over
  the whole `.Inner` string. This is the main open implementation risk — Hugo
  templates have no DOM API, so this will likely need careful non-greedy
  regex/`findRE` work with the nested-wrapper case as an explicit test input,
  not an afterthought.
- **Collision handling deferred to implementation, not resolved here.** The
  issue's caution about colliding with an existing heading id on the same
  page is real (goldmark auto-generates heading ids) but wasn't fully modeled
  in this planning pass — implementation must check for and disambiguate
  collisions before landing, using a representative sample of pages that mix
  headings and tabs with overlapping words (e.g. a "## Linux" heading plus a
  "Linux" tab).

## Explicitly out of scope

- Fixing `production.lycherc.toml`'s dead `[reporting] include_fragments =
  false` setting — noted in the issue as a separate, unrelated finding.
- Changing `tabbedContent()`'s index-based click switching in
  `assets/js/tabbed-content.js` — ids are additive; the JS behavior is
  unchanged.
- Backfilling real slugs onto the 1,776 `(#)` empty-fragment tab links — they
  aren't broken (empty fragment isn't flagged), so there's no forcing
  function to touch them as part of this fix.

## How to update

Once implemented: the id-generation logic lives in
`layouts/shortcodes/code-tabs-wrapper.html` and `tabs-wrapper.html`. A future
contributor adding a new tab-style shortcode variant should follow the same
wrapper-does-the-pairing pattern rather than trying to compute ids inside the
leaf shortcodes.

## Verification

- `link-checker check` reports no "Fragment not found" errors for
  `code-tabs`/`tabs` anchors across the \~15 files identified in this session
  as having non-empty tab-link fragments (e.g.
  `content/shared/influxdb-v1/tools/influx-cli/use-influx-cli.md`,
  `content/influxdb3/clustered/admin/tables/list.md`).
- Render `content/telegraf/v1/install.md` (nested `tabs-wrapper` >
  `code-tabs-wrapper`) and confirm ids are assigned correctly on both levels
  with no cross-boundary bleed.
- Existing tab-switching behavior (index-based click handling, `?t=`
  query param persistence) is unchanged — covered by Cypress e2e per
  `.agents/skills/cypress-e2e-testing`.
