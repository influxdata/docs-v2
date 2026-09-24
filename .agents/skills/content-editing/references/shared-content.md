# Shared content

Use `source: /shared/...` only in product stubs. Shared source files have no
frontmatter. Find every consumer before a direct edit; update or touch each stub
so Hugo rebuilds it. `docs edit <url>` performs this discovery.

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
