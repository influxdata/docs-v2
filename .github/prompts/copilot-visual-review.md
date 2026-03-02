# Visual Review Prompt

Review the rendered documentation pages at the preview URLs listed below.
Check each page for visual and structural issues that are invisible in the
Markdown source.

## Checklist

For each preview URL, verify:

- [ ] **No raw shortcodes** — No `{{<` or `{{%` syntax visible on the page
- [ ] **No placeholder text** — No `PLACEHOLDER`, `TODO`, `FIXME`, or
      template variables visible in rendered content
- [ ] **Layout intact** — No overlapping text, missing images, or collapsed
      sections
- [ ] **Code blocks render correctly** — No raw HTML fences or Markdown
      syntax visible inside code blocks
- [ ] **Product names correct** — Page header, breadcrumbs, and sidebar show
      the correct product name
- [ ] **No 404s or errors** — Page loads without error states
- [ ] **Navigation correct** — Sidebar entries link to the right pages and
      the page appears in the expected location

## Severity

- **BLOCKING:** Raw shortcode syntax visible, 404 errors, wrong product
  name in header/breadcrumbs
- **WARNING:** Minor layout issues, missing images, placeholder text
- **INFO:** Cosmetic suggestions

## Output

Post your findings as a reply to this comment. List issues by page URL
with severity level.

## Preview URLs

