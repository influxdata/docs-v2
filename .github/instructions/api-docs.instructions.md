---
applyTo: "api-docs/**/*.md, api-docs/**/*.yml, api-docs/**/*.yaml"
---

# InfluxDB API Documentation

**Complete guide**: [api-docs/README.md](../../api-docs/README.md)

API documentation uses OpenAPI specifications processed by a build pipeline, not Hugo shortcodes.

## Workflow

1. Edit YAML files in `/api-docs/`
2. Generate HTML documentation locally:
   ```sh
   cd api-docs
   sh generate-api-docs.sh
   ```
3. Test generated documentation
4. Commit YAML changes (HTML is gitignored)

## Key files per product

| File                          | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| `{product-name}-openapi.yaml` | Main API spec (fetched and bundled by `getswagger.sh`)   |
| `tags.yml`                    | Tag names, descriptions, `x-traitTag`, `x-related` links |
| `content/info.yml`            | Info overlay (title, description, version)               |
| `content/servers.yml`         | Server URL overlay                                       |
| `.config.yml`                 | Product config (API keys, spec paths, Hugo output dirs)  |

## Writing tag content

Each product has a colocated `tags.yml` that configures tag descriptions and
related links. See [How to add tag content](../../api-docs/README.md#how-to-add-tag-content-or-describe-a-group-of-paths)
in the API docs README for the full format reference, field descriptions,
tag categories, and cross-product consistency guidelines.

## Build pipeline

```
getswagger.sh          → fetch and bundle specs with @redocly/cli
post-process-specs.ts  → apply info/servers overlays + tag configs
generate-openapi-articles.ts → generate Hugo pages + copy specs to static/openapi/
```

## Tools

- **@redocly/cli**: Lints, bundles, and resolves `$ref`s in multi-file specs
- **post-process-specs.ts**: Applies content overlays and tag configs
- **generate-openapi-articles.ts**: Generates Hugo content pages and static spec downloads

For complete documentation workflow, see [api-docs/README.md](../../api-docs/README.md).
