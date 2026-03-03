# Label Guide

Label taxonomy for the docs-v2 repository. Used by automation workflows,
triage agents, and human contributors.

## Label Definitions

- **Product labels** (`product:*`): Derived from
  [data/products.yml](../data/products.yml) — each product's `label_group`
  field determines the label name, `content_path` determines which files
  trigger it. Applied by the [auto-label workflow](workflows/auto-label.yml).
  Multi-product PRs get all matching labels. Shared content changes get
  `product:shared` plus labels for all products that reference the shared file.

- **Source, waiting, workflow, and review labels**: Defined in
  [data/labels.yml](../data/labels.yml) — names, colors, and descriptions.

- **Review label behavior** (severity levels, result rules, result → label
  mapping): Defined in
  [templates/review-comment.md](templates/review-comment.md).

Human approval uses GitHub's native PR review system (CODEOWNERS), not labels.

## Renamed Labels

| Old Name | New Name |
|----------|----------|
| `AI assistant tooling` | `ai:tooling` |
| `ci:testing-and-validation` | `ci:testing` |

## Common Workflows

### Issue triage

1. Read issue → identify product(s) → apply `product:*` labels
2. Apply `source:*` label if applicable
3. Determine readiness → apply `agent-ready` or `waiting:*`

### PR review pipeline

1. PR opened → auto-label applies `product:*` labels
2. Doc review workflow triggers (unless `skip-review` is present)
3. Claude reviews diff → applies `review:approved`, `review:changes-requested`,
   or `review:needs-human`
4. Copilot reviews rendered preview pages
5. Human reviewer uses GitHub's PR review for final approval

### GitHub Filter Queries

```
# PRs needing human review
label:review:needs-human is:pr is:open

# Agent-ready issues
label:agent-ready is:issue is:open -label:waiting:engineering -label:waiting:product

# All InfluxDB 3 issues
label:product:v3-monolith,product:v3-distributed is:issue is:open

# Blocked issues
label:waiting:engineering,waiting:product is:issue is:open

# PRs that skipped review
label:skip-review is:pr
```

## Auto-labeling Behavior

The [auto-label workflow](workflows/auto-label.yml) runs on
`pull_request: [opened, synchronize]` and:

- Reads path-to-product mappings from `data/products.yml`
- Matches changed files to product labels
- Expands shared content changes to affected product labels
- Adds labels idempotently (skips labels already present)
- Skips draft and fork PRs

## References

- Label definitions: `data/labels.yml`
- Product definitions: `data/products.yml`
- Review comment format: `.github/templates/review-comment.md`
- Auto-label workflow: `.github/workflows/auto-label.yml`
- Doc review workflow: `.github/workflows/doc-review.yml`
- Triage agent: `.claude/agents/doc-triage-agent.md`
- Review agent: `.claude/agents/doc-review-agent.md`
- Migration scripts: `helper-scripts/label-migration/`
