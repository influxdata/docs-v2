---
applyTo: "layouts/**/*.html"
---

# Layout and Shortcode Implementation Guidelines

**Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
**Test examples**: [content/example.md](../../content/example.md)

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

See [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md) for complete shortcode documentation.
