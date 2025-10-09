---
applyTo: "layouts/**/*.html"
---

# Layout and Shortcode Implementation Guidelines

**Shortcodes reference**: [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)
**Test examples**: [content/example.md](../../content/example.md)

## Implementing Shortcodes

When creating or modifying Hugo layouts and shortcodes:

1. Use Hugo template syntax and functions
2. Follow existing patterns in `/layouts/shortcodes/`
3. Test in [content/example.md](../../content/example.md)
4. Document new shortcodes in [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md)

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

Add usage examples to `content/example.md` to verify:
- Rendering in browser
- Hugo build succeeds
- No console errors

See [DOCS-SHORTCODES.md](../../DOCS-SHORTCODES.md) for complete shortcode documentation.
