# Give tab content sections real, addressable fragment ids

`code-tabs`/`tabs` shortcodes rendered without an `id` on their content
sections, so a `[Label](#slug)` link an author wrote by hand never resolved to
anything. PR #7701 tripped this on `[Linux](#linux)`/`[macOS](#macos)`/
`[Homebrew](#homebrew)` links it never wrote, just by moving existing content
into a shared page -- the fragments were already broken; `.ci/link-checker`
had just never checked them before. Both shortcodes are used in 483 files, so
any future page-move-shaped PR was one careless tab label away from the same
failure ([#7703](https://github.com/influxdata/docs-v2/issues/7703)).

Ids are assigned by pairing each tab link with its content section by
document order, inside `layouts/partials/tab-fragment-ids.html`, and
slugifying the link's visible label text the way `anchorize` would --
authors already hand-derive slugs this way (`[SQL & InfluxQL](#sql--influxql)`),
so it's not a novel convention. Pairing happens in the wrapper shortcodes
(`code-tabs-wrapper.html`/`tabs-wrapper.html`), not in the leaf shortcodes:
`code-tab-content` never sees `code-tabs`'s label text, since the two render
independently, and the wrapper is the only place that receives both as
already-rendered `.Inner`. We rejected adding an explicit `id`/`label`
parameter to every `code-tab-content` call -- correct in principle, but it's
an edit to all 483 files for a problem the wrapper can solve unedited.

Assigning the id isn't enough on its own: the tab link's `href` is rewritten
in the same pass, from whatever the author wrote (usually empty, `#`) to
match. Without this, a page with two tab groups sharing a label (two `[Go]`
tabs, say) still points both links at the first group's fragment even though
the second group's content correctly got `id="go-2"` -- the id existed but
the link that was supposed to reach it didn't. This was the actual bug; the
missing id was a symptom.

Ids collide with two other things ids can collide with, and both needed a
fix. Same-page tab labels are deduplicated against a running list in
`$page.Store`, appending `-2`, `-3` on repeat -- this part worked from the
start. Existing heading ids didn't: the collision check read
`$page.RawContent`, which is a stub body on a `source:` page (its real
markdown lives in a different file, `readFile`'d and rendered by
`layouts/partials/article/content.html`). That silently produced duplicate
ids on 14 of 433 tab-bearing pages, including `influxdb3/core/get-started/query/`
(`id="sql"` on both an `<h3>` and a `<section class="code-tab-content">`). The
fix keeps the collision check inside the wrapper shortcode -- nesting safety
(24 files nest a `code-tabs-wrapper` inside a `tabs-wrapper`) already works
there for free, because Hugo's own shortcode parser resolves `.Inner`
boundaries; redoing that boundary-matching by hand against a fully-rendered
HTML string would reintroduce exactly the fragile-regex risk this design
avoids. Instead, `content.html` hands the wrapper the *correct* raw markdown
through `$page.Store.Set "tabFragmentRawContent"` before rendering, for both
the `source:` and non-`source:` branches. `$page.Fragments`/`$page.Content`
can't be read directly from a shortcode invoked during that same page's
render -- it deadlocks the build -- which is why this goes through raw
markdown and a regex heading scan rather than the rendered heading ids.

Durable ids are opt-in, via an `id` argument on the wrapper
(`{{< tabs-wrapper id="install" >}}` → `install-linux`, `install-macos`).
We rejected deriving a prefix from the nearest preceding heading: it reads
well but isn't reachable from the rendered HTML without the same fragile
positional scanning, and it re-breaks every link whenever a heading is
reworded -- the exact failure mode this exists to prevent. The label-slug
fallback (no `id` given) stays positional and unstable under reordering,
which is acceptable because nothing outside the page links to a fallback id.

## Consequences

`.ci/link-checker` now passes on real tab anchors instead of only tolerating
the empty-fragment (`#`) convention most tab links already use. Authors get a
stable, shareable link to one tab by adding a wrapper `id`; without one nothing
changes except that the link now actually works.

The 1,776 existing `(#)` empty-fragment tab links are untouched -- an empty
fragment isn't flagged, so there's no forcing function to backfill them. The
`tabbedContent()` index-based click switching in `assets/js/tabbed-content.js`
is unaffected; ids and hrefs are additive.

Same-type wrappers nested inside each other (a `tabs-wrapper` directly inside
another `tabs-wrapper`) would break the split-on-class-tag pairing this relies
on, because both levels would match on the same content-class open tag. This
doesn't happen in the current 483 files -- nesting is always mixed-type
(`tabs-wrapper` > `code-tabs-wrapper`) -- but it's not structurally prevented.
