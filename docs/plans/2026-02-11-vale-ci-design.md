# Vale CI Integration Design

## Overview

Add Vale style linting to GitHub Actions CI to enforce documentation quality standards on pull requests. The workflow blocks merging on style errors and provides actionable feedback through inline annotations and PR summary comments.

## Goals

1. **Block merging on style errors** - PRs with Vale errors cannot be merged
2. **Provide informational feedback** - Warnings and suggestions shown but don't block
3. **Support humans and AI agents** - Structured output that both can act on autonomously

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | Content + instruction files | Match local Lefthook behavior |
| Config handling | Smart detection per file | Respect product-specific branding rules |
| Reporting | Inline annotations + PR comment | Context on lines + overview for agents |
| Filter mode | Added lines only | Avoid noise from pre-existing issues |
| Alert level | Errors block, warnings don't | Match current local behavior |
| Vale installation | Docker (`jdkato/vale:latest`) | Always current, matches local setup |

## Files to Create

```
.github/
├── scripts/
│   ├── resolve-shared-content.sh   # Shared content resolution
│   └── vale-check.sh               # Vale runner with config mapping
└── workflows/
    └── pr-vale-check.yml           # Main workflow
```

## Workflow Architecture

```
pr-vale-check.yml
├── Trigger: pull_request on markdown files
├── Steps:
│   ├── 1. Checkout repository
│   ├── 2. Detect changed files (GitHub API)
│   ├── 3. Skip if no files to check
│   ├── 4. Resolve shared content → product pages
│   ├── 5. Run Vale via Docker (grouped by config)
│   ├── 6. Process results & generate annotations
│   ├── 7. Post PR comment summary
│   ├── 8. Upload results artifact
│   └── 9. Fail if errors found
```

## Trigger Paths

```yaml
on:
  pull_request:
    paths:
      - 'content/**/*.md'
      - 'README.md'
      - 'DOCS-*.md'
      - '**/AGENTS.md'
      - '**/CLAUDE.md'
      - '.github/**/*.md'
      - '.claude/**/*.md'
    types: [opened, synchronize, reopened]
```

## Shared Content Resolution

Files in `content/shared/` are sourced by product-specific pages. When a shared file changes, Vale must lint the consuming pages (which have product-specific configs).

**Script**: `.github/scripts/resolve-shared-content.sh`

**Logic**:
1. For each changed file:
   - If `content/shared/*`: find all pages with `source:` frontmatter pointing to it
   - Else: pass through unchanged
2. Output resolved file list

**Example**:
```
Input:
  content/shared/influxdb3-cli/admin/database/create.md

Output:
  content/influxdb3/core/reference/cli/influxdb3/admin/database/create.md
  content/influxdb3/enterprise/reference/cli/influxdb3/admin/database/create.md
```

**Reusability**: This script can be used by other workflows (link-checker, tests) that also need shared content resolution.

## Vale Config Mapping

**Script**: `.github/scripts/vale-check.sh`

Maps files to their Vale config based on path:

| File Pattern | Vale Config |
|--------------|-------------|
| `content/influxdb3/cloud-dedicated/**` | `content/influxdb3/cloud-dedicated/.vale.ini` |
| `content/influxdb3/cloud-serverless/**` | `content/influxdb3/cloud-serverless/.vale.ini` |
| `content/influxdb/v2/**` | `content/influxdb/v2/.vale.ini` |
| `content/**/*.md` (other) | `.vale.ini` |
| Non-content files | `.vale-instructions.ini` |

Files are grouped by config, then Vale runs once per group to minimize Docker invocations.

## Vale Execution

Uses Docker to match local development:

```bash
docker run --rm \
  -v $(pwd):/workdir \
  -w /workdir \
  jdkato/vale:latest \
  --config=$CONFIG \
  --output=JSON \
  $FILES
```

## Output Processing

### GitHub Annotations

```bash
# Errors (visible in Files Changed, block merge)
echo "::error file=${FILE},line=${LINE},title=${CHECK}::${MESSAGE}"

# Warnings (visible, don't block)
echo "::warning file=${FILE},line=${LINE},title=${CHECK}::${MESSAGE}"

# Suggestions (visible, don't block)
echo "::notice file=${FILE},line=${LINE},title=${CHECK}::${MESSAGE}"
```

### PR Summary Comment

Posted via `github-script` action:

```markdown
## Vale Style Check Results

| Metric | Count |
|--------|-------|
| Files checked | 12 |
| Errors | 3 |
| Warnings | 7 |
| Suggestions | 2 |

### Errors (blocking)

| File | Line | Rule | Message |
|------|------|------|---------|
| `content/influxdb3/core/get-started.md` | 42 | InfluxDataDocs.Branding | Use 'InfluxDB' instead of 'influxdb' |

<details>
<summary>Warnings (7)</summary>

| File | Line | Rule | Message |
|------|------|------|---------|
| ... |

</details>

---
❌ **Check failed** — fix 3 error(s) before merging.
```

## Exit Behavior

- **Exit 0**: No errors (warnings/suggestions allowed)
- **Exit 1**: One or more errors (blocks merge)
- Summary comment posted in both cases

## Implementation Tasks

1. [ ] Create `.github/scripts/resolve-shared-content.sh`
2. [ ] Create `.github/scripts/vale-check.sh`
3. [ ] Create `.github/workflows/pr-vale-check.yml`
4. [ ] Test on a PR with intentional Vale errors
5. [ ] Update `pr-link-check.yml` to use shared resolution script
6. [ ] Document in DOCS-TESTING.md

## Future Considerations

- **Caching**: Cache Docker image pull across runs
- **Parallel execution**: Run Vale config groups in parallel if performance becomes an issue
- **Shared workflow**: Consider `workflow_call` if other repos need the same check
- **Remove npm Vale**: Once CI uses Docker, `@vvago/vale` can be removed from devDependencies
