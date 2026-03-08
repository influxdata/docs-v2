# API Documentation Generation Scripts

TypeScript-based scripts for generating Hugo data files and content pages from OpenAPI specifications.

## Overview

These scripts convert OpenAPI v3 specifications into Hugo-compatible data files and content pages for all InfluxDB products.

### What Gets Generated

For each product, the scripts generate:

1. **OpenAPI Spec Copies** (static directory):
   - `influxdb-{product}.yml` - YAML version of the spec
   - `influxdb-{product}.json` - JSON version of the spec

2. **Path Group Fragments** (static/openapi/{product}/paths/):
   - Separate YAML and JSON files for each API path group
   - Example: `ref-api-v2-buckets.yaml` and `ref-api-v2-buckets.json`

3. **Article Metadata** (data/article-data/influxdb/{product}/):
   - `articles.yml` - Hugo data file with article metadata
   - `articles.json` - JSON version for programmatic access

4. **Hugo Content Pages** (content/{product}/api/):
   - Markdown files generated from article data
   - One page per API path group

## Quick Start

### Build Scripts

Compile TypeScript to JavaScript (required before running):

```bash
yarn build:api-scripts
```

### Generate API Pages

**Generate all products:**

```bash
yarn build:api-pages
```

**Generate specific product(s):**

```bash
yarn build:api-pages:product cloud-v2
yarn build:api-pages:product cloud-v2 oss-v2
```

## Supported Products

| Product ID             | Description               | Spec File                                        | Content Path                                 |
| ---------------------- | ------------------------- | ------------------------------------------------ | -------------------------------------------- |
| `cloud-v2`             | InfluxDB Cloud (v2 API)   | `api-docs/cloud/v2/ref.yml`                      | `content/influxdb/cloud/api/v2`              |
| `oss-v2`               | InfluxDB OSS v2           | `api-docs/v2/ref.yml`                            | `content/influxdb/v2/api/v2`                 |
| `influxdb3-core`       | InfluxDB 3 Core           | `api-docs/influxdb3/core/v3/ref.yml`             | `content/influxdb3/core/reference/api`       |
| `influxdb3-enterprise` | InfluxDB 3 Enterprise     | `api-docs/influxdb3/enterprise/v3/ref.yml`       | `content/influxdb3/enterprise/reference/api` |
| `cloud-dedicated`      | InfluxDB Cloud Dedicated  | `api-docs/influxdb3/cloud-dedicated/v2/ref.yml`  | `content/influxdb/cloud-dedicated/api`       |
| `cloud-serverless`     | InfluxDB Cloud Serverless | `api-docs/influxdb3/cloud-serverless/v2/ref.yml` | `content/influxdb/cloud-serverless/api`      |
| `clustered`            | InfluxDB Clustered        | `api-docs/influxdb3/clustered/v2/ref.yml`        | `content/influxdb/clustered/api`             |

## Architecture

### TypeScript Files

```
api-docs/scripts/
├── tsconfig.json                              # TypeScript configuration
├── generate-openapi-articles.ts               # Main orchestration script
└── openapi-paths-to-hugo-data/
    ├── index.ts                               # Core conversion logic
    └── package.json                           # Module dependencies
```

### Compiled JavaScript

After running `yarn build:api-scripts`, compiled files are in:

```
api-docs/scripts/dist/
├── generate-openapi-articles.js
├── generate-openapi-articles.d.ts
└── openapi-paths-to-hugo-data/
    ├── index.js
    └── index.d.ts
```

## Script Details

### generate-openapi-articles.ts

Main orchestration script that processes products.

**For each product, it:**

1. Runs `getswagger.sh` to fetch/bundle the OpenAPI spec
2. Copies spec to `static/openapi/influxdb-{product}.yml`
3. Generates JSON version at `static/openapi/influxdb-{product}.json`
4. Generates path group fragments (YAML and JSON)
5. Creates article metadata (YAML and JSON)
6. Generates Hugo content pages

**Usage:**

```bash
node api-docs/scripts/dist/generate-openapi-articles.js [product-ids...]

# Examples:
node api-docs/scripts/dist/generate-openapi-articles.js                    # All products
node api-docs/scripts/dist/generate-openapi-articles.js cloud-v2           # Single product
node api-docs/scripts/dist/generate-openapi-articles.js cloud-v2 oss-v2    # Multiple products
```

**Output:**

```
📋 Processing all products...

================================================================================
Processing InfluxDB Cloud (v2 API)
================================================================================

Fetching OpenAPI spec for cloud-v2...
✓ Copied spec to static/openapi/influxdb-cloud-v2.yml
✓ Generated JSON spec at static/openapi/influxdb-cloud-v2.json

Generating OpenAPI path files in static/openapi/influxdb-cloud-v2/paths....
Generated: ref-api-v2-buckets.yaml and ref-api-v2-buckets.json
...

Generating OpenAPI article data in data/article-data/influxdb/cloud-v2...
Generated 32 articles in data/article-data/influxdb/cloud-v2

✅ Successfully processed InfluxDB Cloud (v2 API)
```

### openapi-paths-to-hugo-data/index.ts

Core conversion library that processes OpenAPI specs.

**Key Functions:**

- `generateHugoData(options)` - Main entry point
- `writePathOpenapis()` - Groups paths and writes fragments
- `createArticleDataForPathGroup()` - Generates article metadata

**Path Grouping Logic:**

Paths are grouped by their base path (first 3-4 segments, excluding placeholders):

```
/api/v2/buckets           → api-v2-buckets
/api/v2/buckets/{id}      → api-v2-buckets (same group)
/api/v2/authorizations    → api-v2-authorizations
```

**Output Formats:**

- **YAML**: Hugo-compatible data files
- **JSON**: Programmatic access and tooling

## Development

### Prerequisites

- Node.js >= 16.0.0
- Yarn package manager
- TypeScript installed (via root package.json)

### Setup

```bash
# Install dependencies (from repo root)
yarn install

# Or install in the openapi-paths-to-hugo-data module
cd api-docs/scripts/openapi-paths-to-hugo-data
yarn install
```

### TypeScript Configuration

The scripts use a dedicated `tsconfig.json` with CommonJS output:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "outDir": "./dist",
    "strict": true,
    ...
  }
}
```

### Making Changes

1. Edit TypeScript files in `api-docs/scripts/`
2. Compile: `yarn build:api-scripts`
3. Test: `yarn build:api-pages:product cloud-v2`

### Watch Mode

For active development:

```bash
cd api-docs/scripts/openapi-paths-to-hugo-data
yarn build:watch
```

## Testing

### Unit Test Example

```javascript
const converter = require('./api-docs/scripts/dist/openapi-paths-to-hugo-data/index.js');

converter.generateHugoData({
  specFile: 'api-docs/influxdb/cloud/v2/ref.yml',
  dataOutPath: './test-output/paths',
  articleOutPath: './test-output/articles'
});
```

### Verify Output

After generation, check:

1. **Path fragments exist:**
   ```bash
   ls -l static/openapi/influxdb-cloud-v2/paths/
   ```

2. **Both formats generated:**
   ```bash
   ls -l static/openapi/influxdb-cloud-v2/paths/*.{yaml,json}
   ```

3. **Article data created:**
   ```bash
   cat data/article-data/influxdb/cloud-v2/articles.yml
   cat data/article-data/influxdb/cloud-v2/articles.json
   ```

4. **Hugo pages generated:**
   ```bash
   ls -l content/influxdb/cloud/api/v2/
   ```

## Troubleshooting

### TypeScript Compilation Errors

```bash
# Clean and rebuild
rm -rf api-docs/scripts/dist
yarn build:api-scripts
```

### Missing Type Definitions

```bash
cd api-docs/scripts/openapi-paths-to-hugo-data
yarn add --dev @types/js-yaml @types/node
```

### Spec File Not Found

Make sure to run `getswagger.sh` first:

```bash
cd api-docs
./getswagger.sh cloud-v2 -B
```

### Path Grouping Issues

The script groups paths by their first 3-4 segments. If you need different grouping:

1. Edit `writePathOpenapis()` in `openapi-paths-to-hugo-data/index.ts`
2. Modify the `key.slice(0, 4)` logic
3. Rebuild: `yarn build:api-scripts`

## Migration from JavaScript

The original JavaScript files are preserved for reference:

- `api-docs/scripts/generate-openapi-articles.js` (original)
- `api-docs/scripts/openapi-paths-to-hugo-data/index.js` (original)

### Key Improvements

1. **TypeScript**: Full type safety and IDE support
2. **Dual Formats**: Generates both YAML and JSON
3. **All Products**: Includes all 7 InfluxDB products
4. **Better Errors**: Clear error messages with product validation
5. **CLI Arguments**: Support for processing specific products
6. **Comprehensive Logging**: Progress indicators and status messages

## Related Documentation

- **API Docs README**: `api-docs/README.md` - Complete API documentation workflow
- **OpenAPI Plugins**: `api-docs/openapi/plugins/` - Custom processing plugins
- **Hugo Data to Pages**: `hugo-data-to-pages/` - Page generation from data files

## Examples

### Generate Only Cloud Products

```bash
yarn build:api-pages:product cloud-v2 cloud-dedicated cloud-serverless
```

### Generate Only InfluxDB 3 Products

```bash
yarn build:api-pages:product influxdb3-core influxdb3-enterprise
```

### Process Single Product Manually

```bash
# Compile first
yarn build:api-scripts

# Run for specific product
node api-docs/scripts/dist/generate-openapi-articles.js oss-v2
```

## API Reference

### generateHugoData(options)

Generate Hugo data files from an OpenAPI specification.

**Parameters:**

- `options.specFile` (string) - Path to the OpenAPI spec file
- `options.dataOutPath` (string) - Output path for OpenAPI path fragments
- `options.articleOutPath` (string) - Output path for article metadata

**Example:**

```javascript
const { generateHugoData } = require('./api-docs/scripts/dist/openapi-paths-to-hugo-data/index.js');

generateHugoData({
  specFile: 'api-docs/influxdb/cloud/v2/ref.yml',
  dataOutPath: 'static/openapi/influxdb-cloud-v2/paths',
  articleOutPath: 'data/article-data/influxdb/cloud-v2'
});
```

### productConfigs

Map of product configurations exported from `generate-openapi-articles.ts`.

**Type:**

```typescript
type ProductConfig = {
  specFile: string;      // Path to OpenAPI spec
  pagesDir: string;      // Hugo content directory
  description?: string;  // Product description
};

const productConfigs: Record<string, ProductConfig>;
```

**Usage:**

```javascript
const { productConfigs } = require('./api-docs/scripts/dist/generate-openapi-articles.js');

console.log(productConfigs['cloud-v2']);
// {
//   specFile: 'api-docs/cloud/v2/ref.yml',
//   pagesDir: 'content/influxdb/cloud/api/v2',
//   description: 'InfluxDB Cloud (v2 API)'
// }
```

## License

Same as parent docs-v2 repository (MIT).
