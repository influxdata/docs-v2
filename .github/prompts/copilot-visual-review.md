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

## Output

Follow the shared review comment format, severity definitions, and label
mapping in
[templates/review-comment.md](../templates/review-comment.md).

Adapt the "Files Reviewed" section to list preview URLs instead of file
paths.

## Preview URLs

