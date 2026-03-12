# Label Migration Scripts

Migrate the docs-v2 repository from 80+ ad-hoc labels to the 24-label taxonomy
defined in [DOC-REVIEW-PIPELINE-PLAN.md](../../.github/DOC-REVIEW-PIPELINE-PLAN.md).

## Prerequisites

- `gh` CLI authenticated with access to `influxdata/docs-v2`
- Run from any directory (scripts use `REPO` env var, defaults to `influxdata/docs-v2`)

## Execution Order

### Step 1: Create new labels (safe, idempotent)

```bash
./create-labels.sh           # Creates 24 new labels
./create-labels.sh --dry-run # Preview without creating
```

Uses `gh label create --force`, which creates new labels or updates existing
ones. Safe to run multiple times.

### Step 2: Migrate issues to new labels

```bash
./migrate-labels.sh           # Adds new labels to issues with old labels
./migrate-labels.sh --dry-run # Preview without modifying issues
```

Adds new labels to issues/PRs that have old labels. Does NOT remove old labels.
Flags `InfluxDB v3` issues for manual review (may be monolith or distributed).

### Step 3: Verify migration

Before deleting old labels, verify a sample of migrated issues:

```bash
# Check issues with new product labels
gh issue list -R influxdata/docs-v2 -l "product:v3-monolith" --state all
gh issue list -R influxdata/docs-v2 -l "product:v3-distributed" --state all

# Check the flagged InfluxDB v3 issues
gh issue list -R influxdata/docs-v2 -l "InfluxDB v3" --state all
```

### Step 4: Delete old labels (destructive, interactive)

```bash
./delete-labels.sh           # Deletes old labels with confirmation prompts
./delete-labels.sh --dry-run # Preview without deleting
```

Prompts for confirmation before each batch of deletions. Batches:
1. Old product labels (15 labels)
2. Old release labels (2 labels)
3. Old source tracking labels (1 label)
4. Renamed labels (2 labels)
5. Unused/generic labels (14 labels)

### Step 5: Update workflow references

After deleting `sync-plugin-docs`, update these files to use `source:sync`:
- `.github/workflows/sync-plugins.yml` (lines 28, 173, 421)
- `.github/ISSUE_TEMPLATE/sync-plugin-docs.yml` (line 4)

## Targeting a different repo

```bash
REPO=myorg/myrepo ./create-labels.sh
REPO=myorg/myrepo ./migrate-labels.sh --dry-run
```

## Rollback

If something goes wrong after Step 2 (migration):
- Old labels still exist (not deleted until Step 4)
- New labels can be removed: `gh label delete "product:v3-monolith" -R influxdata/docs-v2 --yes`
- Issues retain both old and new labels until old labels are deleted

If something goes wrong after Step 4 (deletion):
- Old labels are gone but issues retain the new labels
- Re-create old labels manually if needed: `gh label create "InfluxDB v3" -R influxdata/docs-v2 --color EC8909`

## Label Taxonomy

See the full taxonomy in [DOC-REVIEW-PIPELINE-PLAN.md](../../.github/DOC-REVIEW-PIPELINE-PLAN.md#11--label-taxonomy).

| Category | Count | Prefix | Example |
|----------|-------|--------|---------|
| Product | 11 | `product:` | `product:v3-monolith` |
| Source tracking | 4 | `source:` | `source:sync` |
| Waiting states | 2 | `waiting:` | `waiting:engineering` |
| Workflow states | 2 | (none) | `agent-ready`, `skip-review` |
| Review outcomes | 3 | `review:` | `review:approved` |
| Renamed | 2 | various | `ai:tooling`, `ci:testing` |
