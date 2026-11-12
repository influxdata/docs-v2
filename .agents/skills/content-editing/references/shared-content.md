# Shared content

Use `source: /shared/...` only in product stubs. Shared source files have no
frontmatter. Identify and review every consumer before editing shared content
by searching product pages for the shared file's `source:` path.
`docs edit <url-or-path>` opens files matching the requested page and adds their
shared source; it does not discover every consumer or automatically touch stubs.

When previewing shared-source changes with a running `hugo server`, touch each
consuming stub or restart the server because the watcher doesn't automatically
rebuild consumers. Fresh builds, including CI builds and checks, read the shared
source without stub touches; affected-page detection is separate from watcher
behavior. Edit a stub only when its frontmatter needs to change. A shared body
edit alone does not require a committed stub diff. A filesystem `touch` changes
timestamps and ordinarily produces no Git diff; don't make artificial frontmatter
edits to carry that timestamp into CI. See
[local previews of shared content](../../../../DOCS-FRONTMATTER.md#local-previews-of-shared-content).

The `source` field transcludes a whole shared body; the site has no declarative
fragment include for composing smaller product-specific page sections. Before
sharing or changing a source, compare the supported feature and API surface and
the sibling navigation for every consumer. Share a claim or link only when its
target exists for every consumer. Gate a small product difference with
`show-in`; use separate sources when the page surfaces materially differ. Treat
a link to a missing product page as a blocking surface mismatch, not only a
broken link.

Keep conditional shortcode boundaries outside complete Markdown containers.
For example, wrap an entire callout with `show-in`; don't open or close
`show-in` inside the callout's blockquote, list, or table syntax. When a shared
edit changes conditional content or container boundaries, render every consumer
and inspect the resulting content and layout in a browser before pushing.
Source-only checks don't detect split callouts and similar DOM regressions.
