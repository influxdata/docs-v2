# Review Comment Format

Shared definitions for severity levels, comment structure, and result → label
mapping. Used by doc-review-agent.md (local review sessions) and
copilot-visual-review.md (rendered page review).

## Severity Levels

### BLOCKING

Issues that will cause incorrect rendering, broken pages, or misleading
content. These must be fixed before merge.

Examples:
- Missing required frontmatter (`title`, `description`)
- Unclosed or malformed shortcode tags
- Wrong product name in content (e.g., "InfluxDB 3" in v2 docs)
- Broken `source:` path for shared content
- h1 heading in content body
- Raw shortcode syntax visible on rendered page (`{{<` or `{{%`)
- 404 errors on preview pages
- Wrong product name in header or breadcrumbs

### WARNING

Style issues or minor visual problems that should be fixed but don't break
functionality or correctness.

Examples:
- Missing semantic line feeds (multiple sentences on one line)
- Heading level skipped (h2 → h4)
- Long option not used in CLI examples (`-o` instead of `--output`)
- Missing `weight` in frontmatter
- Minor layout issues (overlapping text, collapsed sections)
- Missing images
- Placeholder text visible (`TODO`, `FIXME`)

### INFO

Suggestions and observations. Not problems.

Examples:
- Opportunity to use a shared content file
- Unusually long page that could be split
- Code block missing language identifier
- Cosmetic improvements

## Comment Structure

Post a single review comment on the PR with this structure:

```markdown
## Doc Review Summary

**Result:** APPROVED | CHANGES REQUESTED | NEEDS HUMAN REVIEW

### Issues Found

#### BLOCKING

- **file:line** — Description of the issue
  - Suggested fix: ...

#### WARNING

- **file:line** — Description of the issue

#### INFO

- **file:line** — Observation

### Files Reviewed

- `path/to/file.md` — Brief summary of changes
```

Adapt the "Files Reviewed" section to the review context:
- **Source review:** list file paths from the diff
- **Visual review (Copilot):** list preview URLs instead of file paths

## Result Rules

- Zero BLOCKING issues → **APPROVED**
- Any BLOCKING issues → **CHANGES REQUESTED**
- Cannot determine severity or diff is ambiguous → **NEEDS HUMAN REVIEW**
- Only report issues you are confident about. Do not guess.
- Group issues by file when multiple issues exist in the same file.

## Result → Label Mapping

| Result | Label |
|--------|-------|
| APPROVED | `review:approved` |
| CHANGES REQUESTED | `review:changes-requested` |
| NEEDS HUMAN REVIEW | `review:needs-human` |

Labels are mutually exclusive. Apply manually after review — Copilot code
review uses GitHub's native "Comment" review type and does not manage labels.
