# API Link Migration: Redoc to RapiDoc Anchors

## Overview

Migrate all internal API operation links from Redoc's `#operation/{operationId}` format to RapiDoc's native `#{method}-{path}` format.

## Background

The RapiDoc migration changes how anchor links work for API operations:

| Source | Pattern | Example |
|--------|---------|---------|
| **Redoc (old)** | `#operation/{operationId}` | `#operation/PostTasks` |
| **RapiDoc (new)** | `#{method}-{path}` | `#post-/api/v2/tasks` |

**Scope:** 237 links across 111 content files use the Redoc pattern.

**Constraint:** Don't modify source OpenAPI specs—transformation happens at the link level only.

## Goals

1. **Prevent 404s** for external links to API pages (base URL stability)
2. **Clean migration** of all internal links to RapiDoc's native format
3. **Validation** via link-checker after migration

## Non-Goals

- Backward compatibility for fragment identifiers (URL fragments are client-side only; server redirects can't translate them)
- External links with old `#operation/` fragments will land on the correct page but won't auto-scroll

## URL Structure

**API page URLs remain stable:**
- `/influxdb/cloud/api/` — All endpoints page
- `/influxdb3/core/api/` — All endpoints page
- `/influxdb3/core/api/{tag-name}/` — Tag page

**Anchor format changes:**
- Old: `/influxdb/cloud/api/#operation/PostTasks`
- New: `/influxdb/cloud/api/#post-/api/v2/tasks`

## RapiDoc Anchor Format

RapiDoc uses `#{method}-{path}` with these conventions:

- Method is lowercase: `post`, `get`, `delete`, `put`, `patch`
- Path parameters `{param}` become `-param-`: `/tasks/{taskID}` → `/tasks/-taskID-`
- Slashes in fragments are valid per RFC 3986

**Examples:**
```
#get-/api/v2/tasks
#post-/api/v2/write
#delete-/api/v2/tasks/-taskID-
#get-/api/v2/tasks/-taskID-/runs/-runID-
```

## Migration Script Design

### Location

`helper-scripts/migrate-api-links.js` (one-time migration tool, plain JS)

### Algorithm

**Step 1: Build lookup table from OpenAPI specs**

Key by product to handle duplicate operationIds across specs:

```json
{
  "influxdb3/cloud-dedicated": {
    "PostWrite": "post-/api/v2/write",
    "GetDatabaseTokens": "get-/api/v0/accounts/-accountId-/clusters/-clusterId-/tokens"
  },
  "influxdb3/core": {
    "PostWrite": "post-/api/v3/write"
  },
  "influxdb/cloud": {
    "PostTasks": "post-/api/v2/tasks",
    "GetTasksID": "get-/api/v2/tasks/-taskID-"
  }
}
```

**Step 2: Scan and transform content files**

```
For each .md file in content/:
  Find all patterns: #operation/(\w+)
  Extract product from link URL path
  Look up operationId in product's mapping
  Replace with RapiDoc anchor format
  Flag unmapped operationIds for manual review
```

**Step 3: Report**

- Files modified
- Links updated (count)
- Unmapped operationIds (manual review needed)
- Dry-run mode available

### Edge Cases

| Case | Example | Handling |
|------|---------|----------|
| Path parameters | `{taskID}` | Replace with `-taskID-` in anchor |
| Multiple params | `/tasks/{taskID}/runs/{runID}` | Replace all params |
| Missing operationId | Path exists but no operationId in spec | Flag for manual review |
| Deprecated operations | Link to removed endpoint | Flag as potentially broken |

### Usage

```bash
# Dry-run (report only, no changes)
node helper-scripts/migrate-api-links.js --dry-run

# Execute migration
node helper-scripts/migrate-api-links.js

# Review changes
git diff content/
```

## Validation

### Pre-migration

Verify API page URLs are stable:
- Check `_index.md` files have `aliases:` if paths changed
- Confirm no 404s for existing API base paths

### Post-migration

```bash
# Build site
npx hugo --quiet

# Run link-checker on full site
link-checker check public/
```

## Rollback

Git provides easy rollback:

```bash
git checkout -- content/
```

## Files to Create/Modify

### New Files

- `helper-scripts/migrate-api-links.js` — Migration script

### Modified Files

- ~111 content files containing API operation links

## Testing Checklist

- [ ] Dry-run reports expected changes
- [ ] All operationIds map successfully (or flagged for review)
- [ ] Links transform to correct RapiDoc format
- [ ] Hugo build succeeds after migration
- [ ] Link-checker passes on full site
- [ ] Spot-check: anchors navigate to correct operations in browser

## Related Documents

- [API Tag Pages Design](2026-01-21-api-tag-pages-design.md)
- [API Reference RapiDoc Migration Plan](2026-01-07-api-reference-rapidoc-migration.md)
