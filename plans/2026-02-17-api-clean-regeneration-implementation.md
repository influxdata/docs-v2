# API Clean Regeneration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `--no-clean` and `--dry-run` flags to `generate-openapi-articles.ts` so stale files are automatically removed before regeneration.

**Architecture:** Delete-and-regenerate approach. Before processing each product, remove its output directories (static specs, article data, content pages), then generate fresh. Default behavior is to clean; `--no-clean` preserves existing files.

**Tech Stack:** TypeScript, Node.js fs module, existing generation script

**Design:** See `plans/2026-02-17-api-clean-regeneration-design.md`

***

## Task 1: Add CLI Flag Parsing

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts:88-89`

**Step 1: Add flag constants after existing flags**

Find the existing CLI flags section (around line 88):

```typescript
// CLI flags
const validateLinks = process.argv.includes('--validate-links');
const skipFetch = process.argv.includes('--skip-fetch');
```

Add new flags below:

```typescript
// CLI flags
const validateLinks = process.argv.includes('--validate-links');
const skipFetch = process.argv.includes('--skip-fetch');
const noClean = process.argv.includes('--no-clean');
const dryRun = process.argv.includes('--dry-run');
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): add --no-clean and --dry-run CLI flags"
```

***

## Task 2: Add getCleanupPaths Function

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts`

**Step 1: Add getCleanupPaths function after getStaticDirName function (around line 170)**

```typescript
/**
 * Get all paths that would be cleaned for a product
 *
 * @param productKey - Product identifier (e.g., 'influxdb3_core')
 * @param config - Product configuration
 * @returns Object with directories and files arrays
 */
function getCleanupPaths(
  productKey: string,
  config: ProductConfig
): { directories: string[]; files: string[] } {
  const staticDirName = getStaticDirName(productKey);
  const staticPath = path.join(DOCS_ROOT, 'static/openapi');

  const directories: string[] = [];
  const files: string[] = [];

  // Tag specs directory: static/openapi/{staticDirName}/
  const tagSpecsDir = path.join(staticPath, staticDirName);
  if (fs.existsSync(tagSpecsDir)) {
    directories.push(tagSpecsDir);
  }

  // Article data directory: data/article_data/influxdb/{productKey}/
  const articleDataDir = path.join(
    DOCS_ROOT,
    `data/article_data/influxdb/${productKey}`
  );
  if (fs.existsSync(articleDataDir)) {
    directories.push(articleDataDir);
  }

  // Content pages directory: content/{pagesDir}/api/
  const contentApiDir = path.join(config.pagesDir, 'api');
  if (fs.existsSync(contentApiDir)) {
    directories.push(contentApiDir);
  }

  // Root spec files: static/openapi/{staticDirName}-*.yml and .json
  if (fs.existsSync(staticPath)) {
    const staticFiles = fs.readdirSync(staticPath);
    const pattern = new RegExp(`^${staticDirName}-.*\\.(yml|json)$`);
    staticFiles
      .filter((f) => pattern.test(f))
      .forEach((f) => {
        files.push(path.join(staticPath, f));
      });
  }

  return { directories, files };
}
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): add getCleanupPaths function"
```

***

## Task 3: Add cleanProductOutputs Function

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts`

**Step 1: Add cleanProductOutputs function after getCleanupPaths**

```typescript
/**
 * Clean output directories for a product before regeneration
 *
 * @param productKey - Product identifier
 * @param config - Product configuration
 */
function cleanProductOutputs(productKey: string, config: ProductConfig): void {
  const { directories, files } = getCleanupPaths(productKey, config);

  // Remove directories recursively
  for (const dir of directories) {
    console.log(`🧹 Removing directory: ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }

  // Remove individual files
  for (const file of files) {
    console.log(`🧹 Removing file: ${file}`);
    fs.unlinkSync(file);
  }

  const total = directories.length + files.length;
  if (total > 0) {
    console.log(
      `✓ Cleaned ${directories.length} directories, ${files.length} files for ${productKey}`
    );
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): add cleanProductOutputs function"
```

***

## Task 4: Add showDryRunPreview Function

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts`

**Step 1: Add showDryRunPreview function after cleanProductOutputs**

```typescript
/**
 * Display dry-run preview of what would be cleaned
 *
 * @param productKey - Product identifier
 * @param config - Product configuration
 */
function showDryRunPreview(productKey: string, config: ProductConfig): void {
  const { directories, files } = getCleanupPaths(productKey, config);

  console.log(`\nDRY RUN: Would clean the following for ${productKey}:\n`);

  if (directories.length > 0) {
    console.log('Directories to remove:');
    directories.forEach((dir) => console.log(`  - ${dir}`));
  }

  if (files.length > 0) {
    console.log('\nFiles to remove:');
    files.forEach((file) => console.log(`  - ${file}`));
  }

  if (directories.length === 0 && files.length === 0) {
    console.log('  (no files to clean)');
  }

  console.log(
    `\nSummary: ${directories.length} directories, ${files.length} files would be removed`
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): add showDryRunPreview function"
```

***

## Task 5: Integrate Cleanup into processProduct

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts:1129-1135`

**Step 1: Add cleanup call at the start of processProduct function**

Find the beginning of `processProduct` function (around line 1129):

```typescript
function processProduct(productKey: string, config: ProductConfig): void {
  console.log('\n' + '='.repeat(80));
  console.log(`Processing ${config.description || productKey}`);
  console.log('='.repeat(80));
```

Add cleanup after the header output:

```typescript
function processProduct(productKey: string, config: ProductConfig): void {
  console.log('\n' + '='.repeat(80));
  console.log(`Processing ${config.description || productKey}`);
  console.log('='.repeat(80));

  // Clean output directories before regeneration (unless --no-clean)
  if (!noClean && !dryRun) {
    cleanProductOutputs(productKey, config);
  }
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): integrate cleanup into processProduct"
```

***

## Task 6: Add Dry-Run Mode to main Function

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts:1307-1346`

**Step 1: Add dry-run handling after product validation in main()**

Find the section after product validation (around line 1340):

```typescript
  // Validate product keys
  const invalidProducts = productsToProcess.filter(
    (key) => !productConfigs[key]
  );
  if (invalidProducts.length > 0) {
    // ... error handling ...
  }

  // Process each product
  productsToProcess.forEach((productKey) => {
```

Add dry-run handling before the forEach:

```typescript
  // Validate product keys
  const invalidProducts = productsToProcess.filter(
    (key) => !productConfigs[key]
  );
  if (invalidProducts.length > 0) {
    // ... error handling ...
  }

  // Handle dry-run mode
  if (dryRun) {
    console.log('\n📋 DRY RUN MODE - No files will be modified\n');
    productsToProcess.forEach((productKey) => {
      showDryRunPreview(productKey, productConfigs[productKey]);
    });
    console.log('\nDry run complete. No files were modified.');
    return;
  }

  // Process each product
  productsToProcess.forEach((productKey) => {
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "feat(api): add dry-run mode to main function"
```

***

## Task 7: Update Script Header Documentation

**Files:**

- Modify: `api-docs/scripts/generate-openapi-articles.ts:1-21`

**Step 1: Update the usage documentation in the file header**

Find the header comment block and update:

```typescript
#!/usr/bin/env node
/**
 * Generate OpenAPI Articles Script
 *
 * Generates Hugo data files and content pages from OpenAPI specifications
 * for all InfluxDB products.
 *
 * This script:
 * 1. Cleans output directories (unless --no-clean)
 * 2. Runs getswagger.sh to fetch/bundle OpenAPI specs
 * 3. Copies specs to static directory for download
 * 4. Generates path group fragments (YAML and JSON)
 * 5. Creates article metadata (YAML and JSON)
 * 6. Generates Hugo content pages from article data
 *
 * Usage:
 *   node generate-openapi-articles.js                    # Clean and generate all products
 *   node generate-openapi-articles.js cloud-v2           # Clean and generate single product
 *   node generate-openapi-articles.js --no-clean         # Generate without cleaning
 *   node generate-openapi-articles.js --dry-run          # Preview what would be cleaned
 *   node generate-openapi-articles.js --skip-fetch       # Skip getswagger.sh fetch step
 *   node generate-openapi-articles.js --validate-links   # Validate documentation links
 *
 * @module generate-openapi-articles
 */
```

**Step 2: Verify TypeScript compiles**

Run: `yarn build:ts`
Expected: Compiles without errors

**Step 3: Commit**

```bash
git add api-docs/scripts/generate-openapi-articles.ts
git commit -m "docs(api): update script header with new flags"
```

***

## Task 8: Rebuild Compiled JavaScript

**Files:**

- Modify: `api-docs/scripts/dist/generate-openapi-articles.js` (generated)

**Step 1: Rebuild TypeScript**

Run: `yarn build:ts`
Expected: Compiles without errors, updates dist/ files

**Step 2: Verify the compiled output includes new functions**

Run: `grep -n "getCleanupPaths\|cleanProductOutputs\|showDryRunPreview\|noClean\|dryRun" api-docs/scripts/dist/generate-openapi-articles.js | head -10`
Expected: Shows line numbers where new code appears

**Step 3: Commit compiled output**

```bash
git add api-docs/scripts/dist/
git commit -m "build(api): rebuild compiled generation scripts"
```

***

## Task 9: Manual Testing

**Step 1: Test dry-run mode**

Run: `node api-docs/scripts/dist/generate-openapi-articles.js influxdb3_core --dry-run`

Expected output format:

```
📋 DRY RUN MODE - No files will be modified

DRY RUN: Would clean the following for influxdb3_core:

Directories to remove:
  - static/openapi/influxdb3-core
  - data/article_data/influxdb/influxdb3_core
  - content/influxdb3/core/api

Files to remove:
  - static/openapi/influxdb3-core-ref.yml
  - static/openapi/influxdb3-core-ref.json

Summary: 3 directories, 2 files would be removed

Dry run complete. No files were modified.
```

**Step 2: Verify files were NOT deleted after dry-run**

Run: `ls content/influxdb3/core/api/`
Expected: Directory still exists with content

**Step 3: Test actual clean regeneration**

Run: `node api-docs/scripts/dist/generate-openapi-articles.js influxdb3_core --skip-fetch`
Expected: Shows cleanup messages, then regenerates successfully

**Step 4: Verify Hugo build passes**

Run: `npx hugo --quiet`
Expected: Builds without errors

**Step 5: Test --no-clean flag preserves files**

First, create a marker file:

```bash
touch content/influxdb3/core/api/MARKER_FILE.md
```

Run: `node api-docs/scripts/dist/generate-openapi-articles.js influxdb3_core --skip-fetch --no-clean`

Verify marker still exists:

```bash
ls content/influxdb3/core/api/MARKER_FILE.md
```

Expected: File exists

Clean up marker:

```bash
rm content/influxdb3/core/api/MARKER_FILE.md
```

***

## Task 10: Update Migration Plan

**Files:**

- Modify: `plans/2026-02-13-hugo-native-api-migration.md`

**Step 1: Mark Task 7 as completed**

Update the task status from planned to completed.

**Step 2: Commit**

```bash
git add plans/2026-02-13-hugo-native-api-migration.md
git commit -m "docs(plan): mark Task 7 (clean regeneration) as completed"
```

***

## Verification Checklist

Before considering complete:

- [ ] `yarn build:ts` compiles without errors
- [ ] `--dry-run` shows expected output format
- [ ] `--dry-run` does NOT delete any files
- [ ] Default mode (no flags) cleans before regenerating
- [ ] `--no-clean` preserves existing files
- [ ] `npx hugo --quiet` builds successfully after regeneration
- [ ] All new code is committed
