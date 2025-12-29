# OpenAPI Link Processing Design

**Date:** 2025-01-02
**Status:** Draft
**Author:** Documentation Team

## Problem

Links in OpenAPI spec descriptions are hardcoded with product-specific paths (e.g., `/influxdb3/core/api/authentication/`). This creates maintenance burden and increases the risk of broken links when:

- Content is reorganized
- Specs are used as templates for new products
- Authors forget the exact path structure

The existing shared content system solves this for Markdown files using `/influxdb/version/` placeholders, but OpenAPI specs bypass Hugo's templating and render directly through RapiDoc.

## Solution

Transform documentation links in OpenAPI specs at build time, replacing the `/influxdb/version/` placeholder with the actual product path derived from the spec file location.

## Link Syntax

Authors write links with a single, canonical placeholder:

```yaml
# In api-docs/influxdb3/core/v3/ref.yml
description: |
  Use the [Authorization header](/influxdb/version/api/authentication/) to authenticate.
  See [tokens](/influxdb/version/admin/tokens/) for token management.
```

Build transforms to:

```yaml
description: |
  Use the [Authorization header](/influxdb3/core/api/authentication/) to authenticate.
  See [tokens](/influxdb3/core/admin/tokens/) for token management.
```

### Why This Syntax

- **Single pattern** - One placeholder (`/influxdb/version/`) for all products
- **Consistent** - Matches existing shared content convention
- **Self-documenting** - Clear that the link is internal documentation
- **Cross-product safe** - Explicit full paths for cross-product links remain unchanged

## Targeted Fields

Transform only known markdown-containing fields:

- `description`
- `summary`

These fields appear throughout the OpenAPI spec in:

- `info.description`
- `tags[].description`
- `paths.*.*[description,summary]` (operation descriptions)
- `components.schemas.*.description`
- `components.parameters.*.description`
- `components.responses.*.description`
- `components.securitySchemes.*.description`
- `externalDocs.description`

## Implementation

### Location

`api-docs/scripts/generate-openapi-articles.ts`

### 1. Derive Product Path

```typescript
/**
 * Derive documentation root from spec file path.
 *
 * @example
 * 'api-docs/influxdb3/core/v3/ref.yml' → '/influxdb3/core'
 * 'api-docs/influxdb3/enterprise/v3/ref.yml' → '/influxdb3/enterprise'
 * 'api-docs/influxdb/v2/ref.yml' → '/influxdb/v2'
 */
function deriveProductPath(specPath: string): string {
  const match = specPath.match(/api-docs\/(influxdb3?)\/([\w-]+)\//);
  if (!match) {
    throw new Error(`Cannot derive product path from: ${specPath}`);
  }
  return `/${match[1]}/${match[2]}`;
}
```

### 2. Transform Links

```typescript
/** Fields that can contain markdown with links */
const MARKDOWN_FIELDS = new Set(['description', 'summary']);

/** Link placeholder pattern */
const LINK_PATTERN = /\/influxdb\/version\//g;

/**
 * Transform documentation links in OpenAPI spec markdown fields.
 * Replaces `/influxdb/version/` with the actual product path.
 *
 * @param spec - Parsed OpenAPI spec object
 * @param productPath - Target path (e.g., '/influxdb3/core')
 * @returns Spec with transformed links
 */
function transformDocLinks(
  spec: Record<string, unknown>,
  productPath: string
): Record<string, unknown> {
  function transformValue(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replace(LINK_PATTERN, `${productPath}/`);
    }
    if (Array.isArray(value)) {
      return value.map(transformValue);
    }
    if (value && typeof value === 'object') {
      return transformObject(value as Record<string, unknown>);
    }
    return value;
  }

  function transformObject(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (MARKDOWN_FIELDS.has(key) && typeof value === 'string') {
        result[key] = value.replace(LINK_PATTERN, `${productPath}/`);
      } else if (value && typeof value === 'object') {
        result[key] = transformValue(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  return transformObject(spec);
}
```

### 3. Validate Links

```typescript
/**
 * Validate that transformed links point to existing content.
 *
 * @param spec - Transformed OpenAPI spec
 * @param contentDir - Path to Hugo content directory
 * @returns Array of error messages for broken links
 */
function validateDocLinks(
  spec: Record<string, unknown>,
  contentDir: string
): string[] {
  const errors: string[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  function extractLinks(value: unknown, path: string): void {
    if (typeof value === 'string') {
      let match;
      while ((match = linkPattern.exec(value)) !== null) {
        const [, linkText, linkUrl] = match;
        // Only validate internal links (start with /)
        if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
          const contentPath = resolveContentPath(linkUrl, contentDir);
          if (!fs.existsSync(contentPath)) {
            errors.push(`Broken link at ${path}: [${linkText}](${linkUrl})`);
          }
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => extractLinks(item, `${path}[${index}]`));
    } else if (value && typeof value === 'object') {
      for (const [key, val] of Object.entries(value)) {
        extractLinks(val, `${path}.${key}`);
      }
    }
  }

  extractLinks(spec, 'spec');
  return errors;
}

/**
 * Resolve a URL path to a content file path.
 *
 * @example
 * '/influxdb3/core/api/auth/' → 'content/influxdb3/core/api/auth/_index.md'
 */
function resolveContentPath(urlPath: string, contentDir: string): string {
  const normalized = urlPath.replace(/\/$/, '');
  const possibilities = [
    path.join(contentDir, normalized, '_index.md'),
    path.join(contentDir, normalized + '.md'),
  ];
  return possibilities.find((p) => fs.existsSync(p)) || possibilities[0];
}
```

### 4. Integration

```typescript
/**
 * Process a spec file: transform links and validate.
 */
function processSpec(
  specPath: string,
  outputPath: string,
  contentDir: string,
  options: { validateLinks?: boolean } = {}
): void {
  const spec = yaml.load(
    fs.readFileSync(specPath, 'utf8')
  ) as Record<string, unknown>;
  const productPath = deriveProductPath(specPath);

  // Transform links
  const transformed = transformDocLinks(spec, productPath);

  // Validate links if enabled
  if (options.validateLinks) {
    const errors = validateDocLinks(transformed, contentDir);
    if (errors.length > 0) {
      console.warn(`\n⚠️  Link validation warnings for ${specPath}:`);
      errors.forEach((err) => console.warn(`   ${err}`));
    }
  }

  // Write transformed spec
  fs.writeFileSync(outputPath, yaml.dump(transformed));
}
```

## Usage

### Writing Links in Specs

```yaml
description: |
  See [authentication](/influxdb/version/api/authentication/) for details.
  Related: [tokens](/influxdb/version/admin/tokens/)
```

### Build Commands

```bash
# Standard build
yarn build:api-docs

# With link validation
yarn build:api-docs --validate-links
```

## Design Decisions

| Aspect               | Decision                                       |
| -------------------- | ---------------------------------------------- |
| **Link syntax**      | `/influxdb/version/path/` (single pattern)     |
| **Transform scope**  | `description` and `summary` fields only        |
| **Transform timing** | Build time, in `generate-openapi-articles.ts`  |
| **Path derivation**  | From spec file path (no config field needed)   |
| **Validation**       | Optional flag to check links resolve to files  |
| **Cross-product**    | Use explicit full paths (not transformed)      |
| **Aliases**          | Not handled in validation (future enhancement) |

## Future Enhancements

- **Alias support** - Build alias map from frontmatter for validation
- **CI integration** - Run validation in PR checks
- **Link reporting** - Generate report of all links in specs

## Related

- Shared content link handling: `layouts/partials/article/content.html`
- API generation script: `api-docs/scripts/generate-openapi-articles.ts`
