# API Link Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate all 237 internal API links from Redoc `#operation/{operationId}` format to RapiDoc `#{method}-{path}` format.

**Architecture:** One-time Node.js script that (1) parses OpenAPI specs to build operationId→anchor mapping, (2) scans content files for `#operation/` links, (3) replaces with RapiDoc anchors using the mapping.

**Tech Stack:** Node.js, js-yaml (already in dependencies), glob (already in dependencies)

---

## Spec Files → Product URL Mapping

| Spec File | Product URL Prefix |
|-----------|-------------------|
| `api-docs/influxdb/cloud/v2/ref.yml` | `/influxdb/cloud/api/` |
| `api-docs/influxdb/v2/v2/ref.yml` | `/influxdb/v2/api/` |
| `api-docs/influxdb/v1/v1/ref.yml` | `/influxdb/v1/api/` |
| `api-docs/enterprise_influxdb/v1/v1/ref.yml` | `/enterprise_influxdb/v1/api/` |
| `api-docs/influxdb3/core/v3/ref.yml` | `/influxdb3/core/api/` |
| `api-docs/influxdb3/enterprise/v3/ref.yml` | `/influxdb3/enterprise/api/` |
| `api-docs/influxdb3/cloud-dedicated/v2/ref.yml` | `/influxdb3/cloud-dedicated/api/` |
| `api-docs/influxdb3/cloud-dedicated/management/openapi.yml` | `/influxdb3/cloud-dedicated/api/management/` |
| `api-docs/influxdb3/cloud-serverless/v2/ref.yml` | `/influxdb3/cloud-serverless/api/` |
| `api-docs/influxdb3/clustered/v2/ref.yml` | `/influxdb3/clustered/api/` |
| `api-docs/influxdb3/clustered/management/openapi.yml` | `/influxdb3/clustered/api/management/` |

---

## Task 1: Create Migration Script Skeleton

**Files:**
- Create: `helper-scripts/migrate-api-links.js`

**Step 1: Create the script with CLI setup**

```javascript
#!/usr/bin/env node
/**
 * migrate-api-links.js
 *
 * One-time migration script to convert Redoc API links to RapiDoc format.
 *
 * Usage:
 *   node helper-scripts/migrate-api-links.js --dry-run  # Preview changes
 *   node helper-scripts/migrate-api-links.js            # Execute migration
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

// CLI arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const API_DOCS_DIR = path.join(ROOT_DIR, 'api-docs');

// Spec file → product URL mapping
const SPEC_MAPPINGS = [
  { spec: 'influxdb/cloud/v2/ref.yml', urlPrefix: '/influxdb/cloud/api/' },
  { spec: 'influxdb/v2/v2/ref.yml', urlPrefix: '/influxdb/v2/api/' },
  { spec: 'influxdb/v1/v1/ref.yml', urlPrefix: '/influxdb/v1/api/' },
  { spec: 'enterprise_influxdb/v1/v1/ref.yml', urlPrefix: '/enterprise_influxdb/v1/api/' },
  { spec: 'influxdb3/core/v3/ref.yml', urlPrefix: '/influxdb3/core/api/' },
  { spec: 'influxdb3/enterprise/v3/ref.yml', urlPrefix: '/influxdb3/enterprise/api/' },
  { spec: 'influxdb3/cloud-dedicated/v2/ref.yml', urlPrefix: '/influxdb3/cloud-dedicated/api/' },
  { spec: 'influxdb3/cloud-dedicated/management/openapi.yml', urlPrefix: '/influxdb3/cloud-dedicated/api/management/' },
  { spec: 'influxdb3/cloud-serverless/v2/ref.yml', urlPrefix: '/influxdb3/cloud-serverless/api/' },
  { spec: 'influxdb3/clustered/v2/ref.yml', urlPrefix: '/influxdb3/clustered/api/' },
  { spec: 'influxdb3/clustered/management/openapi.yml', urlPrefix: '/influxdb3/clustered/api/management/' },
];

console.log(`API Link Migration Script`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'EXECUTE'}\n`);
```

**Step 2: Make it executable and test**

Run:
```bash
chmod +x helper-scripts/migrate-api-links.js
node helper-scripts/migrate-api-links.js --dry-run
```

Expected: Script runs and prints header without errors.

**Step 3: Commit**

```bash
git add helper-scripts/migrate-api-links.js
git commit -m "feat(api): add migration script skeleton"
```

---

## Task 2: Build OperationId Lookup Table

**Files:**
- Modify: `helper-scripts/migrate-api-links.js`

**Step 1: Add function to parse spec and extract operationIds**

Add after the SPEC_MAPPINGS constant:

```javascript
/**
 * Convert path parameters from {param} to -param- (RapiDoc format)
 */
function convertPathParams(path) {
  return path.replace(/\{([^}]+)\}/g, '-$1-');
}

/**
 * Build RapiDoc anchor from method and path
 * Format: {method}-{path} with {param} → -param-
 */
function buildAnchor(method, pathStr) {
  const convertedPath = convertPathParams(pathStr);
  return `${method.toLowerCase()}-${convertedPath}`;
}

/**
 * Parse OpenAPI spec and extract operationId → anchor mapping
 */
function parseSpec(specPath) {
  const mapping = {};

  try {
    const content = fs.readFileSync(specPath, 'utf8');
    const spec = yaml.load(content);

    if (!spec.paths) {
      console.warn(`  Warning: No paths in ${specPath}`);
      return mapping;
    }

    for (const [pathStr, pathItem] of Object.entries(spec.paths)) {
      const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

      for (const method of methods) {
        const operation = pathItem[method];
        if (operation && operation.operationId) {
          const anchor = buildAnchor(method, pathStr);
          mapping[operation.operationId] = anchor;

          if (VERBOSE) {
            console.log(`    ${operation.operationId} → #${anchor}`);
          }
        }
      }
    }
  } catch (error) {
    console.error(`  Error parsing ${specPath}: ${error.message}`);
  }

  return mapping;
}

/**
 * Build complete lookup table from all specs
 * Returns: { urlPrefix: { operationId: anchor } }
 */
function buildLookupTable() {
  const lookup = {};

  console.log('Building operationId lookup table...\n');

  for (const { spec, urlPrefix } of SPEC_MAPPINGS) {
    const specPath = path.join(API_DOCS_DIR, spec);

    if (!fs.existsSync(specPath)) {
      console.warn(`  Skipping missing spec: ${spec}`);
      continue;
    }

    console.log(`  Processing: ${spec}`);
    const mapping = parseSpec(specPath);
    lookup[urlPrefix] = mapping;
    console.log(`    Found ${Object.keys(mapping).length} operations`);
  }

  console.log('');
  return lookup;
}

// Test: Build and display lookup table
const lookupTable = buildLookupTable();
console.log('Lookup table built successfully.\n');
```

**Step 2: Test lookup table generation**

Run:
```bash
node helper-scripts/migrate-api-links.js --dry-run --verbose 2>&1 | head -50
```

Expected: See operationId mappings printed for each spec.

**Step 3: Commit**

```bash
git add helper-scripts/migrate-api-links.js
git commit -m "feat(api): add operationId lookup table generation"
```

---

## Task 3: Add Content File Scanner

**Files:**
- Modify: `helper-scripts/migrate-api-links.js`

**Step 1: Add function to find and parse links**

Add after buildLookupTable function:

```javascript
/**
 * Find all #operation/ links in a file
 * Returns array of { match, operationId, urlPath, fullUrl }
 */
function findOperationLinks(content) {
  const links = [];
  // Match patterns like: /influxdb/cloud/api/#operation/PostTasks
  // or /influxdb3/cloud-dedicated/api/management/#operation/CreateDatabaseToken
  const regex = /(\/[a-z0-9_/-]+\/api(?:\/management)?(?:\/[a-z0-9-]*)?\/)#operation\/(\w+)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({
      match: match[0],
      urlPath: match[1],
      operationId: match[2],
    });
  }

  return links;
}

/**
 * Find the best matching URL prefix for a given URL path
 */
function findUrlPrefix(urlPath, lookup) {
  // Sort by length descending to match most specific first
  const prefixes = Object.keys(lookup).sort((a, b) => b.length - a.length);

  for (const prefix of prefixes) {
    if (urlPath.startsWith(prefix) || urlPath === prefix.slice(0, -1)) {
      return prefix;
    }
  }

  return null;
}

/**
 * Scan content directory for files with #operation/ links
 */
async function scanContentFiles(lookup) {
  console.log('Scanning content files for #operation/ links...\n');

  const files = await glob('**/*.md', { cwd: CONTENT_DIR });
  const results = {
    filesWithLinks: [],
    totalLinks: 0,
    unmapped: [],
  };

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const links = findOperationLinks(content);

    if (links.length > 0) {
      const fileResult = {
        file,
        links: [],
      };

      for (const link of links) {
        const urlPrefix = findUrlPrefix(link.urlPath, lookup);

        if (!urlPrefix) {
          results.unmapped.push({ file, ...link, reason: 'No matching URL prefix' });
          continue;
        }

        const productLookup = lookup[urlPrefix];
        const anchor = productLookup[link.operationId];

        if (!anchor) {
          results.unmapped.push({ file, ...link, reason: 'OperationId not found in spec' });
          continue;
        }

        fileResult.links.push({
          ...link,
          urlPrefix,
          newAnchor: anchor,
          oldLink: `${link.urlPath}#operation/${link.operationId}`,
          newLink: `${link.urlPath}#${anchor}`,
        });
      }

      if (fileResult.links.length > 0) {
        results.filesWithLinks.push(fileResult);
        results.totalLinks += fileResult.links.length;
      }
    }
  }

  return results;
}
```

**Step 2: Add main execution and reporting**

Replace the test code at the bottom with:

```javascript
async function main() {
  // Build lookup table
  const lookupTable = buildLookupTable();

  // Scan content files
  const results = await scanContentFiles(lookupTable);

  // Report findings
  console.log('=== SCAN RESULTS ===\n');
  console.log(`Files with links: ${results.filesWithLinks.length}`);
  console.log(`Total links to migrate: ${results.totalLinks}`);
  console.log(`Unmapped links: ${results.unmapped.length}\n`);

  if (VERBOSE && results.filesWithLinks.length > 0) {
    console.log('Links to migrate:');
    for (const { file, links } of results.filesWithLinks) {
      console.log(`\n  ${file}:`);
      for (const link of links) {
        console.log(`    ${link.oldLink}`);
        console.log(`    → ${link.newLink}`);
      }
    }
  }

  if (results.unmapped.length > 0) {
    console.log('\n=== UNMAPPED LINKS (require manual review) ===\n');
    for (const item of results.unmapped) {
      console.log(`  ${item.file}:`);
      console.log(`    ${item.match}`);
      console.log(`    Reason: ${item.reason}\n`);
    }
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] No files modified. Run without --dry-run to apply changes.');
  }
}

main().catch(console.error);
```

**Step 3: Test scanner**

Run:
```bash
node helper-scripts/migrate-api-links.js --dry-run
```

Expected: See count of files and links found, plus any unmapped links.

**Step 4: Commit**

```bash
git add helper-scripts/migrate-api-links.js
git commit -m "feat(api): add content file scanner for operation links"
```

---

## Task 4: Add Link Replacement Logic

**Files:**
- Modify: `helper-scripts/migrate-api-links.js`

**Step 1: Add replacement function**

Add before the main function:

```javascript
/**
 * Replace operation links in a file
 * Returns the modified content
 */
function replaceLinks(content, links) {
  let modified = content;

  for (const link of links) {
    // Replace all occurrences of this specific link
    modified = modified.split(link.oldLink).join(link.newLink);
  }

  return modified;
}

/**
 * Apply migrations to files
 */
async function applyMigrations(results) {
  console.log('\n=== APPLYING MIGRATIONS ===\n');

  let filesModified = 0;
  let linksReplaced = 0;

  for (const { file, links } of results.filesWithLinks) {
    const filePath = path.join(CONTENT_DIR, file);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = replaceLinks(originalContent, links);

    if (originalContent !== modifiedContent) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      filesModified++;
      linksReplaced += links.length;
      console.log(`  ✓ ${file} (${links.length} links)`);
    }
  }

  console.log(`\nMigration complete: ${filesModified} files modified, ${linksReplaced} links replaced.`);
}
```

**Step 2: Update main function to apply changes**

Update the main function to call applyMigrations when not in dry-run mode:

```javascript
async function main() {
  // Build lookup table
  const lookupTable = buildLookupTable();

  // Scan content files
  const results = await scanContentFiles(lookupTable);

  // Report findings
  console.log('=== SCAN RESULTS ===\n');
  console.log(`Files with links: ${results.filesWithLinks.length}`);
  console.log(`Total links to migrate: ${results.totalLinks}`);
  console.log(`Unmapped links: ${results.unmapped.length}\n`);

  if (VERBOSE && results.filesWithLinks.length > 0) {
    console.log('Links to migrate:');
    for (const { file, links } of results.filesWithLinks) {
      console.log(`\n  ${file}:`);
      for (const link of links) {
        console.log(`    ${link.oldLink}`);
        console.log(`    → ${link.newLink}`);
      }
    }
  }

  if (results.unmapped.length > 0) {
    console.log('\n=== UNMAPPED LINKS (require manual review) ===\n');
    for (const item of results.unmapped) {
      console.log(`  ${item.file}:`);
      console.log(`    ${item.match}`);
      console.log(`    Reason: ${item.reason}\n`);
    }
  }

  // Apply migrations if not dry-run
  if (DRY_RUN) {
    console.log('\n[DRY RUN] No files modified. Run without --dry-run to apply changes.');
  } else if (results.filesWithLinks.length > 0) {
    await applyMigrations(results);
  } else {
    console.log('\nNo links to migrate.');
  }
}

main().catch(console.error);
```

**Step 3: Test dry-run shows expected changes**

Run:
```bash
node helper-scripts/migrate-api-links.js --dry-run --verbose 2>&1 | head -100
```

Expected: See specific link transformations listed.

**Step 4: Commit script completion**

```bash
git add helper-scripts/migrate-api-links.js
git commit -m "feat(api): complete migration script with replacement logic"
```

---

## Task 5: Execute Migration

**Step 1: Final dry-run review**

Run:
```bash
node helper-scripts/migrate-api-links.js --dry-run
```

Review the output. Verify:
- Link count matches expectations (~237 links)
- No critical unmapped links
- Transformations look correct

**Step 2: Execute migration**

Run:
```bash
node helper-scripts/migrate-api-links.js
```

Expected: Files modified, links replaced.

**Step 3: Review changes**

Run:
```bash
git diff content/ | head -200
```

Verify transformations look correct (spot check a few).

**Step 4: Commit migrated content**

```bash
git add content/
git commit -m "refactor(api): migrate operation links to RapiDoc anchor format

Migrated ~237 links from #operation/{operationId} to #{method}-{path} format
for RapiDoc compatibility."
```

---

## Task 6: Validate with Link-Checker

**Step 1: Build Hugo site**

Run:
```bash
npx hugo --quiet
```

Expected: Build succeeds without errors.

**Step 2: Run link-checker**

Run:
```bash
link-checker check public/
```

Or if link-checker isn't installed globally:
```bash
# Map changed content files to HTML and check
git diff --name-only HEAD~1 HEAD | grep '\.md$' | head -20 | \
  xargs -I {} link-checker map {} | \
  xargs link-checker check
```

Expected: No broken links related to API anchors.

**Step 3: Manual spot-check in browser**

1. Start Hugo server: `npx hugo server`
2. Visit a page with migrated links
3. Click API links and verify they navigate to correct operations

**Step 4: Final commit if any fixes needed**

If link-checker found issues, fix and commit:
```bash
git add content/
git commit -m "fix(api): correct link migration issues found by link-checker"
```

---

## Summary

| Task | Description | Output |
|------|-------------|--------|
| 1 | Script skeleton | `helper-scripts/migrate-api-links.js` |
| 2 | Lookup table generation | operationId → anchor mapping |
| 3 | Content file scanner | Find all `#operation/` links |
| 4 | Replacement logic | Transform links in place |
| 5 | Execute migration | ~237 links migrated |
| 6 | Validate | Link-checker passes |
