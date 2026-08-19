---
paths:
  - "layouts/**/*.html"
---

<!-- This file is auto-generated from .agents/instructions. Do not edit directly. -->

<!-- Run 'yarn build:agent:instructions' to regenerate it. -->

# Layout and Shortcode Implementation Guidelines

**Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
**Test examples**: [content/example.md](../../content/example.md)

**For detailed Hugo template development workflow**, see
[hugo-template-dev skill](../../.agents/skills/hugo-template-dev/SKILL.md) which covers:

- Hugo template syntax and data access patterns
- Build-time vs runtime testing strategies
- Shortcode implementation best practices
- Complete TDD workflow for Hugo templates

## No Magic Values in Template Logic

Templates operate on data and stay ignorant of the values in that data.
A product name, version segment, or `data/products.yml` key must never appear
as a string literal in template logic.
Nobody should have to edit a template because a product was renamed or added.

Never write any of these in `layouts/**`:

- A slice of product names or version segments used in a condition, such as a
  list of the versions that count as current or the products that support Flux.
- A single hardcoded product comparison that branches behavior, such as testing
  whether the first path segment equals a specific product.
- Deriving a `data/products.yml` key by matching the URL path when the page
  already declares one.

This file is generated into `layouts/AGENTS.md`, and Hugo parses every file
under `layouts/` as a template, so it carries no Go template examples.
For the annotated before and after, see the
[hugo-template-dev skill](../../.agents/skills/hugo-template-dev/SKILL.md).

Do this instead:

1. Put the fact in `data/products.yml` as a per-product field — a boolean such
   as `supports_flux`, `has_support_contract`, or `search_includes_resources` —
   and read it with a `| default` that covers products that don't set it.
2. Resolve the product with `partial "product/get-data.html"` or
   `partial "product/get-context.html"`, which read the page's cascade `product`
   param.
   Every product section declares `product` and `version` by cascade in its
   section `_index.md`, so the key is stated rather than guessed.
3. When two templates need the same decision, extract it into one partial so
   the two can't drift.
   `layouts/partials/product/is-latest.html` is the worked example.

The one exception is a value that must match an external system rather than a
product fact.
The Algolia search tag in `layouts/partials/header/search-attributes.html`
stays path-derived because Algolia indexed every record under the crawled URL.
Comment any such case in the template so the next reader doesn't "fix" it.

For the before/after example and the incident behind this rule, see
[hugo-template-dev skill](../../.agents/skills/hugo-template-dev/SKILL.md).

## Implementing Shortcodes

When creating or modifying Hugo layouts and shortcodes:

1. Use test-driven development using `/cypress/`
2. Use Hugo template syntax and functions
3. Follow existing patterns in `/layouts/shortcodes/`
4. Test in [content/example.md](../../content/example.md)
5. Document new shortcodes in [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)

## Shortcode Pattern

```html
<!-- layouts/shortcodes/example.html -->
{{ $param := .Get 0 }}
{{ $namedParam := .Get "name" }}

<div class="example">
  {{ .Inner | markdownify }}
</div>
```

## Testing

**IMPORTANT:** Use test-driven development with Cypress.

Add shortcode usage examples to `content/example.md` to verify:

- Rendering in browser
- Hugo build succeeds
- No console errors
- JavaScript functionality works as expected (check browser console for errors)
- Interactive elements behave correctly (click links, buttons, etc.)

### TDD Workflow

1. Add Cypress tests (high-level to start).
2. Run tests and make sure they fail.
3. Implement code changes
4. Run tests and make sure they pass.
5. Add and refine tests.
6. Repeat.

### Manual Testing Workflow

1. Make changes to shortcode/layout files
2. Wait for Hugo to rebuild (check terminal output)
3. Get the server URL from the log
4. Open browser DevTools console (F12)
5. Test the functionality and check for JavaScript errors
6. Verify the feature works as intended before marking complete

See [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md) for complete shortcode
documentation.

## Related Resources

- **Complete Hugo template workflow**:
  [hugo-template-dev skill](../../.agents/skills/hugo-template-dev/SKILL.md)
- **Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
- **Test examples**: [content/example.md](../../content/example.md)
- **Article-level page actions** (buttons/links next to the page title — when
  to use, how to add a new one):
  [DOCS-PAGE-ACTIONS.md](../../DOCS-PAGE-ACTIONS.md)
