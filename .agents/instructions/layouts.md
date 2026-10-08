---
name: layouts
description: Instructions for Hugo layout, partial, and shortcode implementation.
paths:
  - "layouts/**/*.html"
---

# Hugo layouts and shortcodes

Use the [hugo-template-dev skill](../skills/hugo-template-dev/SKILL.md) for
implementation and runtime verification. Follow existing shortcode patterns and
document user-facing shortcodes in [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md).

## Requirements

- Do not encode product names, versions, URL segments, or product-key guesses
  in template branching. Put product facts in `data/products.yml`, resolve page
  context through product partials, and share repeated decisions in a partial.
- The sole exception is an externally mandated path-derived value; explain it
  in a template comment.
- Add behavior coverage in Cypress and an example in
  [content/example.md](../../content/example.md) when appropriate. A Hugo build
  alone is insufficient for runtime behavior.
- Keep the line-protocol render hook Chroma-compatible and HTML-escape source;
  malformed input renders as escaped plain text.

Run `yarn verify:changed -- <files>` to identify manual checks.
