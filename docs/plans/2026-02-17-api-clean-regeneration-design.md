# API Clean Regeneration Design

**Goal:** Add clean regeneration to `generate-openapi-articles.ts` to prevent stale files from accumulating when tags are renamed or removed.

**Problem:** When OpenAPI tags are renamed (e.g., "Cache data" → "Cache distinct values" + "Cache last value"), old generated files persist alongside new ones, causing navigation confusion and stale content.

***

## CLI Interface

**New flags:**

| Flag         | Description                                          |
| ------------ | ---------------------------------------------------- |
| `--no-clean` | Skip directory cleanup (preserve existing files)     |
| `--dry-run`  | Show what would be deleted without actually deleting |

**Behavior:**

- Default is to clean before generating (no flag needed)
- `--dry-run` implies `--no-clean` (shows deletions but doesn't execute or generate)
- Existing flags (`--validate-links`, `--skip-fetch`) continue to work

**Usage examples:**

```bash
# Default: clean and regenerate all products
node generate-openapi-articles.js

# Clean and regenerate specific product
node generate-openapi-articles.js influxdb3_core

# Preview what would be deleted
node generate-openapi-articles.js --dry-run

# Preserve existing files (legacy behavior)
node generate-openapi-articles.js --no-clean
```

***

## Directories Cleaned Per Product

For each product (e.g., `influxdb3_core`), the following are cleaned:

| Location      | Pattern                                            | Example                                      |
| ------------- | -------------------------------------------------- | -------------------------------------------- |
| Tag specs     | `static/openapi/{staticDirName}/`                  | `static/openapi/influxdb3-core/`             |
| Root specs    | `static/openapi/{staticDirName}-*.yml` and `.json` | `static/openapi/influxdb3-core-ref.yml`      |
| Article data  | `data/article_data/influxdb/{productKey}/`         | `data/article_data/influxdb/influxdb3_core/` |
| Content pages | `content/{pagesDir}/api/`                          | `content/influxdb3/core/api/`                |

**Boundaries:**

- Only cleans the `api/` subdirectory within content, not the entire product
- Only cleans files matching the product's `staticDirName` pattern
- Never touches other products' files
- Multi-spec products (cloud-dedicated, clustered) clean all spec variants

***

## Dry-Run Output Format

```
$ node generate-openapi-articles.js influxdb3_core --dry-run

DRY RUN: Would clean the following for influxdb3_core:

Directories to remove:
  - static/openapi/influxdb3-core/
  - data/article_data/influxdb/influxdb3_core/
  - content/influxdb3/core/api/

Files to remove:
  - static/openapi/influxdb3-core-ref.yml
  - static/openapi/influxdb3-core-ref.json

Summary: 3 directories, 2 files would be removed

Skipping generation (dry-run mode).
```

***

## Code Structure

**File modified:** `api-docs/scripts/generate-openapi-articles.ts`

**New CLI flag parsing:**

```typescript
const noClean = process.argv.includes('--no-clean');
const dryRun = process.argv.includes('--dry-run');
```

**New functions:**

```typescript
/**
 * Get all paths that would be cleaned for a product
 */
function getCleanupPaths(productKey: string, config: ProductConfig): {
  directories: string[];
  files: string[];
}

/**
 * Clean output directories for a product before regeneration
 */
function cleanProductOutputs(productKey: string, config: ProductConfig): void

/**
 * Display dry-run preview of what would be cleaned
 */
function showDryRunPreview(productKey: string, config: ProductConfig): void
```

**Changes to `processProduct()`:**

```typescript
function processProduct(productKey: string, config: ProductConfig): void {
  // Clean before generating (unless --no-clean or --dry-run)
  if (!noClean && !dryRun) {
    cleanProductOutputs(productKey, config);
  }

  // Existing generation logic...
}
```

**Changes to `main()`:**

```typescript
function main(): void {
  // Handle dry-run mode
  if (dryRun) {
    productsToProcess.forEach((productKey) => {
      showDryRunPreview(productKey, productConfigs[productKey]);
    });
    console.log('\nDry run complete. No files were modified.');
    return; // Exit without generating
  }

  // Existing processing logic...
}
```

**No changes to:** `openapi-paths-to-hugo-data/index.ts`

***

## Verification

After implementation:

1. Run `--dry-run` and verify output matches expected format
2. Run without flags and verify old files are removed
3. Run with `--no-clean` and verify files are preserved
4. Verify Hugo build passes after clean regeneration
5. Verify no stale tag pages appear in navigation
