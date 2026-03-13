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

## Output Format

**IMPORTANT:** Your response must follow this exact format for clear completion signaling.

### Response Header

Start your response with this header (fill in the values):

```markdown
## 🔍 Visual Review Complete — Copilot

| Status | Details |
|--------|---------|
| **Result** | ✅ APPROVED / ⚠️ CHANGES REQUESTED / 🔍 NEEDS HUMAN REVIEW |
| **Pages Reviewed** | X page(s) |
| **Issues Found** | X BLOCKING, X WARNING, X INFO |
| **Reviewed** | YYYY-MM-DD HH:MM UTC |
```

### Result Rules

- **APPROVED** — Zero BLOCKING issues found
- **CHANGES REQUESTED** — One or more BLOCKING issues found  
- **NEEDS HUMAN REVIEW** — Cannot determine severity or page didn't load

### Issue Format

List any issues found using this format:

```markdown
### Issues Found

#### BLOCKING

- **[page-url]** — Description of the issue
  - Suggested fix: ...

#### WARNING

- **[page-url]** — Description of the issue

#### INFO

- **[page-url]** — Observation
```

If no issues are found, write:

```markdown
### Issues Found

No issues found. All pages pass visual review.
```

## Severity Definitions

Follow the shared review comment format, severity definitions, and label
mapping in
[templates/review-comment.md](../templates/review-comment.md).

## Preview URLs
